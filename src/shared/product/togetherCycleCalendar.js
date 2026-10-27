import {addDays,cycleSummary,dateKey,dayNumber,validDate,cyclePeriodRecords,cycleBleedingDuration} from './togetherCycleData.js';
import {cycleViewForDate} from './togetherGuidance.js';
export {DEFAULT_BLEEDING_DAYS,cycleBleedingDuration} from './togetherCycleData.js';

// An editable starting suggestion for a draft, never a recorded end or a
// physiological claim. Completed personal records take precedence.
const bleedingFlows = new Set(['light', 'medium', 'heavy']);

/** A clicked actual start produces a draft; expectedEnd must never become end. */
export function cyclePeriodDraft(doc, start, referenceDate=dateKey()) {
  if (!validDate(start) || !validDate(referenceDate) || start>referenceDate) return null;
  const existing=cyclePeriodRecords(doc,referenceDate).find(period=>period.start===start);
  const suggested=cycleBleedingDuration(doc,addDays(start,-1));
  const duration=existing?.expectedLength||suggested.days;
  return {start,end:existing?.end||null,expectedLength:duration,
    expectedEnd:existing?.end||addDays(start,duration-1),duration,
    basis:existing?.expectedLength?'saved':suggested.basis,samples:suggested.samples,
    ...(existing?{originalStart:existing.start}:{})};
}

/** Shared editable state for both the day sheet and the inline start action. */
export function cyclePeriodEntryDraft(doc, start, referenceDate=dateKey()) {
  const draft=cyclePeriodDraft(doc,start,referenceDate);
  const chosenObserve=doc?.mode==='observe' && doc.modeChosen===true;
  return draft?{...draft,end:draft.end||'',showEstimates:doc?.mode!=='paused' && !chosenObserve}:null;
}

/** Saving a visible opt-in updates the estimate mode with the actual record. */
export function cyclePeriodEntryPatch(doc, draft, referenceDate=dateKey()) {
  if (!validDate(draft?.start) || !validDate(referenceDate) || draft.start>referenceDate ||
    (draft.end && (!validDate(draft.end) || draft.end<draft.start || draft.end>referenceDate ||
      dayNumber(draft.end)-dayNumber(draft.start)>60))) throw new Error('invalid period dates');
  if (!Number.isInteger(draft.expectedLength) || draft.expectedLength<1 || draft.expectedLength>14)
    throw new Error('invalid expected period length');
  const record={start:draft.start,end:draft.end||null,expectedLength:draft.expectedLength};
  return {periods:[...(doc.periods||[]).filter(period=>period.start!==(draft.originalStart||draft.start)),record],
    mode:draft.showEstimates===true?'estimate':doc.mode==='paused'?'paused':'observe',modeChosen:true};
}

/**
 * Owner-side calendar projection. Never call with a partner's raw document:
 * recipients continue to use the API's grant-limited cycle/phase projection.
 * recorded = actual interval or explicit flow; continuation = an open actual
 * start's expected remainder; expectedPeriod = days in an unrecorded cycle.
 * The two latter flags are estimates and are suppressed outside estimate mode.
 */
export function cycleCalendarDay(doc, date, referenceDate=dateKey()) {
  const empty={date,recorded:false,recordedPeriod:null,continuation:false,expectedPeriod:false,
    phase:{id:null,basis:'unknown'},cycle:{day:null,next:null,reason:'empty',cycles:0},nextPeriod:null};
  if (!validDate(date) || !validDate(referenceDate)) return empty;
  const periods=cyclePeriodRecords(doc,referenceDate);
  const safeDoc={...doc,periods,mode:['observe','estimate','paused'].includes(doc?.mode)?doc.mode:'observe',
    usualLength:Number.isInteger(doc?.usualLength)?doc.usualLength:28,days:doc?.days||{}};
  const view=cycleViewForDate(safeDoc,date,referenceDate);
  const current=cycleSummary(safeDoc,referenceDate);
  const duration=cycleBleedingDuration(safeDoc,referenceDate);
  const recordedPeriod=date<=referenceDate
    ? periods.find(period=>date>=period.start && date<=(period.end||period.start))||null : null;
  const recorded=!!recordedPeriod || (date<=referenceDate && bleedingFlows.has(safeDoc.days[date]?.flow));
  const canEstimate=safeDoc.mode==='estimate';
  const nextPeriod=canEstimate && current.reason==='estimate' && current.next
    ? {start:addDays(current.lastStart,current.median),
      end:addDays(current.lastStart,current.median+duration.days-1),duration:duration.days,
      basis:duration.basis,samples:duration.samples,startWindow:{from:current.next.from,to:current.next.to}}
    : null;
  // The bounded previous cycle is also dashed, never an actual record or the
  // continuation of the first start. Late recorded cycles still never wrap.
  const projectedCycle=view.cycle.retrospective || (nextPeriod && date>referenceDate && view.cycle.projected &&
    dayNumber(date)-dayNumber(current.lastStart)>=current.median);
  const estimatedBleeding=view.phase.id==='menstrual' && view.phase.basis==='estimated';
  const expectedPeriod=!!(projectedCycle && estimatedBleeding && !recorded);
  const continuation=canEstimate && estimatedBleeding && !recorded && !expectedPeriod;
  return {date,recorded,recordedPeriod,continuation,expectedPeriod,phase:view.phase,cycle:view.cycle,nextPeriod};
}
