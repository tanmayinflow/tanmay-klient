// ————————————————————————————————————————————————————————————
// SAZEČ · místní agent. Projde text a rozsadí ho podle významu:
// titulek, nadpisy, podnadpisy, seznamy, citace, oddělovníky, odstavce.
// Běží úplně offline nad markdownem poznámky — žádná služba, žádné
// předplatné, žádná data ven. Zásady řemesla: co už je vysázené, nechává
// být · básním (souvislé běhy krátkých řádků) nesahá na verše · obrázky
// nese beze změny · druhé spuštění už nic nezmění.
//
// Tři režimy téhož řemesla:
//   tmSazec(md)                    celá poznámka · tlačítko Sazeč
//   tmSazec(md, { cast: true })    vložený kus textu · bez titulku, bez
//                                  zásahů do slov, jen stavba
//   tmSazec(md, { odstavce: false }) převedený soubor · stavbu zná zdroj,
//                                  dlouhé odstavce se nedělí
//   + { titulek: false, nadpisy: false } · zdroj má vlastní nadpisy,
//                                  krátké řádky se už za nadpisy nehádají
//
// Soubor nesmí sáhnout na DOM ani na React. Zkouší se v Node.
// ————————————————————————————————————————————————————————————

export const SAZEC_HOTOVE = /^(#{1,3}\s|[-*]\s|\d{1,3}\.\s|>\s|!img\(|!gd\(|- \[[ xX]\]|-{3,}\s*$)/;

const VELKE = "A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽÄÖÜ";
const MALE = "a-záčďéěíňóřšťúůýžäöüß";
const RE_ZACINA_VELKYM = new RegExp("^[„\"“([]?[" + VELKE + "0-9]");
const RE_ZACINA_MALYM = new RegExp("^[" + MALE + "]");
const RE_DVE_VELKA = new RegExp("[" + VELKE + "]{2}");
const RE_MALE = new RegExp("[" + MALE + "]");
const RE_DELENE = new RegExp("[" + MALE + "]-$");
const RE_KONEC_VETY = /[.!?…]["“”’)\]]*$/;
const RE_KLICOVE = /^(kapitola|část|díl|oddíl|lekce|modul|den|týden|krok|fáze|blok|chapter|part|section|lesson|module|day|week|step|phase)\s+(\d{1,3}|[IVXLC]{1,6})(?=$|[\s:.–-])/i;
const RE_CISLOVANY = new RegExp("^(\\d{1,2}(?:\\.\\d{1,2}){0,3})(\\.?)\\s+([„\"“]?[" + VELKE + "].*)$");
const RE_STITEK = new RegExp("^([" + VELKE + "][^:*_{}\\[\\]|.!?;]{0,34}):\\s+(\\S.*)$");

// zkratky, za kterými tečka větu nekončí
const ZKRATKY = new Set(("např tj tzv atd apod aj resp popř příp př mj tzn cca č str s r sv ing mgr bc mudr judr phdr rndr doc prof dr p pí sl "
  + "min max obr tab viz srov kap odst písm pozn red angl lat něm franc čes rus kr st nar zemř vs etc eg ie mr mrs ms jr sr no vol fig approx ca").split(" "));

// slova, kterými v češtině a angličtině začíná nová myšlenka
const RE_OBRAT = /^(za prvé|za druhé|za třetí|zaprvé|zadruhé|zatřetí|dále|navíc|naopak|na druhou stranu|na druhé straně|nakonec|závěrem|shrnuto|celkově|proto|tedy|zároveň|kromě toho|mimo to|například|jenže|avšak|přesto|později|potom|poté|nejprve|nejdřív|pak|dnes|včera|zítra|ráno|večer|odpoledne|druhý|druhá|druhé|další|první|poslední|třetí|jiný|jiná|jiné|however|moreover|furthermore|in addition|on the other hand|finally|in conclusion|first|second|third|next|then|therefore|for example|meanwhile|later|today|yesterday|another|also)(?=[\s,])/i;

const znacka = (l) => { const m = l.match(/^\{\^[crj]\}/); return m ? m[0] : ""; };
const cisty = (l) => l.replace(/^\{\^[crj]\}/, "");
const hotove = (l) => SAZEC_HOTOVE.test(cisty(l));
const prazdny = (l) => cisty(l).trim() === "";
const jeSeznam = (l) => /^(- \[[ xX]\]|[-*]\s|\d{1,3}\.\s)/.test(cisty(l));
const jeNadpis = (l) => /^#{1,3}\s/.test(cisty(l));
const slov = (s) => s.trim().split(/\s+/).filter(Boolean).length;

// štítek „Pojem: výklad“ · vrací řádek s pojmem tučně, nebo null
const stitekNovy = (l) => {
  const c = cisty(l);
  if (/^(#{1,3}\s|\d{1,3}\.\s|>\s|!img\(|!gd\(|- \[|-{3,}$)/.test(c)) return null;
  const m = c.replace(/^- /, "").trim().match(RE_STITEK);
  if (!m || slov(m[1]) > 4 || /^\/\//.test(m[2]) || /^https?$/i.test(m[1])) return null;
  return (c.indexOf("- ") === 0 ? "- " : "") + "**" + m[1] + ":** " + m[2];
};
const stitekHotovy = (l) => /^(- )?\*\*[^*]{1,36}:\*\*\s+\S/.test(cisty(l));
const jeVelkymi = (txt) => txt.length >= 3 && txt.length <= 64 && txt === txt.toUpperCase() && RE_DVE_VELKA.test(txt) && !RE_MALE.test(txt);

// tři a víc prázdných řádků → jeden
function uhlad(arr) {
  const o = []; let pz = 0;
  arr.forEach((l) => { if (prazdny(l)) { pz++; if (pz <= 1) o.push(""); } else { pz = 0; o.push(l); } });
  return o;
}

// rozdělení odstavce na věty · zkratky, iniciály a řadové číslovky větu nekončí
export function tmVety(text) {
  const out = [];
  const re = /([.!?…]+["“”’)\]]*)\s+(?=[„"“([]?[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽÄÖÜ0-9])/g;
  let od = 0, m;
  while ((m = re.exec(text))) {
    const pred = text.slice(od, m.index);
    const slovo = (pred.match(/([^\s.]+)$/) || [])[1] || "";
    if (m[1].charAt(0) === ".") {
      if (ZKRATKY.has(slovo.toLowerCase())) continue;
      if (slovo.length === 1 && /[A-Za-zÁ-ž]/.test(slovo)) continue;      // iniciála · J. Novák
      if (/^\d{1,2}$/.test(slovo)) continue;                               // 5. května
    }
    out.push(text.slice(od, m.index + m[1].length));
    od = m.index + m[0].length;
  }
  if (od < text.length) out.push(text.slice(od));
  return out;
}

// dlouhá stěna textu → odstavce po několika větách, nejraději před obratem
function rozdelStenu(text) {
  if (text.length <= 700) return [text];
  const vety = tmVety(text);
  if (vety.length < 6) return [text];
  const kusy = []; let kus = "";
  for (let i = 0; i < vety.length; i++) {
    const v = vety[i];
    const zbytek = vety.slice(i).join(" ").length;
    if (kus && zbytek >= 220 && ((kus.length >= 320 && RE_OBRAT.test(v)) || kus.length >= 520)) { kusy.push(kus); kus = ""; }
    kus = kus ? kus + " " + v : v;
  }
  if (kus) kusy.push(kus);
  // každý kus se dělí dál, dokud je co dělit · druhé spuštění pak nemá práci
  return kusy.length > 1 ? kusy.reduce((a, x) => a.concat(rozdelStenu(x)), []) : [text];
}

// Jeden průchod může vytvořit souvislosti (prázdný řádek nad nadpisem), které
// by druhé spuštění četlo jinak. Sází se proto, dokud se text nepřestane měnit:
// co vyjde, je hotové a další stisk tlačítka už nic neudělá.
export function tmSazec(md, opts) {
  let a = String(md || "").replace(/\r\n?/g, "\n");
  for (let i = 0; i < 5; i++) { const b = sazecJednou(a, opts); if (b === a) return b; a = b; }
  return a;
}

function sazecJednou(md, opts) {
  const o = opts || {};
  const cast = !!o.cast;
  const delitOdstavce = !cast && o.odstavce !== false;
  const hledatTitulek = !cast && o.titulek !== false;
  const hadatNadpisy = o.nadpisy !== false;     // false · zdroj má vlastní nadpisy, krátké řádky se nehádají
  const stitky = !cast && o.stitky !== false;

  // 0 · normalizace: konce řádků, ocasní mezery, tvrdé mezery na prázdných řádcích
  let lines = String(md || "").replace(/\r\n?/g, "\n").split("\n")
    .map((l) => l.replace(/[ \t\u00a0]+$/, "").replace(/^(\{\^[crj]\})?\t+/, "$1"));
  lines = uhlad(lines);

  // 1 · sjednocení odrážek, číslování, úkolů, oddělovníků a hlubokých nadpisů
  lines = lines.map((l, i) => {
    const z = znacka(l); const c = cisty(l);
    let m = c.match(/^#{4,6}\s+(.*)$/); if (m) return z + "### " + m[1];
    // podtržený nadpis ve stylu „Titulek / =====“ řeší krok 1b
    if (/^- \[[ xX]\]|^-\s|^\d{1,3}\.\s|^>\s|^#{1,3}\s|^!img\(|^!gd\(|^-{3,}\s*$/.test(c)) return l;
    if (/^\s*([-_*━―—─]\s*){3,}$/.test(c) && c.trim().length >= 3) return "---";
    if (/^\s*={3,}\s*$/.test(c)) return (i > 0 && !prazdny(lines[i - 1])) ? "\u0000=" : "---";
    m = c.match(/^\s*[☐□]\s*(.*)$/); if (m) return z + "- [ ] " + m[1];
    m = c.match(/^\s*[☑☒✅]\s*(.*)$/); if (m) return z + "- [x] " + m[1];
    m = c.match(/^\s*\[([ xX]?)\]\s+(.*)$/); if (m) return z + "- [" + (m[1].trim() ? "x" : " ") + "] " + m[2];
    m = c.match(/^\s*[•▪‣·◦●○■◆▸►➤➢⁃∙*]\s+(.*)$/); if (m) return z + "- " + m[1];
    m = c.match(/^\s*[\uf0b7\uf0a7\uf0d8\uf076]\s*(.*)$/); if (m) return z + "- " + m[1];   // odrážky Wordu ze symbolového písma
    m = c.match(/^\s+-\s+(.*)$/); if (m) return z + "- " + m[1];
    m = c.match(/^\s*[–—]\s+(.*)$/); if (m) return z + "- " + m[1];
    m = c.match(/^\s*\(?(\d{1,3})\)\s+(.*)$/); if (m) return z + m[1] + ". " + m[2];
    m = c.match(/^\s+(\d{1,3})\.\s+(.*)$/); if (m) return z + m[1] + ". " + m[2];
    return l;
  });
  // 1b · „Titulek“ podtržený rovnítky → nadpis
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] !== "\u0000=") continue;
    const p = lines[i - 1];
    if (!hotove(p) && cisty(p).trim().length <= 90) { lines[i - 1] = znacka(p) + "## " + cisty(p).trim(); lines[i] = ""; }
    else lines[i] = "---";
  }
  lines = uhlad(lines);

  // 2 · verše: běh tří a víc „holých" řádků bez prázdných, všechny krátké → nesahat
  //     Řádek velkými písmeny a slovníček „Pojem: výklad“ jsou stavba, ne verš:
  //     běh přeruší, takže titulek nad nimi zůstane titulkem.
  const holy = (l) => !prazdny(l) && !hotove(l);
  const stavba = lines.map((l, i) => jeVelkymi(cisty(l).trim())
    || ((stitekHotovy(l) || stitekNovy(l) != null) && ((i > 0 && (stitekHotovy(lines[i - 1]) || stitekNovy(lines[i - 1]) != null)) || (i + 1 < lines.length && (stitekHotovy(lines[i + 1]) || stitekNovy(lines[i + 1]) != null)))));
  const versovy = (i) => holy(lines[i]) && !stavba[i];
  const vers = new Array(lines.length).fill(false);
  for (let i = 0; i < lines.length; ) {
    if (!versovy(i)) { i++; continue; }
    let j = i; while (j < lines.length && versovy(j)) j++;
    if (j - i >= 3 && lines.slice(i, j).every((l) => cisty(l).length <= 56)) for (let k = i; k < j; k++) vers[k] = true;
    i = j;
  }

  // 3 · scelení zalomené prózy
  //     a) text z PDF: řádky mají skoro stejnou šířku → poznáme šířku sazby
  //        a slepíme, co k sobě patří
  //     b) jinak: dlouhý řádek bez koncové interpunkce + pokračování malým
  //        písmenem = jeden odstavec
  const delky = []; let sVetou = 0;
  for (let k = 0; k + 1 < lines.length; k++) {
    if (vers[k] || znacka(lines[k])) continue;
    if ((holy(lines[k]) || jeSeznam(lines[k])) && holy(lines[k + 1]) && !vers[k + 1]) {
      delky.push(cisty(lines[k]).length);
      // kde každý řádek končí větou, tam nikdo nelámal · to jsou myšlenky pod sebou
      if (RE_KONEC_VETY.test(cisty(lines[k]))) sVetou++;
    }
  }
  let W = 0;
  if (delky.length >= 4) {
    const s = delky.slice().sort((a, b) => a - b);
    const p90 = s[Math.min(s.length - 1, Math.floor(s.length * 0.9))];
    const plnych = s.filter((d) => d >= 0.75 * p90).length;
    if (p90 >= 45 && p90 <= 140 && plnych / s.length >= 0.55 && sVetou / delky.length <= 0.5) W = p90;
  }
  const l3 = []; const v3 = []; const kus3 = [];     // kus3 · délka posledního skutečného řádku ve slepeném odstavci
  for (let k = 0; k < lines.length; k++) {
    const l = lines[k];
    const p = l3.length - 1;
    let spoj = false;
    if (p >= 0 && !vers[k] && !v3[p] && holy(l) && !znacka(l) && !znacka(l3[p]) && l3[p] !== "" && (holy(l3[p]) || (W && jeSeznam(l3[p])))) {
      const A = cisty(l3[p]); const B = cisty(l).trim();
      const malym = RE_ZACINA_MALYM.test(B);
      const konec = /[.!?:;…"“”)\]]$/.test(A);
      if (W) {
        const dalsi = k + 1 < lines.length ? cisty(lines[k + 1]).trim() : "";
        const bVelkymi = B.length >= 3 && B === B.toUpperCase() && RE_DVE_VELKA.test(B);
        const bNadpis = RE_KONEC_VETY.test(A) && (bVelkymi || RE_KLICOVE.test(B) || RE_CISLOVANY.test(B)
          || (B.length < 0.6 * W && !/[.!?…;,:]$/.test(B) && RE_ZACINA_VELKYM.test(B) && dalsi !== "" && !RE_ZACINA_MALYM.test(dalsi)));
        // první slovo dalšího řádku by se sem ještě vešlo a sazeč ho sem nedal → tady odstavec končí
        const veslo = RE_KONEC_VETY.test(A) && !malym && kus3[p] + 1 + (B.split(/\s/)[0] || "").length <= W;
        if (kus3[p] >= 0.82 * W) spoj = !bNadpis && !veslo;
        else if (kus3[p] >= 0.55 * W) spoj = !konec && malym;
      } else spoj = A.length >= 60 && !konec && malym;
      if (spoj) {
        // rozdělené slovo se vrací dohromady: „pohy-“ + „bový“ → „pohybový“
        if (RE_DELENE.test(A) && malym) l3[p] = l3[p].replace(/-$/, "") + B;
        else l3[p] = l3[p] + " " + B;
        kus3[p] = B.length;
      }
    }
    if (!spoj) { l3.push(l); v3.push(vers[k]); kus3.push(cisty(l).length); }
  }
  lines = l3;

  // 3b · dvojité mezery v próze · sazba je nepotřebuje, PDF je sype
  lines = lines.map((l, k) => (v3[k] || !(/ {2,}/.test(l) || /^\s/.test(cisty(l))) || /^!(img|gd)\(/.test(cisty(l))) ? l : znacka(l) + cisty(l).replace(/^\s+/, "").replace(/ {2,}/g, " "));

  // 4 · stavba: titulek, nadpisy, podnadpisy, citace
  const N = lines.length;
  const txtOf = (k) => (k >= 0 && k < N ? cisty(lines[k]).trim() : "");
  const dalsiNeprazdny = (k) => { for (let j = k + 1; j < N; j++) if (txtOf(j) !== "") return j; return -1; };
  // číslované řádky „1. Úvod“ · nadpis, nebo položka seznamu? Rozhoduje, co stojí pod nimi.
  const cislovaneNadpisy = (() => {
    const kand = []; let s = 0;
    for (let k = 0; k < N; k++) {
      const m = cisty(lines[k]).match(/^(\d{1,2})\.\s+(\S.*)$/);
      if (!m || !RE_ZACINA_VELKYM.test(m[2]) || m[2].length > 80 || /[.!?…;,]$/.test(m[2])) continue;
      let holych = 0, dlouhy = false;
      for (let j = k + 1; j < N; j++) {
        const c = cisty(lines[j]);
        if (/^\d{1,2}\.\s/.test(c) || jeNadpis(lines[j])) break;
        if (c.trim() === "" || hotove(lines[j])) continue;
        holych++; if (c.length >= 80) dlouhy = true;
      }
      kand.push(k); if (dlouhy || holych >= 3) s++;
    }
    return kand.length >= 1 && s / kand.length > 0.5 ? new Set(kand) : new Set();
  })();

  // štítky „Pojem: výklad“ · dva a víc pod sebou jsou slovníček, ne nadpisy
  const jeStitek = new Array(N).fill(false);
  for (let i = 0; i < N; ) {
    let j = i;
    while (j < N && (stitekHotovy(lines[j]) || stitekNovy(lines[j]) != null)) j++;
    if (j - i >= 2) for (let k = i; k < j; k++) jeStitek[k] = true;
    i = Math.max(j, i + 1);
  }
  // mezi dvěma odstavci prózy bude prázdný řádek (krok 7) · stavba s ním počítá už teď
  const jeProza = (k) => k >= 0 && k < N && !v3[k] && !jeStitek[k] && txtOf(k) !== "" && !hotove(lines[k]);
  const budeMezera = (a, b) => jeProza(a) && jeProza(b) && cisty(lines[a]).length >= 80 && cisty(lines[b]).length >= 80;

  const kandidati = new Array(N).fill(null);   // { trida, text }
  let titulekVolny = hledatTitulek;
  let titulek = -1;
  for (let k = 0; k < N; k++) {
    const l = lines[k]; const txt = txtOf(k);
    if (txt === "") continue;
    if (cislovaneNadpisy.has(k)) { kandidati[k] = { trida: 1, text: txt }; titulekVolny = false; continue; }
    if (hotove(l) || v3[k] || jeStitek[k] || / \| /.test(txt)) { titulekVolny = false; continue; }   // řádek tabulky není nadpis
    const kratky = txt.length <= 56;
    const predPrazdny = k === 0 || txtOf(k - 1) === "" || k - 1 === titulek || budeMezera(k - 1, k);
    const predVeta = k > 0 && txtOf(k - 1) !== "" && !hotove(lines[k - 1]) && RE_KONEC_VETY.test(txtOf(k - 1));
    const predStavba = k > 0 && (jeNadpis(lines[k - 1]) || jeSeznam(lines[k - 1]) || /^-{3,}$/.test(txtOf(k - 1)));
    const dn = dalsiNeprazdny(k);
    const dalsiText = dn !== -1 && dn <= k + 2;
    const zaPrazdny = k + 1 >= N || txtOf(k + 1) === "" || budeMezera(k, k + 1);
    const velkymi = jeVelkymi(txt);
    const bezKonce = !/[.!?…;,]$/.test(txt);
    const pocet = slov(txt);
    if (titulekVolny && kratky && bezKonce && !/:$/.test(txt)) { titulek = k; titulekVolny = false; continue; }
    titulekVolny = false;
    if (velkymi) { kandidati[k] = { trida: 1, text: txt }; continue; }
    if (/^[„"“].*[“”"]$/.test(txt) && txt.length <= 160 && predPrazdny && zaPrazdny) { kandidati[k] = { citace: true, text: txt }; continue; }
    if (RE_KLICOVE.test(txt) && txt.length <= 80 && pocet <= 9 && bezKonce && dalsiText) { kandidati[k] = { trida: 1, text: txt }; continue; }
    const mc = txt.match(RE_CISLOVANY);
    if (mc && txt.length <= 80 && pocet <= 10 && bezKonce && !/:$/.test(txt) && dalsiText) {
      const hloubka = mc[1].split(".").length;
      if (hloubka >= 2) { kandidati[k] = { trida: 3, text: txt }; continue; }
      const d = dn !== -1 ? cisty(lines[dn]) : "";
      if (!mc[2] && d.length >= 80 && !hotove(lines[dn])) { kandidati[k] = { trida: 1, text: txt }; continue; }
    }
    // celý řádek tučně → nadpis, hvězdičky pryč
    const mb = txt.match(/^\*\*([^*]+)\*\*:?$/);
    if (mb && mb[1].trim().length <= 80 && !/[.!?…;,]$/.test(mb[1].trim()) && dalsiText) { kandidati[k] = { trida: 2, text: mb[1].trim() + (/:$/.test(txt) ? ":" : "") }; continue; }
    if (!hadatNadpisy) continue;
    if (kratky && /:$/.test(txt) && pocet <= 7 && (predPrazdny || predVeta || predStavba) && dalsiText) { kandidati[k] = { trida: 3, text: txt }; continue; }
    if (kratky && bezKonce && !/:$/.test(txt) && dalsiText && !(v3[k + 1] && txtOf(k + 1) !== "")) {
      // a) stojí sám za prázdným řádkem · b) hned pod ním začíná odstavec nebo seznam
      const d = dn !== -1 ? cisty(lines[dn]) : "";
      const podOdstavec = dn === k + 1 && !hotove(lines[dn]) && d.length >= Math.max(80, txt.length * 1.5);
      const podSeznam = dn === k + 1 && jeSeznam(lines[dn]) && pocet <= 5;
      const sam = predPrazdny && pocet <= 7 && (!cast || d.length >= 80 || jeSeznam(lines[dn]));
      const nadOdstavcem = RE_ZACINA_VELKYM.test(txt) && (predVeta || predStavba || k === 0) && pocet <= 8 && (podOdstavec || podSeznam);
      if (sam || nadOdstavcem) { kandidati[k] = { trida: 2, text: txt }; continue; }
    }
  }
  const maJednu = kandidati.some((c) => c && c.trida === 1);
  const maDve = kandidati.some((c) => c && c.trida === 2);
  let out = lines.map((l, k) => {
    const z = znacka(l);
    if (k === titulek) return z + "# " + txtOf(k);
    const c = kandidati[k];
    if (!c) return l;
    if (c.citace) return z + "> " + c.text;
    if (c.trida === 3) return z + "### " + c.text;
    if (c.trida === 2) return z + (maJednu && maDve ? "### " : "## ") + c.text;
    return z + "## " + c.text;
  });
  const versOut = v3.slice();

  // 5 · štítky: pojem tučně
  if (stitky) for (let k = 0; k < N; k++) { if (jeStitek[k]) { const n = stitekNovy(out[k]); if (n != null) out[k] = znacka(out[k]) + n; } }
  let stitekOut = jeStitek.slice();

  // 6 · stěna textu → odstavce
  if (delitOdstavce) {
    const o2 = []; const v2 = []; const s2 = [];
    out.forEach((l, k) => {
      if (versOut[k] || stitekOut[k] || hotove(l) || prazdny(l) || znacka(l)) { o2.push(l); v2.push(versOut[k]); s2.push(stitekOut[k]); return; }
      rozdelStenu(l.trim()).forEach((x) => { o2.push(x); v2.push(false); s2.push(false); });
    });
    out = o2; versOut.length = 0; v2.forEach((x) => versOut.push(x)); stitekOut = s2;
  }

  // 7 · dech: prázdný řádek před nadpisem, za titulkem a mezi odstavci prózy
  const fin = [];
  const proza = (l, k) => !versOut[k] && !stitekOut[k] && !prazdny(l) && !hotove(l);
  out.forEach((l, k) => {
    const c = cisty(l);
    const pred = fin.length ? fin[fin.length - 1] : null;
    if (pred != null && !prazdny(pred)) {
      if (/^#{2,3}\s/.test(c)) fin.push("");
      else if (proza(l, k) && k > 0 && proza(out[k - 1], k - 1)) {
        if (cisty(out[k - 1]).length >= 80 && c.length >= 80) fin.push("");
      } else if (proza(l, k) && c.length >= 80 && k > 0 && jeSeznam(out[k - 1])) fin.push("");
    }
    fin.push(l);
    if (/^#\s/.test(c)) fin.push("");
  });
  const vysledek = uhlad(fin).join("\n").replace(/\n+$/, "");
  return cast ? vysledek.replace(/^\n+/, "") : vysledek;
}
