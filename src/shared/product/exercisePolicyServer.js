// Coach controls authoring capability only. Exercise content stays in the
// client's database partition and is never returned by the coach endpoint.
const schemas=new WeakMap();
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store, private'}});
export async function ensureExercisePolicy(db){
  let promise=schemas.get(db);
  if(!promise){promise=db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS client_exercise_policy(user_id TEXT PRIMARY KEY,enabled INTEGER NOT NULL DEFAULT 1,updated_at INTEGER NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS client_custom_exercises(user_id TEXT NOT NULL,id TEXT NOT NULL,doc TEXT NOT NULL,archived INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL,PRIMARY KEY(user_id,id))`),
  ]).catch(error=>{schemas.delete(db);throw error;});schemas.set(db,promise);}
  await promise;
}
async function bodyOf(request){
  const reader=request.body?.getReader();if(!reader)throw new Error('invalid-body');
  const chunks=[];let bytes=0;
  for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>65536){await reader.cancel();throw new Error('body-too-large');}chunks.push(value);}
  const raw=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.length;}
  return JSON.parse(new TextDecoder().decode(raw));
}
export async function handleExercisePolicy(request,{db,userId,coach=false}){
  if(!db)return reply({ok:false,code:'database-unavailable'},503);
  if(request.method!=='GET'&&!(coach&&request.method==='PUT'))return reply({ok:false,code:'method'},405);
  if(!await db.prepare('SELECT 1 AS ok FROM members WHERE user_id=?').bind(userId).first())return reply({ok:false,code:'not-a-member'},404);
  await ensureExercisePolicy(db);
  if(request.method==='PUT'){
    let body;try{body=await bodyOf(request);}catch{return reply({ok:false,code:'invalid-body'},400);}
    if(typeof body?.enabled!=='boolean'||Object.keys(body).some(k=>k!=='enabled'))return reply({ok:false,code:'invalid-policy'},400);
    await db.prepare(`INSERT INTO client_exercise_policy(user_id,enabled,updated_at) VALUES(?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET enabled=excluded.enabled,updated_at=excluded.updated_at`).bind(userId,body.enabled?1:0,Date.now()).run();
  }
  const row=await db.prepare('SELECT enabled FROM client_exercise_policy WHERE user_id=?').bind(userId).first();
  return reply({ok:true,enabled:row?row.enabled===1:true});
}
const validId=id=>typeof id==='string'&&/^custom_ex_[a-zA-Z0-9_-]{1,100}$/.test(id);
export async function handleCustomExercises(request,{db,userId,id}){
  if(!db)return reply({ok:false,code:'database-unavailable'},503);
  await ensureExercisePolicy(db);
  if(request.method==='GET'&&!id){
    const rows=(await db.prepare('SELECT id,doc,archived FROM client_custom_exercises WHERE user_id=? ORDER BY updated_at').bind(userId).all()).results||[];
    return reply({ok:true,exercises:rows.filter(r=>!r.archived).map(r=>JSON.parse(r.doc)),archivedIds:rows.filter(r=>r.archived).map(r=>r.id)});
  }
  if(!['PUT','DELETE'].includes(request.method))return reply({ok:false,code:'method'},405);
  const policy=await db.prepare('SELECT enabled FROM client_exercise_policy WHERE user_id=?').bind(userId).first();
  if(policy?.enabled===0)return reply({ok:false,code:'custom-exercises-disabled'},403);
  const allowed=`EXISTS(SELECT 1 FROM members WHERE user_id=?) AND COALESCE((SELECT enabled FROM client_exercise_policy WHERE user_id=?),1)=1`;
  if(request.method==='DELETE'){
    if(!validId(id))return reply({ok:false,code:'invalid-exercise'},400);
    const result=await db.prepare(`UPDATE client_custom_exercises SET archived=1,updated_at=? WHERE user_id=? AND id=? AND ${allowed}`)
      .bind(Date.now(),userId,id,userId,userId).run();
    if(!result.meta?.changes)return reply({ok:false,code:'exercise-not-found-or-disabled'},409);
    return reply({ok:true,id});
  }
  let body;try{body=await bodyOf(request);}catch{return reply({ok:false,code:'invalid-body'},400);}
  const exercise=body?.exercise;
  if(!exercise||typeof exercise!=='object'||Array.isArray(exercise)||!validId(exercise.id)||exercise.custom!==true||
    Object.keys(body).some(k=>k!=='exercise'))return reply({ok:false,code:'invalid-exercise'},400);
  const result=await db.prepare(`INSERT INTO client_custom_exercises(user_id,id,doc,archived,updated_at)
    SELECT ?,?,?,0,? WHERE ${allowed}
    ON CONFLICT(user_id,id) DO UPDATE SET doc=excluded.doc,archived=0,updated_at=excluded.updated_at`)
    .bind(userId,exercise.id,JSON.stringify(exercise),Date.now(),userId,userId).run();
  if(!result.meta?.changes)return reply({ok:false,code:'custom-exercises-disabled'},403);
  return reply({ok:true,exercise});
}
