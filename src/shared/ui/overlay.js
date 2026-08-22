// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/overlay.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// VRSTVY · Escape, zámek stránky, ohrada pro focus, tlačítko zpět
// ----------------------------------------------------------------------
// Bez DOMu se tenhle soubor neptá na nic, takže se dá spustit v testu.
// Komponenty, které z něj žijí, jsou v ui/overlay.jsx.

/* Escape patří vždycky jen nejvýš položené vrstvě. Dokud si každý překryv
   držel vlastní posluchač, jedno klepnutí zavřelo všechny naráz: hledání
   otevřené nad kartou zavřelo i kartu pod sebou a člověk se propadl o dvě
   patra místo jednoho. Vrstvy se proto hlásí do jednoho zásobníku v pořadí,
   v jakém se otevřely, a klávesu dostane jen ta poslední.
   Stránka pod nimi se ptá `tmEscVolno()`: dokud stojí nějaký překryv,
   Escape jí nepatří. */
export const TM_ESC = [];

export function tmEscOdbav(e) {
  if ((e.key || "") !== "Escape") return;
  const v = TM_ESC[TM_ESC.length - 1];
  if (v && v.fn) v.fn(e);
}

export function tmEscVrstva(fn) {
  if (typeof window === "undefined") return () => {};
  if (!TM_ESC.length) window.addEventListener("keydown", tmEscOdbav);
  const v = { fn };
  TM_ESC.push(v);
  return () => {
    const i = TM_ESC.indexOf(v);
    if (i >= 0) TM_ESC.splice(i, 1);
    if (!TM_ESC.length) window.removeEventListener("keydown", tmEscOdbav);
  };
}

export function tmEscVolno() { return TM_ESC.length === 0; }

/* ZÁMEK LISTOVÁNÍ · dokud stojí otevřená poznámka nebo náhled, tah prstem
   do strany nemá přepínat místnosti. Počítadlo, ne vlajka: vrstvy se umí
   překrýt (náhled nad poznámkou) a odečíst se smí až ta poslední. */
let TM_LISTOVANI = 0;
export const tmListovaniStuj = () => { TM_LISTOVANI++; };
export const tmListovaniJdi = () => { TM_LISTOVANI = Math.max(0, TM_LISTOVANI - 1); };
export const tmListovaniSpi = () => TM_LISTOVANI > 0;

/* Zámek stránky pod překryvem. Na iOS `overflow: hidden` nestačí — dotyk
   se protáhne na stránku pod listem, ta se roluje a adresní řádek se hýbe.
   Spolehlivě zabírá jen `position: fixed` s uloženou polohou, kterou je
   pak nutné vrátit přesně, jinak se po zavření listu skočí na začátek.
   Počítadlo je tu kvůli vrstvení: list nad listem nesmí zámek pustit dřív,
   než se zavře i ten spodní. */
export const TM_ZAMEK = { pocet: 0, y: 0 };

export function tmZamkniStranku() {
  if (typeof document === "undefined") return;
  TM_ZAMEK.pocet += 1;
  if (TM_ZAMEK.pocet > 1) return;
  TM_ZAMEK.y = window.scrollY || window.pageYOffset || 0;
  const b = document.body;
  b.style.overflow = "hidden";
  b.style.position = "fixed";
  b.style.top = -TM_ZAMEK.y + "px";
  b.style.left = "0";
  b.style.right = "0";
  b.style.width = "100%";
}

export function tmOdemkniStranku() {
  if (typeof document === "undefined") return;
  TM_ZAMEK.pocet = Math.max(0, TM_ZAMEK.pocet - 1);
  if (TM_ZAMEK.pocet > 0) return;
  const b = document.body;
  b.style.overflow = "";
  b.style.position = "";
  b.style.top = "";
  b.style.left = "";
  b.style.right = "";
  b.style.width = "";
  try { window.scrollTo(0, TM_ZAMEK.y); } catch (e) {}
}

/* Kolik vrstev právě stojí. Test se na to ptá, aby nemusel sahat do pole. */
export function tmVrstevPocet() { return TM_ESC.length; }
export function tmZamekPocet() { return TM_ZAMEK.pocet; }

// ----------------------------------------------------------------------
// OHRADA PRO FOCUS
// ----------------------------------------------------------------------
// Otevřený list je pro klávesnici a odečítač obrazovky celá místnost. Dokud
// stojí, tabulátor z něj nesmí utéct na stránku pod ním — tam se nedá klikat
// a odečítač by četl něco, co člověk nevidí. Po zavření se focus vrací tam,
// odkud vyšel; jinak skočí na začátek dokumentu a orientace je pryč.

const OSTRUZINA = [
  "a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])",
  "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])", "[contenteditable='true']",
].join(",");

export function tmFocusovatelne(root) {
  if (!root || !root.querySelectorAll) return [];
  const out = [];
  for (const el of root.querySelectorAll(OSTRUZINA)) {
    if (el.hasAttribute("disabled")) continue;
    if (el.getAttribute("aria-hidden") === "true") continue;
    const r = el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 1, height: 1 };
    if (r.width === 0 && r.height === 0) continue;
    out.push(el);
  }
  return out;
}

/**
 * Zavře focus do prvku a po skončení ho vrátí.
 * Vrací funkci na uklizení. Bez DOMu nedělá nic.
 */
export function tmChytFocus(el, opts) {
  if (typeof document === "undefined" || !el) return () => {};
  const o = opts || {};
  const kam = document.activeElement;
  const naKlavesu = (e) => {
    if ((e.key || "") !== "Tab") return;
    const list = tmFocusovatelne(el);
    if (!list.length) { e.preventDefault(); if (el.focus) el.focus(); return; }
    const prvni = list[0], posledni = list[list.length - 1];
    const kdo = document.activeElement;
    if (e.shiftKey) {
      if (kdo === prvni || !el.contains(kdo)) { e.preventDefault(); posledni.focus(); }
    } else if (kdo === posledni || !el.contains(kdo)) {
      e.preventDefault(); prvni.focus();
    }
  };
  el.addEventListener("keydown", naKlavesu);
  // Focus se nedává hned: vstupní animace ještě běží a prohlížeč by při
  // focusu doprostřed listu odroloval stránku pod ním.
  const h = setTimeout(() => {
    if (!el.isConnected) return;
    if (el.contains(document.activeElement) && document.activeElement !== document.body) return;
    const list = tmFocusovatelne(el);
    const cil = o.prvni === false ? el : (list[0] || el);
    if (cil === el && !el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    try { cil.focus({ preventScroll: true }); } catch (e) { try { cil.focus(); } catch (e2) {} }
  }, 30);
  return () => {
    clearTimeout(h);
    el.removeEventListener("keydown", naKlavesu);
    if (o.vratit === false) return;
    try {
      if (kam && kam.isConnected && kam.focus) kam.focus({ preventScroll: true });
    } catch (e) {}
  };
}

// ----------------------------------------------------------------------
// TLAČÍTKO ZPĚT
// ----------------------------------------------------------------------
// Na telefonu je gesto zpět to první, co člověk zkusí, když chce zavřít
// list — a dosud odešel z celé aplikace. Otevřená vrstva si proto přidá
// jeden záznam do historie a gesto ho spotřebuje.
//
// Účtování je jmenovité, ne počítané: každá vrstva zná svůj klíč a odchází
// jen tehdy, když ten klíč v historii ještě stojí. Vrstva zavřená křížkem
// svůj záznam vrátí sama, vrstva zavřená gestem už nic nevrací.

let TM_HIST_ID = 0;
const TM_HIST = [];

function tmHistPop(e) {
  const stav = (e && e.state) || null;
  // Zavíráme všechny vrstvy, které v novém stavu už nejsou.
  const zivy = stav && stav.tmOverlay ? stav.tmOverlay : null;
  for (let i = TM_HIST.length - 1; i >= 0; i--) {
    if (TM_HIST[i].klic === zivy) break;
    const v = TM_HIST.pop();
    v.zvenku = true;
    try { v.close(); } catch (err) {}
  }
  if (!TM_HIST.length) window.removeEventListener("popstate", tmHistPop);
}

/** Zaregistruje vrstvu do historie. Vrací funkci na odhlášení. */
export function tmHistorieVrstva(close) {
  if (typeof window === "undefined" || !window.history || !window.history.pushState) return () => {};
  const klic = "tm-" + (++TM_HIST_ID);
  const pod = TM_HIST.length ? TM_HIST[TM_HIST.length - 1].klic : null;
  const v = { klic, close, zvenku: false, pod };
  if (!TM_HIST.length) window.addEventListener("popstate", tmHistPop);
  TM_HIST.push(v);
  try { window.history.pushState({ tmOverlay: klic, tmPod: pod }, ""); } catch (e) {}
  return () => {
    const i = TM_HIST.indexOf(v);
    if (i < 0) return;
    TM_HIST.splice(i, 1);
    if (!TM_HIST.length) window.removeEventListener("popstate", tmHistPop);
    // Vrstvu zavřel křížek nebo Escape · svůj záznam si vezme zpátky.
    // Vrstvu zavřelo gesto · záznam je pryč a sahat na historii by
    // odneslo o krok navíc.
    if (v.zvenku) return;
    try {
      const st = window.history.state;
      if (st && st.tmOverlay === klic) window.history.back();
    } catch (e) {}
  };
}

export function tmHistoriePocet() { return TM_HIST.length; }

/**
 * Nahoru. Když je pod otevřeným listem stránka zamčená, rolovat nejde a při
 * odemčení by se vrátila stará poloha — nová místnost by se otevřela v půlce.
 * Přání „nahoru" proto zapisujeme rovnou do zámku.
 */
export function tmToTop(smooth) {
  if (typeof window === "undefined") return;
  if (TM_ZAMEK.pocet > 0) {
    TM_ZAMEK.y = 0;
    try { document.body.style.top = "0px"; } catch (e) {}
    return;
  }
  try { window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" }); } catch (e) { window.scrollTo(0, 0); }
}
