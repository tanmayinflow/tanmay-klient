// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/shell.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

import React, { useState } from "react";
import { createPortal } from "react-dom";

// ----------------------------------------------------------------------
// SKOŘÁPKA DOMU · jednotky, spodní prostor, mobil a dok
// ----------------------------------------------------------------------
// Tohle byla nejtišší a nejhorší část driftu. Obě aplikace měly vlastní
// mobilní CSS a klientská zůstala o generaci pozadu: karta dne byla o čtyřicet
// pixelů širší než telefon, kalendář přetékal na tabletu, dok plaval nad
// hranou displeje. Nešlo o nedbalost, ale o kopii, která se přestala kopírovat.
//
// Odteď je skořápka jeden soubor. Kdo ji opraví, opraví ji v obou domech.

/** Jednotky a spodní prostor. Bez interpolace — je to konstanta. */
export const SHELL_ROOT_CSS = `
/* MĚŘÍTKO ROZHRANÍ
   Dřív tahle proměnná zvětšovala jen text v editoru — nastavení tedy
   na většině stránek nedělalo nic viditelného. Velikosti písma jsou
   po celé aplikaci v pixelech, takže jediná poctivá cesta je zvětšit
   celé rozhraní, přesně jako systémové zvětšení. Zoom se dědí i do
   překryvů v portálu, takže zásuvky a listy jdou s ním. */
/* MĚŘÍTKO
   Velikosti písma jsou po celé aplikaci v pixelech, takže „zvětšit
   text" znamená zvětšit celé rozvržení. Na telefonu se to dělá
   šířkou výřezu (níže v efektu) — jediný způsob, který škáluje
   opravdu všechno včetně pevně ukotvených vrstev. Na počítači se
   výřez ignoruje, a tam měřítko dostane aspoň čtený text přes
   --tm-read. Proměnné jednotek zůstávají, ať se dá měřítko kdykoliv
   přepnout na jiný mechanismus bez přepisování stovek míst. */
:root {
  --tm-ui: 1;
  --tm-vw: calc(1vw / var(--tm-ui)); --tm-vh: calc(1vh / var(--tm-ui));
  --tm-dvw: calc(1dvw / var(--tm-ui)); --tm-dvh: calc(1dvh / var(--tm-ui));

  /* ═══ SPODNÍ PROSTOR · JEDNA SMLOUVA ═══════════════════════════
     Dole se scházela čtyři nezávislá čísla: stránka si držela
     104 px, list 30 px, lišta výběru 88 px, oznámení 100 px — a
     žádné z nich nevědělo, jak je dok vlastně vysoký. Tam, kde dok
     není (list, Dílna, otevřená poznámka, psaní), zbyla po téže
     rezervě prázdná plocha, za kterou obsah zajížděl a která
     vypadala jako neviditelný obdélník u dolní hrany.

     Odteď to plyne z jednoho místa: --tm-dok-misto je přesně to,
     co dok zabírá, plus deset pixelů na nádech, a --tm-kraj je to,
     co potřebuje samotná hrana displeje, když dok není. */
  --tm-safe-b: env(safe-area-inset-bottom, 0px);
  /* DOK DOSEDL NA HRANU. Dřív plaval: čtyři pixely nade dnem,
     dvaadvacet od boků a pod popiskem devět pixelů volného místa,
     které tam zbylo po dotykovém cíli vyšším než obsah. Nahoře
     jedenáct pixelů vzduchu, dole padesát čtyři — dok tím ukrajoval
     ze stránky víc, než sám potřeboval.
     Teď má tlačítko přesně výšku svého obsahu a vzduch se rozdělí
     souměrně; talíř leží boky i dnem na hraně displeje, takže je
     vidět jen jeho horní zaoblení. Bezpečná zóna se přičítá jen
     tolik, aby palec nemířil do pruhu gesta domů — celých
     čtyřiatřicet by vrátilo přesně tu prázdnotu, kvůli které se to
     předělávalo. */
  --tm-dok-tl: 46px;        /* výška tlačítka · ikona, mezera, popisek */
  --tm-dok-pad: 7px;        /* vzduch nad ikonami · a stejný pod popisky */
  --tm-dok-dno: 0px;        /* talíř dosedl na hranu displeje */
  --tm-dok-boky: 0px;       /* strany se dotýkají hran */
  --tm-dok-spod: min(var(--tm-safe-b), 10px);   /* jen mimo pruh gesta */
  --tm-dok-v: calc(var(--tm-dok-tl) + var(--tm-dok-pad) * 2 + var(--tm-dok-spod));
  --tm-dok-misto: calc(var(--tm-dok-dno) + var(--tm-dok-v) + 10px);
  --tm-kraj: calc(var(--tm-safe-b) + 12px);
}
`;

/** Tablet · mezistav, ve kterém se nejsnáz rozbije mřížka.
 *  Dvousloupcová Praxe má minimum 260 px na sloupec plus mezeru; jakmile je
 *  obsah užší než 544 px, mřížka se nesmrští — přeteče. Na tabletu proto
 *  jeden sloupec, přesně jako na telefonu. V osobní aplikaci je tahle třída
 *  nepoužitá, takže tam pravidlo nic nedělá. */
export function shellTabletCss() {
  return `
@media (max-width: 1080px) {
  .tm-praxegrid { display: flex !important; flex-direction: column; align-items: stretch !important; }
  .tm-po-flow { order: 1; } .tm-po-wb { order: 2; } .tm-po-cal { order: 3; }
  .tm-po-cal { width: 100% !important; display: flex !important; flex-direction: column; align-items: stretch; }
  .tm-calwrap { width: 100% !important; max-width: 100% !important; margin: 14px auto 0 !important; box-sizing: border-box; }
}
`;
}

/** Mobilní pravidla skořápky. Berou motiv, protože hrany a stíny jsou z něj. */
export function shellMobileCss(t) {
  return `
@media (max-width: 820px) {
  /* z-index must carry !important — the aside has an inline zIndex:1 that
     otherwise wins, leaving the menu painted UNDER <main> and the dim layer
     (visible through them, unclickable). Anchored to the viewport explicitly. */
  /* Panel visí na středu obrazovky, ne u horní hrany. Ukotvený
     nahoře se svým rohem lezl do stavové lišty a do výřezu pro
     kameru — a i s odsazením bezpečné zóny to na kraji tísnilo.
     Vystředěný má nad sebou i pod sebou stejný vzduch. Dok pod
     ním nehraje roli: při otevřeném panelu leží pod závojem
     (dim 55 > dok 50), takže panel smí být delší a rezervovat
     místo jen stavové liště s výřezem — plus 12 px dechu.
     Bere se větší z obou bezpečných zón, aby střed zůstal středem. */
  .tm-sidebar { --tm-sb-vzduch: max(calc(env(safe-area-inset-top) + 12px), calc(env(safe-area-inset-bottom) + 12px), 24px);
    /* Odsazení i výška musí být důrazné · panel má obojí v přímém
       stylu (sticky pro široké plátno) a přímý styl by pravidlo
       přebil. Přesně proto se panel držel u horní hrany, i když
       pravidlo říkalo něco jiného. */
    position: fixed !important; top: 50% !important; left: 12px; bottom: auto !important; height: auto !important; margin: 0 !important;
    max-height: calc(calc(100 * var(--tm-dvh)) - 2 * var(--tm-sb-vzduch));
    z-index: 60 !important; transform: translate(-110%, -50%);
    transition: transform .25s ease, box-shadow .25s ease;
    width: min(300px, calc(84 * var(--tm-vw))) !important;
    border: 1px solid ${t.borderSoft} !important; border-radius: 24px;
    padding-top: 18px !important; padding-bottom: 12px !important; }
  .tm-sidebar.collapsed { margin-left: 0; }
  /* PŘESNĚ NA MÍRU OBSAHU. Panel nemá co rolovat — je to rozcestník,
     ne stránka. Aby se všechno vešlo i s klávesnicí položek, zhustí
     se řádky, schová se motto (na telefonu je dole dok, věta by se
     opakovala při každém otevření) a poslední řádkou je Koš.
     overflow zůstává auto jen jako pojistka pro ležato. */
  .tm-sidebar { height: auto !important; overflow-y: auto; overscroll-behavior: contain; }
  .tm-sidebar .tm-sbmotto { display: none; }
  /* RYTMUS · logo→hledání→DEN dýchají stejným krokem (16 px),
     řádky o dva pixely volnější — panel tím trochu povyroste. */
  .tm-sidebar .tm-logo { padding: 0 8px 16px !important; }
  .tm-sidebar .tm-nav-item { min-height: 42px; }
  /* poslední karta se nadechne · čára s Košem až po klidné pauze */
  .tm-sidebar .tm-sbdno { margin-top: 38px !important; padding-top: 14px !important; }
  .tm-sidebar.open { transform: translate(0, -50%); box-shadow: ${t.mode === "dark" ? "1px 0 0 0 rgba(240,232,218,0.10), 10px 0 28px -8px rgba(8,5,3,0.55), 34px 0 76px -26px rgba(8,5,3,0.6)" : "1px 0 0 0 rgba(22,67,61,0.07), 10px 0 28px -10px rgba(16,42,38,0.10), 34px 0 76px -30px rgba(22,67,61,0.18)"}; }
  .tm-burger { display: flex !important; }
  .tm-sidetoggle { display: none !important; }
  /* the drawer becomes a bottom sheet · thumb-reach, grab handle, safe area */
  /* Zásuvka je na telefonu taky celá stránka · pruh odkryté stránky
     nad ní nic neříkal a jen ukrajoval z místa. Držadlo zůstává:
     je to pořád ta věc, kterou se dá stáhnout dolů a zavřít. */
  .tm-drawer { top: 0; left: 0; right: 0; bottom: 0; width: 100%; max-height: none; border-left: none; border-top: none; border-radius: 0; box-shadow: ${t.mode === "dark" ? "0 -1px 0 0 rgba(240,232,218,0.12), 0 -10px 28px -8px rgba(8,5,3,0.55), 0 -34px 76px -26px rgba(8,5,3,0.62)" : "0 -1px 0 0 rgba(22,67,61,0.08), 0 -10px 28px -10px rgba(16,42,38,0.11), 0 -34px 76px -30px rgba(22,67,61,0.19)"}; animation: tmSheetIn .34s cubic-bezier(.23,.62,.22,.99) both; }
  .tm-drawer-grip { display: flex; justify-content: center; position: sticky; top: 0; z-index: 5; padding: calc(env(safe-area-inset-top) + 11px) 0 8px; background: inherit; }
  .tm-drawer-grip span { width: 42px; height: 4px; border-radius: 999px; background: ${t.border}; }
  /* breathing room tuned to a phone, content wins over margins */
  /* Rezerva dole je na dok, který od dávky 33 žije v portálu a
     nezabírá místo v proudu — bez ní by poslední karta končila
     pod ním. */
  .tm-page { padding: calc(16px + env(safe-area-inset-top)) 14px var(--tm-dok-misto) !important; }
  /* při psaní dok mizí · rezerva po něm nesmí zůstat */
  body.tm-psani .tm-page { padding-bottom: var(--tm-kraj) !important; }
  /* PWA · content slides under the iPhone status bar; the glass bar
     grows a safe-area brim so every control stays reachable.
     (index.html musí mít viewport-fit=cover.) */
  /* MOBIL · horní lišta mizí; její funkce žijí v ⚙ Nastavení u loga */
  .tm-topbar { display: none !important; }
  .tm-gear { display: inline-flex !important; }
  .tm-mhide { display: none !important; }
  .tm-habitgrid { grid-template-columns: 1fr 1fr !important; }
  /* alignItems:"start" v přímém stylu je psané pro mřížku. Ve sloupci
     z něj ale je „zarovnej na začátek příčné osy", což karty přestane
     roztahovat na šířku a nechá je narůst do max-content — česky
     to dělalo kartu dne o 42 px širší než telefon. */
  .tm-praxegrid { display: flex !important; flex-direction: column; align-items: stretch !important; }
  .tm-po-flow { order: 1; } .tm-po-wb { order: 2; } .tm-po-cal { order: 3; }
  .tm-tabbar { display: flex !important; }
  .tm-toast { bottom: calc(var(--tm-dok-misto) + 8px) !important; }
  /* dok · floats off the edges like the phone's own dock */
  .tm-tabbar {
    left: env(safe-area-inset-left) !important;
    right: env(safe-area-inset-right) !important;
    bottom: var(--tm-dok-dno) !important;
    /* Nahoře vzduch, dole tentýž vzduch plus nejmenší možný odstup
       od pruhu gesta domů. Zaoblení jen nahoře — dolní rohy leží
       na hraně displeje, takže by je stejně nikdo neviděl. */
    padding: var(--tm-dok-pad) 6px calc(var(--tm-dok-pad) + var(--tm-dok-spod)) !important;
    border: 1px solid ${t.borderSoft}; border-bottom: none;
    border-radius: 22px 22px 0 0; box-shadow: ${t.shadowLift}; overflow: hidden; }
  /* Tlačítko je přesně tak vysoké jako jeho obsah a obsah v něm
     stojí na středu — jinak se rozdíl usadí pod popiskem. */
  .tm-tabbar button { min-height: var(--tm-dok-tl) !important; height: var(--tm-dok-tl) !important; justify-content: center !important; padding-top: 0 !important; padding-bottom: 0 !important; font-size: 13px !important; }
  /* deník · quiet list: icons instead of controls, one line per entry */
  .tm-monly { display: inline-flex !important; }
  .tm-jsearch { display: none !important; }
  .tm-jsearch.open { display: block !important; flex: 1 1 100%; width: auto !important; }
  .tm-jfilters { display: none !important; }
  .tm-jfilters.open { display: flex !important; flex-wrap: wrap; gap: 6px; width: 100%; padding-top: 6px; }
  .tm-jsnip { display: none !important; }
  [data-card-journal] { margin: 22px 4px !important; box-shadow: 0 0 0 8px ${t.callout}, 0 0 0 9px ${t.borderSoft} !important; }
  /* filtry Pramenů a Zápisníku · schované za ▾, jako v Deníku */
  .tm-deskonly { display: none !important; }
  /* lišta hromadných akcí nesmí zmizet pod dokem */
  .tm-selbar { bottom: calc(var(--tm-dok-misto) + 4px) !important; }
  /* ═══ ŽÁDNÝ PÁS NAD DOLNÍ HRANOU ═══════════════════════════
     Na telefonu je jediný svislý posuvník stránka. Když měl seznam
     nebo sloupec tabule vlastní posuvník s pevným stropem, obsah
     v něm mizel na čáře pár desítek pixelů nad hranou displeje a
     pod ní zůstal prázdný proužek — ten „neviditelný pás". Strop
     se proto na telefonu ruší: seznam roste, roluje se stránka a
     karta odjede do hrany displeje, ne pod pás. */
  .tm-dnolist { max-height: none !important; overflow-y: visible !important; }
  .tm-bcol { max-height: none !important; }
  .tm-bcol-in { overflow-y: visible !important; }
  .tm-cfilters { display: none !important; }
  .tm-cfilters.open { display: flex !important; flex-wrap: wrap; gap: 8px; margin: 0 0 12px !important; }
  /* Kalendář má stejnou paspartu jako Wellbeing nad ním a zůstává
     přesně na středu sloupce. */
  .tm-po-cal { width: 100% !important; display: flex !important; flex-direction: column; align-items: stretch; }
  .tm-calwrap { width: 100% !important; max-width: 100% !important; margin: 14px auto 0 !important; padding: 14px 16px !important; box-sizing: border-box; }
  .tm-calcard { width: 100% !important; max-width: none !important; margin: 0 auto; padding: 16px !important; }
  /* OTEVŘENÁ KARTA JE NA TELEFONU CELÁ STRÁNKA.
     Dřív měl list horní strop místo pevné výšky. U krátkého textu
     proto sahal jen tam, kam sahal text, a pod ním zůstal odkrytý
     ztmavený závoj — ten „šedý pruh". Teď má výšku celého displeje: nic pod ním
     není, protože není žádné „pod ním". Nadpis stojí nahoře, text
     roluje pod ním, psací lišta dosedne na spodní hranu. */
  .tm-cs-veil { padding: 0 !important; align-items: stretch !important; }
  .tm-cs { width: 100% !important; max-width: none !important; height: calc(100 * var(--tm-dvh)) !important; max-height: none !important; margin: 0 !important; border: none !important; border-radius: 0 !important; box-shadow: none !important; padding: 0 !important; }
  .tm-cs-head { top: 0 !important; margin: 0 !important; padding: calc(env(safe-area-inset-top) + 11px) 16px 9px !important; border-bottom: 1px solid ${t.borderSoft}; }
  /* list nemá dok · jen hranu displeje */
  .tm-cs-body { padding: 12px 16px var(--tm-kraj) !important; }
  /* the burger is redundant next to the tabbar's map */
  .tm-burger { display: none !important; }
  .tm-topbar button { min-height: 40px; padding: 5px 10px !important; }
  .tm-sidebar .tm-nav-item { padding: 9px 10px !important; font-size: 15px !important; }

  /* ---- TRÉNINK · a phone has no room for columns, so a row becomes a card.
     The header line carries no meaning once the cells stack, so it goes.
     Placement is explicit per cell; the markup and every handler stay as
     they are on the desktop. Values name themselves (3 × 5, 90 s, kg). ---- */
  .tm-thead { display: none !important; }
  .tm-trow, .tm-plrow, .tm-srow { padding: 7px 4px !important; row-gap: 1px; align-items: center; }
  .tm-trow > *, .tm-plrow > *, .tm-srow > * { padding-top: 3px !important; padding-bottom: 3px !important; }

  /* workout · name, then dose against rest, then the note */
  .tm-trow { grid-template-columns: 1fr auto !important; }
  .tm-trow > *:nth-child(1) { grid-column: 1 / -1; grid-row: 1; }
  .tm-trow > *:nth-child(2) { grid-column: 1; grid-row: 2; }
  .tm-trow > *:nth-child(3) { grid-column: 2; grid-row: 2; justify-self: end; }
  .tm-trow > *:nth-child(4) { grid-column: 1 / -1; grid-row: 3; }

  /* plan · week and workout on the first line with the ticks, date and effort under */
  .tm-plrow { grid-template-columns: 26px minmax(0,1fr) auto auto !important; }
  .tm-plrow > *:nth-child(1) { grid-column: 1; grid-row: 1; }
  .tm-plrow > *:nth-child(2) { grid-column: 2; grid-row: 1; }
  .tm-plrow > *:nth-child(3) { grid-column: 2; grid-row: 2; }
  .tm-plrow > *:nth-child(4) { grid-column: 3 / -1; grid-row: 2; justify-self: end; }
  .tm-plrow > *:nth-child(5) { grid-column: 3; grid-row: 1; }
  .tm-plrow > *:nth-child(6) { grid-column: 4; grid-row: 1; }

  /* session · tick and name, then what was planned against what was done */
  .tm-srow { grid-template-columns: 26px minmax(0,1fr) minmax(0,1fr) !important; }
  .tm-srow > *:nth-child(1) { grid-column: 1; grid-row: 1; }
  .tm-srow > *:nth-child(2) { grid-column: 2 / -1; grid-row: 1; }
  .tm-srow > *:nth-child(3) { grid-column: 2; grid-row: 2; }
  .tm-srow > *:nth-child(4) { grid-column: 3; grid-row: 2; }
  .tm-srow > *:nth-child(5) { grid-column: 2 / -1; grid-row: 3; }

}
`;
}

// ----------------------------------------------------------------------
// DOK · pruh přilepený na dno VIDITELNÉHO výřezu
// ----------------------------------------------------------------------
// Na iOS se `position: fixed` váže na výřez ROZVRŽENÝ — ten se nemění. Vidět
// je ale výřez VIDITELNÝ, a ten se s adresním řádkem posouvá a při přetažení
// stránky přes okraj nadskakuje. Pevně ukotvený dok proto při rolování
// popojíždí a „nedrží místo". Rozdíl obou výřezů je přesně ta chyba.
//
// Nad klávesnici dok nepatří: tam sedí psací lišta a praly by se. Rozdíl
// větší než 140 px je vždycky klávesnice — tehdy opravu vypneme.
//
// Bez `visualViewport` vrací hook nulu a dok se chová jako obyčejná pevná
// poloha. Žádná verze prohlížeče tak o dok nepřijde.
export function useVyrezPosun() {
  const [posun, setPosun] = useState(0);
  React.useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!vv) return;
    let snimek = 0, posledni = -1;
    const mer = () => {
      const mimo = Math.round(window.innerHeight - (vv.height + (vv.offsetTop || 0)));
      const n = mimo > 140 || mimo < 0 ? 0 : mimo;
      if (n === posledni) return;
      posledni = n;
      setPosun(n);
    };
    const naplanuj = () => { if (snimek) return; snimek = requestAnimationFrame(() => { snimek = 0; mer(); }); };
    mer();
    vv.addEventListener("resize", naplanuj);
    vv.addEventListener("scroll", naplanuj);
    return () => {
      if (snimek) cancelAnimationFrame(snimek);
      vv.removeEventListener("resize", naplanuj);
      vv.removeEventListener("scroll", naplanuj);
    };
  }, []);
  return posun;
}

/* Obal doku: nulově vysoký pruh přilepený na dno viditelného výřezu.
   Sama navigace v něm visí absolutně, takže si mobilní CSS dál řídí
   odsazení i bezpečné zóny — obal jen drží správnou výšku.
   Portál do body je tu proto, aby doku nemohl nikdo shora rozbít ukotvení
   transformací nebo filtrem — obojí by z `fixed` udělalo `absolute`. */
export function TmDok({ children }) {
  const posun = useVyrezPosun();
  if (typeof document === "undefined") return null;
  return createPortal(
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, height: 0, zIndex: 50, pointerEvents: "none",
      transform: posun ? `translate3d(0, ${-posun}px, 0)` : "none",
    }}>
      <div style={{ pointerEvents: "auto" }}>{children}</div>
    </div>,
    document.body
  );
}
