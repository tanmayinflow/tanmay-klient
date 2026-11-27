import React, { useState } from "react";
import { createPortal } from "react-dom";
import { TmIcon as FamilyIcon } from "./icons.jsx";
import { uploadAspectImages, useAspectImageReorder } from "./aspectImages.jsx";
import { movedAspectImageOrder, orderedAspectImages } from "./aspectImageOrder.js";
import { useAspectBoard, BoardThumbnail, BoardLightbox } from "./aspectBoard.jsx";
import "./aspectGallery.css";
import { AspectDisclosure, AspectStudyHeader } from "./aspectStudy.jsx";
import { MandalaPracticeGuide } from "./mandalaPracticeGuide.jsx";
import { LANDSCAPE_DIRECTION_INKS } from "./landscape.js";
import { FONT_BODY, FONT_TAG, FONT_DISPLAY_EN as FONT_DISPLAY } from "./type.js";
import { createPracticeFiguresUI } from "./practiceFigures.jsx";
import { useVrstva } from "./overlay.jsx";
import { useGuideAction } from "./guideNavigation.jsx";

// Shared visual and study content; all images, notes and counts use role-local storage.
export function createMandalaUI({ useT, useStore, L, uid, resizeImageToBlob, r2Put, r2Del, imgSrc, Eyebrow, BRAND }) {
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
    cz: "Jih", en: "South", subCz: "Divoký domorodec", subEn: "Wild Indigenous One",
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
      { pCz: "Když se na cestě ztratí dítě, někdo ho vyslechne, zapne mu bundu a pomůže mu najít rodiče. Plotkinův Sever spojuje vnímavost k druhému s dovedností udělat, co je zapotřebí. Patří sem i schopnost něco vypěstovat, naučit nebo postavit tak, aby to dál sloužilo druhým. V mapě Severu odpovídá zima a půlnoc.", pEn: "A child gets lost on a walk. Someone listens, fastens their coat and helps them find their parent. Plotkin's North brings sensitivity together with the practical skill to see a task through. It can also grow, teach or build something that others can draw on long afterwards. Winter and midnight correspond to the North in this map." },
      { pCz: "Zkus si vybavit člověka, od něhož ses něco důležitého naučil. Co udělal ve chvíli, kdy na tebe čekal nejtěžší krok? Právě ten detail může napovědět, jak chceš svou péči dávat dál.", pEn: "Remember someone who helped you learn something that mattered. What did they do just as you faced the hardest step? That detail might tell you what kind of care you want to pass on." },
    ]},
    { tCz: "Formy praxe pro Sever", tEn: "Practices for the North", body: [{ practiceGuide: true }] },
    { tCz: "Jak poznává Sever", tEn: "How North knows", body: [
      { pCz: "Severním způsobem poznávání je u Plotkina myšlení vedené srdcem. Představ si, že rozděluješ jídlo po společné práci. Spočítáš porce a zároveň si všimneš člověka, který se ostýchá přijít ke stolu. Rozum ti pomůže uskutečnit to, na čem ti záleží.", pEn: "Plotkin describes the northern way of knowing as thinking guided by the heart. Imagine handing out food after a shared job. You count the portions and also notice someone hovering shyly at the edge of the table. Reason helps you act on what you care about." },
      { pCz: "Jako pečující člověk reaguješ na dnešní potřebu. Jako tvůrce můžeš navrhnout něco, co ponese užitek dlouho po tvém odchodu. Třeba ponoukneš celou skupinu, aby příště počítala s místem pro nově příchozího.", pEn: "As a caregiver you respond to a need today. As a generative adult you can design something that serves long after you leave. You might help the group make a habit of setting an extra place for a newcomer." },
    ]},
    { tCz: "Věrní vojáci, zachránci a pseudoválečníci", tEn: "Loyal Soldiers, Rescuers, and Pseudo-Warriors", body: [
      { pCz: "Věrný voják je Plotkinovo označení pro naučený způsob ochrany. Vnitřní kritik může předvídat posměch a každou novou věc raději zavrhnout předem. Jiný hlas může naopak tvrdit, že už všechno víš, aby tě uchránil před rozpaky z učení. Ten, kdo všechno zařizuje za druhé, může doufat, že tak zůstane potřebný.", pEn: "A Loyal Soldier is Plotkin's name for a learned way of seeking protection. An inner critic might anticipate ridicule and dismiss every new idea in advance. Another voice might insist you already know everything to spare you the embarrassment of learning. A habitual rescuer may hope to stay indispensable by taking over." },
      { pCz: "V reálné situaci se zeptej, před čím tě daná věta chrání a jakou cenu za poslušnost platíš. Zvenčí může tvoje přebírání práce vypadat jako velkorysost. Zeptej se také druhého, jak je prožívá on.", pEn: "In a particular situation, ask what that familiar sentence protects you from and what obedience costs. Taking over can look generous from the outside. Ask the other person how it feels to them." },
      { pCz: "Tato ochrana může působit dvěma směry. Dovnitř mluví kritik, lichotník nebo hlas, který krotí tvou živost. Mezi lidmi můžeš hledat jistotu jako zachránce, který za druhé všechno vyřeší, nebo jako pseudoválečník, který prosazuje svou silou. U téže osoby se mohou tyto strategie střídat.", pEn: "This protection can take an inward or an outward form. Inwardly you may hear a critic, a flatterer, or a voice that tames your vitality. With other people you may seek security as a Rescuer who takes over or as a Pseudo-Warrior who imposes their will. One person can move between these strategies." },
    ]},
    { tCz: "Rozpoznat péči v běžném dni", tEn: "Recognize care in everyday life", body: [
      { ulCz: ["Někdo odmítne tvou pomoc. Dokážeš být dál v kontaktu a respektovat jeho rozhodnutí?", "Učedník něco pokazí. Dokážeš jeho chybu pojmenovat a nechat mu nástroj v ruce?", "Došly ti síly. Umíš požádat o pomoc stejně přímo, jako ji umíš nabídnout?"], ulEn: ["Someone declines your help. Can you stay in contact and respect their decision?", "An apprentice makes a mistake. Can you name it and leave the tool in their hands?", "You are stretched thin. Can you ask for help as directly as you offer it?"] },
    ]},
    { tCz: "Sever v celém kruhu", tEn: "North in the whole circle", body: [
      { pCz: "Při práci s věrnými vojáky se můžeš opřít o protější Jih. Voják se může bát, že tě ostatní vyloučí. Jih připomíná tělesnou zkušenost sounáležitosti s živým světem. Sever k ní může přidat konkrétní lidskou oporu. Některé ztráty si zaslouží odtruchlit ještě předtím, než se rozhodneš, jak dál.", pEn: "When working with a Loyal Soldier you can draw on South, across the circle. A soldier may fear that others will cast you out. South recalls the felt experience of belonging to the living world. North can bring a particular human connection alongside it. Some losses deserve time for grief before you decide what comes next." },
      { pCz: "Sever umí naslouchat i ostatním stranám. Pocit smutku z Jihu může upozornit, co někdo ztratil. Východ může položit otázku, která všem unikla. Západ může nabídnout obraz, pro který zatím nebyla slova. Na Severu můžeš z těhle podnětů udělat včasnou nabídku pomoci.", pEn: "North can listen to the other directions. Grief in the South may bring someone's loss to notice. East may ask a question everyone missed. West may supply an image for something that has been hard to put into words. North can turn what it hears into a timely offer of help." },
    ]},
  ],
  east: [
    { tCz: "Esence · Nevinný mudrc", tEn: "Essence · The Innocent/Sage", body: [
      { pCz: "Návštěvník města se zeptá, proč se dva sousedé zdraví jen přes plot. Místní si toho už dávno přestali všímat. Podobně pracuje Plotkinův Východ. Nevinnost dovolí podívat se na věc čerstvýma očima. Mudrc ji zasadí do širších souvislostí. V krajině tomu odpovídá první světlo a jaro.", pEn: "A visitor asks why two neighbors only ever greet each other across a fence. The locals stopped noticing long ago. Plotkin's East works something like this. Innocence lets you see something freshly. The Sage sees it against a wider horizon. In the landscape the associations are first light and spring." },
      { pCz: "Šibal a Posvátný blázen jsou u Plotkina dvě další podoby Východu. Dovedou narušit vážnost, s níž skupina přijímá své zvyky. Zda vtip dodá rozhovoru prostor, můžeš poznat podle toho, kdo po něm dostane slovo.", pEn: "The Trickster and Sacred Fool are two other Eastern figures in Plotkin's account. They can interrupt the solemnity with which a group observes its customs. One clue to whether a joke opened a conversation is who gets to speak next." },
    ]},
    { tCz: "Formy praxe pro Východ", tEn: "Practices for the East", body: [{ practiceGuide: true }] },
    { tCz: "Jak poznává Východ", tEn: "How East knows", body: [
      { pCz: "Na Východě se podle Plotkina poznává především smysly při plné pozornosti. Na zastávce můžeš nejdřív slyšet tři různé ptačí hlasy a až potom si uvědomit, že vůbec nevíš, komu patří. Tato bdělost dává Nevinnému možnost žasnout a Mudrci dost prostoru připustit, co ještě neví.", pEn: "Plotkin places fully attentive sensing in the East. At a bus stop you might hear three distinct bird calls before realizing you have no idea which birds made them. This alertness gives the Innocent room to wonder and the Sage room to acknowledge what remains unknown." },
      { pCz: "Soucit Východu dovede zahrnout širší celek, třeba i člověka na opačné straně sporu. Mezi další možnosti kultivace Plotkin počítá pozorování přírody, hru s malým dítětem podle jeho pravidel, klaunství, pantomimu a tradice rozjímání či pohybové meditace.", pEn: "Eastern compassion can encompass a wider whole, including someone on the far side of a disagreement. Plotkin also suggests learning from attentive observation of nature, playing on a small child's terms, clowning, mime, and traditions of contemplation or moving meditation." },
    ]},
    { tCz: "Subosobnosti Východu a vyhýbání", tEn: "Eastern subpersonalities and evasion", body: [
      { pCz: "K ochranným hlasům Východu Plotkin řadí ty, které hledají úlevu v odchodu od přítomnosti. V jeho mapě sem patří i člověk, který mluví o duchovním nadhledu pokaždé, když přijde na řadu nepříjemný slib. Při zkoumání stačí pozorovat jednu vlastní situaci, například co se stalo minutu před tím, než jsi změnil téma.", pEn: "Plotkin locates voices that seek relief by leaving the present in the East. His examples include turning repeatedly to spiritual detachment when an inconvenient promise comes up. To explore the pattern, observe one ordinary situation of your own, such as what happened just before you changed the subject." },
      { pCz: "Plotkin k únikovým vzorcům řadí i závislost. Jako příklad z mezilidských vztahů uvádí člověka, který se před bolestí druhých uchyluje do blaženosti, nebo věčného mladíka či dívku, kteří pokaždé vyklouznou ze závazku. Při sebepoznávání má smysl sledovat, co se opakuje a jak to ovlivňuje tvůj život.", pEn: "Plotkin includes addiction among patterns of escape. In relationships he describes someone who retreats into bliss in the face of another person’s pain, or the perpetual boy or girl who slips away from every commitment. When exploring your own experience, look at what recurs and how it affects your life." },
      { pCz: "Zkus si vybavit rozhovor, který odkládáš. Co ti odklad v tu chvíli přinesl a co tě dnes stojí? Možná za úlevou rozeznáš přání, aby tě druhý vyslechl. Koho můžeš požádat o oporu a jak můžeš rozhovor znovu otevřít?", pEn: "Think of a conversation you have been putting off. What relief did the delay offer then, and what is it costing you now? Underneath the relief you might recognize a wish to be heard. Who could support you, and how might you reopen the conversation?" },
    ]},
    { tCz: "Rozpoznat nadhled v běžném dni", tEn: "Recognize perspective in everyday life", body: [
      { ulCz: ["Při poradě se zasmějete. Vrátí se skupina k původní těžkosti s větší lehkostí?", "Máš na věc hotový názor. Který skutečný detail by tě ještě mohl překvapit?", "Při tichém sezení ses uklidnil. Co teď můžeš slyšet od člověka, který s tebou nesouhlasí?"], ulEn: ["A meeting breaks into laughter. Does the group return to its difficulty with a little more ease?", "Your opinion is settled. Which observable detail could still surprise you?", "Sitting quietly has helped you settle. What can you now hear from the person who disagrees with you?"] },
    ]},
    { tCz: "Východ v celém kruhu", tEn: "East in the whole circle", body: [
      { pCz: "Na opačné straně kruhu pracuje Západ s konkrétním snem nebo obrazem. Východ dovede na okamžik pustit oblíbený výklad a všimnout si, co má právě před sebou. V témže rozhovoru tak může mít místo obraz, kterému nerozumíš, i obyčejná otázka, co se skutečně stalo.", pEn: "Across the circle, the West can stay with a particular dream or image. East can put down a favorite explanation long enough to notice what is present. A single conversation can have room for an image you do not understand and a plain question about what actually happened." },
    ]},
  ],
  south: [
    { tCz: "Esence · Divoký domorodec", tEn: "Essence · Wild Indigenous One", body: [
      { pCz: "Na Jihu si můžeš všimnout, jak se tě svět dotýká dřív, než o něm začneš přemýšlet. Vůně deště tě vytáhne ke dveřím. Při pohledu na prázdné ptačí hnízdo tě píchne smutek. V Plotkinově mapě patří k Jihu poledne a léto. Slovo „domorodý“ tu pojmenovává lidskou zkušenost příslušnosti k živému světu. Příslušnost ke konkrétnímu původnímu národu má vlastní historii a význam.", pEn: "In the South you can notice the world reaching you before you have thought it through. The smell of rain draws you to the door. An empty bird’s nest brings a sudden pang. Plotkin associates South with midday and summer. Here, “indigenous” names a human capacity to feel at home among other living beings. Belonging to a particular Indigenous nation has its own history and meaning." },
      { ulCz: ["Vjem. Co v tuto chvíli doslova cítíš na kůži nebo slyšíš?", "Emoce. Co se v tobě ozvalo a na čem ti záleží?", "Erós a hravost. Co tě přitahuje, těší nebo vybízí k pohybu?", "Příbuzenství. Kdo další tady žije a jak s ním sdílíš místo?"], ulEn: ["Sensation. What can you actually feel on your skin or hear right now?", "Feeling. What moved you, and what matters to you?", "Eros and play. What draws you closer, delights you, or sets you moving?", "Kinship. Who else lives here, and how do you share this place?"] },
    ]},
    { tCz: "Formy praxe pro Jih", tEn: "Practices for the South", body: [{ practiceGuide: true }] },
    { tCz: "Subosobnosti · Zraněné děti", tEn: "Subpersonalities · Wounded Children", body: [
      { pCz: "Plotkin odlišuje vnitřní zraněné dítě od způsobů, jimiž se snažíme udržet vztah. Říká jim role sirotka. Někdo se přizpůsobí za každou cenu, jiný čeká na záchranu, vzbouří se nebo požaduje výsadní zacházení. Stejný člověk může v různých situacích přecházet mezi několika rolemi.", pEn: "Plotkin distinguishes the inner Wounded Child from ways of trying to hold on to a relationship. He calls these Orphan roles. His four examples are the Conformist, Victim, Rebel, and Prince or Princess. A person might seek acceptance, wait to be rescued, defy the group, or demand special treatment in different situations." },
      { pCz: "Představ si obyčejný okamžik, kdy pro tebe u stolu nikdo neudělá místo. Sotva vejdeš do dveří, můžeš pocítit starou obavu, že jsi na obtíž. Jak by ta chvíle vypadala očima dospělého, který tvoji obavu slyší?", pEn: "Picture arriving at a table where nobody makes room for you. You have barely walked in, yet an old fear of being a nuisance can surface. What might this moment look like to an adult who hears that fear?" },
      { ulCz: ["Co se teď opravdu stalo? Možná jsi přišel pozdě a všechny židle už byly obsazené.", "Co tomu chvíle přidala v tvém prožitku? Třeba pocit „zase se se mnou nepočítá“.", "Co bys od druhých potřeboval teď? Můžeš se zeptat, zda by se někdo neposunul."], ulEn: ["What actually happened? Perhaps you arrived late and all the chairs were taken.", "What did that moment bring up? Perhaps a familiar feeling of being left out again.", "What do you need from others now? You might ask someone to make room."] },
    ]},
    { tCz: "Jak poznat hlas Jihu", tEn: "Recognising the voice of South", body: [
      { pCz: "Kamarád odřekne společný večer. Můžeš pocítit sevření v břiše a říct mu, že ses na něj těšil. Může se také ozvat obava, že se s tebou už nechce vídat. Zkus ty dvě věty vyslovit zvlášť. Co víš o svém pocitu a na co se potřebuješ zeptat jeho?", pEn: "A friend cancels an evening together. Your stomach tightens and you tell them you were looking forward to it. A fear that they no longer want to see you might surface too. Try saying the two things separately. What do you know about your own feeling, and what would you have to ask your friend?" },
    ]},
    { tCz: "Jak odpovědět zraněnému dítěti", tEn: "Responding to a Wounded Child", body: [
      { pCz: "Při práci s mladší částí doporučuje Plotkin přizvat ze Severu pečujícího dospělého. Můžeš dát oběma hlasům místo na papíře. První řádek nech části, která se bojí. Na druhý napiš odpověď dospělého, který slyšel přesně to, co řekla. Nakonec se vrať k tomu, co se děje kolem tebe a co můžeš ovlivnit dnes.", pEn: "When meeting a younger part, Plotkin particularly invites the Nurturing Adult from the North. You can give both voices a place on paper. Leave the first line to the part that feels afraid. On the second line write back as an adult who heard exactly what it said. End by noticing what is happening around you and what you can influence today." },
    ]},
    { tCz: "Místo Jihu v celku", tEn: "South in the whole map", body: [
      { pCz: "Když tě zasáhne, že na sídlišti zmizel starý strom, Jih ti dovolí pocítit ztrátu. Sever pak může zjistit, kdo se o výsadbu stará. První zkušenost dává druhému kroku osobní důvod. Ke stejné situaci může Západ přinést obraz a Východ otázku, která rozšíří tvůj pohled.", pEn: "When an old tree disappears from your street, South lets you feel the loss. North can find out who looks after the planting. The feeling gives the practical step a personal reason. West might bring an image to the same event, and East a question that widens your view." },
    ]},
  ],
  west: [
    { tCz: "Esence · Múza a Milovaný", tEn: "Essence · Muse-Beloved", body: [
      { pCz: "Někdy ti obraz zůstane v hlavě ještě dlouho poté, co se rozplyne zbytek snu. Plotkin takovou obraznost spojuje se Západem, soumrakem a podzimem. Jako Múza dává tato stránka člověka tvar něčemu, co ještě nedokázal vyslovit. Jako vnitřní Milovaný ho přitahuje k vlastnostem, které v sobě teprve objevuje.", pEn: "Sometimes an image stays with you long after the rest of a dream has gone. Plotkin links this kind of imagination to the West, dusk, and autumn. As Muse, this facet gives form to something you have yet to put into words. As Inner Beloved, it draws you toward qualities you are still discovering in yourself." },
      { ulCz: ["Sen. Který detail přetrval až do rána?", "Touha. Co tě přitahuje, i když zatím nevíš proč?", "Tvorba. V jaké podobě se chce nápad objevit ve světě?", "Pomíjivost. Co se právě uzavírá a jaký obraz to v tobě vyvolává?"], ulEn: ["Dream. Which detail lasted into morning?", "Longing. What draws you before you know why?", "Creativity. What form might let an idea enter the world?", "Impermanence. What is ending, and what image does that bring to mind?"] },
    ]},
    { tCz: "Formy praxe pro Západ", tEn: "Practices for the West", body: [{ practiceGuide: true }] },
    { tCz: "Subosobnosti · Stín a stínová já", tEn: "Subpersonalities · Shadow and shadow selves", body: [
      { pCz: "Když člověk poprvé připustí, že si dovede stát za svým, objevuje třeba část svého zlatého stínu. Může také zjistit, že občas dobírá druhé, ačkoli se pokládá za ohleduplného. Plotkin obě možnosti sleduje ve snech, opakovaných vztazích i zpětné vazbě lidí, kteří nás znají.", pEn: "Someone discovering their own capacity to stand firm may be meeting part of their golden Shadow. They might also notice that they mock others sometimes, despite seeing themselves as considerate. Plotkin looks for clues to both possibilities in dreams, recurring relationships, and observations from people who know us." },
      { pCz: "Stín v Plotkinově mapě zahrnuje to, co o sobě obtížně vidíme. Může v něm být závist i odvaha, kterou přisuzujeme výhradně druhým. Obdiv nebo odpor nabízí důvod podívat se blíž. O tom, co za reakcí je, rozhoduje až konkrétní zkušenost.", pEn: "On Plotkin’s map the Shadow holds what is difficult to recognise in ourselves. That can include envy or a courage we attribute entirely to other people. Admiration or aversion gives us a reason to look closer. What lies behind the reaction is a question to explore in a particular situation." },
      { pCz: "Když tě uchvátí, jak někdo bez zaváhání zpívá před lidmi, může jít zároveň o radost z jeho hlasu a o tvoji vlastní chuť zpívat. Když tě někdo skutečně shodí, můžeš pojmenovat jeho jednání a chránit si hranici.", pEn: "If someone sings easily in front of a crowd, your delight in their voice might sit alongside a wish of your own to sing. When someone actually belittles you, you can name what they did and protect your boundary." },
    ]},
    { tCz: "Jak poznat hlas Západu", tEn: "Recognising the voice of West", body: [
      { pCz: "Na otázku „Kam dál?“ může jako první přijít obraz přístavu za odlivu. Zkus u něj chvíli zůstat. Je v něm čekání na vodu, něco uvízlého na dně, nebo úleva, že je vidět na břeh? Vlastní asociace ukážou víc než slovníkové heslo o přístavech.", pEn: "In response to “Where next?” you might picture a harbour at low tide. Stay there a moment. Does it hold a wait for water, a boat stranded on the bottom, or relief at seeing the shore? Your own associations can tell you why this particular harbour has stayed with you." },
    ]},
    { tCz: "Jak zkoumat stín", tEn: "Exploring a possible shadow", body: [
      { pCz: "Když máš podezření na projekci, pozvi si podle Plotkina i východního Mudrce. Ten se může zeptat, co víš, co si domýšlíš a co by situaci vysvětlilo ještě jinak. Pak zkus najít jeden doklad ve vlastním jednání. Tím zůstane otázka otevřená a zároveň zakotvená ve skutečnosti.", pEn: "When you suspect a projection, Plotkin also invites the Innocent/Sage from the East. It can ask what you know, what you have inferred, and what else might explain the scene. Then look for one example from your own behaviour. This keeps the question open and grounded in what happened." },
    ]},
    { tCz: "Místo Západu v celku", tEn: "West in the whole map", body: [
      { pCz: "Západ přináší do středu obraz a s ním novou možnost. Východ pomůže podívat se na ni s odstupem. Jih pozná, co při tom cítíš, Sever dokáže udělat malý pokus ve skutečném světě. Třeba písnička ze snu tak postupně najde člověka, kterému ji můžeš zazpívat.", pEn: "West brings the center an image and a new possibility. East helps you see it in perspective. South notices what you feel and North can try something in the world. A song from a dream may eventually find someone you would like to sing it to." },
    ]},
  ],
  center: [
    { tCz: "Kdo stojí uprostřed", tEn: "Who stands in the center", body: [
      { pCz: "V Plotkinově mapě tvoří čtyři světové strany různé stránky jednoho Self. Uprostřed stojí ego, které říká „já“, vnímá, rozhoduje se a jedná. Když kupříkladu uvažuješ, zda přijmout další závazek, můžeš vyslechnout svou starost o druhé i vlastní únavu. Rozhodnutí uděláš ze středu.", pEn: "In Plotkin's map, the four directions are facets of one Self. The ego stands in the center. It says “I,” perceives, decides and acts. When considering another commitment, you can hear both your care for others and your own tiredness. You make the decision from the center." },
      { pCz: "Když po chybě řekneš „všechno pokazím“, může ti to připadat jako úplný popis sebe samého. Tatáž situace z pohledu pečujícího dospělého může znít „tahle věc potřebuje opravit“. Mluvčí zůstává týž. Změnil se rozsah toho, co dokáže vnímat a udělat.", pEn: "After a mistake, “I ruin everything” can feel like a complete account of who you are. From the perspective of a caring adult, the same event might sound like “this needs repair.” The speaker is the same person. What changes is what they can see and do." },
    ]},
    { tCz: "Formy praxe pro Střed", tEn: "Practices for the Center", body: [{ practiceGuide: true }] },
    { tCz: "Co znamená trojrozměrné ego", tEn: "What makes the ego three-dimensional", body: [
      { pCz: "Čtyři směry tvoří vodorovnou rovinu mapy. Svislá osa přidává nahoře Ducha, sounáležitost se vším, a dole Duši, jedinečný způsob, jakým tento člověk patří do světa. Těmto slovům dává Plotkin vlastní význam. O trojrozměrném egu mluví tam, kde člověk v běžném životě čerpá ze vztahu k Self, Duši i Duchu.", pEn: "The four directions form the horizontal plane. On the vertical axis, Spirit above concerns belonging to the whole. Soul below concerns a person's particular way of belonging to the world. Plotkin uses these terms in a specific sense. His three-dimensional ego draws on a relationship with Self, Soul and Spirit in everyday life." },
    ]},
    { tCz: "Jak naslouchat ochranným hlasům", tEn: "How to listen to protective voices", body: [
      { pCz: "Podle Plotkina stojí za to zkoumat, před čím tě jednotlivé části chrání a co se pro tebe snaží uchovat. Když se po chybě ozve ostrý kritik, dej si chvíli na otázku, co si od té přísnosti slibuje. Pak vyzkoušej dostupné schopnosti z jiných míst kruhu. Při odpovědi můžeš potřebovat laskavost i pevnou hranici.", pEn: "Plotkin invites you to consider what different parts are trying to protect or preserve. When a sharp inner critic speaks after a mistake, ask what it hopes to accomplish by being so strict. Try the resources available elsewhere in the circle. An answer may call for both kindness and a firm boundary." },
      { pCz: "Plotkin používá slovo wholing pro rozvíjení čtyř schopností Self. Poznáš to třeba podle toho, že při rozhovoru s kritikem dokážeš zůstat zvědavý, všimnout si napětí a nabídnout přiměřenou opravu. Příště si můžeš všimnout jeho příchodu dřív.", pEn: "Plotkin calls the cultivation of the four facets wholing. You might notice its effect when you can stay curious about a critical voice, feel the tension and suggest a proportionate repair. Next time you might hear that voice sooner." },
    ]},
    { tCz: "Jak jeden směr předává práci dalšímu", tEn: "How one direction hands the work to the next", body: [
      { pCz: "Zkus sledovat jeden podnět kolem celého kruhu. Východ si všimne, co se děje. Jih tomu věnuje plnou smyslovou a citovou pozornost. Západ si představí, co dalšího by z toho mohlo vzniknout. Sever dá jedné možnosti podobu, která slouží životu. Východ se pak může podívat, co naše práce opravdu způsobila. Někdy se všechny čtyři schopnosti uplatní najednou.", pEn: "Try following one response around the circle. East notices what is happening. South gives it sensory and emotional attention. West imagines what else could grow from it. North gives one possibility a useful form. East can then look at the consequences of the work. At other times, all four capacities are active together." },
      { pCz: "Při procházce si třeba všimneš, že u lavičky celé léto chybí stín. Vnímáš rozpálené dřevo a záleží ti na lidech, kteří si tu chtějí odpočinout. Napadne tě osadit okolí a zeptáš se správce, co zde může růst. Příští léto se můžeš vrátit a zjistit, zda tam někdo opravdu usedá.", pEn: "On a walk you might notice a bench that gets no shade all summer. You feel the hot wood and care about people who need a rest. You imagine a planting and ask the gardener what would thrive there. Next summer you can come back and see whether anyone actually sits there." },
    ]},
    { tCz: "Přenést kruh do obyčejného dne", tEn: "Carry the circle into an ordinary day", body: [
      { ulCz: ["Ráno si vyber situaci, která dnes pravděpodobně nastane. Jakou schopnost v ní budeš potřebovat?", "Až situace přijde, všimni si, který hlas zareaguje první. Nech si čas na druhou odpověď.", "Večer si připomeň jeden přesný okamžik, kdy se ti výběr podařil. Co ti pomohlo? Vlastní odpověď si můžeš zapsat do Deníku."], ulEn: ["In the morning, choose a situation likely to come up today. Which capacity might it call for?", "When it arises, notice which voice responds first. Give a second response time to form.", "In the evening recall one precise moment when you were able to choose. What made that possible? You can record your own answer in the Journal."] },
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
  const latestStore = React.useRef(st);
  latestStore.current = st;
  const pendKey = React.useRef(null);
  const [artError, setArtError] = useState(false);
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
  const activateKey = (action) => (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (!e.repeat) action();
  };
  const openCenter = () => { setCoreHov(true); setTimeout(onCore, 360); };
  const pickArt = async (file) => {
    const key = pendKey.current; if (!file || !key) return;
    setArtError(false);
    try {
      const blob = await resizeImageToBlob(file, 900);
      const gid = uid() + "m";
      await r2Put(gid, blob, file.name);
      const data = latestStore.current.coll.mandala?.[key] || {};
      latestStore.current.setMandala({ [key]: { ...data, art: { r2id: gid }, ...(key !== "center" && !data.pos ? { pos: { x: 0.5, y: 0.5 } } : {}) } });
    } catch { setArtError(true); }
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
      <svg ref={svgRef} viewBox={`0 0 ${S} ${S}`} style={{ display: "block", width: "100%", maxWidth: 560, margin: "0 auto", touchAction: edit ? "none" : "auto" }} role="group" aria-label={L("Mandala aspektů Já", "Mandala of the aspects of self")}>
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
            <g key={asp.key} role="button" tabIndex={0} aria-label={L(asp.cz, asp.en) + " · " + L(asp.subCz, asp.subEn)}
              onKeyDown={activateKey(() => onPick(asp.key))} onFocus={() => setHk(asp.key)} onBlur={() => setHk(null)}
              onClick={clickQuad(asp.key)} onPointerDown={onDown(asp.key)} onMouseEnter={() => setHk(asp.key)} onMouseLeave={() => setHk(null)} style={{ cursor: edit && hasArt ? "grab" : "pointer" }}>
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
        <g data-guide="mandala.overview" role="button" tabIndex={0} aria-label={L("Střed mandaly", "Mandala center")}
          onKeyDown={activateKey(openCenter)} onFocus={() => setCoreHov(true)} onBlur={() => setCoreHov(false)}
          onClick={openCenter} onMouseEnter={() => setCoreHov(true)} onMouseLeave={() => setCoreHov(false)} style={{ cursor: "pointer" }}>
          <circle cx={C} cy={C} r="70" fill="transparent" />
          <path d={chakana} fill="transparent" stroke={coreHov ? t.accent : lineCol} strokeWidth="1" strokeLinejoin="miter" style={{ transition: "stroke .3s ease" }} />
          <circle cx={C} cy={C} r="5" fill={coreHov ? t.accent : lineCol} style={{ transition: "fill .3s ease" }} />
        </g>
      </svg>
      {artError && <p role="alert" style={{ color: t.textSec, textAlign: "center" }}>{L("Obrázek se nepodařilo uložit. Vyber ho znovu a zkus to ještě jednou.", "The image could not be saved. Choose it again to retry.")}</p>}
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
function useGallery(aspKey, st) {
  const board = useAspectBoard(aspKey);
  const [zoom, setZoom] = useState(null);
  const data = st.coll.mandala?.[aspKey] || {};
  const imgs = orderedAspectImages(data, board.entries);
  const latestStore = React.useRef(st);
  latestStore.current = st;
  const sort = useAspectImageReorder(imgs, (source, target) => {
    const store = latestStore.current;
    const current = store.coll.mandala?.[aspKey] || {};
    const imageOrder = movedAspectImageOrder(current.imageOrder, orderedAspectImages(current, board.entries), source, target);
    if (!imageOrder) return false;
    store.setMandala({ [aspKey]: { ...current, imageOrder } });
    return true;
  }, L);

  const remove = im => st.ask(L("Odebrat obrázek z mandaly?", "Remove image from the mandala?"), () => {
    const store = latestStore.current;
    const current = store.coll.mandala?.[aspKey] || {};
    const orderPatch = Array.isArray(current.imageOrder) ? { imageOrder: current.imageOrder.filter(id => id !== im.id) } : {};
    if (im.full) {
      const hiddenBoardImages = [...new Set([...(current.hiddenBoardImages || []), im.id])];
      store.setMandala({ [aspKey]: { ...current, ...orderPatch, hiddenBoardImages } });
    } else {
      store.setMandala({ [aspKey]: { ...current, ...orderPatch, imgs: (current.imgs || []).filter(x => x.id !== im.id) } });
      if (im.r2id) r2Del(im.r2id);
    }
  });
  const thumbnail = (im, index) => {
    const label = (sort.arranging ? L("Obrázek", "Image") : L("Zvětšit obrázek", "Enlarge image")) + " " + (index + 1);
    return <BoardThumbnail src={im.thumb || imgSrc(im)} label={label} selected={sort.arranging ? sort.picked === im.id : undefined}
      onOpen={() => sort.choose(im.id, () => setZoom({ src: im.full || imgSrc(im), label }))} />;
  };
  const lightbox = zoom && <BoardLightbox {...zoom} closeLabel={L("Zavřít obrázek", "Close image")} onClose={() => setZoom(null)} />;
  const retry = board.error && <button type="button" className="tm-text-btn" style={{ color: "inherit" }} onClick={e => { e.stopPropagation(); board.retry(); }}>{L("Načíst obrázky znovu", "Reload images")}</button>;
  return { imgs, remove, thumbnail, lightbox, retry, sort };
}

function TmGalVeil({ aspKey, onClose, onDeeper }) {
  const { t } = useT();
  const st = useStore();
  const asp = MANDALA_ASPECTS.find((a) => a.key === aspKey);
  const { imgs, remove, thumbnail, lightbox, retry, sort } = useGallery(aspKey, st);
  const col = MANDALA_HUE(t, asp.hue);
  const [out, setOut] = useState(false);
  const veilRef = React.useRef(null);
  const leave = (fn) => { setOut(true); setTimeout(fn, 400); };
  useVrstva({ close: () => leave(onClose), ref: veilRef, historie: false });
  return createPortal(
    <div ref={veilRef} role="dialog" aria-modal="true" aria-label={L(asp.cz, asp.en)} onClick={() => leave(onDeeper)} className={"tm-aspect-viewport tm-veil" + (out ? " tm-veil-out" : "")} style={{ zIndex: 300, background: "rgba(28,28,26,0.95)", cursor: "pointer", WebkitBackdropFilter: "blur(4px)", backdropFilter: "blur(4px)" }}>
      <button type="button" className="tm-aspect-close" aria-label={L("Zpět na mandalu", "Back to the mandala")} onClick={(e) => { e.stopPropagation(); leave(onClose); }}><FamilyIcon id="close" size={18} /></button>
      <div className="tm-aspect-preview-scroll"><div className="tm-aspect-preview">
        <div className="tm-aspect-preview-heading">
          <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.34em", fontSize: 12, color: col }}>{L(asp.cz, asp.en)} · {asp.dir}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 22, color: BRAND.linen, marginTop: 7 }}>{L(asp.subCz, asp.subEn)}</div>
        </div>
        {retry && <div style={{ textAlign: "center", color: BRAND.linen }}>{retry}</div>}
        <button type="button" className="tm-aspect-enter tm-veil-img" onClick={e => { e.stopPropagation(); leave(onDeeper); }} style={{ display: "block", minHeight: 44, border: 0, background: "transparent", cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.24em", fontSize: 12, color: BRAND.linen }}>{L("Vstoupit do aspektu", "Enter the aspect")}</button>
        {sort.feedback}
        {imgs.length === 0 ? (
          <div className="tm-veil-img" style={{ textAlign: "center", fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: "rgba(244,240,235,0.75)", maxWidth: 460, margin: "60px auto", lineHeight: 1.7 }}>{L(asp.promptCz, asp.promptEn)}</div>
        ) : (
          <div ref={sort.grid} className="tm-aspect-grid" onClick={e => e.stopPropagation()}>
            {imgs.map((im, i) => (
              <div key={im.id} {...sort.tileProps(im.id)} className="tm-veil-img" style={{ animationDelay: `${Math.min(i * 55, 500)}ms` }}>
                {thumbnail(im, i)}
                {st.editMode && <button aria-label={L("Odebrat obrázek", "Remove image")} onClick={e => { e.stopPropagation(); remove(im); }} style={{ position: "absolute", top: 7, right: 7, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(28,28,26,0.64)", color: BRAND.linen, cursor: "pointer" }}><FamilyIcon id="close" size={16} /></button>}
              </div>
            ))}
          </div>
        )}
        {lightbox}
      </div></div>
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
  const { imgs, remove, thumbnail, lightbox, retry, sort } = useGallery(aspKey, st);
  const [busy, setBusy] = useState(false);
  const [imageError, setImageError] = useState(false);
  const latestStore = React.useRef(st);
  latestStore.current = st;
  const addImages = async (fileList) => {
    if (!fileList?.length || busy) return;
    setBusy(true);
    setImageError(false);
    try {
      const {added, failed} = await uploadAspectImages(fileList, { resize: resizeImageToBlob, put: r2Put, uid });
      if (added.length) {
        const current = latestStore.current.coll.mandala?.[aspKey] || {};
        latestStore.current.setMandala({ [aspKey]: { ...current, imgs: [...(current.imgs || []), ...added] } });
      }
      setImageError(failed > 0);
    } finally { setBusy(false); }
  };
  return (
    <div className="tm-view tm-study" style={{ animation: "tmfade .45s ease-out" }}>
      <AspectStudyHeader aspect={asp} onBack={onBack} L={L} />
      {sections.map((sec, i) => (
        <AspectDisclosure key={aspKey + i} title={L(sec.tCz, sec.tEn)}>
          {sec.body.map((b, j) => {
            if (b.practiceGuide) return <MandalaPracticeGuide key={j} aspect={aspKey} L={L} />;
            if (b.pCz != null) return <p key={j} style={{ margin: "0 0 10px", lineHeight: 1.75 }}>{L(b.pCz, b.pEn)}</p>;
            return <ul key={j} style={{ margin: "0 0 10px", paddingLeft: 20, lineHeight: 1.75 }}>{(L(b.ulCz, b.ulEn) || []).map((li, k) => <li key={k} style={{ marginBottom: 3 }}>{li}</li>)}</ul>;
          })}
        </AspectDisclosure>
      ))}
      {isCore && <PracticeFigures />}
      {!isCore && (
        <div style={{ marginTop: 22 }}>
          <div className="tm-aspect-study-tools"><Eyebrow>{L("Galerie aspektu", "The aspect's gallery")}</Eyebrow>{sort.toggle}</div>
          {retry}
          {lightbox}
          {imageError && <p role="alert">{L("Některé obrázky se nepodařilo nahrát. Zkus to znovu.", "Some images could not be uploaded. Please try again.")}</p>}
          <textarea value={data.note || ""} onChange={(e) => st.setMandala({ [aspKey]: { ...data, note: e.target.value } })} placeholder={L("Alter ega, kvality, mýty, na které se ladím…", "Alter egos, qualities, myths I tune into…")} rows={2} style={{ width: "100%", background: t.sheet, border: `1px solid ${t.borderSoft}`, borderRadius: 8, color: t.text, fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.6, padding: "10px 12px", outline: "none", resize: "vertical", margin: "10px 0 14px" }} />
          {sort.feedback}
          <div ref={sort.grid} className="tm-aspect-grid">
            {imgs.map((im, i) => (
              <div key={im.id} {...sort.tileProps(im.id)} className="tm-mand-card" style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${t.borderSoft}`, background: t.card, boxShadow: t.shadow }}>
                {thumbnail(im, i)}
                {st.editMode && <button onClick={() => remove(im)} aria-label={L("Odebrat obrázek", "Remove image")} style={{ position: "absolute", top: 6, right: 6, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(28,28,26,0.58)", color: BRAND.linen, cursor: "pointer" }}><FamilyIcon id="close" size={16} /></button>}
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

const PracticeFigures = createPracticeFiguresUI({ useT, useStore, L, uid });

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
