// One ledger in the client D1 database covers BOTH private R2 buckets.
// Reservations deliberately survive ambiguous R2 failures. Availability may
// decrease, but an unconfirmed write must never create uncounted capacity.
export const STORAGE_LIMITS = Object.freeze({ globalBytes: 9_500_000_000, freeBytes: 10_000_000_000, dailyA: 28_000, dailyB: 280_000, defaultClientBytes: 500_000_000 });
const schemaReady = new WeakMap();
const fail = (code, status = 503) => Object.assign(new Error(code), { code, status });
const day = () => new Date().toISOString().slice(0, 10);
const validBytes = value => Number.isSafeInteger(value) && value >= 0 && value <= STORAGE_LIMITS.globalBytes;
export const STORAGE_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS storage_budget_pool (id INTEGER PRIMARY KEY CHECK(id=1), used INTEGER NOT NULL DEFAULT 0, reserved INTEGER NOT NULL DEFAULT 0, client_default INTEGER NOT NULL DEFAULT 500000000)`,
  `INSERT OR IGNORE INTO storage_budget_pool(id) VALUES(1)`,
  `CREATE TABLE IF NOT EXISTS storage_budget_users (id TEXT PRIMARY KEY, used INTEGER NOT NULL DEFAULT 0, reserved INTEGER NOT NULL DEFAULT 0, ceiling INTEGER NOT NULL, personal INTEGER)`,
  `CREATE TABLE IF NOT EXISTS storage_budget_buckets (id TEXT PRIMARY KEY, ready INTEGER NOT NULL DEFAULT 0, cursor TEXT, token TEXT NOT NULL DEFAULT '', lease_until INTEGER NOT NULL DEFAULT 0)`,
  `INSERT OR IGNORE INTO storage_budget_buckets(id) VALUES('main'),('client')`,
  `CREATE TABLE IF NOT EXISTS storage_budget_objects (bucket TEXT NOT NULL, key TEXT NOT NULL, user_id TEXT NOT NULL, bytes INTEGER NOT NULL, PRIMARY KEY(bucket,key))`,
  `CREATE TABLE IF NOT EXISTS storage_budget_reservations (bucket TEXT NOT NULL, key TEXT NOT NULL, user_id TEXT NOT NULL, bytes INTEGER NOT NULL, token TEXT NOT NULL, PRIMARY KEY(bucket,key))`,
  `CREATE TABLE IF NOT EXISTS storage_budget_ops (day TEXT PRIMARY KEY, a INTEGER NOT NULL DEFAULT 0, b INTEGER NOT NULL DEFAULT 0)`,
  ...['objects', 'reservations'].flatMap(table => {
    const field = table === 'objects' ? 'used' : 'reserved';
    return [
      `CREATE TRIGGER IF NOT EXISTS storage_budget_${table}_add AFTER INSERT ON storage_budget_${table} BEGIN UPDATE storage_budget_pool SET ${field}=${field}+NEW.bytes WHERE id=1; UPDATE storage_budget_users SET ${field}=${field}+NEW.bytes WHERE id=NEW.user_id; END`,
      `CREATE TRIGGER IF NOT EXISTS storage_budget_${table}_remove AFTER DELETE ON storage_budget_${table} BEGIN UPDATE storage_budget_pool SET ${field}=${field}-OLD.bytes WHERE id=1; UPDATE storage_budget_users SET ${field}=${field}-OLD.bytes WHERE id=OLD.user_id; END`,
    ];
  }),
];
export async function ensureStorageBudget(db) {
  if (!db) throw fail('storage-unavailable');
  let work = schemaReady.get(db);
  if (!work) {
    work = db.batch(STORAGE_SCHEMA.map(sql => db.prepare(sql))).catch(error => { schemaReady.delete(db); throw error; });
    schemaReady.set(db, work);
  }
  await work;
}
async function ensureUser(db, id) {
  await db.prepare(`INSERT OR IGNORE INTO storage_budget_users(id,ceiling) SELECT ?, CASE WHEN ?='main:primary' THEN 5000000000 ELSE client_default END FROM storage_budget_pool WHERE id=1`).bind(id, id).run();
}
async function consume(db, kind) {
  await ensureStorageBudget(db);
  const date = day(), cap = kind === 'a' ? STORAGE_LIMITS.dailyA : STORAGE_LIMITS.dailyB;
  const result = await db.prepare(`INSERT INTO storage_budget_ops(day,${kind}) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET ${kind}=${kind}+1 WHERE ${kind}<?`).bind(date, cap).run();
  if (result.meta.changes !== 1) throw fail('storage-operations', 429);
}
const objectUser = (bucket, key) => {
  const match = /^files\/([^/]+)\//.exec(key);
  return bucket === 'main' && match?.[1] === 'primary' ? 'main:primary' : bucket === 'client' && match ? `client:${match[1]}` : `${bucket}:system`;
};

// Bootstrap one bounded page. Neither bucket accepts uploads until both full
// inventories are committed. Partial pages are restartable without double count.
async function bootstrap(db, bucket, raw) {
  await ensureStorageBudget(db);
  const row = await db.prepare('SELECT * FROM storage_budget_buckets WHERE id=?').bind(bucket).first();
  if (row.ready) return;
  const token = crypto.randomUUID();
  const acquired = await db.prepare("UPDATE storage_budget_buckets SET token=?,lease_until=? WHERE id=? AND (token='' OR lease_until<?) AND ready=0").bind(token,Date.now()+60_000,bucket,Date.now()).run();
  if (acquired.meta.changes !== 1) throw fail('storage-initializing');
  // If any operation fails, release only the inventory lock. No writes were
  // allowed while initializing, so rereading this page cannot lose new objects.
  try {
    await consume(db, 'a');
    const page = await raw.list({ limit: 500, cursor: row.cursor || undefined });
    if (!Array.isArray(page.objects) || (page.truncated && (!page.cursor || page.cursor === row.cursor))) throw fail('storage-inventory');
    const records = page.objects.map(o => {
      if (!o.key || !Number.isSafeInteger(o.size) || o.size < 0) throw fail('storage-inventory');
      return { key: o.key, bytes: o.size, user: objectUser(bucket, o.key) };
    });
    const encoded = JSON.stringify(records);
    await db.batch([
      db.prepare(`INSERT OR IGNORE INTO storage_budget_users(id,ceiling) SELECT json_extract(value,'$.user'), CASE WHEN json_extract(value,'$.user')='main:primary' THEN 5000000000 ELSE (SELECT client_default FROM storage_budget_pool WHERE id=1) END FROM json_each(?) WHERE EXISTS(SELECT 1 FROM storage_budget_buckets WHERE id=? AND token=?)`).bind(encoded,bucket,token),
      db.prepare(`INSERT OR IGNORE INTO storage_budget_objects(bucket,key,user_id,bytes) SELECT ?,json_extract(value,'$.key'),json_extract(value,'$.user'),json_extract(value,'$.bytes') FROM json_each(?) WHERE EXISTS(SELECT 1 FROM storage_budget_buckets WHERE id=? AND token=?)`).bind(bucket, encoded,bucket,token),
      db.prepare("UPDATE storage_budget_buckets SET cursor=?,ready=?,token='' WHERE id=? AND token=?").bind(page.truncated ? page.cursor : null, page.truncated ? 0 : 1, bucket, token),
    ]);
  } catch (error) {
    await db.prepare("UPDATE storage_budget_buckets SET token='' WHERE id=? AND token=?").bind(bucket, token).run();
    throw error;
  }
}
async function reserve(db, bucket, key, user, bytes, removal = false) {
  await ensureUser(db, user);
  const token = crypto.randomUUID();
  const result = await db.prepare(`INSERT OR IGNORE INTO storage_budget_reservations(bucket,key,user_id,bytes,token)
    SELECT ?,?,?,MAX(0,?-COALESCE(o.bytes,0)),? FROM storage_budget_pool p JOIN storage_budget_users u ON u.id=?
    LEFT JOIN storage_budget_objects o ON o.bucket=? AND o.key=?
    WHERE p.id=1 AND (SELECT count(*) FROM storage_budget_buckets WHERE ready=1)=2
    AND (?=1 OR (p.used+p.reserved+MAX(0,?-COALESCE(o.bytes,0))<=? AND u.used+u.reserved+MAX(0,?-COALESCE(o.bytes,0))<=MIN(u.ceiling,COALESCE(u.personal,u.ceiling))))`)
    .bind(bucket,key,user,bytes,token,user,bucket,key,removal ? 1 : 0,bytes,STORAGE_LIMITS.globalBytes,bytes).run();
  if (result.meta.changes !== 1) {
    const ready=await db.prepare('SELECT count(*) AS n FROM storage_budget_buckets WHERE ready=1').first();
    if (ready.n !== 2) throw fail('storage-initializing');
    const pending=await db.prepare('SELECT token FROM storage_budget_reservations WHERE bucket=? AND key=?').bind(bucket,key).first();
    if (pending) throw fail('storage-pending',409);
    const own=await db.prepare('SELECT used,reserved,ceiling,personal FROM storage_budget_users WHERE id=?').bind(user).first();
    if (own.used+own.reserved+bytes>Math.min(own.ceiling,own.personal??own.ceiling)) throw fail('storage-user-limit',409);
    throw fail('storage-capacity',409);
  }
  return token;
}
async function complete(db, bucket, key, user, bytes, token, remove = false) {
  const statements = [db.prepare('DELETE FROM storage_budget_objects WHERE bucket=? AND key=?').bind(bucket,key)];
  if (!remove) statements.push(db.prepare('INSERT INTO storage_budget_objects(bucket,key,user_id,bytes) VALUES(?,?,?,?)').bind(bucket,key,user,bytes));
  statements.push(db.prepare('DELETE FROM storage_budget_reservations WHERE bucket=? AND key=? AND token=?').bind(bucket,key,token));
  await db.batch(statements);
}
export function guardedStorage({ db, raw, bucket, request }) {
  let initialized;
  const init = () => initialized ||= bootstrap(db, bucket, raw);
  return {
    async initialize() { await init(); },
    async list(options) { await init(); await consume(db, 'a'); return raw.list(options); },
    async get(key, options) { await init(); await consume(db, 'b'); return raw.get(key, options); },
    async head(key) { await init(); await consume(db, 'b'); return raw.head(key); },
    async put(key, body, options) {
      await init();
      const size = body === request?.body ? Number(request.headers.get('Content-Length')) : typeof body === 'string' ? new TextEncoder().encode(body).length : body?.byteLength ?? body?.size;
      if (!Number.isSafeInteger(size) || size < 1) throw fail('media-length-required', 411);
      const user = objectUser(bucket,key);
      await consume(db, 'a');
      const token = await reserve(db,bucket,key,user,size);
      const result = await raw.put(key,body,{...options,storageClass:'Standard'});
      if (!result) throw fail('storage-write-unconfirmed');
      // HTTP uploads retain Cloudflare's known-length stream. If a future
      // caller supplies an inconsistent receipt, preserve the reservation.
      if (Number.isFinite(result.size) && result.size !== size) throw fail('storage-write-unconfirmed');
      await complete(db,bucket,key,user,size,token);
      return result;
    },
    async delete(key) {
      await init();
      if (typeof key !== 'string') throw fail('storage-key', 400);
      const user = objectUser(bucket,key), token = await reserve(db,bucket,key,user,0,true);
      await raw.delete(key);
      await complete(db,bucket,key,user,0,token,true);
    },
  };
}
const accountRow = row => ({ userId:row.id,usedBytes:row.used,reservedBytes:row.reserved,limitBytes:row.ceiling,personalLimitBytes:row.personal,effectiveLimitBytes:Math.min(row.ceiling,row.personal ?? row.ceiling) });
export async function handleStorageBudget(request, { db, files, role, userId }) {
  const ownId = role === 'main' ? 'main:primary' : `client:${userId}`;
  await files.initialize();
  await ensureUser(db, ownId);
  if (request.method === 'PUT') {
    let value;
    try { value = await request.json(); } catch { return Response.json({ok:false,code:'bad-json'},{status:400}); }
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw fail('storage-settings',400);
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === 'personalLimitBytes') {
      const ceiling = await db.prepare('SELECT ceiling FROM storage_budget_users WHERE id=?').bind(ownId).first();
      if (value.personalLimitBytes !== null && (!validBytes(value.personalLimitBytes) || value.personalLimitBytes > ceiling.ceiling)) throw fail('storage-settings',400);
      await db.prepare('UPDATE storage_budget_users SET personal=? WHERE id=?').bind(value.personalLimitBytes,ownId).run();
    } else if (role === 'main' && keys.length === 1 && keys[0] === 'defaultClientBytes' && validBytes(value.defaultClientBytes)) {
      await db.prepare('UPDATE storage_budget_pool SET client_default=? WHERE id=1').bind(value.defaultClientBytes).run();
    } else if (role === 'main' && keys.length === 2 && keys.includes('userId') && keys.includes('limitBytes') && validBytes(value.limitBytes)) {
      if (value.userId !== 'main:primary') {
        if (typeof value.userId !== 'string' || !value.userId.startsWith('client:')) throw fail('storage-settings',400);
        const member = await db.prepare('SELECT user_id FROM members WHERE user_id=?').bind(value.userId.slice(7)).first();
        if (!member) throw fail('storage-user-missing',404);
      }
      await ensureUser(db,value.userId);
      await db.prepare('UPDATE storage_budget_users SET ceiling=? WHERE id=?').bind(value.limitBytes,value.userId).run();
    } else throw fail('storage-settings',role === 'main' ? 400 : 403);
  } else if (request.method !== 'GET') throw fail('method-not-allowed',405);
  const pool = await db.prepare('SELECT * FROM storage_budget_pool WHERE id=1').first();
  const buckets = (await db.prepare('SELECT id,ready FROM storage_budget_buckets ORDER BY id').all()).results;
  const own = await db.prepare('SELECT * FROM storage_budget_users WHERE id=?').bind(ownId).first();
  const date = day(), operations = await db.prepare('SELECT a,b FROM storage_budget_ops WHERE day=?').bind(date).first();
  const result = { ok:true,role,ready:buckets.every(row=>row.ready===1),limits:{...STORAGE_LIMITS,defaultClientBytes:pool.client_default},pool:{usedBytes:pool.used,reservedBytes:pool.reserved},own:accountRow(own),operations:{day:date,a:operations?.a||0,b:operations?.b||0},buckets:buckets.map(row=>({name:row.id,ready:row.ready===1})) };
  if (role === 'main') {
    // Only existing coach-visible metadata. No journal/state documents are read.
    let members=[];
    try { members=(await db.prepare('SELECT user_id,name,email FROM members').all()).results; } catch (error) { if (!/no such table/i.test(error.message)) throw error; }
    if (members.length) await db.prepare(`INSERT OR IGNORE INTO storage_budget_users(id,ceiling) SELECT 'client:'||user_id,(SELECT client_default FROM storage_budget_pool WHERE id=1) FROM members`).run();
    const users=(await db.prepare('SELECT * FROM storage_budget_users ORDER BY id').all()).results;
    result.accounts=users.filter(row=>row.id==='main:primary'||members.some(member=>`client:${member.user_id}`===row.id)).map(row=>{const member=members.find(member=>`client:${member.user_id}`===row.id);return {...accountRow(row),name:member?.name||'',email:member?.email||''};});
  }
  return Response.json(result,{headers:{'Cache-Control':'no-store, private'}});
}
export function storageBudgetFailure(error) {
  return Response.json({ok:false,code:error?.code||'storage-unavailable',error:'Úložiště teď nemůže operaci bezpečně dokončit. Data v zařízení zachovej a zkontroluj Nastavení → Data.'},{status:error?.status||503,headers:{'Cache-Control':'no-store'}});
}
