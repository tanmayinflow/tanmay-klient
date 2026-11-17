// Legacy user IDs are lossy email slugs. Their verified address must outlive
// membership, since private D1/R2 data intentionally survives removing access.
const prepared = new WeakMap();
const normalized = value => String(value || '').trim().toLowerCase();

export function ensureClientIdentities(db) {
  let work = prepared.get(db);
  if (!work) {
    work = db.batch([
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
    ]).catch(error => { prepared.delete(db); throw error; });
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
      ON CONFLICT(user_id) DO NOTHING`).bind(userId,email,now,userId,email),
  ]);
  return !!(await db.prepare(`SELECT 1 AS ok FROM members m JOIN client_identity_bindings i ON i.user_id=m.user_id
    WHERE m.user_id=? AND lower(trim(m.email))=? AND i.email=?`).bind(userId,email,email).first());
}
