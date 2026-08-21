// KNIHOVNA CVIKŮ · klientská strana téhož auditu.
//
// Klientská aplikace nese 271 z 485 auditovaných řádků. Musí je nést stejně jako
// trenérská — stejné police, stejné role, stejná bezpečnost, stejné názvy — a
// nesmí nést nic, co patří trenérovi.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLibrary, loadEngine, seedOrder, SEED_NAMES } from "../scripts/lib/exercise-library.mjs";

const lib = loadLibrary();
const E = loadEngine();
const rows = lib.all;
const byId = lib.byId;

test("271 řádků, ve stejném pořadí, s auditním záznamem u každého", () => {
  assert.equal(rows.length, 271);
  assert.equal(new Set(rows.map((x) => x.id)).size, 271);
  assert.deepEqual(seedOrder(), rows.map((x) => x.id));
  assert.equal(SEED_NAMES.length, 16);
  for (const x of rows) assert.ok(lib.meta[x.id], `${x.id} nemá TEX_META`);
  for (const id of Object.keys(lib.meta)) assert.ok(byId[id], `TEX_META zná ${id}, knihovna ne`);
});

test("taxonomie je úplná · žádný neznámý klíč", () => {
  const pat = new Set(lib.taxonomy.patterns.map((x) => x.k));
  const eq = new Set(lib.taxonomy.equipment.map((x) => x.k));
  const mus = new Set(lib.taxonomy.muscles.map((x) => x.k));
  const jo = new Set(lib.taxonomy.joints.map((x) => x.k));
  for (const x of rows) {
    assert.ok(pat.has(x.pat), `${x.id}: vzor`);
    for (const k of x.eq || []) assert.ok(eq.has(k), `${x.id}: vybavení ${k}`);
    for (const k of [...(x.mp || []), ...(x.ms || [])]) assert.ok(mus.has(k), `${x.id}: sval ${k}`);
    for (const k of Object.keys(x.J || {})) assert.ok(jo.has(k), `${x.id}: kloub ${k}`);
  }
  for (const k of ["add", "hipflex", "rcuff", "serr", "neck"]) assert.ok(mus.has(k), `chybí ${k}`);
  assert.ok(jo.has("krk"));
  assert.ok(!eq.has("velkaosa"));
});

test("progrese vede někam a nezacyklí se · oba jazyky drží tvar", () => {
  for (const x of rows) {
    if (x.ez) assert.ok(byId[x.ez], `${x.id}.ez`);
    if (x.hd) assert.ok(byId[x.hd], `${x.id}.hd`);
    assert.ok(x.cz && x.en, `${x.id}: název`);
    for (const f of ["foc", "pos", "exe", "wat", "pro"]) {
      const v = x[f];
      if (v == null) continue;
      assert.equal(v.length, 2, `${x.id}.${f}`);
      assert.equal(!!v[0], !!v[1], `${x.id}.${f}`);
    }
  }
  for (const dir of ["ez", "hd"]) {
    for (const x of rows) {
      const seen = new Set([x.id]);
      let c = byId[x[dir]];
      while (c) { assert.ok(!seen.has(c.id), `cyklus přes ${x.id}`); seen.add(c.id); c = byId[c[dir]]; }
    }
  }
});

test("police, stav a role jsou platné · a archiv je archiv", () => {
  for (const x of rows) {
    assert.ok(lib.tiers.includes(E.tTierOf(x)), x.id);
    assert.ok(lib.statuses.includes(E.tStatusOf(x)), x.id);
    assert.ok(lib.goalRoles.includes(E.tRoleOf(x)), x.id);
    assert.ok(lib.sessionBlocks.includes(E.tBlockOf(x)), x.id);
  }
  for (const id of ["benchdips", "bosuoahs"]) {
    assert.equal(E.tTierOf(byId[id]), "archived", id);
    assert.equal(E.tGenericEligible(byId[id]), false, id);
    assert.equal(E.tExOnDefaultShelf(byId[id]), false, id);
    assert.ok(E.tExOnShelf(byId[id], ["archived"]), `${id} přes filtr Archiv`);
  }
});

test("13 programových řádků zůstává ve svém programu", () => {
  const prog = rows.filter((x) => E.tIsProgramOnly(x));
  assert.equal(prog.length, 13);
  for (const x of prog) {
    assert.ok(x.id.startsWith("vi_"), x.id);
    assert.equal(E.tGenericEligible(x), false, x.id);
    assert.equal(E.tExOnDefaultShelf(x), false, x.id);
    // a programová šablona má obě chybějící sekce doplněné
    assert.ok(x.pos && x.pos[0] && x.wat && x.wat[0], `${x.id}: chybí výchozí poloha nebo pozor`);
  }
});

test("Sissy dřep má jednu kartu a čitelné staré ID", () => {
  assert.equal(E.tAliasOf(byId.sissy), "sissysquat");
  assert.equal(E.tStatusOf(byId.sissy), "alias");
  assert.equal(E.tExOnDefaultShelf(byId.sissy), false);
  assert.equal(E.tGenericEligible(byId.sissy), false);
  assert.ok(byId.sissy, "staré ID zůstává");
});

test("zobrazené názvy sedí s trenérskou stranou, řádkové se nehnuly", () => {
  const renamed = { glutebridge: "Hýžďový most", plank: "Prkno na předloktích",
                    sideplank: "Boční prkno na předloktí", pigeon: "Holub · přípravné protažení",
                    sissysquat: "Sissy dřep" };
  for (const [id, name] of Object.entries(renamed)) {
    assert.equal(E.tExNameCz(byId[id]), name, id);
    assert.notEqual(byId[id].cz, name, `${id}: řádkový název se měnit nesmí`);
  }
});

test("silová dovednost není denní koordinační praxe", () => {
  for (const id of ["pistol", "shrimp", "pseudo", "germanhang", "icecream", "flraise",
                    "pelican", "hspuhold", "hspuneg", "planchelean", "wallwalk"]) {
    assert.notEqual(E.tSkillClassOf(byId[id]), "coordination", id);
  }
  for (const id of ["handstand", "wallhs", "ctwhs", "crow", "bail"]) {
    assert.equal(E.tSkillClassOf(byId[id]), "coordination", id);
  }
});

test("natažená paže se pozná z metadat, ne ze seznamu ID", () => {
  const sa = rows.filter((x) => E.tIsStraightArm(x)).map((x) => x.id);
  for (const id of ["frontlever", "planche", "planchelean", "pseudo", "pelican", "germanhang"]) {
    assert.ok(sa.includes(id), id);
  }
  for (const id of ["elbowlever", "lsit", "vsit"]) assert.ok(!sa.includes(id), id);
});

// ---- co se dostane do plánu -------------------------------------------------
const EQUIP = {
  "vlastní váha": [],
  "domácí základ": ["zed", "lavice", "guma", "zavazi"],
  "posilovna": ["hrazda", "bradla", "zed", "lavice", "guma", "zavazi", "cinka", "kladka", "stroj", "svihadlo", "prostor"],
  "kruhy": ["kruhy", "hrazda", "zed"],
};
const GOALS = ["zdravi", "sila", "hyper", "skill", "mob", "kondice"];
const CONSTRAINTS = [[], ["rameno"], ["loket"], ["koleno"], ["zada"], ["kotnik"]];

test("matice generátoru · nic z toho, co se generovat nesmí", () => {
  const eq = Object.keys(EQUIP);
  let i = 0, sessions = 0;
  for (const level of [1, 2, 3, 4]) {
    for (const goal of GOALS) {
      for (const days of [2, 3, 4, 5]) {
        const e = eq[i % eq.length], c = CONSTRAINTS[i % CONSTRAINTS.length];
        i += 1;
        const p = { level, goals: [goal], days, weeks: 6, minutes: 45, equip: EQUIP[e], injuries: c, skillTargets: [] };
        const out = E.tpGenerate(p, rows, [], {});
        const label = `L${level} ${goal} ${e} ${days}d ${c.join("+") || "—"}`;
        assert.equal(out.workouts.length, days, label);
        for (const w of out.workouts) {
          sessions += 1;
          const fams = [], canons = [];
          for (const r of w.rows) {
            const x = byId[r.ex];
            assert.ok(x, `${label}: ${r.ex} neexistuje`);
            assert.ok(!E.tIsArchived(x), `${label}: archivovaný ${r.ex}`);
            assert.ok(!E.tIsProgramOnly(x), `${label}: programový ${r.ex}`);
            assert.notEqual(E.tStatusOf(x), "alias", `${label}: alias ${r.ex}`);
            assert.ok(!E.tRequiresCoach(x), `${label}: ${r.ex} chce trenéra a nikdo si ho nevybral`);
            assert.ok((x.eq || []).every((k) => ["telo", ...p.equip].includes(k)), `${label}: ${r.ex} chce vybavení navíc`);
            const fam = E.tFamilyOf(x), canon = E.tCanonIdOf(x);
            assert.ok(!canons.includes(canon), `${label}: dvakrát ${r.ex}`);
            assert.ok(!fams.includes(fam), `${label}: dvakrát rodina ${fam}`);
            fams.push(fam); canons.push(canon);
          }
          assert.ok(!w.rows.some((r) => r.ex === "neckiso"), `${label}: krční izometrie sama od sebe`);
          if (!c.length) assert.ok(!w.rows.some((r) => r.ex === "wristcurl"), `${label}: wrist curl pro každého`);
          for (const r of w.rows.filter((r) => E.tBlockOf(byId[r.ex]) === "strength")) {
            assert.ok(["strength", "hypertrophy", "power"].includes(E.tRoleOf(byId[r.ex])),
              `${label}: ${r.ex} není silový cvik a stojí v silovém bloku`);
          }
          const mins = E.tpMinutes(w.rows, byId);
          assert.ok(mins <= p.minutes * 1.6, `${label}: ${mins} min proti ${p.minutes}`);
        }
      }
    }
  }
  assert.ok(sessions > 300, `matice proběhla · ${sessions} tréninků`);
});

test("obyčejná Síla nepřidá náhodnou dovednost", () => {
  for (const level of [2, 3, 4]) {
    const out = E.tpGenerate({ level, goals: ["sila"], days: 3, weeks: 6, minutes: 45,
                               equip: ["hrazda", "bradla", "kruhy", "zed", "lavice", "guma", "zavazi"],
                               injuries: [], skillTargets: [] }, rows, [], {});
    for (const w of out.workouts) {
      for (const r of w.rows) {
        assert.notEqual(E.tSkillClassOf(byId[r.ex]), "strength_skill", `L${level}: ${r.ex}`);
      }
    }
  }
});

test("zapsané omezení mění dávku, nepředepisuje léčbu", () => {
  const out = E.tpGenerate({ level: 3, goals: ["sila"], days: 3, weeks: 6, minutes: 45,
                             equip: ["hrazda", "bradla", "lavice", "zavazi"], injuries: ["loket"], skillTargets: [] }, rows, [], {});
  assert.equal(out.plan.coachReview, true, "chybí signál ke kontrole trenérem");
  const eased = out.workouts.flatMap((w) => w.rows).filter((r) => r.mod === "pain");
  for (const r of eased) {
    assert.equal(r.tempo, undefined, "tempo je léčebné rozhodnutí");
    assert.equal(r.hold, true);
    const txt = (r.note || []).join(" ").toLowerCase();
    for (const bad of ["hojí", "heals", "léčb", "treatment", "nevynechávej", "do not skip"]) {
      assert.ok(!txt.includes(bad), `poznámka tvrdí příliš: ${bad}`);
    }
  }
});

test("v aktivním zdroji nezůstalo TP_HEALS ani role fyzioterapeuta", () => {
  const src = lib.src;
  assert.equal(/const TP_HEALS\s*=/.test(src), false);
  assert.equal(/rozdíl mezi aplikací a fyzioterapeut/i.test(src), false);
  assert.equal(/\{ k: "rameno"[^}]*add:/.test(src), false, "zranění nepředepisuje cviky");
});

test("v aktivní copy nezůstalo žádné z označených tvrzení", () => {
  const FLAGGED = [
    /jedin[áé]\s+poctiv[áé]\s+cesta|the honest road to/i,
    /tém[ěe][řr]\s+nulov[ouá]\s+kompres|almost no spinal compression/i,
    /tr[ée]nuje\s+bedern[íi]\s+plot[ée]nk|training discs/i,
    /p[řr][íi]m[áá]?\s*prevence|direct prevention of/i,
    /nejrychlej[šs][íi]\s+cesta\s+k\s+bolav|fastest road to a sore/i,
    /knihovn[ěe]\s+(chyb[ěe]l|nem[ěe]l)|the library (had none|lacked|was missing|did not have|had not one)/i,
    /[šs]lacha\s+se\s+hoj[íi]|a tendon heals/i,
  ];
  for (const x of rows) {
    for (const f of ["foc", "pos", "exe", "wat", "pro"]) {
      for (const text of x[f] || []) {
        if (!text) continue;
        for (const re of FLAGGED) assert.ok(!re.test(text), `${x.id}.${f}: "${String(text).slice(0, 60)}…"`);
      }
    }
  }
});

// ---- co klientská aplikace nést nesmí ---------------------------------------
test("trenérovy poznámky zůstávají u trenéra", () => {
  for (const m of Object.values(lib.meta)) {
    assert.equal(m.src, undefined, "provenance patří na trenérskou stranu");
    assert.equal(m.ev, undefined, "evidence-confidence patří na trenérskou stranu");
  }
  const src = lib.src;
  // Sdílené jádro tu ty dvě konstanty má — a musí být prázdné. Není to nedopatření:
  // stejná cesta v kódu, žádný osobní obsah v balíčku.
  assert.ok(/const JOURNAL_FULL\s*=\s*\[\];/.test(src), "JOURNAL_FULL musí být prázdný");
  assert.ok(/const NOTEBOOK_FULL\s*=\s*\[\];/.test(src), "NOTEBOOK_FULL musí být prázdný");
  assert.equal(/TEX_SOURCES/.test(src), false, "tabulka původu záznamů patří na trenérskou stranu");
});

test("migrace je idempotentní a vlastní text nepřepíše", () => {
  const fixM = /const TEX_AUDIT_FIX = \{[\s\S]*?\n\};/.exec(lib.src);
  assert.ok(fixM, "TEX_AUDIT_FIX chybí");
  const FIX = new Function("return " + fixM[0].replace(/^const TEX_AUDIT_FIX = /, ""))();
  assert.ok(Object.keys(FIX).length >= 60);
  const T = new Uint32Array(256);
  for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); T[i] = c >>> 0; }
  const crc32 = (u8) => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const enc = new TextEncoder();
  const crc = (v) => crc32(enc.encode(v === undefined ? "" : JSON.stringify(v))).toString(16).padStart(8, "0");
  const apply = (list) => {
    let touched = 0;
    const out = list.map((x) => {
      const fix = FIX[x.id], seed = byId[x.id];
      if (!fix || !seed) return x;
      let y = x;
      for (const f of Object.keys(fix)) {
        if (crc(y[f]) !== fix[f]) continue;
        y = y === x ? { ...x } : y;
        if (seed[f] === undefined) delete y[f]; else y[f] = seed[f];
      }
      if (y !== x) touched += 1;
      return y;
    });
    return { out, touched };
  };
  const now = rows.map((x) => ({ ...x }));
  assert.equal(apply(now).touched, 0, "na hotové knihovně migrace nic nedělá");
  const mine = now.map((x) => (x.id === "wristcurl" ? { ...x, pro: ["MOJE", "MINE"] } : x));
  const after = apply(mine).out;
  assert.deepEqual(after.find((x) => x.id === "wristcurl").pro, ["MOJE", "MINE"]);
  assert.deepEqual(after.map((x) => x.id), rows.map((x) => x.id));
});
