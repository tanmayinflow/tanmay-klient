const book = {
  id: "book",
  title: "Bill Plotkin · Wild Mind (2013)",
  url: "https://www.wildmindbook.com/wp-content/uploads/Wild-Mind-Excerpts.pdf",
};

const czechEdition = {
  id: "czech-edition",
  title: "Bill Plotkin · Divoká mysl (Maitrea, 2016)",
  url: "https://dwn.alza.cz/ebook/nahled/pdf/EK29383",
};

const companion = {
  id: "companion",
  title: "Bill Plotkin · Four Practices for Wholing and Self-Healing",
  url: "https://learningforchange.net/wp-content/uploads/2018/08/Four-Practices-for-Wholing-and-Self-Healing.pdf",
};

const fieldNotes = {
  id: "field-notes",
  title: "Animas Valley Institute · Wild Mind Intensive, Preparation",
  url: "https://www.animas.org/wp-content/uploads/21SEPWMI-LGBTQ_Prep-Letter.pdf",
};

const interview = {
  id: "interview",
  title: "Bill Plotkin · Warrior Films, Rites of Passage (1:18–1:25)",
  url: "https://warriorfilms.org/wp-content/uploads/2016/04/Bill-Plotkin-Interview_Warrior-Films_Rites-of-Passage.pdf",
};

const summer = {
  id: "summer",
  title: "Animas Valley Institute · Cultivating Our South Facet of Human Wholeness",
  url: "https://myemail.constantcontact.com/Cultivating-Wholeness--Summer----SM-441--Bill-Plotkin--Weekly-Soulcraft-Musings.html?aid=OvYQSlnRZ5Q&soid=1102010840526",
};

const courting = {
  id: "courting",
  title: "Animas Valley Institute · Courting the Muse-Beloved",
  url: "https://www.animas.org/offerings/1148/courting-the-muse-beloved-online-april-2026/",
};

export const SOUTH_WEST_STUDY = {
  south: {
    reading: {
      cz: "Divoká mysl, české vydání 2016. Kapitola 3 od s. 53 představuje divokého domorodce, kapitola 7 od s. 157 zraněné děti. Autorův doprovodný text rozvíjí hlas Jihu na s. 3 a práci v kruhu na s. 11–13.",
      en: "Wild Mind, 2013 edition. Chapter 3 begins on p. 51 with the Wild Indigenous One. Chapter 7 turns to Wounded Children on p. 153. In the companion text, see p. 3 for the voice of South and pp. 11–13 for the directions circle.",
    },
    sources: [book, czechEdition, companion, fieldNotes, interview, summer],
    practices: [
      {
        id: "south-circle", source: "companion", kind: "method",
        cz: {
          title: "Jižní místo v kruhu",
          when: "Když už víš, co si o určité věci myslíš, ale nevíš, co cítíš.",
          steps: [
            "Vyznač si střed a kousek od něj jih. Stačí dvě místa na podlaze nebo dvě značky na stole. Ve středu vyslov konkrétní otázku z dneška.",
            "Přesuň se na jih. Všimni si, kde se otázka ozývá v těle. Ze stejného místa ji vyslov znovu, tentokrát slovy pocitu. Třeba „je mi smutno, že ten strom pokáceli“.",
            "Vrať se do středu. Dopiš si vedle rozumových důvodů také to, co jsi cítil. Rozhodnutí může počkat.",
          ],
          reflect: "Jakou informaci bys ztratil, kdybys odpovídal pouze hlavou?",
        },
        en: {
          title: "The southern place in the circle",
          when: "When you know what you think about something and want to hear what you feel.",
          steps: [
            "Mark a center and a place to its south. Two spots on the floor or two markers on a table will do. At the center, say one specific question from your day aloud.",
            "Shift to the southern place. Notice where the question registers in your body. Speak again from there in feeling words. For example, “I feel sad that the tree came down.”",
            "Return to the center. Write the feeling beside the reasons you already had. You can leave the decision open.",
          ],
          reflect: "What would an answer based on reasoning alone have missed?",
        },
      },
      {
        id: "south-neighbours", source: "field-notes", kind: "method",
        cz: {
          title: "Poznat živého souseda",
          when: "Cestou domů, u otevřeného okna nebo na místě, kam se můžeš vrátit.",
          steps: [
            "Vyber si konkrétního živého souseda. Může to být kos, který převrací listí, nebo bříza u zastávky. Zůstaň v takové vzdálenosti, aby se kvůli tobě nic nemuselo dát na útěk.",
            "Sleduj jedno dění dost dlouho na to, aby tě něčím překvapilo. Zapiš, co jsi skutečně viděl nebo slyšel, a zvlášť, jak na to odpovědělo tvoje tělo.",
            "Vrať se jindy. Pod předchozí zápis přidej jednu změnu. Ať o podobě další návštěvy rozhodne i to, co tam žije.",
          ],
          reflect: "Co o svém sousedovi víš díky tomu, že ses vrátil?",
        },
        en: {
          title: "Get to know a living neighbour",
          when: "On the way home, at an open window, or anywhere you can revisit.",
          steps: [
            "Choose one neighbour. It might be a blackbird turning leaves or the birch by a bus stop. Give it enough space to carry on with its day.",
            "Watch one activity long enough for it to surprise you. Write down what you actually heard or saw, then what happened in your body as you watched.",
            "Come back another day. Add one change to your first observation. Let what lives there influence how you visit next time.",
          ],
          reflect: "What do you know about this neighbour because you came back?",
        },
      },
      {
        id: "south-reciprocity", source: "summer", kind: "method",
        cz: {
          title: "Kdo si všímá mě?",
          when: "Venku, když tě na chvíli zaujme jiné živé stvoření.",
          steps: [
            "Zastav se v přiměřené vzdálenosti třeba u vrabce na plotě. Všimni si, co přesně tě na něm upoutalo.",
            "Obrať na chvíli pozornost. Jak asi z tohoto místa působí tvůj stín, pohyb nebo hlas? V duchu si připusť, že i ty můžeš být pro někoho zajímavý.",
            "Vrať se k tomu, co opravdu vidíš. Pokud zvíře kvůli tobě zpozornělo, dopřej mu prostor. Všimni si, co se s tebou stalo ve chvíli, kdy ses sám cítil být součástí výjevu.",
          ],
          reflect: "Co jsi na tom místě uviděl jinak, když ses zahrnul do obrazu?",
        },
        en: {
          title: "Who might notice me?",
          when: "Outdoors when another living being catches your attention.",
          steps: [
            "Pause at a respectful distance, perhaps near a sparrow on a fence. What exactly made you turn toward it?",
            "Reverse your attention for a moment. How might your shadow, movement, or voice register here? Entertain the possibility that you too could be interesting to someone.",
            "Return to what you can observe. If the animal has become alert to you, give it room. Notice what it felt like to include yourself in the scene.",
          ],
          reflect: "What changed in your sense of the place when you included your own presence?",
        },
      },
      {
        id: "south-emotion", source: "interview", kind: "adaptation",
        cz: {
          title: "Co mi říká tenhle pocit?",
          when: "Ve chvíli, kdy můžeš v klidu prozkoumat podráždění, radost nebo smutek.",
          steps: [
            "Vybav si drobnou událost z dneška. Popiš první tělesný vjem. „Sevřela se mi čelist“ je dobré východisko.",
            "Zkus k vjemu přiřadit pocit. Zeptej se, na čem ti v té chvíli záleželo. Pod hněvem kvůli přerušení může být přání dokončit větu.",
            "Vymysli dvě možné odpovědi. Zvaž jejich dopad a jednu si vyber, případně se rozhodni vyčkat.",
          ],
          reflect: "Co sis o sobě díky pocitu uvědomil a co s tím chceš udělat?",
        },
        en: {
          title: "What does this feeling tell me?",
          when: "When you have a quiet moment with irritation, joy, or sadness.",
          steps: [
            "Recall a small event from today. Describe the first bodily sensation. “My jaw tightened” is a good starting point.",
            "Try a feeling word. Ask what mattered to you at the time. Anger about an interruption might point to wanting to finish a sentence.",
            "Think of two possible responses. Consider their effects and choose one, including the option to wait.",
          ],
          reflect: "What did the feeling tell you about yourself, and what do you want to do with that?",
        },
      },
      {
        id: "south-play", source: "book", kind: "adaptation",
        cz: {
          title: "Nechat rytmus přejít do těla",
          when: "Když se pohyb proměnil hlavně ve výkon nebo v povinnost.",
          steps: [
            "Najdi opakující se rytmus v okolí. Může to být déšť na parapetu nebo tráva, která se střídavě sklání a narovnává.",
            "Odpověz mu malým pohybem prstů, ramen nebo celého těla. Pozměň jeho tempo nebo rozsah podle toho, co je příjemné.",
            "Chvíli si hraj. Všimni si okamžiku, kdy tě napadne pohyb hodnotit. Pak si sám vyber poslední gesto.",
          ],
          reflect: "Který pohyb bys udělal ještě jednou čistě pro radost?",
        },
        en: {
          title: "Let a rhythm into your body",
          when: "When movement has become mostly a duty or a performance.",
          steps: [
            "Find a repeating rhythm nearby, perhaps rain on a sill or grass dipping and rising in the wind.",
            "Answer it with your fingers, shoulders, or whole body. Change the speed or range to suit what feels good.",
            "Play for a while. Notice the moment you start assessing your movement. Choose a final gesture of your own.",
          ],
          reflect: "Which gesture would you do again for the sheer pleasure of it?",
        },
      },
      {
        id: "south-desire", source: "book", kind: "adaptation",
        cz: {
          title: "Všimnout si vlastní touhy",
          when: "Když při běžném rozhodování automaticky vyhovíš druhým.",
          steps: [
            "Vyber si jednoduchou nabídku, třeba hudbu, chuť nebo místo k sezení. Dej si chvíli na to, aby ses k ní mohl přiblížit, vzdálit se nebo zůstat na místě.",
            "Zachyť rozdíl mezi „tohle bych měl chtít“ a skutečnou zvědavostí. Pojmenuj, co přesně tě láká a kde cítíš svoji hranici.",
            "Řekni nahlas jednu vlastní volbu. Týká-li se i druhého člověka, vyslov ji jako nabídku a nech mu prostor pro jeho odpověď.",
          ],
          reflect: "Podle čeho dnes poznáš svoje vlastní ano?",
        },
        en: {
          title: "Notice a desire of your own",
          when: "When you tend to agree with other people's preferences automatically.",
          steps: [
            "Choose something ordinary on offer, perhaps music, a flavour, or a place to sit. Give yourself a moment to draw closer, move away, or stay where you are.",
            "Notice the difference between an expected preference and genuine curiosity. Name what attracts you and where your limit lies.",
            "Say one choice aloud. If it involves another person, offer it as an invitation and leave room for their answer.",
          ],
          reflect: "How do you recognise your own yes today?",
        },
      },
      {
        id: "south-younger-voice", source: "companion", kind: "method",
        cz: {
          title: "Odpovědět mladší části ze Severu",
          when: "Když tě v obyčejné situaci zabolelo, že tě někdo přehlédl.",
          steps: [
            "Na jihu kruhu polož předmět, který bude zastupovat mladší část tebe. V jedné větě řekni, co by dnes chtěla, aby někdo slyšel.",
            "Z místa na severu jí odpověz jako pečující dospělý. Použij vlastní slova. Může stačit uznání, že být ve skupině bez povšimnutí bolí.",
            "Vrať se doprostřed. Vyber si jedno gesto péče, které máš dnes ve svých rukou. Třeba požádat o chvíli nerušeného rozhovoru.",
          ],
          reflect: "Jakou péči si můžeš skutečně dopřát nebo si o ni říct?",
        },
        en: {
          title: "Answer a younger part from the North",
          when: "When being overlooked in an ordinary situation has stung.",
          steps: [
            "Place an object in the south of your circle for that younger part of you. In one sentence, say what it wants someone to hear today.",
            "From a spot in the north, answer as a caring adult. Use your own words. An acknowledgement that it hurts to be overlooked in a group may be enough.",
            "Return to the center. Choose one act of care within your reach today, such as asking for a few minutes of uninterrupted conversation.",
          ],
          reflect: "What care can you actually offer yourself or ask someone for?",
        },
      },
    ],
  },
  west: {
    reading: {
      cz: "Divoká mysl, české vydání 2016. Kapitola 5 od s. 99 zkoumá Múzu a Milovaného, kapitola 9 od s. 213 stín a stínová já. Pro práci se sny odkazuje Plotkin také na Soulcraft, anglické vydání 2003, s. 129–145.",
      en: "Wild Mind, 2013 edition. Chapter 5 begins on p. 97 with the Muse-Beloved. Chapter 9 explores the Shadow and shadow selves from p. 207. For his approach to dreams, Plotkin also points to Soulcraft (2003), pp. 129–145.",
    },
    sources: [book, czechEdition, companion, fieldNotes, courting],
    practices: [
      {
        id: "west-dream", source: "field-notes", kind: "method",
        cz: {
          title: "Udržet sen v paměti",
          when: "Po probuzení, když zůstala třeba jen barva, místo nebo gesto.",
          steps: [
            "Zachyť nejživější úlomek snu v přítomném čase. Ke slovům „čekám u zavřených dveří“ přidej, jaké je světlo a jaké to je čekat.",
            "Dej záznamu pracovní název podle obrazu. Vlastní dohady připisuj až pod záznam, aby šlo později poznat, co se ti skutečně zdálo.",
            "V průběhu dne se k obrazu vrať. Připiš, který detail ti utkvěl a jak s odstupem působí.",
          ],
          reflect: "Co ti sen dovolil zahlédnout, když jsi mu nedal okamžitý výklad?",
        },
        en: {
          title: "Keep a dream in reach",
          when: "On waking, even when only a colour, place, or gesture remains.",
          steps: [
            "Catch the most vivid fragment in the present tense. To “I am waiting at a closed door,” add what the light is like and how it feels to wait.",
            "Give the entry a working title taken from the image. Put any guesses underneath so you can later recognise what you actually dreamed.",
            "Return to the image during the day. Add which detail stayed with you and how it feels a few hours later.",
          ],
          reflect: "What did you notice when you gave the dream time before interpreting it?",
        },
      },
      {
        id: "west-dream-encounter", source: "companion", kind: "method",
        cz: {
          title: "Setkat se s postavou ze snu",
          when: "Když si dobře vybavuješ snovou scénu a chceš se k ní dobrovolně vrátit.",
          steps: [
            "Vrať se v představě k místu ze snu, jak si je pamatuješ. Vnímej vzdálenost, zvuky a světlo. Jestli se vybaví jen slova, pro dnešek zůstaň u zápisu.",
            "Obrať se k jedné postavě, zvířeti nebo věci. Polož otázku, která vychází z této scény. U zavřených dveří tě třeba napadne „Co tady hlídáš?“ Dej prostor i tichu.",
            "Rozhlédni se kolem sebe. Zvlášť zapiš původní sen a zvlášť to, co se objevilo teď v představě.",
          ],
          reflect: "Co tě na tom setkání překvapilo?",
        },
        en: {
          title: "Meet a figure from a dream",
          when: "When a dream scene is vivid and you feel willing to revisit it.",
          steps: [
            "Return in imagination to the setting as you remember it. Notice distance, sound, and light. If all you have today are words, keep those in your journal.",
            "Address one figure, animal, or object. Ask something particular to this encounter. At a closed door you might ask, “What are you guarding?” Leave room for silence.",
            "Look around the room again. Record the original dream and what arose in waking imagination separately.",
          ],
          reflect: "What surprised you about the encounter?",
        },
      },
      {
        id: "west-courting", source: "courting", kind: "adaptation",
        cz: {
          title: "Dopis vnitřnímu Milovanému",
          when: "Když tě opakovaně přitahuje hlas, obraz nebo kvalita, pro kterou dosud nemáš jméno.",
          steps: [
            "Vybav si jedno setkání s tou kvalitou. Jak zněla, jak se pohybovala, v čem přesně byla přitažlivá?",
            "Napiš té kvalitě krátký dopis jako někomu, koho teprve poznáváš. Polož jí jednu skutečnou otázku. Dopis je určený pro tvůj zápisník.",
            "Přečti ho nahlas. Zakroužkuj větu, která zní nejvíc jako tvoje vlastní přání. Jak bys jí dal místo ve svém dni?",
          ],
          reflect: "Kterou hledanou vlastnost můžeš sám začít projevovat?",
        },
        en: {
          title: "A letter to the Inner Beloved",
          when: "When a voice, image, or quality you cannot quite name keeps drawing you back.",
          steps: [
            "Recall one encounter with that quality. How did it sound or move? What exactly drew you?",
            "Write to that quality as to someone you are just getting to know. Ask one question you mean. The letter is for your own notebook.",
            "Read it aloud. Circle the line that sounds most like a longing of your own. How might you make room for it today?",
          ],
          reflect: "Which quality you long for could you begin to express yourself?",
        },
      },
      {
        id: "west-projection", source: "courting", kind: "adaptation",
        cz: {
          title: "Prozkoumat obdiv nebo odpor",
          when: "Když v tobě někdo opakovaně vyvolává neobyčejně silnou odezvu.",
          steps: [
            "Popiš jednu pozorovatelnou věc, kterou člověk udělal. Na jiný řádek napiš, jakou vlastnost jsi mu přiřkl. „Vstoupila do hovoru“ a „je nebojácná“ jsou dva různé údaje.",
            "Zkus najít okamžik, kdy se podobná vlastnost projevila u tebe nebo kdy bys ji rád uplatnil. Pokud příklad nenajdeš, nech otázku otevřenou.",
            "Rozliš, co si můžeš vyzkoušet sám a jakou hranici chceš vůči druhému člověku zachovat. Pro oboje může být dobrý důvod.",
          ],
          reflect: "Co přibylo k tvému pohledu na sebe a co stále platí o té konkrétní události?",
        },
        en: {
          title: "Explore admiration or aversion",
          when: "When someone repeatedly brings out an unusually strong response in you.",
          steps: [
            "Describe one observable action. On another line put the quality you attributed to the person. “She entered the conversation” and “she is fearless” are different kinds of information.",
            "Look for a time when you expressed a similar quality or wished you could. If you find no example, leave the question open.",
            "Distinguish what you might explore in yourself from any boundary you want to keep with the other person. There may be good reasons for both.",
          ],
          reflect: "What have you learned about yourself, and what remains true about the event?",
        },
      },
      {
        id: "west-image-form", source: "courting", kind: "adaptation",
        cz: {
          title: "Dát vnitřnímu obrazu tvar",
          when: "Když tě pronásleduje útržek snu nebo nápad, který zatím neumíš vysvětlit.",
          steps: [
            "Vyber si detail, který by chyběl, kdybys ho vypustil. Může to být třeba jediná zelená nit v šedém kabátě.",
            "Dej detailu jinou podobu. Nakresli ho jedním tahem, zahraj jeho rytmus nebo napiš tři řádky, ve kterých ta nit něco dělá.",
            "Polož vedle sebe původní obraz a nový výtvor. Pojmenuj jeden překvapivý rozdíl a rozhodni se, jestli se k němu zítra vrátíš.",
          ],
          reflect: "Co se dalo objevit až při samotném tvoření?",
        },
        en: {
          title: "Give an inner image a form",
          when: "When a fragment of dream or an idea you cannot yet explain keeps returning.",
          steps: [
            "Choose the detail you would miss if it disappeared. It might be a single green thread in a grey coat.",
            "Give that detail another form. Draw it in one line, play its rhythm, or write three lines in which the thread does something.",
            "Place your original description beside what you made. Name one unexpected difference. Decide whether you want to return to it tomorrow.",
          ],
          reflect: "What could you discover only by making something?",
        },
      },
      {
        id: "west-shadow-circle", source: "companion", kind: "method",
        cz: {
          title: "Přizvat ke stínu východního Mudrce",
          when: "Když máš konkrétní tušení o vlastnosti, kterou u sebe těžko rozpoznáváš.",
          steps: [
            "Na kartičku napiš zkoumanou vlastnost s otazníkem, třeba „odvaha?“. Polož ji blízko západního okraje svého kruhu.",
            "Přejdi na protější stranu, k východnímu Mudrci. Z téhle perspektivy oslov vlastnost zvědavě. Zeptej se třeba, podle jakého drobného činu by ji ve tvém dni rozpoznal přítel.",
            "Vrať se do středu a zapiš si jednu situaci, v níž se po tom můžeš příště podívat. Až nastane, porovnej očekávání s tím, co se skutečně přihodilo.",
          ],
          reflect: "Co by tvé tušení mohlo podpořit a co by tě přimělo je přehodnotit?",
        },
        en: {
          title: "Invite the eastern Sage to meet a shadow",
          when: "When you have a particular hunch about a quality you find hard to see in yourself.",
          steps: [
            "Write the possible quality on a card with a question mark, perhaps “courage?”. Place it near the western edge of your circle.",
            "Move opposite it, to the Sage in the east. Address the quality with curiosity. You might ask what small action would help a friend recognise it in your day.",
            "Come back to the center and name one occasion to look again. When it arises, compare your expectation with what actually happened.",
          ],
          reflect: "What might support your hunch, and what might make you reconsider?",
        },
      },
      {
        id: "west-dusk", source: "companion", kind: "method",
        cz: {
          title: "Položit otázku za soumraku",
          when: "Večer, když se ti nějaké rozhodnutí pořád vrací ve stejné podobě.",
          steps: [
            "U okna nebo na známém místě si označ střed a západ. Ve středu řekni, před čím stojíš. Pak se přesuň k západu a chvíli sleduj proměnu světla.",
            "Jaký obraz by mohl vystihnout tvoji situaci? Může se objevit zazděné okno nebo most bez druhého břehu. Poznamenej si vlastní obraz.",
            "Vrať se doprostřed. Co ti obraz umožnil zeptat se jinak? Třeba „Který břeh mi chybí?“ může otevřít rozhovor, který jsi odkládal.",
          ],
          reflect: "Jaká nová otázka zůstává i po návratu do všedního dne?",
        },
        en: {
          title: "Bring a question to dusk",
          when: "In the evening, when a decision keeps returning in the same familiar form.",
          steps: [
            "At a window or in a familiar spot, mark a center and a western place. At the center, say what you are facing. Move west and watch the light change.",
            "What image might hold the situation? A bricked-up window or a bridge missing its far bank are possibilities. Record the image that comes to you.",
            "Return to the center. What can you now ask differently? “Which bank is missing?” might open a conversation you have put off.",
          ],
          reflect: "Which new question remains when you return to everyday life?",
        },
      },
    ],
  },
};
