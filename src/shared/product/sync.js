// ----------------------------------------------------------------------
// SYNCHRONIZACE · proč odeslání selhalo
// ----------------------------------------------------------------------
// Odeslání na server je jediná cesta, kterou práce opouští zařízení. Když
// selže, obě aplikace to dosud říkaly jedinou větou — „změny jsou zatím jen
// v tomhle zařízení" — a nabídly „Zkusit znovu". Jenže ta věta je pravdivá
// u čtyř úplně různých příčin a u dvou z nich je to tlačítko marné:
//
//   síť          spojení není. Zkusit znovu má smysl.
//   přihlášení   relace u Cloudflare Access vypršela. Aplikace nainstalovaná
//                na ploše se nikam nepřesměruje, takže přihlašovací obrazovku
//                člověk nikdy neuvidí — a každý další pokus dopadne stejně.
//                Jediná cesta ven je načíst stránku znovu; to fetch neumí.
//   velikost     dokument přerostl strop úložiště. Opakování nepomůže nikdy.
//   server       server odmítl a řekl proč. Ukaž ten důvod.
//
// Bez přesměrování „ručně" se vypršelá relace tvářila jako výpadek sítě:
// prohlížeč šel za přesměrováním na cizí doménu, ta neposílá hlavičky CORS,
// fetch spadl a aplikace to zahodila do stejné větve jako letadlový režim.
// S `redirect: "manual"` odpověď nespadne — přijde jako neprůhledné
// přesměrování se stavem 0, což je jednoznačný podpis vypršelé relace.
// ----------------------------------------------------------------------

export const SYNC_OK = "ok";
export const SYNC_SIT = "sit";
export const SYNC_PRIHLASENI = "prihlaseni";
export const SYNC_VELIKOST = "velikost";
export const SYNC_CLENSTVI = "clenstvi";
export const SYNC_SERVER = "server";

// Odpověď, která není JSON, nikdy nepřišla od Workeru: je to buď přihlašovací
// stránka Accessu, nebo `index.html` z SPA fallbacku. Obojí má stav 200, takže
// `r.ok` na ni říká „uloženo". Tohle je jediné místo, kde se to pozná.
function jeJson(res) {
  const ct = (res && res.headers && res.headers.get("content-type")) || "";
  return ct.indexOf("application/json") !== -1;
}

export function syncDruh(res, telo, err) {
  if (err) return SYNC_SIT;
  if (!res) return SYNC_SIT;
  // Neprůhledné přesměrování · Access poslal na přihlášení.
  if (res.type === "opaqueredirect" || res.status === 0 || res.redirected) return SYNC_PRIHLASENI;
  if (res.status === 401) return SYNC_PRIHLASENI;
  if (res.status === 403) {
    const kod = telo && (telo.code || telo.error);
    if (typeof kod === "string" && kod.indexOf("member") !== -1) return SYNC_CLENSTVI;
    return SYNC_PRIHLASENI;
  }
  if (!jeJson(res)) return SYNC_PRIHLASENI;
  if (res.status === 413 || (telo && telo.code === "too-large")) return SYNC_VELIKOST;
  if (!res.ok) return SYNC_SERVER;
  // Stav 200 sám o sobě není potvrzení zápisu. Tělo musí říct `ok`.
  if (telo && telo.ok === false) return SYNC_SERVER;
  return SYNC_OK;
}

// Jedno volání /api/state, které nikdy nespadne a vždycky řekne, co se stalo.
// Vrací { res, telo, druh, stav } — `stav` je HTTP status, nebo 0 u výpadku.
export async function syncFetch(cesta, init) {
  const o = Object.assign({ cache: "no-store", credentials: "same-origin", redirect: "manual" }, init || {});
  let res = null, err = null, telo = null;
  try {
    res = await fetch(cesta, o);
  } catch (e) {
    err = e || new Error("fetch failed");
  }
  if (res && res.type !== "opaqueredirect" && res.status !== 0) {
    if (jeJson(res)) {
      try { telo = await res.json(); } catch (e) { telo = null; }
    }
  }
  const druh = syncDruh(res, telo, err);
  return { res, telo, druh, stav: (res && res.status) || 0, chyba: err ? String((err && err.message) || err) : null };
}

// Krátká, pravdivá věta pro člověka. `L` je překladová funkce aplikace.
export function syncHlaska(druh, L, info) {
  const stav = (info && info.stav) || 0;
  if (druh === SYNC_PRIHLASENI) {
    return L(
      "Přihlášení vypršelo. Změny zůstávají v tomhle zařízení a na server se nedostanou, dokud aplikaci nenačteš znovu.",
      "Your sign-in has expired. Changes stay on this device and will not reach the server until you reload the app."
    );
  }
  if (druh === SYNC_CLENSTVI) {
    return L(
      "Tenhle účet už nemá přístup ke svému prostoru. Změny zůstávají jen v tomhle zařízení.",
      "This account no longer has access to its workspace. Changes stay on this device only."
    );
  }
  if (druh === SYNC_VELIKOST) {
    const b = info && info.bytes ? Math.round(info.bytes / 10000) / 100 : null;
    return L(
      "Dokument přerostl strop úložiště" + (b ? " (" + b + " MB)" : "") + ", server ho nepřijme. Změny zůstávají jen v tomhle zařízení — stáhni si zálohu.",
      "The document has outgrown the storage ceiling" + (b ? " (" + b + " MB)" : "") + " and the server will not take it. Changes stay on this device only — download a backup."
    );
  }
  if (druh === SYNC_SERVER) {
    return L(
      "Server zápis odmítl" + (stav ? " (" + stav + ")" : "") + ". Změny zůstávají jen v tomhle zařízení.",
      "The server refused the write" + (stav ? " (" + stav + ")" : "") + ". Changes stay on this device only."
    );
  }
  return L(
    "Změny jsou zatím jen v tomhle zařízení — na server se nedostaly. Na jiném zařízení je zatím neuvidíš.",
    "Your changes are on this device only — they have not reached the server. Another device will not see them yet."
  );
}

// Opakování má smysl jen tam, kde se něco může změnit samo. U vypršelé relace
// a u přerostlého dokumentu je „Zkusit znovu" slib, který nejde splnit.
export function syncLzeZkusitZnovu(druh) {
  return druh === SYNC_SIT || druh === SYNC_SERVER;
}
