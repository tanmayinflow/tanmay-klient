import { ROOM_COPY } from './rooms.js';
import { CLIENT_ALWAYS, CLIENT_OPTIONAL, CLIENT_HIDDEN, CLIENT_INFRA } from './roles.js';

export const APP_GUIDE_VERSION = 5;

// Copy describes real controls, never data owned by either person. An adapter
// opens a view; a guide step must never save, submit, pair or grant access.
const step = (room, topic, title, body, clientBody) => Object.freeze({
  id: `${room}.${topic}`, room, anchor: `${room}.${topic}`,
  action: `${room}.${topic}`, title, body, ...(clientBody ? { clientBody } : {}),
});
export const APP_GUIDE_STEPS = Object.freeze([
  step("praxe", "today", ["Vrať se ke kterémukoli dni", "Return to any day"],
    ["Vyber datum a otevři svůj záznam. Tlačítko Dnes tě vrátí zpět.", "Choose a date to open your record. Today brings you back."]),
  step("praxe", "habits", ["Udrž si pravidelnost", "Build consistency"],
    ["Označ, co se dnes podařilo. V přehledu uvidíš, ke kterým návykům se vracíš.", "Mark what you did today. The overview shows which habits you keep returning to."]),
  step("praxe", "evening", ["Odnes si z dne to důležité", "Keep what matters from today"],
    ["Zapiš jednu věc, kterou si chceš zapamatovat, a krok na zítřek.", "Write one thing to remember and a step for tomorrow."]),
  step("trenink", "calendar", ["Víš, co dnes cvičit", "Know what to train today"],
    ["Otevři trénink, prohlédni si cviky a zapiš, co se podařilo odcvičit.", "Open your session, review the exercises and record what you trained."],
    ["Otevři plán od trenéra a zapiš svůj trénink. Tvoje výsledky zůstanou vedle zadání.", "Open your coach’s plan and record your session. Your results stay alongside the prescription."]),
  step("trenink", "library", ["Provedení cviku máš po ruce", "Exercise instructions at hand"],
    ["Vyhledej cvik a otevři jeho ukázku a pokyny.", "Find an exercise and open its demonstration and instructions."]),
  step("trenink", "results", ["Vidíš svůj posun", "See your progress"],
    ["V historii porovnej své tréninky. Uvidíš, co už zvládáš a na co příště navázat.", "Compare your sessions in History. See what you can do and where to pick up next time."]),
  step("terminy", "calendar", ["Najdi čas, který ti sedí", "Find a time that suits you"],
    ["Vyber si z volných termínů. Rezervace vznikne až po tvém potvrzení.", "Choose an available time. Your booking is made only when you confirm it."]),
  step("terminy", "bookings", ["Víš, kdy se potkáte", "Know when you are meeting"],
    ["Otevři své rezervace a zkontroluj nejbližší setkání. Podrobnosti najdeš přímo u termínu.", "Open your bookings to check your next session. Its details are right there."]),
  step("kompas", "direction", ["Připomeň si, na čem ti záleží", "Remember what matters to you"],
    ["Vyber oblast, které chceš věnovat pozornost, a otevři její podrobnosti.", "Choose an area you want to focus on and open its details."]),
  step("kompas", "goals", ["Máš jasno v dalším kroku", "Know your next step"],
    ["Otevři jeden cíl a vyber malý krok, který můžeš udělat teď.", "Open one goal and choose a small step you can take now."]),
  step("prameny", "filters", ["Najdi pramen, který potřebuješ", "Find the source you need"],
    ["Vyhledej název nebo zúž výběr podle druhu a stavu čtení.", "Search by title or narrow your library by type and reading status."]),
  step("prameny", "library", ["Knihy a postřehy máš spolu", "Keep books and insights together"],
    ["Přidej Nový titul. K němu uložíš postřehy, nahrávku nebo přílohu, ke kterým se můžeš vracet.", "Add a New title. Keep notes, a recording or an attachment with it to revisit later."],
    ["Přidej Nový titul a vlastní postřehy. Poznámky k doporučením trenéra zůstávají soukromé.", "Add a New title and your own notes. Notes on your coach’s recommendations stay private."]),
  step("denik", "entries", ["Vybav si, co se tehdy dělo", "Recall what happened then"],
    ["Otevři den, ke kterému se chceš vrátit. Najdeš u něj svůj zápis.", "Open a day you want to revisit and find your entry there."]),
  step("denik", "write", ["Udělej si místo v hlavě", "Make room in your mind"],
    ["Otevři Nový zápis a napiš, co máš právě na mysli.", "Open a New entry and write what is on your mind."],
    ["Otevři Nový zápis a napiš, co máš právě na mysli. Trenér tvůj Deník nevidí.", "Open a New entry and write what is on your mind. Your coach cannot see your Journal."]),
  step("zapisnik", "entries", ["Myšlenku najdeš i za měsíc", "Find that thought a month later"],
    ["Vyhledej poznámku nebo otevři její kategorii. Zápisník není vázaný na konkrétní den.", "Search for a note or open its category. Notebook is not tied to a particular day."]),
  step("zapisnik", "write", ["Zachyť nápad, než uteče", "Catch an idea before it goes"],
    ["Přidej poznámku, fotku nebo hlasovou nahrávku. Všechno najdeš u jednoho zápisu.", "Add a note, photo or voice recording. Keep it all in one entry."],
    ["Přidej poznámku, fotku nebo hlasovou nahrávku. Tvůj Zápisník zůstává soukromý.", "Add a note, photo or voice recording. Your Notebook stays private."]),
  step("spolu", "tabs", ["Řekni, co dnes potřebuješ", "Say what you need today"],
    ["Vyber dnešní potřeby, rozhovor nebo společný plán. Začni tím, co chcete řešit právě teď.", "Choose today’s needs, a conversation or a shared plan. Start with what matters to you both now."]),
  step("spolu", "connection", ["Ty rozhoduješ, co sdílíš", "You choose what to share"],
    ["V Propojení a sdílení zkontroluj partnera a své souhlasy. Samotné otevření stránky nic nesdílí.", "Check your partner and permissions in Connection and sharing. Opening the page does not share anything."]),
  step("spolu", "sky", ["Prozkoumej dnešní oblohu", "Explore today’s sky"],
    ["Klepni na Měsíc. Oblohu si prohlédneš pro vybraný den a čas.", "Tap the Moon to explore the sky for your chosen date and time."]),
  step("memento", "view", ["Připomeň si hodnotu svého času", "Remember the value of your time"],
    ["Otevři Memento mori a vyber pohled, u kterého se chceš zastavit.", "Open Memento mori and choose a view to spend a moment with."]),
  step("memento", "reflection", ["Dej dnešku svůj čas", "Give today your attention"],
    ["Vyber zamyšlení a všimni si, čemu chceš dnes věnovat pozornost.", "Choose a reflection and notice what you want to give your attention to today."]),
  step("klienti", "list", ["Navážeš tam, kde jste skončili", "Pick up where you left off"],
    ["Otevři klienta a vrať se k jeho plánu a záznamům spolupráce.", "Open a client to revisit their plan and your work together."]),
  step("klienti", "sharing", ["Předáš správný obsah", "Share the right content"],
    ["Na kartě klienta otevři Aplikace. Před předáním zkontroluj jméno a vybraný obsah.", "Open App on the client’s card. Check the name and selected content before sharing."]),
  step("hospodareni", "overview", ["Víš, kam šly peníze", "See where your money went"],
    ["Vyber měsíc a porovnej zapsané příjmy a výdaje. Částku otevřeš do podrobností.", "Choose a month and compare recorded income and expenses. Open an amount to see its details."]),
  step("hospodareni", "entries", ["Platby nezůstanou jen v paměti", "Keep track of your payments"],
    ["Otevři záznam příjmu nebo výdaje. Doplň, co potřebuješ pro svůj přehled.", "Open an income or expense entry. Add the details you need to keep track."]),
  step("socsite", "overview", ["Z nápadu vznikne příspěvek", "Turn an idea into a post"],
    ["Vyber rozpracovaný obsah a pokračuj tam, kde jsi skončil.", "Choose a draft and pick up where you left off."]),
  step("socsite", "library", ["Podklady nemusíš hledat znovu", "Keep your resources close"],
    ["V Poznámkách tvorby otevři uložený postup nebo inspiraci pro další příspěvek.", "Open a saved method or inspiration for your next post in Creation notes."]),
  step("mandala", "overview", ["Podívej se na sebe z více stran", "Explore different sides of yourself"],
    ["Vyber část Mandaly a prozkoumej souvislosti, které tě zajímají.", "Choose part of the Mandala to explore the connections that interest you."]),
  step("atomic", "overview", ["Usnadni si nový návyk", "Make a new habit easier"],
    ["Prohlédni si čtyři části návyku z Atomic Habits a vyber jeden princip k vyzkoušení.", "Explore the four parts of a habit from Atomic Habits and choose one principle to try."]),
  step("oblasti", "overview", ["Ujasni si, čemu dát prostor", "Choose what to make room for"],
    ["Otevři jednu Krajinu a prohlédni si, co do této oblasti života patří.", "Open a Landscape to see what belongs in that area of your life."]),
  step("cile", "overview", ["Posuň jeden cíl o krok dál", "Move one goal forward"],
    ["Otevři cíl a vyber nejbližší proveditelný krok.", "Open a goal and choose the next manageable step."]),
  step("kos", "overview", ["Smazanou poznámku můžeš vrátit", "Bring back a deleted note"],
    ["Najdi položku v Koši a obnov ji. Trvalé odstranění už vrátit nejde.", "Find an item in Trash and restore it. Permanent deletion cannot be undone."]),
  step("nastaveni", "account", ["Aplikace tě zná jménem", "Make the app your own"],
    ["V Účtu nastav své jméno a oslovení.", "Set your name and how the app addresses you in Account."]),
  step("nastaveni", "rooms", ["Nech si jen to, co využiješ", "Keep only what you use"],
    ["Vyber stránky do své nabídky. Kdykoli je můžeš znovu změnit.", "Choose the pages in your menu. You can change them again whenever you need."]),
  step("nastaveni", "calendar", ["Plán a kalendář máš spolu", "Keep your plan and calendar together"],
    ["Vyber období a co chceš propojit. Google kalendář se připojí až po tvém souhlasu.", "Choose the date range and what to connect. Google Calendar connects only with your permission."]),
  step("nastaveni", "version", ["Při potížích najdeš svou verzi", "Find your version when you need help"],
    ["Otevři Verzi a zjisti číslo aplikace. Pod ní můžeš rozbalit použité zdroje.", "Open Version to find the app number. Expand the sources below it if needed."]),
]);

const clientRooms = new Set([...CLIENT_ALWAYS, ...CLIENT_OPTIONAL, ...CLIENT_HIDDEN, ...CLIENT_INFRA, 'atomic', 'oblasti', 'cile']);
const coachOnly = new Set(['klienti']);

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

// A short first visit uses only the already permitted, translated steps.
// Prefer three practical outcomes; fallbacks never enable a hidden room.
export function createGuideStarter(tours, lang = 'cs') {
  const available = tours.flatMap(tour => tour.steps);
  const picked = [], rooms = new Set();
  const add = item => {
    if (!item || picked.length >= 3 || rooms.has(item.room)) return;
    picked.push(item); rooms.add(item.room);
  };
  for (const id of ['trenink.calendar', 'praxe.habits', 'kompas.goals', 'terminy.calendar', 'prameny.library']) {
    add(available.find(item => item.id === id));
  }
  for (const tour of tours) add(tour.steps[0]);
  return picked.length ? { room: '__start__', label: lang === 'en' ? 'First steps' : 'První kroky', steps: picked } : null;
}

// Combine only the already permission-filtered tours. Every step retains its
// actual room so navigation, pause handling and highlights remain contextual.
export function combineGuideTours(tours, lang = 'cs') {
  if (!tours.length) return null;
  return { room: '__all__', label: lang === 'en' ? 'Show everything' : 'Ukázat vše', steps: tours.flatMap(tour => tour.steps) };
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
