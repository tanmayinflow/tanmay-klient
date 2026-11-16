// SAZEČ a převod cizího textu · čisté funkce, bez prohlížeče.
// Prohlížečovou část (schránka s formátem, .docx, skutečné PDF) hlídá
// tests/browser/typesetter.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tmSazec, tmVety } from "../src/typesetter.js";
import { tmTextToMd, tmMdNormalize, tmSegsToMd, tmPdfPagesToMd, tmPdfModel, tmPdfFind, tmPdfFragmentToMd, tmPdfRemember, tmPdfFromMemory, tmPdfForget, tmImportKind, TmImportError } from "../src/textImport.js";

const dvakrat = (md, o) => { const a = tmSazec(md, o); assert.equal(tmSazec(a, o), a, "druhé spuštění nesmí nic změnit"); return a; };

test("co starý Sazeč uměl, umí dál", () => {
  const md = dvakrat("Ranní stránky\n\nDnes jsem vstal brzy.\n\nCO MĚ DRŽÍ\n\n• dech\n• chůze\n1) první\n2) druhý\n\n„Kdo chodí, ten dojde.“\n\nNa zítra:\n\npřipravit plán\n=====");
  assert.match(md, /^# Ranní stránky\n\n/);
  assert.match(md, /\n## CO MĚ DRŽÍ\n/);
  assert.match(md, /\n- dech\n- chůze\n1\. první\n2\. druhý\n/);
  assert.match(md, /\n> „Kdo chodí, ten dojde\.“\n/);
  assert.match(md, /\n### Na zítra:\n/);
});

test("verše a obrázky zůstávají, jak jsou", () => {
  const basen = "Tichá voda\nbřehy mele\nkámen leží\nvoda běží";
  assert.equal(tmSazec("\n" + basen + "\n", { cast: true }), basen);
  const s = dvakrat("Titulek\n\n!img(abc123|320)\n\n{^c}Vycentrovaný řádek, který tu má zůstat přesně tam, kde je.");
  assert.match(s, /!img\(abc123\|320\)/);
  assert.match(s, /\{\^c\}Vycentrovaný řádek/);
});

test("text zkopírovaný z PDF: zalomené řádky se slepí, nadpis nad odstavcem se pozná", () => {
  const pdf = [
    "Mobilita kyčlí",
    "Krátký úvod do tématu, který vysvětluje, proč je mobilita kyčlí důležitá pro každodenní",
    "pohyb i pro silový trénink. Tohle je druhá věta, která pokračuje ještě o kousek dál a ro-",
    "zdělené slovo se vrátí dohromady.",
    "Proč na tom záleží",
    "Kyčelní kloub je kulový kloub s velkým rozsahem pohybu. Když rozsah chybí, tělo si ho",
    "bere jinde, nejčastěji v bederní páteři nebo v kolenou. Dlouhé sezení zkracuje flexory",
    "a oslabuje hýžďové svaly, což se pak projeví při dřepu i při chůzi do schodů.",
    "Druhý odstavec pokračuje další myšlenkou. Pravidelná práce s rozsahem pohybu pomáhá",
    "udržet klouby zdravé a snižuje riziko přetížení okolních struktur při sportu.",
  ].join("\n");
  const md = dvakrat(pdf);
  const radky = md.split("\n");
  assert.equal(radky[0], "# Mobilita kyčlí");
  assert.ok(radky.includes("## Proč na tom záleží"), md);
  assert.ok(md.includes("a rozdělené slovo se vrátí dohromady."), md);
  assert.ok(md.includes("při chůzi do schodů.\n\nDruhý odstavec pokračuje"), "mezi odstavci je prázdný řádek");
  assert.ok(!/každodenní\npohyb/.test(md));
  // jako vložený kus: žádný titulek, stavba stejná
  const kus = tmSazec(pdf, { cast: true });
  assert.ok(!/^# /m.test(kus));
  assert.match(kus, /^## Mobilita kyčlí\n/);
});

test("myšlenky psané pod sebou se neslepí do odstavce", () => {
  const md = "Dnes ráno jsem šel běhat a bylo to těžší, než jsem čekal.\nPo snídani jsem si sedl k práci a šlo to samo.\nOdpoledne přišla únava, tak jsem si lehl na dvacet minut.\nVečer jsem ještě chvíli četl a pak šel brzy spát.\nZítra to zkusím stejně, jen s delší rozcvičkou.";
  assert.equal(tmSazec(md, { cast: true }).replace(/\n+/g, "\n"), md);
});

test("číslované kapitoly jsou nadpisy, číslovaný seznam zůstává seznamem", () => {
  const kap = dvakrat("Plán\n\n1. Úvod\nTenhle text vysvětluje, o co v celém plánu jde a proč je postavený právě takhle a ne jinak.\n2. Metoda\nKaždý týden má tři tréninky a jeden den volna, který slouží k tomu, aby tělo stihlo zesílit.\n2.1 Rozcvička\nDeset minut chůze.");
  assert.match(kap, /\n## 1\. Úvod\n/); assert.match(kap, /\n## 2\. Metoda\n/); assert.match(kap, /\n### 2\.1 Rozcvička\n/);
  const sez = dvakrat("Nákup\n\n1. Mléko\n2. Chleba\n3. Vejce\n\nDlouhá poznámka pod seznamem, která nemá ze seznamu dělat kapitoly, protože jím prostě je.");
  assert.match(sez, /\n1\. Mléko\n2\. Chleba\n3\. Vejce\n/);
});

test("nadpis pod seznamem, tučný řádek jako nadpis, řádek tabulky nikdy", () => {
  const md = dvakrat("Cviky\n\n- dřep\n- výpad\nPostup\n1. Zahřej se.\n2. Cvič.\n\n**Poznámka k dýchání**\n\nDýchej nosem a s výdechem povol, ať se tělo stihne uvolnit dřív, než přidáš další opakování.\n\nCvik | Čas\nDřep | 30 s");
  assert.match(md, /\n## Postup\n1\. Zahřej se\./);
  assert.match(md, /\n## Poznámka k dýchání\n/);
  assert.ok(md.includes("\nCvik | Čas\nDřep | 30 s"), md);
});

test("slovníček: pojem tučně, v celé poznámce ano, ve vloženém kusu ne", () => {
  const src = "Shrnutí\n\nCíl: lepší rozsah\nČas: deset minut denně\nMísto: doma\n\nhttps://example.com: tohle štítek není";
  const md = dvakrat(src);
  assert.match(md, /\*\*Cíl:\*\* lepší rozsah\n\*\*Čas:\*\* deset minut denně\n\*\*Místo:\*\* doma/);
  assert.ok(!/## Cíl/.test(md));
  assert.ok(!/\*\*/.test(tmSazec(src, { cast: true })));
});

test("stěna textu se rozdělí na odstavce po větách a podruhé už ne", () => {
  const veta = "Tohle je obyčejná věta, která popisuje jednu myšlenku z dlouhého zápisu. ";
  const stena = "Zápis\n\n" + (veta.repeat(6) + "Naopak druhá část mluví o něčem jiném a zaslouží si vlastní odstavec. " + veta.repeat(7)).trim();
  const md = dvakrat(stena);
  const odstavce = md.split("\n").filter((l) => l && !/^#/.test(l));
  assert.ok(odstavce.length >= 2, "čekám aspoň dva odstavce, mám " + odstavce.length);
  assert.ok(odstavce.every((x) => x.length <= 700), "žádný odstavec nezůstal stěnou");
  assert.ok(odstavce.some((o) => /^Naopak druhá část/.test(o)), "dělí se před obratem");
  assert.equal(odstavce.join(" "), stena.split("\n")[2], "ani znak se neztratil");
  assert.equal(tmSazec(stena, { odstavce: false }).split("\n").filter(Boolean).length, 2);
});

test("věty: zkratky, iniciály a data větu nekončí", () => {
  assert.deepEqual(tmVety("Přišel např. Karel. Potom J. Novák dne 5. Května odešel. Konec!"), ["Přišel např. Karel.", "Potom J. Novák dne 5. Května odešel.", "Konec!"]);
});

test("cizí markdown se převede na značky poznámky", () => {
  const md = tmMdNormalize("#### Hluboký nadpis\n* jedna\n+ dvě\n  - tři\n1) první\n\n[odkaz](https://x.cz) a __tučně__ a _kurzíva_ a `kód` a ***obojí***\n\n```\nkód = 1\n```\n| a | b |\n|---|---|\n| 1 | 2 |\n* * *");
  assert.equal(md, "### Hluboký nadpis\n- jedna\n- dvě\n- tři\n1. první\n\nodkaz (https://x.cz) a **tučně** a *kurzíva* a kód a **obojí**\n\nkód = 1\na | b\n1 | 2\n---");
  assert.match(tmTextToMd("# Titul\n\nKrátký řádek\n\nText pod ním, který je delší."), /^# Titul\n\nKrátký řádek\n\nText/);
});

test("řezy s formátem: mezery ven ze značek, sousedé se slijí", () => {
  assert.equal(tmSegsToMd([{ t: "Ahoj " }, { t: "tučný ", b: true }, { t: "svět", b: true }, { t: " a " }, { t: "kurzíva", i: true }, { t: "." }]), "Ahoj **tučný svět** a *kurzíva*.");
  assert.equal(tmSegsToMd([{ t: "obojí", b: true, i: true }]), "**obojí**");
  assert.equal(tmSegsToMd([{ t: "x", b: true }], true), "x");
});

test("PDF: velikost písma dává nadpisy, zalomené řádky odstavec, zápatí mizí", () => {
  const strana = (n) => {
    const it = []; let y = 760;
    const r = (s, size, extra) => { it.push(Object.assign({ s, x: 72, y, w: s.length * size * 0.5, size }, extra || {})); y -= size * 1.3; };
    if (n === 0) { r("Mobilita kyčlí", 24); y -= 10; }
    r("Kapitola " + (n + 1), 16); y -= 6;
    r("Kyčelní kloub je kulový kloub s velkým rozsahem pohybu. Když rozsah chybí, tělo si", 11);
    r("ho bere jinde, nejčastěji v bederní páteři nebo v kolenou. Dlouhé sezení zkracuje fle-", 11);
    r("xory a oslabuje hýžďové svaly.", 11); y -= 8;
    r("Tučný mezititulek", 11, { bold: true }); y -= 2;
    r("Druhý odstavec je krátký.", 11);
    r("• první odrážka", 11); r("• druhá odrážka", 11);
    it.push({ s: "Skripta mobility", x: 72, y: 30, w: 80, size: 9 });
    it.push({ s: String(n + 1), x: 500, y: 30, w: 6, size: 9 });
    return { w: 595, h: 842, items: it };
  };
  const md = tmPdfPagesToMd([strana(0), strana(1), strana(2)]);
  assert.match(md, /^# Mobilita kyčlí\n\n## Kapitola 1\n/);
  assert.ok(md.includes("Dlouhé sezení zkracuje flexory a oslabuje hýžďové svaly."), md);
  assert.ok(md.includes("### Tučný mezititulek\nDruhý odstavec je krátký."), md);
  assert.ok(md.includes("- první odrážka\n- druhá odrážka"), md);
  assert.ok(!/Skripta mobility/.test(md), "opakované zápatí je pryč");
  assert.equal((md.match(/^## Kapitola/gm) || []).length, 3);
});

test("PDF: dva sloupce se čtou jeden po druhém, sken se ohlásí", () => {
  const it = [];
  for (let i = 0; i < 14; i++) {
    it.push({ s: "Levý sloupec řádek " + (i + 1) + " pokračuje dál", x: 50, y: 760 - i * 14, w: 200, size: 10 });
    it.push({ s: "Pravý sloupec řádek " + (i + 1) + " pokračuje dál", x: 320, y: 760 - i * 14, w: 200, size: 10 });
  }
  const md = tmPdfPagesToMd([{ w: 595, h: 842, items: it }]);
  assert.ok(md.indexOf("Levý sloupec řádek 14") < md.indexOf("Pravý sloupec řádek 1 "), md);
  assert.throws(() => tmPdfPagesToMd([{ w: 595, h: 842, items: [] }]), (e) => e instanceof TmImportError && e.kod === "sken");
});

test("PDF: vložený holý text se v souboru najde a vrátí se se stavbou", () => {
  const it = []; let y = 760;
  const r = (s, size, extra) => { it.push(Object.assign({ s, x: 72, y, w: s.length * size * 0.5, size }, extra || {})); y -= size * 1.3; };
  r("Skripta mobility", 24); y -= 10;
  r("Proč na tom záleží", 16); y -= 6;
  r("Kyčelní kloub je kulový kloub s velkým rozsahem pohybu. Když rozsah chybí, tělo si", 11);
  r("ho bere jinde, nejčastěji v bederní páteři nebo v kolenou.", 11); y -= 8;
  // řádek s tučným slovem uprostřed: tři kousky vedle sebe
  it.push({ s: "Druhý odstavec má ", x: 72, y, w: 99, size: 11 }, { s: "důležité slovo", x: 171, y, w: 77, size: 11, bold: true }, { s: " a končí tady.", x: 248, y, w: 77, size: 11 }); y -= 14.3; y -= 8;
  r("Základní cviky", 13); y -= 4;
  r("• první odrážka se spojkou ﬁ", 11); r("• druhá odrážka", 11);
  const m = tmPdfModel([{ w: 595, h: 842, items: it }], "skripta.pdf");

  // jiné zalomení řádků, jiné mezery, velká písmena jinak, ligatura rozepsaná · přesto se najde
  const vlozeno = "Proč na tom záleží\r\nKyčelní kloub je kulový kloub s velkým\r\nrozsahem pohybu. Když rozsah chybí, tělo si ho bere jinde, nejčastěji v bederní páteři nebo v kolenou.\r\nDruhý odstavec má důležité slovo a končí tady.\r\nZákladní cviky\r\n• první odrážka se spojkou fi";
  assert.ok(tmPdfFind(m, vlozeno));
  const md = tmPdfFragmentToMd(m, vlozeno);
  assert.equal(md, "## Proč na tom záleží\nKyčelní kloub je kulový kloub s velkým rozsahem pohybu. Když rozsah chybí, tělo si ho bere jinde, nejčastěji v bederní páteři nebo v kolenou.\n\nDruhý odstavec má **důležité slovo** a končí tady.\n\n### Základní cviky\n- první odrážka se spojkou ﬁ");

  // výběr od půlky řádku do půlky řádku · nic navíc, nic nechybí
  const kus = tmPdfFragmentToMd(m, "rozsahem pohybu. Když rozsah chybí, tělo si ho bere jinde");
  assert.equal(kus, "rozsahem pohybu. Když rozsah chybí, tělo si ho bere jinde");
  assert.equal(tmPdfFragmentToMd(m, "odstavec má důležité slovo a končí"), "odstavec má **důležité slovo** a končí");

  // co v souboru není, se nenajde · krátký útržek se nehledá vůbec
  assert.equal(tmPdfFragmentToMd(m, "Tenhle text v dokumentu vůbec není a nemá se najít nikde."), null);
  assert.equal(tmPdfFragmentToMd(m, "kyčelní kloub"), null);

  // paměť: jednou přečtené PDF doplní formát dalším kusům, po zapomenutí už ne
  tmPdfForget();
  assert.equal(tmPdfFromMemory(vlozeno), null);
  tmPdfRemember(m); tmPdfRemember(m);
  const z = tmPdfFromMemory("Základní cviky\n• první odrážka se spojkou fi\n• druhá odrážka");
  assert.deepEqual(z, { md: "### Základní cviky\n- první odrážka se spojkou ﬁ\n- druhá odrážka", jmeno: "skripta.pdf" });
  tmPdfForget();
  assert.equal(tmPdfFromMemory(vlozeno), null);
});

test("druh souboru se pozná podle přípony i typu", () => {
  assert.equal(tmImportKind({ name: "Skripta.PDF", type: "" }), "pdf");
  assert.equal(tmImportKind({ name: "x", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), "docx");
  assert.equal(tmImportKind({ name: "a.md", type: "" }), "text");
  assert.equal(tmImportKind({ name: "a.htm", type: "" }), "html");
  assert.equal(tmImportKind({ name: "stary.doc", type: "application/msword" }), "nepodporovany");
  assert.equal(tmImportKind({ name: "foto.png", type: "image/png" }), null);
});

test("druhé spuštění Sazeče nikdy nic nezmění · náhodné poznámky", () => {
  const kusy = ["Krátký řádek", "NADPIS VELKÝMI", "Řádek s dvojtečkou:", "- odrážka", "• puntík", "1. číslo", "1) závorka", "", "", "Cíl: něco", "Čas: jindy",
    "Dlouhý odstavec, který má víc než osmdesát znaků, aby se počítal za prózu a ne za krátký řádek poznámky.",
    "druhý dlouhý řádek začíná malým písmenem a pokračuje dál, takže vypadá jako zalomený kus jedné věty bez konce",
    "„Citát v uvozovkách.“", "---", "**Tučný řádek**", "Kapitola 3", "2.1 Podkapitola", "> citace", "# Hotový titulek", "### hotový mezinadpis", "Otázka na konec?", "{^c}Na střed", "Cvik | Čas"];
  let seed = 7; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let n = 0; n < 1500; n++) {
    const radky = []; const k = 2 + Math.floor(rnd() * 12);
    for (let i = 0; i < k; i++) radky.push(kusy[Math.floor(rnd() * kusy.length)]);
    const md = radky.join("\n");
    for (const o of [undefined, { cast: true }, { odstavce: false, titulek: false, nadpisy: false }]) {
      const a = tmSazec(md, o);
      assert.equal(tmSazec(a, o), a, "vstup:\n" + md + "\n— po prvním:\n" + a);
    }
  }
});

test("aplikace bere Sazeče a převod z vlastních souborů", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.ok(/import \{ tmSazec \} from "\.\/typesetter\.js";/.test(app));
  assert.ok(!/function tmSazec\(/.test(app), "druhá kopie Sazeče v App.tsx nesmí vzniknout");
  assert.ok(/import\("\.\/pdfText\.js"\)/.test(app), "pdf.js se stahuje, až když je potřeba");
  assert.ok(!/from "\.\/pdfText\.js"/.test(app));
});
