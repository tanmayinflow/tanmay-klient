// Legacy user IDs are lossy email slugs. Their verified address must outlive
// membership, since private D1/R2 data intentionally survives removing access.
const prepared = new WeakMap();
const sharingGuards = new WeakMap();
const normalized = value => String(value || '').trim().toLowerCase();
const revocationsTable = `CREATE TABLE IF NOT EXISTS client_access_revocations (
  user_id TEXT PRIMARY KEY, blocked INTEGER NOT NULL CHECK(blocked IN (0,1))
)`;

// Install when both the membership and the independently created Spolu tables exist.
// SQLite also enforces this for overlapping requests and older Workers during rollout.
export async function protectRevokedSharing(db) {
  if (sharingGuards.has(db)) return sharingGuards.get(db);
  // A fresh, standalone Spolu installation has no membership yet. The first
  // identity migration calls this again immediately after creating bindings.
  const memberships=await db.prepare("SELECT 1 AS ready FROM sqlite_master WHERE type='table' AND name='client_identity_bindings'").first();
  if (!memberships) return;
  const columns = (await db.prepare('PRAGMA table_info(together_links)').all()).results;
  if (!columns.some(row => row.name === 'partner_scopes')) return;
  const revoke = `UPDATE together_links SET status='revoked', scopes='[]', partner_scopes='[]',
    token_hash=NULL, partner=NULL, revision=revision+1 WHERE status<>'revoked' AND`;
  const blocked = `EXISTS(SELECT 1 FROM client_access_revocations WHERE blocked=1
    AND ('client:'||user_id=NEW.owner OR 'client:'||user_id=NEW.partner))`;
  const work = db.batch([
    db.prepare(revocationsTable),
    ...['INSERT','UPDATE'].map(event => db.prepare(`CREATE TRIGGER IF NOT EXISTS client_close_sharing_${event}
      AFTER ${event} ON client_access_revocations WHEN NEW.blocked=1 BEGIN
      ${revoke} (owner='client:'||NEW.user_id OR partner='client:'||NEW.user_id); END`)),
    ...['INSERT','UPDATE'].map(event => db.prepare(`CREATE TRIGGER IF NOT EXISTS client_guard_sharing_${event}
      BEFORE ${event} ON together_links WHEN NEW.status<>'revoked' AND ${blocked}
      BEGIN SELECT RAISE(ABORT,'client_access_revoked'); END`)),
    db.prepare(`${revoke} EXISTS(SELECT 1 FROM client_access_revocations r WHERE r.blocked=1
      AND ('client:'||r.user_id=together_links.owner OR 'client:'||r.user_id=together_links.partner))`),
  ]).catch(error => { sharingGuards.delete(db); throw error; });
  sharingGuards.set(db, work);
  return work;
}

export async function restoreClientAccess(db, userId) {
  await ensureClientIdentities(db);
  const result = await db.prepare('UPDATE client_access_revocations SET blocked=0 WHERE user_id=? AND blocked=1').bind(userId).run();
  return (result.meta?.changes ?? result.changes) > 0;
}

export async function clientAccessRevoked(db,userId) {
  await ensureClientIdentities(db);
  return !!await db.prepare('SELECT 1 AS blocked FROM client_access_revocations WHERE user_id=? AND blocked=1').bind(userId).first();
}

export async function allowJoinAttempt(db,userId,now=Date.now()) {
  const windowMs=15*60000;
  const [,,result]=await db.batch([
    db.prepare('DELETE FROM client_join_attempts WHERE until_ms<=?').bind(now),
    db.prepare(`INSERT INTO client_join_attempts(user_id,attempts,until_ms) VALUES(?,1,?)
      ON CONFLICT(user_id) DO UPDATE SET attempts=attempts+1 WHERE attempts<10`).bind(userId,now+windowMs),
    db.prepare('SELECT changes() AS accepted'),
  ]);
  return result.results[0].accepted>0;
}

export function ensureClientIdentities(db) {
  let work = prepared.get(db);
  if (!work) {
    work = db.batch([
      db.prepare(revocationsTable),
      db.prepare('CREATE TABLE IF NOT EXISTS client_join_attempts(user_id TEXT PRIMARY KEY,attempts INTEGER NOT NULL,until_ms INTEGER NOT NULL)'),
      db.prepare('CREATE INDEX IF NOT EXISTS client_join_attempts_expiry ON client_join_attempts(until_ms)'),
      db.prepare(`CREATE TABLE IF NOT EXISTS client_identity_bindings (
        user_id TEXT PRIMARY KEY, email TEXT NOT NULL
      )`),
      db.prepare(`INSERT INTO client_identity_bindings (user_id,email)
        SELECT user_id,lower(trim(email)) FROM members WHERE email IS NOT NULL
        ON CONFLICT(user_id) DO NOTHING`),
      // Older Workers cannot claim an unbound slug during rollout. The new
      // join claims its verified binding immediately before this INSERT.
      db.prepare(`CREATE TRIGGER IF NOT EXISTS client_identity_insert_requires_binding
        BEFORE INSERT ON members
        WHEN NOT EXISTS(SELECT 1 FROM client_identity_bindings
          WHERE user_id=NEW.user_id AND email=lower(trim(NEW.email)))
        BEGIN SELECT RAISE(ABORT,'client_identity_conflict'); END`),
      db.prepare(`CREATE TRIGGER IF NOT EXISTS client_identity_after_insert
        AFTER INSERT ON members BEGIN
          INSERT INTO client_identity_bindings (user_id,email)
          VALUES (NEW.user_id,lower(trim(NEW.email))) ON CONFLICT(user_id) DO NOTHING;
        END`),
      db.prepare(`CREATE TRIGGER IF NOT EXISTS client_identity_before_delete
        BEFORE DELETE ON members BEGIN
          INSERT INTO client_identity_bindings (user_id,email)
          VALUES (OLD.user_id,lower(trim(OLD.email))) ON CONFLICT(user_id) DO NOTHING;
        END`),
      db.prepare(`CREATE TRIGGER IF NOT EXISTS client_identity_before_update
        BEFORE UPDATE OF user_id,email ON members
        WHEN OLD.user_id<>NEW.user_id OR lower(trim(OLD.email))<>lower(trim(NEW.email))
        BEGIN SELECT RAISE(ABORT,'client_identity_conflict'); END`),
      db.prepare(`INSERT INTO client_access_revocations(user_id,blocked)
        SELECT user_id,1 FROM client_identity_bindings i WHERE NOT EXISTS
        (SELECT 1 FROM members m WHERE m.user_id=i.user_id) ON CONFLICT(user_id) DO NOTHING`),
      db.prepare(`CREATE TRIGGER IF NOT EXISTS client_revoke_on_membership_removal
        AFTER DELETE ON members BEGIN INSERT INTO client_access_revocations(user_id,blocked)
        VALUES(OLD.user_id,1) ON CONFLICT(user_id) DO UPDATE SET blocked=1; END`),
      db.prepare(`CREATE TRIGGER IF NOT EXISTS client_prevent_revoked_rejoin
        BEFORE INSERT ON members WHEN EXISTS(SELECT 1 FROM client_access_revocations
          WHERE user_id=NEW.user_id AND blocked=1) BEGIN SELECT RAISE(ABORT,'client_access_revoked'); END`),
    ]).then(()=>protectRevokedSharing(db)).catch(error => { prepared.delete(db); throw error; });
    prepared.set(db, work);
  }
  return work;
}

export async function clientIdentityConflict(db, userId, email) {
  await ensureClientIdentities(db);
  const row = await db.prepare(`SELECT email FROM client_identity_bindings WHERE user_id=?
    UNION ALL SELECT lower(trim(email)) AS email FROM members WHERE user_id=?`).bind(userId,userId).all();
  return (row.results || []).some(binding => binding.email !== normalized(email));
}

async function unboundDataQuery(db,userId) {
  const names=new Set((await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()).results.map(row=>row.name));
  const parts=[],args=[],actor=`client:${userId}`;
  const add=(table,column,value)=>{if(names.has(table)){parts.push(`SELECT 1 FROM ${table} WHERE ${column}=?`);args.push(value);}};
  for(const table of ['state','state_documents','state_chunks','state_uploads','state_upload_parts','state_transport_receipts','plans','plan_receipts','goals','sources','client_custom_exercises','client_exercise_policy','client_module_commands'])add(table,'user_id',userId);
  for(const table of ['personal_profiles','personal_calendar_connections','personal_calendar_nonces','together_people','together_calendars','together_answers','together_reflections'])add(table,'actor',actor);
  add('together_links','owner',actor);add('together_links','partner',actor);
  add('booking_clients','account_user_id',userId);
  return {sql:parts.length?`EXISTS(${parts.join(' UNION ALL ')})`:'0',args};
}

export async function registerClientIdentity(db, userId, email, {now=Date.now(),files}={}) {
  await ensureClientIdentities(db);
  email = normalized(email);
  const binding=await db.prepare('SELECT email FROM client_identity_bindings WHERE user_id=?').bind(userId).first();
  if(binding&&binding.email!==email)return false;
  // Historical access removals may predate the binding table. No email can be
  // proven from the slug alone: keep those orphaned records closed, not adopted.
  const unbound=binding?{sql:'0',args:[]}:await unboundDataQuery(db,userId);
  if(!binding&&files&&(await files.list({prefix:`files/${userId}/`,limit:1})).objects.length)return false;
  // A single D1 transaction chooses the winner of concurrent first joins.
  // The losing address never creates membership, even if its earlier check passed.
  await db.batch([
    db.prepare(`INSERT INTO client_identity_bindings (user_id,email) SELECT ?,? WHERE NOT ${unbound.sql}
      ON CONFLICT(user_id) DO NOTHING`).bind(userId,email,...unbound.args),
    db.prepare(`INSERT INTO members (user_id,email,joined_at)
      SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM client_identity_bindings WHERE user_id=? AND email=?)
      AND NOT EXISTS(SELECT 1 FROM client_access_revocations WHERE user_id=? AND blocked=1)
      ON CONFLICT(user_id) DO NOTHING`).bind(userId,email,now,userId,email,userId),
  ]);
  return !!(await db.prepare(`SELECT 1 AS ok FROM members m JOIN client_identity_bindings i ON i.user_id=m.user_id
    WHERE m.user_id=? AND lower(trim(m.email))=? AND i.email=?`).bind(userId,email,email).first());
}
