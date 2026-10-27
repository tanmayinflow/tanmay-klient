import { syncAllDay, mergeAllDaySync } from "./calendarAllDay.js";
import { eventFields, listCalendarEvents, reconcileSchedule, writeCalendarEvent } from "./calendarSchedule.js";
import { syncClientTrainingCalendar } from "./trainingCalendarSync.js";
import { syncOwnCycleCalendar } from "./cycleGoogleCalendar.js";

// Main supplies its additional event sources. Client never evaluates those sources,
// even if an imported collection contains Main calendar flags or shadow records.
export function createGoogleCalendar({role="main", L, todayISO, BRAND, extraEvents=()=>[], getAccount=()=>"main", verifyAccount=()=>true, canRequest=()=>true, fetcher=(...args)=>fetch(...args)}) {
const CAL_SCOPE = "https://www.googleapis.com/auth/calendar.app.created";
const CAL_API = "https://www.googleapis.com/calendar/v3";
const CAL_GIS = "https://accounts.google.com/gsi/client";
const mainDefaults = {
  clientId: "", calId: "", calName: "tanmay",
  klienti: true, trenink: true, rozvrh: false, motiv: true,
  horizon: 14, busy: "klienti", titles: "plne", zpet: "",
  lastSync: 0, lastErr: "", lastCount: 0, cycle:false, cycleCalId:"",
};
const allKinds = [
  { k: "klienti", cz: "Sezení s klienty", en: "Client sessions", cz2: "s časem a délkou · jediné, co doopravdy blokuje čas někomu dalšímu", en2: "with time and duration · the only thing that really blocks time for someone else" },
  { k: "trenink", cz: "Trénink", en: "Training", cz2: "celodenní záznam · v aplikaci nemá hodinu, tak ji nevymýšlím", en2: "an all-day entry · it has no hour in the app, so I don't invent one" },
  { k: "rozvrh", cz: "Rozvrh dne", en: "Day schedule", cz2: "každý vyplněný řádek jako hodinový blok · šest až dvanáct událostí denně", en2: "every filled row as an hour block · six to twelve events a day" },
  { k: "motiv", cz: "Motiv dne", en: "Motif of the day", cz2: "jeden celodenní pruh na každý den, kde je motiv vyplněný", en2: "one all-day strip for each day that has a motif" },
];


let runtimeClientId = "", preparing = null, generation = 0;
const CAL_DEF = role === "client" ? {...mainDefaults, klienti:false, motiv:false, busy:"nic"} : mainDefaults;
const CAL_KINDS = allKinds.filter(item => role !== "client" || ["rozvrh","trenink"].includes(item.k));
const config = value => role === "client"
  ? {...CAL_DEF, ...value, clientId:value?.clientId||runtimeClientId, klienti:false, motiv:false, busy:value?.busy === "vse" ? "vse" : "nic"}
  : {...CAL_DEF, ...value, clientId:value?.clientId||runtimeClientId};
function tmCalPrepare() {
  if (!preparing) preparing = fetcher('/api/calendar/config',{credentials:'same-origin',cache:'no-store'})
    .then(async response => { if (!response.ok) throw new Error('calendar-config-unavailable'); const data=await response.json(); runtimeClientId=data.configured?data.clientId:''; return config({}); })
    .finally(()=>{preparing=null;});
  return preparing;
}
const accountError = () => Object.assign(new Error("calendar-account-changed"), {code:"calendar-account-changed"});
const assertAccount = owner => { if (!owner || owner !== getAccount()) throw accountError(); };
const tmCalAvailable = () => !!getAccount() && canRequest();
function scopedStore(st, owner, version = generation) {
  const scoped = {...st};
  const guard = () => {assertAccount(owner);if(version!==generation)throw accountError();};
  for(const key of ['getClientTrainingCalendar','getCalendarDay'])if(typeof st[key]==='function')scoped[key]=(...args)=>{guard();return st[key](...args);};
  scoped.calendarGuard=guard;
  for (const key of ["setCalCfg", "setCalState", "setCalendarAllDay", "updateCalendarDays", "updateDay", "updateClientTrainingCalendar"]) {
    if (typeof st[key] !== "function") continue;
    scoped[key] = (...args) => {
      assertAccount(owner);
      if (version !== generation) throw accountError();
      return st[key](...args.map(arg => typeof arg === "function" ? (...values) => {
        if (owner !== getAccount() || version !== generation) return key === "updateDay" ? {} : values[0];
        return arg(...values);
      } : arg));
    };
  }
  return scoped;
}

/* Identita události. Klíč se NEHAŠUJE — kóduje se do base32hex, což je
   přesně abeceda, kterou Google pro vlastní id událostí požaduje (0–9 a–v,
   délka 5–1024). Kódování je vratné a bezkolizní; haš by kolizi připustil
   a hlavně by nešel přečíst, až bude potřeba zjistit, co ta událost je. */
function tmB32(s) {
  const b = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(String(s)) : [];
  const A = "0123456789abcdefghijklmnopqrstuv";
  let bits = 0, val = 0, out = "";
  for (let i = 0; i < b.length; i++) {
    val = (val << 8) | b[i]; bits += 8;
    while (bits >= 5) { out += A[(val >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += A[(val << (5 - bits)) & 31];
  return out.length >= 5 ? out : (out + "00000").slice(0, 5);
}
const tmOrigin = () => { try { return window.location.origin; } catch (e) { return "https://…"; } };
const tmCalTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Prague"; } catch (e) { return "Europe/Prague"; } };
const tmCalShift = (iso, days) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };
const tmCalHH = (h) => { const p = String(h || "").split(":"); return String(Math.max(0, Math.min(23, parseInt(p[0], 10) || 0))).padStart(2, "0") + ":" + String(parseInt(p[1], 10) || 0).padStart(2, "0"); };

/* Přístupový token žije jen v paměti. Do localStorage nepatří: platí hodinu,
   a jeho ztráta stojí jedno tiché obnovení — kdežto jeho únik stojí přístup. */
let TM_CAL_OWNER = null;
let TM_CAL_TOK = null, TM_CAL_EXP = 0, TM_CAL_CLIENT = null, TM_CAL_CID = "", TM_CAL_SC = "", TM_CAL_GRANT = "";
let authTask=null, authKey='';
const tmCalLive = () => !!getAccount() && TM_CAL_OWNER === getAccount() && !!TM_CAL_TOK && Date.now() < TM_CAL_EXP - 60000;
/* KDO ROZHODUJE O PŘIHLÁŠENÍ. „Tiché" vydání tokenu (prompt: "") umí Google
   vydat bez ptaní jen tehdy, když je jeho relace v prohlížeči zdravá. Když
   není, místo tichého okna se ukáže PŘIHLAŠOVACÍ obrazovka — a protože se
   o token říkalo při každém prvním kliknutí a po neúspěchu znovu, uměla
   z toho být nekonečná smyčka přihlašovacích oken. Proto si zařízení pamatuje,
   jak dopadl poslední pokus: „1" = prošel tiše, smí se to zkusit zas;
   „0" = Google chtěl člověka — aplikace se pak už NIKDY neptá sama a čeká,
   až se člověk rozhodne v Nastavení → Kalendář. Každé úspěšné vydání tokenu
   (tiché i ruční) zapíše „1". */
const silentKey = () => role === "client" ? "tmCalTicho:" + getAccount() : "tmCalTicho";
const tmCalTichoZakazano = () => { try { return localStorage.getItem(silentKey()) === "0"; } catch (e) { return false; } };
const tmCalTichoZapis = (ok) => { try { localStorage.setItem(silentKey(), ok ? "1" : "0"); } catch (e) {} };
function tmCalGis() {
  return new Promise((res, rej) => {
    try {
      if (typeof window === "undefined") return rej(new Error("no window"));
      if (window.google && window.google.accounts && window.google.accounts.oauth2) return res(window.google.accounts.oauth2);
      let s = document.querySelector('script[data-tmgis="1"]');
      if (!s) {
        s = document.createElement("script"); s.src = CAL_GIS; s.async = true; s.defer = true; s.setAttribute("data-tmgis", "1");
        document.head.appendChild(s);
      }
      const t0 = Date.now();
      const tick = () => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) return res(window.google.accounts.oauth2);
        if (Date.now() - t0 > 12000) return rej(new Error("gis-timeout"));
        setTimeout(tick, 120);
      };
      tick();
    } catch (e) { rej(e); }
  });
}
/* interactive=false zkusí token vydat tiše (prompt: ""). Vyskočí a hned
   zmizí okno; funguje, jen pokud už člověk jednou souhlas dal. Z chybové
   větve se o token NIKDY nesmí říct — prohlížeč to vyhodnotí jako
   vyskakovací okno bez gesta a zablokuje ho. */
function tmCalAuth(clientId, interactive, scope) {
  const owner = getAccount();
  const version = generation;
  try { assertAccount(owner); if (!canRequest()) throw new Error("calendar-account-unavailable"); } catch (error) { return Promise.reject(error); }
  if (!clientId) return Promise.reject(new Error("no-client-id"));
  const sc = scope || CAL_SCOPE;
  if (tmCalLive() && TM_CAL_CID === clientId && sc.split(' ').every(s=>TM_CAL_GRANT.split(' ').includes(s))) return Promise.resolve(TM_CAL_TOK);
  const key=JSON.stringify([owner,clientId,sc,version]);
  if(authTask&&authKey===key)return authTask;
  const o2=typeof window!=='undefined'&&window.google?.accounts?.oauth2;
  if(!o2)return Promise.reject(new Error('google-loading'));
  const task=new Promise((res, rej) => {
    assertAccount(owner);
    let done = false, timeout;
    const accept = r => {
      if (done) return;
      try { assertAccount(owner); } catch(error) { fin(rej,error); return; }
      if(version!==generation){fin(rej,accountError());return;}
      if (r && r.access_token) {
        if(r.scope && !sc.split(' ').every(s=>r.scope.split(' ').includes(s))){fin(rej,new Error('calendar-permission-required'));return;}
        TM_CAL_OWNER = owner; TM_CAL_TOK = r.access_token;
        TM_CAL_CID = clientId; TM_CAL_SC = sc;
        TM_CAL_EXP = Date.now() + (Number(r.expires_in) || 3600) * 1000;
        TM_CAL_GRANT = String(r.scope || sc); tmCalTichoZapis(true); fin(res,TM_CAL_TOK);
      } else fin(rej,new Error(r?.error || "no-token"));
    };
    const fin = (fn, v) => { if (done) return; done = true; clearTimeout(timeout); fn(v); };
    // Each popup owns its callback. A late response from another account can
    // never be delivered into a reused client's newly assigned callback.
    const tokenClient = o2.initTokenClient({
      client_id: clientId, scope: sc,
      callback: accept,
      error_callback: (e) => fin(rej, new Error((e && e.type) || "auth-error")),
    });
    TM_CAL_CLIENT = tokenClient;
    timeout = setTimeout(() => fin(rej, new Error("auth-timeout")), interactive ? 180000 : 25000);
    try { tokenClient.requestAccessToken({ prompt: interactive ? "consent" : "" }); }
    catch (e) { fin(rej, e); }
  });
  authKey=key;authTask=task.finally(()=>{if(authKey===key){authTask=null;authKey='';}});
  return authTask;
}
/* Jedno volání API. Opakuje jen to, co má smysl opakovat: 429, 403 kvůli
   rychlosti, 5xx a výpadek sítě. Exponenciálně s rozptylem, nejvýš pětkrát —
   tak to Google sám doporučuje. 401 se neopakuje, ten se řeší tokenem. */
function tmCalReq(path, opts, tok, attempt, owner = TM_CAL_OWNER, version = generation) {
  const guard=()=>{assertAccount(owner);if(version!==generation||tok!==TM_CAL_TOK||owner!==TM_CAL_OWNER)throw accountError();};
  try { guard(); if (!canRequest()) throw new Error("calendar-account-unavailable"); } catch (error) { return Promise.reject(error); }
  const n = attempt || 0;
  const o = opts || {};
  return fetcher(CAL_API + path, {
    method: o.method || "GET",
    headers: Object.assign({ Authorization: "Bearer " + tok }, o.body ? { "Content-Type": "application/json" } : {}, o.headers || {}),
    body: o.body ? JSON.stringify(o.body) : undefined,
  }).then((r) => {
    assertAccount(owner);
    guard();
    if (r.status === 401) { TM_CAL_TOK = null; TM_CAL_EXP = 0; tmCalTichoZapis(false); }
    if (r.status === 204) return {};
    return r.text().then((txt) => {
      assertAccount(owner);
      if(version!==generation)throw accountError();
      let j = null; try { j = txt ? JSON.parse(txt) : {}; } catch (e) { j = {}; }
      if (r.ok) return j;
      const reason = (((j.error || {}).errors || [])[0] || {}).reason || "";
      const err = new Error(reason || ("http-" + r.status));
      err.status = r.status; err.reason = reason; err.body = j;
      const retry = r.status === 429 || r.status >= 500 || (r.status === 403 && /rateLimit|userRateLimit/i.test(reason));
      if (retry && n < 4) {
        const wait = Math.min(Math.pow(2, n) * 1000 + Math.floor(Math.random() * 900), 32000);
        return new Promise((res) => setTimeout(res, wait)).then(() => tmCalReq(path, opts, tok, n + 1, owner, version));
      }
      throw err;
    });
  }, (netErr) => {
    guard();
    if (n < 3) {
      const wait = Math.min(Math.pow(2, n) * 1000 + Math.floor(Math.random() * 900), 8000);
      return new Promise((res) => setTimeout(res, wait)).then(() => tmCalReq(path, opts, tok, n + 1, owner, version));
    }
    throw netErr;
  });
}

/* CO SE MÁ V KALENDÁŘI OBJEVIT. Jediná funkce, která odpovídá na otázku
   „jak má vypadat pravda" — synchronizace pak jen dorovnává skutečnost
   k tomuhle seznamu. Obzor začíná DNESKEM: minulost se neposílá nikdy,
   protože kalendář není deník a hotová věc už nikomu nezabírá čas. */
function tmCalDesired(st, input) {
  const cfg = config(input);
  const out = [];
  const today = todayISO();
  const obecne = cfg.titles === "obecne";
  const opaque = () => cfg.busy === "vse";
  // rozvrh dne · hodinové bloky z vyplněných řádků
  if (cfg.rozvrh) {
    for (let i = 0; i <= Math.max(1, Number(cfg.horizon) || 14); i++) {
      const d = tmCalShift(today, i);
      const sched = (st.getDay(d) || {}).sched || {};
      Object.keys(sched).forEach((h) => {
        const row = sched[h] || {};
        const txt = String(row.text || "").trim();
        // co sem přinesl kalendář, se do kalendáře neposílá — jinak ozvěna
        if (!txt || row.done || row.src === "gcal") return;
        /* Roztažený blok jde do kalendáře jako JEDNA delší událost, ne jako
           řetěz hodinových. Délku nese `span`. */
        const sp = Math.max(1, Math.min(18, Number(row.span) || 1));
        out.push({
          key: "rz|" + d + "|" + h, kind: "rozvrh", date: d,
          time: row.calHour === h ? row.calTime || tmCalHH(h) : tmCalHH(h), mins: row.calHour === h && Math.ceil(row.calMinutes / 60) === sp ? row.calMinutes : sp * 60,
          title: obecne ? L("Praxe", "Practice") : txt, desc: "", busy: opaque("rozvrh"),
        });
      });
    }
  }
  const extra = role === "main" ? extraEvents(st, cfg) : [];
  return [...extra.filter(e => e.kind !== "motiv"), ...out, ...extra.filter(e => e.kind === "motiv")];
}
/* Tělo události. Celodenní má konec VÝLUČNÝ — jednodenní událost 29. 7.
   končí 30. 7.; kdo tam dá týž den, dostane událost nulové délky.
   U časovaných se posílá místní čas + jméno pásma, ne posun: Google si
   přechod na letní čas dopočítá sám a nám odpadá celá jedna třída chyb. */
function tmCalBody(ev, tz) {
  const b = {
    summary: ev.title || "—",
    description: (ev.desc || "") + (ev.desc ? "\n\n" : "") + "tanmay",
    transparency: ev.busy ? "opaque" : "transparent",
    reminders: { useDefault: false, overrides: [] },
    extendedProperties: { private: { tmApp: "1", tmKey: ev.key, tmKind: ev.kind } },
    status: "confirmed",
  };
  if (ev.allDay || !ev.time) {
    b.start = { date: ev.date };
    b.end = { date: tmCalShift(ev.date, 1) };
  } else {
    const [hh, mm] = ev.time.split(":").map((x) => parseInt(x, 10) || 0);
    const endM = hh * 60 + mm + (Number(ev.mins) || 60);
    const eh = Math.floor(endM / 60), em = endM % 60;
    const over = eh >= 24;
    b.start = { dateTime: ev.date + "T" + ev.time + ":00", timeZone: tz };
    b.end = { dateTime: (over ? tmCalShift(ev.date, 1) : ev.date) + "T" + String(over ? eh - 24 : eh).padStart(2, "0") + ":" + String(em).padStart(2, "0") + ":00", timeZone: tz };
  }
  return b;
}
const tmCalHash = (b) => { const s = JSON.stringify(b); let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };

/* ČTENÍ ZPĚT. Google → rozvrh dne.
   Dvě různé věci, které je potřeba nepomíchat:
   · z kalendáře „tanmay" se čte zadarmo — ten si aplikace vytvořila, takže
     na něj vidí z rozsahu, který už má;
   · z hlavního kalendáře se čte jen s NOVÝM oprávněním, které vidí úplně
     všechno. Proto se o něj říká teprve ve chvíli, kdy si to člověk zapne,
     ne dopředu do zásoby. Google to sám doporučuje: „Nežádej o přístup
     k datům při prvním přihlášení, pokud to není nutné pro jádro aplikace."

   PRAVIDLA, KTERÁ CHRÁNÍ NAPSANÉ. Řádek, do kterého člověk sám něco napsal,
   se nikdy nepřepíše — ani se do něj nepřipisuje. Zapisuje se jen do
   prázdných a do těch, které sem předtím přinesl kalendář (ty nesou značku
   src: "gcal"). Když událost v Googlu zmizí nebo se přesune, její řádek se
   uklidí — ale jen pokud ho mezitím nikdo nepřepsal.

   A HLAVNĚ: co přišlo z kalendáře, se nikdy neposílá zpátky do kalendáře.
   Bez toho by vznikla smyčka, kde si aplikace donekonečna přepisuje vlastní
   ozvěnu. Proto tmCalDesired řádky se značkou src: "gcal" přeskakuje. */
const CAL_READ_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
const CAL_WRITE_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const tmCalScopeFor = (cfg) => (cfg && cfg.zpet === "vse") ? (CAL_SCOPE + " " + (cfg.allDayWrite ? CAL_WRITE_SCOPE : CAL_READ_SCOPE)) : CAL_SCOPE;
const tmCalReady = cfg => tmCalLive() && TM_CAL_CID === config(cfg).clientId && tmCalScopeFor(config(cfg)).split(' ').every(s=>TM_CAL_GRANT.split(' ').includes(s));
const tmCalMaZapis = () => TM_CAL_GRANT.split(" ").includes(CAL_WRITE_SCOPE);
const tmCalMaCteni = () => tmCalMaZapis() || TM_CAL_GRANT.split(" ").includes(CAL_READ_SCOPE);
const tmCalHourKey = (h) => String(h) + ":00";
/* Z RFC3339 na hodinu rozvrhu v místním čase. Rozvrh má řádky po hodinách
   od 6:00 do 23:00; událost v 9:37 patří do řádku 9:00. Nepředstírá se
   přesnost, kterou rozvrh nemá. Co padne mimo, se nebere — není kam. */
function tmCalSlot(dt) {
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return null;
    const h = d.getHours();
    if (h < 6 || h > 23) return null;
    return { date: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"), hour: tmCalHourKey(h) };
  } catch (e) { return null; }
}
function tmCalPull(st, cfg, tok) {
  const dnes = todayISO();
  const konec = tmCalShift(dnes, Math.max(1, Number(cfg.horizon) || 14));
  const min = new Date(dnes + "T00:00:00").toISOString();
  const max = new Date(konec + "T23:59:59").toISOString();
  const kalendare = [];
  if (cfg.calId) kalendare.push(cfg.calId);
  if (cfg.zpet === "vse") kalendare.push("primary");
  if (!kalendare.length) return Promise.resolve({ vlozeno: 0, uklizeno: 0 });

  const q = "?timeMin=" + encodeURIComponent(min) + "&timeMax=" + encodeURIComponent(max)
    + "&singleEvents=true&orderBy=startTime&maxResults=2500&showDeleted=false";
  return Promise.all(kalendare.map((id) =>
    listCalendarEvents(p => tmCalReq(p, null, tok), "/calendars/" + encodeURIComponent(id) + "/events", q)
  )).then((davky) => {
    const najdeno = {}; // date -> hour -> { gid, text }
    davky.forEach((items) => items.forEach((ev) => {
      if (!ev || ev.status === "cancelled") return;
      // co poslala tahle aplikace, se zpátky nečte — jinak ozvěna
      const pr = ((ev.extendedProperties || {}).private) || {};
      if (pr.tmApp === "1") return;
      // celodenní do hodinového rozvrhu nepatří
      if (!ev.start || !ev.start.dateTime) return;
      // odmítnutá pozvánka není plán
      if ((ev.attendees || []).some((a) => a.self && a.responseStatus === "declined")) return;
      const s = tmCalSlot(ev.start.dateTime);
      if (!s || s.date < dnes || s.date > konec) return;
      const txt = String(ev.summary || "").trim() || L("(bez názvu)", "(untitled)");
      /* Delší událost obsadí tolik hodin, kolik trvá — do rozvrhu se
         nevejde přesná délka, ale počet hodin ano a je to poctivější než
         udělat ze schůzky na tři hodiny jednohodinový řádek. */
      let sp = 1;
      try {
        const kon = ev.end && ev.end.dateTime ? new Date(ev.end.dateTime).getTime() : 0;
        const zac = new Date(ev.start.dateTime).getTime();
        if (kon > zac) sp = Math.max(1, Math.min(18, Math.round((kon - zac) / 3600000)));
      } catch (e2) {}
      najdeno[s.date] = najdeno[s.date] || {};
      const cur = najdeno[s.date][s.hour];
      /* Táž událost může ležet ve dvou kalendářích naráz. Bez porovnání
         podle id by se do řádku zapsala dvakrát za sebou. */
      if (cur && cur.ids.indexOf(ev.id) >= 0) return;
      najdeno[s.date][s.hour] = cur
        ? { ids: cur.ids.concat([ev.id]), gid: cur.gid + "," + ev.id, text: cur.text + " · " + txt, span: Math.max(cur.span || 1, sp) }
        : { ids: [ev.id], gid: ev.id, text: txt, span: sp };
    }));

    let vlozeno = 0, uklizeno = 0;
    for (let i = 0; i <= Math.max(1, Number(cfg.horizon) || 14); i++) {
      const d = tmCalShift(dnes, i);
      const sched = Object.assign({}, (st.getDay(d) || {}).sched || {});
      const chce = najdeno[d] || {};
      let zmena = false;
      // co přibylo nebo se změnilo
      Object.keys(chce).forEach((h) => {
        const row = sched[h] || {};
        const naps = String(row.text || "").trim();
        const cizi = naps && row.src !== "gcal";
        if (cizi) return;                                   // napsané se nesahá
        if (row.src === "gcal" && row.gid === chce[h].gid && naps === chce[h].text && (row.span || 1) === (chce[h].span || 1)) return;
        sched[h] = { ...row, text: chce[h].text, span: chce[h].span || 1, src: "gcal", gid: chce[h].gid };
        zmena = true; vlozeno++;
      });
      // co z kalendáře zmizelo · uklidit, ale jen vlastní stopu
      Object.keys(sched).forEach((h) => {
        const row = sched[h] || {};
        if (row.src !== "gcal" || chce[h]) return;
        const zbytek = { ...row };
        delete zbytek.src; delete zbytek.gid; delete zbytek.span; zbytek.text = "";
        sched[h] = zbytek;
        zmena = true; uklizeno++;
      });
      if (zmena) {
        const before = (st.getDay(d) || {}).sched || {};
        st.updateDay(d, current => {
          const next = {...(current.sched || {})};
          for (const [hour, row] of Object.entries(sched)) if (JSON.stringify(current.sched?.[hour] || {}) === JSON.stringify(before[hour] || {})) next[hour] = row;
          return {sched:next};
        });
      }
    }
    return { vlozeno: vlozeno, uklizeno: uklizeno };
  });
}

/* Vytvoří kalendář, když ještě není. Vrací jeho id. */
function tmCalEnsure(cfg, tok, save, znovu) {
  if (cfg.calId) {
    return tmCalReq("/calendars/" + encodeURIComponent(cfg.calId), null, tok)
      .then(() => cfg.calId, (e) => {
        /* Kalendář v Googlu zmizel — smazal ho člověk ručně. Vyrobí se
           nový, ALE musí se zapomenout i stín: ten si pamatuje, co už je
           odesláno, a bez vymazání by nový kalendář zůstal navždy prázdný. */
        if (e.status === 404 || e.status === 410) { if (znovu) znovu(); return tmCalEnsure(Object.assign({}, cfg, { calId: "" }), tok, save, znovu); }
        throw e;
      });
  }
  return tmCalReq("/calendars", { method: "POST", body: { summary: cfg.calName || "tanmay", timeZone: tmCalTz(), description: role === "client" ? L("Rozvrh dne a celodenní události z aplikace tanmay.", "Day schedule and all-day events from the tanmay app.") : L("Praxe, trénink a rozvrh z aplikace tanmay. Celodenní události se synchronizují oběma směry.", "Practice, training and schedule from the tanmay app. All-day events sync both ways.") } }, tok)
    .then((cal) => {
      save({ calId: cal.id });
      return tmCalReq("/users/me/calendarList/" + encodeURIComponent(cal.id) + "?colorRgbFormat=true",
        { method: "PATCH", body: { backgroundColor: BRAND.copper, foregroundColor: BRAND.linen, selected: true } }, tok)
        .then(() => cal.id, () => cal.id);
    });
}
/* Vlastní srovnání. Události mají stabilní id, podmíněný PATCH a bezpečný POST. Zápis je
   idempotentní, takže opakování nikdy nevyrobí dvojnici. 404 znamená
   „ještě není", 409 „už je". Mazání je měkké (status: cancelled), ne tvrdé:
   znovupoužití tvrdě smazaného id Google nikde neslibuje, kdežto vzkříšení
   zrušené události je jen další PUT.
   NÁHROBKY: co člověk smaže přímo v Googlu, se už nikdy nevrátí. Kalendář
   musí poslouchat toho, komu patří — appka, která si své události vrací
   zpátky, je ta nejrychlejší cesta, jak o člověka přijít. */
let TM_CAL_SYNC = null, TM_CAL_SYNC_OWNER = null;
function tmCalSync(st, opts) {
  const owner = getAccount();
  const version=generation;
  try { assertAccount(owner);if(!canRequest())throw new Error('calendar-account-unavailable'); } catch(error) { return Promise.reject(error); }
  if (TM_CAL_SYNC && TM_CAL_SYNC_OWNER === owner) return TM_CAL_SYNC;
  const cfg=config({...st.calCfg(),...(opts?.interactive?{allDayWrite:true}:{})});
  if(!opts?.interactive&&!tmCalReady(cfg))return Promise.reject(new Error('calendar-permission-required'));
  // Start OAuth inside the click, before asynchronous account verification.
  // Calendar reads and writes still wait for that verification below.
  const authorization=tmCalAuth(cfg.clientId,!!opts?.interactive,tmCalScopeFor(cfg));
  TM_CAL_SYNC_OWNER = owner;
  const task = Promise.all([authorization,Promise.resolve(verifyAccount())]).then(([tok,ok]) => {
    assertAccount(owner);
    if(version!==generation)throw accountError();
    if (!ok) throw new Error("calendar-account-unavailable");
    return tmCalSyncRun(scopedStore(st,owner,version),opts,tok);
  }).finally(() => { if (TM_CAL_SYNC === task) { TM_CAL_SYNC = null; TM_CAL_SYNC_OWNER = null; } });
  TM_CAL_SYNC = task;
  return task;
}
function tmCalSyncRun(st, opts, token) {
  const o = opts || {};
  const cfg = config({...st.calCfg(), ...(o.interactive ? {allDayWrite:true} : {})});
  if (!cfg.clientId) return Promise.reject(new Error("no-client-id"));
  const tz = tmCalTz();
  const shadow = Object.fromEntries(Object.entries(st.coll.calShadow || {}).filter(([key]) => role !== "client" || key.startsWith("rz|")).map(([key,value]) => [key,{...value}]));
  let blockedSchedule = new Set();
  const tomb = Object.fromEntries(Object.entries(st.coll.calTomb || {}).filter(([key]) => role !== "client" || key.startsWith("rz|")));
  let calId = "";
  const res = { pridano: 0, zmeneno: 0, smazano: 0, chyby: 0 };
  return Promise.resolve(token)
    .then((tok) => tmCalEnsure(cfg, tok, (p) => st.setCalCfg(p), () => { Object.keys(shadow).forEach((k) => delete shadow[k]); }).then((id) => { calId = id; return tok; }))
    .then(async tok=>{
      st.calendarGuard();
      const request=async(path,options)=>{st.calendarGuard();const data=await tmCalReq(path,options,tok);st.calendarGuard();return data;};
      if(role==='client'){
        const result=await syncClientTrainingCalendar({st,cfg,calId,request,from:todayISO(),to:tmCalShift(todayISO(),Math.max(1,+cfg.horizon||14)+1),L});
        res.chyby+=result.errors+result.conflicts.length;res.zmeneno+=result.changes;
        if(result.errors||result.conflicts.length)res.prvni=L('Některý termín tréninku se změnil na obou místech. Zkontroluj ho, hotové tréninky zůstaly zachované.','A workout date changed in both places. Review it; completed workouts were preserved.');
      }
      if(cfg.cycle){
        const api=async(path,method='GET',body,accountKey)=>{
          st.calendarGuard();
          const response=await fetcher(path,{method,credentials:'same-origin',cache:'no-store',headers:{...(body?{'Content-Type':'application/json'}:{}),...(accountKey?{'X-Tanmay-Account-Key':accountKey}:{})},...(body?{body:JSON.stringify(body)}:{})});
          const data=await response.json();st.calendarGuard();if(!response.ok||!data.ok)throw new Error(data.error||'cycle-sync-unavailable');return data;
        };
        const result=await syncOwnCycleCalendar({cfg,request,api,saveConfig:st.setCalCfg,makeId:tmB32,today:todayISO(),lang:L('cs','en'),guard:st.calendarGuard});
        res.chyby+=result.errors;
        if(result.errors)res.prvni=L('Některé datum cyklu čeká na kontrolu. Smazání v Googlu nemaže zapsanou menstruaci v aplikaci.','A cycle date needs review. Deleting a Google copy does not delete a recorded period in the app.');
      }
      return tok;
    })
    .then(async (tok) => {
      if(o.interactive && cfg.zpet === "vse")st.setCalCfg({allDayWrite:tmCalMaZapis()});
      const before = st.coll.calendarAllDay || [];
      const calendars = [calId, ...(cfg.zpet === "vse" && tmCalMaCteni() ? ["primary"] : [])];
      const pulled = await syncAllDay({rows:before, calendars, defaultCalendar:calId, from:todayISO(), to:tmCalShift(todayISO(), Math.max(1, +cfg.horizon || 14) + 1), request:(path, opts)=>tmCalReq(path,opts,tok), makeId:tmB32, readOnlyCalendars:tmCalMaZapis()?[]:["primary"]});
      st.setCalendarAllDay(current=>mergeAllDaySync(current,before,pulled.rows));
      res.chyby += pulled.errors;
      if(pulled.errors)res.prvni = L("Celodenní události čekají na další synchronizaci.", "All-day events await another sync.");
      return tok;
    })
    .then(async (tok) => {
      const path = "/calendars/" + encodeURIComponent(calId) + "/events";
      const events = await listCalendarEvents(p => tmCalReq(p, null, tok), path, "?showDeleted=true&maxResults=2500&privateExtendedProperty=" + encodeURIComponent("tmApp=1"));
      const result = await reconcileSchedule({shadow, tomb, desired:()=>tmCalDesired({...st,getDay:st.getCalendarDay}, cfg), events,
        request:p=>tmCalReq(p,null,tok), path, bodyFor:ev=>tmCalBody(ev,tz), hash:tmCalHash,
        getDay:st.getCalendarDay, updateDays:st.updateCalendarDays, slot:tmCalSlot});
      blockedSchedule = result.blocked;
      if(result.conflicts.length) {res.chyby += result.conflicts.length;res.prvni=L("Blok rozvrhu se změnil na obou místech nebo jeho nový čas koliduje s plánem. Nic se nepřepsalo. Sjednoť tento blok v kalendáři a plánu dne a synchronizuj znovu.","A schedule block changed in both places or its new time conflicts with the plan. Nothing was overwritten. Reconcile the block in the calendar and day plan, then sync again.");}
      return tok;
    })
    .then((tok) => {
      const want = tmCalDesired({...st,getDay:st.getCalendarDay}, cfg).filter((e) => (!tomb[e.key] || e.key.startsWith("rz|")) && !blockedSchedule.has(e.key));
      const wantBy = {};
      want.forEach((e) => { wantBy[e.key] = e; });
      const base = "/calendars/" + encodeURIComponent(calId) + "/events/";
      const jobs = [];
      want.forEach((ev) => {
        const gid = shadow[ev.key]?.gid || tmB32(ev.key + (tomb[ev.key] ? "|" + (tomb[ev.key].gid || "replacement") : ""));
        const body = tmCalBody(ev, tz);
        const h = tmCalHash(body);
        const prev = shadow[ev.key];
        if (prev && prev.h === h && prev.gid === gid) return;
        jobs.push(() => writeCalendarEvent({request:(p,options)=>tmCalReq(p,options,tok),path:base.slice(0,-1),gid,body,previous:prev})
          .then(saved => { if(prev)res.zmeneno++;else res.pridano++;shadow[ev.key]={gid,h,base:eventFields(body),etag:saved.etag}; })
          .catch((e) => { res.chyby++; if (!res.prvni) res.prvni = e.status === 412 || e.status === 409 ? L("Událost se mezitím změnila. Synchronizuj znovu, aby se změny bezpečně porovnaly.","The event changed meanwhile. Sync again to compare the changes safely.") : e.reason || e.message; }));
      });
      // co v pravdě už není · měkce zrušit a zapomenout
      Object.keys(shadow).forEach((key) => {
        if (wantBy[key] || blockedSchedule.has(key)) return;
        const gid = shadow[key].gid;
        jobs.push(() => tmCalReq(base + gid, { method: "PATCH", headers: shadow[key].etag ? {"If-Match":shadow[key].etag} : {}, body: { status: "cancelled" } }, tok)
          .then(() => { res.smazano++; if(key.startsWith("rz|"))tomb[key]={gid}; delete shadow[key]; },
            (e) => { if (e.status === 404 || e.status === 410) { delete shadow[key]; return; } throw e; })
          .catch((e) => { res.chyby++; if (!res.prvni) res.prvni = e.reason || e.message; }));
      });
      return tmCalPool(jobs, 5).then(() => tok);
    })
    .then((tok) => {
      // NÁHROBKY · co zmizelo v Googlu, se sem už nesmí vrátit
      const gids = {};
      Object.keys(shadow).forEach((k) => { gids[shadow[k].gid] = k; });
      if (!Object.keys(gids).length) return tok;
      return listCalendarEvents(p=>tmCalReq(p,null,tok), "/calendars/" + encodeURIComponent(calId) + "/events", "?showDeleted=true&maxResults=2500&privateExtendedProperty=" + encodeURIComponent("tmApp=1"))
        .then((list) => {
          list.forEach((it) => {
            if (it.status !== "cancelled") return;
            const key = gids[it.id];
            if (!key || key.startsWith("rz|")) return;
            tomb[key] = 1; delete shadow[key];
          });
        }, () => {})
        .then(() => tok);
    })
    .then((tok) => {
      /* Až po zápisu se čte zpět. V tomhle pořadí schválně: kdyby se četlo
         napřed, přišla by ozvěna vlastních událostí ještě dřív, než se stihne
         zapsat, co je nové. */
      if (!cfg.zpet) return null;
      if (cfg.zpet === "vse" && !tmCalMaCteni()) { res.bezCteni = 1; return null; }
      return tmCalPull({...st,getDay:st.getCalendarDay}, cfg, tok).then((p) => { res.vlozeno = p.vlozeno; res.uklizeno = p.uklizeno; }, (e) => { res.chyby++; res.prvni = e.message || "calendar-read-failed"; });
    })
    .then(() => {
      st.setCalState({ shadow: shadow, tomb: tomb });
      st.setCalCfg({ lastSync: Date.now(), lastErr: res.chyby ? String(res.prvni || "err") : "", lastCount: Object.keys(shadow).length });
      return res;
    }, (e) => {
      // Keep acknowledgements for already-applied remote rows if a later read fails.
      st.setCalState({ shadow, tomb });
      st.setCalCfg({ lastErr: e && (e.reason || e.message) ? String(e.reason || e.message) : "err" });
      throw e;
    });
}
/* Souběžnost pět · dvacet zápisů proběhne ve čtyřech kolech a chyba
   zůstane čitelná u konkrétní položky. Dávkový endpoint Google zrušil. */
function tmCalPool(jobs, n) {
  let i = 0;
  const run = () => (i >= jobs.length ? Promise.resolve() : jobs[i++]().then(run));
  return Promise.all(Array.from({ length: Math.min(n, jobs.length || 1) }, run));
}
/* Odpojení · smazat kalendář je jedna žádost a odnese všechno, co appka
   kdy vytvořila. Pak odvolat token, ať nezůstane viset oprávnění. */
function tmCalDisconnect(store, smazat) {
  const owner = getAccount();
  try { assertAccount(owner); } catch(error) { return Promise.reject(error); }
  generation++;authTask=null;authKey='';TM_CAL_SYNC=null;TM_CAL_SYNC_OWNER=null;
  const st = scopedStore(store,owner);
  const cfg = config(st.calCfg());
  const fin = () => {
    assertAccount(owner);
    try { if (TM_CAL_TOK && window.google && window.google.accounts && window.google.accounts.oauth2) window.google.accounts.oauth2.revoke(TM_CAL_TOK, () => {}); } catch (e) {}
    TM_CAL_TOK = null; TM_CAL_EXP = 0; TM_CAL_CLIENT = null; TM_CAL_CID = ""; TM_CAL_OWNER = null;
    st.setCalState({ shadow: {}, tomb: {} });
    st.setCalCfg({ calId: "", cycle:false, lastSync: 0, lastErr: "", lastCount: 0 });
  };
  if (!smazat || !cfg.calId || !cfg.clientId) { fin(); return Promise.resolve({ smazano: false }); }
  // Selhané smazání se dřív spolklo a odpojení se ohlásilo jako „Kalendář
  // smazán." Kalendář přitom v Googlu zůstal — a s ním zmizelo i jeho id,
  // takže druhý pokus už nebylo z čeho udělat. Odpojíme se vždycky, ale
  // řekneme pravdu o tom, co se smazat povedlo.
  return tmCalAuth(cfg.clientId, false)
    .then((tok) => tmCalReq("/calendars/" + encodeURIComponent(cfg.calId), { method: "DELETE" }, tok))
    .then(() => { fin(); return { smazano: true }; },
          () => { fin(); return { smazano: false, chyba: true }; });
}
/* Bez Googlu · týž seznam událostí jako soubor .ics. Skládání řádků po
   75 oktetech a CRLF nejsou hnidopišství: Outlook na dlouhém řádku
   spadne a Apple na LF bez CR taky. */
function tmCalIcs(st) {
  const cfg = config(st.calCfg());
  const evs = tmCalDesired(st, cfg);
  const tz = tmCalTz();
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = (x) => String(x || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  let out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//tanmay//praxe//CS", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:" + esc(cfg.calName || "tanmay"), "X-WR-TIMEZONE:" + tz];
  evs.forEach((ev) => {
    out.push("BEGIN:VEVENT", "UID:" + tmB32(ev.key) + "@tanmay", "DTSTAMP:" + stamp, "SEQUENCE:0");
    if (ev.allDay || !ev.time) {
      out.push("DTSTART;VALUE=DATE:" + ev.date.replace(/-/g, ""), "DTEND;VALUE=DATE:" + tmCalShift(ev.date, 1).replace(/-/g, ""));
    } else {
      /* UTC, ne TZID. Odkaz na pásmo bez přiloženého bloku VTIMEZONE je
         podle RFC 5545 neúplný a Outlook takový soubor odmítá; „Z" rozumí
         každý. Okamžik se počítá přes místní Date, takže letní čas sedí. */
      const [yy, mo, dd] = ev.date.split("-").map((x) => parseInt(x, 10));
      const [h0, m0] = ev.time.split(":").map((x) => parseInt(x, 10));
      const z = new Date(yy, mo - 1, dd, h0, m0, 0).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      out.push("DTSTART:" + z, "DURATION:PT" + (Number(ev.mins) || 60) + "M");
    }
    out.push("SUMMARY:" + esc(ev.title));
    if (ev.desc) out.push("DESCRIPTION:" + esc(ev.desc));
    out.push("TRANSP:" + (ev.busy ? "OPAQUE" : "TRANSPARENT"), "END:VEVENT");
  });
  out.push("END:VCALENDAR");
  return tmCalIcsLines(out.join("\n")).join("\r\n") + "\r\n";
}


return {role,config,CAL_DEF,CAL_KINDS,tmCalPrepare,tmCalLoad:tmCalGis,tmCalReady,tmCalAccount:getAccount,tmCalDesired,tmCalBody,tmCalHash,tmCalTz,tmCalLive,tmCalAvailable,tmCalAuth,tmCalScopeFor,tmCalMaCteni,tmCalSync,tmCalDisconnect,tmCalIcs,tmCalTichoZakazano,tmCalTichoZapis,tmOrigin};
}

export function tmCalIcsLines(s) {
  const out = [];
  String(s).split("\n").forEach((line) => {
    let cur = "", bytes = 0;
    for (const ch of line) {
      const n = new Blob([ch]).size;
      if (bytes + n > 74) { out.push(cur); cur = " "; bytes = 1; }
      cur += ch; bytes += n;
    }
    out.push(cur);
  });
  return out;
}
