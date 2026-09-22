import { deliveryIssues } from './delivery.js';

export async function ensureDelivery(db) {
  await db.prepare('CREATE TABLE IF NOT EXISTS plans (user_id TEXT PRIMARY KEY, doc TEXT NOT NULL, updated_at INTEGER NOT NULL)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS plan_receipts (user_id TEXT PRIMARY KEY, revision INTEGER NOT NULL, received_at INTEGER NOT NULL)').run();
}
export async function readDelivery(db,userId) {
  await ensureDelivery(db);
  const row=await db.prepare('SELECT doc, updated_at FROM plans WHERE user_id = ?').bind(userId).first();
  const receipt=await db.prepare('SELECT revision, received_at FROM plan_receipts WHERE user_id = ?').bind(userId).first();
  return {doc:row?JSON.parse(row.doc):null,updated_at:row?.updated_at||null,received_at:receipt&&receipt.revision===row?.updated_at?receipt.received_at:null};
}
export async function writeDelivery(db,userId,body) {
  await ensureDelivery(db);
  if(!body||!Object.hasOwn(body,'doc')) return {status:400,error:'missing_doc'};
  const doc=body.doc;
  const raw=JSON.stringify(doc);
  if(raw.length>400000) return {status:413,error:'bundle_too_large'};
  const issues=deliveryIssues(doc); if(issues.length) return {status:400,error:issues.join(', ')};
  const current=await db.prepare('SELECT updated_at FROM plans WHERE user_id = ?').bind(userId).first();
  const expected=body.expectedUpdatedAt;
  if(Object.hasOwn(body,'expectedUpdatedAt') && (current?.updated_at||null)!==(expected||null)) return {status:409,error:'plan_changed'};
  const before=current?.updated_at||0;
  const revision=Math.max(Date.now(),before+1);
  // A tombstone retains revision ordering when a plan is withdrawn.
  const result=current
    ? await db.prepare('UPDATE plans SET doc = ?, updated_at = ? WHERE user_id = ? AND updated_at = ?').bind(raw,revision,userId,before).run()
    : await db.prepare('INSERT OR IGNORE INTO plans (user_id, doc, updated_at) VALUES (?, ?, ?)').bind(userId,raw,revision).run();
  if(result.meta?.changes!==1) return {status:409,error:'plan_changed'};
  return {status:200,ok:true,updated_at:revision,cleared:doc==null,size:raw.length};
}
export async function receiveDelivery(db,userId,revision) {
  await ensureDelivery(db);
  if(!Number.isSafeInteger(revision)) return {status:400,error:'invalid_revision'};
  const now=Date.now();
  const result=await db.prepare(`INSERT INTO plan_receipts (user_id, revision, received_at)
    SELECT user_id, updated_at, ? FROM plans WHERE user_id = ? AND updated_at = ?
    ON CONFLICT(user_id) DO UPDATE SET revision = excluded.revision, received_at = excluded.received_at`).bind(now,userId,revision).run();
  return result.meta?.changes===1?{status:200,ok:true,received_at:now}:{status:409,error:'plan_changed'};
}
