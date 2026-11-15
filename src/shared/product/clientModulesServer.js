import { CLIENT_ALWAYS, CLIENT_OPTIONAL, migrateClientModules } from './roles.js';
import { moduleCommandRevisions } from './clientModules.js';

const schemas = new WeakMap();
export async function ensureClientModuleCommands(db) {
  let work = schemas.get(db);
  if (!work) {
    work = db.prepare(`CREATE TABLE IF NOT EXISTS client_module_commands (
      user_id TEXT NOT NULL, module TEXT NOT NULL, enabled INTEGER NOT NULL,
      revision TEXT NOT NULL, updated_at INTEGER NOT NULL, applied_at INTEGER,
      PRIMARY KEY(user_id,module))`).run().catch(error => { schemas.delete(db); throw error; });
    schemas.set(db, work);
  }
  await work;
}

const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store, private' } });
async function readCommands(db, userId) {
  const rows = (await db.prepare('SELECT module,enabled,revision,updated_at,applied_at FROM client_module_commands WHERE user_id=? ORDER BY module').bind(userId).all()).results || [];
  return rows.filter(row => CLIENT_OPTIONAL.includes(row.module)).map(row => ({ ...row, enabled: row.enabled === 1, applied: row.applied_at != null }));
}

// The caller supplies its verified actor/subject. The client route never accepts
// a target account from a URL or body, and cannot issue coach commands.
export async function handleClientModules(request, { db, userId, coach = false }) {
  if (!db) return reply({ ok: false, code: 'client-database-unavailable' }, 503);
  if (request.method !== 'GET' && !(coach && request.method === 'PUT')) return reply({ ok: false, code: 'method' }, 405);
  const member = await db.prepare('SELECT modules FROM members WHERE user_id=?').bind(userId).first();
  if (!member) return reply({ ok: false, code: 'not-a-member' }, 404);
  let body;
  if (request.method === 'PUT') {
    try { body = await request.json(); } catch { return reply({ ok: false, code: 'bad-json' }, 400); }
    if (!body || !CLIENT_OPTIONAL.includes(body.module) || typeof body.enabled !== 'boolean' ||
        Object.keys(body).some(key => key !== 'module' && key !== 'enabled')) return reply({ ok: false, code: 'invalid-module' }, 400);
  }
  await ensureClientModuleCommands(db);
  if (body) {
    await db.prepare(`INSERT INTO client_module_commands(user_id,module,enabled,revision,updated_at,applied_at)
      VALUES(?,?,?,?,?,NULL) ON CONFLICT(user_id,module) DO UPDATE SET
      enabled=excluded.enabled,revision=excluded.revision,updated_at=excluded.updated_at,applied_at=NULL`)
      .bind(userId, body.module, body.enabled ? 1 : 0, crypto.randomUUID(), Date.now()).run();
  }
  const commands = await readCommands(db, userId);
  if (!coach) return reply({ ok: true, commands });
  let active = null;
  try { active = migrateClientModules(JSON.parse(member.modules)); } catch {}
  return reply({ ok: true, always: CLIENT_ALWAYS, available: CLIENT_OPTIONAL, active, commands });
}

// Only a successful compare-and-swap state save may acknowledge delivery. A
// stale/conflicting upload cannot consume a command or change another account.
export function moduleCommandAckStatements(db, userId, revisions, guard, id, token) {
  return Object.entries(moduleCommandRevisions(revisions)).map(([module, revision]) =>
    db.prepare(`UPDATE client_module_commands SET applied_at=COALESCE(applied_at,?)
      WHERE user_id=? AND module=? AND revision=? AND ${guard}`)
      .bind(Date.now(), userId, module, revision, id, token));
}
