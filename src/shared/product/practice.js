// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/product/practice.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// PRAXE · den, návyky, obloha, otázky, tělo, prahy
// ----------------------------------------------------------------------
// Praxe existovala v obou domech dvakrát a rozešla se: klientská verze
// neznala tři znamení, týdenní podněty, prahy dne ani přehled praxe.
// Tohle je doména a chování — jeden kanonický zdroj. Vzhled zůstává
// v aplikaci; role rozhoduje o tom, co se z toho vykreslí.
//
// Bez DOMu a bez Reactu, aby se to dalo spustit v testu. Komponenty, které
// z toho žijí, jsou v ui/practice.jsx.

import { L, getLang } from "../lang/lang.js";

/** Prázdný den · devět slotů návyků. */
export const EMPTY_H = [0, 0, 0, 0, 0, 0, 0, 0, 0];

/* Datum je místní, ne UTC. Půlnoc v Praze je pořád tentýž den; kdyby se
   počítalo v UTC, večerní zápis by v létě spadl na zítřek. */
export function todayISO() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
export function shiftISO(iso, delta) { const [y, m, d] = iso.split("-").map(Number); const dt = new Date(y, m - 1, d); dt.setDate(dt.getDate() + delta); return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0"); }

// ----------------------------------------------------------------------
// REAL DATA (pulled from Notion)
// ----------------------------------------------------------------------
// Krajina mluví oběma jazyky — názvy oblastí jsou data, tohle je jejich český hlas.
export const AREA_CZ = {
  "Partnership": "Partnerství", "Art": "Umění", "Friendship": "Přátelství", "Financials": "Finance",
  "Brand building": "Budování značky", "Adventure": "Dobrodružství", "Soul": "Duše", "Family": "Rodina",
  "Mental halth": "Duševní zdraví", "Mental Health": "Duševní zdraví", "Health": "Zdraví", "Movement": "Pohyb",
  "holistic body control": "Tělo", "Body": "Tělo", "General health": "Zdraví", "Blood Family wellfear": "Rodina",
  "Brotherhood / Sisterhood": "Přátelství", "Financial freedom": "Finance", "Finances": "Finance",
  "Tanamy flow": "Podnikání", "Business": "Podnikání", "Adventure life": "Dobrodružství",
  "Soul embodyment": "Smysl a směr", "Life mission": "Smysl a směr", "Soul embodyment 📿🔥": "Smysl a směr",
};
export const AREA_EN = {
  "Brotherhood / Sisterhood": "Friendship", "Adventure life": "Adventure", "Financial freedom": "Finances",
  "Tanamy flow": "Business", "holistic body control": "Body", "Soul embodyment": "Life mission",
  "Blood Family wellfear": "Family", "General health": "Health", "Mental halth": "Mental health",
};
export const areaClean = (n) => String(n || "").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").trim();

export const areaLabel = (n) => {
  const M = getLang() === "cs" ? AREA_CZ : AREA_EN;
  const key = String(n || "").trim();
  const hit = M[key] != null ? M[key] : M[areaClean(key)];
  if (hit == null) return n;
  // emoji z původního jména si necháme za přeloženým názvem
  const emo = key.replace(areaClean(key), "").trim();
  return emo ? hit + " " + emo : hit;
};

// Krajiny života · jen jméno a znak. Hodnocení krajiny je hodnocení jednoho
// člověka: do sdíleného osiva nepatří, protože by se ukázalo každému novému
// klientovi jako jeho vlastní „poslední hodnocení". (Audit 2026-08-25: čtyři
// osobní známky tu ležely od importu a klientský Kompas je vypisoval.)
export const AREAS = [
  { name: "Body", icon: "💪🏼" },
  { name: "General health", icon: "🌿" },
  { name: "Mental Health", icon: "🫀" },
  { name: "Partnership", icon: "❤️‍🔥" },
  { name: "Blood Family wellfear", icon: "✨" },
  { name: "Friendship", icon: "✊🏼" },
  { name: "Finances", icon: "🌍" },
  { name: "Business", icon: "◈" },
  { name: "Adventure", icon: "🚐" },
  { name: "Art", icon: "🎸" },
  { name: "Life mission", icon: "🌊" },
];

// výchozí praxe · bilingual defaults [icon, cz, en] — resolved at render via L,
// custom renames (with .name) always win; history binds to slots, never names
export const HABIT_DEFS=[["🌊","Ztišení a příprava","Settle and prepare"],["🌾","Práce na značce","Brand work"],["🎸","Tvorba","Create"],["💪","Trénink","Training"],["💾","Čas bez obrazovek","Time away from screens"],["📚","Soustředěné studium","Focused study"],["📿","Jóga a mobilita","Yoga and mobility"],["🔥","Meditace","Meditation"],["🥑","Jíst s pozorností","Eat with attention"]];
export const HABIT_DEFAULTS = HABIT_DEFS.map(([icon, cz, en], i) => ({ slot: i, icon, cz, en }));

export function fmtCZ(iso) { const [y, m, d] = iso.split("-").map(Number); return d + ". " + m + ". " + y; }
export const tmNorm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const DAY_STATUS_DEFS = [
  { key: "attention", cz: "Mimo kontakt", en: "Out of contact", stare: ["Odpojenost", "Disconnection"] },
  { key: "fulfilled", cz: "V kontaktu", en: "In contact", stare: ["Přítomnost", "Presence"] },
  { key: "wuwei", cz: "V souladu", en: "In accord", stare: ["Mistrovství", "Mastery"] },
];

// ---- NEBE NA PRAHU · the sky over Prague, computed locally -------------------
// "Listen to the wild" inside a room means at least knowing what the sky is
// doing. Moon phase from the synodic month, sunset from the standard solar
// equation (Ed Williams / NOAA). No API, no request — the sky is arithmetic.
export const SKY_LAT = 50.08, SKY_LON = 14.44; // Praha · the sky this practice lives under

export const moonPhaseOf = (iso) => {
  const dt = new Date(iso + "T12:00:00Z").getTime();
  const syn = 29.530588853;
  const ref = Date.UTC(2000, 0, 6, 18, 14); // a known new moon
  return ((((dt - ref) / 86400000) % syn + syn) % syn) / syn; // 0 nov · 0.5 úplněk
};

export const moonName = (ph) => {
  const i = Math.round(ph * 8) % 8;
  return L(
    ["nov", "dorůstající srpek", "první čtvrť", "dorůstající měsíc", "úplněk", "couvající měsíc", "poslední čtvrť", "ubývající srpek"][i],
    ["new moon", "waxing crescent", "first quarter", "waxing gibbous", "full moon", "waning gibbous", "last quarter", "waning crescent"][i]
  );
};

export const sunsetOf = (iso) => {
  const [Y, Mo, D] = iso.split("-").map(Number);
  const rad = Math.PI / 180;
  const day = Math.floor((Date.UTC(Y, Mo - 1, D) - Date.UTC(Y, 0, 0)) / 86400000);
  const lngHour = SKY_LON / 15;
  const tt = day + (18 - lngHour) / 24;
  const M = 0.9856 * tt - 3.289;
  let Ls = M + 1.916 * Math.sin(M * rad) + 0.020 * Math.sin(2 * M * rad) + 282.634;
  Ls = ((Ls % 360) + 360) % 360;
  let RA = Math.atan(0.91764 * Math.tan(Ls * rad)) / rad;
  RA = ((RA % 360) + 360) % 360;
  RA += Math.floor(Ls / 90) * 90 - Math.floor(RA / 90) * 90;
  RA /= 15;
  const sinDec = 0.39782 * Math.sin(Ls * rad);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(SKY_LAT * rad)) / (cosDec * Math.cos(SKY_LAT * rad));
  if (cosH < -1 || cosH > 1) return "";
  const H = Math.acos(cosH) / rad / 15;
  const T = H + RA - 0.06571 * tt - 6.622;
  const UT = (((T - lngHour) % 24) + 24) % 24;
  return new Date(Date.UTC(Y, Mo - 1, D, 0, Math.round(UT * 60))).toLocaleTimeString(getLang() === "cs" ? "cs-CZ" : "en-GB", { timeZone: "Europe/Prague", hour: "2-digit", minute: "2-digit" });
};

export const PLAN_QS = [
  { key: "uznani", cz: "Co dnes stojí za uznání?", en: "What deserves acknowledgement today?",
    phCz: "Jedna věc, kterou nechceš přejít bez povšimnutí.", phEn: "One thing you don't want to pass over." },
  { key: "odnest", cz: "Co si chci z dneška odnést?", en: "What do I want to take from today?",
    phCz: "Co nechceš z dneška zapomenout?", phEn: "What don't you want to forget from today?" },
  { key: "next", cz: "Jaký je zítřejší první krok?", en: "What is tomorrow's first step?",
    phCz: "Jedna konkrétní věc, kterou zítra začneš.", phEn: "One concrete thing you will start tomorrow." },
];

// JÍT HLOUBĚJI · možnost pokračovat, ne další patro. Bez nápovědy pod polem —
// tyhle dvě otázky si nezaslouží pobízení.
export const PLAN_QS_HLOUBKA = [
  { key: "smer", cz: "Co dnes podpořilo směr, kterým chci žít?", en: "What supported the direction I want to live in today?" },
  { key: "odvraceni", cz: "Kde jsem se dnes odvrátil od toho, co bylo důležité? Co jsem v tu chvíli potřeboval?", en: "Where did I turn away from what mattered today? What did I need in that moment?" },
];

// DŘÍVĚJŠÍ OTÁZKY · nikdy se nesmažou a nikdy se nepřepíšou novou otázkou.
// Ukazují se jen u dnů, kde na ně někdo odpověděl.
export const PLAN_QS_STARE = [
  { key: "vision", cz: "Co jsem dnes udělal pro svou dlouhodobou vizi?", en: "What did I do today that moves me closer to my long-term vision?" },
  { key: "ease", cz: "Kde jsem se dnes odvrátil? A dokážu tomu místu vyjít vstříc se soucitem?", en: "Where did I turn away today — and can I meet that place with compassion?" },
  { key: "proud", cz: "Na co jsem hrdý?", en: "What am I proud of?" },
  { key: "insights", cz: "Vhledy k zapamatování", en: "Insights to remember" },
];

// Owner-supplied Czech prompts in the requested order; English translations for language switching.
// The existing weekly rotation and alternate-prompt control use this replacement collection.
export const TM_PROMPTS = [
  {"k":"telo","cz":"Kde v těle nosíš tento týden? Najdi to místo a popiš, co tam je: teplo, tah, tíha, nebo prázdno.","en":"Where in your body are you carrying this week? Find the place and describe what is there: warmth, tension, heaviness, or emptiness."},
  {"k":"praxe","cz":"Piš patnáct minut v kuse o tom, co tě teď nejvíc zaměstnává. Piš, co si o tom opravdu myslíš a co u toho cítíš. Nezastavuj se a nehlídej, jak to vypadá.","en":"Write for fifteen minutes without stopping about what is occupying you most right now. Write what you really think about it and how you feel. Keep going without worrying about how it looks."},
  {"k":"praxe","cz":"Napiš tři věci, které se tento týden povedly. Ke každé napiš, proč se to stalo.","en":"Write down three things that went well this week. For each one, write why it happened."},
  {"k":"odvraceni","cz":"Popiš jednu těžkou situaci z tohoto týdne ve třetí osobě. Piš o sobě jménem, jako o někom jiném. Co teď vidíš, co jsi předtím neviděl?","en":"Describe one difficult situation from this week in the third person. Use your name as if you were writing about someone else. What can you see now that you could not see before?"},
  {"k":"odvraceni","cz":"Napiš, co si na sobě tento týden nejvíc vyčítáš. Pak napiš odpověď od někoho, kdo tě má rád bez podmínek.","en":"Write what you have blamed yourself for most this week. Then write a reply from someone who loves you unconditionally."},
  {"k":"telo","cz":"Najdi pocit, který je teď v těle nejsilnější. Dej mu jedno přesné slovo. Zkus, jestli to slovo sedí. Když nesedí, hledej dál.","en":"Find the strongest feeling in your body right now. Give it one precise word. See whether the word fits. If it does not, keep looking."},
  {"k":"odvraceni","cz":"Která myšlenka se ti tento týden vracela nejčastěji? Napiš, co mluví pro ni a co proti ní. Co jiného by mohlo být pravda?","en":"Which thought returned most often this week? Write what supports it and what goes against it. What else might be true?"},
  {"k":"smer","cz":"Vyber jednu věc, na které ti opravdu záleží. Kdy naposledy rozhodla o tom, co uděláš?","en":"Choose one thing that truly matters to you. When did it last determine what you would do?"},
  {"k":"druzi","cz":"Co jsi tento týden dostal? Co jsi dal? Komu jsi způsobil potíže? Odpověz na všechny tři otázky konkrétně, se jmény.","en":"What did you receive this week? What did you give? Who did you cause trouble for? Answer all three questions with specific details and names."},
  {"k":"praxe","cz":"Projdi tento týden: co jsi udělal dobře, kde jsi uklouzl a co zůstalo nedodělané? Nesuď se, jen zapiš.","en":"Look back over this week: what did you do well, where did you slip, and what remains unfinished? Do not judge yourself; just write it down."},
  {"k":"odvraceni","cz":"Čeho se teď nejvíc bojíš? Napiš, co nejhoršího by se mohlo stát. Pak napiš, co bys udělal den potom.","en":"What are you most afraid of right now? Write the worst thing that could happen. Then write what you would do the day after."},
  {"k":"telo","cz":"Vzpomeň si na jednu příjemnou chvíli z tohoto týdne. Zůstaň u ní tři věty. Piš, co jsi viděl, slyšel a cítil v těle.","en":"Recall one pleasant moment from this week. Stay with it for three sentences. Write what you saw, heard, and felt in your body."},
  {"k":"smer","cz":"Představ si, že za tři roky všechno dopadlo tak dobře, jak jen mohlo. Popiš jeden obyčejný den v tom životě.","en":"Imagine that three years from now everything has turned out as well as it possibly could. Describe one ordinary day in that life."},
  {"k":"telo","cz":"Kdy ses tento týden cítil nejvíc živý? A kdy nejvíc vyčerpaný? Popiš obě chvíle. Co v nich bylo jinak?","en":"When did you feel most alive this week? And when most exhausted? Describe both moments. What was different about them?"},
  {"k":"druzi","cz":"Co tě tento týden na druhých dráždilo? Podívej se, jestli to samé nenajdeš u sebe.","en":"What irritated you in others this week? See whether you can find the same thing in yourself."},
  {"k":"druzi","cz":"Napiš dopis někomu, komu ho neodešleš. Začni tím, co je teď mezi vámi.","en":"Write a letter to someone you will not send it to. Begin with what is between you now."},
  {"k":"odvraceni","cz":"Které téma tento týden obcházíš? Napiš první tři věty, které tě u něj napadnou, a nech je být.","en":"Which subject have you been avoiding this week? Write the first three sentences that come to mind about it, and leave them be."},
  {"k":"telo","cz":"Kdy jsi tento týden zadržel dech? Napiš, co se kolem tebe dělo.","en":"When did you hold your breath this week? Write what was happening around you."},
  {"k":"telo","cz":"Kde v těle je právě teď klid, i kdyby byl malý? Zůstaň tam tři nádechy. Pak napiš, co se změnilo.","en":"Where in your body is there calm right now, however small? Stay there for three breaths. Then write what changed."},
  {"k":"telo","cz":"Každý večer si zapiš tři věci: jak jsi spal, jak dýcháš a kolik máš energie. Na konci týdne to porovnej s tím, co o sobě běžně říkáš.","en":"Each evening, write down three things: how you slept, how you are breathing, and how much energy you have. At the end of the week, compare this with what you usually say about yourself."},
  {"k":"odvraceni","cz":"Jaký příběh o sobě opakuješ nejčastěji? Co by se změnilo, kdybys ho tento týden nikomu neřekl?","en":"What story about yourself do you repeat most often? What would change if you did not tell it to anyone this week?"},
  {"k":"praxe","cz":"Na co jsi tento týden nejvíc upíral pozornost? Zesílilo to, nebo zesláblo?","en":"What did you give most of your attention to this week? Did it grow stronger or weaker?"},
  {"k":"telo","cz":"Kdy ses tento týden smál? Co tomu předcházelo?","en":"When did you laugh this week? What came before it?"},
  {"k":"druzi","cz":"Co ti tento týden někdo dal, aniž o tom věděl? Napiš mu to tak, jako bys mu to říkal do očí.","en":"What did someone give you this week without knowing it? Write it to them as if you were telling them face to face."},
  {"k":"druzi","cz":"Co tento týden od tebe život chtěl? Kdo tě potřeboval a jak jsi to poznal?","en":"What did life ask of you this week? Who needed you, and how did you know?"},
  {"k":"smer","cz":"Čemu bys tento týden mohl říct ne? Napiš, co by se ti tím uvolnilo.","en":"What could you say no to this week? Write what that would free up for you."},
  {"k":"smrtelnost","cz":"Kdyby ti bylo osmdesát a díval ses na tento týden, co bys sám sobě řekl?","en":"If you were eighty and looking back at this week, what would you say to yourself?"},
  {"k":"praxe","cz":"Kde ses tento týden křečovitě snažil? Co se stane, když tam povolíš o deset procent?","en":"Where were you trying too hard this week? What happens if you ease up by ten percent?"},
  {"k":"praxe","cz":"Kdy jsi tento týden vypadl z režimu a vrátil se? Napiš, jak dlouho ti to trvalo a co pomohlo.","en":"When did you fall out of your routine this week and return to it? Write how long it took and what helped."},
  {"k":"druzi","cz":"Komu bys věnoval to dobré, co jsi tento týden udělal? Napiš to jednou větou.","en":"To whom would you dedicate the good you did this week? Write it in one sentence."},
];

export const TM_PROMPT_OKRUH = {
  telo: { cz: "Tělo", en: "The body" },
  praxe: { cz: "Praxe", en: "The practice" },
  druzi: { cz: "Druzí", en: "Others" },
  smer: { cz: "Směr", en: "Direction" },
  odvraceni: { cz: "Odvrácení", en: "Looking away" },
  smrtelnost: { cz: "Smrtelnost", en: "Mortality" },
};

// ISO týden · pondělní týdny, týden 1 je ten se čtvrtkem. Stejný týden =
// stejný podnět, letos i za pět let — proto ne náhoda.
export function tmIsoWeek(iso) {
  const p = String(iso || "").split("-");
  const d = new Date(Date.UTC(+p[0] || 2020, (+p[1] || 1) - 1, +p[2] || 1));
  const dow = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dow);
  const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - y0) / 86400000 + 1) / 7);
}

// posun je vlastní volba „jiný podnět" pro daný týden — nepřepisuje pořadí
export function tmPromptFor(iso, shift) {
  const i = (tmIsoWeek(iso) - 1 + (shift || 0) * 7) % TM_PROMPTS.length;
  return TM_PROMPTS[(i + TM_PROMPTS.length) % TM_PROMPTS.length];
}

// Práh dne podle hodiny a skutečného západu slunce nad Prahou (sunsetOf) —
// den se čte po částech, ne celý najednou. Noc uzavírá týž den, patří k večeru.
// Vrací VÝHRADNĚ ta tři jména, která karta dne umí vykreslit. Dřív vracela
// čtyři — "noc" a "poledne" navíc — a "poledne" se nerovnalo žádné sekci:
// od jedenácté do západu mínus 90 minut byla karta prázdná a nesvítila ani
// jedna záložka. Noc patří k témuž dni, tedy k večeru; poledne je den.
// Kdyby sem někdy přibyl čtvrtý práh, musí přibýt i sekce a záložka —
// jinak se tahle díra otevře znovu.
export const TM_PRAHY = ["rano", "den", "vecer"];

export const tmPrahKlic = () => {
  const now = new Date();
  const m = now.getHours() * 60 + now.getMinutes();
  const su = /^(\d{1,2})\D(\d{2})/.exec(sunsetOf(todayISO()) || "");
  const zapad = su ? Number(su[1]) * 60 + Number(su[2]) : 20 * 60;
  if (m < 5 * 60) return "vecer";        // po půlnoci se uzavírá týž den
  if (m < 11 * 60) return "rano";
  if (m < zapad - 90) return "den";
  return "vecer";
};

// Co v tenhle den nese ten který práh · pro tečky u záložek
export const tmPrahMa = (day, klic) => {
  if (!day) return false;
  const p = day.plan || {};
  if (klic === "rano") return !!(p.iam && String(p.iam).trim());
  if (klic === "den") return (day.tasks || []).length > 0 || Object.keys(day.sched || {}).length > 0;
  if (klic === "vecer") return !!(day.s || day.wb || ["vision", "ease", "proud", "insights", "next"].some((k) => p[k] && String(p[k]).trim()));
  return false;
};

/* PŘEHLED ČTE TO, CO SE ZAPISUJE.
   Čísla nad Praxí se dřív počítala z `FLOW` — zmrazeného seznamu dnů, který
   sem kdysi přišel z Notionu. Ten seznam je dnes prázdný, takže přehled
   ukazoval nuly bez ohledu na to, kolik dnů měl člověk skutečně odškrtaných:
   živé zápisy leží v `edits` pod klíčem dne a přehled do nich nesahal.
   `flowBy` zůstává parametrem, aby se případný archiv dál počítal s sebou,
   a `has()` ctí vynulovanou praxi.

   Zaznamenaný den = den, ve kterém je aspoň jeden návyk odškrtnutý nebo
   vědomě odložený. Den, na který se nikdo nepodíval, není nula — není. */
export function tmPraxeDny(st, flowBy) {
  const archiv = flowBy || {};
  const klice = new Set([...Object.keys(archiv), ...Object.keys(st.edits || {})]);
  const out = [];
  klice.forEach((d) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
    if (!st.has(d)) return;
    const den = st.getDay(d);
    const h = den.h || EMPTY_H;
    if (!h.some((x) => x === 1 || x === 2)) return;
    out.push(den);
  });
  out.sort((a, b) => (a.d || "").localeCompare(b.d || ""));
  return out;
}

export function tmHabitStats(dny, sloty) {
  const days = dny.length;
  const splneno = dny.reduce((a, e) => a + (e.c || 0), 0);
  const zeVsech = dny.reduce((a, e) => a + (e.n || 0), 0);
  const avg = zeVsech ? Math.round((splneno / zeVsech) * 100) : 0;
  const perfect = dny.filter((e) => (e.n || 0) > 0 && e.c === e.n).length;
  const totals = {}, streaks = {};
  (sloty || []).forEach((j) => {
    totals[j] = dny.reduce((a, e) => a + (((e.h || [])[j] === 1) ? 1 : 0), 0);
    let s = 0;
    for (let i = dny.length - 1; i >= 0; i--) { if ((dny[i].h || [])[j] === 1) s++; else break; }
    streaks[j] = s;
  });
  return { days, avg, perfect, totals, streaks };
}

/** Tělo · čtení dne z archivu i ze zápisů. `detailsBy` je archiv, může být prázdný. */
export const tmWbOf = (st, d, detailsBy) => {
  const archiv = detailsBy || {};
  const e = (st.edits[d] || {}).wb || null;
  const a = archiv[d] || null;
  if (!e && !a) return null;
  const g = (k, ak, dflt) => (e && e[k] != null ? e[k] : (a && a[ak] != null ? a[ak] : dflt));
  return {
    sleep: g("sleep", "sleepH", null),
    mood: g("mood", "mood", 0),
    energy: g("energy", "energy", 0),
    well: e && e.well != null ? e.well : (a && a.well != null ? Math.round(a.well) : 0),
    theme: g("theme", "note", ""),
    grat: g("grat", "grat", false),
    bodhi: g("bodhi", "bodhi", false),
    wild: g("wild", "wild", false),
  };
};

export const tmWbDates = (st, detailsBy) => Array.from(new Set([
  ...Object.keys(detailsBy || {}),
  ...Object.keys(st.edits).filter((d) => st.edits[d] && st.edits[d].wb),
])).sort().reverse();

/** Tři znamení. Kresby si dodá aplikace — jsou to komponenty, ne data. */
export function makeWbZnameni(icons) {
  return [
    { k: "grat", Ic: icons.TmWbMiska, cz: "Vděčnost", en: "Gratitude",
      pCz: "Zaměřil jsem pozornost na vděčnost a spojil se s ní.", pEn: "I brought my attention to gratitude and connected with it." },
    { k: "bodhi", Ic: icons.TmWbDiamant, cz: "Bódhičitta", en: "Bodhicitta",
      pCz: "Kultivoval jsem vznešený záměr — bódhičittu, přání dobra všem bytostem.", pEn: "I cultivated a noble intention — bodhicitta, the wish for the good of all beings." },
    { k: "wild", Ic: icons.TmWbKruh, cz: "Praxe ve světě", en: "Practice in the world",
      pCz: "Můj záměr a vnitřní kontemplace se projevily ve skutečném jednání.", pEn: "My intention and inner contemplation took form in real action." },
  ];
}

/** Statistiky praxe jako hook. React i úložiště si dodá aplikace. */
export function createPracticeStats({ React, useStore, flowBy }) {
  return function usePraxeStats() {
    const st = useStore();
    const sloty = st.activeHabits().map((x) => x.slot);
    return React.useMemo(() => {
      const dny = tmPraxeDny(st, flowBy);
      return { dny, sloty, ...tmHabitStats(dny, sloty) };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [st.edits, st.coll]);
  };
}
