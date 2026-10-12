// Neutral date and cycle data helpers. No UI, API, permissions or imports from
// together.js / togetherGuidance.js: both depend on this module, not each other.
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export function validDate(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s+"T12:00:00Z").toISOString().slice(0,10) === s; }
export const dayNumber = s => Math.floor(Date.parse(s+"T12:00:00Z")/86400000);
export const addDays = (s,n) => new Date((dayNumber(s)+n)*86400000).toISOString().slice(0,10);

// Existing estimate eligibility and uncertainty are intentionally unchanged.
export function cycleSummary(doc, today = dateKey()) {
  const periods=(doc?.periods||[]).filter(p=>p.start<=today).sort((a,b)=>a.start.localeCompare(b.start));
  const last=periods.at(-1);
  if(!last) return {day:null,next:null,reason:"empty",cycles:0};
  const intervals=periods.slice(1).map((p,i)=>dayNumber(p.start)-dayNumber(periods[i].start)).slice(-6);
  const sorted=intervals.toSorted((a,b)=>a-b);
  const median=sorted.length?Math.round((sorted[Math.floor((sorted.length-1)/2)]+sorted[Math.floor(sorted.length/2)])/2):doc.usualLength;
  const day=dayNumber(today)-dayNumber(last.start)+1;
  const observedBleeding=!!(last.end&&last.end>=today) || last.start===today;
  const base={day,observedBleeding,lastStart:last.start,cycles:intervals.length,median};
  if(doc.mode!=="estimate") return {...base,next:null,reason:doc.mode==="paused"?"paused":"observe"};
  if(median<21||median>35||intervals.some(n=>n<21||n>35) || (sorted.length>1&&sorted.at(-1)-sorted[0]>7)) return {...base,next:null,reason:"variable"};
  const spread=sorted.length>1?Math.max(3,Math.ceil((sorted.at(-1)-sorted[0])/2)):4;
  const next={from:addDays(last.start,median-spread),to:addDays(last.start,median+spread),basedOn:intervals.length?"history":"manual"};
  if(today>next.to) return {...base,next:null,reason:"outdated"};
  return {...base,next,reason:"estimate"};
}

// An editable suggestion, never a recorded end or a physiological claim.
export const DEFAULT_BLEEDING_DAYS = 5;
const MAX_RECORDED_DURATION = 61; // Existing validator: end-start <=60.
const validExpectedLength=value=>Number.isInteger(value) && value>=1 && value<=14;

export function cyclePeriodRecords(doc, referenceDate) {
  if (!validDate(referenceDate)) return [];
  return (Array.isArray(doc?.periods) ? doc.periods : [])
    .filter(period => validDate(period?.start) && period.start <= referenceDate)
    .map(period => ({start:period.start, end:validDate(period.end) &&
      period.end >= period.start && period.end <= referenceDate &&
      dayNumber(period.end)-dayNumber(period.start)<MAX_RECORDED_DURATION ? period.end : null,
      ...(validExpectedLength(period.expectedLength)?{expectedLength:period.expectedLength}:{})}))
    .toSorted((a,b)=>a.start.localeCompare(b.start));
}

/** Inclusive median of up to six recent completed records in the draft range. */
export function cycleBleedingDuration(doc, referenceDate=dateKey()) {
  const periods=cyclePeriodRecords(doc,referenceDate);
  const durations=periods.filter(period=>period.end)
    .map(period=>dayNumber(period.end)-dayNumber(period.start)+1).filter(validExpectedLength).slice(-6).sort((a,b)=>a-b);
  if (!durations.length) {
    const saved=periods.filter(period=>validExpectedLength(period.expectedLength)).at(-1);
    return saved?{days:saved.expectedLength,basis:'saved',samples:0}
      :{days:DEFAULT_BLEEDING_DAYS,basis:'default',samples:0};
  }
  const middle=Math.floor(durations.length/2);
  return {days:Math.round((durations[Math.floor((durations.length-1)/2)]+durations[middle])/2),
    basis:'history',samples:durations.length};
}
