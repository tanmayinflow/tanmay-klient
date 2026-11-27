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

function bookChapter(number, title, page) {
  return {
    id: `chapter-${number}`,
    title: `Bill Plotkin · Wild Mind (2013), ${number}. ${title}`,
    url: `https://books.google.com/books?id=OczmHOQi5zsC&pg=PA${page}`,
  };
}

const wildOne = bookChapter(3, "The Wild Indigenous One", 51);
const muse = bookChapter(5, "The Muse-Beloved", 97);
const children = bookChapter(7, "Wounded Children", 153);
const shadow = bookChapter(9, "The Shadow and Shadow Selves", 207);

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
      cz: "Divoká mysl (Maitrea, 2016). Kapitola 3 od s. 53 probírá tělesné prožívání emocí, jižní procházky a rozhovory s mimolidským světem. Kapitola 7 od s. 157 sleduje zraněné děti a vztahové role sirotka. Procházka ke zraněnému místu předchází náročnějšímu tématu, jak může zkušenost zranění ovlivnit životní povolání.",
      en: "Wild Mind (2013). Chapter 3, from p. 51, covers emotional assimilation, South walks, and conversations with the other-than-human world. Chapter 7, from p. 153, explores Wounded Children and the interpersonal Orphan roles. The wound walk precedes a more demanding discussion of how a wound can shape a life calling.",
    },
    sources: [wildOne, children, czechEdition, companion, fieldNotes, summer],
    practices: [
      {
        id: "south-walk", source: "chapter-3", kind: "method", group: "facet",
        cz: {
          title: "Procházka smysly Jihu",
          when: "Když projdeš známou cestu a pak si sotva vybavíš, co se kolem tebe dělo.",
          steps: [
            "Na přístupné cestě venku zpomal u něčeho, co právě zaujalo tvé smysly. Může to být bzučení nad záhonem nebo chlad přicházející od vody.",
            "Zkus chvíli sledovat, jak se s proměnou okolí mění tvoje tělo. Kam se samy otočí oči? Při kterém zvuku povolí ramena?",
            "Při návratu zachyť okamžik, kdy ses tu cítil doma nebo jako host. Zapiš jeden detail přímo z toho místa.",
          ],
          reflect: "Kterou část cesty bys příště chtěl projít pomaleji?",
        },
        en: {
          title: "A South walk through the senses",
          when: "When you cross familiar ground and can barely remember what was happening around you.",
          steps: [
            "Slow down on an accessible outdoor route when something catches your senses. Perhaps bees hum above a flower bed, or cool air rises off the water.",
            "Follow the way your body responds as the surroundings change. Where do your eyes turn? At which sound do your shoulders drop?",
            "On your way back, recall a moment when you felt at home here, or felt yourself a guest. Write down a detail from that place.",
          ],
          reflect: "Which stretch would you like to travel more slowly next time?",
        },
      },
      {
        id: "south-conversation", source: "chapter-3", kind: "method", group: "facet",
        cz: {
          title: "Rozhovor s živým světem",
          when: "Když si chceš vytvořit vztah ke konkrétnímu místu nebo bytosti.",
          steps: [
            "Zastav se tam, kde tě přirozeně něco přitahuje. Rostlině, kusu skály nebo proudu vody věnuj pár minut a podívej se, co se u nich skutečně děje.",
            "Oslov svůj protějšek nahlas. Co ti na něm připadá zvláštní? Pak mlč a naslouchej. Všímej si zvuku, změny světla i představ, které se objevují.",
            "Pokud chceš, vezmi si znovu slovo. Než odejdeš, poděkuj. Do zápisníku dej vedle sebe dvě věci: čeho sis všiml v okolí a co sis přitom představil.",
          ],
          reflect: "Čím tě tenhle soused překvapil a co o něm chceš ještě poznat?",
        },
        en: {
          title: "A wild conversation",
          when: "When you want to get to know a particular being or place.",
          steps: [
            "Pause where something catches your interest. Give a plant, rock face, or stream a few minutes of attention. What is actually happening there?",
            "Address it aloud. What strikes you about it? Then listen. Notice sounds and changes in light, and give any image that occurs to you time to develop.",
            "Speak again if you wish. Before leaving, offer thanks. In your notes distinguish one detail you observed from something you imagined in response.",
          ],
          reflect: "How did this neighbour surprise you, and what would you like to know about it?",
        },
      },
      {
        id: "south-wound-walk", source: "chapter-7", kind: "method", group: "protector",
        cz: {
          title: "Procházka ke zraněnému místu",
          when: "Pro klidný den, kdy máš přístup k vnitřní opoře a můžeš si zvolit, čemu se věnovat.",
          steps: [
            "Vyjdi ven a připomeň si zdroje ze všech čtyř stran. Zastav se u něčeho, co v tobě budí soucit. Může to být letitá jizva na kmeni nebo místo poničené stavbou.",
            "Pojmenuj, co na místě vidíš. Máš-li chuť, pověz mu o vlastní snesitelné zkušenosti. Naslouchej s péčí, jakou bys věnoval někomu blízkému.",
            "Jakou péči díky této zkušenosti dnes dovedeš nabídnout? Odpověď může zůstat otevřená. Před návratem si všimni něčeho v okolí, co tě vrací do přítomnosti.",
          ],
          reflect: "Co zaslouží péči teď a co si přeješ ponechat na jindy?",
        },
        en: {
          title: "A wound walk",
          when: "For a settled day when you can draw on inner support and choose what to explore.",
          steps: [
            "Outdoors, recall a resource from each direction. Pause at something that evokes compassion, perhaps an old scar in a trunk or a clearing damaged by construction.",
            "Name what you see there. If you wish, tell the place about a manageable experience of your own. Listen with the care you would extend to someone close.",
            "What care can you offer today in light of that experience? Leave the question open if you wish. Notice something around you that brings you back to the present.",
          ],
          reflect: "What needs care now, and what would you like to leave for another day?",
        },
      },
      {
        id: "south-orphan-need", source: "chapter-7", kind: "method", group: "protector",
        cz: {
          title: "Najít potřebu za rolí sirotka",
          when: "Když například přistihneš sebe sama, jak souhlasíš jen ze strachu, že vypadneš z party.",
          steps: [
            "Popiš jeden okamžik. Co jsi udělal, co sis přál a čeho ses obával? Plotkinův sirotek je pojmenování pro osvojovaný způsob, jak si zajistit potřeby.",
            "Vybav si dospělého, kterému bys s tím věřil. Jak by vzal tvoji potřebu přijetí vážně? Napiš vlastní slova, kterými by sis o ni mohl říct.",
            "Vyzkoušej malý krok. Můžeš například navrhnout příští setkání a zároveň poctivě říct, že ti dnešní program nevyhovuje.",
          ],
          reflect: "Jaké jednání ti dovolilo zůstat v kontaktu a přitom vyslovit vlastní přání?",
        },
        en: {
          title: "Find the need behind an Orphan role",
          when: "When you catch yourself going along with something for fear of losing your place in a group.",
          steps: [
            "Describe one moment. What did you do, want, and fear? Plotkin uses Orphan for a learned way of trying to meet a need.",
            "Imagine an adult you could trust with this. What would taking your need to belong seriously sound like? Write a request you could actually make.",
            "Try one small action. You might suggest another meeting while honestly saying that today’s plans do not suit you.",
          ],
          reflect: "What helped you stay in touch and express your own wish?",
        },
      },
      {
        id: "south-circle", source: "companion", kind: "method", group: "facet",
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
        id: "south-neighbours", source: "field-notes", kind: "method", group: "facet",
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
        id: "south-reciprocity", source: "summer", kind: "method", group: "facet",
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
        id: "south-emotion", source: "chapter-3", kind: "method", group: "facet",
        cz: {
          title: "Čtyři kroky zpracování emoce",
          when: "Ve chvíli, kdy můžeš v klidu prozkoumat podráždění, radost nebo smutek.",
          steps: [
            "Jih. Dej pocitu tělesný tvar. Co udělají ruce, hlas nebo dech, když smíš na chvíli zůstat u toho, co se stalo?",
            "Západ. Co tvoje reakce prozrazuje o tvém očekávání nebo přání? Třeba tě při přerušení rozhovoru píchlo u srdce, protože ti záleželo na tom přiznat chybu.",
            "Sever. Co chceš sdělit nebo udělat ve vztahu k druhým? Můžeš požádat o pár nerušených minut, omluvit se nebo dát najevo radost.",
            "Východ. S odstupem se podívej na celý příběh. Co se při podobných příležitostech opakuje? Objevil se tentokrát prostor i pro lehkost?",
          ],
          reflect: "Co sis o sobě díky pocitu uvědomil a co s tím chceš udělat?",
        },
        en: {
          title: "Four steps of emotional assimilation",
          when: "When you have a quiet moment with irritation, joy, or sadness.",
          steps: [
            "South. Let the feeling take bodily form. What do your hands, voice, or breath do if you stay with what happened for a moment?",
            "West. What wish or expectation does your response reveal? An interruption might sting because you were just about to admit a mistake.",
            "North. What might you say or do in the relationship? You could ask for a few uninterrupted minutes, offer an apology, or express delight.",
            "East. Later, look back at the whole exchange. Does it belong to a familiar pattern, and is there room for a little lightness this time?",
          ],
          reflect: "What did the feeling tell you about yourself, and what do you want to do with that?",
        },
      },
      {
        id: "south-play", source: "chapter-3", kind: "adaptation", group: "application",
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
        id: "south-desire", source: "chapter-3", kind: "adaptation", group: "application",
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
        id: "south-younger-voice", source: "companion", kind: "method", group: "protector",
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
      cz: "Divoká mysl (Maitrea, 2016). V kapitole 5 od s. 99 najdeš oslovení Múzy, procházky s vnitřním Milovaným a tvorbu. Kapitola 9 od s. 213 se věnuje stínu, projekci a přenosu. Končí autorovou osobní zkušeností s náročnou snovou postavou. Své pojetí práce se sny rozvádí také v Soulcraft (2003), s. 129–145.",
      en: "Wild Mind (2013). Chapter 5, from p. 97, explores calling on the Muse, walking with the Inner Beloved, and creating art. Chapter 9, from p. 207, covers Shadow, projection, and transference. It closes with the author’s personal account of a challenging dream figure. For more on his approach to dreams, see Soulcraft (2003), pp. 129–145.",
    },
    sources: [muse, shadow, czechEdition, companion, fieldNotes, courting],
    practices: [
      {
        id: "west-ask-muse", source: "chapter-5", kind: "method", group: "facet",
        cz: {
          title: "Přinést otázku Múze",
          when: "Když dvě rozumné možnosti dávají podobně dobrý smysl a rozhodnutí přesto zůstává živé.",
          steps: [
            "Pojmenuj své dilema jako otevřenou otázku. Jakou práci bys třeba chtěl dělat, kdybys měl vedle svých dovedností vzít vážně i svou zvídavost?",
            "Na chvíli se ztiš a vybav si prostředí, kde bys v představě mohl oslovit Múzu. Polož tam svou otázku. Zůstaň u obrazu, rytmu nebo jediného slova, které přijde.",
            "Poznamenej si, jak by se proměnilo rozhodování, kdybys obrazu věnoval pozornost. K otázce se můžeš vrátit i příští den.",
          ],
          reflect: "Co bys potřeboval prozkoumat ve skutečném světě?",
        },
        en: {
          title: "Bring a question to the Muse",
          when: "When two reasonable options make sense and the choice still feels alive.",
          steps: [
            "Give your dilemma the shape of an open question. What work might you choose if curiosity mattered alongside your existing skills?",
            "Find a little quiet and imagine a place where you could address the Muse. Offer your question there. Stay with any image, rhythm, or single word that arrives.",
            "Note how the image might change the way you approach the decision. You can return another day if all is quiet.",
          ],
          reflect: "What would you like to investigate in the world?",
        },
      },
      {
        id: "west-walk", source: "chapter-5", kind: "method", group: "facet",
        cz: {
          title: "Západní procházka za Milovaným",
          when: "Na známé cestě v podvečer, když tě láká prozkoumat vlastní touhu.",
          steps: [
            "Nech svou pozornost zabloudit k něčemu, co na tebe působí podivně přitažlivě. Hladina lomu nebo silueta opuštěného stromu ti může stačit i z dálky.",
            "Řekni tomu místu, co tě tam přivedlo a jakou vlastnost v něm potkáváš. Jaká slova bys zvolil, kdybys mu mohl vyznat náklonnost?",
            "Nabídni mu vlastní krátký verš, melodii nebo pohyb. Zapiš si, co po tomto oslovení vidíš jinak.",
          ],
          reflect: "Která část téhle touhy patří k životu, do kterého teprve dorůstáš?",
        },
        en: {
          title: "A West walk to the Beloved",
          when: "On a familiar route in the early evening when you feel curious about a longing.",
          steps: [
            "Let your attention settle on something strangely compelling. A quarry pool or the silhouette of a lone tree can draw you even at a distance.",
            "Tell the place what brought you there and which quality you encounter in it. How might you express affection for this place in your own words?",
            "Offer a short verse, tune, or movement. Record one thing you see differently after addressing it.",
          ],
          reflect: "What part of this longing belongs to a life you are still growing into?",
        },
      },
      {
        id: "west-anima-animus", source: "chapter-5", kind: "adaptation", group: "facet",
        cz: {
          title: "Procházka s animou či animem",
          when: "Plotkin zkoumá vnitřní protějšek pomocí ženskosti a mužskosti. Tady si můžeš vybrat kvalitu, která je pro tebe osobně málo známá.",
          steps: [
            "Představ si sebe s určitým málo prozkoumaným rysem. Jak se pohybuješ, když dáš víc místa třeba jemnosti, přímosti nebo smělosti?",
            "Projdi krátký úsek jako tahle verze sebe. Co vyhledávají oči, jak držíš ruce a kde se ti chce zastavit? Nech změnu vyplynout z vlastního prožitku.",
            "Vrať se ke své obvyklé chůzi a porovnej obě zkušenosti. Vyber situaci, kde bys chtěl nově poznanou kvalitu zkusit.",
          ],
          reflect: "Co tě na této podobě sebe překvapilo?",
        },
        en: {
          title: "An anima or animus walk",
          when: "Plotkin explores inner counterparts through masculinity and femininity. This adaptation lets you choose a quality personally unfamiliar to you.",
          steps: [
            "Imagine a version of yourself with a trait you have barely explored. What happens to your movement when you give tenderness, directness, or boldness more room?",
            "Walk a short stretch as this version of yourself. Where do you look, how do you hold your hands, and where do you want to pause? Let your experience shape the movement.",
            "Return to your usual walk and compare the two. Pick an occasion when you might try out the quality you discovered.",
          ],
          reflect: "What surprised you about this version of yourself?",
        },
      },
      {
        id: "west-muse-art", source: "chapter-5", kind: "method", group: "facet",
        cz: {
          title: "Nechat Múzu vést ruku",
          when: "Když máš po ruce papír a kreslicí potřeby a nevíš, co tvořit.",
          steps: [
            "Začni na prázdném místě a polož první barvu nebo čáru tam, kam tě přitahuje. Zatím si nemusíš volit námět.",
            "Pozoruj, jakou odpověď si tah vyžádá. Zkus druhou barvu, nečekanou zatáčku nebo kousek prázdného papíru.",
            "Až budeš chtít skončit, pootoč obrázek. Napiš si titulek, který tě napadá teď, když už dílo vidíš.",
          ],
          reflect: "Který prvek tě při tvoření skutečně překvapil?",
        },
        en: {
          title: "Let the Muse guide your hand",
          when: "When you have drawing materials and no subject in mind.",
          steps: [
            "Choose an empty patch of paper. Put down a first colour or stroke wherever you feel drawn. A subject can wait.",
            "Notice the response that mark invites. Try a second colour, an unexpected curve, or a stretch of untouched paper.",
            "When you want to finish, turn the page around. Give it a title that suggests itself now that you can see what you made.",
          ],
          reflect: "Which element actually surprised you during the making?",
        },
      },
      {
        id: "west-shadow-dream", source: "chapter-9", kind: "adaptation", group: "protector",
        cz: {
          title: "Stínová postava a náprava",
          when: "Plotkin v deváté kapitole popisuje vracející se protivníky ve svých snech. Zkus si jeho otázku na drobném příkladu.",
          steps: [
            "Vyber snovou postavu, která tě dráždila. Napiš přesné sloveso pro její jednání, třeba „skáče druhým do řeči“. Dej téhle domněnce o sobě zatím otazník.",
            "Hledej jediný příklad z bdělého života, kde jsi jednal podobně. Jestli žádný nenajdeš, nech zápis otevřený. Jsou i jiné důvody, proč se určitá postava vrací.",
            "Pokud poznáváš vlastní konkrétní skutek, zvaž malou nápravu. Třeba se vrátit k přerušenému rozhovoru a nechat druhého domluvit.",
          ],
          reflect: "Co se může v příštím skutečném setkání změnit?",
        },
        en: {
          title: "A shadow figure and a repair",
          when: "In chapter nine Plotkin describes recurring dream adversaries. Try one question from his account with an everyday example.",
          steps: [
            "Choose an irritating dream figure. Find a precise verb for its behaviour, perhaps “interrupts”. Put a question mark beside the idea that this might also describe you.",
            "Look for a single waking example when you acted similarly. If you find none, leave the entry open. A recurring figure could have other meanings.",
            "If you recognise something specific you did, consider a small repair. You might resume an interrupted conversation and give the other person time to finish.",
          ],
          reflect: "What might change in your next actual encounter?",
        },
      },
      {
        id: "west-dream", source: "field-notes", kind: "method", group: "facet",
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
        id: "west-dream-encounter", source: "companion", kind: "method", group: "facet",
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
        id: "west-courting", source: "courting", kind: "adaptation", group: "application",
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
        id: "west-projection", source: "chapter-9", kind: "method", group: "protector",
        cz: {
          title: "Prozkoumat obdiv nebo odpor",
          when: "Pro snesitelnou každodenní situaci, kdy v tobě někdo opakovaně vyvolává silnou odezvu. Plotkin při hlubší práci se stínem zdůrazňuje oporu všech čtyř směrů i hodnotu zkušeného průvodce.",
          steps: [
            "Popiš jednu pozorovatelnou věc, kterou člověk udělal. Na jiný řádek napiš, jakou vlastnost jsi mu přiřkl. „Vstoupila do hovoru“ a „je nebojácná“ jsou dva různé údaje.",
            "Při zkoumání projekce hledej vlastní konkrétní příklad. Kdy ses sám odvážil vstoupit do hovoru? Možná také obdivuješ člověka, který skutečně jednal odvážně.",
            "Při zkoumání přenosu se ptej na vztah. Připomíná ti výměna starší zkušenost, kdy ti někdo brával slovo? Co dnes můžeš říct nebo udělat, co tehdy nešlo?",
            "Rozliš, co si můžeš vyzkoušet sám a jakou hranici chceš vůči druhému člověku zachovat. Pro oboje může být dobrý důvod.",
          ],
          reflect: "Co přibylo k tvému pohledu na sebe a co stále platí o té konkrétní události?",
        },
        en: {
          title: "Explore admiration or aversion",
          when: "For a manageable everyday situation that repeatedly stirs a strong response. For deeper shadow work, Plotkin stresses access to the resources of all four directions and the value of an experienced guide.",
          steps: [
            "Describe one observable action. On another line put the quality you attributed to the person. “She entered the conversation” and “she is fearless” are different kinds of information.",
            "To explore projection, look for a concrete example in your own life. When did you enter a conversation boldly? You may also admire someone who genuinely acted with courage.",
            "To explore transference, ask about the relationship. Did this exchange recall a time when someone used to talk over you? What can you say or do now that was beyond your reach then?",
            "Distinguish what you might explore in yourself from any boundary you want to keep with the other person. There may be good reasons for both.",
          ],
          reflect: "What have you learned about yourself, and what remains true about the event?",
        },
      },
      {
        id: "west-image-form", source: "chapter-5", kind: "adaptation", group: "application",
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
        id: "west-shadow-circle", source: "companion", kind: "method", group: "protector",
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
        id: "west-dusk", source: "companion", kind: "method", group: "facet",
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
