import { ROOM_COPY } from './rooms.js';
import { CLIENT_ALWAYS, CLIENT_OPTIONAL, CLIENT_INFRA } from './roles.js';

export const APP_GUIDE_VERSION = 4;

// Copy describes real controls, never data owned by either person. An adapter
// opens a view; a guide step must never save, submit, pair or grant access.
const step = (room, topic, title, body, clientBody) => Object.freeze({
  id: `${room}.${topic}`, room, anchor: `${room}.${topic}`,
  action: `${room}.${topic}`, title, body, ...(clientBody ? { clientBody } : {}),
});
export const APP_GUIDE_STEPS = Object.freeze([
  step('praxe', 'today', ['Začni dneškem', 'Start with today'],
    ['Tady vybíráš den, ke kterému patří tvůj záznam. Dnešek vrátí kalendář zpět. Starší dny můžeš otevřít, aniž bys změnil dnešní zápis.', 'Choose the day your record belongs to here. Today brings you back. You can revisit earlier days without changing today’s record.']),
  step('praxe', 'habits', ['Zaznamenej skutečný průběh', 'Record what happened'],
    ['U jednotlivých návyků označ, co se dnes stalo. Záznamy se skládají v přehled; nemusíš vše splnit ani dohánět vynechané dny.', 'Mark what happened for each habit. Your records build a picture over time; you do not need to complete everything or make up missed days.']),
  step('praxe', 'evening', ['Vezmi si z dne to podstatné', 'Keep what matters from the day'],
    ['V ohlédnutí zachyť jednu věc, kterou si chceš nést dál, a případný další krok. Podrobnější otázky otevři jen tehdy, když na ně máš prostor.', 'Keep one thing from the day and, if useful, a next step. Open the deeper questions only when you have room for them.']),
  step('trenink', 'calendar', ['Najdi svůj trénink', 'Find your training'],
    ['Kalendář propojuje plán s konkrétním dnem. Otevři trénink, prohlédni si cviky a při cvičení zapisuj skutečný průběh.', 'The calendar connects your plan to a day. Open a session, review its exercises and record what actually happens as you train.'],
    ['Trenér připravuje zadání. Ty volíš den a zapisuješ skutečný průběh. Vlastní záznam nepřepisuje předepsaný plán.', 'Your trainer prepares the prescription. You choose the day and record what actually happens. Your record does not overwrite the prescribed plan.']),
  step('trenink', 'library', ['Prohlédni si cvik', 'Explore an exercise'],
    ['Knihovna pomůže najít cvik a otevřít jeho provedení, ilustraci a související informace. Vyhledávání a kategorie zúží výběr.', 'Use the library to find an exercise and open its instructions, illustration and related information. Search and categories narrow the selection.']),
  step('trenink', 'results', ['Vrať se k výsledkům', 'Review your results'],
    ['Historie drží zaznamenané tréninky. Otevři konkrétní záznam a porovnej plán s tím, co se skutečně podařilo odcvičit.', 'History keeps your recorded sessions. Open a record to compare the plan with what you actually trained.']),
  step('terminy', 'calendar', ['Vyber čas setkání', 'Choose a session time'],
    ['Prohlédni si nabízené termíny. Výběr času otevře podrobnosti; rezervace vznikne teprve po tvém potvrzení.', 'Browse the available session times. Selecting a time opens its details; the booking is made only after you confirm it.']),
  step('terminy', 'bookings', ['Měj přehled o domluvě', 'Keep track of your bookings'],
    ['Tady se vrátíš ke svým domluveným termínům a jejich stavu. Případné změny prováděj v podrobnostech konkrétního setkání.', 'Return here to see your arranged sessions and their status. Make any changes in the details of that particular session.']),
  step('kompas', 'direction', ['Připomeň si směr', 'Recall your direction'],
    ['Kompas drží to, k čemu se chceš vracet. Jednotlivé části otevřou podrobnosti; nemusíš je vyplnit všechny najednou.', 'Compass holds what you want to keep returning to. Open each part for its details; you do not need to fill everything in at once.']),
  step('kompas', 'goals', ['Přenes směr do kroku', 'Turn direction into a step'],
    ['Cíle propojují dlouhodobý směr s konkrétním jednáním. Otevři cíl a najdi nejbližší proveditelný krok.', 'Goals connect long-term direction with a concrete action. Open a goal and find the next manageable step.']),
  step('prameny', 'filters', ['Najdi, co právě hledáš', 'Find what you need'],
    ['Přepínej druhy pramenů nebo jejich stav. Vyhledávání pomůže najít konkrétní titul, aniž bys procházel celou knihovnu.', 'Switch between source types or their status. Search finds a particular title without browsing the whole library.']),
  step('prameny', 'library', ['Přidej vlastní pramen', 'Add your own source'],
    ['Přes Nový titul přidej knihu nebo jiný pramen do své knihovny. V jeho podrobnostech si pak můžeš zachytit, co si chceš nést dál.', 'Use New title to add a book or another source to your library. Its details then give you a place to keep what matters to you.'],
    ['Přes Nový titul přidej vlastní pramen. Tituly předané trenérem zůstávají jeho doporučením; tvoje poznámky k nim jsou soukromé.', 'Use New title to add your own source. Titles received from your trainer remain their recommendations; your notes on them stay private.']),
  step('denik', 'entries', ['Vrať se k zápisu', 'Return to an entry'],
    ['Deník řadí zápisy podle dnů. Otevři konkrétní den a vrať se k tomu, co se tehdy odehrálo.', 'Journal arranges entries by day. Open a day to revisit what happened then.']),
  step('denik', 'write', ['Napiš, co potřebuješ', 'Write what you need'],
    ['Nový zápis otevře prostor pro vlastní text. Obsah můžeš později upravit; nemusíš hledat dokonalou formulaci hned.', 'A new entry gives you room for your own words. You can edit it later; there is no need to find the perfect wording now.'],
    ['Nový zápis je tvůj soukromý prostor. Trenér tvůj Deník nevidí. Text můžeš později upravit; stačí začít tím, co je právě důležité.', 'A new entry is your private space. Your trainer cannot see your Journal. You can edit the text later; start with what matters now.']),
  step('zapisnik', 'entries', ['Najdi poznámku', 'Find a note'],
    ['Zápisník drží poznámky, ke kterým se chceš vracet i mimo konkrétní den. Otevři poznámku nebo zúž výběr pomocí kategorií a hledání.', 'Notebook keeps notes you want to return to beyond one particular day. Open a note or narrow the list using categories and search.']),
  step('zapisnik', 'write', ['Zachyť myšlenku', 'Capture a thought'],
    ['Nová poznámka může obsahovat text i přílohy. Při psaní je formátování po ruce a hlasovou nahrávku můžeš následně odebrat.', 'A new note can hold text and attachments. Formatting stays close while you write, and a voice recording can be removed afterwards.'],
    ['Nová poznámka může obsahovat text i přílohy. Zápisník zůstává soukromý a trenérovi se neposílá.', 'A new note can hold text and attachments. Your Notebook stays private and is not sent to your trainer.']),
  step('spolu', 'tabs', ['Vyber prostor pro vás dva', 'Choose a space for the two of you'],
    ['Přepínej dnešní potřeby, rozhovory, plány a cyklus. Každá část otevírá jiný způsob, jak si lépe porozumět; používej jen to, co vám dává smysl.', 'Switch between today’s needs, conversations, plans and cycle. Each part offers a different way to understand each other; use only what is meaningful to you.']),
  step('spolu', 'connection', ['Sdílej vědomě', 'Share deliberately'],
    ['Propojení a sdílení ukazuje, s kým jsi ve Spolu a co si navzájem zpřístupňujete. Samotná návštěva stránky nic nesdílí; rozsah určuješ svými souhlasy.', 'Connection and sharing shows who you are connected with and what you make available to each other. Visiting a page does not share it; your permissions set the scope.']),
  step('spolu', 'sky', ['Podívej se na dnešní oblohu', 'Explore today’s sky'],
    ['Měsíc otevírá Oblohu dne. Datum, čas a zvolený přístup mění její pohled; další vrstvy otevři podle zájmu.', 'The Moon opens Today’s sky. The date, time and chosen tradition change the view; explore further layers as you wish.']),
  step('memento', 'view', ['Zastav se u času', 'Pause with time'],
    ['Memento mori je volitelný prostor pro připomenutí konečnosti. Prohlížej ho vlastním tempem; nemusí být součástí každého dne.', 'Memento mori is an optional space for reflecting on finitude. Explore at your own pace; it need not be part of every day.']),
  step('memento', 'reflection', ['Vrať pozornost k dnešku', 'Bring attention back to today'],
    ['Otevři zamyšlení, které tě oslovuje. Smyslem je všimnout si toho, čemu chceš dát čas právě teď.', 'Open a reflection that speaks to you. Its purpose is to notice what you want to give your time to now.']),
  step('klienti', 'list', ['Otevři konkrétního klienta', 'Open a client'],
    ['Přehled vede k jednotlivým klientům, jejich plánu a spolupráci. Vyber člověka, se kterým právě pracuješ.', 'The overview leads to individual clients, their plans and your work together. Select the person you are working with.']),
  step('klienti', 'sharing', ['Zkontroluj předání', 'Check what you share'],
    ['Otevři kartu vybraného člověka a záložku Aplikace. Tam spravuješ jeho přístup a předávaný obsah. Před sdílením ověř jméno i rozsah.', 'Open the chosen person’s card and its App tab to manage access and shared content. Before sharing, check both their name and the scope.']),
  step('hospodareni', 'overview', ['Zorientuj se v období', 'Review the period'],
    ['Přehled ukazuje hospodaření za zvolené období. Nejprve si ověř datum a filtr, potom otevři podrobnosti.', 'The overview shows your finances for the selected period. Check the date and filter first, then open the details.']),
  step('hospodareni', 'entries', ['Najdi konkrétní pohyb', 'Find a transaction'],
    ['Jednotlivé záznamy drží podrobnosti příjmů a výdajů. Otevři položku, kterou potřebuješ prohlédnout nebo upravit.', 'Individual records hold the details of income and expenses. Open the entry you need to review or change.']),
  step('socsite', 'overview', ['Vrať se k rozpracovanému', 'Return to work in progress'],
    ['Tvorba spojuje nápady s rozpracovaným obsahem. Vyber část, na které chceš pokračovat.', 'Content connects ideas with work in progress. Choose the part you want to continue.']),
  step('socsite', 'library', ['Otevři podklad', 'Open a resource'],
    ['Poznámky tvorby drží podklady této místnosti. Otevři konkrétní zápis, když potřebuješ postup nebo inspiraci; tyto poznámky jsou oddělené od Zápisníku.', 'Creation notes hold this room’s resources. Open a note when you need a method or inspiration; these notes are separate from the Notebook.']),
  step('mandala', 'overview', ['Prozkoumej jednotlivé podoby', 'Explore different facets'],
    ['Vyber část Mandaly a otevři její souvislosti. Ber ji jako prostor k vlastnímu pozorování, ne jako hodnocení sebe sama.', 'Choose part of the Mandala to explore its context. Use it for your own observation, not as a judgement of yourself.']),
  step('atomic', 'overview', ['Pochop smyčku návyku', 'Understand the habit loop'],
    ['Referenční karta z knihy Atomic Habits shrnuje čtyři části návyku. Níže najdeš čtyři zákony a jednoduchý recept, který můžeš vztáhnout ke své praxi.', 'This Atomic Habits reference summarises the four parts of a habit. Below are the four laws and a simple recipe you can apply to your practice.']),
  step('oblasti', 'overview', ['Prohlédni si krajiny', 'Explore your landscapes'],
    ['Krajiny drží dlouhodobé oblasti života. Otevři jednu a prohlédni si, co do ní patří.', 'Landscapes hold long-term areas of life. Open one to see what belongs there.']),
  step('cile', 'overview', ['Najdi nejbližší krok', 'Find the next step'],
    ['Vyber cíl a podívej se, co ho může posunout. Nemusíš postupovat ve všech cílech zároveň.', 'Choose a goal and see what could move it forward. You do not need to advance every goal at once.']),
  step('kos', 'overview', ['Vrať smazaný obsah', 'Restore deleted content'],
    ['Koš drží odstraněné položky, které lze vrátit. Před trvalým odstraněním se přesvědč, že je už nepotřebuješ.', 'Trash holds removed items that can be restored. Before permanently removing one, make sure you no longer need it.']),
  step('nastaveni', 'account', ['Nastav svůj profil', 'Set up your profile'],
    ['V Účtu upravíš jméno a způsob oslovení. Když používáš Spolu, najdeš tu také volbu vlastního cyklu.', 'Account holds your name and how the app addresses you. If you use Together, your own cycle option is here too.']),
  step('nastaveni', 'rooms', ['Nech si jen potřebné stránky', 'Keep the pages you need'],
    ['Vyber, které stránky chceš používat a kde je najdeš v navigaci. Průvodce pak nabízí jen stránky, které máš k dispozici.', 'Choose which pages you want to use and where they appear in navigation. The guide then offers only the pages available to you.']),
  step('nastaveni', 'calendar', ['Uprav práci s kalendářem', 'Set your calendar preferences'],
    ['V Kalendáři spravuješ jeho nastavení a dostupná propojení. Propojení s Googlem se spustí až tvým výslovným výběrem.', 'Calendar contains its settings and available connections. A Google connection starts only when you explicitly choose it.']),
  step('nastaveni', 'version', ['Najdi verzi a zdroje', 'Find the version and sources'],
    ['Verze pomůže určit, kterou podobu aplikace používáš. Zdroje jsou schované uvnitř této části a můžeš je kdykoli rozvinout.', 'Version identifies the app you are using. Sources sit inside this section and can be expanded whenever you need them.']),
]);

const clientRooms = new Set([...CLIENT_ALWAYS, ...CLIENT_OPTIONAL, ...CLIENT_INFRA, 'atomic', 'oblasti', 'cile']);
const coachOnly = new Set(['klienti', 'hospodareni', 'socsite', 'mandala']);

export function guideText(value, lang = 'cs') {
  return Array.isArray(value) ? value[lang === 'en' ? 1 : 0] : String(value || '');
}

/** Both permissions and navigation preferences must already be resolved by the
 * app. Missing room/step arrays never expand access. Null availableSteps means
 * all catalogued steps within that explicitly permitted room set. */
export function getGuideTours({ role = 'client', availableRooms = [], availableSteps = null, lang = 'cs' } = {}) {
  const allowed = new Set(Array.isArray(availableRooms) ? availableRooms : []);
  const steps = availableSteps == null ? null : new Set(Array.isArray(availableSteps) ? availableSteps : []);
  const byRoom = new Map();
  for (const item of APP_GUIDE_STEPS) {
    if (!allowed.has(item.room) || (steps && !steps.has(item.id))) continue;
    if (role !== 'coach' && (!clientRooms.has(item.room) || coachOnly.has(item.room))) continue;
    if (role === 'coach' && item.room === 'terminy') continue;
    if (!byRoom.has(item.room)) byRoom.set(item.room, {
      room: item.room,
      label: ROOM_COPY[item.room]?.[lang === 'en' ? 'en' : 'cz'] || item.room,
      steps: [],
    });
    byRoom.get(item.room).steps.push({ ...item,
      title: guideText(item.title, lang),
      body: guideText(role !== 'coach' && item.clientBody ? item.clientBody : item.body, lang),
    });
  }
  return [...byRoom.values()];
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));

/** Viewport coordinates include the visual viewport offset (mobile keyboard / zoom).
 * Returns the actually visible intersection, never a fabricated or shifted ring. */
export function visibleGuideRect(rect, viewport, insets = {}) {
  if (!rect || rect.width <= 0 || rect.height <= 0) return null;
  const left = Math.max(rect.left, viewport.left + (insets.left || 0));
  const top = Math.max(rect.top, viewport.top + (insets.top || 0));
  const right = Math.min(rect.right ?? rect.left + rect.width, viewport.left + viewport.width - (insets.right || 0));
  const bottom = Math.min(rect.bottom ?? rect.top + rect.height, viewport.top + viewport.height - (insets.bottom || 0));
  return right - left < 4 || bottom - top < 4 ? null : { left, top, right, bottom, width: right - left, height: bottom - top };
}

/** A connected card must be fully outside its target. If no such space exists,
 * return a compact disconnected fallback; the UI does not draw a false arrow. */
export function placeGuidePanel({ target, viewport, panelWidth = 352, panelHeight = 210, insets = {} }) {
  const margin = 12, gap = 16;
  const x = viewport.left + margin + (insets.left || 0);
  const y = viewport.top + margin + (insets.top || 0);
  const right = viewport.left + viewport.width - margin - (insets.right || 0);
  const bottom = viewport.top + viewport.height - margin - (insets.bottom || 0);
  const width = Math.max(1, Math.min(panelWidth, right - x));
  const height = Math.max(1, Math.min(panelHeight, bottom - y));
  const fallback = { left: right - width, top: Math.max(y, bottom - height), width, maxHeight: Math.max(1, bottom - y), connected: false, side: 'detached' };
  if (!target) return fallback;
  const tx = target.left + target.width / 2, ty = target.top + target.height / 2;
  const centeredX = clamp(tx - width / 2, x, right - width);
  const centeredY = clamp(ty - height / 2, y, bottom - height);
  const candidates = [
    { left: target.right + gap, top: centeredY, side: 'right' },
    { left: target.left - gap - width, top: centeredY, side: 'left' },
    { left: centeredX, top: target.bottom + gap, side: 'below' },
    { left: centeredX, top: target.top - gap - height, side: 'above' },
  ];
  if (viewport.width < 720) candidates.push(...candidates.splice(0, 2));
  const fit = candidates.find(p => p.left >= x && p.top >= y && p.left + width <= right && p.top + height <= bottom);
  return fit ? { ...fit, width, maxHeight: height, connected: true } : fallback;
}

export function guideArrow(target, panel, panelHeight) {
  if (!target || !panel?.connected) return null;
  const cx = target.left + target.width / 2, cy = target.top + target.height / 2;
  if (panel.side === 'above' || panel.side === 'below') {
    const x = clamp(cx, panel.left + 22, panel.left + panel.width - 22);
    const fromY = panel.side === 'below' ? panel.top : panel.top + panelHeight;
    const toY = panel.side === 'below' ? target.bottom + 4 : target.top - 4;
    return { x1: x, y1: fromY, x2: cx, y2: toY };
  }
  const y = clamp(cy, panel.top + 22, panel.top + panelHeight - 22);
  return { x1: panel.side === 'right' ? panel.left : panel.left + panel.width,
    y1: y, x2: panel.side === 'right' ? target.right + 4 : target.left - 4, y2: cy };
}
