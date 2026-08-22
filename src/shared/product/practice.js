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

export const AREAS = [
  { name: "Body", icon: "💪🏼", rating: 5, ratingMonth: "XI" },
  { name: "General health", icon: "🌿", rating: 7, ratingMonth: "XI" },
  { name: "Mental Health", icon: "🫀" },
  { name: "Partnership", icon: "❤️‍🔥", rating: 2, ratingMonth: "XII" },
  { name: "Blood Family wellfear", icon: "✨" },
  { name: "Friendship", icon: "✊🏼" },
  { name: "Finances", icon: "🌍" },
  { name: "Business", icon: "◈" },
  { name: "Adventure", icon: "🚐" },
  { name: "Art", icon: "🎸", rating: 3, ratingMonth: "XI" },
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

/* PODNĚT TÝDNE · 52 podnětů k psaní — jiný druh otázky než ta v upozornění.
   Upozornění je šťouchnutí: odpoví se v hlavě, za pochodu. Tohle otevírá
   stránku — sedneš si a píšeš tři odstavce.

   Proč 52 a ne 365: Frattaroliho metaanalýza 146 studií (r = .075) našla,
   že delší rozestupy mezi psaním fungují lépe než každodenní, a Lyubomirsky
   změřila, že totéž cvičení jednou týdně zabírá a třikrát týdně už ne —
   opakování otupí. Týden je tedy dávka. 52 podnětů = každý se vrátí přesně
   jednou za rok, na stejný týden. 365 by si vynutilo vatu.

   Proč tahle slova a ne jiná · Watkins & Moberly ukázali, že režim myšlení
   nastaví samo sloveso: „proč se to stalo, jaké to má příčiny" zvedlo
   sklíčenost po nezdaru čtyřikrát víc než „jak se to odvíjelo, přehraj si to
   jako film". Proto tu skoro nikde není holé „proč" — a když je, vždy až za
   konkrétní kotvou. Kross a Ayduk pak ukázali, že odstup („ustup o krok a
   dívej se na sebe") snižuje tíseň a vede k přerámování místo převyprávění;
   proto ho nesou právě Odvrácení a Smrtelnost, kde je ho nejvíc potřeba.
   Cohen & Sherman: pojmenuj hodnotu a hned k ní vyžádej příběh („a time
   when it played an important role") — to drží celý okruh Směr.

   Pravidla, která platí pro každý z nich · (1) má časovou kotvu — dnes,
   tento týden, naposledy; nikdy se neptá na povahu obecně. (2) ptá se co,
   jak, kde, kdy. (3) chce jednu věc do hloubky, ne seznam pěti.
   (4) nepředpokládá partnera, děti, práci, zdraví, společnost ani to, jestli
   byl den dobrý — každý musí jít poctivě zodpovědět slovem „nic".
   (5) jedna věta, unese se v hlavě. Žádný název, žádný vykřičník, žádný
   příkaz co cítit. Mravní tlak leží na tom, kdo píše — nikdy nejde k němu.

   Vlastní okruh vděčnosti tu schválně není: strop má g ≈ 0,19, otupí se
   nejrychleji ze všeho měřeného a tónem by celou aplikaci posunul do
   svépomocné příručky. Konkrétní všímání je místo něj v Těle a v Druhých.

   Pořadí je prostřídané (tělo → praxe → druzí → směr → odvrácení →
   smrtelnost → …), aby po sobě nešly dva týdny ze stejné krajiny. */

export const TM_PROMPTS = [
  // 1
  { k: "telo", cz: "Kde v těle dnes sedí ten den? Najdi to místo a popiš, co tam je — teplo, tah, tíha, prázdno.", en: "Where in the body is today sitting? Find the place and write what is there — heat, pull, weight, hollowness." },
  { k: "praxe", cz: "Co v praxi tento týden drželo samo od sebe a co jsi musel nést?", en: "What in the practice held itself this week, and what did you have to carry?" },
  { k: "druzi", cz: "Čí hlas ti dnes zazněl v hlavě, aniž byl ten člověk poblíž? Napiš, co říkal.", en: "Whose voice sounded in your head today, without that person being anywhere near? Write what it said." },
  { k: "smer", cz: "Vyber jednu věc, na které ti opravdu záleží. Napiš, kdy naposledy rozhodla, co uděláš.", en: "Choose one thing you actually care about. Write about the last time it decided what you did." },
  { k: "odvraceni", cz: "Ustup o krok a dívej se na sebe zvenčí: kde se ten člověk dnes odvrátil?", en: "Step back and watch yourself from outside: where did that person look away today?" },
  { k: "smrtelnost", cz: "Co by z dnešního dne stálo za zapamatování, kdyby ho někdo četl po tobě?", en: "What in today would be worth keeping, if someone read it after you?" },
  // 2
  { k: "telo", cz: "Čím se dnes tělo ozvalo poprvé — a co jsi v tu chvíli dělal?", en: "What was the body's first signal today, and what were you doing when it came?" },
  { k: "praxe", cz: "Popiš dnešní praxi, jako by ji dělal někdo jiný a ty ho pozoroval. Co bys viděl?", en: "Describe today's practice as if someone else were doing it and you were watching. What would you see?" },
  { k: "druzi", cz: "Popiš jednu dnešní výměnu — třeba jen pohled nebo větu. Co v ní bylo pod slovy?", en: "Describe one exchange today — even just a look, even just a sentence. What was under the words?" },
  { k: "smer", cz: "Co jsi tento týden dělal, aniž by to vedlo k něčemu tvému? Popiš to přesně.", en: "What did you do this week that led to nothing of your own? Describe it exactly." },
  { k: "odvraceni", cz: "Co jsi dnes odkládal tak dlouho, až to zmizelo samo? Napiš, co ti to ušetřilo.", en: "What did you put off today until it dissolved on its own? Write what that spared you." },
  { k: "smrtelnost", cz: "Kdyby zbýval rok, co bys z tohoto týdne nechal přesně tak, jak je?", en: "If a year remained, what from this week would you leave exactly as it is?" },
  // 3
  { k: "telo", cz: "Popiš jeden pohyb, který dnes šel sám. Co mu předcházelo?", en: "Describe one movement that went by itself today. What came before it?" },
  { k: "praxe", cz: "Které místo v praxi tento týden nejčastěji zkracuješ? Napiš, co se v tu chvíli děje.", en: "Which part of the practice have you been cutting short this week? Write what happens at that moment." },
  { k: "druzi", cz: "Komu jsi dnes něco zamlčel? Napiš, co to bylo a co jsi řekl místo toho.", en: "Who did you hold something back from today? Write what it was, and what you said instead." },
  { k: "smer", cz: "Kdyby celý rok běžel podle dnešního dne, kam by tě dovedl?", en: "If a whole year ran on the pattern of today, where would it bring you?" },
  { k: "odvraceni", cz: "Které téma dnes obcházíš? Napiš první tři věty, které tě u něj napadnou, a nech je stát.", en: "Which subject are you walking around today? Write the first three sentences it brings, and let them stand." },
  { k: "smrtelnost", cz: "Napiš, co dnes dělalo tvoje tělo — to, které tu jednou nebude.", en: "Write what your body did today. The body that will not be here." },
  // 4
  { k: "telo", cz: "Kdy jsi dnes naposledy zadržel dech? Napiš, co se dělo kolem.", en: "When did you last hold your breath today? Write what was going on around it." },
  { k: "praxe", cz: "Kdy tento týden praxe začala dřív, než jsi o ní stihl rozhodnout?", en: "When this week did the practice begin before you had decided on it?" },
  { k: "druzi", cz: "Vzpomeň si na někoho, kdo tě tento týden potřeboval. Jak jsi to poznal?", en: "Recall someone who needed you this week. How did you know?" },
  { k: "smer", cz: "Které dveře jsi tento týden nechal zavřené? Napiš, co bylo za nimi.", en: "Which door did you leave shut this week? Write what was behind it." },
  { k: "odvraceni", cz: "Kdyby ten strach uměl mluvit: čeho by se bál, kdyby přestal dělat svou práci?", en: "If the fear could speak: what would it be afraid of, if it stopped doing its job?" },
  { k: "smrtelnost", cz: "Který dnešní zvyk by tě mrzel na konci? Popiš ho tak, jak by ho viděl někdo starý.", en: "Which habit from today would you regret at the end? Describe it the way someone old would see it." },
  // 5
  { k: "telo", cz: "Najdi v dnešku místo, kde tělo řeklo ne dřív než hlava. Co se stalo pak?", en: "Find the moment today when the body said no before the head did. What happened next?" },
  { k: "praxe", cz: "Co ses tento týden naučil, aniž bys to hledal? Popiš tu chvíli, ne to ponaučení.", en: "What did you learn this week without looking for it? Describe the moment, not the lesson." },
  { k: "druzi", cz: "Kdy jsi tento týden naposledy někoho poslouchal, aniž bys u toho skládal odpověď?", en: "When this week did you last listen to someone without assembling your answer while they spoke?" },
  { k: "smer", cz: "Co bys dělal příští týden, kdyby na tvůj názor nikdo nečekal?", en: "What would you do next week if nobody were waiting on your opinion?" },
  { k: "odvraceni", cz: "Napiš o něčem, co na sobě neuneseš — a pak k tomu odpověď od někoho, kdo tě má rád bez podmínek.", en: "Write about something in yourself you cannot bear — then write the reply of someone who loves you without conditions." },
  { k: "smrtelnost", cz: "Co jsi dnes odsunul na později, které nemusí přijít?", en: "What did you push into a later that may not come?" },
  // 6
  { k: "telo", cz: "Jak dnes vypadala únava — v čem přesně? Ne jak moc, ale jak.", en: "What did tiredness look like today — in what exactly? Not how much of it. How." },
  { k: "praxe", cz: "Napiš jednu věc z praxe, kterou opakuješ tak dlouho, že už nevíš proč. Co se stane, když ji vynecháš?", en: "Name one thing in the practice you have repeated so long you no longer know why. What happens when you leave it out?" },
  { k: "druzi", cz: "Napiš dopis někomu, komu ho neodešleš. Začni tím, co je teď mezi vámi.", en: "Write a letter to someone you will not send it to. Begin with what stands between you now." },
  { k: "smer", cz: "Popiš jedno rozhodnutí z tohoto týdne a to, co jsi jím odmítl.", en: "Describe one decision from this week, and what it refused." },
  { k: "odvraceni", cz: "Co jsi dnes řekl a nemyslel? Popiš, co ta věta zakryla.", en: "What did you say today and not mean? Describe what the sentence covered." },
  { k: "smrtelnost", cz: "Vzpomeň si na někoho, kdo už tu není. Co by ti dnes řekl a co bys mu odpověděl?", en: "Recall someone who is no longer here. What would they say to you today, and what would you answer?" },
  // 7
  { k: "telo", cz: "Nech vyplout jedno slovo pro to, jak je tělu právě teď. Pak k němu napiš, odkud přišlo.", en: "Let one word surface for how the body is right now. Then write where it came from." },
  { k: "praxe", cz: "Kde dnes praxe skončila a začal výkon? Popiš ten přechod.", en: "Where today did practice end and performance begin? Describe the crossing." },
  { k: "druzi", cz: "Co ti dnes někdo dal, aniž o tom věděl?", en: "What did someone give you today without knowing they had?" },
  { k: "smer", cz: "Kde jsi tento týden šel snadnější cestou? Napiš, jak se ta chvíle ohlásila.", en: "Where this week did you take the easier road? Write how that moment announced itself." },
  { k: "odvraceni", cz: "Co tě tento týden na druhých dráždilo? Podívej se, jestli to místo znáš i odjinud.", en: "What irritated you in others this week? Look and see whether you know that place from somewhere closer." },
  { k: "smrtelnost", cz: "Kdyby byl dnešek poslední, co bys nechal dopsané a co nechal být?", en: "If today were the last, what would you leave finished, and what would you leave be?" },
  // 8
  { k: "telo", cz: "Kde dnes bylo teplo a kde chlad? Popiš obojí po těle, ne podle počasí.", en: "Where was there warmth today, and where cold? Map both across the body, not by the weather." },
  { k: "praxe", cz: "Co bys z praxe dokázal dělat i ve dnu, kdy se všechno rozpadne? Napiš tu nejmenší verzi.", en: "What part of the practice could you still do on a day when everything falls apart? Write the smallest version of it." },
  { k: "druzi", cz: "Kde ses tento týden přizpůsobil víc, než jsi chtěl? Popiš tu situaci zvenčí.", en: "Where this week did you adapt further than you meant to? Describe the situation from outside it." },
  { k: "smer", cz: "Napiš, co má být za pět let hotové — a pak jednu dnešní věc, která k tomu patřila.", en: "Write what should be finished five years from now — then one thing today that belonged to it." },
  { k: "odvraceni", cz: "Popiš jednu dnešní lež. Ta drobná se počítá a ta sobě taky.", en: "Describe one lie from today. The small one counts, and so does the one told to yourself." },
  // 9
  { k: "telo", cz: "Vzpomeň si na jeden dotek dneška — látka, voda, podlaha, ruka. Zůstaň u něj tři věty.", en: "Recall one touch from today — cloth, water, floor, a hand. Stay with it for three sentences." },
  { k: "praxe", cz: "Vrať se k tomu, jak praxe vypadala před rokem. Co z toho zůstalo a co odpadlo?", en: "Go back to what the practice looked like a year ago. What stayed, and what fell away?" },
  { k: "druzi", cz: "Na koho myslíš, když je ticho? Napiš, co by ten člověk dnes viděl.", en: "Who do you think of when it goes quiet? Write what that person would have seen today." },
  // 10
  { k: "telo", cz: "Kdy dnes bylo tělo nejtišší? Napiš tu chvíli i s tím, co bylo těsně předtím.", en: "When was the body quietest today? Write that moment, and what came just before it." },
  { k: "praxe", cz: "Popiš jeden dnešní odpor — kdy přišel, jak dlouho trval a čím skončil.", en: "Describe one piece of resistance today — when it came, how long it held, what ended it." },
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
      pCz: "Něco jsem dnes přijal s vděčností.", pEn: "I received something today with gratitude." },
    { k: "bodhi", Ic: icons.TmWbDiamant, cz: "Bódhičitta", en: "Bodhicitta",
      pCz: "Můj záměr nebo čin zahrnoval i dobro druhých.", pEn: "My intention or act included the good of others." },
    { k: "wild", Ic: icons.TmWbKruh, cz: "Praxe ve světě", en: "Practice in the world",
      pCz: "Promítla se do vztahů nebo jednání.", pEn: "It reached into relationships or action." },
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
