// Server-only, read-only export. The Worker supplies the authenticated actor.
// This deliberately never reads another person's state, journal, cycle history,
// OAuth credentials, sessions or private coach notes into a client export.
const response = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store, private', Vary: 'Cookie', 'X-Content-Type-Options': 'nosniff' } });
const CLIENT_BOOKING_COLUMNS = 'id,client_id,service_id,location_id,starts_at_utc,ends_at_utc,timezone,local_date,status,confirmation_mode,credit_cost_units,client_note,meeting_url,plan_id,workout_template_id,session_instance_id,version';
const CLIENT_PACKAGE_COLUMNS = 'id,client_id,package_definition_id,name_snapshot,purchased_units,valid_from,expires_at,status';
export async function exportAccountRecords({ db, actor, userId, role }) {
  if (!db || !actor || !userId || !['main', 'client'].includes(role)) throw new Error('backup-account');
  const names = new Set((await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all()).results.map(row => row.name));
  const sections = {}, specs = [];
  const select = (name, table, query, args = []) => {
    if (!names.has(table)) { sections[name] = []; return; }
    specs.push({ name, statement: db.prepare(query).bind(...args) });
  };
  for (const table of ['personal_profiles', 'together_people', 'together_calendars']) {
    select(table, table, `SELECT * FROM ${table} WHERE actor = ?`, [actor]);
  }
  select('together_links', 'together_links', 'SELECT id,owner,partner,status,scopes,partner_scopes,revision FROM together_links WHERE owner = ? OR partner = ?', [actor, actor]);
  for (const table of ['together_answers', 'together_reflections']) select(table, table, `SELECT * FROM ${table} WHERE actor = ?`, [actor]);
  if (names.has('together_links')) {
    for (const table of ['together_plans', 'together_questions']) select(table, table,
      `SELECT * FROM ${table} WHERE link_id IN (SELECT id FROM together_links WHERE (owner = ? OR partner = ?) AND status = 'active')`, [actor, actor]);
    if (role === 'main') select('together_pages', 'together_pages', "SELECT * FROM together_pages WHERE link_id IN (SELECT id FROM together_links WHERE partner = ? AND status = 'active')", [actor]);
  }
  for (const table of ['plans', 'goals', 'sources']) select(table, table, `SELECT * FROM ${table}` + (role === 'client' ? ' WHERE user_id = ?' : ''), role === 'client' ? [userId] : []);
  select('members', 'members', 'SELECT user_id,email,joined_at,name,share,modules FROM members' + (role === 'client' ? ' WHERE user_id = ?' : ''), role === 'client' ? [userId] : []);
  if (role === 'main') {
    for (const table of ['booking_clients', 'booking_services', 'booking_locations', 'booking_service_locations', 'booking_availability_rules', 'booking_availability_overrides', 'booking_blocks', 'bookings', 'package_definitions', 'package_definition_services', 'client_packages', 'client_package_services', 'credit_ledger']) {
      select(table, table, `SELECT * FROM ${table}`);
    }
  } else if (names.has('booking_clients')) {
    select('booking_clients', 'booking_clients', 'SELECT id,account_user_id,name,email,timezone,active FROM booking_clients WHERE account_user_id = ?', [userId]);
    for (const [table, columns] of [['bookings', CLIENT_BOOKING_COLUMNS], ['client_packages', CLIENT_PACKAGE_COLUMNS], ['credit_ledger', 'id,client_id,client_package_id,booking_id,kind,units,created_at']]) {
      select(table, table, `SELECT ${columns} FROM ${table} WHERE client_id IN (SELECT id FROM booking_clients WHERE account_user_id = ?)`, [userId]);
    }
    if (names.has('bookings')) {
      select('booking_services', 'booking_services', 'SELECT id,name_cs,name_en,duration_min,cancel_before_min,credit_cost_units,price_minor,currency FROM booking_services WHERE id IN (SELECT service_id FROM bookings WHERE client_id IN (SELECT id FROM booking_clients WHERE account_user_id = ?))', [userId]);
      select('booking_locations', 'booking_locations', 'SELECT id,type,name_cs,name_en,address,map_url,instructions_cs,instructions_en FROM booking_locations WHERE id IN (SELECT location_id FROM bookings WHERE client_id IN (SELECT id FROM booking_clients WHERE account_user_id = ?))', [userId]);
    }
  }
  // D1 executes the reads as a single batch. Any failure fails the whole export;
  // an inaccessible table must never be silently represented as an empty one.
  const rows = specs.length ? await db.batch(specs.map(spec => spec.statement)) : [];
  for (let i = 0; i < specs.length; i++) {
    if (rows[i]?.success === false || !Array.isArray(rows[i]?.results)) throw new Error('backup-query');
    sections[specs[i].name] = rows[i].results;
  }
  return { format: 'tanmay-account-records-v1', role, exportedAt: new Date().toISOString(), sections,
    excluded: ['Authentication credentials and OAuth tokens', 'Other people’s private documents', 'Revoked shared projections', 'Operational locks, delivery jobs and server audit logs'] };
}

export async function handleAccountBackup(request, options) {
  if (request.method !== 'GET') return response({ ok: false, error: 'method' }, 405);
  try { return response({ ok: true, account: await exportAccountRecords(options) }); }
  catch { return response({ ok: false, error: 'backup-unavailable' }, 503); }
}
