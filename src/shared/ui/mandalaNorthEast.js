// Source identifies the method or the conceptual basis of the local exercise.
const map = {
  id: "map",
  title: "Bill Plotkin · Wild Mind, ch. 1",
  url: "https://www.wildmindbook.com/wp-content/uploads/Wild-Mind-Excerpts.pdf",
};
const appendix = {
  id: "appendix",
  title: "Bill Plotkin · Four Practices for Wholing and Self-Healing",
  url: "https://learningforchange.net/wp-content/uploads/2018/08/Four-Practices-for-Wholing-and-Self-Healing.pdf",
};
const czechBook = {
  id: "czech",
  title: "Bill Plotkin · Divoká mysl (MAITREA, 2016)",
  url: "https://dwn.alza.cz/ebook/nahled/pdf/EK29383",
};
const animas = {
  id: "journal",
  title: "Animas Valley Institute · Stage 4 Experiential Activities",
  url: "https://animas.org/wp-content/uploads/STAGE-4-EXPERIENTIAL-ACTIVITIES-DOCUMENT.pdf",
};
const essay = {
  id: "essay",
  title: "Bill Plotkin · Wild Mind: Reclaiming Our Original Wholeness",
  url: "https://www.dailygood.org/story/2402/wild-mind-reclaiming-our-original-wholeness-bill-plotkin/",
};
const book = "https://books.google.com/books?id=OczmHOQi5zsC";
const northFacet = { id: "ch2", title: "Bill Plotkin · Wild Mind, 2 · The Nurturing Generative Adult", url: book + "&pg=PA33" };
const northParts = { id: "ch6", title: "Bill Plotkin · Wild Mind, 6 · Loyal Soldiers", url: book + "&pg=PA127" };
const eastFacet = { id: "ch4", title: "Bill Plotkin · Wild Mind, 4 · The Innocent/Sage", url: book + "&pg=PA77" };
const eastParts = { id: "ch8", title: "Bill Plotkin · Wild Mind, 8 · Addicts and Escapists", url: book + "&pg=PA181" };

export const NORTH_EAST_STUDY = {
  north: {
    reading: {
      cz: "V Divoké mysli otevři 2. kapitolu na str. 33, pro práci s věrnými vojáky 6. kapitolu na str. 129. Sever se učíš poznat podle toho, komu tvoje péče dává víc prostoru jednat.",
      en: "In Wild Mind, chapter 2 starts on p. 33 and chapter 6 on Loyal Soldiers starts on p. 127. Watch for the kind of care that leaves someone more able to act for themselves.",
    },
    sources: [northFacet, northParts, appendix, czechBook, animas, essay],
    practices: [
      {
        id: "north-walk", source: "ch2", kind: "method", group: "facet",
        cz: {
          title: "Procházka Severu",
          when: "Když máš chvíli projít se krajinou, parkem nebo vlastní ulicí.",
          steps: ["Vyjdi s otázkou, kdo se tady o koho stará. U jednoho setkání se zastav dost dlouho, abys pozoroval jednotlivosti.", "Při jiné vycházce sleduj opačný směr péče. U které části krajiny se sám cítíš vítaný? Zdrž se tam, jestli takové místo najdeš.", "Po návratu si zaznamenej konkrétní setkání a co v tobě vyvolalo."],
          reflect: "Kdy bylo přirozenější péči přijmout a kdy ji nabídnout?"
        },
        en: {
          title: "A North walk",
          when: "When you have time for a walk in open country, a park, or your own street.",
          steps: ["Walk with the question of who cares for whom here. Pause at one encounter long enough to notice particulars.", "On another walk, attend to care coming the other way. Is there a part of this landscape where you feel welcome? Spend time there if you find one.", "Afterwards, record one actual encounter and what it brought up in you."],
          reflect: "When did it come more naturally to receive care, and when to offer it?"
        }
      },
      {
        id: "north-letter-self", source: "ch2", kind: "method", group: "facet",
        cz: {
          title: "Dopis od pečujícího dospělého",
          when: "Něco se ti nepovedlo a nevíš, jak sám se sebou promluvit.",
          steps: ["Oslov se jménem. Napiš, co se stalo, hlasem člověka, který tě zná i ve chvílích, kdy se ti daří.", "Přiznej v dopise skutečnou obtíž a pojmenuj jednu schopnost, o kterou se můžeš opřít. Přidej nabídku podpory.", "Dopis si přečti později. Podtrhni větu, které dokážeš věřit."],
          reflect: "Jakou oporu mi tenhle hlas nabízí právě teď?"
        },
        en: {
          title: "A letter from the Nurturing Adult",
          when: "Something went wrong and you are unsure how to speak to yourself.",
          steps: ["Address yourself by name. Describe what happened in the voice of someone who also knows you when things are going well.", "Acknowledge the real difficulty and one ability you can draw on. Offer some specific support.", "Read it later. Underline a sentence that feels believable."],
          reflect: "What support can I actually receive from this voice today?"
        }
      },
      {
        id: "north-letter-another", source: "ch2", kind: "method", group: "facet",
        cz: {
          title: "Dopis druhé bytosti",
          when: "Někdo pro tebe něco znamená a rád bys to vyjádřil přesněji.",
          steps: ["Oslov konkrétního člověka nebo zvíře. Popiš jedno společné setkání tak, aby ožilo i na papíře.", "Pověz adresátovi, co v jeho jednání obdivuješ a co sis díky němu uvědomil. Sám rozhodni, jestli dopis předáš."],
          reflect: "Za co přesně toho druhého oceňuji?"
        },
        en: {
          title: "A letter to another being",
          when: "Someone matters to you and you want to find more precise words for it.",
          steps: ["Address one person or animal. Describe an encounter you shared in enough detail to bring it to life on paper.", "Tell the recipient what you admire in their actions and what you learned from them. Decide for yourself whether to give the letter."],
          reflect: "What exactly do I appreciate about this being?"
        }
      },
      {
        id: "north-letter-place", source: "ch2", kind: "method", group: "facet",
        cz: {
          title: "Dopis krajině",
          when: "Když chceš prozkoumat vztah k části světa, která ti umožňuje žít.",
          steps: ["Vyber si třeba potok, z jehož povodí piješ, kus lesa, Zemi nebo Slunce. V dopise oslov přímo svůj protějšek.", "Uveď jeden případ, kdy jste se setkali. Popiš, co od něj dostáváš a co pro tebe znamená jeho další existence."],
          reflect: "Co jsem objevil, když jsem promluvil k místu, o kterém obvykle jen vyprávím?"
        },
        en: {
          title: "A letter to a landscape",
          when: "When you want to explore your relationship with a part of the world that sustains you.",
          steps: ["Choose a stream in your watershed, a wood, the Earth, or the Sun. Address it directly in your letter.", "Recall a particular meeting. Describe what you receive and why its continued existence matters to you."],
          reflect: "What did I discover by addressing a place I usually only talk about?"
        }
      },
      {
        id: "north-letter-mystery", source: "ch2", kind: "method", group: "facet",
        cz: {
          title: "Dopis Tajemství",
          when: "Něco v přírodě nebo v lidském životě tě dojímá a zároveň přesahuje tvé chápání.",
          steps: ["Začni od skutečné chvíle. Co se před tebou odehrálo? Dopis adresuj tomu, co v ní pro tebe zůstává tajemné.", "Vyslov obdiv, vděk, údiv nebo poctivou otázku. Můžeš zvolit dopis, kresbu či krátkou píseň."],
          reflect: "Jaký vztah se projevuje ve způsobu, jakým Tajemství oslovuji?"
        },
        en: {
          title: "A letter to Mystery",
          when: "Something in nature or human life moves you and remains beyond your understanding.",
          steps: ["Start with a particular moment. What took place in front of you? Address whatever remains mysterious about it.", "Express admiration, gratitude, wonder, or an honest question. Try a letter, a sketch, or a short song."],
          reflect: "What sort of relationship do I hear in the way I address Mystery?"
        }
      },
      {
        id: "north-vow", source: "ch2", kind: "method", group: "facet",
        cz: {
          title: "Závazek vůči vlastní duši",
          when: "Když se ti v tvorbě, snech nebo příbězích opakovaně vrací obraz toho, čím můžeš přispět.",
          steps: ["Popiš vlastními slovy jeden takový obraz. Komu nebo čemu by mohl sloužit, kdybys ho uvedl do života?", "Najdi podobu závazku, která ti sedí. Vyslov ho, napiš nebo zazpívej. Zvol jeden skutečný čin, podle něhož poznáš, že slib začíná žít."],
          reflect: "Kdo kromě mě bude moci ten dar zakusit?"
        },
        en: {
          title: "A vow to your soul",
          when: "An image of what you might contribute keeps coming back in your art, dreams, or stories.",
          steps: ["Describe one recurring image in your own words. Who or what might benefit if it took shape in your life?", "Find a form of commitment that fits. Speak, write, or sing it. Choose one concrete act that could bring the promise into the world."],
          reflect: "Who besides me could experience this gift?"
        }
      },
      {
        id: "north-circle", source: "appendix", kind: "method", group: "facet",
        cz: {
          title: "Postavit se na Sever v kruhu čtyř směrů",
          when: "Když se rozhoduješ, jak o někoho pečovat, a tvoje první odpověď zní „musím to zvládnout celé“.",
          steps: ["Najdi venku místo, kde můžeš udělat pár kroků. Zvol si střed a všimni si něčeho, co odtud leží na sever.", "Ze středu vyslov své dilema. Na severu si pak vybav člověka, který ti kdysi poskytl dobrou oporu. Postav se jako on a odpověz vlastními slovy.", "Vrať se do středu. Vyber jednu část té odpovědi, za kterou dnes opravdu můžeš převzít odpovědnost."],
          reflect: "Jak se změnila moje nabídka, když jsem do péče zahrnul i vlastní síly?",
        },
        en: {
          title: "Stand in the North of a four-directions circle",
          when: "Use this when your first response to someone needing care is to take the whole job on.",
          steps: ["Find a place outdoors with room for a few steps. Choose a center and notice a feature to its north.", "From the center, name your dilemma. Step north and recall someone whose support once helped you. Try their posture and answer in your own words.", "Return to the center. Pick one part of that answer you can genuinely take responsibility for today."],
          reflect: "How did my offer change when I included my own capacity in the picture?",
        },
      },
      {
        id: "north-soldier", source: "ch6", kind: "method", group: "protector",
        cz: {
          title: "Uvítat věrného vojáka",
          when: "Když i drobný přešlap spustí přísný vnitřní příkaz. Zkus to na běžné příhodě.",
          steps: ["Vybav si jeho přesná slova a zeptej se, před čím tě chtěl uchránit. Čím tehdy riskoval člověk, který promluvil nebo udělal chybu?", "Uznávej jen to, co je pravda i dnes. Jestli ohrožení trvá, pojmenuj, koho si můžeš přizvat. Pokud se okolnosti změnily, poděkuj ochránci a uveď jeden příklad podpory, na kterou už můžeš spoléhat.", "Po čase sleduj, kdy se staré varování vrací. Plotkin popisuje možnost nabídnout ochránci novou úlohu až po delší zkušenosti s bezpečím."],
          reflect: "Co ve varování mělo cenu a o čem si chci rozhodnout sám?",
        },
        en: {
          title: "Welcome a Loyal Soldier home",
          when: "Try an ordinary mistake that sets off a surprisingly stern inner order.",
          steps: ["Recall its exact words and ask what it was trying to protect. What happened back then to someone who spoke up or made a mistake?", "Check what is still true. If a danger persists, identify someone you can turn to. If things have changed, thank the protector and give one concrete example of support you can now count on.", "Over time, notice when the old warning returns. Plotkin places the possibility of offering the protector a new job much later, after repeated experiences of safety."],
          reflect: "Which part of its warning was useful, and which decision belongs to me?",
        },
      },
      {
        id: "north-consent", source: "ch2", kind: "adaptation", group: "application",
        cz: {
          title: "Nabídnout pomoc a nechat druhému volbu",
          when: "Někdo ti vypráví o těžkosti a ty už máš řešení.",
          steps: ["Připomeň si, co dotyčný skutečně řekl. Zvlášť si pojmenuj, co sis o jeho potřebách zatím jen domyslel.", "Zeptej se například: „Chceš, abych poslouchal, nebo mám něco udělat?“ Počkej i na případné odmítnutí.", "Pokud o pomoc stojí, dohodněte jedno konkrétní gesto a jeho hranici. Po něm se zeptej, k čemu mu skutečně bylo."],
          reflect: "Ve kterém okamžiku ke mně přišla chuť převzít řízení?",
        },
        en: {
          title: "Offer help and leave room for a choice",
          when: "Someone is describing a difficulty and you already have a solution in mind.",
          steps: ["Recall what they actually said. Name separately what you have assumed about their needs.", "Ask something like, “Would you like me to listen or to help with something?” Give them room to decline.", "If they want help, agree on one specific gesture and its limits. Afterwards, ask what use it was to them."],
          reflect: "At what point did I want to take over?",
        },
      },
      {
        id: "north-land", source: "essay", kind: "adaptation", group: "application",
        cz: {
          title: "Péče o místo, kam se vracím",
          when: "Na příští návštěvě dvora, zahrady nebo parku, který dobře znáš.",
          steps: ["Chvíli sleduj, kdo tu hledá potravu, úkryt či odpočinek. Vyber jednu potřebu, pro kterou jsi opravdu viděl důkaz.", "Zjisti, kdo už se o místo stará a co je tu vhodné. Může pomoci i prosté rozhodnutí obejít kus břehu, kde hnízdí ptáci.", "Při další návštěvě se vrať na stejné místo. Popiš jednu viditelnou změnu nebo důvod, proč péči upravit."],
          reflect: "Podle čeho poznám, že má můj zásah smysl pro obyvatele tohoto místa?",
        },
        en: {
          title: "Care for a place you can revisit",
          when: "On the next visit to a familiar courtyard, garden or park.",
          steps: ["Watch who uses the place for food, shelter or rest. Pick a need you have seen evidence for.", "Find out who already tends the place and what is appropriate. Care could mean giving a stretch of bank with nesting birds a wider berth.", "Return to the same spot next time. Describe one visible change or a reason to adjust your approach."],
          reflect: "What could tell me this actually helps the inhabitants of this place?",
        },
      },
      {
        id: "north-competence", source: "ch2", kind: "adaptation", group: "application",
        cz: {
          title: "Předat dovednost",
          when: "Když něco umíš rychleji než člověk vedle tebe. Stačí třeba oprava zipu nebo uvaření jídla.",
          steps: ["Zeptej se, zda se to druhý chce naučit. Nech ho vybrat, kterou část si přeje zvládnout sám.", "Jednou ji pomalu předveď. Pak mu dej nástroj do ruky a dohodněte si, jak si řekne o pomoc.", "Až skončíte, nech ho vlastními slovy říct, co by příště zkusil. Domluvte se, kterou odpovědnost už může převzít."],
          reflect: "Co dnes druhý udělal poprvé sám?",
        },
        en: {
          title: "Pass on a skill",
          when: "You know how to do something faster than the person beside you. Repairing a zip or making a meal will do.",
          steps: ["Ask whether they want to learn. Let them choose the part they want to handle themselves.", "Demonstrate it slowly once. Hand over the tool and agree on how they can ask you to step in.", "At the end, let them say in their own words what they would try next. Agree on what they can now take responsibility for."],
          reflect: "What did the other person get to do for themselves for the first time?",
        },
      },
      {
        id: "north-gratitude", source: "ch2", kind: "adaptation", group: "application",
        cz: {
          title: "Večerní vděčnost za péči",
          when: "Když na konci dne vidíš hlavně to, co ještě zbývá udělat.",
          steps: ["Vybav si jeden okamžik, kdy někdo pečoval o tebe, kdy jsi pečoval o druhého nebo sám o sebe. Vyber konkrétní gesto.", "V duchu poděkuj tomu, kdo je udělal. Jestli jsi to byl ty, řekni si stejnou laskavou větu, jakou bys řekl příteli.", "Všimni si jedné vlastní potřeby pro zítřek. Pojmenuj malý krok, o který můžeš požádat nebo který si můžeš dopřát."],
          reflect: "Kterou péči obvykle přehlédnu, přestože mě nese?"
        },
        en: {
          title: "Evening gratitude for care",
          when: "When the day ends and all you can see is unfinished work.",
          steps: ["Recall one moment when someone cared for you, you cared for another, or you looked after yourself. Choose one particular gesture.", "Silently thank whoever made that gesture. If it was you, use the same kind words you might offer a friend.", "Notice one need of your own for tomorrow. Name a small thing you can ask for or give yourself."],
          reflect: "What care regularly sustains me without catching my attention?"
        }
      },
      {
        id: "north-journal", source: "journal", kind: "adaptation", group: "protector",
        cz: {
          title: "Rozpoznat větu vnitřního kritika",
          when: "Po dni, kdy jsi odložil něco, co pro tebe bylo důležité.",
          steps: ["Do deníku napiš větu, která tě tehdy zarazila. Připiš, čí přijetí nebo čí nesouhlas se v tu chvíli zdály důležité.", "Najdi okolnost, kterou ten hlas přehlédl. Co víš dnes? Koho se můžeš zeptat? Máš dost informací na malý pokus?", "Napiš druhou větu, kterou si řekneš příště. Vyzkoušej ji nahlas, aby zněla jako tvoje vlastní řeč."],
          reflect: "Jaký malý krok mi druhá věta umožní?",
        },
        en: {
          title: "Catch the inner critic's refrain",
          when: "After a day when you put off something that mattered to you.",
          steps: ["Write down the sentence that stopped you. Add whose approval or disapproval seemed to matter in that moment.", "Find a circumstance the voice overlooked. What do you know now? Who could you ask? Do you know enough for a small trial?", "Write a second sentence for next time. Try it aloud until it sounds like something you would actually say."],
          reflect: "What small step does that second sentence make possible?",
        },
      },
    ],
  },
  east: {
    reading: {
      cz: "V Divoké mysli začíná Východ ve 4. kapitole na str. 79. Osmá kapitola od str. 187 se věnuje únikovým hlasům. Při zkoumání sleduj, zda ti nadhled pomohl něco skutečně uvidět a vrátit se k tomu.",
      en: "In Wild Mind, chapter 4 starts on p. 77. Chapter 8, on escape and addiction in the map, begins on p. 181. Notice whether taking a wider view helps you return to something you can now see more clearly.",
    },
    sources: [eastFacet, eastParts, appendix, czechBook, map, essay, animas],
    practices: [
      {
        id: "east-praise-walk", source: "ch4", kind: "method", group: "facet",
        cz: {
          title: "Ranní procházka chvály",
          when: "Když můžeš první část rána strávit venku.",
          steps: ["Jdi pomalu, dokud tě v okolí něco neosloví. Může to být i holub ve strouze nebo jedna větvička vrby.", "Promluv přímo k tomu, co tě zaujalo. Za co to můžeš upřímně pochválit? Zkus to říct tak, jak bys to dokázal říct jen ty.", "Všimni si, kdo nebo co tě cestou překvapilo. Jestli má chvála podobu smíchu, gesta či popěvku, dopřej jí ji."],
          reflect: "Komu nebo čemu jsem dnes věnoval pozornost poprvé?"
        },
        en: {
          title: "A morning praise walk",
          when: "When you can spend the first part of the morning outdoors.",
          steps: ["Go slowly until something around you catches your attention. It might be a pigeon in a gutter or one twig of a willow.", "Speak directly to what caught your eye. What can you genuinely praise about it? Find words that sound like your own.", "Notice what surprised you along the way. If praise takes the form of a laugh, gesture, or tune, let it."],
          reflect: "To whom or what did I give my attention for the first time today?"
        }
      },
      {
        id: "east-sunrise", source: "ch4", kind: "method", group: "facet",
        cz: {
          title: "Strávit úsvit na jednom místě",
          when: "Když si můžeš vyhradit ráno a dostat se před rozedněním na místo s výhledem k východu.",
          steps: ["Za šera se pohodlně usaď. Všimni si, které zvuky, obrysy a pohyby vzduchu už dokážeš rozeznat.", "Zůstaň na stejném místě během proměny světla. Sleduj, co se postupně ukazuje v okolní krajině a jak na to odpovídáš ty.", "Až odejdeš, vybav si jeden okamžik, který by se nedal zachytit pouhým zapsáním času východu slunce."],
          reflect: "Kdy pro mě vlastně začal nový den?"
        },
        en: {
          title: "Stay in one place through dawn",
          when: "You can set aside a morning and reach an east-facing spot before first light.",
          steps: ["Settle somewhere comfortable in the dim light. What sounds, outlines, and movements of air can you already distinguish?", "Stay as the light changes. Attend to what gradually appears in the landscape and how you respond.", "After leaving, recall one moment that recording the time of sunrise alone could never capture."],
          reflect: "When did this new day actually begin for me?"
        }
      },
      {
        id: "east-meditation", source: "ch4", kind: "method", group: "facet",
        cz: {
          title: "Meditace za pomalé chůze",
          when: "Když chceš věnovat několik minut soustředěné pozornosti v parku nebo krajině.",
          steps: ["Zvol krátký úsek, kde můžeš bezpečně zpomalit. Vnímej půdu pod nohama i to, co se pohybuje a ozývá kolem.", "Když tě zabere myšlenka, vrať pozornost k jednomu zvuku či pohybu a znovu ji otevři celému okolí. Dovol stejnou pozornost i tomu, co se ti zpočátku zdá obyčejné."],
          reflect: "Ke kterému vjemu jsem se dnes dokázal vrátit?"
        },
        en: {
          title: "A slow walking meditation",
          when: "You want to devote a few minutes to steady attention in a park or on open land.",
          steps: ["Choose a short stretch where you can safely slow down. Sense the ground underfoot as well as the life and sounds around you.", "When a thought absorbs you, return to one sound or movement and then open your attention to the surroundings again. Give ordinary things the same attention as obvious ones."],
          reflect: "Which sensation helped me return today?"
        }
      },
      {
        id: "east-portrait", source: "ch8", kind: "method", group: "protector",
        cz: {
          title: "Portrét části, která se vyhýbá",
          when: "Pro běžnou situaci, ve které máš sklon zmizet. Třeba když se hovorem o víkendu vyhneš nepříjemné otázce.",
          steps: ["V místě, kde je ti dobře, si vybav chvíli před odbočením. Co tvoje pozornost opustila? Čemu ses chtěl vyhnout?", "Dovol svému způsobu vyhýbání, aby v představě získal podobu postavy. Načrtni ji. Jak by sama vysvětlila, co se snaží hlídat?", "Napiš jí odpověď. Oceň, co se snaží chránit, a zvaž, proč ti záleží na návratu k původnímu rozhovoru."],
          reflect: "K čemu se ve skutečnosti chci vrátit?"
        },
        en: {
          title: "Portrait of an evasive part",
          when: "Choose an everyday evasion, like bringing up the weekend when a conversation gets uncomfortable.",
          steps: ["Somewhere you feel at ease, recall the moment before you changed course. What did your attention leave? What did you hope to avoid?", "Imagine your way of evading as a figure and sketch it. How might it explain what it tries to look after?", "Write a reply to the figure. Acknowledge its protective intent and consider why the original conversation matters to you."],
          reflect: "What do I actually want to return to?"
        }
      },
      {
        id: "east-amends", source: "ch8", kind: "adaptation", group: "protector",
        cz: {
          title: "Vrátit se k nedodržené dohodě",
          when: "Když se kvůli tvému opakovanému odkládání někdo jiný nemůže pohnout z místa.",
          steps: ["Popiš si jednu konkrétní dohodu a jak tvůj odklad dopadl na druhého. Jestli důsledek neznáš, zeptej se.", "Rozliš, co ti odklad krátce poskytoval a o jaký skutečný způsob oddechu, blízkosti či podpory stojíš.", "Pojmenuj druhému svůj díl odpovědnosti. Nabídni jen takovou nápravu, u které můžeš dodržet domluvený čas."],
          reflect: "Co udělám, až se znovu objeví chuť odklidit věc z dohledu?"
        },
        en: {
          title: "Return to a broken agreement",
          when: "Repeatedly putting something off has left another person waiting on you.",
          steps: ["Name one particular agreement and what your delay meant for the other person. If you do not know its effect, ask.", "Identify what temporary relief the delay offered. What kind of rest, connection, or help would you actually welcome?", "Acknowledge your share of responsibility to the person involved. Offer a repair you can deliver when agreed."],
          reflect: "What can I do when I next want to put the matter out of sight?"
        }
      },
      {
        id: "east-first-light", source: "appendix", kind: "method", group: "facet",
        cz: {
          title: "Kruh čtyř směrů při prvním světle",
          when: "Zkus to ráno, nebo si najdi chvíli u okna během dne. Potřebuješ otázku, která připouští víc odpovědí.",
          steps: ["Zvol střed a bod směrem na východ. Ve středu vyslov otázku, jako by ses ji chystal položit někomu jinému.", "Přesuň se na východní místo. Vnímej obzor, proměnu světla a zvuky kolem. Z této pozice odpověz několika slovy, která tě opravdu napadla.", "Vrať se do středu. Všimni si, jestli tě překvapila odpověď, nebo jestli se změnila už samotná otázka."],
          reflect: "Které části celé situace jsem si prve vůbec nevšímal?",
        },
        en: {
          title: "The East of the circle at first light",
          when: "Try this at dawn or by a window during the day. Bring a question with more than one possible answer.",
          steps: ["Choose a center and a point to its east. In the center, say the question as if you were asking another person.", "Move to the eastern place. Take in the horizon, changing light and surrounding sounds. Answer in a few words that actually occur to you there.", "Return to the center. Notice whether the answer surprised you or the question itself has changed."],
          reflect: "Which part of the wider situation had escaped my notice?",
        },
      },
      {
        id: "east-sensing", source: "ch4", kind: "adaptation", group: "application",
        cz: {
          title: "Uvidět známou věc poprvé",
          when: "Na cestě, kde už skoro všechno míjíš bez povšimnutí.",
          steps: ["Zastav se u něčeho obyčejného, třeba u okapu po dešti. Všímej si okamžiku, kdy věci přidělíš jméno.", "U stejného předmětu ještě chvíli zůstaň. Sleduj jediný odlesk nebo poslouchej rozdíl mezi dvěma kapkami.", "Popiš nově objevený detail tak, aby jej někdo další dokázal najít. Pak mu dej prostor všimnout si něčeho jiného."],
          reflect: "Co se dalo zaznamenat teprve při druhém pohledu?",
        },
        en: {
          title: "See a familiar thing for the first time",
          when: "On a route where you usually pass everything without noticing.",
          steps: ["Stop at something ordinary, perhaps a gutter after rain. Notice the moment you give it a name.", "Stay with it a little longer. Follow one reflection or listen for the difference between two falling drops.", "Describe the new detail so someone else could find it. Leave room for them to notice something different."],
          reflect: "What became perceptible only on a second look?",
        },
      },
      {
        id: "east-trickster", source: "ch4", kind: "adaptation", group: "application",
        cz: {
          title: "Laskavý žert Šibala",
          when: "Když v duchu opakuješ větu s „musím vždycky“ a už ji bereš jako přírodní zákon.",
          steps: ["Napiš tu větu tak, jak ji slýcháš ve své hlavě. Vymysli kreslenou postavu, která by se jí řídila opravdu do písmene.", "Nakresli jednu scénu z jejího dne, klidně třemi čarami. Kam až by to pravidlo tu postavu zavedlo?", "Přečti si původní větu po této malé komedii. Zkus změnit jediné slovo tak, aby přibylo trochu svobody."],
          reflect: "Uvolnil mi humor cestu k něčemu obtížnému, nebo jsem tím od tématu utekl?",
        },
        en: {
          title: "The Trickster's kind joke",
          when: "A sentence starting with “I always have to” has begun to sound like a law of nature.",
          steps: ["Write the sentence as it sounds in your head. Invent a cartoon character who obeys it absolutely literally.", "Draw one scene from their day. Three lines are enough. Where would the rule take this character?", "Read the original sentence after this little comedy. Change one word to give yourself a little more room."],
          reflect: "Did humor help me approach something difficult or let me change the subject?",
        },
      },
      {
        id: "east-voices", source: "appendix", kind: "method", group: "facet",
        cz: {
          title: "Dát hlas Nevinnému mudrci",
          when: "Když o problému umíš mluvit dlouho a odpovědi znějí pořád stejně.",
          steps: ["Vyslov krátce otázku ze svého obvyklého místa. Pak změň polohu těla a vybav si někoho, kdo se dovede ptát s opravdovým úžasem.", "Zkus promluvit z té polohy v první osobě. Co tě na situaci překvapuje? Jakou otázku by položil člověk, kterému nikdo nevysvětlil zdejší pravidla?", "Vrať se do své první polohy. Vyber si otázku, kterou se odvážíš položit při skutečném rozhovoru."],
          reflect: "Kterou z mých jistot otevřela zvědavost?",
        },
        en: {
          title: "Give the Innocent/Sage a voice",
          when: "You can talk at length about a problem but keep hearing the same answers.",
          steps: ["Ask your question briefly from your usual place. Change your posture and recall someone capable of sincere wonder.", "Speak in the first person from that position. What surprises you? What would someone ask if nobody had taught them the rules here?", "Return to your first position. Choose one question you could bring to a real conversation."],
          reflect: "Which of my certainties did curiosity open up?",
        },
      },
      {
        id: "east-escape", source: "ch8", kind: "adaptation", group: "protector",
        cz: {
          title: "Všimnout si chvíle před únikem",
          when: "Třeba když během složitého e-mailu potřetí sáhneš po telefonu.",
          steps: ["Zachyť okamžik těsně před tím pohybem. Napiš, co bylo na obrazovce nebo v místnosti a jakou změnu sis od telefonu sliboval.", "Vyber něco, co v tu chvíli opravdu potřebuješ. Může to být přestávka, vysvětlení nebo pomoc s první větou.", "Zkus si o to říct přímo. Pokud si dáš pauzu, domluv si sám se sebou, kdy se k rozepsané věci vrátíš."],
          reflect: "Jaký rozdíl jsem poznal mezi zvoleným odpočinkem a odkladem, který se mi stal automaticky?",
        },
        en: {
          title: "Notice the moment before an escape",
          when: "For instance, when you reach for your phone a third time during a difficult email.",
          steps: ["Catch the moment before that movement. Note what was on the screen or going on in the room, and what you hoped the phone might change.", "Identify something you actually need just then. It could be a break, clarification or help getting the first sentence started.", "Try asking for it directly. If you choose a break, decide when you will return to what you left open."],
          reflect: "How did a freely chosen rest differ from a delay that happened on autopilot?",
        },
      },
      {
        id: "east-contemplation", source: "ch4", kind: "adaptation", group: "application",
        cz: {
          title: "Chvíle ticha u okna",
          when: "Když chceš ráno věnovat dvě minuty meditaci nebo tiché modlitbě.",
          steps: ["Posaď se u okna nebo venku. Vyber si jednu věc, kterou právě osvětluje denní světlo.", "Chvíli ji pozoruj. Když tě napadne, jak ji nazvat nebo k čemu je, vrať se k jedné barvě, změně světla či pohybu.", "Na závěr můžeš vyslovit krátkou modlitbu nebo vlastními slovy poděkovat za jednu věc, které sis všiml."],
          reflect: "Co jsem uviděl až ve chvíli, kdy jsem zůstal o trochu déle?"
        },
        en: {
          title: "A quiet moment by the window",
          when: "When you want to give two minutes of your morning to meditation or quiet prayer.",
          steps: ["Sit by a window or outdoors. Choose something daylight is touching right now.", "Watch it for a little while. When a name or a use for it comes to mind, return to a colour, a shift in light, or a movement.", "You can finish with a short prayer or say thank you in your own words for one detail that caught your eye."],
          reflect: "What did I see only because I stayed a little longer?"
        }
      },
      {
        id: "east-paradox", source: "essay", kind: "adaptation", group: "application",
        cz: {
          title: "Podržet dvě pravdy",
          when: "Hodí se ve chvíli, kdy o nějaké situaci slýcháš dvě zdánlivě neslučitelné věty.",
          steps: ["Vyber běžnou situaci. Můžeš se třeba těšit na společný víkend a zároveň toužit chvíli nemluvit.", "Každou zkušenost napiš jako samostatnou větu. Obě přečti spojené slovem „a“. Chvíli poslouchej, co to udělá s jejich významem.", "Najdi konkrétní prostor pro obě. Oznámit, že přijdeš na večeři a ráno vyrazíš na krátkou procházku sám, může být dost."],
          reflect: "Jaká třetí možnost se objevila, když jsem přestal vybírat vítěze?",
        },
        en: {
          title: "Hold two truths",
          when: "Two apparently incompatible accounts of a situation both ring true.",
          steps: ["Pick an everyday example. Perhaps you look forward to a weekend together and also long for some quiet.", "Give each experience a sentence. Read them aloud joined with “and.” Listen for a shift in how they sound together.", "Make practical room for both. You might join the dinner and tell people you will take a short walk alone in the morning."],
          reflect: "What third possibility appeared when I stopped trying to pick a winner?",
        },
      },
    ],
  },
};
