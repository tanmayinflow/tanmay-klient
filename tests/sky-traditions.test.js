import test from "node:test";
import assert from "node:assert/strict";
import {skyReading,skyTradition,skyZodiac} from "../src/shared/product/skyTraditions.js";
import {emptySkyJournal,parseSkyJournal,saveSkyJournal,skyStorageKey} from "../src/shared/product/skyJournal.js";

const choices=[{id:"western",zodiac:"tropical"},{id:"hellenistic",zodiac:"tropical"},{id:"jyotish",zodiac:"sidereal"}];
const privateData=journal=>Object.fromEntries(["nostrils","dreams","decisions","practice","intentions"].map(key=>[key,journal[key]]));
const freeze=value=>{if(value&&typeof value==="object"){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
function legacyJournal(){
  const journal=emptySkyJournal();
  delete journal.settings.tradition;delete journal.settings.tibetanEnabled;
  journal.revision=7;journal.settings.zodiac="sidereal";
  journal.settings.birth={date:"1990-03-15",time:"08:30",timeKnown:true,place:"Praha",latitude:50.0755,longitude:14.4378,timeZone:"Europe/Prague"};
  journal.settings.practices.guru=true;journal.settings.modules.swara=true;
  journal.nostrils=[{id:"breath-1",time:1770000000000,side:"both",comfort:true,note:"Soukromé pozorování."}];
  journal.dreams=[{id:"dream-1",time:1770000100000,text:"Sen, který chci uchovat.",environment:"water",regions:["lower"]}];
  journal.decisions=[{id:"choice-1",time:1770000200000,question:"Kterou cestu vybrat?",options:["A","B"],result:1,reviewDate:"2026-02-23",timeZone:"Europe/Prague",review:"Vlastní ohlédnutí.",decision:"Můj krok."}];
  journal.practice={"2026-02-02:morning:guru":{day:"2026-02-02",done:true,time:1770000300000}};
  journal.intentions={"week:2026-02-02":{text:"Záměr týdne.",time:1770000400000},"life:open":"Dříve uložený záměr."};
  return journal;
}
function memoryStorage(){const rows=new Map();return {getItem:key=>rows.get(key)??null,setItem:(key,value)=>rows.set(key,value)};}

test("new and minimal sky journals start in Western tropical reading without Tibetan opt-in",()=>{
  for(const journal of [emptySkyJournal(),parseSkyJournal(null),parseSkyJournal(""),parseSkyJournal({version:1,revision:0})]){
    assert.equal(journal.settings.tradition,"western");assert.equal(journal.settings.zodiac,"tropical");
    assert.equal(journal.settings.tibetanEnabled,false);
    assert.deepEqual(skyReading(journal.settings),{reading:"western",lens:"western",zodiac:"tropical"});
  }
});

test("each ordinary perspective selects its matching coordinate frame independently of legacy flags",()=>{
  for(const {id,zodiac} of choices){
    const settings={tradition:id,zodiac:zodiac==="tropical"?"sidereal":"tropical",traditions:{western:false,hellenistic:false,jyotish:false}};
    assert.equal(skyZodiac(id),zodiac);
    assert.deepEqual(skyReading(settings),{reading:id,lens:id,zodiac});
    for(const selected of choices)assert.deepEqual(skyReading(settings,selected.id),{reading:selected.id,lens:selected.id,zodiac:selected.zodiac});
    for(const missing of [undefined,null,"invalid"]){
      const restored=parseSkyJournal({version:1,revision:0,settings:{tradition:id,zodiac:missing}});
      assert.equal(restored.settings.zodiac,zodiac,"missing or invalid coordinates use the selected system");
    }
  }
});

test("Tibetan perspective requires literal true in both stored settings and the reading resolver",()=>{
  for(const flag of [undefined,null,false,0,1,"true","false",{},[],true]){
    const settings={tradition:"jyotish",tibetanEnabled:flag};
    const parsed=parseSkyJournal({version:1,revision:0,settings});
    assert.equal(parsed.settings.tibetanEnabled,flag===true);
    const expected=flag===true?{reading:"tibetan",lens:"western",zodiac:"tropical"}:{reading:"jyotish",lens:"jyotish",zodiac:"sidereal"};
    assert.deepEqual(skyReading(settings,"tibetan"),expected);
    assert.deepEqual(skyReading(parsed.settings,"tibetan"),expected);
  }
});

test("revoking Tibetan opt-in returns an already selected Tibetan view to the saved default",()=>{
  for(const {id,zodiac} of choices){
    const settings={tradition:id,tibetanEnabled:true};
    assert.equal(skyReading(settings,"tibetan").reading,"tibetan");
    assert.deepEqual(skyReading({...settings,tibetanEnabled:false},"tibetan"),{reading:id,lens:id,zodiac});
    for(const invalid of ["unknown",{},1])assert.deepEqual(skyReading(settings,invalid),{reading:id,lens:id,zodiac});
    assert.deepEqual(skyReading(settings),{reading:id,lens:id,zodiac},"enabling the optional view does not replace the ordinary default");
  }
});

test("unknown saved systems cannot become calculation lenses or implicitly enable Tibetan reading",()=>{
  for(const value of [undefined,null,"","sidereal","tibetan","unrecognised",{},["jyotish"]]){
    const journal=parseSkyJournal({version:1,revision:0,settings:{tradition:value,tibetanEnabled:false}});
    assert.equal(skyTradition(value),"western");
    assert.deepEqual(skyReading(journal.settings),{reading:"western",lens:"western",zodiac:"tropical"});
  }
});

test("legacy journal migration preserves private records and birth details without opting into a new module",()=>{
  const legacy=freeze(legacyJournal()),before=JSON.stringify(legacy),expected=structuredClone(privateData(legacy));
  for(const input of [legacy,before]){
    const migrated=parseSkyJournal(input);
    assert.equal(migrated.revision,7);assert.deepEqual(privateData(migrated),expected);
    assert.deepEqual(migrated.settings.birth,legacy.settings.birth);
    assert.equal(migrated.settings.tradition,"western");assert.equal(migrated.settings.tibetanEnabled,false);
    assert.equal(migrated.settings.zodiac,legacy.settings.zodiac,"the previous coordinate preference remains stored");
    assert.deepEqual(skyReading(migrated.settings),{reading:"western",lens:"western",zodiac:"tropical"},"the active ordinary reading still starts in Western tropical coordinates");
    assert.deepEqual(migrated.settings.practices,legacy.settings.practices);
    assert.deepEqual(migrated.settings.modules,legacy.settings.modules);
  }
  assert.equal(JSON.stringify(legacy),before,"reading old data must not modify it in place");
});

test("changing and reloading the default system preserves observations and the other account's storage",()=>{
  const storage=memoryStorage(),legacy=legacyJournal();
  storage.setItem(skyStorageKey("account-a"),JSON.stringify(legacy));
  storage.setItem(skyStorageKey("account-b"),JSON.stringify({...legacy,intentions:{private:"Belongs to B"}}));
  const other=storage.getItem(skyStorageKey("account-b")),original=structuredClone(privateData(legacy));
  let current=parseSkyJournal(storage.getItem(skyStorageKey("account-a")));
  for(const {id,zodiac} of choices){
    current=saveSkyJournal(storage,"account-a",current,doc=>({...doc,settings:{...doc.settings,tradition:id,zodiac:skyZodiac(id)}}));
    current=parseSkyJournal(storage.getItem(skyStorageKey("account-a")));
    assert.equal(current.settings.tradition,id);assert.equal(current.settings.zodiac,zodiac);
    assert.deepEqual(skyReading(current.settings),{reading:id,lens:id,zodiac});
    assert.deepEqual(privateData(current),original);
    assert.equal(storage.getItem(skyStorageKey("account-b")),other);
  }
  for(const enabled of [true,false]){
    current=saveSkyJournal(storage,"account-a",current,doc=>({...doc,settings:{...doc.settings,tibetanEnabled:enabled}}));
    assert.equal(current.settings.tibetanEnabled,enabled);assert.deepEqual(privateData(current),original);
  }
  assert.equal(current.revision,legacy.revision+choices.length+2);
});

test("temporary perspective selection is read-only and leaves the saved default and private records intact",()=>{
  const journal=parseSkyJournal(legacyJournal());journal.settings.tradition="hellenistic";journal.settings.tibetanEnabled=true;
  freeze(journal);const original=JSON.stringify(journal);
  for(const selected of ["western","jyotish","tibetan","hellenistic",null])skyReading(journal.settings,selected);
  assert.equal(JSON.stringify(journal),original);
  assert.equal(skyReading(journal.settings).reading,"hellenistic");
});
