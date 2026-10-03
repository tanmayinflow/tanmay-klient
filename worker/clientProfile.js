import { defaultPersonalProfile, ensurePersonalProfiles, handlePersonalProfile, readPersonalProfile } from '../src/shared/product/personalProfile.js';

// The personal profile owns the name. members.name is only a compatibility
// projection for the coach's member list and older app versions.
export async function clientProfile(db, userId) {
  await ensurePersonalProfiles(db);
  const member = await db.prepare('SELECT name FROM members WHERE user_id = ?').bind(userId).first();
  if (!member) return null;
  const actor = `client:${userId}`;
  await db.prepare('INSERT OR IGNORE INTO personal_profiles (actor,doc,revision) VALUES (?, ?, 0)')
    .bind(actor, JSON.stringify({ ...defaultPersonalProfile(true), name: member.name || '' })).run();
  return readPersonalProfile(db, actor, true);
}

async function projectName(db, userId) {
  // Read the canonical value in the UPDATE itself, so a slower response cannot
  // restore an older name after a newer profile has already been saved.
  await db.prepare("UPDATE members SET name = (SELECT json_extract(doc, '$.name') FROM personal_profiles WHERE actor = ?) WHERE user_id = ?")
    .bind(`client:${userId}`, userId).run();
}

export async function handleClientProfile(request, db, userId) {
  await clientProfile(db, userId);
  const result = await handlePersonalProfile(request, db, `client:${userId}`, { legacyOwner: true });
  if (result.ok) await projectName(db, userId);
  return result;
}

export async function handleLegacyClientName(request, db, userId) {
  if (request.method !== 'POST') return Response.json({ ok: false, error: 'method not allowed' }, { status: 405 });
  const raw = await request.text();
  if (raw.length > 3000) return Response.json({ ok: false, error: 'too-large' }, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ ok: false, error: 'invalid-profile' }, { status: 400 }); }
  if (typeof body?.name !== 'string') return Response.json({ ok: false, error: 'invalid-profile' }, { status: 400 });
  const current = await clientProfile(db, userId);
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json');
  headers.delete('Content-Length');
  const result = await handleClientProfile(new Request(request.url, {
    method: 'PUT', headers,
    body: JSON.stringify({ revision: current.revision, profile: { ...current.profile, name: body.name } }),
  }), db, userId);
  if (!result.ok) return result;
  const saved = await result.json();
  return Response.json({ ...saved, name: saved.profile.name }, { headers: result.headers });
}
