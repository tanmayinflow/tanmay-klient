// Private, descriptive summaries of the records supplied by the current account.
// Missing scores never become zero; no causal or health conclusions are inferred.
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const dayNumber = date => Date.parse(date + 'T12:00:00Z') / 86400000;
const score = (value, key) => {
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= (key === 'sleep' ? 0 : 1) && n <= (key === 'sleep' ? 24 : 5) ? n : null;
};
const average = values => values.length ? Math.round(values.reduce((a,b)=>a+b,0) / values.length * 10) / 10 : null;

export function practiceReviewSummary(records, endDate, reflectionKeys) {
  const end = dayNumber(endDate);
  const unique = new Map();
  for (const record of records || []) {
    if (!datePattern.test(record.date || '')) continue;
    const parsed=new Date(record.date+'T12:00:00Z');
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10)!==record.date) continue;
    const age = end - dayNumber(record.date);
    if (age >= 0 && age < 30) unique.set(record.date, record);
  }
  const rows = [...unique.values()].sort((a,b)=>a.date.localeCompare(b.date));
  const metrics = Object.fromEntries(['sleep','mood','energy','well'].map(key => {
    const measured = rows.map(row=>({date:row.date,value:score(row.wb?.[key],key)})).filter(row=>row.value!==null);
    const recent = measured.filter(row=>end-dayNumber(row.date)<15).map(row=>row.value);
    const earlier = measured.filter(row=>end-dayNumber(row.date)>=15).map(row=>row.value);
    return [key,{count:measured.length,average:average(measured.map(row=>row.value)),recent:average(recent),earlier:average(earlier),recentCount:recent.length,earlierCount:earlier.length}];
  }));
  const reflections = rows.map(row=>({date:row.date,answers:(reflectionKeys||[]).map(key=>({key,text:String(row.plan?.[key]||'').trim()})).filter(answer=>answer.text)})).filter(row=>row.answers.length);
  const body = rows.filter(row=>Object.keys(metrics).some(key=>score(row.wb?.[key],key)!==null)||['grat','bodhi','wild'].some(key=>row.wb?.[key])||String(row.wb?.theme||'').trim());
  return {metrics,reflections:reflections.reverse(),reflectionDays:reflections.length,bodyDays:body.length,seals:Object.fromEntries(['grat','bodhi','wild'].map(key=>[key,body.filter(row=>row.wb?.[key]===true).length]))};
}
