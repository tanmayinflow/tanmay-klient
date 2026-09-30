// Introductory cultural content, kept separate from astronomical calculations.
// sourceIds refer to the traceable entries below; observations are authored prompts.
export const TIBETAN_INTRO = [
  "Tibetská astrologie propojuje místní tradice s indickými výpočty oblohy a čínskou naukou o živlech. Začni čtyřmi krátkými zastaveními a pozorováním skutečné Luny.",
  "Tibetan astrology brings local traditions together with Indian sky calculations and Chinese elemental systems. Begin with four short introductions and observation of the actual Moon.",
];

export const TIBETAN_PILLARS = [
  {
    id: "kar-tsi",
    title: ["Kar cí · počítání oblohy", "Kar-tsi · calculating the sky"],
    text: [
      "Indická větev sleduje Slunce, Lunu a planety. Její kalendářní míry zahrnují den týdne, tithi, nakšatru, jógu a karanu.",
      "The Indian-derived branch follows the Sun, Moon and planets. Its calendar measures include weekday, tithi, nakshatra, yoga and karana.",
    ],
    help: {
      cs: ["Kar cí je indický základ tibetských výpočtů.", "Propojuje několik způsobů měření času.", "Prohlédni pančángu v Džjótiše jako příbuzný systém."],
      en: ["Kar-tsi is the Indian foundation of Tibetan calculations.", "It brings together several measures of time.", "Explore Jyotisha's panchanga as a related system."],
    },
    sourceIds: ["tibetan-tradition"],
  },
  {
    id: "nag-tsi",
    title: ["Nag cí · živly a cykly", "Nag-tsi · elements and cycles"],
    text: [
      "Čínská větev pracuje se dřevem, ohněm, zemí, železem a vodou. Dvanáct zvířat a pět živlů tvoří šedesátiletý cyklus.",
      "The Chinese-derived branch uses wood, fire, earth, iron and water. Twelve animals and five elements form a sixty-year cycle.",
    ],
    help: {
      cs: ["Nag cí je elementální větev tibetské astrologie.", "Živly vyjadřují tradiční vztahy mezi proměnami.", "Přečti tento obraz jako součást kulturní tradice."],
      en: ["Nag-tsi is the elemental branch of Tibetan astrology.", "Its elements express traditional relationships between changes.", "Read this image within its cultural tradition."],
    },
    sourceIds: ["tibetan-elements"],
  },
  {
    id: "mewa-parkha",
    title: ["Mewa a parkha · čísla a obrazce", "Mewa and parkha · numbers and patterns"],
    text: [
      "Mewa označuje devět čísel uspořádaných do čtverce. Parkha je osm trigramů, obrazců ze tří čar. Patří do elementálních výkladů.",
      "Mewa refers to nine numbers arranged in a square. Parkha means eight trigrams, patterns of three lines. Both belong to elemental readings.",
    ],
    help: {
      cs: ["Mewa a parkha tvoří další jazyk elementální tradice.", "Osobní přiřazení potřebuje vlastní tradiční pravidla.", "Prozkoumej jejich původ v přehledu zdrojů."],
      en: ["Mewa and parkha form another language of the elemental tradition.", "Personal assignments require their own traditional rules.", "Explore their origins in Sources."],
    },
    sourceIds: ["tibetan-elements"],
  },
  {
    id: "kalachakra",
    title: ["Kálačakra · kolo času", "Kalachakra · wheel of time"],
    text: [
      "Kálačakra rozlišuje vnější svět, vnitřní tělo a cestu duchovní praxe. Astronomie je jednou částí této buddhistické tradice.",
      "Kalachakra distinguishes the outer world, the inner body and the path of spiritual practice. Astronomy is one part of this Buddhist tradition.",
    ],
    help: {
      cs: ["Kálačakra znamená kolo času.", "Její tři roviny zasazují kalendář do širšího duchovního rámce.", "Začni veřejným úvodem a nech jednotlivým pojmům čas."],
      en: ["Kalachakra means wheel of time.", "Its three aspects place the calendar in a broader spiritual framework.", "Begin with the public introduction and take time with each concept."],
    },
    sourceIds: ["tibetan-kalachakra"],
  },
];

export const TIBETAN_CALENDAR_NOTE = [
  "Tithi ukazuje úhlovou vzdálenost Luny od Slunce. Tibetské datum se počítá podle vlastní kalendářní školy a může se opakovat nebo vynechat. Zde zatím zobrazujeme pozorování Luny; tibetské datum ani osobní mewa a parkha nepočítáme.",
  "Tithi measures the Moon's angular separation from the Sun. A Tibetan date follows its own calendar school and can repeat or be omitted. This view currently offers lunar observation; it does not calculate Tibetan dates or personal mewa and parkha.",
];

export const TIBETAN_OBSERVATIONS = [
  {id:"moon",title:["Podívej se na Lunu","Look at the Moon"],text:["Porovnej její dnešní světlo s obrazem v aplikaci. Co se od posledního pozorování změnilo?","Compare its light with the image in the app. What has changed since your last observation?"]},
  {id:"rhythm",title:["Všimni si rytmu","Notice a rhythm"],text:["Sleduj jednu proměnu ve svém okolí: ranní světlo, počasí nebo strom za oknem.","Follow one change around you: morning light, the weather or a tree outside your window."]},
  {id:"intention",title:["Dej dni malý záměr","Give the day a small intention"],text:["Vyber si jeden pozorný čin. Večer se k němu vrať a zvaž, co přinesl tobě a druhým.","Choose one thoughtful action. Revisit it in the evening and consider what it brought to you and others."]},
];

export const TIBETAN_SOURCES = [
  {id:"tibetan-tradition",title:["Tibetské tradice · přehled","Tibetan traditions · overview"],text:["Úvod vychází z institucionálního přehledu Men-Tsee-Khang. Kar cí zahrnuje indické astronomické postupy; zdejší moderní pančánga není převodem jejich tibetských tabulek.","The introduction follows Men-Tsee-Khang's institutional overview. Kar-tsi includes Indian astronomical methods; this app's modern panchanga does not reproduce their Tibetan tables."],links:[["Men-Tsee-Khang: Introduction to Tibetan Astro-Science","https://mentseekhang.org/introduction-to-tibetan-astrology/"]]},
  {id:"tibetan-elements",title:["Živly, mewa a parkha","Elements, mewa and parkha"],text:["Pojmy elementální tradice shrnujeme podle výkladu Alexandra Berzina. Zde slouží k seznámení; nepřiřazujeme z nich osobní prognózu.","Elemental terminology follows Alexander Berzin's exposition. It is introductory here; no personal prediction is assigned from it."],links:[["Alexander Berzin: Tibetan Astro Sciences","https://studybuddhism.com/en/advanced-studies/history-culture/tibetan-astrology/tibetan-astro-sciences"]]},
  {id:"tibetan-calendar",title:["Tithi a tibetské datum","Tithi and Tibetan dates"],text:["Tibetské školy Phugpa a Tsurphu mají vlastní kalendářní postupy. Zobrazované tithi neurčuje tibetské datum ani den náboženské praxe. Pro tyto údaje použij kalendář příslušné tradice.","The Phugpa and Tsurphu schools have their own calendar methods. Displayed tithi does not establish a Tibetan date or religious practice day. Use the relevant tradition's calendar for those dates."],links:[["Alexander Berzin: The Tibetan Calendar","https://studybuddhism.com/en/advanced-studies/history-culture/tibetan-astrology/details-of-tibetan-astrology-8-the-tibetan-calendar"]]},
  {id:"tibetan-kalachakra",title:["Kálačakra · veřejný úvod","Kalachakra · public introduction"],text:["Tři roviny Kálačakry popisuje oficiální úvod Kanceláře dalajlamy. Zdejší podněty k pozorování jsou autorské otázky aplikace, nikoli převzatý rituál nebo léčebný postup.","The Office of the Dalai Lama's public introduction describes the three aspects of Kalachakra. The app's observation prompts are authored questions, not a transmitted ritual or medical procedure."],links:[["Office of the Dalai Lama: Kalachakra","https://www.dalailama.com/teachings/kalachakra-initiations"]]},
];
