/**
 * Original optional conversation/practice cards. Source links identify inspiration,
 * not quotations, licensed exercises, treatment claims or clinical validation.
 * Each stable id has minutes (a loose estimate), localized cs/en category, title,
 * intro, question and steps, plus sourceId into TOGETHER_RITUAL_SOURCES.
 * No answers, completion scores, account data or storage belong to this catalogue.
 */
export const TOGETHER_RITUAL_SOURCES = [
  {
    id: 'gable-positive-events',
    title: 'Gable, Gonzaga & Strachman: Supportive responses to positive event disclosures (2006)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/17059309/',
    kind: 'relationship-research',
  },
  {
    id: 'eft-negative-cycle',
    title: 'ICEEFT: Emotionally Focused Therapy',
    url: 'https://iceeft.com/what-is-eft/',
    kind: 'relationship-framework',
  },
  {
    id: 'ibct-understanding',
    title: 'Andrew Christensen: Integrative Behavioral Couple Therapy · APA',
    url: 'https://www.apa.org/pubs/videos/4310904.html',
    kind: 'relationship-framework',
  },
  {
    id: 'implementation-intentions',
    title: 'Gollwitzer & Sheeran: Implementation intentions and goal achievement (2006)',
    url: 'https://www.socmot.uni-konstanz.de/publications/implementation-intentions-and-goal-achievement-meta-analysis-effects-and-processes',
    kind: 'behaviour-research',
  },
  {
    id: 'gottman-listening',
    title: 'The Gottman Institute: How to Have a Stress-Reducing Conversation',
    url: 'https://www.gottman.com/blog/how-to-stress-reducing-conversation/',
    kind: 'relationship-practice',
  },
  {
    id: 'gottman-rituals',
    title: 'The Gottman Institute: Rituals of Connection',
    url: 'https://www.gottman.com/product/rituals-of-connectionopportunity-cards/',
    kind: 'relationship-practice',
  },
  {
    id: 'gottman-soft-start',
    title: 'The Gottman Institute: Soften Your Start-Up',
    url: 'https://www.gottman.com/blog/softening-startup/',
    kind: 'relationship-practice',
  },
  {
    id: 'plum-village-beginning-anew',
    title: 'Plum Village: Extended Practices',
    url: 'https://plumvillage.org/mindfulness/extended-practises',
    kind: 'contemplative-practice',
  },
];

export const TOGETHER_RITUALS = [
  {
    id: 'listen-six',
    category: {cs: 'Naslouchání', en: 'Listening'},
    minutes: 6,
    title: {cs: 'Chvíli tě poslouchám', en: 'A moment to hear you'},
    intro: {
      cs: 'Pro to, co přinesl den. Nemusíte hned hledat řešení. Jde to i po telefonu.',
      en: 'Make room for whatever the day brought. You do not have to find a solution. A phone call works too.',
    },
    question: {cs: 'Co z tvého dne si zaslouží, abych o tom věděl/a?', en: 'What part of your day would you like me to know about?'},
    steps: {
      cs: [
        'Domluvte se, kdo začne. Zhruba tři minuty mluví jeden a druhý poslouchá bez přerušování.',
        'Vlastními slovy řekni, co jsi slyšel/a, a nech se opravit. Pak se zeptej: Chceš spíš vyslechnout, nebo spolu něco promyslet?',
        'Vyměňte si role. Pokud dnes někdo mluvit nechce, stačí to říct.',
      ],
      en: [
        'Choose who goes first. For about three minutes, one person speaks and the other listens without interrupting.',
        'Reflect what you heard in your own words and invite correction. Then ask: Would you like me to listen, or help you think something through?',
        'Swap roles. Either person can say they do not feel like talking today.',
      ],
    },
    sourceId: 'gottman-listening',
  },
  {
    id: 'one-appreciation',
    category: {cs: 'Ocenění', en: 'Appreciation'},
    minutes: 2,
    title: {cs: 'Jedna věc, které si vážím', en: 'One thing I appreciate'},
    intro: {
      cs: 'Malá konkrétní věc často řekne víc než velké vyznání. Můžeš ji říct nebo napsat.',
      en: 'A small, specific thing can say more than a grand declaration. You can say it or write it.',
    },
    question: {cs: 'Co mi od tebe v poslední době udělalo dobře?', en: 'What have you done lately that meant something to me?'},
    steps: {
      cs: [
        'Vybav si jednu skutečnou chvíli. Co se stalo a co to pro tebe znamenalo?',
        'Řekni to vlastními slovy. Stačí jedna nebo dvě věty.',
        'Nech tomu prostor. Druhý člověk nemusí hned odpovědět ani ocenění oplácet.',
      ],
      en: [
        'Think of one real moment. What happened, and what did it mean to you?',
        'Put it in your own words. One or two sentences are enough.',
        'Let it stand on its own. The other person does not have to reply or return the compliment.',
      ],
    },
    sourceId: 'plum-village-beginning-anew',
  },
  {
    id: 'tea-or-walk',
    category: {cs: 'Společný čas', en: 'Time together'},
    minutes: 15,
    title: {cs: 'Čaj nebo krátká procházka', en: 'Tea or a short walk'},
    intro: {
      cs: 'Vyberte si obyčejnou chvíli, na kterou je opravdu místo. Bez dalšího úkolu.',
      en: 'Choose an ordinary moment you can genuinely make room for. No extra task to complete.',
    },
    question: {cs: 'Kdy si na sebe můžeme udělat čtvrt hodiny?', en: 'When could we make fifteen minutes for each other?'},
    steps: {
      cs: [
        'Vyberte čaj, krátkou procházku nebo vlastní drobnost. Na dálku si můžete zavolat u čaje.',
        'Domluvte konkrétní čas, který vyhovuje oběma. Nemusí to být dnes.',
        'Na tu chvíli odložte ostatní činnosti, pokud to jde. Povídejte si nebo jen buďte spolu.',
      ],
      en: [
        'Choose tea, a short walk or something small of your own. From a distance, you could call over a cup of tea.',
        'Agree on a time that suits both of you. It does not have to be today.',
        'Set other tasks aside for a while, if you can. Talk, or simply spend the time together.',
      ],
    },
    sourceId: 'gottman-rituals',
  },
  {
    id: 'arrive-together',
    category: {cs: 'Zastavení', en: 'Arriving'},
    minutes: 3,
    title: {cs: 'Nejdřív se na chvíli zastavit', en: 'A pause before we begin'},
    intro: {
      cs: 'Před setkáním nebo hovorem si dopřej chvíli na přechod z toho, co bylo předtím.',
      en: 'Before meeting or calling, give yourself a moment to arrive from whatever came before.',
    },
    question: {cs: 'S čím právě přicházíš?', en: 'What are you arriving with right now?'},
    steps: {
      cs: [
        'Na chvíli se pohodlně posaď nebo zastav. Všimni si, co máš kolem sebe. Dech nemusíš měnit.',
        'Pokud chceš, pojmenuj jednou větou, jak ti je. Není potřeba vysvětlovat celý den.',
        'Řekněte si, na co teď máte prostor. Třeba na povídání, ticho nebo setkání jindy.',
      ],
      en: [
        'Sit comfortably or pause where you are. Notice your surroundings. There is no need to change your breathing.',
        'If you like, describe how you feel in one sentence. You do not need to explain your whole day.',
        'Say what you have room for now. That might be conversation, quiet or meeting another time.',
      ],
    },
    sourceId: 'plum-village-beginning-anew',
  },
  {
    id: 'begin-again',
    category: {cs: 'Citlivý rozhovor', en: 'A tender conversation'},
    minutes: 10,
    title: {cs: 'Vrátit se k tomu jemně', en: 'Come back to it gently'},
    intro: {
      cs: 'Když mezi vámi něco zůstalo a oba o tom chcete mluvit. Domluvit se na později je také v pořádku.',
      en: 'For something left between you, when you both want to talk. Agreeing to return to it later is okay too.',
    },
    question: {cs: 'Co bych ti chtěl/a říct tak, abys mi mohl/a lépe rozumět?', en: 'What would I like to say to help you understand me better?'},
    steps: {
      cs: [
        'Nejdřív se zeptej, jestli je teď vhodná chvíle. Pokračujte jen tehdy, když oba chcete.',
        'Drž se jedné konkrétní situace. Popiš, jak ti v ní bylo a o co teď prosíš, bez hodnocení druhého člověka.',
        'Druhý může vlastními slovy říct, čemu porozuměl. Pak si podle chuti vyměňte role.',
        'Nemusíte dojít ke shodě ani k odpuštění. Kdokoli může rozhovor zastavit. Další čas domluvte jen společně.',
      ],
      en: [
        'First ask whether this is a good time. Continue only if both of you want to.',
        'Stay with one specific situation. Describe how you felt and what you are asking for now, without judging the other person.',
        'The listener can say what they understood in their own words. Swap roles if you both want to.',
        'You do not have to reach agreement or forgiveness. Either person can stop. Agree together if and when to return.',
      ],
    },
    sourceId: 'gottman-soft-start',
  },
  {
    id: 'quiet-moment',
    category: {cs: 'Ticho', en: 'Quiet'},
    minutes: 2,
    title: {cs: 'Chvíli nemusíme nic říkat', en: 'Nothing to say for a moment'},
    intro: {
      cs: 'I ticho může být společná chvíle. Jen pokud je vám v něm oběma dobře.',
      en: 'Quiet can be time together too. Only if it feels comfortable for both of you.',
    },
    question: {cs: 'Byla by nám teď příjemná chvíle ticha?', en: 'Would a quiet moment feel good right now?'},
    steps: {
      cs: [
        'Domluvte se, jestli chcete chvíli mlčet. Můžete sedět vedle sebe nebo zůstat spojení na dálku.',
        'Nechte oči otevřené nebo zavřené, jak je příjemné. Dotek ani soustředění na dech nejsou potřeba.',
        'Po chvíli navážete, jak budete chtít. Není co hodnotit ani zapisovat.',
      ],
      en: [
        'Check whether you both want a little quiet. You can sit together or stay connected from a distance.',
        'Keep your eyes open or closed, whichever feels comfortable. Touch and attention to breathing are optional.',
        'Continue in whatever way suits you. There is nothing to rate or record.',
      ],
    },
    sourceId: 'plum-village-beginning-anew',
  },
  {
    id: 'share-a-good-thing',
    category: {cs: 'Radost', en: 'Joy'},
    minutes: 5,
    title: {cs: 'Být u toho, co tě těší', en: 'Be there for what delights you'},
    intro: {cs: 'Chvíle pro dobrou zprávu, malý úspěch nebo obyčejnou radost. Nemusí se týkat vás dvou.', en: 'Make room for good news, a small success or an ordinary delight. It does not have to be about the two of you.'},
    question: {cs: 'Co tě potěšilo a co na tom pro tebe bylo nejhezčí?', en: 'What brought you joy, and what was the best part for you?'},
    steps: {
      cs: ['Jeden vypráví o příjemné chvíli. Druhý odloží, co právě dělá, pokud může.', 'Zeptej se na jeden detail, který tě zajímá. Nech radost chvíli zaznít, než přidáš vlastní příběh nebo obavy.', 'Vyměňte se, pokud oba chcete. Když dnes nic nepřichází, nic nemusíte hledat násilím.'],
      en: ['One person shares a pleasant moment. The other sets aside what they are doing, if possible.', 'Ask about one detail that interests you. Let the joy have some space before adding your own story or concerns.', 'Swap if you both want to. If nothing comes to mind today, there is no need to force it.'],
    },
    sourceId: 'gable-positive-events',
  },
  {
    id: 'notice-our-pattern',
    category: {cs: 'Porozumění', en: 'Understanding'},
    minutes: 15,
    title: {cs: 'Co se mezi námi opakuje', en: 'What keeps happening between us'},
    intro: {cs: 'Pro klidnější chvíli, kdy oba chcete pochopit opakující se neshodu. Vyberte jednu menší situaci.', en: 'For a calmer moment when you both want to understand a recurring disagreement. Choose one smaller situation.'},
    question: {cs: 'Co se ve mně děje těsně předtím, než se mezi námi rozjede známý kolotoč?', en: 'What happens inside me just before we fall into our familiar pattern?'},
    steps: {
      cs: ['Každý popíše jen svou zkušenost: co se stalo, co si vyložil a jak zareagoval. Nehádejte, co se dělo v druhém.', 'Pokud chceš, pojmenuj, co bylo pod první reakcí: třeba strach, smutek, bezmoc nebo potřeba být brán/a vážně.', 'Druhý řekne, čemu porozuměl, a nechá se opravit. Nemusíte situaci vidět stejně.', 'Vyberte jeden rozpoznatelný signál a jeden jiný malý krok pro příště. Když napětí roste, udělejte pauzu a domluvte, kdy znovu ověříte, jestli chcete pokračovat.'],
      en: ['Each describes only their own experience: what happened, how they read it and how they reacted. Do not guess what was going on in the other person.', 'If you want, name what lay beneath your first reaction: fear, sadness, helplessness or a need to be taken seriously.', 'The listener says what they understood and makes room for correction. You do not have to see the situation the same way.', 'Choose one recognisable signal and one small different step for next time. If tension rises, pause and agree when to check whether you both want to continue.'],
    },
    sourceId: 'eft-negative-cycle',
  },
  {
    id: 'repair-my-part',
    category: {cs: 'Náprava', en: 'Repair'},
    minutes: 10,
    title: {cs: 'Moje část, můj další krok', en: 'My part, my next step'},
    intro: {cs: 'Když chceš napravit něco ve svém jednání. Omluva nemusí být výměna a nevyžaduje okamžité odpuštění.', en: 'When you want to repair something in your own behaviour. An apology need not be an exchange and does not require immediate forgiveness.'},
    question: {cs: 'Co ze svého jednání chci uznat a jak ukážu změnu v něčem konkrétním?', en: 'What do I want to acknowledge about my behaviour, and how will I show a concrete change?'},
    steps: {
      cs: ['Zeptej se, jestli má druhý prostor. Pojmenuj konkrétně, co jsi udělal/a, bez navazujícího „ale ty“.', 'Vyslechni, jaký to mělo dopad. Pokud něčemu nerozumíš, ověř si to otázkou.', 'Navrhni malou nápravu, za kterou můžeš stát. Druhý může říct, že potřebuje něco jiného nebo čas.', 'Domluvte jen to, s čím oba souhlasíte. Uložte případně jednu větu o dalším kroku; celý rozhovor zaznamenávat nemusíte.'],
      en: ['Ask whether the other person has room. Name what you did specifically, without following it with “but you”.', 'Listen to the impact. If something is unclear, ask rather than assume.', 'Offer a small repair you can stand behind. The other person can ask for something different or for time.', 'Agree only on what you both accept. If useful, record one sentence about the next step; the whole conversation need not be recorded.'],
    },
    sourceId: 'plum-village-beginning-anew',
  },
  {
    id: 'one-week-experiment',
    category: {cs: 'Do života', en: 'Into daily life'},
    minutes: 10,
    title: {cs: 'Jeden malý pokus na týden', en: 'One small experiment for a week'},
    intro: {cs: 'Aby dobrý rozhovor dostal místo i v obyčejném dni. Vyberte změnu, která se vejde do vašich možností.', en: 'Give a good conversation a place in everyday life. Choose a change that fits what you can actually manage.'},
    question: {cs: 'Co zkusíme tento týden jinak a podle čeho poznáme, jestli nám to pomáhá?', en: 'What will we try differently this week, and how will we know whether it helps?'},
    steps: {
      cs: ['Každý řekne jednu potřebu. Vyberte společně jednu, se kterou teď chcete něco udělat.', 'Domluvte pozorovatelný krok: kdo co udělá, kdy a jak často. Třeba deset minut po večeři bez telefonů dvakrát za týden.', 'Předem zvažte překážku a menší variantu pro náročný den. Nemusíte přidávat další výkon.', 'V příštím ohlédnutí se vraťte k tomu, jaké to bylo. Neplnění není skóre vztahu; je to důvod dohodu upravit.'],
      en: ['Each names one need. Together, choose one you would like to act on now.', 'Agree on an observable step: who will do what, when and how often. For example, ten phone-free minutes after dinner twice this week.', 'Anticipate an obstacle and a smaller version for a difficult day. There is no need to add another performance target.', 'Return to how it felt in your next reflection. Not following through is not a relationship score; it is a reason to adjust the agreement.'],
    },
    sourceId: 'implementation-intentions',
  },
  {
    id: 'different-not-against',category:{cs:'Přijetí rozdílů',en:'Accepting differences'},minutes:12,
    title:{cs:'Jsme různí. Co s tím potřebujeme?',en:'We differ. What do we need around that?'},
    intro:{cs:'Když se vrací rozdíl, který nemusí zmizet: potřeba ticha, kontaktu, pořádku nebo spontánnosti. Nejdřív si porozumět, pak hledat dohodu.',en:'For a recurring difference that may not disappear: quiet, contact, order or spontaneity. Understand it before reaching for an agreement.'},
    question:{cs:'Co je pro mě v tomhle rozdílu důležité a čeho se bojím, když pro to není místo?',en:'What matters to me in this difference, and what do I fear when there is no room for it?'},
    steps:{cs:['Každý popíše jednu svou potřebu a co pro něj znamená. Zůstaňte u sebe, bez vysvětlování, jaký je druhý.','Pojmenujte, co rozdíl zhoršuje: třeba únava, tlak v práci nebo málo času. Zkuste odlišit situaci od úmyslu partnera.','Hledejte malou dohodu, která nechá prostor oběma. Kde potřebujeme změnu a kde můžeme přijmout, že to druhý má jinak?'],en:['Each describes one need and what it means. Stay with your own experience rather than explaining the other person.','Name what makes the difference harder: tiredness, work pressure or too little time. Try separating the situation from your partner’s intention.','Find a small agreement with room for both of you. Where is change needed, and where can we accept that the other person is different?']},sourceId:'ibct-understanding',
  },
  {
    id:'closeness-and-boundaries',category:{cs:'Blízkost a hranice',en:'Closeness and boundaries'},minutes:10,
    title:{cs:'Jak být blízko a neztratit sebe',en:'Close without losing ourselves'},
    intro:{cs:'Pro chvíli, kdy jeden hledá víc kontaktu a druhý víc prostoru. Ani jedno nemusí znamenat odmítnutí.',en:'When one of you wants more contact and the other more space. Neither has to mean rejection.'},
    question:{cs:'Jak ti můžu říct ano i ne tak, abychom si zůstali blízko?',en:'How can I say both yes and no while staying connected with you?'},
    steps:{cs:['Každý řekne, jaký kontakt mu teď dělá dobře a kde potřebuje prostor. Odpověď nemusíte obhajovat.','Ověřte si význam: Když chceš být chvíli sám/sama, co si o tom vykládám? Co bys chtěl/a, abych věděl/a místo té domněnky?','Domluvte jednu srozumitelnou větu nebo gesto pro žádost o blízkost či prostor. U prostoru můžete nabídnout čas dalšího setkání, pokud to tak oba chcete.'],en:['Each says what contact feels good now and where they need space. There is no need to defend the answer.','Check the meaning: when you want time alone, what story do I tell myself? What would you rather I understood?','Agree on one clear phrase or gesture for asking for closeness or space. With space, offer a time to reconnect if that suits both of you.']},sourceId:'eft-negative-cycle',
  },
  {
    id:'outside-pressure',category:{cs:'Společná zátěž',en:'Shared pressure'},minutes:10,
    title:{cs:'Co nám bere síly zvenčí',en:'What is draining us from outside'},
    intro:{cs:'Někdy mezi vámi stojí i vyčerpání, práce nebo starosti, které není vidět. Dejte jim jméno, abyste je nemuseli nést proti sobě.',en:'Sometimes exhaustion, work or unseen worries stand between you too. Name them so you do not have to carry them against each other.'},
    question:{cs:'Co si přináším zvenčí a jak se to pak dotýká nás dvou?',en:'What am I bringing from outside, and how is it affecting us?'},
    steps:{cs:['Každý pojmenuje jednu současnou zátěž a jak ji na sobě pozná. Druhý nejdřív poslouchá.','Rozlište, co můžete ovlivnit a co teď potřebujete společně unést. Podporou může být pomoc, pochopení nebo méně nároků.','Domluvte jednu úlevu na tento týden. Kdo za ni převezme i plánování a dokončení?'],en:['Each names one current pressure and how they notice it in themselves. The other listens first.','Separate what you can influence from what you need to carry together. Support might mean help, understanding or fewer demands.','Agree on one way to lighten this week. Who will own the planning and finishing too?']},sourceId:'ibct-understanding',
  },
  {
    id:'under-the-value',category:{cs:'Kořeny a směr',en:'Roots and direction'},minutes:15,
    title:{cs:'Co si neseme a co chceme tvořit',en:'What we carry and what we want to create'},
    intro:{cs:'V klidné chvíli si všimněte, co jste se o blízkosti naučili doma. Sdílejte jen tolik, kolik chcete.',en:'In a calm moment, notice what you learned about closeness at home. Share only as much as you want.'},
    question:{cs:'Co jsem se naučil/a o péči, hádce nebo omluvě a co z toho chci v našem vztahu dělat jinak?',en:'What did I learn about care, arguments or apologies, and what would I like to do differently with us?'},
    steps:{cs:['Vyberte jedno všední téma. Každý může říct příklad a jak si ho tehdy vyložil, bez pátrání po skrytých vzpomínkách.','Druhý se zeptá: Jak se to projevuje dnes a co by ti pomohlo ode mě? Neurčujte si navzájem příčiny ani diagnózy.','Pojmenujte jednu věc, kterou si chcete ponechat, a jeden vlastní čin, kterým chcete vytvořit jinou zkušenost.'],en:['Choose one everyday topic. Each may share an example and how they understood it, without searching for hidden memories.','The listener asks: how does it show up today, and what would help from me? Do not assign causes or diagnoses to each other.','Name one thing you want to keep and one action of your own that could create a different experience.']},sourceId:'ibct-understanding',
  },
];

/** Return a display-ready card; unknown language falls back to Czech. */
export function getTogetherRitualText(ritual, language = 'cs') {
  const key = language === 'en' ? 'en' : 'cs';
  return {
    id: ritual.id,
    minutes: ritual.minutes,
    category: ritual.category[key],
    title: ritual.title[key],
    intro: ritual.intro[key],
    question: ritual.question[key],
    steps: [...ritual.steps[key]],
    sourceId: ritual.sourceId,
  };
}
