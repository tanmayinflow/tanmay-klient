import { measurementOf } from './measurements.js';

export function goalMetrics(exercise) {
  const fields=measurementOf(exercise?.measurementType).fields;
  return ['reps','durationSec',...(fields.includes('reps')?['weight']:[])].filter(k=>fields.includes(k));
}
// Compare public content, not the time at which the preview was built.
export function planContent(doc) {
  if(!doc) return 'null';
  const stable = v => Array.isArray(v) ? v.map(stable) : v && typeof v==='object' ? Object.fromEntries(Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>[k,stable(v[k])])) : v;
  const {at, ...content}=doc;
  return JSON.stringify(stable(content));
}
export function deliveryIssues(doc) {
  if(doc==null) return [];
  if(doc.v!==2 || !Array.isArray(doc.plans) || !Array.isArray(doc.templates) || !Array.isArray(doc.exercises)) return ['invalid_bundle'];
  const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
  if(!doc.exercises.every(object)||!doc.plans.every(p=>object(p)&&Array.isArray(p.sessions)&&p.sessions.every(object)&&(p.milestones==null||(Array.isArray(p.milestones)&&p.milestones.every(object))))||!doc.templates.every(t=>object(t)&&Array.isArray(t.blocks)&&t.blocks.every(b=>object(b)&&Array.isArray(b.sets)&&b.sets.every(object)))) return ['invalid_bundle'];
  const issues=[];
  const templates=new Map(doc.templates.map(t=>[t.id,t])), exercises=new Set(doc.exercises.map(e=>e.id));
  if(!doc.plans.length) issues.push('empty_plan');
  for(const p of doc.plans) {
    if(!p.id || typeof p.cz!=='string' || !p.cz.trim() || !p.sessions?.length) issues.push('empty_plan');
    for(const s of p.sessions||[]) if(!templates.has(s.templateId)) issues.push('missing_template');
    for(const g of p.milestones||[]) if(typeof g.label!=='string' || !g.label.trim() || !exercises.has(g.exId) || !goalMetrics(doc.exercises.find(e=>e.id===g.exId)).includes(g.metric) || !Number.isFinite(g.target) || g.target<=0) issues.push('invalid_goal');
  }
  for(const t of doc.templates) {
    if(!t.blocks?.length) issues.push('empty_template');
    for(const b of t.blocks||[]) {
      if(!exercises.has(b.exId)) issues.push('missing_exercise');
      if(!b.sets?.length || b.sets.some(s=>!s.planned || !Object.values(s.planned).some(v=>typeof v==='number'&&v>0))) issues.push('missing_prescription');
    }
  }
  const forbidden=new Set(['privateNote','clientName','client','coachReview','who','klProfiles','denik','zapisnik']);
  const walk=v=>{ if(!v||typeof v!=='object') return; for(const[k,x]of Object.entries(v)){if(forbidden.has(k))issues.push('private_content');walk(x);} };
  walk(doc);
  return [...new Set(issues)];
}
export function publicMilestones(items) {
  const num=v=>v==null||v===''?null:Number.isFinite(Number(v))?Number(v):null;
  return (Array.isArray(items)?items:[]).filter(g=>g&&typeof g==='object').slice(0,3).map(g=>({id:String(g.id||''),label:String(g.label||''),exId:String(g.exId||''),metric:['reps','weight','durationSec'].includes(g.metric)?g.metric:'reps',baseline:num(g.baseline),target:num(g.target),load:num(g.load),minReps:num(g.minReps),reviewDate:String(g.reviewDate||'')}));
}
export function milestoneProgress(goal,sessions,planId) {
  const rows=(sessions||[]).filter(s=>s.state==='done'&&s.planId===planId).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.endedAt||0)-(a.endedAt||0));
  for(const session of rows) {
    const sets=(session.blocks||[]).filter(b=>b.exId===goal.exId).flatMap(b=>b.sets||[]).filter(s=>s.completed&&s.type!=='warmup'&&s.actual&&Number.isFinite(s.actual[goal.metric]));
    const comparable=sets.filter(s=>(goal.load==null||(s.actual.weight??s.actual.addedWeight??0)===goal.load)&&(goal.metric!=='weight'||(s.actual.reps||0)>=(goal.minReps||1)));
    if(!comparable.length) continue;
    const latest=Math.max(...comparable.map(s=>s.actual[goal.metric]));
    return {latest,date:session.date,reached:goal.target!=null&&latest>=goal.target};
  }
  return {latest:null,date:null,reached:false};
}
