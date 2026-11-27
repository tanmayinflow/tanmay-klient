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

export const NORTH_EAST_STUDY = {
  north: {
    reading: {
      cz: "V Divoké mysli otevři 2. kapitolu na str. 33, pro práci s věrnými vojáky 6. kapitolu na str. 129. Sever se učíš poznat podle toho, komu tvoje péče dává víc prostoru jednat.",
      en: "In Wild Mind, chapter 2 starts on p. 33 and chapter 6 on Loyal Soldiers starts on p. 127. Watch for the kind of care that leaves someone more able to act for themselves.",
    },
    sources: [czechBook, appendix, animas, essay],
    practices: [
      {
        id: "north-circle", source: "appendix", kind: "method",
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
        id: "north-soldier", source: "appendix", kind: "method",
        cz: {
          title: "Uvítat věrného vojáka",
          when: "Když i drobný přešlap spustí přísný vnitřní příkaz. Zkus to na běžné příhodě.",
          steps: ["Zachyť jeho přesná slova. Můžeš třeba slyšet „ještě to neposílej, určitě tam něco je“. Dej hlasu vlastní jméno.", "Zeptej se, čemu se snaží předejít. Odpověz mu jako dospělý, který zná dnešní okolnosti. Pojmenuj konkrétní pomoc nebo dovednost, kterou máš nyní k dispozici.", "Poděkuj za službu. Sám rozhodni, kdy jeho pozornost využiješ, třeba při poslední kontrole. Teď vyzkoušej jeden vlastní krok."],
          reflect: "Co ve varování mělo cenu a o čem si chci rozhodnout sám?",
        },
        en: {
          title: "Welcome a Loyal Soldier home",
          when: "Try an ordinary mistake that sets off a surprisingly stern inner order.",
          steps: ["Catch its exact words. It might say, “Don't send that yet. You missed something.” Give the voice a name of your own.", "Ask what it is trying to prevent. Answer as the adult who knows today's circumstances. Name a specific skill or source of support available to you now.", "Thank it for its service. Decide when its attention could help, perhaps on a final check. Take one step of your own choosing."],
          reflect: "Which part of its warning was useful, and which decision belongs to me?",
        },
      },
      {
        id: "north-consent", source: "czech", kind: "adaptation",
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
        id: "north-land", source: "essay", kind: "adaptation",
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
        id: "north-competence", source: "czech", kind: "adaptation",
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
        id: "north-gratitude", source: "czech", kind: "adaptation",
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
        id: "north-journal", source: "journal", kind: "adaptation",
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
    sources: [map, essay, appendix, animas, czechBook],
    practices: [
      {
        id: "east-first-light", source: "appendix", kind: "method",
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
        id: "east-sensing", source: "map", kind: "adaptation",
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
        id: "east-trickster", source: "essay", kind: "adaptation",
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
        id: "east-voices", source: "appendix", kind: "method",
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
        id: "east-escape", source: "journal", kind: "adaptation",
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
        id: "east-contemplation", source: "appendix", kind: "adaptation",
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
        id: "east-paradox", source: "essay", kind: "adaptation",
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
