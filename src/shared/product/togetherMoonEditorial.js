// Original CZ/EN conversation prompts. The lunar associations are symbolic;
// none of this copy determines a person's mood, health or relationship.
// Entries follow the four Sun–Moon angle intervals used by moonToday.quarter.
export const LUNAR_REFLECTIONS = [
  {
    quality: ["Od novu k první čtvrti", "New moon to first quarter"],
    title: ["Dát místo něčemu novému", "Make room for something new"],
    text: ["Nov se v lunární symbolice pojí se začátkem. Nemusíš mít velký plán. Stačí si všimnout, co ti ve společném čase chybí.", "In lunar symbolism, the new moon is a beginning. You do not need a big plan. Just notice what you miss in your time together."],
    prompt: ["Čeho bychom spolu mohli mít o trochu víc?", "What would we like a little more of together?"],
    action: ["Každý řekne jedno přání. Vyberte drobnost, kterou chcete v příštích dnech zkusit. Třeba večeři bez telefonu nebo krátkou procházku.", "Each name one wish. Choose something small to try in the next few days, such as dinner without phones or a short walk."],
  },
  {
    quality: ["Od první čtvrti k úplňku", "First quarter to full moon"],
    title: ["Udělat malý krok", "Take a small step"],
    text: ["Dorůstání může připomenout, že přání potřebuje místo v běžném dni. Blízkost někdy začíná úplně obyčejnou věcí.", "The waxing moon can be a reminder to make room for a wish in an ordinary day. Closeness sometimes begins with something very simple."],
    prompt: ["Co malého pro sebe můžeme udělat už dnes?", "What small thing could we do for each other today?"],
    action: ["Domluvte jednu konkrétní chvíli. Deset minut po večeři, společný čaj nebo cestu domů. Vyberte to, na co máte oba prostor.", "Choose a moment: ten minutes after dinner, a cup of tea, or the walk home. Pick something you both have room for."],
  },
  {
    quality: ["Od úplňku k poslední čtvrti", "Full moon to last quarter"],
    title: ["Všimnout si toho dobrého", "Notice what feels good"],
    text: ["Úplněk se v lunární symbolice pojí s tím, co vystoupí do světla. Zkus si všimnout něčeho mezi vámi, co v běžném dni snadno zapadne.", "In lunar symbolism, the full moon brings things into view. Notice something between you that is easy to overlook in an ordinary day."],
    prompt: ["Kdy ti se mnou bylo v posledních dnech dobře?", "When have you felt good with me over the past few days?"],
    action: ["Připomeň jeden konkrétní okamžik. Řekni, co pro tebe znamenal. Pak si role vyměňte. Stačí minuta pro každého.", "Recall one particular moment and say what it meant to you. Then swap roles. A minute each is enough."],
  },
  {
    quality: ["Od poslední čtvrti k novu", "Last quarter to new moon"],
    title: ["Trochu si ulevit", "Make things a little lighter"],
    text: ["Ubývání může být připomínkou, že nemusíte pořád něco přidávat. Někdy pomůže ubrat spěch nebo jednu zbytečnou povinnost.", "The waning moon can be a reminder that you do not always need to add more. Sometimes it helps to ease the rush or set one unnecessary task aside."],
    prompt: ["Co si můžeme v příštích dnech ulehčit?", "What could we make easier over the next few days?"],
    action: ["Najděte jednu drobnost, kterou můžete zjednodušit, odložit nebo si rozdělit jinak. Vyberte řešení, které je příjemné vám oběma.", "Find one small thing you could simplify, postpone or share differently. Choose an option that feels right for both of you."],
  },
];

// Traditional motifs are invitations to reflect, never personality labels.
// Their ordering matches the tropical longitude signs in ZODIAC.
export const ZODIAC_REFLECTIONS = [
  {motif: ["Odvaha začít", "The courage to begin"], prompt: ["Je něco, co chceš mezi vámi otevřít? Zkus první větu bez výčitek a bez spěchu na odpověď.", "Is there something you want to open up between you? Try a first sentence without blame or pressure for an answer."]},
  {motif: ["Pohodlí a opora", "Comfort and support"], prompt: ["Co ti pomáhá cítit se se mnou v bezpečí? Možná je to dotek, známé místo nebo chvíle, kdy nikam nemusíme.", "What helps you feel safe with me? Perhaps a touch, a familiar place, or a moment with nowhere to be."]},
  {motif: ["Zvědavost", "Curiosity"], prompt: ["Co by tě o mně zajímalo a ještě jsme o tom nemluvili? Dej prostor i odpovědi, která tě překvapí.", "What would you like to know about me that we have not talked about yet? Make room for an answer that might surprise you."]},
  {motif: ["Péče a blízkost", "Care and closeness"], prompt: ["Co by ti dnes udělalo doma dobře? Zeptej se dřív, než začneš hádat.", "What would feel good at home today? Ask before you start guessing."]},
  {motif: ["Radost a ocenění", "Joy and appreciation"], prompt: ["Čeho si na mně vážíš a málo to říkáš nahlas? Připomeň jednu konkrétní maličkost.", "What do you appreciate about me but rarely say aloud? Name one small, specific thing."]},
  {motif: ["Péče v maličkostech", "Care in small things"], prompt: ["Která drobná pomoc by ti dnes ulevila? Nabídni něco konkrétního a nech druhého vybrat.", "What small bit of help would make today easier? Offer something specific and let the other person choose."]},
  {motif: ["Prostor pro oba", "Room for both of you"], prompt: ["Máme v tom, co spolu plánujeme, místo pro přání nás obou? Každý může chtít něco trochu jiného.", "Do our plans have room for both of our wishes? It is fine to want slightly different things."]},
  {motif: ["Důvěra a hloubka", "Trust and depth"], prompt: ["Je něco, co potřebuješ říct pomalu? Druhý může jen poslouchat. Nemusíte dnes dojít k řešení.", "Is there something you need to say slowly? The other person can simply listen. You do not have to reach a solution today."]},
  {motif: ["Objevování", "Discovery"], prompt: ["Co bychom chtěli zažít poprvé spolu? Může to být i nová cesta na známé místo.", "What would we like to experience together for the first time? Even a new route to a familiar place counts."]},
  {motif: ["Držet slovo", "Keeping your word"], prompt: ["Která naše dohoda nám opravdu pomáhá? A kterou je čas upravit, aby se nám s ní žilo lépe?", "Which of our agreements really helps us? Which one could change to make everyday life easier?"]},
  {motif: ["Svoboda být svůj", "Room to be yourself"], prompt: ["V čem potřebuješ víc vlastního prostoru? Zkus říct, jak si ho dopřát a přitom zůstat v kontaktu.", "Where do you need more space of your own? Talk about how to have that space and still stay connected."]},
  {motif: ["Naslouchání", "Listening"], prompt: ["Pomůže ti teď rada, nebo jen moje pozornost? Než něco nabídneš, nech druhého domluvit.", "Would advice help right now, or would you prefer my attention? Let the other person finish before offering anything."]},
];

export const LUNAR_SOURCES = {
  nasa: "https://science.nasa.gov/moon/moon-phases/",
  calculation: "https://github.com/cosinekitty/astronomy",
  chani: "https://www.chani.com/astro-education/what-are-moon-phases-and-how-can-you-work-with-them",
  gerhardt: "https://www.astro.com/astrology/in_dgmoonwatching_e.htm",
  greene: "https://www.astro.com/astrology/in_art_e.htm",
  zodiac: "https://mooncircles.com/moon-astrology-articles/quick-guide-to-moon-phases/",
  ptolemy: "https://penelope.uchicago.edu/thayer/e/roman/texts/ptolemy/tetrabiblos/1b%2A.html#8",
  uposatha: "https://www.accesstoinsight.org/ptf/dhamma/sila/uposatha.html",
  elements: "https://www.astro.com/astrology/in_elements_e.htm",
  moonly: "https://moonly.app/lunar-calendar",
};

// Original relationship rituals, not translated teachings or predictions.
// Index follows moonToday.index (the same eight visual phase sectors as MoonArt).
export const LUNAR_PHASE_PRACTICES = [
  {
    title:["Semínko v tichu","A seed in the quiet"],
    text:["Temný kotouč novu je obrazem toho, co ještě nemá tvar. Mezi vámi může něco nového začínat dřív, než pro to najdete slova. Nechte přání nejprve zaznít, bez slibu, že ho hned splníte.","The dark new Moon is an image of something not yet formed. Something new between you may begin before you find words for it. Let a wish be heard before promising to fulfil it."],
    intention:["Chci dát hlas tomu, po čem toužím, a nechat prostor i tvému přání.","I want to give my longing a voice and make room for yours."],
    shadow:["Kde čekám, že druhý sám pozná, co potřebuji? Co mohu vyslovit jako přání místo zkoušky jeho lásky?","Where am I expecting you to know what I need? What could I express as a wish instead of a test of your love?"],
    integration:["Vyberte jedno společné semínko: drobný zvyk, kterému tento týden dáte místo. Ostatní přání mohou zatím zůstat přáními.","Choose one shared seed: a small habit to make room for this week. The other wishes can remain wishes for now."],
    prompts:[
      ["Co mezi námi chce teprve vyrůst?","What is waiting to grow between us?"],
      ["Jaké přání jsem si zatím nechával/a pro sebe?","What wish have I been keeping to myself?"],
      ["Jak bychom poznali, že o náš vztah pečujeme po svém?","How would we recognise that we are caring for our relationship in our own way?"]
    ],
    ritual:["Zasadit společný záměr","Plant a shared intention"],
    steps:[
      ["Položte mezi sebe hrnek nebo kámen jako připomínku společného prostoru. Chvíli jen buďte; zavřené oči nejsou potřeba.","Place a cup or a stone between you as a reminder of your shared space. Be still for a moment; there is no need to close your eyes."],
      ["Každý dopoví: Přeju si, abychom spolu zažívali víc… Druhý jen zopakuje, co slyšel.","Each finish: I wish we could experience more… The other simply repeats what they heard."],
      ["Najděte jeden malý krok a chvíli, kdy se k němu vrátíte. Pokud se vaše přání liší, nejprve jim dejte místo vedle sebe.","Find one small step and a time to return to it. If your wishes differ, start by allowing them to sit alongside each other."]
    ]
  },
  {
    title:["Chránit první jiskru","Protect the first spark"],
    text:["Tenký dorůstající srpek může být obrazem křehké důvěry. To, co začalo jako přání, potřebuje péči i dost prostoru. Blízkost roste také v drobnostech, které se opakují.","The thin waxing crescent can be an image of tender trust. What began as a wish needs care and space. Closeness also grows through small, repeated gestures."],
    intention:["Chci podpořit to, co mezi námi začíná, bez tlaku na výsledek.","I want to support what is beginning between us without forcing an outcome."],
    shadow:["Neshazuji něco nového jen proto, že to zatím není přirozené? Jak by vypadala podpora bez kontroly?","Am I dismissing something new because it does not feel natural yet? What would support without control look like?"],
    integration:["Dohodněte si jeden snadný návrat k sobě: pozdrav bez telefonu, pár minut po práci nebo otázku u čaje.","Choose one easy way to return to each other: a greeting without phones, a few minutes after work, or a question over tea."],
    prompts:[
      ["Co ode mě potřebuješ, aby se ti náš nový krok zkoušel lehčeji?","What do you need from me to make our new step easier to try?"],
      ["Kdy ses v poslední době cítil/a podpořený/á, aniž bych tě vedl/a?","When have you recently felt supported without being directed by me?"],
      ["Kterou malou chvíli bychom chtěli znovu zažívat?","What small moment would we like to experience again?"]
    ],
    ritual:["Dát přání každodenní místo","Give a wish an everyday place"],
    steps:[
      ["Připomeňte si něco, co jste spolu chtěli začít. Pokud nic takového nemáte, vyberte obyčejnou chvíli, která vám chybí.","Recall something you wanted to begin together. If there is nothing yet, choose an ordinary moment you miss."],
      ["Každý řekne, co by mu první pokus usnadnilo. Poslouchejte i rozdílné tempo.","Each say what would make the first attempt easier. Listen for differences in pace too."],
      ["Zmenšete nápad tak, aby se vešel do běžného dne. Domluvte jeden pokus, ne závazek navždy.","Make the idea small enough for an ordinary day. Agree on one attempt, not a lifelong commitment."]
    ]
  },
  {
    title:["Odvaha na prahu","Courage at the threshold"],
    text:["První čtvrť nese obraz prahu: něco už je vidět, něco zůstává ve tmě. Ve vztahu může podobný práh vzniknout tam, kde se naše přání rozcházejí. Rozdíl nemusí přerůst v boj.","The first quarter suggests a threshold: part is visible, part remains dark. A similar threshold can appear where your wishes diverge. A difference need not become a battle."],
    intention:["Chci být pravdivý/á a zároveň zůstat v kontaktu.","I want to be honest and stay connected."],
    shadow:["Kdy zaměňuji nesouhlas za odmítnutí mě samotného/samotné? Co se snažím ochránit, když začnu tlačit?","When do I confuse disagreement with rejection of me? What am I trying to protect when I start pushing?"],
    integration:["Vyberte jednu malou věc, v níž teď potřebujete jasnější dohodu. Každý pojmenuje svou potřebu a jednu možnost, kterou může nabídnout.","Choose one small area needing a clearer agreement. Each name a need and one possibility you can offer."],
    prompts:[
      ["Co se snažím ochránit pod tím, o co se přeme?","What am I trying to protect beneath what we are arguing about?"],
      ["Co potřebuješ slyšet, abys mohl/a zůstat otevřený/á i při nesouhlasu?","What do you need to hear to stay open when we disagree?"],
      ["Jaká dohoda by nechala důstojnost nám oběma?","What agreement would preserve dignity for both of us?"]
    ],
    ritual:["Dvě pravdy, jeden malý krok","Two truths, one small step"],
    steps:[
      ["Vyberte drobný rozdíl, ne váš nejtěžší spor. Ověřte si, že o něm chcete oba mluvit právě teď.","Choose a small difference, not your hardest conflict. Check that you both want to talk about it now."],
      ["Každý má chvíli na větu: Pro mě je důležité… Druhý nejprve shrne, čemu rozuměl; nemusí souhlasit.","Each has a moment to say: What matters to me is… The listener first summarises what they understood; agreement is not required."],
      ["Navrhněte jeden malý pokus, který bere vážně obě potřeby. Když je toho moc, domluvte návrat a dejte si pauzu.","Propose one small experiment that takes both needs seriously. If it feels too much, agree when to return and pause."]
    ]
  },
  {
    title:["Péče místo dokonalosti","Care instead of perfection"],
    text:["Téměř plný Měsíc může připomenout rozdíl mezi zráním a tlakem na dokonalost. I dobrý vztah zůstává živý a nedokončený. Můžete něco doladit, aniž byste z druhého dělali projekt.","The nearly full Moon can evoke the difference between ripening and striving for perfection. Even a good relationship stays alive and unfinished. You can adjust something without turning each other into a project."],
    intention:["Chci pečovat o to skutečné mezi námi, ne o ideální obraz.","I want to care for what is real between us, not an ideal image."],
    shadow:["Kde přehlížím to dobré, protože hledám, co ještě chybí? Měřím náš vztah vlastním životem, nebo cizí představou?","Where am I missing what is good because I am looking for what is absent? Am I measuring our relationship against our lives or someone else's ideal?"],
    integration:["Nechte jednu věc být dost dobrou. U jiné společně upravte malý detail, který oběma uleví.","Let one thing be good enough. For another, adjust one small detail that would ease things for you both."],
    prompts:[
      ["Co je mezi námi už teď dobré, i když to není dokonalé?","What is already good between us, even though it is not perfect?"],
      ["Kde by mi pomohlo méně rad a více důvěry?","Where would fewer suggestions and more trust help me?"],
      ["Co bychom mohli upravit, aniž bychom museli měnit jeden druhého?","What could we adjust without trying to change each other?"]
    ],
    ritual:["Nechat jednu věc dozrát","Let one thing ripen"],
    steps:[
      ["Každý řekne jednu věc, které si mezi vámi všiml a váží si jí. Popište skutečný okamžik.","Each name something you have noticed and value between you. Describe a real moment."],
      ["Podívejte se na jednu společnou dohodu. Co už funguje a co ji zbytečně komplikuje?","Look at one shared agreement. What is working, and what makes it needlessly complicated?"],
      ["Zvolte jednu drobnou úpravu. Zbytek dnes nechte být.","Choose one small adjustment. Leave the rest alone today."]
    ]
  },
  {
    title:["Být viděn v plném světle","To be seen in full light"],
    text:["Úplněk nabízí obraz zrcadla: něco se ukáže zřetelněji. Může to být radost, touha i místo, které si zaslouží laskavou pozornost. Zkuste se vidět bez potřeby mít hned vysvětlení.","The full Moon offers the image of a mirror: something becomes clearer. It may be joy, longing, or a place deserving kind attention. Try to see each other without needing an immediate explanation."],
    intention:["Chci se nechat vidět a podívat se na tebe s čerstvou pozorností.","I want to let myself be seen and look at you with fresh attention."],
    shadow:["Co v druhém vyvolává mou silnou reakci a jaký příběh si k tomu přidávám? Co skutečně vím a na co se potřebuji zeptat?","What in you brings up a strong reaction, and what story am I adding to it? What do I actually know, and what do I need to ask?"],
    integration:["Pojmenujte jednu věc, kterou si chcete uchovat, a jednu, o níž si chcete promluvit v klidné chvíli. Nemusíte obojí řešit dnes.","Name one thing you want to keep and one thing to discuss at a calm moment. You do not need to address both today."],
    prompts:[
      ["Co bys chtěl/a, abych v tobě viděl/a jasněji?","What would you like me to see more clearly in you?"],
      ["Který okamžik mezi námi si zaslouží malou oslavu?","Which moment between us deserves a small celebration?"],
      ["Jaký můj příběh o tobě bych si měl/a ověřit otázkou?","What story I tell myself about you should I check by asking?"]
    ],
    ritual:["Zrcadlo a poděkování","A mirror and a thank-you"],
    steps:[
      ["Sedněte si tak, aby vám bylo příjemně. Pohled do očí je nabídka, ne podmínka.","Sit in a way that feels comfortable. Eye contact is an invitation, not a requirement."],
      ["Každý řekne: Vidím, kolik dáváš do… a Dotýká se mě, když… Mluvte o konkrétních věcech.","Each say: I see how much you put into… and It touches me when… Speak about specific things."],
      ["Příjemce může jen poděkovat nebo doplnit, co by ještě chtěl nechat vidět. Nakonec si dopřejte něco obyčejně hezkého.","The recipient can simply say thank you or add something they would also like to have seen. End with something simple you both enjoy."]
    ]
  },
  {
    title:["Vzít si z prožitého dar","Receive the gift of experience"],
    text:["Po plnosti se světlo pomalu vrací dovnitř. V lunární symbolice je to prostor ke sdílení toho, co v nás dozrálo. Důležitá zkušenost může zůstat živá v tom, jak spolu zítra zacházíme.","After fullness, light slowly turns inward. In lunar symbolism this is room to share what has ripened in us. An important experience can stay alive in how we treat each other tomorrow."],
    intention:["Chci proměnit to, co jsme poznali, v laskavější každodennost.","I want what we have learned to become a kinder everyday life."],
    shadow:["Nečekám, že druhý prožil totéž stejně jako já? Mohu mu naslouchat, aniž bych opravoval/a jeho vzpomínku?","Am I expecting you to have experienced the same moment as I did? Can I listen without correcting your memory?"],
    integration:["Každý si vybere jednu věc, kterou chce po společné zkušenosti dělat jinak. Nemusí to být stejná věc.","Each choose one thing you want to do differently after a shared experience. It does not need to be the same thing."],
    prompts:[
      ["Co jsme o sobě nedávno poznali a chceme si to pamatovat?","What have we recently learned about each other that we want to remember?"],
      ["Která společná chvíle v tobě ještě doznívá?","Which shared moment is still staying with you?"],
      ["Jak můžeme něco hezkého z výjimečné chvíle přenést do obyčejného dne?","How could something good from a special moment find its way into an ordinary day?"]
    ],
    ritual:["Co si neseme dál","What we carry forward"],
    steps:[
      ["Vyberte jeden nedávný společný okamžik. Každý chvíli popíše, jaký byl z jeho pohledu.","Choose a recent moment together. Each briefly describe what it was like from your perspective."],
      ["Řekněte, co vás překvapilo a co jste o druhém pochopili. Rozdílné vzpomínky mohou zůstat vedle sebe.","Say what surprised you and what you understood about each other. Different memories can sit alongside one another."],
      ["Dopovězte: Chci si z toho odnést… Zvolte jeden malý způsob, jak tomu dát místo v týdnu.","Finish: What I want to carry forward is… Choose one small way to make room for it this week."]
    ]
  },
  {
    title:["Pustit to, co už neslouží","Release what no longer serves"],
    text:["Poslední čtvrť je obrazem rozlišování. Co vás ještě drží a co už jen opakujete ze zvyku? Uvolnění může znamenat novou dohodu nebo laskavé ne. Nemusí znamenat zapomenout na něco bolestivého.","The last quarter offers an image of discernment. What still supports you, and what are you repeating out of habit? Release can mean a new agreement or a kind no. It does not have to mean forgetting something painful."],
    intention:["Chci uvolnit jednu starou reakci a zkusit svobodnější odpověď.","I want to loosen one old reaction and try a freer response."],
    shadow:["Kde říkám ano, zatímco uvnitř roste odpor? Co potřebuji pojmenovat dřív, než se uzavřu?","Where am I saying yes while resentment grows inside? What do I need to name before I withdraw?"],
    integration:["Vyberte jednu opakující se situaci a domluvte jiný první krok. Nepožadujte po sobě okamžité odpuštění.","Choose one recurring situation and agree on a different first step. Do not demand immediate forgiveness from each other."],
    prompts:[
      ["Kterou naši starou dohodu je čas laskavě přepsat?","Which old agreement is it time to rewrite with care?"],
      ["Co už nemusíme dělat jen proto, že jsme to dělali vždycky?","What do we no longer need to do just because we always have?"],
      ["Jak poznáme, že padáme do známého kruhu, a co zkusíme nejdřív?","How will we recognise a familiar loop, and what will we try first?"]
    ],
    ritual:["Pustit jeden starý zvyk","Let go of one old habit"],
    steps:[
      ["Každý pojmenuje jednu vlastní reakci, kterou chce zjemnit. Nevybírejte zvyk za druhého.","Each name one reaction of your own you want to soften. Do not choose a habit for the other person."],
      ["Dopovězte: Když příště poznám, že…, zkusím nejdřív… Druhý může nabídnout podporu, ne dohled.","Finish: Next time I notice that…, I will first try… The other can offer support, not supervision."],
      ["Starý zvyk můžete napsat na papír a složit ho. Vedle napište nový krok. Papír je připomínka vašeho rozhodnutí.","You can write the old habit on paper and fold it away. Write the new step beside it. The paper is a reminder of your choice."]
    ]
  },
  {
    title:["Návrat do ticha","Return to quiet"],
    text:["Ubývající srpek, někdy nazývaný balzamická fáze, nese obraz uzavření kruhu. I vztah potřebuje čas, kdy není co zlepšovat. Můžete spočinout vedle sebe a nechat něco zůstat nedořečené.","The waning crescent, sometimes called the balsamic phase, evokes a circle coming to rest. A relationship also needs time with nothing to improve. You can rest beside each other and leave something unfinished."],
    intention:["Dovoluji nám být spolu i bez výkonu, vysvětlení a velkého rozhovoru.","I allow us to be together without performing, explaining or having a big conversation."],
    shadow:["Je moje ticho odpočinkem, nebo způsobem, jak druhého držím daleko? Co mu mohu krátce říct, aby nemusel hádat?","Is my silence rest, or a way of keeping you at a distance? What could I say briefly so you do not have to guess?"],
    integration:["Řekněte si, jak vypadá odpočinek příjemný pro oba. Pokud potřebujete samotu, domluvte i jednoduchý návrat do kontaktu.","Tell each other what rest would feel good for both of you. If you need solitude, agree on a simple way to reconnect too."],
    prompts:[
      ["Jak ti mohu být nablízku, když dnes nechceš mnoho mluvit?","How can I be close to you when you do not want to say much today?"],
      ["Co můžeme pro dnešek nechat být, aniž bychom to od sebe odstrčili?","What can we leave for today without pushing it away from us?"],
      ["Jaký malý návrat k sobě by nám po odpočinku udělal dobře?","What small way of reconnecting would feel good after resting?"]
    ],
    ritual:["Ticho, ve kterém zůstáváme spolu","Quiet that keeps us connected"],
    steps:[
      ["Každý řekne, jakou blízkost dnes chce: vedle sebe, s dotekem, nebo s větším prostorem. Žádná volba není špatně.","Each say what closeness you want today: side by side, with touch, or with more space. None of these choices is wrong."],
      ["Pár minut spočiňte. Vnímejte oporu pod sebou nebo zvuky kolem. Dech nechte přirozený.","Rest for a few minutes. Notice the support beneath you or sounds around you. Let your breathing be natural."],
      ["Na závěr stačí věta: Teď by mi udělalo dobře… Není potřeba hledat zvláštní prožitek.","End with a simple sentence: What would feel good now is… There is no need to seek a special experience."]
    ]
  }
];

// Elements follow the tropical zodiac's fire/earth/air/water sequence.
export const LUNAR_ELEMENTS = [
  {name:["Oheň","Fire"],gift:["Jiskra, odvaha a živost","Spark, courage and aliveness"],shadow:["Spěch, který přeslechne druhého","Haste that stops hearing the other"],practice:["Každý pojmenuje něco, co ho láká. Najděte malý společný pokus, pro který máte oba svobodné ano.","Each name something that draws you. Find a small shared experiment you can both freely say yes to."]},
  {name:["Země","Earth"],gift:["Opora, smysly a věrnost drobnostem","Support, the senses and care for small things"],shadow:["Jistota, která se mění v nehybnost","Security that becomes immobility"],practice:["Připravte si čaj, něco dobrého nebo pohodlné místo. Zeptejte se, která obyčejná pomoc by druhému opravdu ulevila.","Make tea, something good to eat, or a comfortable place. Ask what ordinary bit of help would actually ease things for each other."]},
  {name:["Vzduch","Air"],gift:["Zvědavost, slova a nový pohled","Curiosity, words and a fresh perspective"],shadow:["Vysvětlování místo skutečného naslouchání","Explaining instead of truly listening"],practice:["Položte otázku, na kterou odpověď neznáte. Před další otázkou zkuste shrnout, co vás na odpovědi oslovilo.","Ask a question you do not know the answer to. Before asking another, reflect what struck you about the answer."]},
  {name:["Voda","Water"],gift:["Citlivost, soucit a vnitřní obraz","Sensitivity, compassion and inner imagery"],shadow:["Domýšlení pocitů druhého a ztráta vlastních hranic","Guessing the other's feelings and losing your own boundaries"],practice:["Každý přirovná svůj dnešek k počasí nebo krajině. Pak se zeptejte, jakou blízkost si přeje; obraz nemusíte vykládat za něj.","Each describe your day as weather or a landscape. Then ask what closeness you would like; you do not need to interpret each other's image."]}
];

export const LUNAR_ARCHETYPES = [
  {name:["Průkopník","The pioneer"],balance:["Odvaha říct své ano i ne; prostor pro tempo druhého.","The courage to say yes and no; room for the other's pace."]},
  {name:["Zahradník","The gardener"],balance:["Péče o to, co má kořeny; ochota pustit do známého místa něco nového.","Care for what has roots; willingness to let something new enter familiar ground."]},
  {name:["Vypravěč","The storyteller"],balance:["Lehkost a zvědavost; schopnost zůstat u jedné opravdové odpovědi.","Lightness and curiosity; the ability to stay with one honest answer."]},
  {name:["Strážce domova","The keeper of home"],balance:["Něha a sounáležitost; péče, která nechává druhého dýchat.","Tenderness and belonging; care that gives the other room to breathe."]},
  {name:["Tvůrce","The creator"],balance:["Radost z viditelnosti; pozornost, která svítí i na druhého.","Joy in being seen; attention that shines on the other too."]},
  {name:["Řemeslník","The craftsperson"],balance:["Cit pro drobnosti; laskavost k tomu, co zůstává nedokonalé.","An eye for detail; kindness toward what remains imperfect."]},
  {name:["Tvůrce souladu","The maker of harmony"],balance:["Vnímání obou stran; pravdivost, která se neztrácí ve snaze vyhovět.","Awareness of both sides; honesty that does not disappear into pleasing."]},
  {name:["Průvodce hloubkou","The companion in depth"],balance:["Odvaha být zranitelný; respekt k tomu, co druhý zatím nechce otevřít.","Courage to be vulnerable; respect for what the other does not yet wish to open."]},
  {name:["Poutník","The wayfarer"],balance:["Touha po smyslu a objevování; pozornost k tomu, co žijeme právě tady.","A longing for meaning and discovery; attention to the life happening here."]},
  {name:["Stavitel","The builder"],balance:["Spolehlivost a vytrvalost; právo odložit výkon a přijmout oporu.","Reliability and perseverance; permission to stop performing and receive support."]},
  {name:["Svobodný spojenec","The free ally"],balance:["Prostor pro jedinečnost; ochota zůstat citově přítomný.","Room for individuality; willingness to remain emotionally present."]},
  {name:["Snící","The dreamer"],balance:["Obrazotvornost a soucit; jasná hranice mezi mou zkušeností a tvou.","Imagination and compassion; a clear boundary between my experience and yours."]}
];
