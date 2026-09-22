import { makeTemplate, makeBlock, makeSet, makePlan, makePlanSession } from './sessionModel.js';

// A deliberately small working shelf. Other exercises remain available.
export const WORKING_EXERCISE_IDS = Object.freeze([
  'drep','goblet','legpress','stepup','lunge','bulgsplit','hinge','dbrdl','glutebridge','seatedlegcurl',
  'wallpush','inclpush','kneepush','pushup','machinechestpress','dbpress','machineshoulderpress',
  'dbrow','bodyrow','ringrow','cablerow','chestsupprow','latpull','assistpullup','pullapart','facepull',
  'calfraise','suitcase','deadbug','birddog','plank','sideplank','pallof','hollow',
  'anklemob','hip9090','couch','cat','thoracicext','shouldercars','hipcars','wrists','wristcars',
  'scapush','activehang','wallhs','slbalance','act_walk','act_bike','extrot',
]);
export const isWorkingExercise = id => WORKING_EXERCISE_IDS.includes(id);
const reps = (id, sets=2, lo=8, hi=12, rest=90) => ({ id, sets, planned:{targetRepsMin:lo,targetRepsMax:hi,targetRir:2}, rest, rir:true });
const drill = (id, sets=2, count=6) => ({ id, sets, planned:{targetReps:count}, rest:30 });
const hold = (id, sets=2, sec=20) => ({ id, sets, planned:{targetDurationSec:sec}, rest:45 });
export const WORKING_ROUTINES = [
  {id:'home_a',cz:'Doma A · celé tělo',en:'Home A · full body',minutes:40,blocks:[reps('drep'),reps('inclpush',2,6,10),reps('dbrow'),reps('glutebridge'),drill('deadbug')],intro:['Jednoručka, stabilní opora. Začni 5 minutami chůze a lehkou sérií prvních cviků. Zátěž vyber tak, aby zůstala přibližně 2 opakování v rezervě.','Dumbbell and stable support. Start with 5 minutes of walking and easy rehearsal sets. Keep about 2 repetitions in reserve.']},
  {id:'home_b',cz:'Doma B · celé tělo',en:'Home B · full body',minutes:40,blocks:[reps('stepup'),reps('dbrdl'),reps('wallpush',2,8,15),reps('dbrow'),hold('sideplank')],intro:['Jednoručky a nízký stabilní schod. Výšku opory pro klik přizpůsob klientovi. Jednostranné cviky na obě strany.','Dumbbells and a low stable step. Adapt push-up support height. Train both sides in unilateral movements.']},
  {id:'gym_a',cz:'Posilovna A · celé tělo',en:'Gym A · full body',minutes:45,blocks:[reps('legpress'),reps('machinechestpress'),reps('cablerow'),reps('seatedlegcurl'),drill('deadbug')],intro:['Nastav stroje podle klienta. Před pracovními sériemi 5 minut lehkého pohybu a 1–2 lehké přípravné série. Zátěž domluv při prvním tréninku.','Fit each machine to the client. Begin with 5 minutes of easy movement and 1–2 light rehearsal sets. Establish loads together in the first session.']},
  {id:'gym_b',cz:'Posilovna B · celé tělo',en:'Gym B · full body',minutes:45,blocks:[reps('goblet'),reps('dbrdl'),reps('latpull'),reps('machinechestpress'),hold('sideplank')],intro:['Pohyb kontroluj v dostupném rozsahu. Mezi náročnými sériemi odpočívej déle, pokud se neobnovila technika a dech.','Use a controlled available range. Rest longer between hard sets if technique and breathing have not recovered.']},
  {id:'core_a',cz:'Střed A · kontrola',en:'Core A · control',minutes:12,blocks:[drill('deadbug',2,6),drill('birddog',2,6),hold('sideplank',2,15)],intro:['Obě strany. Plynule dýchej. Zkrať páku nebo výdrž dřív, než ztratíš kontrolu polohy.','Both sides. Breathe steadily. Shorten the lever or hold before losing position.']},
  {id:'core_b',cz:'Střed B · odolnost',en:'Core B · capacity',minutes:15,blocks:[drill('pallof',2,8),hold('suitcase',2,30),hold('plank',2,20)],intro:['Guma nebo kladka a jednoručka. Obě strany, bez zadržování dechu. Zátěž a délku výdrže vyber individuálně.','Band or cable and dumbbell. Both sides, without holding your breath. Choose load and hold duration individually.']},
  {id:'mob_lower',cz:'Mobilita · kotníky a kyčle',en:'Mobility · ankles and hips',minutes:10,blocks:[hold('anklemob',2,30),hold('hip9090',2,40),hold('couch',2,30)],intro:['Obě strany, pomalu a bez ostré bolesti. U kotníků a kyčlí se po uvedený čas plynule pohybuj. Rozsah zvětšuj jen při zachované kontrole.','Both sides, slowly and without sharp pain. Move steadily through the ankle and hip drills for the indicated time. Increase range only with control.']},
  {id:'mob_upper',cz:'Mobilita · hrudník a ramena',en:'Mobility · upper back and shoulders',minutes:10,blocks:[drill('cat',2,6),drill('shouldercars',2,4),hold('thoracicext',2,40)],intro:['Malý klidný rozsah pro začátek. Pohyb ramen nenahrazuj prohnutím beder. Nesnaž se vynutit krajní polohu.','Start with a small calm range. Do not substitute lower-back extension for shoulder movement. Never force end range.']},
  {id:'skill_base',cz:'Skill · opora a rovnováha',en:'Skill · support and balance',minutes:12,blocks:[hold('wrists',1,60),drill('scapush',2,6),hold('slbalance',3,20)],intro:['Krátká praxe v čerstvém stavu. Opora nablízku, obě strany. Kvalita má přednost před délkou pokusu.','Short practice while fresh. Keep support nearby and practise both sides. Quality matters more than attempt length.']},
  {id:'skill_wall',cz:'Skill · příprava na stojku',en:'Skill · handstand preparation',minutes:12,blocks:[hold('wrists',1,60),drill('scapush',2,6),hold('wallhs',4,10)],intro:['Až po ověření bezbolestné opory a bezpečného výstupu s trenérem. Jinak zvol oporu a rovnováhu. Krátké pokusy, žádné do selhání.','Only after a coach checks comfortable support and a safe exit. Otherwise use support and balance. Short attempts, never to failure.']},
];
export const WORKING_PATHS = [
  {id:'working_rhythm',cz:'Pravidelný začátek',en:'A regular start',weeks:6,days:2,skill:false},
  {id:'working_strength',cz:'Síla celého těla',en:'Full-body strength',weeks:8,days:3,skill:false},
  {id:'working_skill',cz:'Síla a dovednost',en:'Strength and skill',weeks:8,days:3,skill:true},
];
const rule=['Přizpůsob začátek klientovi. První týden lze udělat jen jednu pracovní sérii. Další týdny drž dvě; přidej nejvýše jednu po dobrém zotavení. Zvyšuj obtížnost až po všech předepsaných sériích na horní hranici, s rezervou a stabilní technikou. Bolest znamená zastavit cvik a domluvit úpravu.','Adapt the start to the client. One working set is an option in week one. Then keep two; add at most one after good recovery. Increase difficulty only after every prescribed set reaches the upper range with reserve and stable technique. Stop painful exercise and arrange an adjustment.'];
export function workingTemplates(resolve) {
  return WORKING_ROUTINES.map(r=>({...makeTemplate({id:'working_'+r.id,cz:r.cz,en:r.en,intro:r.intro,shelf:'working',createdAt:1,blocks:r.blocks.map((b,i)=>{
    const rec=resolve(b.id); if(!rec) throw new Error('Working library: missing '+b.id);
    return makeBlock({id:r.id+'_b'+i,exId:b.id,name:[rec.displayCz,rec.displayEn],measurementType:rec.measurementType,restSec:b.rest,rirEnabled:!!b.rir,coachNote:rec.unilateral?['Obě strany. Čísla platí pro každou stranu.','Both sides. Values are per side.']:['',''],sets:Array.from({length:b.sets},(_,j)=>makeSet(rec.measurementType,{id:r.id+'_b'+i+'_s'+j,planned:b.planned}))});
  })}),lib:true,working:true,minutes:r.minutes}));
}
export function workingPlan(path, environment='home') {
  if(!WORKING_PATHS.some(p=>p.id===path.id)) throw new Error('Unknown working plan');
  if(!['home','gym'].includes(environment)) throw new Error('Unknown environment');
  const sessions=[];
  for(let w=1;w<=path.weeks;w++) for(let d=0;d<path.days;d++) {
    const day=path.skill&&d===2?'skill_base':environment+'_'+(((w-1)*path.days+d)%2?'b':'a');
    sessions.push(makePlanSession({id:path.id+'_'+environment+'_'+w+'_'+d,w,templateId:'working_'+day,effortTarget:80}));
  }
  return {...makePlan({id:path.id,cz:path.cz,en:path.en,weeks:path.weeks,intro:rule,pathId:path.id,sessions,why:{boundary:['Mezi silovými dny nech obvykle den volna. Šablona je výchozí návrh; dávku, omezení a cíl nastav s klientem.','Usually leave a rest day between strength sessions. This is a starting template; establish dose, limitations and goal with the client.']}}),lib:true,working:true,environment};
}
