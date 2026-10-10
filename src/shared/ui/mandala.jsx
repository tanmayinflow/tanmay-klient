import React, { useState } from "react";
import { createPortal } from "react-dom";
import { TmIcon as FamilyIcon } from "./icons.jsx";
import { createAspectImageUI } from "./aspectImages.jsx";
import { LANDSCAPE_DIRECTION_INKS } from "./landscape.js";
import { FONT_BODY, FONT_TAG, FONT_DISPLAY_EN as FONT_DISPLAY } from "./type.js";
import { hexA } from "./color.js";
import { iconBtn, fieldStyle } from "./components.js";
import { tmEscVrstva, tmZamkniStranku, tmOdemkniStranku } from "./overlay.js";
import { useGuideAction } from "./guideNavigation.jsx";

// Shared visual and study content; all images, notes and counts use role-local storage.
export function createMandalaUI({ useT, useStore, L, uid, resizeImageToBlob, r2Put, r2Del, imgSrc, Toggle, Eyebrow, BRAND }) {
const MANDALA_ASPECTS = [
  { key: "north", dir: "S", angle: -90, hue: "sage",
    cz: "Sever", en: "North", subCz: "Pečující dospělý", subEn: "Nurturing Generative Adult",
    glyphCz: "péče, kompetence, plodnost", glyphEn: "care, competence, generativity",
    promptCz: "Kdo ve mně pečuje a vede? Obrazy zralé síly, služby a laskavého řádu.",
    promptEn: "Who in me nurtures and leads? Images of mature strength, service and kind order." },
  { key: "east", dir: "V", angle: 0, hue: "sand",
    cz: "Východ", en: "East", subCz: "Nevinný mudrc", subEn: "The Innocent / Sage",
    glyphCz: "lehkost, humor, jas, duch", glyphEn: "lightness, humor, clarity, spirit",
    promptCz: "Kdo ve mně se směje a vidí celek? Obrazy úsvitu, nevinnosti a nadhledu.",
    promptEn: "Who in me laughs and sees the whole? Images of dawn, innocence and perspective." },
  { key: "south", dir: "J", angle: 90, hue: "accent",
    cz: "Jih", en: "South", subCz: "Divoký domorodý", subEn: "Wild Indigenous One",
    glyphCz: "tělo, emoce, smysly, Erós", glyphEn: "body, emotion, senses, Eros",
    promptCz: "Kdo ve mně cítí a touží? Obrazy divokosti, vášně a plně vtěleného života.",
    promptEn: "Who in me feels and desires? Images of wildness, passion and embodied life." },
  { key: "west", dir: "Z", angle: 180, hue: "textMuted",
    cz: "Západ", en: "West", subCz: "Múza · Milovaný", subEn: "Muse-Beloved",
    glyphCz: "sen, obraznost, hlubina, duše", glyphEn: "dream, imagination, depths, soul",
    promptCz: "Kdo mě volá do hlubin? Obrazy noci, mystéria, snů a duše.",
    promptEn: "Who calls me into the depths? Images of night, mystery, dream and soul." },
];
const MANDALA_HUE = (t, h) => {
  // Four nearby, quiet directional inks; functional theme colors stay unchanged.
  const hues = t.material === "landscape"
    ? LANDSCAPE_DIRECTION_INKS[t.mode]
    : { sage: t.sage, sand: t.sand, accent: t.accent, textMuted: t.textMuted };
  return hues[h] || t.sage;
};

// Studijní síň · faithful to Bill Plotkin's Wild Mind: each direction = one
// facet of the Self, its wounded subpersonalities, and the practices that
// cultivate the facet so it can welcome the wounded ones home.
const MANDALA_CONTEXT = {
  north: [
    { tCz: "Esence · Pečující dospělý", tEn: "Essence · Nurturing Generative Adult", body: [
      { pCz: "Severní faseta Self je vnitřní zralý dospělý: ten, kdo umí pečovat o sebe i o druhé bez podmínek a bez sebeobětování. Je empatický, soucitný a zároveň kompetentní — umí věci dotáhnout, vést, nést odpovědnost. Sever je poledne a dospělost: plodná síla, která dává život věcem větším, než jsme my sami.", pEn: "The North facet of the Self is the inner mature adult: the one able to care for self and others without conditions and without self-sacrifice. Empathic, compassionate, and competent — able to finish things, to lead, to carry responsibility. North is noon and adulthood: generative strength that gives life to things larger than ourselves." },
      { ulCz: ["soucit a empatie — k druhým i k sobě", "kompetence: schopnost konat, dokončovat, vést", "plodnost (generativity): tvořit, co slouží životu", "zdravé hranice — péče, která nepohlcuje", "vnitřní rodič pro vlastní zraněné části"], ulEn: ["compassion and empathy — for others and for oneself", "competence: to act, complete, lead", "generativity: creating what serves life", "healthy boundaries — care that does not devour", "an inner parent for one's own wounded parts"] },
    ]},
    { tCz: "Subosobnosti · Věrní vojáci", tEn: "Subpersonalities · Loyal Soldiers", body: [
      { pCz: "Severní subosobnosti Plotkin nazývá Věrní vojáci: části, které v dětství vznikly, aby nás udržely v bezpečí a přijatelné pro okolí — tím, že nás zmenšily. Slouží dál i dávno po válce, jako japonský voják, který desítky let po kapitulaci stále brání svůj ostrov.", pEn: "Plotkin calls the North subpersonalities Loyal Soldiers: parts formed in childhood to keep us safe and acceptable — by shrinking us. They serve on long after the war, like the Japanese soldier still defending his island decades after surrender." },
      { ulCz: ["Vnitřní kritik — útočí první, aby nás nikdo nepředběhl", "Perfekcionista — bezpečí skrze bezchybnost", "Konformista — splynout, nevyčnívat", "Pečovatel/kodependent — láska výměnou za sebeopuštění", "Poháněč (taskmaster) — hodnota jen skrze výkon"], ulEn: ["Inner Critic — strikes first so no one else can", "Perfectionist — safety through flawlessness", "Conformist — blend in, never stand out", "Caretaker/codependent — love traded for self-abandonment", "Taskmaster — worth only through performance"] },
      { pCz: "Klíč Wild Mind: nejsou to nepřátelé. Jsou to vysloužilí strážci, kteří si zaslouží poděkování, uvítání doma — a novou, menší práci.", pEn: "The Wild Mind key: they are not enemies. They are veteran guardians who deserve thanks, a welcome home — and a new, smaller job." },
    ]},
    { tCz: "Znaky · kdy vládne faseta, kdy voják", tEn: "Signs · facet present vs. soldier in charge", body: [
      { ulCz: ["Faseta: klidná vřelost; konám, co slouží životu, bez potřeby pochvaly; hranice bez viny", "Voják: tvrdá samomluva; nadodpovědnost za všechny; vyhoření z péče; strach zklamat"], ulEn: ["Facet: calm warmth; doing what serves life without needing praise; boundaries without guilt", "Soldier: harsh self-talk; over-responsibility for everyone; caretaker burnout; fear of disappointing"] },
    ]},
    { tCz: "Praktiky kultivace", tEn: "Practices of cultivation", body: [
      { ulCz: ["denní vděčnost — večer pojmenuj, co dnes dostalo péči", "soucit se sebou: mluv k sobě jako k milovanému dítěti", "mentoruj, služ, pečuj o místo či bytost — bez nároku na dík", "rozlišuj: pravá péče vs. kodependence (komu tím sloužím?)", "obřad uvítání vojáka: poděkuj, propusť ze služby, dej novou roli", "buď rodičem svým zraněným dětem z Jihu — Sever je drží"], ulEn: ["daily gratitude — each evening, name what received care today", "self-compassion: speak to yourself as to a beloved child", "mentor, serve, tend a place or being — expecting no thanks", "discern: true care vs. codependence (whom does this serve?)", "a soldier's welcome rite: thank, discharge, assign a new role", "parent your wounded children of the South — the North holds them"] },
    ]},
    { tCz: "Práce s vojáky", tEn: "Working with the Soldiers", body: [
      { pCz: "Když se ozve kritik či poháněč: 1) zastav se a pojmenuj ho („mluví voják“), 2) poděkuj mu za dlouhou službu, 3) zeptej se, před čím mě tehdy chránil, 4) řekni mu pravdu dospělého: válka skončila, přežili jsme, 5) nabídni mu novou práci (korektor detailů, strážce spánku…). Vojáka nevyháníme — faseta Severa ho zaměstná.", pEn: "When the critic or taskmaster speaks: 1) pause and name it (\"a soldier speaking\"), 2) thank it for long service, 3) ask what it protected me from back then, 4) tell it the adult's truth: the war is over, we survived, 5) offer a new job (proofreader of details, guardian of sleep…). We never banish a soldier — the North facet employs him." },
    ]},
    { tCz: "Místo v celku", tEn: "Place in the whole", body: [
      { pCz: "Sever stojí naproti Jihu: zralá péče drží divoké dítě, aby smělo cítit vše. Bez Severa se Jih topí v ranách; bez Jihu Sever tuhne v povinnost. Plodný dospělý je ten, kdo připraví ego na sestup k duši — celistvost předchází povolání.", pEn: "North faces South: mature care holds the wild child so it may feel everything. Without North, South drowns in its wounds; without South, North hardens into duty. The generative adult readies the ego for the descent to soul — wholeness precedes vocation." },
    ]},
  ],
  east: [
    { tCz: "Esence · Nevinný mudrc", tEn: "Essence · The Innocent / Sage", body: [
      { pCz: "Východní faseta je paradox: nevinné dítě a mudrc v jedné postavě. Lehkost, humor, úžas, jednoduchost — a zároveň jasná mysl, která vidí celek z výšky. Východ je úsvit a jaro: důvěra Blázna, který vykročí z útesu, a smích, který rozpouští těžkost. Skrze Východ se dotýkáme ducha, světla, Jednoho.", pEn: "The East facet is a paradox: innocent child and sage in one figure. Lightness, humor, wonder, simplicity — and a clear mind seeing the whole from above. East is dawn and spring: the Fool's trust stepping off the cliff, laughter dissolving heaviness. Through the East we touch spirit, light, the One." },
      { ulCz: ["úžas a zvědavost prvního pohledu", "humor a hravost jako moudrost", "nadhled: vidět velký obraz, netonout v detailu", "prostá důvěra v život", "spojení vzhůru — duch, světlo, ticho"], ulEn: ["the wonder and curiosity of first sight", "humor and play as wisdom", "perspective: seeing the big picture, not drowning in detail", "simple trust in life", "connection upward — spirit, light, silence"] },
    ]},
    { tCz: "Subosobnosti · Uprchlíci a závislí", tEn: "Subpersonalities · Escapists & Addicts", body: [
      { pCz: "Východ zraněný utíká vzhůru a pryč: do blaženosti, rozptýlení, závislostí. Plotkin sem řadí všechny podoby úniku před tíhou vtěleného života.", pEn: "The wounded East flees upward and away: into bliss, distraction, addiction. Plotkin places here every form of escape from the weight of embodied life." },
      { ulCz: ["Věčný mladík / dívka (puer, puella) — nikdy nepřistát, nezavázat se", "Duchovní obcházeč — meditací a světlem se vyhýbat bolesti", "Závislý — látky, obrazovky, práce, cokoliv, co odnese", "Blažený snílek — pořád jinde, nikdy tady"], ulEn: ["Eternal youth (puer, puella) — never landing, never committing", "Spiritual bypasser — using meditation and light to avoid pain", "The Addict — substances, screens, work, anything that carries away", "Blissed dreamer — always elsewhere, never here"] },
    ]},
    { tCz: "Znaky", tEn: "Signs", body: [
      { ulCz: ["Faseta: lehké srdce, prostor kolem myšlenek, smích, který léčí; důvěra", "Uprchlík: chronické rozptýlení, honba za stavy, neschopnost dokončit a vtělit; disociace"], ulEn: ["Facet: a light heart, space around thoughts, healing laughter; trust", "Escapist: chronic distraction, state-chasing, inability to finish and incarnate; dissociation"] },
    ]},
    { tCz: "Praktiky kultivace", tEn: "Practices of cultivation", body: [
      { ulCz: ["ticho a dech — denní sezení beze snahy něco získat", "procházky úžasu: jdi ven a nech se překvapit jako poprvé", "smích a hra — vědomě, s druhými, bez účelu", "zjednodušuj: jednou týdně něco pusť (věc, úkol, názor)", "modlitba či dík celku — jakoukoli řečí, která je tvá", "pozorovatel: sleduj myšlenky jako počasí, nehodnoť"], ulEn: ["silence and breath — daily sitting with nothing to gain", "wonder walks: go out and be surprised as if for the first time", "laughter and play — deliberately, with others, purposeless", "simplify: once a week release something (an object, task, opinion)", "prayer or thanks to the whole — in whatever tongue is yours", "the witness: watch thoughts like weather, without judging"] },
    ]},
    { tCz: "Práce s uprchlíky", tEn: "Working with the Escapists", body: [
      { pCz: "Závislost se neporáží válkou, ale přistáním. Když ucítíš tah pryč: 1) pojmenuj („uprchlík chce odletět“), 2) zeptej se, před jakou bolestí právě prchá, 3) dej bolesti minutu plné přítomnosti v těle (Jih pomáhá), 4) pak vědomě zvol malý pozemský čin — sklenice vody, dopsaná věta. Mudrc neutíká z světa; směje se uprostřed něj.", pEn: "Addiction is not defeated by war but by landing. When you feel the pull away: 1) name it (\"the escapist wants to fly\"), 2) ask what pain it is fleeing right now, 3) give that pain one minute of full bodily presence (the South helps), 4) then choose a small earthly act — a glass of water, a finished sentence. The sage does not flee the world; he laughs in the middle of it." },
    ]},
    { tCz: "Místo v celku", tEn: "Place in the whole", body: [
      { pCz: "Východ stojí naproti Západu: světlo nadhledu vyvažuje temnou hlubinu duše. Bez Východu se Západ utopí ve vážnosti a stínu; bez Západu je Východ jen únik do světla. Mudrc dává sestupu k duši lehkost — a nevinnost je to, co se vrací z hlubin očištěné.", pEn: "East faces West: the light of perspective balances the dark depth of soul. Without East, the West drowns in gravity and shadow; without West, the East is mere flight into light. The sage lends lightness to the descent — and innocence is what returns from the depths, washed clean." },
    ]},
  ],
  south: [
    { tCz: "Esence · Divoký domorodý", tEn: "Essence · Wild Indigenous One", body: [
      { pCz: "Jižní faseta je naše plně vtělená, emocionální, smyslová přirozenost — bytost, která je doma v těle a v divoké zemi. Cítí naplno a nestydí se za to; zná Erós, instinkt, rytmus. Jih je léto a dětství v nejlepším smyslu: přítomná, pulzující živost, příbuznost se vším živým.", pEn: "The South facet is our fully embodied, emotive, sensuous nature — the being at home in the body and the wild earth. It feels fully and without shame; it knows Eros, instinct, rhythm. South is summer and childhood in the best sense: present, pulsing aliveness, kinship with all that lives." },
      { ulCz: ["plné prožívání emocí — vztek, žal, radost i strach mají průtok", "smyslovost: chuť, dotek, vůně, pohyb", "instinkt a tělesná moudrost", "Erós — touha jako životní síla", "domorodost: patřím zemi, země patří mně"], ulEn: ["full feeling of emotions — anger, grief, joy and fear all flow", "sensuousness: taste, touch, scent, movement", "instinct and bodily wisdom", "Eros — desire as life force", "indigeneity: I belong to the earth, the earth belongs to me"] },
    ]},
    { tCz: "Subosobnosti · Zraněné děti", tEn: "Subpersonalities · Wounded Children", body: [
      { pCz: "Jižní subosobnosti jsou naše zraněné děti: části, které nesou původní rány — opuštění, zahanbení, strach. Nezmizely; čekají, až je někdo konečně uvidí. Když je nikdo nedrží, přebírají vládu skrze emoční záplavy.", pEn: "The South subpersonalities are our wounded children: the parts carrying the original wounds — abandonment, shame, fear. They never vanished; they wait to be finally seen. Unheld, they seize the throne through emotional floods." },
      { ulCz: ["Opuštěné dítě — paniku blízkosti řeší přilnutím, nebo útěkem", "Zahanbené dítě — „se mnou je něco špatně“", "Vystrašené dítě — svět je nebezpečný, raději zmrznout", "Oběť — bezmoc jako jediný známý jazyk", "Rebel — vzdor místo hranice"], ulEn: ["Abandoned child — solves the panic of closeness by clinging, or fleeing", "Shamed child — \"something is wrong with me\"", "Frightened child — the world is dangerous, better to freeze", "Victim — helplessness as the only known tongue", "Rebel — defiance in place of a boundary"] },
    ]},
    { tCz: "Znaky", tEn: "Signs", body: [
      { ulCz: ["Faseta: živé smysly, emoce tečou a odezní, tělo je domov; spřízněnost s divočinou", "Dítě u vlády: otupělost nebo zaplavení; sebelítostné smyčky; hledání zachránce; výbuchy"], ulEn: ["Facet: vivid senses, emotions flow and pass, the body is home; kinship with the wild", "Child on the throne: numbness or flooding; self-pity loops; rescuer-seeking; outbursts"] },
    ]},
    { tCz: "Praktiky kultivace", tEn: "Practices of cultivation", body: [
      { ulCz: ["cíť emoce v těle: kde přesně sedí vztek? dej mu dech a zvuk", "toulky krajinou beze smyslu a cíle; bosé nohy na zemi", "smyslové ponoření: jez pomalu, dotýkej se kůry, plav v řece", "tancuj a hýbej se jako zvíře — bez zrcadla, bez formy", "rada s víc-než-lidským světem: mluv se stromem, s řekou, poslouchej", "tvoř z těla: hlína, rytmus, hlas — ne z hlavy"], ulEn: ["feel emotions in the body: where exactly does anger sit? give it breath and sound", "aimless wandering on the land; bare feet on the ground", "sensuous immersion: eat slowly, touch bark, swim the river", "dance and move like an animal — no mirror, no form", "council with the more-than-human world: speak to a tree, a river, and listen", "create from the body: clay, rhythm, voice — not from the head"] },
    ]},
    { tCz: "Práce se zraněnými dětmi", tEn: "Working with the Wounded Children", body: [
      { pCz: "Dítě se neléčí radou, ale náručí. Když emoce zaplaví: 1) poznej záplavu („to mluví dítě, ne dnešek“), 2) polož ruku na místo v těle, kde to žije, 3) řekni mu: vidím tě, jsi se mnou, už nejsi samo, 4) nech Sever (Pečujícího dospělého) držet a rozhodovat. Dítěti nevládne se — dítě se drží v náruči.", pEn: "A child is healed not by advice but by arms. When emotion floods: 1) recognize the flood (\"a child speaks, not this day\"), 2) place a hand where it lives in the body, 3) tell it: I see you, you are with me, you are no longer alone, 4) let the North (Nurturing Adult) hold and decide. A child is not to be ruled — a child is to be held." },
    ]},
    { tCz: "Místo v celku", tEn: "Place in the whole", body: [
      { pCz: "Jih stojí naproti Severu: divoká živost dává zralé péči šťávu a pravdivost; péče dává divokosti bezpečný břeh. Bez Jihu je život správný, ale mrtvý. A právě jižní plné cítění je branou, kterou později prochází i setkání s duší na Západě.", pEn: "South faces North: wild aliveness gives mature care its sap and truth; care gives wildness a safe shore. Without the South, life is correct but dead. And it is the South's full feeling that later becomes the gate through which the West's encounter with soul must pass." },
    ]},
  ],
  west: [
    { tCz: "Esence · Múza a Milovaný", tEn: "Essence · Muse-Beloved", body: [
      { pCz: "Západní faseta je tvůrčí temnota: obraznost, sny, vize, romance s mystériem. Múza přináší obrazy z hlubin; vnitřní Milovaný nás vábí dál, než je pohodlné — směrem k duši. Západ je soumrak a podzim: čas sestupu, poezie, magie a významů, které rostou potmě.", pEn: "The West facet is creative darkness: imagination, dreams, visions, the romance with mystery. The Muse brings images up from the depths; the inner Beloved lures us further than is comfortable — toward soul. West is dusk and autumn: the time of descent, of poetry, magic, and meanings that grow in the dark." },
      { ulCz: ["obraznost a snění — jazyk duše", "přitažlivost mystéria: co mě volá, i když nevím proč", "poetické vědomí: svět mluví v obrazech", "průvodce sestupu k duši a povolání", "plodná samota a noc"], ulEn: ["imagination and dreaming — the language of soul", "the pull of mystery: what calls me though I don't know why", "poetic consciousness: the world speaks in images", "guide of the descent to soul and vocation", "fertile solitude and night"] },
    ]},
    { tCz: "Subosobnosti · Stín a posedlá Múza", tEn: "Subpersonalities · Shadow & the possessed Muse", body: [
      { pCz: "Na Západě žijí zapřené části — Stín. Vše, co jsme o sobě odmítli (temné i zlaté), nezmizelo: promítá se ven na druhé, nebo sabotuje zevnitř. A když je Múza zraněná, obraznost se obrací proti nám.", pEn: "In the West live the disowned parts — the Shadow. All we refused about ourselves (dark and golden alike) never vanished: it projects outward onto others, or sabotages from within. And when the Muse is wounded, imagination turns against us." },
      { ulCz: ["Temný stín — co mě na druhých rozčiluje, nosím v sobě", "Zlatý stín — velikost, kterou obdivuji jinde, protože ji u sebe nesnesu", "Posedlý milenec — závislá zamilovanost, fantazie místo vztahu", "Katastrofista — obraznost unesená strachem", "Sabotér — vyhnaná část, která si bere slovo skrytě"], ulEn: ["Dark shadow — what enrages me in others, I carry myself", "Golden shadow — the greatness I admire elsewhere because I can't bear it in me", "Possessed lover — addictive infatuation, fantasy in place of relationship", "Catastrophizer — imagination hijacked by fear", "Saboteur — an exiled part that takes the floor in secret"] },
    ]},
    { tCz: "Znaky", tEn: "Signs", body: [
      { ulCz: ["Faseta: živé sny, obrazy, které táhnou; tvůrčí tah; snesitelná, plodná temnota", "Stín u vlády: opakované bitvy s týmiž typy lidí; tajné posedlosti; sebesabotáž v rozhodné chvíli"], ulEn: ["Facet: vivid dreams, images that pull; creative traction; bearable, fertile darkness", "Shadow in charge: repeated battles with the same kinds of people; secret obsessions; self-sabotage at the decisive hour"] },
    ]},
    { tCz: "Praktiky kultivace", tEn: "Practices of cultivation", body: [
      { ulCz: ["snový deník: zapiš sen hned po probuzení, bez výkladu; vracej se do něj imaginací", "hlubinné obrazné cesty: nech obraz vést, nekontroluj děj", "lov projekcí: koho nesnáším / zbožňuji? co z toho je moje?", "psaní a umění z hlubin — poezie, kresba, bez cenzury", "noční chůze a sezení potmě; rozhovor s vnitřním Milovaným", "samoty v divočině: nech krajinu zrcadlit duši (zrcadlo divočiny)"], ulEn: ["dream journal: record on waking, no interpretation; re-enter by imagination", "deep imagery journeys: let the image lead, don't steer the plot", "projection hunting: whom do I despise / adore? what of that is mine?", "writing and art from the depths — poetry, drawing, uncensored", "night walking and sitting in the dark; conversing with the inner Beloved", "wilderness solitude: let the land mirror the soul (the wild as mirror)"] },
    ]},
    { tCz: "Práce se Stínem", tEn: "Working with the Shadow", body: [
      { pCz: "Stín se nesbírá silou, ale zvědavostí: 1) chyť projekci za ocas (silná reakce = stopa), 2) zeptej se: jak je tohle pravda o mně?, 3) najdi, kdy ta část musela do vyhnanství a co tehdy chránila, 4) dej jí tvar — postavu, jméno, obraz do galerie, 5) vrať jí místo u ohně: zlaté stíny se žijí, temné se drží za ruku. Co je přijato, přestává sabotovat a začíná sloužit.", pEn: "Shadow is gathered not by force but by curiosity: 1) catch the projection by the tail (a strong reaction = a trail), 2) ask: how is this true of me?, 3) find when that part was exiled and what it protected then, 4) give it a shape — a figure, a name, an image for the gallery, 5) return it a seat by the fire: golden shadows are to be lived, dark ones held by the hand. What is accepted stops sabotaging and begins to serve." },
    ]},
    { tCz: "Místo v celku", tEn: "Place in the whole", body: [
      { pCz: "Západ stojí naproti Východu: hlubina proti světlu, sen proti smíchu. Západ je průvodce celé cesty k duši — právě tady se rodí obrazy povolání. Ale sestupovat smí jen ego, které drží i ostatní tři strany; jinak hlubina bere. Proto: celistvost nejdřív, pak sestup.", pEn: "West faces East: depth against light, dream against laughter. The West guides the whole journey to soul — it is here that the images of vocation are born. But only an ego held by the other three directions may descend; otherwise the deep takes. Hence: wholeness first, then descent." },
    ]},
  ],
  center: [
    { tCz: "Mapa celku · čtyři fasety a střed", tEn: "The whole map · four facets and the center", body: [
      { pCz: "Wild Mind kreslí psýché jako kruh čtyř světových stran. V každé bydlí jedna faseta celistvého Self — Pečující dospělý (S), Nevinný mudrc (V), Divoký domorodý (J), Múza a Milovaný (Z) — a vedle ní zraněné subosobnosti téhož směru. Uprostřed stojí ego: to, kdo říká „já“.", pEn: "Wild Mind draws the psyche as a circle of the four directions. In each lives one facet of the whole Self — Nurturing Adult (N), Innocent/Sage (E), Wild Indigenous One (S), Muse-Beloved (W) — and beside it the wounded subpersonalities of that same direction. In the center stands the ego: the one who says \"I\"." },
    ]},
    { tCz: "Ego a Self", tEn: "Ego and Self", body: [
      { pCz: "Cílem není ego zrušit, ale nechat ho dozrát: ego zakotvené ve všech čtyřech fasetách Plotkin nazývá trojrozměrným. Takové ego umí pečovat, smát se, cítit i snít — a proto unese setkání s duší.", pEn: "The aim is not to abolish the ego but to let it mature: an ego rooted in all four facets Plotkin calls three-dimensional. Such an ego can care, laugh, feel, and dream — and can therefore bear the encounter with soul." },
    ]},
    { tCz: "Subosobnosti nejsou nepřátelé", tEn: "Subpersonalities are not enemies", body: [
      { pCz: "Vojáci, děti, uprchlíci i stíny kdysi zachraňovali život. Neléčí se vyhnáním, ale uvítáním: faseta téhož směru je drží. Sever drží děti Jihu, Východ přistává s uprchlíky, Západ vítá stíny, Sever propouští vojáky ze služby.", pEn: "Soldiers, children, escapists and shadows once saved a life. They are healed not by exile but by welcome: the facet of the same direction holds them. North holds the children of the South, East lands with the escapists, West welcomes the shadows, North discharges the soldiers from duty." },
    ]},
    { tCz: "Rytmus praxe", tEn: "The rhythm of practice", body: [
      { ulCz: ["ráno se nalaď: kterou fasetu dnes den potřebuje? („Dnes jsem…“)", "přes den zachytávej převraty: kdo právě mluví — faseta, nebo subosobnost?", "večer krátce poděkuj té straně, která nesla den", "obrazy v galeriích živí fasety — vracej se k nim, obměňuj je"], ulEn: ["tune in each morning: which facet does this day need? (\"Today I am…\")", "through the day, catch the coups: who is speaking — a facet, or a subpersonality?", "each evening, briefly thank the direction that carried the day", "the gallery images feed the facets — return to them, let them change"] },
    ]},
    { tCz: "Celistvost před duší", tEn: "Wholeness before soul", body: [
      { pCz: "Celá mandala slouží jednomu: připravit člověka na rozhovor s vlastní duší a jejím povoláním. Divoká příroda je při tom zrcadlem. Kruh se neučí v knihovně, ale v krajině.", pEn: "The whole mandala serves one thing: to ready a person for the conversation with their own soul and its calling. Wild nature is the mirror in that in this — the circle is learned not in a library but on the land." },
    ]},
  ],
};

function TmMandalaWheel({ onPick, onCore }) {
  const { t } = useT();
  const st = useStore();
  const mand = st.coll.mandala || {};
  const edit = st.editMode;
  const [hk, setHk] = useState(null);
  const [coreHov, setCoreHov] = useState(false);
  const [, force] = useState(0);
  const svgRef = React.useRef(null);
  const drag = React.useRef(null);
  const artRef = React.useRef(null);
  const pendKey = React.useRef(null);
  const S = 440, C = S / 2, R = 205, Z = 1.4;
  const quad = (mid) => {
    const a0 = (mid - 45) * Math.PI / 180, a1 = (mid + 45) * Math.PI / 180;
    return `M ${C} ${C} L ${(C + R * Math.cos(a0)).toFixed(2)} ${(C + R * Math.sin(a0)).toFixed(2)} A ${R} ${R} 0 0 1 ${(C + R * Math.cos(a1)).toFixed(2)} ${(C + R * Math.sin(a1)).toFixed(2)} Z`;
  };
  const storedPos = (key) => ((mand[key] || {}).pos) || { x: 0.5, y: 0.5 };
  const posOf = (key) => (drag.current && drag.current.key === key && drag.current.live) ? drag.current.live : storedPos(key);
  const onMove = (e) => {
    const d = drag.current; if (!d) return;
    const w = S * Z;
    const dxs = (e.clientX - d.cx) * d.scale, dys = (e.clientY - d.cy) * d.scale;
    if (Math.abs(e.clientX - d.cx) + Math.abs(e.clientY - d.cy) > 3) d.moved = true;
    d.live = { x: Math.min(1, Math.max(0, d.pos0.x - dxs / (w - S))), y: Math.min(1, Math.max(0, d.pos0.y - dys / (w - S))) };
    force((n) => n + 1);
  };
  const onUp = () => {
    const d = drag.current;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if (d && d.live) { const data = mand[d.key] || {}; st.setMandala({ [d.key]: { ...data, pos: d.live } }); }
    setTimeout(() => { drag.current = null; force((n) => n + 1); }, 0);
  };
  const onDown = (key) => (e) => {
    if (!edit || !(mand[key] || {}).art || !svgRef.current) return;
    e.preventDefault(); e.stopPropagation();
    const r = svgRef.current.getBoundingClientRect();
    drag.current = { key, cx: e.clientX, cy: e.clientY, pos0: storedPos(key), scale: S / r.width, moved: false };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const clickQuad = (key) => (e) => { if (drag.current && drag.current.moved) { e.stopPropagation(); return; } onPick(key); };
  const pickArt = async (file) => {
    const key = pendKey.current; if (!file || !key) return;
    try {
      const blob = await resizeImageToBlob(file, 900);
      const gid = uid() + "m";
      await r2Put(gid, blob, file.name);
      if (key === "center") st.setMandala({ center: { ...(mand.center || {}), art: { r2id: gid } } });
      else { const data = mand[key] || {}; st.setMandala({ [key]: { ...data, art: { r2id: gid }, pos: data.pos || { x: 0.5, y: 0.5 } } }); }
    } catch (err) {}
    if (artRef.current) artRef.current.value = "";
  };
  const startPick = (key) => { pendKey.current = key; if (artRef.current) artRef.current.click(); };
  const resetArt = (key) => { const data = key === "center" ? (mand.center || {}) : (mand[key] || {}); const old = data.art; if (key === "center") st.setMandala({ center: { ...data, art: null } }); else st.setMandala({ [key]: { ...data, art: null } }); if (old && old.r2id) r2Del(old.r2id); };
  // vrací obrázek jen tehdy, když si ho člověk sám nahrál · jinak nic
  const imgFor = (key) => {
    const art = (mand[key] || {}).art;
    if (!art) return null;
    const p = posOf(key); const w = S * Z;
    return { href: imgSrc(art), x: -(w - S) * p.x, y: -(w - S) * p.y, w, h: w };
  };
  const lineCol = t.mode === "dark" ? "rgba(244,240,235,0.35)" : "rgba(22,67,61,0.35)";
  const CU = 37;
  const chakana = "M " + [[-1, -3], [1, -3], [1, -2], [2, -2], [2, -1], [3, -1], [3, 1], [2, 1], [2, 2], [1, 2], [1, 3], [-1, 3], [-1, 2], [-2, 2], [-2, 1], [-3, 1], [-3, -1], [-2, -1], [-2, -2], [-1, -2]].map(([x, y]) => `${(C + x * CU).toFixed(1)} ${(C + y * CU).toFixed(1)}`).join(" L ") + " Z";
  return (
    <div>
      <input ref={artRef} type="file" accept="image/*" onChange={(e) => pickArt(e.target.files && e.target.files[0])} style={{ display: "none" }} />
      <svg ref={svgRef} viewBox={`0 0 ${S} ${S}`} style={{ display: "block", width: "100%", maxWidth: 560, margin: "0 auto", touchAction: edit ? "none" : "auto" }} role="img" aria-label={L("Mandala aspektů self", "Mandala of the aspects of self")}>
        <defs>
          {MANDALA_ASPECTS.map((a) => (
            <clipPath key={a.key} id={`tmq-${a.key}`}><path d={quad(a.angle)} /></clipPath>
          ))}
          <radialGradient id="tmq-vin" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(28,28,26,0.55)" />
            <stop offset="45%" stopColor="rgba(28,28,26,0.12)" />
            <stop offset="100%" stopColor="rgba(28,28,26,0.34)" />
          </radialGradient>
        </defs>
        {MANDALA_ASPECTS.map((asp) => {
          const on = hk === asp.key;
          const col = MANDALA_HUE(t, asp.hue);
          const mid = asp.angle * Math.PI / 180;
          const lx = C + (R * 0.72) * Math.cos(mid), ly = C + (R * 0.72) * Math.sin(mid);
          const im = imgFor(asp.key);
          const hasArt = !!(mand[asp.key] || {}).art;
          return (
            <g key={asp.key} onClick={clickQuad(asp.key)} onPointerDown={onDown(asp.key)} onMouseEnter={() => setHk(asp.key)} onMouseLeave={() => setHk(null)} style={{ cursor: edit && hasArt ? "grab" : "pointer" }}>
              {/* bez vlastního obrázku je kvadrant plocha v tónu své strany */}
              {im
                ? <image href={im.href} x={im.x} y={im.y} width={im.w} height={im.h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#tmq-${asp.key})`} opacity={on ? 1 : 0.82} style={{ transition: drag.current ? "none" : "opacity .5s ease" }} />
                : <path d={quad(asp.angle)} fill={col} opacity={on ? 0.20 : 0.13} style={{ transition: "opacity .5s ease" }} />}
              {/* Vinětace a tmavý obtah písma existovaly kvůli fotografii —
                  aby na ní šel text přečíst. Na plné ploše z nich je jen šeď,
                  takže patří jen ke kvadrantu, který obrázek opravdu má. */}
              {im && <path d={quad(asp.angle)} fill="url(#tmq-vin)" opacity={on ? 0.45 : 1} style={{ transition: "opacity .5s ease" }} />}
              <path d={quad(asp.angle)} fill={col} opacity={on ? 0.10 : 0.05} style={{ transition: "opacity .5s ease" }} />
              <path d={quad(asp.angle)} fill="none" stroke={t.mode === "dark" ? "rgba(244,240,235,0.35)" : "rgba(22,67,61,0.35)"} strokeWidth="1" />
              <text x={lx} y={ly - 6} textAnchor="middle" paintOrder="stroke" stroke={im ? "rgba(28,28,26,0.68)" : "none"} strokeWidth={im ? "2.6" : "0"} style={{ fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.26em", fill: im ? BRAND.linen : t.heading, textTransform: "uppercase" }}>{L(asp.cz, asp.en)}</text>
              <text x={lx} y={ly + 11} textAnchor="middle" paintOrder="stroke" stroke={im ? "rgba(28,28,26,0.64)" : "none"} strokeWidth={im ? "2.2" : "0"} style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 12, fill: im ? "rgba(244,240,235,0.9)" : t.textSec }}>{L(asp.subCz, asp.subEn)}</text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R} fill="none" stroke={t.border} strokeWidth="1.4" />
        <circle cx={C} cy={C} r={R - 5} fill="none" stroke={t.borderSoft} strokeWidth="0.7" strokeDasharray="0.6 5.1" />
        {(() => {
          const rad = (deg) => ({ x: +(C + R * Math.cos(deg * Math.PI / 180)).toFixed(2), y: +(C + R * Math.sin(deg * Math.PI / 180)).toFixed(2) });
          const arcLen = 2 * Math.PI * R / 8;
          const arcs = [[45, 0], [45, 90], [135, 90], [135, 180], [225, 180], [225, 270], [315, 270], [315, 360]];
          return (
            <g style={{ pointerEvents: "none" }}>
              {[45, 135, 225, 315].map((deg) => { const p = rad(deg); return (
                <line key={deg} x1={C} y1={C} x2={p.x} y2={p.y} stroke={t.accent} strokeWidth="1.1" strokeDasharray={R} style={{ strokeDashoffset: coreHov ? 0 : R, transition: "stroke-dashoffset .45s ease" }} />
              ); })}
              {arcs.map(([a, b], i) => { const p1 = rad(a), p2 = rad(b); const sweep = b > a ? 1 : 0; return (
                <path key={i} d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 0 ${sweep} ${p2.x} ${p2.y}`} fill="none" stroke={t.accent} strokeWidth="1.4" strokeDasharray={arcLen} style={{ strokeDashoffset: coreHov ? 0 : arcLen, transition: "stroke-dashoffset .45s ease .4s" }} />
              ); })}
            </g>
          );
        })()}
        <g data-guide="mandala.overview" onClick={() => { setCoreHov(true); setTimeout(() => onCore(), 360); }} onMouseEnter={() => setCoreHov(true)} onMouseLeave={() => setCoreHov(false)} style={{ cursor: "pointer" }}>
          <circle cx={C} cy={C} r="70" fill="transparent" />
          <path d={chakana} fill="transparent" stroke={coreHov ? t.accent : lineCol} strokeWidth="1" strokeLinejoin="miter" style={{ transition: "stroke .3s ease" }} />
          <circle cx={C} cy={C} r="5" fill={coreHov ? t.accent : lineCol} style={{ transition: "fill .3s ease" }} />
        </g>
      </svg>
      {edit && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 14 }}>
          {MANDALA_ASPECTS.map((a) => (
            <span key={a.key} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <button onClick={() => startPick(a.key)} style={{ background: "transparent", border: `1px solid transparent`, borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: t.inkSand, fontFamily: FONT_BODY, fontSize: 12 }}>{L(a.cz, a.en)}{(mand[a.key] || {}).art ? " ↺" : " ＋"}</button>
              {(mand[a.key] || {}).art && <button onClick={() => resetArt(a.key)} title={L("Výchozí", "Default")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 13 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>}
            </span>
          ))}
          {MANDALA_ASPECTS.some((a) => (mand[a.key] || {}).art) && <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, fontStyle: "italic", width: "100%", textAlign: "center", marginTop: 2 }}>{L("Vlastní obrázek posuneš tažením přímo v kole.", "Drag a custom image directly in the wheel to reposition it.")}</span>}
        </div>
      )}
    </div>
  );
}

// Závoj · the world falls into shadow; only the aspect's images remain.
// One click anywhere goes deeper into the hall; × or Escape returns.
const AspectImageAdd = createAspectImageUI({ useStore, L, resizeImageToBlob, r2Put, uid });
function TmGalVeil({ aspKey, onClose, onDeeper }) {
  const { t } = useT();
  const st = useStore();
  const asp = MANDALA_ASPECTS.find((a) => a.key === aspKey);
  const imgs = ((st.coll.mandala || {})[aspKey] || {}).imgs || [];
  const col = MANDALA_HUE(t, asp.hue);
  const [out, setOut] = useState(false);
  const leave = (fn) => { setOut(true); setTimeout(fn, 400); };
  React.useEffect(() => {
    const odhlas = tmEscVrstva(() => leave(onClose));
    tmZamkniStranku();
    return () => { odhlas(); tmOdemkniStranku(); };
  }, []);
  return createPortal(
    <div onClick={() => leave(onDeeper)} className={"tm-veil" + (out ? " tm-veil-out" : "")} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(28,28,26,0.95)", overflowY: "auto", cursor: "pointer", WebkitBackdropFilter: "blur(4px)", backdropFilter: "blur(4px)" }}>
      <button onClick={(e) => { e.stopPropagation(); leave(onClose); }} title={L("Zpět na mandalu", "Back to the mandala")} style={{ position: "fixed", top: 18, right: 20, zIndex: 2, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(244,240,235,0.25)", background: "rgba(28,28,26,0.42)", color: BRAND.linen, cursor: "pointer", fontSize: 17, lineHeight: 1 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "54px 22px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.34em", fontSize: 12, color: col }}>{L(asp.cz, asp.en)} · {asp.dir}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 22, color: BRAND.linen, marginTop: 7 }}>{L(asp.subCz, asp.subEn)}</div>
        </div>
        {imgs.length === 0 ? (
          <div className="tm-veil-img" style={{ textAlign: "center", fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: "rgba(244,240,235,0.75)", maxWidth: 460, margin: "60px auto", lineHeight: 1.7 }}>{L(asp.promptCz, asp.promptEn)}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
            {imgs.map((im, i) => (
              <div key={im.id} className="tm-veil-img" style={{ position: "relative", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 44px -16px rgba(0,0,0,0.75)", animationDelay: `${Math.min(i * 55, 500)}ms`, transform: i % 3 === 1 ? "translateY(14px)" : "none" }}>
                <img src={imgSrc(im)} alt="" style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", display: "block" }} />
                {st.editMode && <button onClick={(e) => { e.stopPropagation(); st.ask(L("Odebrat obrázek z mandaly?", "Remove image from the mandala?"), () => { if (im.r2id) r2Del(im.r2id); const data = (st.coll.mandala || {})[aspKey] || {}; st.setMandala({ [aspKey]: { ...data, imgs: (data.imgs || []).filter((x) => x.id !== im.id) } }); }); }} style={{ position: "absolute", top: 7, right: 7, width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(28,28,26,0.64)", color: BRAND.linen, cursor: "pointer", fontSize: 13, lineHeight: 1 }}><FamilyIcon id="close" size={16} label={L("Zavřít","Close")} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>}
              </div>
            ))}
          </div>
        )}
        <AspectImageAdd aspKey={aspKey} />
        <div className="tm-veil-img" style={{ textAlign: "center", marginTop: 42, animationDelay: "600ms", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.24em", fontSize: 12, color: "rgba(244,240,235,0.55)" }}>{L("klikni a vstup do aspektu ›", "click to enter the aspect ›")}</div>
      </div>
    </div>,
    document.body
  );
}

// Síň aspektu · the study hall: Wild Mind material and the gallery workbench.
function TmAspectStudy({ aspKey, onBack }) {
  const { t } = useT();
  const st = useStore();
  const isCore = aspKey === "center";
  const asp = isCore ? null : MANDALA_ASPECTS.find((a) => a.key === aspKey);
  const col = isCore ? t.accent : MANDALA_HUE(t, asp.hue);
  const sections = MANDALA_CONTEXT[aspKey] || [];
  const data = isCore ? null : ((st.coll.mandala || {})[aspKey] || { note: "", imgs: [] });
  const imgs = data ? (data.imgs || []) : [];
  const [busy, setBusy] = useState(false);
  const addImages = async (fileList) => {
    setBusy(true);
    const added = [];
    for (const f of Array.from(fileList || [])) {
      if (!(f.type || "").startsWith("image/")) continue;
      try {
        const id = uid() + "m";
        const blob = await resizeImageToBlob(f, 900);
        await r2Put(id, blob, f.name);
        added.push({ id, r2id: id });
      } catch (e) {}
    }
    if (added.length) st.setMandala({ [aspKey]: { ...data, imgs: [...imgs, ...added] } });
    setBusy(false);
  };
  const delImg = (id) => st.ask(L("Odebrat obrázek z mandaly?", "Remove image from the mandala?"), () => {
    const im = imgs.find((x) => x.id === id);
    if (im && im.r2id) r2Del(im.r2id);
    st.setMandala({ [aspKey]: { ...data, imgs: imgs.filter((x) => x.id !== id) } });
  });
  return (
    <div className="tm-view" style={{ maxWidth: 720, margin: "0 auto", animation: "tmfade .45s ease-out" }}>
      <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 13, padding: "0 0 12px" }}><FamilyIcon id="back" size={12} label={L("Zpět","Back")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Mandala", "Mandala")}</button>
      {isCore ? (
        <div style={{ margin: "6px 0 18px" }}>
          <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.3em", fontSize: 12, color: col }}>{L("střed", "center")}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: t.heading, marginTop: 5 }}>{L("Celistvé Self", "The whole Self")}</div>
        </div>
      ) : (
        /* Práh aspektu · plné pole domu s tichou stopou své světové strany.
           Dřív tu ležela přibalená fotografie a přes ni ztmavovací přechod,
           aby na ní šel přečíst text. Ani jedno tu nemá co dělat. */
        <div className="tm-aspect-hero" style={{ position: "relative", borderRadius: 14, overflow: "hidden", height: 150, marginBottom: 18, background: t.hero, border: `1px solid ${t.borderSoft}` }}>
          <div style={{ position: "absolute", inset: 0, background: hexA(MANDALA_HUE(t, asp.hue), 0.14) }} />
          <div style={{ position: "absolute", left: 20, top: 18, width: 34, height: 1, background: t.heroLine }} />
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 16 }}>
            <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.3em", fontSize: 12, color: t.heroInkSoft }}>{L(asp.cz, asp.en)} · {asp.dir}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 28, color: t.heroInk, marginTop: 3 }}>{L(asp.subCz, asp.subEn)}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.heroInkSoft, marginTop: 2 }}>{L(asp.glyphCz, asp.glyphEn)}</div>
          </div>
        </div>
      )}
      {sections.map((sec, i) => (
        <Toggle key={i} summary={L(sec.tCz, sec.tEn)} color="orange" open={i === 0}>
          {sec.body.map((b, j) => (
            b.pCz != null
              ? <p key={j} style={{ margin: "0 0 10px", lineHeight: 1.75 }}>{L(b.pCz, b.pEn)}</p>
              : <ul key={j} style={{ margin: "0 0 10px", paddingLeft: 20, lineHeight: 1.75 }}>{(L(b.ulCz, b.ulEn) || []).map((li, k) => <li key={k} style={{ marginBottom: 3 }}>{li}</li>)}</ul>
          ))}
        </Toggle>
      ))}
      {isCore && <div style={{ marginTop: 18 }}><MalaCounter /></div>}
      {!isCore && (
        <div style={{ marginTop: 22 }}>
          <Eyebrow>{L("Galerie aspektu", "The aspect's gallery")}</Eyebrow>
          <textarea value={data.note || ""} onChange={(e) => st.setMandala({ [aspKey]: { ...data, note: e.target.value } })} placeholder={L("Alter ega, kvality, mýty, na které se ladím…", "Alter egos, qualities, myths I tune into…")} rows={2} style={{ width: "100%", background: t.sheet, border: `1px solid ${t.borderSoft}`, borderRadius: 8, color: t.text, fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.6, padding: "10px 12px", outline: "none", resize: "vertical", margin: "10px 0 14px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {imgs.map((im) => (
              <div key={im.id} className="tm-mand-card" style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${t.borderSoft}`, background: t.card, boxShadow: t.shadow }}>
                <img src={imgSrc(im)} alt="" style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", display: "block" }} />
                {st.editMode && <button onClick={() => delImg(im.id)} title={L("Odebrat", "Remove")} style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(28,28,26,0.58)", color: BRAND.linen, cursor: "pointer", fontSize: 13, lineHeight: 1 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>}
              </div>
            ))}
            <label className="tm-mand-add" style={{ borderRadius: 10, border: `1px solid transparent`, background: "transparent", cursor: busy ? "default" : "pointer", aspectRatio: "3 / 4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: t.textMuted, transition: "border-color .2s ease, color .2s ease" }}>
              <span style={{ fontSize: 22, color: col }}>{busy ? "·" : <FamilyIcon id="add" size={16} label={L("Přidat","Add")} style={{ display: "inline-block", verticalAlign: "middle" }} />}</span>
              <span style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12 }}>{busy ? L("nahrávám", "uploading") : L("obraz", "image")}</span>
              <input type="file" accept="image/*" multiple onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} style={{ display: "none" }} disabled={busy} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// Recitation counts remain private to the current account.

function MalaCounter({ onBack }) {
  const { t } = useT();
  const st = useStore();
  const list = st.malaList();
  const [name, setName] = useState("");
  const total = list.reduce((s, m) => s + (m.count || 0), 0);
  const addD = () => { const v = name.trim(); if (!v) return; st.malaAddDeity(v); setName(""); };
  return (
    <div className="tm-view" style={{ maxWidth: 620, margin: "0 auto" }}>
      {onBack && <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 13, padding: "0 0 8px" }}><FamilyIcon id="back" size={12} label={L("Zpět","Back")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Mandala", "Mandala")}</button>}
      <div style={{ textAlign: "center", margin: "10px 0 22px" }}>
        <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.34em", fontSize: 12, color: t.sage }}>{L("recitace", "recitation")}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: t.heading, marginTop: 6 }}>{L("Malá", "Mala")}</div>
        <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 4 }}>{L("Jedno ťuknutí · jedna dokončená malá (108).", "One tap · one completed mala (108).")}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((m) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: 12, padding: "14px 16px", boxShadow: t.shadow }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: t.heading, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{m.count || 0} {L("malá", "malas")} · {(m.count || 0) * 108} {L("recitací", "recitations")}</div>
            </div>
            <button onClick={() => st.malaAdd(m.id, -1)} title={L("Opravit −1", "Correct −1")} style={{ ...iconBtn(t), width: 30, height: 30, fontSize: 15, border: "none", color: t.textMuted }}>−</button>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: t.heading, minWidth: 38, textAlign: "center" }}>{m.count || 0}</span>
            <button onClick={() => st.malaAdd(m.id, 1)} title={L("Přidat malá", "Add a mala")} style={{ width: 46, height: 46, border: "none", background: "transparent", color: t.accentInk || t.accent, cursor: "pointer", fontSize: 22, lineHeight: 1, flexShrink: 0 }}><FamilyIcon id="add" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
            {st.editMode && <button onClick={() => st.ask(L(`Odebrat ${m.name}?`, `Remove ${m.name}?`), () => st.malaRemoveDeity(m.id))} style={{ ...iconBtn(t), border: "none", color: t.textMuted }}><FamilyIcon id="close" size={16} label={L("Zavřít","Close")} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addD(); }} placeholder={L("Přidat božstvo…", "Add a deity…")} style={{ ...fieldStyle(t), flex: 1 }} />
        {name.trim() && <button onClick={addD} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13 }}>{L("Přidat", "Add")}</button>}
      </div>
      {total > 0 && <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, textAlign: "center", marginTop: 16 }}>{L("Celkem", "Total")}: {total} {L("malá", "malas")} · {total * 108} {L("recitací", "recitations")}</div>}
    </div>
  );
}
function PageMandala({ go }) {
  const { t } = useT();
  const [stage, setStage] = useState({ v: "wheel" }); // wheel | gal | study | mala
  useGuideAction("mandala", () => setStage({ v: "wheel" }));
  if (stage.v === "study") return <TmAspectStudy aspKey={stage.k} onBack={() => setStage({ v: "wheel" })} />;
  return (
    <div className="tm-view" style={{ maxWidth: 760, margin: "0 auto" }}>
      <button onClick={() => go("praxe")} className="tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 13, padding: "8px 0", minHeight: 34 }}><FamilyIcon id="back" size={12} label={L("Zpět","Back")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Praxe", "Practice")}</button>
      <div style={{ textAlign: "center", margin: "10px 0 20px" }}>
        <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.34em", fontSize: 12, color: t.sage }}>{L("osobní mandala", "personal mandala")}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: t.heading, marginTop: 6 }}>{L("Aspekty Já", "Aspects of the self")}</div>
        <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 4 }}>{L("podle mapy Wild Mind Billa Plotkina", "after Bill Plotkin's Wild Mind map")}</div>
      </div>
      <div style={{ animation: "tmsettle .4s ease-out" }}>
        <TmMandalaWheel onPick={(k) => setStage({ v: "gal", k })} onCore={() => setStage({ v: "study", k: "center" })} />
      </div>
      {stage.v === "gal" && <TmGalVeil aspKey={stage.k} onClose={() => setStage({ v: "wheel" })} onDeeper={() => setStage({ v: "study", k: stage.k })} />}
    </div>
  );
}


return { PageMandala };
}
