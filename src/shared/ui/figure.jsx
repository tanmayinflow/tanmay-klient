// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/figure.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

import React from "react";

// ----------------------------------------------------------------------
// PROCEDURÁLNÍ POSTAVA · záložní ilustrace cviku
// ----------------------------------------------------------------------
// Movement Atlas je knihovna hotových desek. Když deska pro cvik neexistuje —
// vlastní cvik, rozšíření katalogu, cokoliv mimo původních 485 identit —
// nakreslí se postava procedurálně z proporcí a úhlů. Obě aplikace používají
// tutéž zálohu, jinak by klient viděl jiný cvik než trenér.
//
// Motiv se sem nedá importovat: useT() žije v kontextu každé aplikace.
// Předává se proto dovnitř jako parametr — jedna továrna, jedno chování.
//
//   const { TmPostava, tmPoza, TM_POZY, TM_POZY_VZOR } = createFigure(useT);
export function createFigure(useT) {
  // ---- proporce · zlomek výšky postavy H --------------------------------
  const PS_D = {                 // délky kostí
    panev: 0.090,                // střed pánve → bederní kloub
    bedra: 0.198,                // bederní → ramenní linie
    krk: 0.062,                  // ramenní linie → krk
    hlava: 0.055,                // krk → střed hlavy (temeno pak vyjde v 1,000)
    paze: 0.186, predlokti: 0.146, ruka: 0.108,
    stehno: 0.245, lytko: 0.246,
    pata: 0.040, spicka: 0.112,  // kotník není na konci chodidla, ale ve čtvrtině
  };
  // poloviční rozchod kloubů · z boku se ramena skoro překrývají, zepředu
  // stojí na plné šířce. Bez tohohle rozlišení vypadá bokem stojící postava,
  // jako by byla čelem — a to je chyba, kterou dělá skoro každý panák.
  const PS_SIR = { ramB: 0.030, ramC: 0.107, kycB: 0.024, kycC: 0.058 };

  // profil poloměrů podél kosti · [podíl délky, poloměr]. Břicho svalu není
  // uprostřed: na stehně a paži je blíž k trupu, na lýtku níž.
  const PS_R = {
    panev:     [[0, 0.074], [1, 0.061]],
    bedra:     [[0, 0.061], [0.62, 0.079], [1, 0.067]],
    krk:       [[0, 0.062], [0.42, 0.033], [1, 0.030]],
    paze:      [[0, 0.038], [0.30, 0.031], [1, 0.025]],
    predlokti: [[0, 0.025], [0.28, 0.027], [1, 0.017]],
    ruka:      [[0, 0.017], [0.45, 0.021], [1, 0.011]],
    stehno:    [[0, 0.052], [0.18, 0.054], [0.75, 0.040], [1, 0.034]],
    lytko:     [[0, 0.034], [0.28, 0.036], [1, 0.021]],
    chodidlo:  [[0, 0.025], [0.26, 0.028], [0.78, 0.022], [1, 0.011]],
  };
  // zepředu je trup širší, než jak je z boku hluboký · 0,174 H napříč proti
  // 0,130 H nadél. Bez toho je čelní postava hubená jako prkno.
  const PS_CELNI_TRUP = 1.22;
  const PS_HLAVA = { rx: 0.0435, ry: 0.0650 };

  const PS_RAD = Math.PI / 180;
  // úhel: 0 = dolů, 90 = doprava, 180 = nahoru, −90 = doleva.
  // Zrcadlení pózy je pak jen změna znaménka.
  const psSmer = (a) => [Math.sin(a * PS_RAD), Math.cos(a * PS_RAD)];
  const psBod = (p, a, d) => { const s = psSmer(a); return [p[0] + s[0] * d, p[1] + s[1] * d]; };
  const psN2 = (v) => Math.round(v * 100) / 100;

  /* Kuželová kapsle mezi dvěma kruhy. Vnější tečny leží na úhlech φ ± α,
     kde α = acos((rA − rB) / D). Obchází se vždy ve směru rostoucího úhlu
     — všechny kapsle mají tím pádem stejnou orientaci, `nonzero` je sjednotí
     a nikde nevznikne díra. Přesně na tomhle to poprvé spadlo. */
  function psKapsle(ax, ay, rA, bx, by, rB) {
    const dx = bx - ax, dy = by - ay;
    const D = Math.hypot(dx, dy);
    if (D < 1e-6 || D <= Math.abs(rA - rB) + 1e-6) {
      // jeden kruh pohltí druhý · zbude větší z nich
      const r = Math.max(rA, rB), cx = rA >= rB ? ax : bx, cy = rA >= rB ? ay : by;
      return `M${psN2(cx - r)},${psN2(cy)}A${psN2(r)},${psN2(r)} 0 1 1 ${psN2(cx + r)},${psN2(cy)}A${psN2(r)},${psN2(r)} 0 1 1 ${psN2(cx - r)},${psN2(cy)}Z`;
    }
    const phi = Math.atan2(dy, dx);
    const a = Math.acos(Math.max(-1, Math.min(1, (rA - rB) / D)));
    const P = (cx, cy, r, t) => `${psN2(cx + r * Math.cos(t))},${psN2(cy + r * Math.sin(t))}`;
    const p1 = P(ax, ay, rA, phi - a), p2 = P(bx, by, rB, phi - a);
    const p3 = P(bx, by, rB, phi + a), p4 = P(ax, ay, rA, phi + a);
    const velkyB = rB > rA ? 1 : 0;   // oblouk na B má rozpětí 2α
    const velkyA = rA > rB ? 1 : 0;   // oblouk na A má rozpětí 360 − 2α
    return `M${p1}L${p2}A${psN2(rB)},${psN2(rB)} 0 ${velkyB} 1 ${p3}L${p4}A${psN2(rA)},${psN2(rA)} 0 ${velkyA} 1 ${p1}Z`;
  }
  // kost jako řetěz kapslí podle profilu · sousední kapsle sdílejí kruh,
  // takže napojení je hladké samo od sebe a nemusí se nic vyhlazovat
  function psKost(p0, p1, profil, H, zuz) {
    const k = zuz || 1;
    let d = "";
    for (let i = 0; i < profil.length - 1; i++) {
      const t0 = profil[i][0], r0 = profil[i][1], t1 = profil[i + 1][0], r1 = profil[i + 1][1];
      const ax = p0[0] + (p1[0] - p0[0]) * t0, ay = p0[1] + (p1[1] - p0[1]) * t0;
      const bx = p0[0] + (p1[0] - p0[0]) * t1, by = p0[1] + (p1[1] - p0[1]) * t1;
      d += psKapsle(ax, ay, r0 * H * k, bx, by, r1 * H * k);
    }
    return d;
  }
  // elipsa se obchází také ve směru rostoucího úhlu · stejná orientace jako kapsle
  const psElipsa = (cx, cy, rx, ry, rot) => {
    const st = ((rot || 0) * 180) / Math.PI;
    const c = Math.cos(rot || 0), s = Math.sin(rot || 0);
    const x0 = psN2(cx - rx * c), y0 = psN2(cy - rx * s);
    const x1 = psN2(cx + rx * c), y1 = psN2(cy + rx * s);
    return `M${x0},${y0}A${psN2(rx)},${psN2(ry)} ${psN2(st)} 1 1 ${x1},${y1}A${psN2(rx)},${psN2(ry)} ${psN2(st)} 1 1 ${x0},${y0}Z`;
  };

  /* Základní póza · klidný stoj. Úhly jsou absolutní, ne vůči rodiči —
     pak se dá „stehno dvacet stupňů od svislé" ověřit proti fotce přímo
     a chyba u pánve neotočí celou postavu. */
  const PS_ZAKLAD = {
    panev: 180, bedra: 180, krk: 180,          // trup vzhůru
    ram: 9, lok: 11, zap: 13,                  // paže volně u těla
    ramL: -9, lokL: -11, zapL: -13,
    kyc: 2, kol: 1, kot: 84,                   // nohy pod tělem, chodidla vpřed
    kycL: -2, kolL: -1, kotL: 84,
    h: 0,                                      // náklon hlavy proti krku
  };

  /* Kostra z úhlů. Vrací body všech kloubů; z nich a z poloměrů se pak
     spočítá skutečný obrys, aby se kresba sama usadila do výřezu — ať je
     póza jakkoliv rozložitá. */
  function psKostra(poza, H) {
    const p = Object.assign({}, PS_ZAKLAD, poza);
    const D = PS_D, celni = !!p.celni;
    const zk = (jm, zal) => (p[jm] !== undefined ? p[jm] : zal);
    const dl = (jm) => (p["d_" + jm] !== undefined ? p["d_" + jm] : 1);   // zkrácení perspektivou
    const tr = celni ? PS_CELNI_TRUP : 1;
    const sirRam = (p.sirRam !== undefined ? p.sirRam : (celni ? PS_SIR.ramC : PS_SIR.ramB)) * H;
    const sirKyc = (p.sirKyc !== undefined ? p.sirKyc : (celni ? PS_SIR.kycC : PS_SIR.kycB)) * H;

    const panev = [0, 0];
    const bedra = psBod(panev, p.panev, D.panev * H * dl("panev"));
    const hrud = psBod(bedra, p.bedra, D.bedra * H * dl("bedra"));
    const krk = psBod(hrud, p.krk, D.krk * H);
    const hlava = psBod(krk, p.krk + zk("h", 0), D.hlava * H);

    const kl = (p.klic !== undefined ? p.klic : p.bedra) + 90;
    const ramP = psBod(hrud, kl, sirRam);
    const ramLv = psBod(hrud, kl + 180, sirRam);
    const lokP = psBod(ramP, zk("ram", 9), D.paze * H * dl("ram"));
    const lokLv = psBod(ramLv, zk("ramL", -9), D.paze * H * dl("ramL"));
    const zapP = psBod(lokP, zk("lok", 11), D.predlokti * H * dl("lok"));
    const zapLv = psBod(lokLv, zk("lokL", -11), D.predlokti * H * dl("lokL"));
    const rukP = psBod(zapP, zk("zap", 13), D.ruka * H * dl("zap"));
    const rukLv = psBod(zapLv, zk("zapL", -13), D.ruka * H * dl("zapL"));

    const ky = (p.pas !== undefined ? p.pas : p.panev) + 90;
    const kycP = psBod(panev, ky, sirKyc);
    const kycLv = psBod(panev, ky + 180, sirKyc);
    const kolP = psBod(kycP, zk("kyc", 2), D.stehno * H * dl("kyc"));
    const kolLv = psBod(kycLv, zk("kycL", -2), D.stehno * H * dl("kycL"));
    const kotP = psBod(kolP, zk("kol", 1), D.lytko * H * dl("kol"));
    const kotLv = psBod(kolLv, zk("kolL", -1), D.lytko * H * dl("kolL"));
    // chodidlo má patu za kotníkem · bez ní vypadá noha jako klaunská bota
    const uP = zk("kot", 84), uL = zk("kotL", 84), fP = dl("kot"), fL = dl("kotL");
    const pataP = psBod(kotP, uP + 180, D.pata * H * fP);
    const pataLv = psBod(kotLv, uL + 180, D.pata * H * fL);
    const spiP = psBod(kotP, uP, D.spicka * H * fP);
    const spiLv = psBod(kotLv, uL, D.spicka * H * fL);

    return {
      panev: panev, bedra: bedra, hrud: hrud, krk: krk, hlava: hlava,
      celni: celni, tr: tr, sirRam: sirRam, sirKyc: sirKyc,
      ramP: ramP, ramL: ramLv, lokP: lokP, lokL: lokLv, zapP: zapP, zapL: zapLv, rukP: rukP, rukL: rukLv,
      kycP: kycP, kycL: kycLv, kolP: kolP, kolL: kolLv, kotP: kotP, kotL: kotLv,
      pataP: pataP, pataL: pataLv, spiP: spiP, spiL: spiLv,
      uhlHlavy: (p.krk + zk("h", 0)) * PS_RAD,
    };
  }

  // ---- cesty pro tři hloubkové vrstvy -----------------------------------
  // Překryv je nejsilnější náznak hloubky, jaký plochá kresba má, a nestojí
  // nic: vzdálená končetina leží pod trupem, blízká nad ním.
  function psCesty(k, H) {
    const R = PS_R, tr = k.tr;
    const trup = (jm) => R[jm].map((q) => [q[0], q[1] * tr]);
    const daleko =
      psKost(k.ramL, k.lokL, R.paze, H, 0.95) +
      psKost(k.lokL, k.zapL, R.predlokti, H, 0.95) +
      psKost(k.zapL, k.rukL, R.ruka, H, 0.95) +
      psKost(k.kycL, k.kolL, R.stehno, H, 0.95) +
      psKost(k.kolL, k.kotL, R.lytko, H, 0.95) +
      psKost(k.pataL, k.spiL, R.chodidlo, H, 0.95);
    const jadro =
      psKost(k.panev, k.bedra, trup("panev"), H) +
      psKost(k.bedra, k.hrud, trup("bedra"), H) +
      psKost(k.hrud, k.krk, trup("krk"), H) +
      psElipsa(k.hlava[0], k.hlava[1], PS_HLAVA.rx * H, PS_HLAVA.ry * H, k.uhlHlavy + Math.PI / 2) +
      // ramenní pás a pánev jako objemy, ne jako čáry
      psKapsle(k.ramP[0], k.ramP[1], 0.038 * H, k.ramL[0], k.ramL[1], 0.038 * H) +
      psKapsle(k.kycP[0], k.kycP[1], 0.052 * H, k.kycL[0], k.kycL[1], 0.052 * H);
    const blizko =
      psKost(k.ramP, k.lokP, R.paze, H) +
      psKost(k.lokP, k.zapP, R.predlokti, H) +
      psKost(k.zapP, k.rukP, R.ruka, H) +
      psKost(k.kycP, k.kolP, R.stehno, H) +
      psKost(k.kolP, k.kotP, R.lytko, H) +
      psKost(k.pataP, k.spiP, R.chodidlo, H);
    return { daleko: daleko, jadro: jadro, blizko: blizko };
  }

  // obrys postavy · kloub plus poloměr, který u něj platí
  const PS_OBRYS = [
    ["panev", 0.074, 1], ["bedra", 0.079, 1], ["hrud", 0.079, 1], ["krk", 0.033, 1], ["hlava", 0.068, 0],
    ["ramP", 0.038, 0], ["ramL", 0.038, 0], ["lokP", 0.027, 0], ["lokL", 0.027, 0],
    ["zapP", 0.021, 0], ["zapL", 0.021, 0], ["rukP", 0.017, 0], ["rukL", 0.017, 0],
    ["kycP", 0.052, 0], ["kycL", 0.052, 0], ["kolP", 0.040, 0], ["kolL", 0.040, 0],
    ["kotP", 0.028, 0], ["kotL", 0.028, 0], ["pataP", 0.025, 0], ["pataL", 0.025, 0],
    ["spiP", 0.014, 0], ["spiL", 0.014, 0],
  ];
  function psRamec(k, H) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < PS_OBRYS.length; i++) {
      const jm = PS_OBRYS[i][0], b = k[jm];
      if (!b) continue;
      const R = PS_OBRYS[i][1] * H * (PS_OBRYS[i][2] ? k.tr : 1);
      if (b[0] - R < x0) x0 = b[0] - R;
      if (b[1] - R < y0) y0 = b[1] - R;
      if (b[0] + R > x1) x1 = b[0] + R;
      if (b[1] + R > y1) y1 = b[1] + R;
    }
    return { x0: x0, y0: y0, x1: x1, y1: y1, s: x1 - x0, v: y1 - y0 };
  }

  /* Usazení do výřezu. Postava se sama zvětší tak, aby výřez vyplnila —
     jinak by ležící pozice byla myší uprostřed prázdna a stojící by lezla
     ven. Zvětšení má strop: kdyby se leh roztáhl na celou výšku, přestalo
     by být poznat, že je to leh. Spodek kresby sedí na zemi; `vzduch`
     postavu zvedne (visy, dipy, skoky, lavička — ty se země nedotýkají). */
  function psUsad(poza, V, okraj) {
    const H = 100;
    const k = psKostra(poza, H);
    const r = psRamec(k, H);
    const vzduch = poza.vzduch || 0;
    const volne = V - 2 * okraj;
    const zaklad = volne / H;                    // stojící postava přesně vyplní
    let s = Math.min(volne / Math.max(r.s, 1e-3), (volne * (1 - vzduch)) / Math.max(r.v, 1e-3));
    s = Math.min(s, zaklad * 1.34);
    const zem = V - okraj;
    const posunY = zem - vzduch * volne - r.y1 * s;
    return {
      k: k, H: H, s: s, ramec: r, zem: zem,
      posunX: V / 2 - ((r.x0 + r.x1) / 2) * s,
      posunY: posunY,
      podlaha: (zem - posunY) / s,               // úroveň země v soustavě postavy
    };
  }

  /* Nářadí. Kreslí se šedě a za postavou, aby s ní nesoupeřilo — je to
     konvence, kterou drží každý ilustrátor cviků, a má důvod: oko musí
     nejdřív přečíst tělo a teprve pak činku. */
  function psNaradi(nar, k, H, r, podlaha) {
    if (!nar) return [];
    const out = [];
    const n1 = (v) => Math.round(v * 10) / 10;
    const car = (x1, y1, x2, y2, w) => out.push({ d: `M${n1(x1)},${n1(y1)}L${n1(x2)},${n1(y2)}`, w: w });
    const ruce = [(k.rukP[0] + k.rukL[0]) / 2, (k.rukP[1] + k.rukL[1]) / 2];
    const pod = podlaha !== undefined ? podlaha : r.y1;
    if (nar === "osa" || nar === "cinka") {
      // z boku je osa vždycky vodorovná · zepředu jde po ose dlaní
      const uh = Math.atan2(k.rukL[1] - k.rukP[1], k.rukL[0] - k.rukP[0]);
      const ux = k.celni ? Math.cos(uh) : 1, uy = k.celni ? Math.sin(uh) : 0;
      const dl = 0.44 * H;
      car(ruce[0] - ux * dl, ruce[1] - uy * dl, ruce[0] + ux * dl, ruce[1] + uy * dl, 0.013 * H);
      [-1, 1].forEach((z) => {
        const cx = ruce[0] + z * ux * dl * 0.86, cy = ruce[1] + z * uy * dl * 0.86;
        car(cx + uy * 0.08 * H, cy - ux * 0.08 * H, cx - uy * 0.08 * H, cy + ux * 0.08 * H, 0.028 * H);
      });
    } else if (nar === "jednorucky") {
      [k.rukP, k.rukL].forEach((b, i) => {
        const zap = i ? k.zapL : k.zapP;
        let ux = b[1] - zap[1], uy = -(b[0] - zap[0]);
        const dd = Math.hypot(ux, uy) || 1; ux /= dd; uy /= dd;
        const dl = 0.062 * H;
        car(b[0] - ux * dl, b[1] - uy * dl, b[0] + ux * dl, b[1] + uy * dl, 0.017 * H);
        [-1, 1].forEach((z) => {
          const cx = b[0] + z * ux * dl * 0.9, cy = b[1] + z * uy * dl * 0.9;
          car(cx - uy * 0.022 * H, cy + ux * 0.022 * H, cx + uy * 0.022 * H, cy - ux * 0.022 * H, 0.026 * H);
        });
      });
    } else if (nar === "hrazda") {
      const y = Math.min(k.rukP[1], k.rukL[1]) - 0.008 * H;
      car(r.x0 - 0.34 * H, y, r.x1 + 0.34 * H, y, 0.013 * H);
      [r.x0 - 0.3 * H, r.x1 + 0.3 * H].forEach((x) => car(x, y, x, pod, 0.011 * H));
    } else if (nar === "bradla") {
      [k.rukP, k.rukL].forEach((b) => {
        car(b[0] - 0.19 * H, b[1] + 0.012 * H, b[0] + 0.19 * H, b[1] + 0.012 * H, 0.013 * H);
        car(b[0] + 0.15 * H, b[1] + 0.012 * H, b[0] + 0.15 * H, pod, 0.011 * H);
      });
    } else if (nar === "lavice") {
      const y = Math.max(k.panev[1], k.hrud[1]) + 0.04 * H;
      const a = r.x0 - 0.06 * H, b = r.x1 + 0.06 * H;
      car(a, y, b, y, 0.022 * H);
      [a + 0.09 * H, b - 0.09 * H].forEach((x) => car(x, y, x, pod, 0.013 * H));
    } else if (nar === "zed" || nar === "zedL") {
      const x = nar === "zed" ? r.x1 + 0.04 * H : r.x0 - 0.04 * H;
      car(x, Math.min(r.y0 - 0.14 * H, pod - 1.05 * H), x, pod, 0.013 * H);
    } else if (nar === "bedna") {
      // bedna stojí pod tou nohou, která je výš
      const noha = k.spiP[1] < k.spiL[1] ? k.spiP : k.spiL;
      const kot = k.spiP[1] < k.spiL[1] ? k.kotP : k.kotL;
      const cx = (noha[0] + kot[0]) / 2, y = Math.max(noha[1], kot[1]) + 0.025 * H;
      car(cx - 0.2 * H, y, cx + 0.2 * H, y, 0.02 * H);
      [cx - 0.17 * H, cx + 0.17 * H].forEach((x) => car(x, y, x, pod, 0.013 * H));
    } else if (nar === "opora_ruce") {
      // bedýnka pod dlaněmi · šikmé kliky, výstupy na ruce
      const cx = (k.rukP[0] + k.rukL[0]) / 2, y = Math.max(k.rukP[1], k.rukL[1]) + 0.02 * H;
      car(cx - 0.2 * H, y, cx + 0.2 * H, y, 0.02 * H);
      [cx - 0.17 * H, cx + 0.17 * H].forEach((x) => car(x, y, x, pod, 0.013 * H));
    } else if (nar === "kladka") {
      const vrch = Math.min(r.y0, pod - 1.15 * H);
      car(ruce[0] + 0.3 * H, vrch, ruce[0] + 0.3 * H, vrch + 0.05 * H, 0.03 * H);
      car(ruce[0] + 0.3 * H, vrch + 0.05 * H, ruce[0], ruce[1], 0.007 * H);
    } else if (nar === "kladka_dole") {
      car(ruce[0] + 0.34 * H, pod, ruce[0], ruce[1], 0.007 * H);
    } else if (nar === "podlozka") {
      car(r.x0 - 0.1 * H, pod, r.x1 + 0.1 * H, pod, 0.014 * H);
    } else if (nar === "kruhy") {
      const vrch = Math.min(r.y0 - 0.2 * H, pod - 1.3 * H);
      [k.rukP, k.rukL].forEach((b) => car(b[0], vrch, b[0], b[1], 0.008 * H));
    } else if (nar === "guma") {
      car(ruce[0], ruce[1], ruce[0] - 0.04 * H, pod, 0.008 * H);
    } else if (nar === "koza") {
      // šikmá lavice na hyperextenze · opora pod boky
      const y = Math.max(k.panev[1], k.kycP[1]) + 0.05 * H;
      car(k.panev[0] - 0.22 * H, y, k.panev[0] + 0.16 * H, y, 0.024 * H);
      car(k.panev[0] - 0.04 * H, y, k.panev[0] - 0.04 * H, pod, 0.014 * H);
    }
    return out;
  }

  const TM_POZY = {
    "abwheel": {bedra:118,kol:-88,kolL:-90,kot:-88,kotL:-90,krk:112,kyc:8,kycL:4,lok:60,lokL:-60,panev:122,ram:62,ramL:-62,zap:58,zapL:-58},
    "activehang": {kol:6,kolL:-6,kot:44,kotL:42,kyc:4,kycL:-4,lok:176,lokL:-176,nar:"hrazda",ram:172,ramL:-172,vzduch:0.17,zap:182,zapL:-182},
    "advtucklever": {bedra:92,kol:-34,kolL:-36,kot:-100,kotL:-102,krk:90,kyc:-112,kycL:-114,lok:179,lokL:179,nar:"hrazda",panev:94,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "advtuckplanche": {bedra:104,kol:-152,kolL:-156,kot:-118,kotL:-122,krk:98,kyc:128,kycL:124,lok:-14,lokL:14,panev:108,ram:-18,ramL:18,vzduch:0.12,zap:32,zapL:28},
    "an_armswing": {lok:156,lokL:-52,ram:148,ramL:-46,zap:162,zapL:-58},
    "an_bbcurl": {lok:-112,lokL:112,nar:"osa",ram:10,ramL:-10,zap:-124,zapL:124},
    "an_benchdbrow": {bedra:114,kol:-6,kolL:-10,kot:88,kotL:88,krk:124,kyc:20,kycL:16,lok:-34,lokL:-6,nar:"jednorucky",panev:108,ram:-4,ramL:-8,zap:-20,zapL:-4},
    "an_bnpullup": {bedra:168,h:26,kol:-30,kolL:-34,kot:36,kotL:34,krk:162,kyc:-10,kycL:-14,lok:176,lokL:-176,nar:"hrazda",panev:172,ram:146,ramL:-146,vzduch:0.17,zap:184,zapL:-184},
    "an_boxdeadlift": {bedra:144,kol:-12,kolL:-16,kot:88,kotL:88,krk:154,kyc:30,kycL:26,lok:4,lokL:-4,nar:"osa",panev:138,ram:6,ramL:-6,zap:2,zapL:-2},
    "an_cablecurl": {lok:-116,lokL:116,nar:"kladka_dole",ram:12,ramL:-12,zap:-128,zapL:128},
    "an_cgbench": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:168,lokL:168,nar:"osa",panev:92,ram:-80,ramL:-80,zap:168,zapL:168},
    "an_chainbench": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"osa",panev:92,ram:-96,ramL:-96,zap:168,zapL:168},
    "an_dbbench": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"jednorucky",panev:92,ram:-96,ramL:-96,zap:168,zapL:168},
    "an_dbdeadlift": {bedra:130,kol:-16,kolL:-20,kot:88,kotL:88,krk:142,kyc:40,kycL:36,lok:4,lokL:-4,nar:"jednorucky",panev:124,ram:6,ramL:-6,zap:2,zapL:-2},
    "an_dbfrontsquat": {bedra:158,kol:-22,kolL:-26,kot:90,kotL:90,krk:168,kyc:76,kycL:70,lok:118,lokL:-118,nar:"jednorucky",panev:152,ram:40,ramL:-40,zap:146,zapL:-146},
    "an_dbpullover": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:172,lokL:172,nar:"jednorucky",panev:92,ram:150,ramL:150,zap:182,zapL:182},
    "an_dbshrug": {lok:8,lokL:-8,nar:"jednorucky",ram:6,ramL:-6,zap:10,zapL:-10},
    "an_defdeadlift": {bedra:122,kol:-20,kolL:-24,kot:88,kotL:88,krk:136,kyc:48,kycL:44,lok:4,lokL:-4,nar:"osa",panev:116,ram:6,ramL:-6,zap:2,zapL:-2},
    "an_floorpress": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"osa",panev:92,ram:-96,ramL:-96,zap:168,zapL:168},
    "an_frenchpress": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:-132,lokL:-132,nar:"jednorucky",panev:92,ram:172,ramL:172,zap:182,zapL:182},
    "an_frontraise": {lok:88,lokL:-16,nar:"jednorucky",ram:86,ramL:-30,zap:90,zapL:-10},
    "an_hammer": {lok:-104,lokL:104,nar:"jednorucky",ram:12,ramL:-12,zap:-112,zapL:112},
    "an_heeltouch": {bedra:108,kol:-24,kolL:-26,kot:-92,kotL:-94,krk:118,kyc:-140,kycL:-142,lok:-40,lokL:40,panev:94,ram:-30,ramL:30,zap:-48,zapL:48},
    "an_highjump": {kol:-14,kolL:-42,kot:38,kotL:34,kyc:22,kycL:-16,lok:168,lokL:-168,panev:178,ram:152,ramL:-152,vzduch:0.14,zap:176,zapL:-176},
    "an_hyperext": {bedra:82,kol:-88,kolL:-90,kot:-40,kotL:-42,krk:68,kyc:-86,kycL:-88,lok:126,lokL:-126,nar:"koza",panev:98,ram:110,ramL:-110,zap:136,zapL:-136},
    "an_inclbench": {bedra:106,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:100,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"osa",panev:108,ram:-96,ramL:-96,zap:168,zapL:168},
    "an_inclcurl": {bedra:158,kol:-16,kolL:-20,krk:168,kyc:60,kycL:56,lok:-124,lokL:124,nar:"jednorucky",panev:152,ram:-20,ramL:20,zap:-128,zapL:128},
    "an_incldbpress": {bedra:106,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:100,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"jednorucky",panev:108,ram:-96,ramL:-96,zap:168,zapL:168},
    "an_inclfly": {bedra:106,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:100,kyc:-108,kycL:-110,lok:-134,lokL:-134,nar:"jednorucky",panev:108,ram:-118,ramL:-118,zap:-146,zapL:-146},
    "an_inclfrench": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:-140,lokL:-140,nar:"jednorucky",panev:92,ram:164,ramL:164,zap:182,zapL:182},
    "an_narrowdbpress": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:176,lokL:176,nar:"jednorucky",panev:92,ram:172,ramL:172,zap:182,zapL:182},
    "an_oadbbench": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:152,lokL:-88,nar:"jednorucky",panev:92,ram:-96,ramL:-86,zap:168,zapL:-90},
    "an_ohcabletri": {lok:-134,lokL:134,nar:"kladka",ram:172,ramL:-172,zap:-150,zapL:150},
    "an_pausesquat": {bedra:160,kol:-20,kolL:-24,kot:90,kotL:90,krk:170,kyc:74,kycL:68,lok:-152,lokL:152,nar:"osa",panev:154,ram:-34,ramL:34,zap:-176,zapL:176},
    "an_revcurl": {lok:-112,lokL:112,nar:"osa",ram:10,ramL:-10,zap:-100,zapL:100},
    "an_revlunge": {bedra:179,kol:-16,kolL:-150,kot:88,kotL:30,kyc:76,kycL:-8,lok:10,lokL:-10,panev:176,ram:8,ramL:-8,zap:12,zapL:-12},
    "an_scaphang": {kol:6,kolL:-6,kot:44,kotL:42,kyc:4,kycL:-4,lok:176,lokL:-176,nar:"hrazda",ram:172,ramL:-172,vzduch:0.17,zap:182,zapL:-182},
    "an_scissors": {bedra:90,kol:-142,kolL:-72,kot:-176,kotL:-110,krk:88,kyc:-140,kycL:-70,lok:-88,lokL:-88,panev:92,ram:-86,ramL:-86,zap:-90,zapL:-90},
    "an_seateddbpress": {h:6,kol:-16,kolL:-20,kot:88,kotL:88,kyc:58,kycL:54,lok:158,lokL:-158,nar:"jednorucky",panev:178,ram:122,ramL:-122,zap:174,zapL:-174},
    "an_seatedshrug": {h:6,kol:-16,kolL:-20,kot:88,kotL:88,kyc:58,kycL:54,lok:10,lokL:-10,nar:"jednorucky",panev:178,ram:8,ramL:-8,zap:180,zapL:-180},
    "an_splitsquat": {bedra:176,kol:-22,kolL:-158,kot:90,kotL:24,kyc:86,kycL:-4,lok:12,lokL:-12,panev:172,ram:10,ramL:-10,zap:14,zapL:-14},
    "an_sumodeadlift": {bedra:130,kol:-34,kolL:-38,kot:96,kotL:96,krk:142,kyc:56,kycL:50,lok:4,lokL:-4,nar:"osa",panev:124,ram:6,ramL:-6,zap:2,zapL:-2},
    "an_svend": {lok:86,lokL:-86,ram:80,ramL:-80,zap:92,zapL:-92},
    "an_vertjump": {kol:-14,kolL:-42,kot:38,kotL:34,kyc:22,kycL:-16,lok:168,lokL:-168,panev:178,ram:152,ramL:-152,vzduch:0.14,zap:176,zapL:-176},
    "an_walklunge": {bedra:179,kol:-16,kolL:-150,kot:88,kotL:30,kyc:76,kycL:-8,lok:10,lokL:-10,nar:"jednorucky",panev:176,ram:8,ramL:-8,zap:12,zapL:-12},
    "an_wpushup": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-54,panev:104,ram:-56,ramL:56,zap:72,zapL:70},
    "anklemob": {bedra:179,kol:-30,kolL:-150,kot:88,kotL:30,kyc:66,kycL:-8,lok:10,lokL:-10,nar:"zed",panev:176,ram:8,ramL:-8,zap:12,zapL:-12},
    "archersq": {bedra:172,celni:1,kol:10,kolL:-54,kot:100,kotL:-102,kyc:68,kycL:-52,lok:74,lokL:-74,panev:168,ram:70,ramL:-70,zap:78,zapL:-78},
    "archhold": {bedra:68,h:-8,kol:-106,kolL:-108,kot:-56,kotL:-58,krk:52,kyc:-104,kycL:-106,lok:-90,lokL:90,panev:88,ram:-88,ramL:88,zap:-92,zapL:92},
    "archpull": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:168,lokL:-176,nar:"hrazda",panev:178,ram:128,ramL:-168,vzduch:0.17,zap:184,zapL:-184},
    "archpush": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:46,lokL:-34,panev:104,ram:-72,ramL:34,zap:72,zapL:58},
    "archrow": {bedra:94,kol:-78,kolL:-80,kot:-16,kotL:-18,krk:92,kyc:-76,kycL:-78,lok:168,lokL:-178,nar:"hrazda",panev:96,ram:140,ramL:-168,zap:184,zapL:-184},
    "atgsplit": {bedra:176,kol:-22,kolL:-158,kot:90,kotL:24,kyc:86,kycL:-4,lok:12,lokL:-12,panev:172,ram:10,ramL:-10,zap:14,zapL:-14},
    "backlever": {bedra:92,kol:-88,kolL:-90,kot:-30,kotL:-32,krk:90,kyc:-86,kycL:-88,lok:-20,lokL:-20,nar:"hrazda",panev:94,ram:-22,ramL:-22,vzduch:0.3,zap:-18,zapL:-18},
    "bail": {bedra:22,kol:120,kolL:-180,kot:172,kotL:-172,krk:0,kyc:150,kycL:-179,lok:1,lokL:-1,panev:26,ram:2,ramL:-2,zap:24,zapL:20},
    "banddip": {bedra:182,kol:56,kolL:52,kot:104,kotL:104,krk:178,kyc:28,kycL:24,lok:44,lokL:-44,nar:"guma",panev:186,ram:-32,ramL:32,vzduch:0.2,zap:10,zapL:-10},
    "bandpull": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:176,lokL:-176,nar:"guma",panev:178,ram:146,ramL:-146,vzduch:0.17,zap:184,zapL:-184},
    "bbrow": {bedra:122,kol:-6,kolL:-10,kot:88,kotL:88,krk:132,kyc:18,kycL:14,lok:-30,lokL:30,nar:"osa",panev:116,ram:2,ramL:-2,zap:-16,zapL:16},
    "bbsquat": {bedra:160,kol:-20,kolL:-24,kot:90,kotL:90,krk:170,kyc:74,kycL:68,lok:-152,lokL:152,nar:"osa",panev:154,ram:-34,ramL:34,zap:-176,zapL:176},
    "bearcrawl": {bedra:108,kol:-64,kolL:-68,kot:-30,kotL:-34,krk:100,kyc:22,kycL:18,lok:6,lokL:-6,panev:112,ram:4,ramL:-4,zap:58,zapL:56},
    "bench": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"osa",panev:92,ram:-96,ramL:-96,zap:168,zapL:168},
    "benchdips": {bedra:182,kol:82,kolL:80,kot:128,kotL:128,krk:178,kyc:86,kycL:84,lok:44,lokL:-44,nar:"lavice",panev:186,ram:-32,ramL:32,vzduch:0.2,zap:10,zapL:-10},
    "bentarmhs": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-52,lokL:52,nar:"bradla",panev:6,ram:54,ramL:-54,zap:-10,zapL:10},
    "bicycle": {bedra:124,klic:152,kol:-30,kolL:-98,kot:-92,kotL:-150,krk:140,kyc:-156,kycL:-96,lok:170,lokL:-170,panev:96,ram:136,ramL:-136,zap:190,zapL:-190},
    "birddog": {bedra:102,kol:-92,kolL:-96,kot:-40,kotL:-96,krk:98,kyc:-90,kycL:-4,lok:4,lokL:146,panev:104,ram:2,ramL:140,zap:56,zapL:150},
    "bodyrow": {bedra:94,kol:-78,kolL:-80,kot:-16,kotL:-18,krk:92,kyc:-76,kycL:-78,lok:178,lokL:-178,nar:"hrazda",panev:96,ram:160,ramL:-160,zap:184,zapL:-184},
    "bosuoahs": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:1,lokL:-40,panev:2,ram:2,ramL:-70,zap:24,zapL:-20},
    "boxbreath": {kol:-76,kolL:-104,kot:-24,kotL:-34,kyc:104,kycL:96,lok:76,lokL:-76,panev:178,ram:32,ramL:-32,zap:94,zapL:-94},
    "boxjump": {kol:-14,kolL:-42,kot:38,kotL:34,kyc:22,kycL:-16,lok:168,lokL:-168,nar:"bedna",panev:178,ram:152,ramL:-152,vzduch:0.14,zap:176,zapL:-176},
    "boxpistol": {bedra:156,kol:-30,kolL:106,kot:92,kotL:150,krk:166,kyc:80,kycL:112,lok:80,lokL:-76,nar:"bedna",panev:150,ram:76,ramL:-72,zap:84,zapL:-80},
    "bridge": {bedra:-76,kol:-16,kolL:-20,krk:-88,kyc:26,kycL:22,lok:-8,lokL:8,panev:-64,ram:-16,ramL:16,zap:26,zapL:-26},
    "broadjump": {kol:-14,kolL:-42,kot:38,kotL:34,kyc:22,kycL:-16,lok:168,lokL:-168,panev:178,ram:152,ramL:-152,vzduch:0.14,zap:176,zapL:-176},
    "bulgariandip": {bedra:182,kol:56,kolL:52,kot:104,kotL:104,krk:178,kyc:28,kycL:24,lok:44,lokL:-44,nar:"kruhy",panev:186,ram:-32,ramL:32,vzduch:0.2,zap:10,zapL:-10},
    "bulgsplit": {bedra:175,kol:-18,kolL:-140,kot:88,kotL:10,kyc:80,kycL:-16,lok:12,lokL:-12,nar:"bedna",panev:170,ram:10,ramL:-10,zap:14,zapL:-14},
    "burpee": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-54,panev:104,ram:-56,ramL:56,zap:72,zapL:70},
    "butterfly": {kol:-56,kolL:-62,kot:-4,kotL:-8,kyc:118,kycL:112,lok:92,lokL:-92,panev:176,ram:76,ramL:-76,zap:104,zapL:-104},
    "bwcurl": {bedra:94,kol:-78,kolL:-80,kot:-16,kotL:-18,krk:92,kyc:-76,kycL:-78,lok:96,lokL:-96,nar:"hrazda",panev:96,ram:156,ramL:-156,zap:70,zapL:-70},
    "cablefly": {lok:84,lokL:-84,nar:"kladka",ram:78,ramL:-78,zap:90,zapL:-90},
    "cablerow": {bedra:178,kol:78,kolL:76,kot:132,kotL:132,kyc:88,kycL:86,lok:84,lokL:-84,nar:"kladka",panev:174,ram:64,ramL:-64,zap:90,zapL:-90},
    "calfraise": {kol:-4,kolL:-4,kot:44,kotL:44,panev:178},
    "cat": {bedra:76,h:-24,kol:-94,kolL:-96,kot:-94,kotL:-96,krk:64,kyc:-2,kycL:-4,lok:6,lokL:-6,panev:88,ram:4,ramL:-4,zap:58,zapL:56},
    "childpose": {bedra:110,kol:-95,kolL:-97,kot:-92,kotL:-94,krk:104,kyc:80,kycL:78,lok:94,lokL:-94,panev:118,ram:96,ramL:-96,zap:92,zapL:-92},
    "chinup": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:176,lokL:-176,nar:"hrazda",panev:178,ram:146,ramL:-146,vzduch:0.17,zap:184,zapL:-184},
    "clamshell": {bedra:92,kol:-22,kolL:-26,kot:-70,kotL:-74,krk:90,kyc:-130,kycL:-134,lok:-30,lokL:-98,panev:94,ram:-70,ramL:-96,zap:-20,zapL:-100},
    "clappush": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:40,lokL:-40,panev:100,ram:-30,ramL:30,vzduch:0.05,zap:60,zapL:56},
    "co2": {kol:-76,kolL:-104,kot:-24,kotL:-34,kyc:104,kycL:96,lok:76,lokL:-76,panev:178,ram:32,ramL:-32,zap:94,zapL:-94},
    "cobra": {bedra:54,h:-8,kol:-90,kolL:-92,kot:-30,kotL:-32,krk:36,kyc:-88,kycL:-90,lok:10,lokL:-10,panev:82,ram:-2,ramL:2,zap:64,zapL:60},
    "commando": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:172,lokL:-170,nar:"hrazda",panev:178,ram:152,ramL:-140,vzduch:0.17,zap:184,zapL:-184},
    "compression": {kol:102,kolL:100,kot:140,kotL:140,kyc:104,kycL:102,lok:10,lokL:-10,panev:178,ram:6,ramL:-6,zap:48,zapL:44},
    "copenhagen": {bedra:106,celni:1,kol:-76,kolL:-20,kot:-36,kotL:-60,krk:104,kyc:-74,kycL:-128,lok:6,lokL:186,nar:"lavice",panev:108,ram:4,ramL:184,zap:52,zapL:188},
    "cossack": {bedra:172,celni:1,kol:10,kolL:-54,kot:100,kotL:-102,kyc:68,kycL:-52,lok:74,lokL:-74,panev:168,ram:70,ramL:-70,zap:78,zapL:-78},
    "couch": {kol:-92,kolL:-166,kot:-88,kotL:-150,kyc:76,kycL:-24,lok:12,lokL:-12,nar:"zedL",panev:178,ram:10,ramL:-10,zap:14,zapL:-14},
    "crow": {bedra:52,kol:-146,kolL:-150,kot:-104,kotL:-108,krk:42,kyc:114,kycL:110,lok:14,lokL:-14,panev:58,ram:8,ramL:-8,zap:62,zapL:58},
    "crunch": {bedra:124,kol:-24,kolL:-26,kot:-92,kotL:-94,krk:140,kyc:-140,kycL:-142,lok:170,lokL:-170,panev:96,ram:136,ramL:-136,zap:190,zapL:-190},
    "ctwhs": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:1,lokL:-1,nar:"zed",panev:2,ram:2,ramL:-2,zap:24,zapL:20},
    "ctwhspu": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-52,lokL:52,nar:"zed",panev:6,ram:54,ramL:-54,zap:-10,zapL:10},
    "dbcurl": {lok:-116,lokL:116,nar:"jednorucky",ram:12,ramL:-12,zap:-128,zapL:128},
    "dbfloor": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"jednorucky",panev:92,ram:-96,ramL:-96,zap:168,zapL:168},
    "dbpress": {lok:156,lokL:-156,nar:"jednorucky",ram:118,ramL:-118,zap:172,zapL:-172},
    "dbrdl": {bedra:124,kol:-6,kolL:-10,kot:88,kotL:88,krk:136,kyc:18,kycL:14,lok:2,lokL:-2,nar:"jednorucky",panev:118,ram:4,ramL:-4,zap:0,zapL:0},
    "dbrow": {bedra:118,kol:-6,kolL:-10,kot:88,kotL:88,krk:128,kyc:20,kycL:16,lok:-34,lokL:-6,nar:"jednorucky",panev:112,ram:-4,ramL:-8,zap:-20,zapL:-4},
    "dbtriext": {lok:-134,lokL:134,nar:"jednorucky",ram:172,ramL:-172,zap:-150,zapL:150},
    "deadbug": {bedra:90,kol:98,kolL:-24,kot:44,kotL:-92,krk:88,kyc:170,kycL:-140,lok:178,lokL:-98,panev:92,ram:176,ramL:-100,zap:180,zapL:-96},
    "deadlift": {bedra:130,kol:-16,kolL:-20,kot:88,kotL:88,krk:142,kyc:40,kycL:36,lok:4,lokL:-4,nar:"osa",panev:124,ram:6,ramL:-6,zap:2,zapL:-2},
    "deadpull": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:170,lokL:-170,nar:"hrazda",panev:178,ram:138,ramL:-138,vzduch:0.17,zap:184,zapL:-184},
    "declpush": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-54,nar:"bedna",panev:104,ram:-56,ramL:56,zap:72,zapL:70},
    "deepsquat": {bedra:156,celni:1,kol:-30,kolL:30,kot:92,kotL:-92,krk:166,kyc:84,kycL:-84,lok:104,lokL:-104,panev:150,ram:30,ramL:-30,zap:132,zapL:-132},
    "diamond": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:40,lokL:-40,panev:104,ram:-38,ramL:38,zap:66,zapL:64},
    "diaphragm": {bedra:90,kol:-24,kolL:-26,kot:-92,kotL:-94,krk:88,kyc:-140,kycL:-142,lok:-88,lokL:-88,panev:92,ram:-86,ramL:-86,zap:-90,zapL:-90},
    "dips": {bedra:182,kol:56,kolL:52,kot:104,kotL:104,krk:178,kyc:28,kycL:24,lok:44,lokL:-44,nar:"bradla",panev:186,ram:-32,ramL:32,vzduch:0.2,zap:10,zapL:-10},
    "disloc": {lok:178,lokL:-178,nar:"guma",ram:174,ramL:-174,zap:182,zapL:-182},
    "donkeykick": {bedra:102,kol:-92,kolL:-96,kot:-40,kotL:-96,krk:98,kyc:-90,kycL:-4,lok:4,lokL:-6,panev:104,ram:2,ramL:-4,zap:56,zapL:54},
    "downdog": {bedra:48,kol:-36,kolL:-38,kot:46,kotL:44,krk:42,kyc:-34,kycL:-36,lok:36,lokL:-36,panev:54,ram:38,ramL:-38,zap:62,zapL:58},
    "dragonflag": {bedra:6,kol:178,kolL:-178,kot:100,kotL:100,krk:2,kyc:176,kycL:-176,lok:-16,lokL:-16,nar:"lavice",panev:10,ram:-24,ramL:-24,vzduch:0.1,zap:-8,zapL:-8},
    "dragonsquat": {bedra:156,kol:-30,kolL:-74,kot:92,kotL:-30,krk:166,kyc:80,kycL:96,lok:80,lokL:-76,panev:150,ram:76,ramL:-72,zap:84,zapL:-80},
    "drep": {bedra:158,kol:-22,kolL:-26,kot:90,kotL:90,krk:168,kyc:76,kycL:70,lok:72,lokL:-68,panev:152,ram:66,ramL:-62,zap:76,zapL:-72},
    "ecccalf": {kol:-4,kolL:-4,kot:122,kotL:122,nar:"bedna",panev:178},
    "eccham": {bedra:144,kol:-88,kolL:-90,kot:-88,kotL:-90,krk:148,kyc:4,kycL:0,lok:48,lokL:-48,panev:142,ram:44,ramL:-44,zap:52,zapL:-52},
    "elbowcars": {lok:154,lokL:-154,ram:88,ramL:-88,zap:172,zapL:-172},
    "elbowlever": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:58,lokL:-58,panev:94,ram:-62,ramL:62,vzduch:0.1,zap:72,zapL:68},
    "elephantwalk": {bedra:100,h:-10,kol:-18,kolL:-4,kot:86,kotL:86,krk:92,kyc:22,kycL:-8,lok:4,lokL:-4,panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "exppull": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:164,lokL:-164,nar:"hrazda",panev:178,ram:132,ramL:-132,vzduch:0.17,zap:184,zapL:-184},
    "extrot": {lok:82,lokL:-82,nar:"guma",ram:10,ramL:-10,zap:88,zapL:-88},
    "facepull": {lok:158,lokL:-158,nar:"kladka",ram:112,ramL:-112,zap:176,zapL:-176},
    "farmer": {lok:10,lokL:-10,nar:"jednorucky",ram:8,ramL:-8},
    "fingerhs": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:1,lokL:-1,panev:2,ram:2,ramL:-2,zap:24,zapL:20},
    "flneg": {bedra:106,kol:-78,kolL:-80,kot:-108,kotL:-110,krk:88,kyc:-76,kycL:-78,lok:179,lokL:179,nar:"hrazda",panev:108,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "flpullup": {bedra:90,kol:-90,kolL:-92,kot:-108,kotL:-110,krk:88,kyc:-88,kycL:-90,lok:122,lokL:122,nar:"hrazda",panev:92,ram:152,ramL:152,vzduch:0.3,zap:182,zapL:182},
    "flraise": {bedra:92,kol:-50,kolL:-52,kot:-100,kotL:-102,krk:90,kyc:-108,kycL:-110,lok:179,lokL:179,nar:"hrazda",panev:94,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "flrow": {bedra:90,kol:-90,kolL:-92,kot:-108,kotL:-110,krk:88,kyc:-88,kycL:-90,lok:130,lokL:130,nar:"hrazda",panev:92,ram:158,ramL:158,vzduch:0.3,zap:182,zapL:182},
    "fltouch": {bedra:90,kol:-90,kolL:-92,kot:-108,kotL:-110,krk:88,kyc:-88,kycL:-90,lok:140,lokL:140,nar:"hrazda",panev:92,ram:162,ramL:162,vzduch:0.3,zap:182,zapL:182},
    "flutter": {bedra:90,kol:-142,kolL:-72,kot:-176,kotL:-110,krk:88,kyc:-140,kycL:-70,lok:-88,lokL:-88,panev:92,ram:-86,ramL:-86,zap:-90,zapL:-90},
    "freehspu": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-52,lokL:52,panev:6,ram:54,ramL:-54,zap:-10,zapL:10},
    "frog": {bedra:104,kol:-108,kolL:-112,kot:-104,kotL:-108,krk:98,kyc:34,kycL:30,lok:72,lokL:70,panev:108,ram:-10,ramL:10,zap:84,zapL:82},
    "frontlever": {bedra:90,kol:-90,kolL:-92,kot:-108,kotL:-110,krk:88,kyc:-88,kycL:-90,lok:179,lokL:179,nar:"hrazda",panev:92,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "frontsplit": {kol:90,kolL:-90,kot:142,kotL:-142,kyc:92,kycL:-92,lok:12,lokL:-12,panev:178,ram:10,ramL:-10,zap:14,zapL:-14},
    "frontsquat": {bedra:166,kol:-18,kolL:-22,kot:90,kotL:90,krk:174,kyc:72,kycL:66,lok:158,lokL:-158,nar:"osa",panev:160,ram:76,ramL:-76,zap:176,zapL:-176},
    "germanhang": {bedra:4,h:70,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:174,kycL:-174,lok:-172,lokL:172,nar:"kruhy",panev:8,ram:-160,ramL:160,vzduch:0.24,zap:-178,zapL:178},
    "glutebridge": {bedra:46,kol:-18,kolL:-20,kot:96,kotL:96,krk:40,kyc:-102,kycL:-104,lok:-90,lokL:-90,panev:52,ram:-92,ramL:-92,zap:-88,zapL:-88},
    "goblet": {bedra:158,kol:-22,kolL:-26,kot:90,kotL:90,krk:168,kyc:76,kycL:70,lok:118,lokL:-118,nar:"jednorucky",panev:152,ram:40,ramL:-40,zap:146,zapL:-146},
    "goodmorning": {bedra:118,kol:-8,kolL:-12,kot:88,kotL:88,krk:130,kyc:20,kycL:16,lok:-150,lokL:150,nar:"osa",panev:112,ram:-40,ramL:40,zap:-176,zapL:176},
    "halflayfl": {bedra:90,kol:-100,kolL:-102,kot:-108,kotL:-110,krk:88,kyc:-114,kycL:-116,lok:179,lokL:179,nar:"hrazda",panev:92,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "handstand": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:1,lokL:-1,panev:2,ram:2,ramL:-2,zap:24,zapL:20},
    "handstandwalk": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:12,lokL:-12,panev:2,ram:16,ramL:-16,zap:24,zapL:20},
    "hang": {kol:6,kolL:-6,kot:44,kotL:42,kyc:4,kycL:-4,lok:180,lokL:-180,nar:"hrazda",ram:178,ramL:-178,vzduch:0.17,zap:182,zapL:-182},
    "headstand": {bedra:2,kol:180,kolL:-180,kot:170,kotL:-170,krk:0,kyc:178,kycL:-178,lok:-146,lokL:146,panev:4,ram:52,ramL:-52,zap:-176,zapL:176},
    "highknees": {bedra:176,kol:20,kolL:-88,kot:74,kotL:20,kyc:130,kycL:-26,lok:-88,lokL:94,panev:172,ram:-32,ramL:38,zap:-100,zapL:106},
    "hinge": {bedra:124,kol:-6,kolL:-10,kot:88,kotL:88,krk:136,kyc:18,kycL:14,lok:2,lokL:-2,nar:"osa",panev:118,ram:4,ramL:-4,zap:0,zapL:0},
    "hip9090": {bedra:176,klic:142,kol:-70,kolL:88,kot:-20,kotL:140,krk:166,kyc:112,kycL:90,lok:104,lokL:-58,panev:178,ram:48,ramL:-24,zap:126,zapL:-76},
    "hipcars": {bedra:102,kol:-60,kolL:-96,kot:-20,kotL:-96,krk:98,kyc:-104,kycL:-4,lok:4,lokL:146,panev:104,ram:2,ramL:140,zap:56,zapL:150},
    "hipthrust": {bedra:46,kol:-18,kolL:-20,kot:96,kotL:96,krk:40,kyc:-102,kycL:-104,lok:-90,lokL:-90,nar:"lavice",panev:52,ram:-92,ramL:-92,zap:-88,zapL:-88},
    "hlr": {bedra:174,kol:142,kolL:138,kot:176,kotL:176,kyc:140,kycL:136,lok:180,lokL:-180,nar:"hrazda",panev:170,ram:178,ramL:-178,vzduch:0.17,zap:182,zapL:-182},
    "hold90": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:44,lokL:-44,panev:94,ram:-46,ramL:46,vzduch:0.14,zap:34,zapL:30},
    "hollow": {bedra:100,kol:-60,kolL:-62,kot:-116,kotL:-118,krk:94,kyc:-58,kycL:-60,lok:-120,lokL:-120,panev:106,ram:-118,ramL:-118,zap:-122,zapL:-122},
    "hspu90": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-70,lokL:70,panev:6,ram:70,ramL:-70,zap:-10,zapL:10},
    "hspu90neg": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-70,lokL:70,panev:6,ram:70,ramL:-70,zap:-10,zapL:10},
    "hspuhold": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-52,lokL:52,panev:6,ram:54,ramL:-54,zap:-10,zapL:10},
    "hspuneg": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-32,lokL:32,panev:6,ram:34,ramL:-34,zap:-10,zapL:10},
    "hsshift": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:10,lokL:-10,panev:2,ram:14,ramL:-14,zap:24,zapL:20},
    "humanflag": {bedra:90,celni:1,kol:-90,kolL:-92,kot:-36,kotL:-38,krk:104,kyc:-88,kycL:-90,lok:182,lokL:8,nar:"zed",panev:92,ram:180,ramL:6,vzduch:0.3,zap:52,zapL:188},
    "icecream": {bedra:90,kol:-90,kolL:-92,kot:-108,kotL:-110,krk:88,kyc:-88,kycL:-90,lok:120,lokL:120,nar:"hrazda",panev:92,ram:150,ramL:150,vzduch:0.3,zap:182,zapL:182},
    "inclpush": {bedra:118,kol:-58,kolL:-60,kot:-4,kotL:-6,krk:116,kyc:-56,kycL:-58,lok:14,lokL:-14,nar:"opora_ruce",panev:120,ram:8,ramL:-8,zap:66,zapL:62},
    "inclrow": {bedra:94,kol:-78,kolL:-80,kot:-16,kotL:-18,krk:92,kyc:-76,kycL:-78,lok:178,lokL:-178,nar:"hrazda",panev:96,ram:160,ramL:-160,zap:184,zapL:-184},
    "ironcross": {celni:1,kol:2,kolL:-2,kot:110,kotL:110,kyc:3,kycL:-3,lok:94,lokL:-94,nar:"kruhy",ram:94,ramL:-94,vzduch:0.3,zap:94,zapL:-94},
    "jacks": {celni:1,kol:34,kolL:-34,kot:106,kotL:-106,kyc:36,kycL:-36,lok:166,lokL:-166,ram:156,ramL:-156,zap:174,zapL:-174},
    "jefferson": {bedra:100,h:-10,kol:2,kolL:-2,kot:86,kotL:86,krk:92,kyc:6,kycL:-6,lok:4,lokL:-4,nar:"osa",panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_adho_mukha_svanasana": {bedra:48,kol:-36,kolL:-38,kot:46,kotL:44,krk:42,kyc:-34,kycL:-36,lok:36,lokL:-36,panev:54,ram:38,ramL:-38,zap:62,zapL:58},
    "jg_adho_mukha_vrksasana": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:1,lokL:-1,panev:2,ram:2,ramL:-2,zap:24,zapL:20},
    "jg_advasana": {bedra:92,kol:-88,kolL:-90,kot:-30,kotL:-32,krk:90,kyc:-86,kycL:-88,lok:90,lokL:-90,panev:94,ram:92,ramL:-92,zap:88,zapL:-88},
    "jg_agnistambhasana": {kol:-80,kolL:-88,kot:-30,kotL:-38,kyc:100,kycL:92,lok:76,lokL:-76,panev:178,ram:32,ramL:-32,zap:94,zapL:-94},
    "jg_akarna_dhanurasana": {kol:90,kolL:-146,kot:140,kotL:-180,kyc:90,kycL:134,lok:48,lokL:-150,panev:178,ram:24,ramL:-140,zap:70,zapL:-158},
    "jg_anahatasana": {bedra:94,kol:-90,kolL:-92,kot:-90,kotL:-92,krk:84,kyc:4,kycL:0,lok:94,lokL:-94,panev:106,ram:96,ramL:-96,zap:92,zapL:-92},
    "jg_ananda_balasana": {bedra:90,kol:-186,kolL:-188,kot:-150,kotL:-152,krk:88,kyc:-146,kycL:-148,lok:-176,lokL:-176,panev:92,ram:-160,ramL:-160,zap:-186,zapL:-186},
    "jg_anantasana": {bedra:92,kol:166,kolL:-26,kot:120,kotL:-74,krk:90,kyc:160,kycL:-134,lok:158,lokL:-180,panev:94,ram:148,ramL:-178,zap:166,zapL:-182},
    "jg_anjaneyasana": {bedra:178,kol:-22,kolL:-158,kot:90,kotL:24,kyc:86,kycL:-4,lok:178,lokL:-178,panev:174,ram:174,ramL:-174,zap:182,zapL:-182},
    "jg_ardha_baddha_padmottanasana": {bedra:100,h:-10,kol:2,kolL:-64,kot:86,kotL:-22,krk:92,kyc:6,kycL:112,lok:4,lokL:-4,panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_ardha_candrasana": {bedra:138,celni:1,kol:4,kolL:-90,kot:94,kotL:-140,krk:136,kyc:8,kycL:-92,lok:52,lokL:-128,panev:140,ram:54,ramL:-126,zap:50,zapL:-130},
    "jg_ardha_kurmasana": {bedra:110,kol:-95,kolL:-97,kot:-92,kotL:-94,krk:104,kyc:80,kycL:78,lok:98,lokL:-98,panev:118,ram:100,ramL:-100,zap:96,zapL:-96},
    "jg_ardha_matsyendrasana": {bedra:176,klic:142,kol:-70,kolL:88,kot:-20,kotL:140,krk:166,kyc:112,kycL:90,lok:104,lokL:-58,panev:178,ram:48,ramL:-24,zap:126,zapL:-76},
    "jg_ardha_navasana": {bedra:132,kol:30,kolL:28,kot:54,kotL:52,krk:140,kyc:34,kycL:32,lok:64,lokL:-64,panev:124,ram:62,ramL:-62,zap:66,zapL:-66},
    "jg_ardha_pincha_mayurasana": {bedra:48,kol:-36,kolL:-38,kot:46,kotL:44,krk:42,kyc:-34,kycL:-36,lok:84,lokL:82,panev:54,ram:24,ramL:-24,zap:96,zapL:94},
    "jg_ardha_uttanasana": {bedra:116,kol:2,kolL:-2,kot:86,kotL:86,krk:108,kyc:6,kycL:-6,lok:14,lokL:-14,panev:126,ram:18,ramL:-18,zap:10,zapL:-10},
    "jg_astanga_namaskara": {bedra:110,kol:-92,kolL:-94,kot:-40,kotL:-42,krk:96,lok:68,lokL:66,panev:124,ram:-24,ramL:24,zap:88,zapL:86},
    "jg_astavakrasana": {bedra:64,kol:104,kolL:100,kot:150,kotL:148,krk:56,kyc:110,kycL:106,lok:6,lokL:-6,panev:72,ram:-8,ramL:8,vzduch:0.08,zap:48,zapL:44},
    "jg_asva_sancalanasana": {bedra:176,kol:-22,kolL:-158,kot:90,kotL:24,kyc:86,kycL:-4,lok:12,lokL:-12,panev:172,ram:10,ramL:-10,zap:14,zapL:-14},
    "jg_baddha_konasana": {kol:-56,kolL:-62,kot:-4,kotL:-8,kyc:118,kycL:112,lok:92,lokL:-92,panev:176,ram:76,ramL:-76,zap:104,zapL:-104},
    "jg_baddha_padmasana": {kol:-86,kolL:-112,kot:-40,kotL:-50,kyc:110,kycL:100,lok:-128,lokL:128,panev:178,ram:-22,ramL:22,zap:-156,zapL:156},
    "jg_baddha_trikonasana": {bedra:142,celni:1,d_kot:0.7,d_kotL:0.5,kol:56,kolL:-58,kot:96,kotL:-96,krk:138,kyc:58,kycL:-56,lok:-46,lokL:-104,panev:146,ram:30,ramL:-150,zap:-70,zapL:-84},
    "jg_bakasana": {bedra:52,kol:-146,kolL:-150,kot:-104,kotL:-108,krk:42,kyc:114,kycL:110,lok:14,lokL:-14,panev:58,ram:8,ramL:-8,zap:62,zapL:58},
    "jg_balasana": {bedra:110,kol:-95,kolL:-97,kot:-92,kotL:-94,krk:104,kyc:80,kycL:78,lok:94,lokL:-94,panev:118,ram:96,ramL:-96,zap:92,zapL:-92},
    "jg_bhadrasana": {kol:-56,kolL:-62,kot:-4,kotL:-8,kyc:118,kycL:112,lok:92,lokL:-92,panev:176,ram:76,ramL:-76,zap:104,zapL:-104},
    "jg_bharadvajasana": {bedra:176,klic:136,kol:-88,kolL:-104,kot:-80,kotL:-90,krk:166,kyc:92,kycL:84,lok:104,lokL:-58,panev:178,ram:48,ramL:-24,zap:126,zapL:-76},
    "jg_bhekasana": {bedra:92,kol:-168,kolL:-170,kot:-140,kotL:-142,krk:90,kyc:-104,kycL:-106,lok:-142,lokL:142,panev:94,ram:-48,ramL:48,zap:-166,zapL:166},
    "jg_bhujangasana": {bedra:54,h:-8,kol:-90,kolL:-92,kot:-30,kotL:-32,krk:36,kyc:-88,kycL:-90,lok:10,lokL:-10,panev:82,ram:-2,ramL:2,zap:64,zapL:60},
    "jg_bhujapidasana": {bedra:52,kol:98,kolL:94,kot:142,kotL:142,krk:42,kyc:126,kycL:122,lok:14,lokL:-14,panev:58,ram:8,ramL:-8,zap:62,zapL:58},
    "jg_bitilasana_marjari": {bedra:122,h:22,kol:-88,kolL:-90,kot:-88,kotL:-90,krk:134,kyc:4,kycL:2,lok:2,lokL:-2,panev:118,ram:0,ramL:0,zap:54,zapL:52},
    "jg_camatkarasana": {bedra:-64,kol:-16,kolL:-58,kotL:-20,krk:-78,kyc:26,kycL:-104,lok:-8,lokL:8,panev:-48,ram:-16,ramL:16,zap:26,zapL:-26},
    "jg_caturanga_dandasana": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-54,panev:104,ram:-56,ramL:56,zap:72,zapL:70},
    "jg_dandasana": {kol:90,kolL:88,kot:140,kotL:140,kyc:90,kycL:88,lok:48,lokL:-48,panev:178,ram:24,ramL:-24,zap:70,zapL:-70},
    "jg_dandayamana_bibhaktapada_pascimottanasana": {bedra:96,celni:1,kol:28,kolL:-28,kot:96,kotL:-96,krk:90,kyc:34,kycL:-34,lok:4,lokL:-4,panev:104,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_dandayamana_dhanurasana": {bedra:172,kol:0,kolL:-176,kotL:-140,krk:178,kycL:-40,lok:178,lokL:-150,panev:168,ram:174,ramL:-44,zap:182,zapL:-160},
    "jg_dandayamana_janusirasana": {bedra:126,kol:2,kolL:112,kot:86,kotL:150,krk:118,kyc:6,kycL:116,lok:102,lokL:-102,panev:134,ram:104,ramL:-104,zap:100,zapL:-100},
    "jg_dhanurasana": {bedra:126,h:-14,kol:-170,kolL:-172,kot:-150,kotL:-152,krk:142,kyc:-86,kycL:-88,lok:-104,lokL:-104,panev:100,ram:-104,ramL:-104,zap:-104,zapL:-104},
    "jg_dragon": {bedra:176,kol:-22,kolL:-158,kot:90,kotL:24,kyc:86,kycL:-4,lok:12,lokL:-12,panev:172,ram:10,ramL:-10,zap:14,zapL:-14},
    "jg_dvi_pada_viparita_dandasana": {bedra:-76,kol:-16,kolL:-20,krk:-88,kyc:26,kycL:22,lok:60,lokL:58,panev:-64,ram:-30,ramL:30,zap:82,zapL:80},
    "jg_eka_pada_koundinyasana": {bedra:64,kol:104,kolL:-98,kot:150,kotL:-40,krk:56,kyc:110,kycL:-96,lok:6,lokL:-6,panev:72,ram:-8,ramL:8,vzduch:0.08,zap:48,zapL:44},
    "jg_eka_pada_rajakapotasana": {bedra:202,h:-20,kol:-86,kolL:-168,kot:-84,kotL:-150,krk:214,kyc:94,kycL:-96,lok:-140,lokL:140,panev:190,ram:192,ramL:-192,zap:16,zapL:-16},
    "jg_eka_pada_sirsasana": {h:10,kol:-134,kolL:90,kot:-104,kotL:140,krk:178,kyc:170,kycL:92,lok:110,lokL:-110,panev:176,ram:26,ramL:-26,zap:138,zapL:-138},
    "jg_galavasana": {bedra:70,kol:-128,kolL:-82,kot:-96,kotL:-40,krk:62,kyc:120,kycL:-80,lok:20,lokL:-20,panev:76,ram:-10,ramL:10,vzduch:0.1,zap:52,zapL:48},
    "jg_garbha_pindasana": {bedra:150,kol:-104,kolL:-110,kot:-60,kotL:-66,krk:158,kyc:76,kycL:70,lok:128,lokL:-128,panev:142,ram:52,ramL:-52,zap:156,zapL:-156},
    "jg_garudasana": {bedra:176,kol:4,kolL:-118,kot:86,kotL:-160,kyc:8,kycL:44,lok:170,lokL:-168,panev:172,ram:100,ramL:-84,zap:186,zapL:176},
    "jg_gomukhasana": {kol:-84,kolL:-116,kot:-40,kotL:-56,kyc:112,kycL:94,lok:-146,lokL:140,panev:178,ram:176,ramL:-20,zap:-160,zapL:156},
    "jg_gorakshasana": {kol:-95,kolL:-97,kot:-140,kotL:-142,kyc:80,kycL:78,lok:58,lokL:-58,panev:178,ram:20,ramL:-20,zap:84,zapL:-84},
    "jg_halasana": {bedra:5,h:86,kol:40,kolL:37,kot:68,kotL:66,krk:0,kyc:40,kycL:37,lok:-86,lokL:-86,panev:10,ram:-68,ramL:-68,zap:-90,zapL:-90},
    "jg_hamsasana": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:50,lokL:-50,panev:94,ram:-54,ramL:54,vzduch:0.1,zap:66,zapL:62},
    "jg_hanumanasana": {kol:90,kolL:-90,kot:142,kotL:-142,kyc:92,kycL:-92,lok:12,lokL:-12,panev:178,ram:10,ramL:-10,zap:14,zapL:-14},
    "jg_hasta_uttanasana": {bedra:202,h:-14,kol:-2,kolL:4,krk:214,kyc:-6,kycL:8,lok:200,lokL:-200,panev:190,ram:196,ramL:-196,zap:204,zapL:-204},
    "jg_janu_sirsasana": {bedra:116,kol:90,kolL:-40,kot:140,kotL:-6,krk:108,kyc:90,kycL:126,lok:96,lokL:-96,panev:126,ram:98,ramL:-98,zap:94,zapL:-94},
    "jg_jathara_parivartanasana": {bedra:88,klic:126,kol:-158,kolL:-160,kot:-190,kotL:-192,krk:82,kyc:-156,kycL:-158,lok:96,lokL:-96,panev:92,ram:94,ramL:-94,zap:98,zapL:-98},
    "jg_kakasana": {bedra:52,kol:-146,kolL:-150,kot:-104,kotL:-108,krk:42,kyc:114,kycL:110,lok:34,lokL:-34,panev:58,ram:16,ramL:-16,zap:66,zapL:62},
    "jg_kandharasana": {bedra:46,kol:-18,kolL:-20,kot:96,kotL:96,krk:40,kyc:-102,kycL:-104,lok:-90,lokL:-90,panev:52,ram:-92,ramL:-92,zap:-88,zapL:-88},
    "jg_kapotasana": {bedra:228,h:-26,kol:-90,kolL:-92,kot:-90,kotL:-92,krk:248,kyc:6,kycL:2,lok:-30,lokL:30,panev:206,ram:-72,ramL:72,zap:-8,zapL:8},
    "jg_karnapidasana": {bedra:5,h:86,kol:-46,kolL:-50,kot:-70,kotL:-74,krk:0,kyc:40,kycL:36,lok:-86,lokL:-86,panev:10,ram:-68,ramL:-68,zap:-90,zapL:-90},
    "jg_kati_cakrasana": {celni:1,klic:130,lok:112,lokL:-70,ram:76,ramL:-104,zap:130,zapL:-52},
    "jg_krounchasana": {bedra:178,kol:160,kolL:-98,kot:172,kotL:-94,kyc:150,kycL:80,lok:132,lokL:-132,panev:174,ram:128,ramL:-128,zap:136,zapL:-136},
    "jg_kukkutasana": {kol:-80,kolL:-108,kot:-28,kotL:-38,kyc:108,kycL:100,lok:6,lokL:-4,panev:178,ram:-8,ramL:-2,vzduch:0.07,zap:52,zapL:46},
    "jg_kurmasana": {bedra:94,celni:1,kol:60,kolL:-60,kot:100,kotL:-100,krk:88,kyc:62,kycL:-62,lok:98,lokL:-98,panev:104,ram:94,ramL:-94,zap:102,zapL:-102},
    "jg_laghuvajrasana": {bedra:220,h:-22,kol:-90,kolL:-92,kot:-90,kotL:-92,krk:238,kyc:6,kycL:2,lok:-16,lokL:16,panev:202,ram:-30,ramL:30,zap:-8,zapL:8},
    "jg_lolasana": {kol:-140,kolL:-144,kot:-110,kotL:-114,kyc:122,kycL:118,lok:4,lokL:-4,panev:178,ram:2,ramL:-2,vzduch:0.07,zap:50,zapL:46},
    "jg_mahamudra": {bedra:176,kol:90,kolL:-58,kot:140,kotL:-16,kyc:90,kycL:118,lok:88,lokL:-88,panev:172,ram:86,ramL:-86,zap:90,zapL:-90},
    "jg_makarasana": {bedra:74,h:-6,kol:-88,kolL:-90,kot:-30,kotL:-32,krk:58,kyc:-86,kycL:-88,lok:88,lokL:86,panev:90,ram:-8,ramL:8,zap:116,zapL:114},
    "jg_malasana": {bedra:156,celni:1,kol:-30,kolL:30,kot:92,kotL:-92,krk:166,kyc:84,kycL:-84,lok:104,lokL:-104,panev:150,ram:30,ramL:-30,zap:132,zapL:-132},
    "jg_mandukasana": {bedra:104,kol:-108,kolL:-112,kot:-104,kotL:-108,krk:98,kyc:34,kycL:30,lok:72,lokL:70,panev:108,ram:-10,ramL:10,zap:84,zapL:82},
    "jg_marichyasana_a": {bedra:118,kol:6,kolL:88,kot:66,kotL:140,krk:110,kyc:128,kycL:88,lok:104,lokL:-96,panev:128,ram:106,ramL:-98,zap:102,zapL:-94},
    "jg_marichyasana_b": {bedra:118,kol:6,kolL:-110,kot:66,kotL:-50,krk:110,kyc:128,kycL:100,lok:104,lokL:-96,panev:128,ram:106,ramL:-98,zap:102,zapL:-94},
    "jg_marichyasana_c": {bedra:176,klic:142,kol:-70,kolL:88,kot:-20,kotL:140,krk:166,kyc:112,kycL:90,lok:104,lokL:-58,panev:178,ram:48,ramL:-24,zap:126,zapL:-76},
    "jg_marichyasana_d": {bedra:176,klic:142,kol:-70,kolL:-110,kot:-20,kotL:-50,krk:166,kyc:112,kycL:100,lok:104,lokL:-58,panev:178,ram:48,ramL:-24,zap:126,zapL:-76},
    "jg_matsya_kridasana": {bedra:92,kol:-60,kolL:-90,kot:-30,kotL:-32,krk:90,kyc:-136,kycL:-88,lok:150,lokL:-98,panev:94,ram:130,ramL:-96,zap:88,zapL:-88},
    "jg_matsyasana": {bedra:112,h:30,kol:-90,kolL:-92,kot:-140,kotL:-142,krk:140,kyc:-88,kycL:-90,lok:-86,lokL:86,panev:92,ram:-84,ramL:84,zap:-88,zapL:88},
    "jg_matsyendrasana": {bedra:176,klic:150,kol:-70,kolL:-110,kot:-20,kotL:-50,krk:166,kyc:112,kycL:100,lok:104,lokL:-58,panev:178,ram:48,ramL:-24,zap:126,zapL:-76},
    "jg_mayurasana": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:58,lokL:-58,panev:94,ram:-62,ramL:62,vzduch:0.1,zap:72,zapL:68},
    "jg_muktasana": {kol:-76,kolL:-104,kot:-24,kotL:-34,kyc:104,kycL:96,lok:76,lokL:-76,panev:178,ram:32,ramL:-32,zap:94,zapL:-94},
    "jg_mulabandhasana": {kol:-78,kolL:-104,kot:-92,kotL:-94,kyc:106,kycL:98,lok:58,lokL:-58,panev:178,ram:20,ramL:-20,zap:84,zapL:-84},
    "jg_nakrasana": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-54,panev:104,ram:-56,ramL:56,vzduch:0.05,zap:72,zapL:70},
    "jg_natarajasana": {bedra:172,kol:0,kolL:-176,kotL:-140,krk:178,kycL:-40,lok:178,lokL:-150,panev:168,ram:174,ramL:-44,zap:182,zapL:-160},
    "jg_naukasana": {bedra:150,kol:44,kolL:42,kot:54,kotL:52,krk:158,kyc:52,kycL:50,lok:64,lokL:-64,panev:142,ram:62,ramL:-62,zap:66,zapL:-66},
    "jg_nirlamba_sarvangasana": {bedra:4,kol:178,kolL:-178,kot:170,kotL:-170,krk:0,kyc:176,kycL:-176,lok:166,lokL:-166,panev:8,ram:158,ramL:-158,zap:172,zapL:-172},
    "jg_pada_hastasana": {bedra:100,h:-10,kol:2,kolL:-2,kot:86,kotL:86,krk:92,kyc:6,kycL:-6,lok:4,lokL:-4,panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_padangusthasana": {bedra:100,h:-10,kol:2,kolL:-2,kot:86,kotL:86,krk:92,kyc:6,kycL:-6,lok:8,lokL:-8,panev:110,ram:12,ramL:-12,zap:4,zapL:-4},
    "jg_padangusthasana_toe": {bedra:176,kol:-40,kolL:-70,kot:132,kotL:-30,kyc:90,kycL:118,lok:112,lokL:-112,panev:170,ram:26,ramL:-26,zap:140,zapL:-140},
    "jg_padmasana": {kol:-86,kolL:-112,kot:-40,kotL:-50,kyc:110,kycL:100,lok:68,lokL:-68,panev:178,ram:28,ramL:-28,zap:88,zapL:-88},
    "jg_parighasana": {bedra:146,celni:1,kol:66,kolL:-92,kot:100,kotL:-92,krk:142,kyc:70,kycL:-6,lok:62,lokL:-162,panev:150,ram:64,ramL:-160,zap:60,zapL:-164},
    "jg_paripurna_navasana": {bedra:150,kol:44,kolL:42,kot:54,kotL:52,krk:158,kyc:52,kycL:50,lok:64,lokL:-64,panev:142,ram:62,ramL:-62,zap:66,zapL:-66},
    "jg_parivrtta_ardha_candrasana": {bedra:138,celni:1,klic:46,kol:4,kolL:-90,kot:94,kotL:-140,krk:136,kyc:8,kycL:-92,lok:-126,lokL:54,panev:140,ram:-124,ramL:56,zap:-128,zapL:52},
    "jg_parivrtta_janu_sirsasana": {bedra:128,klic:148,kol:90,kolL:-40,kot:140,kotL:-6,krk:108,kyc:90,kycL:126,lok:126,lokL:-72,panev:138,ram:128,ramL:-70,zap:94,zapL:-94},
    "jg_parivrtta_parsvakonasana": {bedra:134,celni:1,d_kot:0.7,d_kotL:0.5,klic:42,kol:10,kolL:-48,kot:96,kotL:-96,krk:130,kyc:66,kycL:-46,lok:-52,lokL:132,panev:138,ram:-50,ramL:130,zap:-54,zapL:134},
    "jg_parivrtta_trikonasana": {bedra:142,celni:1,d_kot:0.7,d_kotL:0.5,klic:44,kol:56,kolL:-58,kot:96,kotL:-96,krk:138,kyc:58,kycL:-56,lok:-58,lokL:126,panev:146,ram:-56,ramL:124,zap:-60,zapL:128},
    "jg_parsva_bakasana": {bedra:52,klic:140,kol:-132,kolL:-150,kot:-104,kotL:-108,krk:42,kyc:122,kycL:106,lok:14,lokL:-14,panev:58,ram:8,ramL:-8,zap:62,zapL:58},
    "jg_parsva_halasana": {bedra:5,h:86,klic:136,kol:40,kolL:37,kot:68,kotL:66,krk:0,kyc:34,kycL:18,lok:-86,lokL:-86,panev:10,ram:-68,ramL:-68,zap:-90,zapL:-90},
    "jg_parsvottanasana": {bedra:104,h:-10,kol:-8,kolL:6,kot:88,kotL:58,krk:96,kyc:44,kycL:-34,lok:4,lokL:-4,panev:116,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_parvatasana": {bedra:48,kol:-36,kolL:-38,kot:46,kotL:44,krk:42,kyc:-34,kycL:-36,lok:36,lokL:-36,panev:54,ram:38,ramL:-38,zap:62,zapL:58},
    "jg_paryankasana": {bedra:-88,h:-22,kol:-94,kolL:-96,kot:-92,kotL:-94,krk:-92,kyc:86,kycL:84,lok:-150,lokL:150,panev:-86,ram:166,ramL:-166,zap:-166,zapL:166},
    "jg_pasasana": {bedra:156,celni:1,klic:140,kol:-30,kolL:30,kot:92,kotL:-92,krk:166,kyc:84,kycL:-84,lok:-108,lokL:118,panev:150,ram:-34,ramL:60,zap:-140,zapL:148},
    "jg_pascima_namaskarasana": {lok:-112,lokL:112,ram:-14,ramL:14,zap:-142,zapL:142},
    "jg_pascimottanasana": {bedra:118,kol:90,kolL:88,kot:140,kotL:140,krk:110,kyc:90,kycL:88,lok:96,lokL:-96,panev:128,ram:98,ramL:-98,zap:94,zapL:-94},
    "jg_pawanmuktasana": {bedra:90,kol:-62,kolL:-64,kot:-20,kotL:-22,krk:88,kyc:-152,kycL:-154,lok:-102,lokL:-102,panev:92,ram:-134,ramL:-134,zap:-80,zapL:-80},
    "jg_phalakasana": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:6,lokL:-6,panev:100,ram:2,ramL:-2,zap:60,zapL:56},
    "jg_pincha_mayurasana": {bedra:2,kol:180,kolL:-180,kot:170,kotL:-170,krk:0,kyc:178,kycL:-178,lok:-118,lokL:118,panev:4,ram:34,ramL:-34,zap:-96,zapL:96},
    "jg_pindasana": {bedra:4,kol:-100,kolL:-104,kot:-50,kotL:-54,krk:0,kyc:120,kycL:116,lok:30,lokL:-30,panev:8,ram:-74,ramL:74,zap:8,zapL:-8},
    "jg_pranamasana": {lok:112,lokL:-112,ram:26,ramL:-26,zap:140,zapL:-140},
    "jg_prasarita_padottanasana": {bedra:96,celni:1,kol:28,kolL:-28,kot:96,kotL:-96,krk:90,kyc:34,kycL:-34,lok:4,lokL:-4,panev:104,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_purna_salabhasana": {bedra:68,h:-8,kol:-120,kolL:-122,kot:-56,kotL:-58,krk:52,kyc:-118,kycL:-120,lok:-90,lokL:90,panev:88,ram:-88,ramL:88,zap:-92,zapL:92},
    "jg_purvottanasana": {bedra:94,h:-16,kol:-86,kolL:-88,kot:-150,kotL:-152,krk:90,kyc:-84,kycL:-86,lok:-6,lokL:6,panev:96,ram:-8,ramL:8,vzduch:0.02,zap:-56,zapL:-52},
    "jg_saddle": {bedra:-88,h:-22,kol:-94,kolL:-96,kot:-92,kotL:-94,krk:-92,kyc:86,kycL:84,lok:-98,lokL:-98,panev:-86,ram:-96,ramL:-96,zap:-100,zapL:-100},
    "jg_salabhasana": {bedra:68,h:-8,kol:-106,kolL:-108,kot:-56,kotL:-58,krk:52,kyc:-104,kycL:-106,lok:-90,lokL:90,panev:88,ram:-88,ramL:88,zap:-92,zapL:92},
    "jg_salamba_sarvangasana": {bedra:4,kol:178,kolL:-178,kot:170,kotL:-170,krk:0,kyc:176,kycL:-176,lok:136,lokL:-136,panev:8,ram:-78,ramL:78,zap:150,zapL:-150},
    "jg_samakonasana": {celni:1,kol:90,kolL:-90,kot:100,kotL:-100,kyc:92,kycL:-92,lok:66,lokL:-66,panev:178,ram:64,ramL:-64,zap:68,zapL:-68},
    "jg_samasthiti": {lok:104,lokL:-104,ram:22,ramL:-22,zap:134,zapL:-134},
    "jg_sasangasana": {bedra:112,h:-40,kol:-96,kolL:-98,kot:-92,kotL:-94,krk:100,kyc:78,kycL:76,lok:-96,lokL:96,panev:120,ram:-14,ramL:14,zap:-120,zapL:120},
    "jg_sasankasana": {bedra:110,kol:-95,kolL:-97,kot:-92,kotL:-94,krk:104,kyc:80,kycL:78,lok:94,lokL:-94,panev:118,ram:96,ramL:-96,zap:92,zapL:-92},
    "jg_savasana": {bedra:90,kol:-90,kolL:-92,kot:-160,kotL:-162,krk:88,kyc:-88,kycL:-90,lok:-88,lokL:-88,panev:92,ram:-86,ramL:-86,zap:-90,zapL:-90},
    "jg_setu_bandha_sarvangasana": {bedra:46,kol:-18,kolL:-20,kot:96,kotL:96,krk:40,kyc:-102,kycL:-104,lok:-90,lokL:-90,panev:52,ram:-92,ramL:-92,zap:-88,zapL:-88},
    "jg_setu_bandhasana": {bedra:46,kol:-18,kolL:-20,kot:96,kotL:96,krk:40,kyc:-102,kycL:-104,lok:-90,lokL:-90,panev:52,ram:-92,ramL:-92,zap:-88,zapL:-88},
    "jg_shanmukhi_mudra": {kol:-76,kolL:-104,kot:-24,kotL:-34,kyc:104,kycL:96,lok:168,lokL:-168,panev:178,ram:118,ramL:-118,zap:190,zapL:-190},
    "jg_shoelace": {kol:-84,kolL:-116,kot:-40,kotL:-56,kyc:112,kycL:94,lok:62,lokL:-62,panev:178,ram:22,ramL:-22,zap:84,zapL:-84},
    "jg_siddhasana": {kol:-72,kolL:-100,kot:-24,kotL:-34,kyc:108,kycL:100,lok:76,lokL:-76,panev:178,ram:32,ramL:-32,zap:94,zapL:-94},
    "jg_simhasana": {h:-18,kol:-95,kolL:-97,kot:-92,kotL:-94,kyc:80,kycL:78,lok:66,lokL:-66,panev:178,ram:34,ramL:-34,zap:84,zapL:-84},
    "jg_sirsasana": {bedra:2,kol:180,kolL:-180,kot:170,kotL:-170,krk:0,kyc:178,kycL:-178,lok:-146,lokL:146,panev:4,ram:52,ramL:-52,zap:-176,zapL:176},
    "jg_skandasana": {bedra:172,celni:1,kol:10,kolL:-54,kot:100,kotL:-102,kyc:68,kycL:-52,lok:74,lokL:-74,panev:168,ram:70,ramL:-70,zap:78,zapL:-78},
    "jg_sphinx": {bedra:64,h:-8,kol:-90,kolL:-92,kot:-30,kotL:-32,krk:48,kyc:-88,kycL:-90,lok:84,lokL:82,panev:88,ram:-6,ramL:6,zap:92,zapL:90},
    "jg_sukhasana": {kol:-76,kolL:-104,kot:-24,kotL:-34,kyc:104,kycL:96,lok:76,lokL:-76,panev:178,ram:32,ramL:-32,zap:94,zapL:-94},
    "jg_supta_baddha_konasana": {bedra:90,kol:-34,kolL:-36,kot:-52,kotL:-54,krk:88,kyc:-124,kycL:-126,lok:-88,lokL:-88,panev:92,ram:-86,ramL:-86,zap:-90,zapL:-90},
    "jg_supta_konasana": {bedra:5,celni:1,h:86,kol:42,kolL:8,kot:68,kotL:66,krk:0,kyc:42,kycL:8,lok:-86,lokL:-86,panev:10,ram:-68,ramL:-68,zap:-90,zapL:-90},
    "jg_supta_kurmasana": {bedra:90,celni:1,kol:44,kolL:-44,kot:100,kotL:-100,krk:84,kyc:74,kycL:-74,lok:104,lokL:-104,panev:100,ram:98,ramL:-98,zap:112,zapL:-112},
    "jg_supta_matsyendrasana": {bedra:88,klic:126,kol:-22,kolL:-16,kot:-88,kotL:-86,krk:82,kyc:-132,kycL:-138,lok:96,lokL:-96,panev:92,ram:94,ramL:-94,zap:98,zapL:-98},
    "jg_supta_padangusthasana": {bedra:90,kol:172,kolL:-92,kot:124,kotL:-162,krk:88,kyc:168,kycL:-90,lok:162,lokL:-88,panev:92,ram:152,ramL:-86,zap:168,zapL:-90},
    "jg_supta_vajrasana": {bedra:-88,h:-22,kol:-94,kolL:-96,kot:-92,kotL:-94,krk:-92,kyc:86,kycL:84,lok:-98,lokL:-98,panev:-86,ram:-96,ramL:-96,zap:-100,zapL:-100},
    "jg_supta_virasana": {bedra:-88,h:-22,kol:-94,kolL:-96,kot:-92,kotL:-94,krk:-92,kyc:86,kycL:84,lok:-98,lokL:-98,panev:-86,ram:-96,ramL:-96,zap:-100,zapL:-100},
    "jg_svastikasana": {kol:-76,kolL:-104,kot:-24,kotL:-34,kyc:104,kycL:96,lok:76,lokL:-76,panev:178,ram:32,ramL:-32,zap:94,zapL:-94},
    "jg_tadasana": {},
    "jg_tiryaka_tadasana": {bedra:162,celni:1,krk:156,lok:184,lokL:-52,panev:170,ram:178,ramL:-30,zap:188,zapL:-64},
    "jg_tittibhasana": {bedra:166,kol:126,kolL:122,kot:164,kotL:162,krk:172,kyc:112,kycL:108,lok:6,lokL:-6,panev:162,ram:0,ramL:0,vzduch:0.1,zap:44,zapL:40},
    "jg_tolasana": {kol:-78,kolL:-106,kot:-26,kotL:-36,kyc:106,kycL:98,lok:4,lokL:-4,panev:178,ram:2,ramL:-2,vzduch:0.07,zap:50,zapL:46},
    "jg_triang_mukhaikapada": {bedra:118,kol:90,kolL:-100,kot:140,kotL:-96,krk:110,kyc:90,kycL:76,lok:96,lokL:-96,panev:128,ram:98,ramL:-98,zap:94,zapL:-94},
    "jg_tuladandasana": {bedra:96,kol:2,kolL:-94,kotL:-30,krk:94,kyc:6,kycL:-96,lok:96,lokL:-96,panev:98,ram:98,ramL:-98,zap:94,zapL:-94},
    "jg_ubhaya_padangusthasana": {bedra:150,kol:110,kolL:106,kot:168,kotL:168,krk:158,kyc:112,kycL:108,lok:114,lokL:-114,panev:142,ram:116,ramL:-116,zap:66,zapL:-66},
    "jg_upavistha_konasana": {bedra:108,celni:1,kol:60,kolL:-60,kot:100,kotL:-100,krk:100,kyc:62,kycL:-62,lok:86,lokL:-86,panev:116,ram:82,ramL:-82,zap:90,zapL:-90},
    "jg_urdhva_dandasana": {bedra:2,kol:114,kolL:110,kot:162,kotL:162,krk:0,kyc:116,kycL:112,lok:-146,lokL:146,panev:4,ram:52,ramL:-52,zap:-176,zapL:176},
    "jg_urdhva_dhanurasana": {bedra:-76,kol:-16,kolL:-20,krk:-88,kyc:26,kycL:22,lok:-8,lokL:8,panev:-64,ram:-16,ramL:16,zap:26,zapL:-26},
    "jg_urdhva_hastasana": {lok:179,lokL:-179,ram:176,ramL:-176,zap:182,zapL:-182},
    "jg_urdhva_mukha_pascimottanasana": {bedra:150,kol:114,kolL:110,kot:168,kotL:168,krk:158,kyc:116,kycL:112,lok:116,lokL:-116,panev:142,ram:118,ramL:-118,zap:66,zapL:-66},
    "jg_urdhva_mukha_svanasana": {bedra:44,h:-10,kol:-86,kolL:-88,kot:-42,kotL:-44,krk:28,kyc:-84,kycL:-86,lok:6,lokL:-6,panev:70,ram:0,ramL:0,zap:60,zapL:56},
    "jg_urdhva_padmasana": {bedra:4,kol:100,kolL:96,kot:60,kotL:56,krk:0,kyc:158,kycL:154,lok:136,lokL:-136,panev:8,ram:-78,ramL:78,zap:150,zapL:-150},
    "jg_urdhva_prasarita_ekapadasana": {bedra:100,h:-10,kol:2,kolL:-150,kot:86,kotL:-176,krk:92,kyc:6,kycL:-148,lok:4,lokL:-4,panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_urdhva_prasarita_padasana": {bedra:90,kol:178,kolL:-178,kot:104,kotL:104,krk:88,kyc:176,kycL:-176,lok:-88,lokL:-88,panev:92,ram:-86,ramL:-86,zap:-90,zapL:-90},
    "jg_ustrasana": {bedra:206,h:-18,kol:-90,kolL:-92,kot:-90,kotL:-92,krk:220,kyc:6,kycL:2,lok:-16,lokL:16,panev:192,ram:-30,ramL:30,zap:-8,zapL:8},
    "jg_utkata_konasana": {celni:1,kol:8,kolL:-8,kot:110,kotL:-110,kyc:52,kycL:-52,lok:156,lokL:-156,ram:110,ramL:-110,zap:172,zapL:-172},
    "jg_utkatasana": {bedra:158,h:6,kol:-16,kolL:-20,kot:88,kotL:88,krk:168,kyc:58,kycL:54,lok:176,lokL:-176,panev:150,ram:170,ramL:-170,zap:180,zapL:-180},
    "jg_uttana_kurmasana": {bedra:138,kol:-100,kolL:-106,kot:-56,kotL:-62,krk:150,kyc:84,kycL:78,lok:136,lokL:-136,panev:128,ram:60,ramL:-60,zap:168,zapL:-168},
    "jg_uttana_padasana": {bedra:112,h:30,kol:-130,kolL:-132,kot:-140,kotL:-142,krk:140,kyc:-128,kycL:-130,lok:-144,lokL:144,panev:92,ram:-142,ramL:142,zap:-88,zapL:88},
    "jg_uttanasana": {bedra:100,h:-10,kol:2,kolL:-2,kot:86,kotL:86,krk:92,kyc:6,kycL:-6,lok:4,lokL:-4,panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "jg_utthita_hasta_padangusthasana": {kol:2,kolL:112,kot:86,kotL:152,kyc:4,kycL:116,lok:104,lokL:-110,ram:28,ramL:-112,zap:134,zapL:-108},
    "jg_utthita_parsvakonasana": {bedra:134,celni:1,d_kot:0.7,d_kotL:0.5,kol:10,kolL:-48,kot:96,kotL:-96,krk:130,kyc:66,kycL:-46,lok:52,lokL:-148,panev:138,ram:54,ramL:-146,zap:50,zapL:-150},
    "jg_utthita_trikonasana": {bedra:142,celni:1,d_kot:0.7,d_kotL:0.5,kol:56,kolL:-58,kot:96,kotL:-96,krk:138,kyc:58,kycL:-56,lok:56,lokL:-124,panev:146,ram:58,ramL:-122,zap:54,zapL:-126},
    "jg_vajrasana": {kol:-95,kolL:-97,kot:-92,kotL:-94,kyc:80,kycL:78,lok:58,lokL:-58,panev:178,ram:20,ramL:-20,zap:84,zapL:-84},
    "jg_vasisthasana": {bedra:106,celni:1,kol:-76,kolL:-78,kot:-36,kotL:-38,krk:104,kyc:-74,kycL:-76,lok:6,lokL:186,panev:108,ram:4,ramL:184,zap:52,zapL:188},
    "jg_vatayanasana": {bedra:179,kol:-14,kolL:-100,kot:88,kotL:-44,kyc:88,kycL:108,lok:108,lokL:-108,panev:176,ram:30,ramL:-30,zap:138,zapL:-138},
    "jg_viparita_karani": {bedra:92,kol:176,kolL:-176,kot:100,kotL:100,krk:90,kyc:172,kycL:-172,lok:-86,lokL:-86,nar:"zed",panev:94,ram:-84,ramL:-84,zap:-88,zapL:-88},
    "jg_viparita_virabhadrasana": {bedra:154,celni:1,d_kot:0.7,d_kotL:0.5,kol:8,kolL:-44,kot:94,kotL:-94,krk:150,kyc:64,kycL:-42,lok:176,lokL:-48,panev:158,ram:172,ramL:-44,zap:180,zapL:-52},
    "jg_virabhadrasana1": {bedra:178,celni:1,d_kot:0.7,d_kotL:0.5,kol:8,kolL:-44,kot:94,kotL:-94,kyc:64,kycL:-42,lok:178,lokL:-178,panev:176,ram:174,ramL:-174,zap:182,zapL:-182},
    "jg_virabhadrasana2": {celni:1,d_kot:0.7,d_kotL:0.5,kol:8,kolL:-44,kot:94,kotL:-94,kyc:64,kycL:-42,lok:92,lokL:-92,ram:92,ramL:-92,zap:92,zapL:-92},
    "jg_virabhadrasana3": {bedra:96,kol:2,kolL:-94,kotL:-30,krk:94,kyc:6,kycL:-96,lok:96,lokL:-96,panev:98,ram:98,ramL:-98,zap:94,zapL:-94},
    "jg_virasana": {kol:-96,kolL:-98,kot:-92,kotL:-94,kyc:92,kycL:90,lok:58,lokL:-58,panev:178,ram:20,ramL:-20,zap:84,zapL:-84},
    "jg_visvamitrasana": {bedra:110,celni:1,kol:140,kolL:-72,kot:178,kotL:-34,krk:108,kyc:134,kycL:-70,lok:8,lokL:178,panev:112,ram:6,ramL:176,zap:54,zapL:180},
    "jg_vrksasana": {celni:1,kol:2,kolL:-16,kot:86,kotL:-52,kyc:4,kycL:-104,lok:178,lokL:-178,ram:172,ramL:-172,zap:184,zapL:-184},
    "jg_vrschikasana": {bedra:36,h:-20,kol:98,kolL:-98,kot:58,kotL:58,krk:50,kyc:148,kycL:-148,lok:-118,lokL:118,panev:22,ram:34,ramL:-34,zap:-96,zapL:96},
    "jg_yoga_mudra": {bedra:112,kol:-76,kolL:-104,kot:-24,kotL:-34,krk:104,kyc:104,kycL:96,lok:-118,lokL:118,panev:122,ram:-28,ramL:28,zap:-142,zapL:142},
    "jg_yoganidrasana": {bedra:90,kol:-196,kolL:-198,kot:-150,kotL:-152,krk:88,kyc:-158,kycL:-160,lok:-184,lokL:-184,panev:92,ram:-150,ramL:-150,zap:-186,zapL:-186},
    "jumplunge": {bedra:179,kol:-16,kolL:-150,kot:88,kotL:30,kyc:76,kycL:-8,lok:10,lokL:-10,panev:176,ram:8,ramL:-8,vzduch:0.1,zap:12,zapL:-12},
    "jumprope": {kol:-22,kolL:-26,kot:40,kotL:38,kyc:14,kycL:-12,lok:92,lokL:-92,panev:178,ram:34,ramL:-34,vzduch:0.08,zap:116,zapL:-116},
    "jumpsquat": {kol:-14,kolL:-42,kot:38,kotL:34,kyc:22,kycL:-16,lok:168,lokL:-168,panev:178,ram:152,ramL:-152,vzduch:0.14,zap:176,zapL:-176},
    "kneecars": {kol:2,kolL:46,kot:86,kotL:96,kyc:4,kycL:108,lok:104,lokL:-104,ram:28,ramL:-28,zap:134,zapL:-134},
    "kneepush": {bedra:108,kol:-140,kolL:-142,kot:-160,kotL:-162,krk:106,kyc:-62,kycL:-64,lok:52,lokL:-52,panev:110,ram:-52,ramL:52,zap:70,zapL:68},
    "kneeraise": {bedra:178,kol:6,kolL:2,kot:40,kotL:38,kyc:112,kycL:108,lok:180,lokL:-180,nar:"hrazda",panev:176,ram:178,ramL:-178,vzduch:0.17,zap:182,zapL:-182},
    "kneewall": {bedra:179,kol:-26,kolL:-150,kot:88,kotL:30,kyc:62,kycL:-8,lok:10,lokL:-10,nar:"zed",panev:176,ram:8,ramL:-8,zap:12,zapL:-12},
    "lateralraise": {celni:1,lok:98,lokL:-98,nar:"jednorucky",ram:96,ramL:-96,zap:100,zapL:-100},
    "latiso": {kol:6,kolL:-6,kot:44,kotL:42,kyc:4,kycL:-4,lok:174,lokL:-174,nar:"hrazda",ram:168,ramL:-168,vzduch:0.17,zap:182,zapL:-182},
    "latlunge": {bedra:172,celni:1,kol:10,kolL:-54,kot:100,kotL:-102,kyc:68,kycL:-52,lok:74,lokL:-74,panev:168,ram:70,ramL:-70,zap:78,zapL:-78},
    "latpull": {bedra:176,kol:6,kolL:2,kot:88,kotL:88,krk:174,kyc:88,kycL:86,lok:172,lokL:-172,nar:"kladka",panev:178,ram:152,ramL:-152,zap:178,zapL:-178},
    "legcurl": {bedra:92,kol:-168,kolL:-170,kot:-150,kotL:-152,krk:90,kyc:-88,kycL:-90,lok:90,lokL:-90,nar:"lavice",panev:94,ram:92,ramL:-92,zap:88,zapL:-88},
    "legpress": {bedra:128,kol:144,kolL:140,kot:178,kotL:178,krk:138,kyc:112,kycL:108,lok:-24,lokL:-24,nar:"lavice",panev:122,ram:-36,ramL:-36,zap:-14,zapL:-14},
    "legraise": {bedra:90,kol:178,kolL:-178,kot:104,kotL:104,krk:88,kyc:176,kycL:-176,lok:-88,lokL:-88,panev:92,ram:-86,ramL:-86,zap:-90,zapL:-90},
    "lizard": {bedra:176,kol:-22,kolL:-158,kot:90,kotL:24,kyc:86,kycL:-4,lok:82,lokL:-82,panev:172,ram:54,ramL:-54,zap:92,zapL:-92},
    "lsit": {kol:90,kolL:88,kot:140,kotL:140,kyc:92,kycL:90,lok:4,lokL:-4,panev:178,ram:2,ramL:-2,vzduch:0.07,zap:50,zapL:46},
    "lsitpullup": {bedra:174,kol:90,kolL:88,kot:140,kotL:140,krk:168,kyc:92,kycL:90,lok:176,lokL:-176,nar:"hrazda",panev:178,ram:146,ramL:-146,vzduch:0.17,zap:184,zapL:-184},
    "lunge": {bedra:179,kol:-16,kolL:-150,kot:88,kotL:30,kyc:76,kycL:-8,lok:10,lokL:-10,panev:176,ram:8,ramL:-8,zap:12,zapL:-12},
    "maltese": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:88,lokL:88,nar:"kruhy",panev:94,ram:86,ramL:86,vzduch:0.28,zap:90,zapL:90},
    "maltlean": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:50,lokL:-50,panev:100,ram:46,ramL:-46,zap:54,zapL:-54},
    "maltpress": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:150,lokL:150,nar:"jednorucky",panev:92,ram:130,ramL:130,zap:182,zapL:182},
    "middlesplit": {celni:1,kol:90,kolL:-90,kot:100,kotL:-100,kyc:92,kycL:-92,lok:66,lokL:-66,panev:178,ram:64,ramL:-64,zap:68,zapL:-68},
    "mtclimb": {bedra:98,kol:-166,kolL:-74,kot:-120,kotL:-12,krk:96,kyc:126,kycL:-72,lok:6,lokL:-6,panev:100,ram:2,ramL:-2,zap:60,zapL:56},
    "muscleup": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:40,lokL:-40,nar:"hrazda",panev:178,ram:108,ramL:-108,vzduch:0.17,zap:20,zapL:-20},
    "neckcars": {h:-26},
    "neckiso": {h:22,lok:96,lokL:-96,ram:20,ramL:-20,zap:130,zapL:-130},
    "negpull": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:178,lokL:-178,nar:"hrazda",panev:178,ram:164,ramL:-164,vzduch:0.17,zap:184,zapL:-184},
    "nordic": {bedra:144,kol:-88,kolL:-90,kot:-88,kotL:-90,krk:148,kyc:4,kycL:0,lok:48,lokL:-48,panev:142,ram:44,ramL:-44,zap:52,zapL:-52},
    "oafl": {bedra:90,kol:-90,kolL:-92,kot:-108,kotL:-110,krk:88,kyc:-88,kycL:-90,lok:179,lokL:118,nar:"hrazda",panev:92,ram:176,ramL:130,vzduch:0.3,zap:182,zapL:110},
    "oap": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:176,lokL:-60,nar:"hrazda",panev:178,ram:146,ramL:-40,vzduch:0.17,zap:184,zapL:-70},
    "oapush": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-30,panev:104,ram:-56,ramL:-84,zap:72,zapL:-10},
    "ohp": {lok:178,lokL:-178,nar:"osa",ram:174,ramL:-174,zap:182,zapL:-182},
    "onearmhs": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:1,lokL:-40,panev:2,ram:2,ramL:-70,zap:24,zapL:-20},
    "onelegfl": {bedra:90,kol:-90,kolL:-16,kot:-108,kotL:-100,krk:88,kyc:-88,kycL:-128,lok:179,lokL:179,nar:"hrazda",panev:92,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "openbook": {bedra:92,klic:140,kol:-22,kolL:-26,kot:-70,kotL:-74,krk:90,kyc:-130,kycL:-134,lok:112,lokL:-86,panev:94,ram:108,ramL:-84,zap:-20,zapL:-100},
    "pallof": {lok:86,lokL:-86,nar:"kladka_dole",ram:84,ramL:-84,zap:88,zapL:-88},
    "pancake": {bedra:108,celni:1,kol:60,kolL:-60,kot:100,kotL:-100,krk:100,kyc:62,kycL:-62,lok:86,lokL:-86,panev:116,ram:82,ramL:-82,zap:88,zapL:-88},
    "pelican": {bedra:4,h:70,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:174,kycL:-174,lok:-156,lokL:156,nar:"kruhy",panev:8,ram:-140,ramL:140,vzduch:0.24,zap:-178,zapL:178},
    "pigeon": {bedra:178,kol:-86,kolL:-90,kot:-84,kotL:-56,kyc:94,kycL:-92,lok:14,lokL:-14,panev:174,ram:12,ramL:-12,zap:16,zapL:-16},
    "pike": {bedra:48,kol:-40,kolL:-42,kot:44,kotL:42,krk:42,kyc:-38,kycL:-40,lok:22,lokL:-22,panev:54,ram:26,ramL:-26,zap:58,zapL:54},
    "pikefold": {bedra:100,h:-10,kol:2,kolL:-2,kot:86,kotL:86,krk:92,kyc:6,kycL:-6,lok:4,lokL:-4,panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "pikeliftoff": {bedra:48,kol:-40,kolL:-42,kot:44,kotL:42,krk:42,kyc:-38,kycL:-40,lok:22,lokL:-22,panev:54,ram:26,ramL:-26,zap:58,zapL:54},
    "pikestand": {bedra:48,kol:-40,kolL:-42,kot:44,kotL:42,krk:42,kyc:-38,kycL:-40,lok:22,lokL:-22,nar:"opora_ruce",panev:54,ram:26,ramL:-26,zap:58,zapL:54},
    "pistol": {bedra:156,kol:-30,kolL:106,kot:92,kotL:150,krk:166,kyc:80,kycL:112,lok:80,lokL:-76,panev:150,ram:76,ramL:-72,zap:84,zapL:-80},
    "planche": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:-10,lokL:10,panev:94,ram:-14,ramL:14,vzduch:0.14,zap:34,zapL:30},
    "planchelean": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:-34,lokL:34,panev:100,ram:-40,ramL:40,zap:24,zapL:20},
    "planchenneg": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:-10,lokL:10,panev:94,ram:-14,ramL:14,vzduch:0.14,zap:34,zapL:30},
    "planchepress": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:-10,lokL:10,panev:94,ram:-14,ramL:14,vzduch:0.14,zap:34,zapL:30},
    "planchepush": {bedra:92,kol:-88,kolL:-90,kot:-74,kotL:-76,krk:90,kyc:-86,kycL:-88,lok:30,lokL:-30,panev:94,ram:-44,ramL:44,vzduch:0.14,zap:34,zapL:30},
    "plank": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:6,lokL:-6,panev:100,ram:2,ramL:-2,zap:60,zapL:56},
    "powerclean": {bedra:172,kol:-12,kolL:-16,kot:90,kotL:90,krk:178,kyc:40,kycL:36,lok:160,lokL:-160,nar:"osa",panev:168,ram:78,ramL:-78,zap:178,zapL:-178},
    "presshs": {bedra:1,kol:176,kolL:172,kot:172,kotL:-172,krk:0,kyc:140,kycL:136,lok:1,lokL:-1,panev:2,ram:2,ramL:-2,zap:24,zapL:20},
    "pseudo": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:50,lokL:-50,panev:100,ram:-46,ramL:46,zap:96,zapL:94},
    "pullapart": {celni:1,lok:98,lokL:-98,nar:"guma",ram:96,ramL:-96,zap:100,zapL:-100},
    "pullover": {bedra:24,h:70,kol:162,kolL:-178,kot:168,kotL:-168,krk:0,kyc:158,kycL:-174,lok:-172,lokL:172,nar:"kruhy",panev:30,ram:-160,ramL:160,vzduch:0.24,zap:-178,zapL:178},
    "pullthrough": {bedra:124,kol:-6,kolL:-10,kot:88,kotL:88,krk:136,kyc:18,kycL:14,lok:2,lokL:-2,nar:"kladka_dole",panev:118,ram:4,ramL:-4,zap:0,zapL:0},
    "pullup": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:176,lokL:-176,nar:"hrazda",panev:178,ram:146,ramL:-146,vzduch:0.17,zap:184,zapL:-184},
    "pushdown": {bedra:178,lok:18,lokL:-18,nar:"kladka",panev:176,ram:14,ramL:-14,zap:22,zapL:-22},
    "pushup": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-54,panev:104,ram:-56,ramL:56,zap:72,zapL:70},
    "renegade": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:-22,lokL:-6,nar:"jednorucky",panev:100,ram:-34,ramL:-2,zap:-10,zapL:56},
    "revfly": {bedra:122,kol:-6,kolL:-10,kot:88,kotL:88,krk:132,kyc:18,kycL:14,lok:96,lokL:-96,nar:"jednorucky",panev:116,ram:94,ramL:-94,zap:98,zapL:-98},
    "revhyper": {bedra:92,kol:-120,kolL:-122,kot:-70,kotL:-72,krk:90,kyc:-118,kycL:-120,lok:90,lokL:-90,nar:"lavice",panev:94,ram:92,ramL:-92,zap:88,zapL:-88},
    "revnordic": {bedra:205,kol:-90,kolL:-92,kot:-90,kotL:-92,krk:202,lok:94,lokL:-94,panev:202,ram:92,ramL:-92,zap:12,zapL:-12},
    "revplank": {bedra:94,h:-16,kol:-86,kolL:-88,kot:-150,kotL:-152,krk:90,kyc:-84,kycL:-86,lok:-6,lokL:6,panev:96,ram:-8,ramL:8,vzduch:0.02,zap:-56,zapL:-52},
    "ringdips": {bedra:182,kol:56,kolL:52,kot:104,kotL:104,krk:178,kyc:28,kycL:24,lok:44,lokL:-44,nar:"kruhy",panev:186,ram:-32,ramL:32,vzduch:0.2,zap:10,zapL:-10},
    "ringpush": {bedra:102,kol:-68,kolL:-70,kot:-8,kotL:-10,krk:100,kyc:-66,kycL:-68,lok:54,lokL:-54,nar:"kruhy",panev:104,ram:-56,ramL:56,zap:72,zapL:70},
    "ringrow": {bedra:94,kol:-78,kolL:-80,kot:-16,kotL:-18,krk:92,kyc:-76,kycL:-78,lok:178,lokL:-178,nar:"kruhy",panev:96,ram:160,ramL:-160,zap:184,zapL:-184},
    "ringsupport": {kol:54,kolL:50,kot:104,kotL:104,krk:178,kyc:26,kycL:22,lok:2,lokL:-2,nar:"kruhy",panev:182,ram:-4,ramL:4,vzduch:0.2,zap:8,zapL:-8},
    "ropeclimb": {bedra:178,kol:6,kolL:2,kot:40,kotL:38,kyc:112,kycL:108,lok:180,lokL:-180,nar:"kruhy",panev:176,ram:178,ramL:-178,vzduch:0.17,zap:182,zapL:-182},
    "russiandip": {bedra:182,kol:56,kolL:52,kot:104,kotL:104,krk:178,kyc:28,kycL:24,lok:40,lokL:-40,nar:"bradla",panev:186,ram:-62,ramL:62,vzduch:0.2,zap:10,zapL:-10},
    "russtwist": {bedra:150,klic:140,kol:44,kolL:42,kot:54,kotL:52,krk:158,kyc:52,kycL:50,lok:96,lokL:-60,panev:142,ram:74,ramL:-40,zap:112,zapL:-74},
    "scap": {kol:6,kolL:-6,kot:44,kotL:42,kyc:4,kycL:-4,lok:176,lokL:-176,nar:"hrazda",ram:172,ramL:-172,vzduch:0.17,zap:182,zapL:-182},
    "scapdip": {kol:54,kolL:50,kot:104,kotL:104,krk:178,kyc:26,kycL:22,lok:2,lokL:-2,nar:"bradla",panev:182,ram:-4,ramL:4,vzduch:0.2,zap:8,zapL:-8},
    "scapush": {bedra:98,kol:-72,kolL:-74,kot:-10,kotL:-12,krk:96,kyc:-70,kycL:-72,lok:6,lokL:-6,panev:100,ram:2,ramL:-2,zap:60,zapL:56},
    "scorpion": {bedra:92,kol:-70,kolL:-90,kot:-30,kotL:-32,krk:90,kyc:-142,kycL:-88,lok:122,lokL:-122,panev:94,ram:118,ramL:-118,zap:88,zapL:-88},
    "shinbox": {bedra:176,klic:142,kol:-70,kolL:88,kot:-20,kotL:140,krk:166,kyc:112,kycL:90,lok:104,lokL:-58,panev:178,ram:48,ramL:-24,zap:126,zapL:-76},
    "shouldercars": {lok:142,lokL:-14,ram:104,ramL:-12,zap:160,zapL:-16},
    "shrimp": {bedra:176,kol:-22,kolL:-158,kot:90,kotL:24,kyc:86,kycL:-4,lok:12,lokL:-140,panev:172,ram:10,ramL:-30,zap:14,zapL:-168},
    "sidebend": {bedra:162,celni:1,krk:156,lok:184,lokL:-52,panev:170,ram:178,ramL:-30,zap:188,zapL:-64},
    "sideleg": {bedra:92,kol:-152,kolL:-26,kot:-170,kotL:-74,krk:90,kyc:-150,kycL:-134,lok:-30,lokL:-98,panev:94,ram:-70,ramL:-96,zap:-20,zapL:-100},
    "sideplank": {bedra:106,celni:1,kol:-76,kolL:-78,kot:-36,kotL:-38,krk:104,kyc:-74,kycL:-76,lok:6,lokL:186,panev:108,ram:4,ramL:184,zap:52,zapL:188},
    "sissy": {bedra:202,kol:46,kolL:42,kot:124,kotL:124,krk:200,kyc:-26,kycL:-30,lok:94,lokL:-94,panev:200,ram:92,ramL:-92,zap:96,zapL:-96},
    "sissysquat": {bedra:202,kol:46,kolL:42,kot:124,kotL:124,krk:200,kyc:-26,kycL:-30,lok:94,lokL:-94,panev:200,ram:92,ramL:-92,zap:96,zapL:-96},
    "situp": {bedra:148,kol:-24,kolL:-26,kot:-92,kotL:-94,krk:158,kyc:-140,kycL:-142,lok:170,lokL:-170,panev:112,ram:136,ramL:-136,zap:190,zapL:-190},
    "skater": {bedra:172,celni:1,kol:10,kolL:-54,kot:100,kotL:-102,kyc:68,kycL:-52,lok:74,lokL:-74,panev:168,ram:70,ramL:-70,vzduch:0.08,zap:78,zapL:-78},
    "skinthecat": {bedra:4,h:70,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:174,kycL:-174,lok:-172,lokL:172,nar:"kruhy",panev:8,ram:-160,ramL:160,vzduch:0.24,zap:-178,zapL:178},
    "slbalance": {kol:2,kolL:8,kot:86,kotL:110,kyc:4,kycL:112,lok:104,lokL:-104,ram:28,ramL:-28,zap:134,zapL:-134},
    "slbridge": {bedra:46,kol:-18,kolL:-166,kot:96,kotL:-120,krk:40,kyc:-102,kycL:-160,lok:-90,lokL:-90,panev:52,ram:-92,ramL:-92,zap:-88,zapL:-88},
    "sled": {bedra:156,kol:8,kolL:-116,kot:120,kotL:30,krk:164,kyc:68,kycL:-34,lok:48,lokL:-48,panev:152,ram:44,ramL:-44,zap:-124,zapL:130},
    "slrdl": {bedra:96,kol:2,kolL:-94,kotL:-30,krk:94,kyc:6,kycL:-96,lok:96,lokL:-96,panev:98,ram:98,ramL:-98,zap:94,zapL:-94},
    "sphinx": {bedra:64,h:-8,kol:-90,kolL:-92,kot:-30,kotL:-32,krk:48,kyc:-88,kycL:-90,lok:84,lokL:82,panev:88,ram:-6,ramL:6,zap:92,zapL:90},
    "sprint": {bedra:170,kol:8,kolL:-116,kot:120,kotL:30,krk:176,kyc:68,kycL:-34,lok:-110,lokL:118,panev:166,ram:-50,ramL:58,zap:-124,zapL:130},
    "squatpry": {bedra:156,celni:1,kol:-30,kolL:30,kot:92,kotL:-92,krk:166,kyc:84,kycL:-84,lok:104,lokL:-104,panev:150,ram:30,ramL:-30,zap:132,zapL:-132},
    "stepup": {bedra:176,kol:-4,kolL:-4,kot:88,kyc:64,kycL:-6,lok:16,lokL:-16,nar:"bedna",panev:172,ram:14,ramL:-14,zap:18,zapL:-18},
    "straddlefl": {bedra:90,celni:1,kol:-72,kolL:-112,kot:-108,kotL:-110,krk:88,kyc:-70,kycL:-110,lok:179,lokL:179,nar:"hrazda",panev:92,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "straddleplanche": {bedra:92,celni:1,kol:-74,kolL:-106,kot:-74,kotL:-76,krk:90,kyc:-72,kycL:-104,lok:-10,lokL:10,panev:94,ram:-14,ramL:14,vzduch:0.14,zap:34,zapL:30},
    "straddlesit": {celni:1,kol:60,kolL:-60,kot:140,kotL:140,kyc:62,kycL:-62,lok:4,lokL:-4,nar:"bradla",panev:178,ram:2,ramL:-2,vzduch:0.07,zap:50,zapL:46},
    "suitcase": {lok:10,lokL:-10,nar:"jednorucky",ram:8,ramL:-8},
    "sumo": {celni:1,kol:8,kolL:-8,kot:110,kotL:-110,kyc:52,kycL:-52,lok:156,lokL:-156,ram:110,ramL:-110,zap:172,zapL:-172},
    "superman": {bedra:68,h:-8,kol:-106,kolL:-108,kot:-56,kotL:-58,krk:52,kyc:-104,kycL:-106,lok:-90,lokL:90,panev:88,ram:-88,ramL:88,zap:-92,zapL:92},
    "support": {kol:54,kolL:50,kot:104,kotL:104,krk:178,kyc:26,kycL:22,lok:2,lokL:-2,nar:"bradla",panev:182,ram:-4,ramL:4,vzduch:0.2,zap:8,zapL:-8},
    "swing": {bedra:124,kol:-6,kolL:-10,kot:88,kotL:88,krk:136,kyc:18,kycL:14,lok:60,lokL:-60,nar:"jednorucky",panev:118,ram:58,ramL:-58,zap:62,zapL:-62},
    "t2b": {bedra:174,kol:142,kolL:138,kot:176,kotL:176,kyc:140,kycL:136,lok:180,lokL:-180,nar:"hrazda",panev:170,ram:178,ramL:-178,vzduch:0.17,zap:182,zapL:-182},
    "tbridge": {bedra:46,klic:136,kol:-18,kolL:-20,kot:96,kotL:96,krk:40,kyc:-102,kycL:-104,lok:146,lokL:-86,panev:52,ram:140,ramL:-84,zap:-88,zapL:-88},
    "thoracicext": {bedra:66,kol:-22,kolL:-24,kot:-88,kotL:-90,krk:50,kyc:-132,kycL:-134,lok:154,lokL:-154,nar:"lavice",panev:84,ram:150,ramL:-150,zap:-90,zapL:-90},
    "threadneedle": {bedra:96,kol:-92,kolL:-94,kot:-92,kotL:-94,krk:88,kyc:0,lok:118,lokL:-4,panev:100,ram:112,ramL:-2,zap:124,zapL:54},
    "tibraise": {kol:-3,kolL:-3,kot:132,kotL:132,nar:"zedL",panev:176},
    "toetouch": {bedra:100,h:-10,kol:2,kolL:-2,kot:86,kotL:86,krk:92,kyc:6,kycL:-6,lok:4,lokL:-4,panev:110,ram:6,ramL:-6,zap:2,zapL:-2},
    "towelhang": {kol:6,kolL:-6,kot:44,kotL:42,kyc:4,kycL:-4,lok:180,lokL:-180,nar:"hrazda",ram:178,ramL:-178,vzduch:0.17,zap:182,zapL:-182},
    "tuckback": {bedra:92,kol:-14,kolL:-16,kot:-30,kotL:-32,krk:90,kyc:-128,kycL:-130,lok:-20,lokL:-20,nar:"hrazda",panev:94,ram:-22,ramL:-22,vzduch:0.3,zap:-18,zapL:-18},
    "tuckjump": {kol:-140,kolL:-144,kot:-120,kotL:-124,kyc:126,kycL:122,lok:168,lokL:-168,panev:178,ram:152,ramL:-152,vzduch:0.14,zap:176,zapL:-176},
    "tuckl": {kol:4,kolL:2,kot:76,kotL:76,kyc:116,kycL:114,lok:4,lokL:-4,nar:"bradla",panev:178,ram:2,ramL:-2,vzduch:0.07,zap:50,zapL:46},
    "tucklever": {bedra:92,kol:-14,kolL:-16,kot:-100,kotL:-102,krk:90,kyc:-128,kycL:-130,lok:179,lokL:179,nar:"hrazda",panev:94,ram:176,ramL:176,vzduch:0.3,zap:182,zapL:182},
    "tuckplanche": {bedra:104,kol:-152,kolL:-156,kot:-118,kotL:-122,krk:98,kyc:128,kycL:124,lok:-14,lokL:14,panev:108,ram:-18,ramL:18,vzduch:0.12,zap:32,zapL:28},
    "typewriter": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:160,lokL:-178,nar:"hrazda",panev:178,ram:122,ramL:-172,vzduch:0.17,zap:184,zapL:-184},
    "vi_biceps": {lok:-112,lokL:112,nar:"osa",ram:10,ramL:-10,zap:-124,zapL:124},
    "vi_calf": {kol:-4,kolL:-4,kot:44,kotL:44,panev:178},
    "vi_hinge": {bedra:130,kol:-16,kolL:-20,kot:88,kotL:88,krk:142,kyc:40,kycL:36,lok:4,lokL:-4,nar:"osa",panev:124,ram:6,ramL:-6,zap:2,zapL:-2},
    "vi_hipthrust": {bedra:46,kol:-18,kolL:-20,kot:96,kotL:96,krk:40,kyc:-102,kycL:-104,lok:-90,lokL:-90,nar:"lavice",panev:52,ram:-92,ramL:-92,zap:-88,zapL:-88},
    "vi_hss3m": {bedra:90,kol:98,kolL:-24,kot:44,kotL:-92,krk:88,kyc:170,kycL:-140,lok:178,lokL:-98,panev:92,ram:176,ramL:-100,zap:180,zapL:-96},
    "vi_hss6m": {bedra:64,h:-8,kol:-90,kolL:-92,kot:-30,kotL:-32,krk:48,kyc:-88,kycL:-90,lok:84,lokL:82,panev:88,ram:-6,ramL:6,zap:92,zapL:90},
    "vi_lunge": {bedra:179,kol:-16,kolL:-150,kot:88,kotL:30,kyc:76,kycL:-8,lok:10,lokL:-10,nar:"jednorucky",panev:176,ram:8,ramL:-8,zap:12,zapL:-12},
    "vi_ohp": {lok:178,lokL:-178,nar:"osa",ram:174,ramL:-174,zap:182,zapL:-182},
    "vi_press": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:152,lokL:152,nar:"osa",panev:92,ram:-96,ramL:-96,zap:168,zapL:168},
    "vi_row": {bedra:122,kol:-6,kolL:-10,kot:88,kotL:88,krk:132,kyc:18,kycL:14,lok:-30,lokL:30,nar:"osa",panev:116,ram:2,ramL:-2,zap:-16,zapL:16},
    "vi_scap": {lok:158,lokL:-158,nar:"kladka",ram:112,ramL:-112,zap:176,zapL:-176},
    "vi_squat": {bedra:160,kol:-20,kolL:-24,kot:90,kotL:90,krk:170,kyc:74,kycL:68,lok:-152,lokL:152,nar:"osa",panev:154,ram:-34,ramL:34,zap:-176,zapL:176},
    "vi_triceps": {bedra:178,lok:18,lokL:-18,nar:"kladka",panev:176,ram:14,ramL:-14,zap:22,zapL:-22},
    "vsit": {kol:130,kolL:126,kot:148,kotL:146,kyc:132,kycL:128,lok:4,lokL:-4,panev:178,ram:2,ramL:-2,vzduch:0.07,zap:50,zapL:46},
    "vup": {bedra:150,kol:72,kolL:42,kot:54,kotL:52,krk:158,kyc:74,kycL:50,lok:80,lokL:-80,panev:142,ram:78,ramL:-78,zap:66,zapL:-66},
    "wallext": {lok:156,lokL:-156,nar:"zedL",ram:118,ramL:-118,zap:172,zapL:-172},
    "wallhs": {bedra:1,kol:180,kolL:-180,kot:172,kotL:-172,krk:0,kyc:179,kycL:-179,lok:1,lokL:-1,nar:"zed",panev:2,ram:2,ramL:-2,zap:24,zapL:20},
    "wallhspu": {bedra:3,kol:178,kolL:-178,kot:168,kotL:-168,krk:0,kyc:176,kycL:-176,lok:-52,lokL:52,nar:"zed",panev:6,ram:54,ramL:-54,zap:-10,zapL:10},
    "wallpike": {bedra:48,kol:-40,kolL:-42,kot:44,kotL:42,krk:42,kyc:-38,kycL:-40,lok:22,lokL:-22,nar:"zed",panev:54,ram:26,ramL:-26,zap:58,zapL:54},
    "wallpush": {bedra:146,kol:24,kolL:20,kot:96,kotL:96,krk:144,kyc:26,kycL:22,lok:76,lokL:-78,nar:"zed",panev:148,ram:64,ramL:-68,zap:88,zapL:-88},
    "wallsit": {kol:0,kolL:-2,kot:88,kotL:88,kyc:90,kycL:88,lok:90,lokL:-90,nar:"zedL",panev:178,ram:88,ramL:-88,zap:92,zapL:-92},
    "wallwalk": {bedra:20,kol:160,kolL:-180,kot:172,kotL:-172,krk:14,kyc:158,kycL:-179,lok:1,lokL:-1,nar:"zed",panev:24,ram:2,ramL:-2,zap:24,zapL:20},
    "wgs": {bedra:154,kol:-22,kolL:-158,kot:90,kotL:24,krk:162,kyc:86,kycL:-4,lok:182,lokL:8,panev:150,ram:178,ramL:-16,zap:186,zapL:44},
    "wipers": {bedra:174,klic:130,kol:158,kolL:154,kot:176,kotL:176,kyc:156,kycL:152,lok:180,lokL:-180,nar:"hrazda",panev:170,ram:178,ramL:-178,vzduch:0.17,zap:182,zapL:-182},
    "woodchop": {celni:1,klic:130,lok:104,lokL:-74,nar:"kladka",ram:60,ramL:-108,zap:128,zapL:-56},
    "wpullup": {bedra:174,kol:-30,kolL:-34,kot:36,kotL:34,krk:168,kyc:-10,kycL:-14,lok:176,lokL:-176,nar:"hrazda",panev:178,ram:146,ramL:-146,vzduch:0.17,zap:184,zapL:-184},
    "wristcars": {bedra:104,kol:-92,kolL:-94,kot:-92,kotL:-94,krk:98,kyc:0,lok:4,lokL:-4,panev:106,ram:2,ramL:-2,zap:56,zapL:54},
    "wristcurl": {h:6,kol:-16,kolL:-20,kot:88,kotL:88,kyc:58,kycL:54,lok:92,lokL:-92,nar:"jednorucky",panev:178,ram:46,ramL:-46,zap:116,zapL:-116},
    "wrists": {bedra:104,kol:-92,kolL:-94,kot:-92,kotL:-94,krk:98,kyc:0,lok:4,lokL:-4,panev:106,ram:2,ramL:-2,zap:56,zapL:54},
    "ytw": {bedra:92,kol:-88,kolL:-90,kot:-30,kotL:-32,krk:90,kyc:-86,kycL:-88,lok:142,lokL:-142,panev:94,ram:138,ramL:-138,zap:146,zapL:-146},
    "zenetti": {bedra:90,h:8,kol:-14,kolL:-16,kot:104,kotL:104,krk:86,kyc:-108,kycL:-110,lok:179,lokL:179,nar:"jednorucky",panev:92,ram:176,ramL:176,zap:182,zapL:182},
    "zone2": {bedra:176,kol:-4,kolL:-88,kot:104,kotL:20,kyc:44,kycL:-26,lok:-88,lokL:94,panev:172,ram:-32,ramL:38,zap:-100,zapL:106},
  };
  // vzor pohybu → póza · pro cviky, které si uživatel přidal sám
  const TM_POZY_VZOR = {
    "drep": TM_POZY["drep"],
    "ohyb": TM_POZY["deadlift"],
    "tlak": TM_POZY["pushup"],
    "tah": TM_POZY["bodyrow"],
    "stred": TM_POZY["plank"],
    "obrat": TM_POZY["handstand"],
    "prenos": TM_POZY["zone2"],
    "mobilita": TM_POZY["toetouch"],
    "krk": TM_POZY["neckcars"],
    "dech": TM_POZY["boxbreath"],
  };

  /* Jedna kresba. Ve velkém se kreslí obrysem: vrstva se nejdřív obtáhne
     tlustou čarou v barvě inkoustu a pak se přes ni položí ta samá cesta
     plnou výplní — vnitřní švy zmizí, venku zůstane půlka tahu. V malém
     (ikona v seznamu, dvacet až třicet bodů) žádný obrys nedává smysl:
     nulá čárka osm bodu se stejně nevykreslí. Tam se kreslí silueta, plnou
     barvou, a vzdálené končetiny průsvitně — na tu velikost je to jediné,
     co je ještě čitelné. */
  function TmPostava({ poza, size = 120, stroke, fluid = false, zem = true }) {
    const { t } = useT();
    const V = 200;
    const maly = !fluid && size <= 36;
    const kres = React.useMemo(() => {
      if (!poza) return null;
      const u = psUsad(poza, V, maly ? 8 : 15);
      return { u: u, c: psCesty(u.k, u.H), nar: psNaradi(poza.nar, u.k, u.H, u.ramec, u.podlaha) };
    }, [poza, maly]);
    if (!kres) return null;

    const ink = stroke || t.text;
    const papir = t.mode === "dark" ? "#2C2D27" : "#FFFDF9";
    const dalekoVypln = t.mode === "dark" ? "#22231F" : "#E5DDD3";
    const w = maly ? 0 : 2.6;
    const dims = fluid ? { style: { width: "100%", height: "auto", display: "block" } } : { width: size, height: size };
    const u = kres.u;
    const posun = `translate(${u.posunX.toFixed(2)},${u.posunY.toFixed(2)}) scale(${u.s.toFixed(4)})`;
    const vrstva = (d, vypln, klic, pruh) =>
      maly
        ? <path key={klic} d={d} fillRule="nonzero" fill={ink} opacity={pruh} />
        : [
            <path key={klic + "o"} d={d} fill={ink} stroke={ink} strokeWidth={w}
              strokeLinejoin="round" vectorEffect="non-scaling-stroke" />,
            <path key={klic + "v"} d={d} fillRule="nonzero" fill={vypln} />,
          ];

    return (
      <svg {...dims} viewBox={`0 0 ${V} ${V}`} style={{ display: "block", overflow: "hidden", ...(dims.style || {}) }}>
        {zem && !maly && (
          <line x1="17" y1={u.zem + 1.3} x2={V - 17} y2={u.zem + 1.3}
            stroke={t.sage} strokeWidth="1.5" opacity="0.45" />
        )}
        <g transform={posun}>
          {kres.nar.map((n, i) => (
            <path key={"n" + i} d={n.d} stroke={ink} fill="none" strokeLinecap="round"
              strokeWidth={Math.max(n.w, (maly ? 5 : 2.6) / u.s)} opacity={maly ? 0.5 : 0.55} />
          ))}
          {vrstva(kres.c.daleko, dalekoVypln, "d", 0.45)}
          {vrstva(kres.c.jadro, papir, "j", 1)}
          {vrstva(kres.c.blizko, papir, "b", 1)}
        </g>
      </svg>
    );
  }

  // Póza cviku · vlastní cviky uživatele v tabulce nejsou, ale vzor pohybu
  // mají vždycky, takže se nikdy nekreslí prázdno.
  const tmPoza = (ex) => (ex ? TM_POZY[ex.id] || TM_POZY_VZOR[ex.pat] || null : null);

  return { TmPostava, tmPoza, TM_POZY, TM_POZY_VZOR, PS_D, PS_SIR, PS_R };
}
