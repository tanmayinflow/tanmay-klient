// Original bilingual editorial for the cycle atlas. Phase, season and direction
// associations are this application's poetic arrangement, not physiology or an
// attribution to the authors below. Rituals are original, ordinary 2–8 minute
// practices, not abridged initiations, psychotherapy or exercises from a book.
// Traditional stories summarize the cited text; `why` and questions are ours.
const pair = (cs, en) => [cs, en];

export const CYCLE_SPIRALS = {
  menstrual: {
    title: pair('Spirála k tichému středu', 'A spiral towards the quiet centre'),
    text: pair(
      'Výdech se dokončuje a nádech přichází sám. Nemusíš mezi nimi vytvářet ticho. Podobně se v zimní zahradě život stahuje z větví ke kořenům. Méně toho vidíme, ale příběh pokračuje.\n\nTento obrat spirály zve odložit na chvíli jména rolí a všimnout si toho, co zůstane. Tepla rukou. Váhy těla. Potřeby, kterou nemusíš ničím zasloužit. Návrat ke středu není návrat na začátek. Přinášíš s sebou všechno, čím už život prošel.',
      'An exhalation finishes and the next breath arrives by itself. You need not create silence between them. In a winter garden, life similarly withdraws from branches towards roots. Less is visible, yet the story continues.\n\nThis turn of the spiral invites you to set your roles aside briefly and notice what remains. Warm hands. The weight of your body. A need you do not have to earn. Returning to the centre is not starting over. You bring everything life has already passed through.'
    ),
    question: pair('Co ve mně potřebuje místo, i když to dnes nic nevytvoří?', 'What in me needs room, even if it produces nothing today?'),
    sourceIds: ['imagery-plotkin-map']
  },
  follicular: {
    title: pair('Spirála prvního otevření', 'A spiral of first opening'),
    text: pair(
      'Nádech rozšiřuje prostor, který tu před chvílí nebyl. Na větvi se rozvíjí list. Nezná celý tvar léta, přesto se obrací ke světlu. I nový začátek může zůstat malý a ještě nevědět, čím bude.\n\nSpirála se otevírá ven, ale neztrácí svůj střed. K novému pokusu si bereš zkušenost minulého obratu. Nemusíš splnit všechny nápady, které se objeví. Stačí dát jednomu podmínky, ve kterých může ukázat, zda chce dál růst.',
      'An inhalation makes room that was not there a moment ago. A leaf unfolds on a branch. It does not know the shape of summer, yet it turns towards the light. A beginning can remain small and still not know what it will become.\n\nThe spiral opens outwards without losing its centre. You bring the previous turn’s experience to a new experiment. You need not fulfil every idea that appears. Give one the conditions to show whether it wants to keep growing.'
    ),
    question: pair('Kterému malému začátku dnes mohu dát skutečný prostor?', 'Which small beginning can I give real space today?'),
    sourceIds: ['imagery-plotkin-map', 'imagery-animas-nature']
  },
  ovulatory: {
    title: pair('Spirála setkání', 'A spiral of meeting'),
    text: pair(
      'V létě koruna stromu vrhá stín daleko od kmene. To, co rostlo potichu, se stává místem pro druhé. Nádech a výdech také patří jednomu pohybu. Přijímat a dávat se nemusí přetahovat o místo.\n\nVnější obrat spirály zve do setkání. Můžeš něco nabídnout, něco přijmout a přitom si ponechat práh vlastního domu. Otevřenost není slib být stále k dispozici. Blízkost vzniká i tam, kde oba smějí říci, kolik prostoru dnes mají.',
      'In summer, a tree’s crown casts shade far from its trunk. What grew quietly becomes a place for others. Inhalation and exhalation also belong to one movement. Receiving and giving need not compete for room.\n\nThe outer turn of the spiral invites a meeting. You can offer something, receive something and still keep the threshold of your own home. Openness is not a promise of constant availability. Closeness also grows where both people can say how much room they have today.'
    ),
    question: pair('Co chci nabídnout a co potřebuji umět přijmout?', 'What do I want to offer, and what do I need to learn to receive?'),
    sourceIds: ['imagery-plotkin-map']
  },
  luteal: {
    title: pair('Spirála návratu se zkušeností', 'A spiral of returning with experience'),
    text: pair(
      'Výdech dovoluje hrudníku povolit. Strom pouští listy, ale v pupenech už nese další jaro. Návrat nemusí znamenat ztrátu všeho, co během otevření vzniklo. Něco dozrálo. Něco už není třeba držet.\n\nSpirála vede známou krajinou, tentokrát s jinou zkušeností. Můžeš rozlišit plod, semeno a větev, kterou už neuneseš. Nemusíš hned rozhodnout o celém životě. Stačí poznat jednu věc, kterou chceš přenést dál, a jednu, které dovolíš skončit.',
      'An exhalation lets the chest soften. A tree releases its leaves while carrying the next spring in its buds. Returning need not mean losing everything that grew during the opening. Something has ripened. Something no longer needs to be held.\n\nThe spiral crosses familiar ground with different experience this time. You can distinguish fruit, seed and a branch you can no longer carry. You need not decide your whole life at once. Recognise one thing to take forward and one thing to let end.'
    ),
    question: pair('Co si z tohoto obratu odnáším a co už nemusím opakovat?', 'What am I taking from this turn, and what do I no longer need to repeat?'),
    sourceIds: ['imagery-plotkin-map', 'imagery-shaw-liturgies']
  }
};

export const CYCLE_RITUALS = {
  menstrual: [
    {
      id: 'menstrual-roles', durationMinutes: 4,
      title: pair('Položit roli vedle sebe', 'Set a role beside you'),
      text: pair('Na pár minut vystup z jedné povinnosti, která se k tobě přilepila jako jméno. Papír ji chvíli unese za tebe.', 'Step out of a duty that has begun to cling to you like a name. Let a piece of paper hold it for a few minutes.'),
      why: pair('Odstup od role dává prostor všimnout si potřeby, která se do ní nevejde.', 'Stepping back from a role makes room to notice a need that does not fit inside it.'),
      steps: [
        pair('Napiš jednu roli, ve které dnes trávíš hodně času. Pod ni napiš, co se v ní od tebe čeká.', 'Write one role taking much of your time today. Beneath it, write what is expected of you in it.'),
        pair('Polož papír vedle sebe. Minutu se rozhlížej po místnosti a nech dech běžet vlastním tempem.', 'Place the paper beside you. Look around the room for a minute and let your breathing find its own pace.'),
        pair('Dopiš jednu svou potřebu. Vyber drobnou úpravu dne, která jí udělá místo.', 'Add one need of your own. Choose a small adjustment to the day that makes room for it.')
      ],
      question: pair('Kdo se dostane ke slovu, když chvíli nemusím nic zastávat?', 'What gets a voice when I do not have to fulfil a role for a moment?'),
      sourceIds: ['imagery-estes-excerpt']
    },
    {
      id: 'menstrual-shelter', durationMinutes: 3,
      title: pair('Místo, které mě podrží', 'A place that supports me'),
      text: pair('Vytvoř si malé místo odpočinku z toho, co je po ruce. Nemusí být krásné ani dokonale tiché.', 'Make a small resting place from what is at hand. It need not look beautiful or be perfectly quiet.'),
      why: pair('Konkrétní opora někdy odpoví přesněji než další úkol, jak se cítit lépe.', 'Concrete support can sometimes answer more precisely than another task for feeling better.'),
      steps: [
        pair('Uprav si židli, deku nebo polštář tak, aby se ti sedělo či leželo pohodlně.', 'Adjust a chair, blanket or cushion so you can sit or lie comfortably.'),
        pair('Všimni si tří míst, kde tě něco podpírá. Oči mohou zůstat otevřené.', 'Notice three places where something supports you. Your eyes can stay open.'),
        pair('Pojmenuj, co by teď pomohlo nejvíc. Udělej jednu snadnou věc: napij se, přidej vrstvu nebo odlož úkol.', 'Name what would help most now. Do one easy thing: drink some water, add a layer or postpone a task.')
      ],
      question: pair('Jakou oporu skutečně potřebuji právě teď?', 'What support do I actually need right now?'),
      sourceIds: []
    },
    {
      id: 'menstrual-enough', durationMinutes: 5,
      title: pair('Tři věci, které dnes stačí', 'Three things that are enough today'),
      text: pair('Zkus odlišit podstatné od naléhavého. Malý den může mít svůj pevný tvar.', 'Try to distinguish what matters from what feels urgent. A small day can have a clear shape of its own.'),
      why: pair('Vlastní měřítko pro dnešek může omezit sliby, které nemáš z čeho splnit.', 'A measure that fits today can limit promises you have no resources to keep.'),
      steps: [
        pair('Napiš jednu věc pro tělo, jednu pro vztah a jednu nutnou povinnost.', 'Write one thing for your body, one for a relationship and one necessary duty.'),
        pair('Každou zmenši na dnešní únosnou podobu. Vztah může znamenat i krátce říci, že potřebuješ klid.', 'Make each small enough for today. Caring for a relationship can mean briefly saying you need quiet.'),
        pair('Zvol jednu další věc, kterou vědomě necháš na jindy. Zapiš si ji mimo dnešní seznam.', 'Choose one other thing to leave for another time deliberately. Put it outside today’s list.')
      ],
      question: pair('Co by dnes bylo dost, i kdyby se už nic dalšího nestalo?', 'What would be enough today, even if nothing else happened?'),
      sourceIds: []
    },
    {
      id: 'menstrual-object', durationMinutes: 4,
      title: pair('Předmět bez úkolu', 'An object without a task'),
      text: pair('Vezmi do ruky obyčejnou věc, kterou už máš. Hrnek, kámen nebo kousek látky. Chvíli od ní nic nechtěj.', 'Hold an ordinary thing you already have. A cup, stone or piece of cloth. Ask nothing of it for a moment.'),
      why: pair('Pozornost nemusí pokaždé vést k použití, vysvětlení nebo výsledku.', 'Attention does not always have to lead to use, explanation or an outcome.'),
      steps: [
        pair('Minutu vnímej tvar, hmotnost a povrch předmětu. Nemusíš mu přidělovat význam.', 'Notice the object’s shape, weight and surface for a minute. You need not assign it a meaning.'),
        pair('Polož ho a všimni si prázdných rukou. Nech další minutu plynout bez úkolu.', 'Put it down and notice your empty hands. Let another minute pass without a task.'),
        pair('Zapiš jednu věc, které se dnes chceš dotknout touto pomalejší pozorností.', 'Write one thing you want to meet with this slower attention today.')
      ],
      question: pair('Čemu mohu věnovat pozornost bez potřeby to měnit?', 'What can I attend to without having to change it?'),
      sourceIds: ['imagery-animas-nature']
    },
    {
      id: 'menstrual-unspoken', durationMinutes: 5,
      title: pair('Věta, která čeká', 'The sentence that is waiting'),
      text: pair('Dej chvíli hlas tomu, co se mezi povinnostmi nedostalo ke slovu. Zápis může zůstat jen tvůj.', 'Give a moment’s voice to what has had no room between your duties. The writing can remain yours alone.'),
      why: pair('Když potřebu nejprve uslyšíš pro sebe, můžeš později lépe volit, zda a komu ji sdělíš.', 'Hearing a need for yourself first can help you choose whether and with whom to share it later.'),
      steps: [
        pair('Doplň větu: „Pod vším, co dnes řeším, je ještě…“ Piš dvě minuty bez oprav.', 'Complete: “Beneath everything I am dealing with today, there is also…” Write for two minutes without editing.'),
        pair('Podtrhni jednu obyčejnou větu, která ti připadá pravdivá. Není třeba hledat skryté poselství.', 'Underline one ordinary sentence that feels true. There is no need to seek a hidden message.'),
        pair('Dopiš, co tato věta potřebuje: čas, pomoc, rozhovor, nebo zatím jen místo na papíře.', 'Add what this sentence needs: time, help, a conversation or simply room on the page for now.')
      ],
      question: pair('Co chci nejprve vyslechnout, než začnu hledat řešení?', 'What do I want to hear before I start looking for a solution?'),
      sourceIds: ['imagery-estes-excerpt', 'imagery-animas-activities']
    }
  ],
  follicular: [
    {
      id: 'follicular-experiment', durationMinutes: 5,
      title: pair('Pokus bez slibu', 'An experiment without a promise'),
      text: pair('Dej jednomu nápadu pět minut. Nemusíš mu hned slíbit celý měsíc.', 'Give one idea five minutes. You need not promise it a whole month.'),
      why: pair('Malý pokus poskytne zkušenost, kterou samotné plánování nedá.', 'A small experiment offers experience that planning alone cannot give.'),
      steps: [
        pair('Vyber jednu drobnou činnost, která tě zajímá. Zmenši ji tak, aby šla začít hned.', 'Choose a small activity that interests you. Make it small enough to begin now.'),
        pair('Tři minuty kresli, skládej, hledej první větu nebo zkoušej jednoduchý postup.', 'Spend three minutes drawing, arranging, finding a first sentence or trying a simple process.'),
        pair('Poznamenej si, co tě přitahovalo a co ne. O pokračování můžeš rozhodnout později.', 'Note what drew you in and what did not. You can decide about continuing later.')
      ],
      question: pair('Co chci poznat zkušeností a ne předčasným hodnocením?', 'What do I want to know through experience rather than judging it in advance?'),
      sourceIds: ['imagery-animas-activities']
    },
    {
      id: 'follicular-leaf', durationMinutes: 4,
      title: pair('Jeden list, tři objevy', 'One leaf, three discoveries'),
      text: pair('Zastav se u rostliny venku, za oknem nebo doma. Nech ji na jejím místě a pozoruj, co skutečně dělá.', 'Pause beside a plant outdoors, through a window or at home. Leave it where it is and observe what it is actually doing.'),
      why: pair('Skutečný detail může obnovit zvědavost lépe než předem připravený výklad.', 'An actual detail can renew curiosity more readily than an interpretation prepared in advance.'),
      steps: [
        pair('Najdi tři detaily, které dosud unikaly tvé pozornosti. Tvar okraje, směr růstu, změnu barvy.', 'Find three details you have not noticed before: an edge, a direction of growth, a change of colour.'),
        pair('Rozliš, co vidíš, a co si domýšlíš. Jednu otázku klidně nech bez odpovědi.', 'Distinguish what you see from what you infer. You can leave one question unanswered.'),
        pair('Vyber detail, ke kterému se vrátíš za několik dnů. Stačí si zapamatovat jeho místo.', 'Choose a detail to revisit in a few days. Remembering where it is is enough.')
      ],
      question: pair('Co je tu nové, i když tímto místem chodím každý den?', 'What is new here, even though I pass this place every day?'),
      sourceIds: ['imagery-animas-nature']
    },
    {
      id: 'follicular-line', durationMinutes: 4,
      title: pair('Čára, která neví předem', 'A line that does not know yet'),
      text: pair('Vezmi papír a tužku. Nejde o obrázek, který budeš ukazovat. Jde o chvíli, kdy ruka může něco objevit.', 'Take paper and a pencil. This is not a picture you have to show. It is a moment in which your hand can discover something.'),
      why: pair('Hra dává prostor možnosti, která se ještě nemusí obhájit jako užitečná.', 'Play makes room for a possibility that does not yet have to prove useful.'),
      steps: [
        pair('Nakresli jednu pomalou čáru. Přidej k ní jinou, která ji doplní nebo jí odporuje.', 'Draw one slow line. Add another that complements or resists it.'),
        pair('Dvě minuty pokračuj podle toho, co tě zajímá. Nic nemusíš opravovat.', 'Continue for two minutes, following what interests you. You do not have to correct anything.'),
        pair('Dej vzniklému tvaru pracovní jméno. Napiš jeden malý pokus, který ti připomíná.', 'Give the shape a provisional name. Write one small experiment it brings to mind.')
      ],
      question: pair('Kde si mohu dovolit chvíli nevědět?', 'Where can I allow myself not to know for a while?'),
      sourceIds: ['imagery-animas-activities', 'imagery-estes-excerpt']
    },
    {
      id: 'follicular-conditions', durationMinutes: 6,
      title: pair('Podmínky pro jedno semeno', 'Conditions for one seed'),
      text: pair('Nápad může potřebovat péči dřív než výkon. Zjisti, co mu skutečně chybí.', 'An idea may need care before effort. Find out what it actually lacks.'),
      why: pair('Konkrétní podmínka převádí neurčitou touhu do kroku, který můžeš ovlivnit.', 'A concrete condition turns a vague wish into a step you can influence.'),
      steps: [
        pair('Doprostřed papíru napiš jeden záměr. Kolem něj nech dost prázdného místa.', 'Write one intention in the middle of a page. Leave plenty of space around it.'),
        pair('Dopiš dvě podmínky, které potřebuje: třeba půl hodiny času a jeden rozhovor.', 'Add two conditions it needs, such as half an hour and one conversation.'),
        pair('Vyber jednu podmínku a první malý krok k ní. Ostatní nápady zatím nemusíš živit.', 'Choose one condition and a small first step towards it. You need not nourish every other idea yet.')
      ],
      question: pair('Co tomuto začátku pomůže víc než tlak na výsledek?', 'What would help this beginning more than pressure for a result?'),
      sourceIds: []
    },
    {
      id: 'follicular-beginner', durationMinutes: 3,
      title: pair('Známé místo poprvé', 'A familiar place for the first time'),
      text: pair('Podívej se na jeden kout svého dne, jako ho vidí někdo při první návštěvě. Může to být stůl, okno nebo krátký úsek cesty.', 'Look at one corner of your day as someone visiting for the first time might see it. It might be a desk, window or short stretch of a path.'),
      why: pair('Změna pozornosti dovolí znovu potkat i to, co už obvykle přehlížíš.', 'A shift of attention lets you meet something you usually overlook.'),
      steps: [
        pair('Minutu jen pozoruj světlo, zvuky a rozmístění věcí. Telefon nech stranou.', 'For a minute, notice light, sounds and the arrangement of things. Set your phone aside.'),
        pair('Vyber jeden přehlížený detail a popiš ho třemi vlastními slovy.', 'Choose one overlooked detail and describe it in three words of your own.'),
        pair('Všimni si, co tě láká poznat blíž. Nemusíš hned nic měnit.', 'Notice what you would like to know more closely here. You need not change anything now.')
      ],
      question: pair('Kde už místo zkušenosti používám jen známý název?', 'Where have I replaced experience with a familiar label?'),
      sourceIds: ['imagery-animas-nature']
    }
  ],
  ovulatory: [
    {
      id: 'ovulatory-offer', durationMinutes: 5,
      title: pair('Nabídnout a přijmout', 'Offer and receive'),
      text: pair('Vztah potřebuje oba směry. Zkus je na papíře oddělit, aby žádný nezmizel v tom druhém.', 'A relationship needs both directions. Separate them on paper so neither disappears into the other.'),
      why: pair('Jasná nabídka a jasná prosba ponechávají druhému možnost svobodně odpovědět.', 'A clear offer and a clear request leave the other person free to respond.'),
      steps: [
        pair('Napiš jednu věc, kterou dnes můžeš s chutí nabídnout, a jednu, kterou potřebuješ přijmout.', 'Write one thing you would willingly offer today and one thing you need to receive.'),
        pair('Ke každé dopiš konkrétní podobu a hranici. Třeba deset minut poslechu, ne celý večer.', 'Give each a concrete form and a limit. Ten minutes of listening, for example, rather than a whole evening.'),
        pair('Chceš-li to sdílet, nejprve se zeptej, zda má druhý prostor. Počítej i s odpovědí jindy nebo ne.', 'If you want to share it, first ask whether the other person has room. Allow “later” or “no” as answers too.')
      ],
      question: pair('Který směr je pro mě těžší: dávat, nebo nechat něco přijít?', 'Which direction is harder for me: giving or letting something come to me?'),
      sourceIds: []
    },
    {
      id: 'ovulatory-thanks', durationMinutes: 4,
      title: pair('Poděkování s přesným tvarem', 'Thanks with a precise shape'),
      text: pair('Vybav si jednu konkrétní pomoc, které se ti dostalo. Zkus ji pojmenovat bez velkých slov.', 'Recall one specific act of help you received. Try naming it without grand words.'),
      why: pair('Přesné poděkování ukazuje, co k tobě dolehlo. Nedělá z druhého člověka jeho roli.', 'Precise thanks show what reached you without reducing a person to their role.'),
      steps: [
        pair('Napiš, co druhý člověk skutečně udělal. Zůstaň u jedné události.', 'Write what the other person actually did. Stay with one event.'),
        pair('Doplň, co ti to umožnilo nebo ulehčilo. Vynech očekávání, že to musí dělat stále.', 'Add what it made possible or easier for you. Leave out any expectation that they must always do it.'),
        pair('Rozhodni, zda si poděkování necháš, nebo ho řekneš při vhodné chvíli. Odpověď není podmínkou.', 'Decide whether to keep the thanks or express them at a suitable moment. A response is not a condition.')
      ],
      question: pair('Jakou péči už přijímám, ale snadno ji přehlédnu?', 'What care am I already receiving but easily overlooking?'),
      sourceIds: []
    },
    {
      id: 'ovulatory-table', durationMinutes: 6,
      title: pair('Místo u stolu', 'A place at the table'),
      text: pair('Pohostinnost může začít jedním uvolněným místem. Připrav ho tak, aby v něm bylo místo i pro tebe.', 'Hospitality can begin with one cleared space. Prepare it so there is room for you as well.'),
      why: pair('Malé gesto může vyjádřit přijetí bez velké přípravy a bez překročení vlastních sil.', 'A small gesture can express welcome without elaborate preparation or exceeding your resources.'),
      steps: [
        pair('Uvolni malé místo na stole či vedle sebe. Polož tam sklenici vody nebo jinou obyčejnou věc pro pohodlí.', 'Clear a little space on a table or beside you. Put water or another ordinary comfort there.'),
        pair('Promysli, koho nebo co chceš do svého dne přijmout. Může to být i půlhodina vlastní četby.', 'Consider whom or what you want to welcome into your day. It can also be half an hour of reading for yourself.'),
        pair('Pojmenuj podobu setkání, kterou opravdu uneseš. Pokud zveš druhého, nech mu volbu.', 'Name a form of meeting you can actually sustain. If you invite someone, leave them a choice.')
      ],
      question: pair('Jak vypadá otevřenost, ve které zůstává místo také pro mě?', 'What does openness look like when there is room for me too?'),
      sourceIds: ['imagery-ovid-hospitality']
    },
    {
      id: 'ovulatory-voice', durationMinutes: 3,
      title: pair('Jedno přání vlastním hlasem', 'One wish in your own voice'),
      text: pair('Některá přání se při vyslovení zmenší do skutečné velikosti. Jiná teprve dostanou obrys.', 'Some wishes find their real size when spoken. Others gain an outline for the first time.'),
      why: pair('Vlastní hlas může pomoci uslyšet rozdíl mezi přáním, požadavkem a domněnkou.', 'Your own voice can help you hear the difference between a wish, a demand and an assumption.'),
      steps: [
        pair('O samotě dokonči nahlas větu: „Dnes si přeji…“ Použij obyčejný hlas, nebo větu napiš.', 'In private, complete aloud: “Today I would like…” Use your ordinary voice, or write it down.'),
        pair('Zkus ji říci znovu konkrétněji. Místo celkové změny vztahu pojmenuj jedno možné setkání či gesto.', 'Try making it more specific. Name one possible meeting or gesture rather than a complete change in the relationship.'),
        pair('Doplň, co můžeš udělat ty a o co by bylo potřeba požádat. Sdílení není povinné.', 'Add what you can do and what would require a request. Sharing is optional.')
      ],
      question: pair('Co chci vyslovit jasně a přitom ponechat rozhodnutí druhému?', 'What do I want to express clearly while leaving the other person free to decide?'),
      sourceIds: ['imagery-estes-excerpt']
    },
    {
      id: 'ovulatory-reciprocity', durationMinutes: 5,
      title: pair('Jedna péče směrem ven', 'One act of care outwards'),
      text: pair('Všimni si jednoho místa nebo živé bytosti, se kterou sdílíš každodennost. Zjisti, co potřebuje, dřív než začneš pomáhat.', 'Notice one place or living being that shares your daily life. Find out what it needs before trying to help.'),
      why: pair('Vzájemnost začíná pozorností ke skutečným podmínkám druhého.', 'Reciprocity begins with attention to the other’s actual conditions.'),
      steps: [
        pair('Vyber něco známého: pokojovou rostlinu, společný stůl nebo člověka, se kterým žiješ.', 'Choose something familiar: a houseplant, a shared table or someone you live with.'),
        pair('Minutu pozoruj nebo se zeptej. Rostlina nemusí potřebovat vodu a člověk nemusí chtít radu.', 'Observe for a minute or ask. A plant may not need water and a person may not want advice.'),
        pair('Udělej jednu drobnou péči, která odpovídá skutečné potřebě. I vědomé nezasahování může být správná volba.', 'Offer one small act of care that fits the actual need. Deliberately leaving something alone can also be the right choice.')
      ],
      question: pair('Co si ode mě toto místo nebo tento člověk žádá doopravdy?', 'What does this place or person actually ask of me?'),
      sourceIds: ['imagery-animas-nature']
    }
  ],
  luteal: [
    {
      id: 'luteal-harvest', durationMinutes: 6,
      title: pair('Plod, semeno, kompost', 'Fruit, seed, compost'),
      text: pair('Podívej se na jeden malý úsek posledních dnů. Ne všechno, co končí, bylo zbytečné.', 'Look at one small stretch of the past few days. Not everything that ends has been wasted.'),
      why: pair('Rozlišení výsledku, možnosti a ukončeného pokusu pomáhá nenést všechno dál stejným způsobem.', 'Distinguishing an outcome, a possibility and a finished attempt helps you carry them forward differently.'),
      steps: [
        pair('Rozděl papír na tři části: co dozrálo, co chci zasít dál a co mohu pustit.', 'Divide a page into three parts: what ripened, what to sow again and what to release.'),
        pair('Do každé napiš nejvýše dvě konkrétní věci. Nemusí tvořit vyrovnanou bilanci.', 'Write no more than two concrete things in each. They need not make a balanced account.'),
        pair('Vyber jednu věc k uzavření. Napiš, jak bude konec vypadat v praxi, třeba odhlášením jednoho závazku.', 'Choose one thing to close. Write what ending it would look like in practice, such as withdrawing from one commitment.')
      ],
      question: pair('Co už dalo své a nemusí se proměnit v další povinnost?', 'What has already given what it can and need not become another duty?'),
      sourceIds: ['imagery-animas-activities']
    },
    {
      id: 'luteal-boundary', durationMinutes: 4,
      title: pair('Hranice jednou větou', 'A boundary in one sentence'),
      text: pair('Najdi pro jednu hranici slova, která jsou pevná a obyčejná. Můžeš si je nejprve vyzkoušet jen pro sebe.', 'Find firm, ordinary words for one boundary. You can try them privately first.'),
      why: pair('Příprava věty může oddělit skutečnou hranici od dlouhého obhajování vlastní potřeby.', 'Preparing a sentence can separate an actual boundary from a long defence of your need.'),
      steps: [
        pair('Vyber malou situaci, ve které často souhlasíš nad své možnosti.', 'Choose a small situation in which you often agree beyond your capacity.'),
        pair('Napiš stručně, co teď nemůžeš. Pokud opravdu chceš, přidej jinou konkrétní možnost.', 'Write briefly what you cannot do now. Add another concrete option only if you actually want to.'),
        pair('Přečti si větu pomalu. Vynech omluvy, které říkáš jen proto, aby druhý nemohl být zklamaný.', 'Read the sentence slowly. Remove apologies included only to prevent the other person from feeling disappointed.')
      ],
      question: pair('Kde by jasnější věta předešla pozdější hořkosti?', 'Where could a clearer sentence prevent later resentment?'),
      sourceIds: ['imagery-estes-excerpt']
    },
    {
      id: 'luteal-mend', durationMinutes: 5,
      title: pair('Opravit jeden drobný vztah k věcem', 'Mend one small relationship with things'),
      text: pair('Vyber malou věc, která ti slouží a čeká na péči. Tentokrát nemusíš přidávat nic nového.', 'Choose a small thing that serves you and is waiting for care. This time you need not add anything new.'),
      why: pair('Péče o to, co už máme, může být konkrétní podobou návratu a vděčnosti.', 'Caring for what we already have can give returning and gratitude a concrete form.'),
      steps: [
        pair('Najdi drobný úkol na pár minut: očistit boty, srovnat pracovní místo nebo vrátit knihu do obalu.', 'Find a task of a few minutes: clean your shoes, arrange your workspace or put a book back in its cover.'),
        pair('Udělej jej pomalu a bez přidávání dalších úkolů. Všimni si, co ti daná věc umožňuje.', 'Do it slowly, without adding other tasks. Notice what the thing makes possible for you.'),
        pair('Po pěti minutách skonči. Pojmenuj, co stojí za udržování a co už jen zabírá místo.', 'Stop after five minutes. Name what is worth maintaining and what merely takes up space.')
      ],
      question: pair('O co má smysl pečovat dál, protože to skutečně patří k mému životu?', 'What is worth continuing to care for because it truly belongs in my life?'),
      sourceIds: []
    },
    {
      id: 'luteal-review', durationMinutes: 5,
      title: pair('Ohlédnutí bez rozsudku', 'A review without a verdict'),
      text: pair('Vrať se k jedné nedávné situaci. Zkus ji nejprve vidět, teprve potom vykládat.', 'Return to one recent situation. Try seeing it before interpreting it.'),
      why: pair('Konkrétní pozorování dává příštímu kroku pevnější půdu než celkové hodnocení sebe.', 'A concrete observation gives the next step firmer ground than an overall judgement of yourself.'),
      steps: [
        pair('Napiš tři věci, které se skutečně staly. Odděl je od toho, co si o nich myslíš.', 'Write three things that actually happened. Separate them from what you think about them.'),
        pair('Dopiš, co tě podpořilo a co tě stálo příliš mnoho sil.', 'Add what supported you and what cost too much of your strength.'),
        pair('Vyber jednu drobnou změnu pro příště. O zbytku zatím nemusíš rozhodnout.', 'Choose one small change for next time. You need not decide the rest yet.')
      ],
      question: pair('Jakou zkušenost mohu přijmout bez odsuzování sebe?', 'What experience can I accept without condemning myself?'),
      sourceIds: ['imagery-animas-activities']
    },
    {
      id: 'luteal-thread', durationMinutes: 4,
      title: pair('Nit do dalšího obratu', 'A thread into the next turn'),
      text: pair('Nakresli jednoduchou spirálu. Nemusí být pravidelná. Ať se na ni vejde něco, co chceš příště rozpoznat dřív.', 'Draw a simple spiral. It need not be regular. Let it hold something you want to recognise sooner next time.'),
      why: pair('Malá připomínka může uchovat zkušenost, kterou při dalším začátku snadno přeslechneš.', 'A small reminder can preserve experience that is easy to overlook at the next beginning.'),
      steps: [
        pair('K jednomu závitu napiš situaci, která se opakuje. Zůstaň u konkrétního okamžiku.', 'Beside one turn, write a recurring situation. Stay with a concrete moment.'),
        pair('K dalšímu napiš časný signál, kterého si chceš všimnout. Třeba odkládání jídla nebo příliš rychlé ano.', 'Beside the next, write an early sign you want to notice, such as delaying a meal or saying yes too quickly.'),
        pair('Na volný konec napiš jednu jinou možnou odpověď. Papír dej tam, kde ti bude připomínka užitečná.', 'At the open end, write one different possible response. Put the page where the reminder will be useful.')
      ],
      question: pair('Co mi příště pomůže najít cestu dřív, než se ztratím v dobře známém kruhu?', 'What could help me find the way before I get lost in a familiar circle next time?'),
      sourceIds: ['imagery-apollodorus-thread']
    }
  ]
};

export const CYCLE_STORIES = {
  menstrual: [
    {
      id: 'menstrual-inana-gates', kind: 'traditional',
      tradition: pair('Sumerská tradice · Inanin sestup', 'Sumerian tradition · Inana’s descent'),
      title: pair('Inana u sedmi bran', 'Inana at the seven gates'),
      text: pair('V sumerském příběhu sestupuje Inana do podsvětí. U každé ze sedmi bran přichází o část oděvu či odznak moci. Před Ereškigal nakonec stojí bez výsad, které ji provázely nahoře. Sestup má skutečnou cenu. Ze dna ji nedostane jen její vlastní moc.', 'In the Sumerian story, Inana descends into the underworld. At each of seven gates she loses clothing or an emblem of power. Before Ereshkigal she finally stands without the privileges she held above. The descent has a real cost. Her own power alone will not bring her back.'),
      why: pair('V našem čtení se za rolemi může ozvat prostá potřeba. Odložit výkon ale neznamená vzdát se důstojnosti ani přijmout ubližování.', 'In our reading, a simple need can become audible behind our roles. Setting achievement aside does not mean surrendering dignity or accepting harm.'),
      question: pair('Kterou roli mohu na chvíli odložit, aby se ukázalo, co potřebuji?', 'Which role can I set down briefly so I can see what I need?'),
      sourceIds: ['imagery-inana']
    },
    {
      id: 'menstrual-hecate', kind: 'traditional',
      tradition: pair('Řecká tradice · Homérský hymnus', 'Greek tradition · Homeric hymn'),
      title: pair('Hekaté nese pochodeň', 'Hecate carries a torch'),
      text: pair('V Homérském hymnu hledá Démétér ztracenou Persefonu. Hekaté zaslechla její výkřik, ale neviděla únosce. Nepředstírá, že ví víc. Vezme pochodně a jde s Démétér hledat svědka. Společná cesta začíná u pravdivého přiznání, co jedna z nich ví a co ne.', 'In the Homeric hymn, Demeter searches for the missing Persephone. Hecate heard her cry but did not see the abductor. She does not pretend to know more. Carrying torches, she accompanies Demeter to seek a witness. Their shared search begins with an honest account of what is known and unknown.'),
      why: pair('Doprovázení nemusí přinést rychlé vysvětlení. Někdy je jeho podobou ochota zůstat a hledat spolu.', 'Accompaniment need not bring a quick explanation. Sometimes it means staying and searching together.'),
      question: pair('Od koho dnes potřebuji spíš přítomnost než odpověď?', 'From whom do I need presence more than an answer today?'),
      sourceIds: ['imagery-hymn-demeter']
    },
    {
      id: 'menstrual-odysseus-rest', kind: 'traditional',
      tradition: pair('Řecká tradice · Odysseia', 'Greek tradition · Odyssey'),
      title: pair('Odysseus pod olivovníky', 'Odysseus beneath the olive trees'),
      text: pair('Po ztroskotání dorazí Odysseus vyčerpaný na pevninu. Nehledá hned cestu k vítězství. Najde kryté místo pod dvěma propletenými výhony olivovníku, shromáždí listí a uloží se do něj. Vyprávění nechává hrdinu spát, dřív než ho pošle k dalšímu setkání.', 'Exhausted after shipwreck, Odysseus reaches land. He does not immediately seek a way to triumph. He finds shelter beneath two intertwined olive shoots, gathers leaves and lies down among them. The story lets its hero sleep before sending him towards the next encounter.'),
      why: pair('Odpočinek může patřit přímo k cestě. Není odměnou vyhrazenou až tomu, kdo dorazil domů.', 'Rest can belong to the journey itself. It is not a reward reserved for someone who has already reached home.'),
      question: pair('Jaký malý přístřešek mohu svému dni dát ještě předtím, než bude všechno hotové?', 'What small shelter can I give my day before everything is finished?'),
      sourceIds: ['imagery-odyssey-rest']
    },
    {
      id: 'menstrual-amaterasu', kind: 'traditional',
      tradition: pair('Japonská tradice · Amaterasu', 'Japanese tradition · Amaterasu'),
      title: pair('Amaterasu a smích před jeskyní', 'Amaterasu and laughter outside the cave'),
      text: pair('Amaterasu, sluneční bohyně, se ukryje v nebeské skalní jeskyni. Před vchodem začne Amenouzume tančit na obrácené kádi. Shromáždění bohové se rozesmějí. Amaterasu zaslechne jejich veselí a zvědavost ji přivede ven. Tanec tak pomůže vrátit bohyni, jejíž světlo ostatním chybí.', 'Amaterasu, the sun goddess, hides inside a heavenly rock cave. Outside, Amenouzume begins dancing on an overturned tub. The assembled deities burst into laughter. Hearing their merriment, Amaterasu becomes curious and emerges. The dance helps bring back the goddess whose light the others have been missing.'),
      why: pair('V našem čtení může návrat začít zvědavostí. Hledáme pozvání, na které lze odpovědět vlastním tempem.', 'In our reading, a return can begin with curiosity. We look for an invitation that allows an answer at our own pace.'),
      question: pair('Co ve mně dnes probouzí tichou chuť znovu se přiblížit světu?', 'What awakens a quiet wish to approach the world again today?'),
      sourceIds: ['imagery-amaterasu']
    },
    {
      id: 'menstrual-isis', kind: 'traditional',
      tradition: pair('Egyptská tradice · Plútarchovo podání', 'Egyptian tradition · Plutarch’s account'),
      title: pair('Isis hledá Osirida', 'Isis searches for Osiris'),
      text: pair('Plútarchos vypráví, že Isis hledá truhlu s tělem Osirida. Doptává se lidí a dorazí až do Byblu, kde truhlu obrostl strom použitý jako palácový sloup. Získá ji zpět. Když je tělo později rozděleno a rozptýleno, znovu se vydá hledat jeho části a pečuje o jejich pohřbení.', 'Plutarch tells how Isis searches for the chest containing Osiris’s body. She questions people and reaches Byblos, where a tree enclosing the chest has become a palace pillar. She retrieves it. When the body is later divided and scattered, she searches again for its parts and attends to their burial.'),
      why: pair('Pro nás tento příběh otevírá místo pro zármutek a péči o paměť. Nevyžaduje napravit všechno, co se rozpadlo.', 'For us, this story makes room for grief and care for memory. It does not require repairing everything that has broken apart.'),
      question: pair('Čemu chci dát místo ve své paměti, i když to nemohu vrátit?', 'What do I want to give a place in my memory, even though I cannot bring it back?'),
      sourceIds: ['imagery-plutarch-isis']
    }
  ],
  follicular: [
    {
      id: 'follicular-inana-return', kind: 'traditional',
      tradition: pair('Sumerská tradice · Inanin sestup', 'Sumerian tradition · Inana’s descent'),
      title: pair('Pomoc, která najde cestu dolů', 'Help that finds a way down'),
      text: pair('Když se Inana nevrací, Ninšubur vyhledá pomoc. Enki vyšle dvě bytosti, které vyslechnou bolest Ereškigal. Získají Inanino tělo a použijí životodárnou rostlinu a vodu. Inana znovu vstane. Její návrat má další podmínky, ale začíná věrností někoho, kdo na ni nezapomněl.', 'When Inana does not return, Ninshubur seeks help. Enki sends two beings who hear Ereshkigal’s pain. They obtain Inana’s body and use a life-giving plant and water. Inana rises again. Her return has further conditions, but it begins with someone’s refusal to forget her.'),
      why: pair('Nový začátek nemusí vzniknout ze soběstačnosti. Může potřebovat pomoc, kterou nelze nahradit dalším tlakem na sebe.', 'A beginning need not arise from self-sufficiency. It may need help that more pressure on yourself cannot replace.'),
      question: pair('Jakou konkrétní pomoc potřebuji, aby se něco mohlo znovu pohnout?', 'What concrete help do I need for something to begin moving again?'),
      sourceIds: ['imagery-inana']
    },
    {
      id: 'follicular-psyche', kind: 'traditional',
      tradition: pair('Řeckořímská tradice · Apuleius', 'Greco-Roman tradition · Apuleius'),
      title: pair('Psyché a drobná práce mravenců', 'Psyche and the small work of ants'),
      text: pair('Apuleiova Venuše přikáže Psyché do večera roztřídit směs semen a obilí. Psyché před nesplnitelnou hromadou strne. Jeden mravenec svolá další a společně oddělí jednotlivé druhy. Úkol, který přesahoval jednoho člověka, dokončí množství malých pomocníků.', 'Apuleius’s Venus orders Psyche to sort a mixture of seeds and grain before evening. Psyche freezes before the impossible heap. One ant summons others, and together they separate the different kinds. Many small helpers finish a task that exceeded one person’s capacity.'),
      why: pair('Naše čtení se zastavuje u pomoci a rozlišení. Kruté zadání není důkazem, že si lásku musíme odpracovat.', 'Our reading rests on help and discernment. A cruel task is not evidence that love must be earned through labour.'),
      question: pair('Co lze rozdělit na menší části a s čím nemusím zůstat o samotě?', 'What can be divided into smaller parts, and what need not be faced alone?'),
      sourceIds: ['imagery-apuleius-psyche']
    },
    {
      id: 'follicular-izanagi', kind: 'traditional',
      tradition: pair('Japonská tradice · Kodžiki', 'Japanese tradition · Kojiki'),
      title: pair('Izanagi u řeky', 'Izanagi at the river'),
      text: pair('Po návratu ze země mrtvých se Izanagi v Kodžiki rozhodne očistit. Odloží výstroj a vstoupí do řeky. Z jeho omývání se rodí další božstva. Z levého oka vzejde sluneční Amaterasu, z pravého měsíční Cukujomi. Vyprávění tak po cestě do podsvětí otevírá nový děj.', 'After returning from the land of the dead, Izanagi decides to purify himself in the Kojiki. He removes his belongings and enters a river. Further deities arise as he washes. Amaterasu, associated with the sun, comes from his left eye; Tsukuyomi, associated with the moon, from his right. Another story opens after the descent.'),
      why: pair('Náš obraz se týká přechodu mezi dvěma úseky života. Nespojujeme menstruaci ani lidské tělo s nečistotou.', 'Our image concerns the passage between two parts of life. We do not associate menstruation or the human body with impurity.'),
      question: pair('Jak poznám, že jednu věc uzavírám a druhé dávám prostor?', 'How will I recognise that I am closing one thing and making room for another?'),
      sourceIds: ['imagery-kojiki-purification']
    },
    {
      id: 'follicular-idunn', kind: 'traditional',
      tradition: pair('Severská tradice · Prozaická Edda', 'Norse tradition · Prose Edda'),
      title: pair('Návrat Idunn', 'The return of Idunn'),
      text: pair('Loki vyláká Idunn s jejími jablky z Ásgardu a obr Tjazi ji unese. Bohové bez ní začnou stárnout. Loki si vypůjčí Freyino sokolí peří a letí za ní. Promění Idunn v ořech a odnese ji v drápech zpět. Návrat závisí na záchraně té, na kterou ostatní spoléhali.', 'Loki lures Idunn and her apples out of Asgard, where the giant Thjazi abducts her. Without her, the gods begin to age. Borrowing Freyja’s falcon plumage, Loki flies to her. He turns Idunn into a nut and carries her back in his claws. Renewal depends on rescuing the one the others relied upon.'),
      why: pair('V našem čtení se ptáme po zdrojích obnovy, které snadno přehlížíme. Péče potřebuje podmínky i pro toho, kdo ji poskytuje.', 'In our reading, we ask about overlooked sources of renewal. Care needs conditions that also sustain the person providing it.'),
      question: pair('Co mě pravidelně obnovuje a jak se o tento zdroj starám?', 'What regularly renews me, and how do I care for that source?'),
      sourceIds: ['imagery-edda-idunn']
    },
    {
      id: 'follicular-savitri', kind: 'traditional',
      tradition: pair('Indická tradice · Mahábhárata', 'Indian tradition · Mahabharata'),
      title: pair('Sávitrí následuje Jamu', 'Savitri follows Yama'),
      text: pair('Když Jama odnáší život Satjavána, Sávitrí jde za ním. V rozhovoru získává několik darů, mezi nimi příslib potomků se Satjavánem. Potom žádá jeho život: bez něj se tento slib nemůže naplnit. Jama Satjavána propustí a Sávitrí se vrací k jeho tělu. Jejich rozhovor promění zdánlivě uzavřený osud.', 'When Yama takes Satyavan’s life, Savitri follows him. Their conversation brings several boons, including a promise of children with Satyavan. She then asks for his life: without him, that promise cannot be fulfilled. Yama releases Satyavan, and Savitri returns to his body. Their conversation changes an apparently settled fate.'),
      why: pair('Bereme si otázku, jak mluvit přesně o tom, na čem záleží. Mýtický návrat ze smrti není příslibem, že vytrvalost vyřeší každou ztrátu.', 'We take a question about speaking precisely for what matters. A mythical return from death does not promise that persistence can resolve every loss.'),
      question: pair('Jakou prosbu potřebuji vyslovit jasněji?', 'What request do I need to express more clearly?'),
      sourceIds: ['imagery-mahabharata-savitri']
    }
  ],
  ovulatory: [
    {
      id: 'ovulatory-baucis-philemon', kind: 'traditional',
      tradition: pair('Řeckořímská tradice · Ovidius', 'Greco-Roman tradition · Ovid'),
      title: pair('Baukis a Filémón prostírají', 'Baucis and Philemon set the table'),
      text: pair('U Ovidia chodí dva bohové krajem v podobě poutníků a hledají přístřeší. Přijme je chudý pár Baukis a Filémón. Prostřou obyčejné jídlo a vyrovnají viklající se stůl. Jejich dům nemá mnoho prostředků, přesto se v něm návštěva setká s pozorností.', 'In Ovid, two gods travel disguised as strangers seeking shelter. The poor couple Baucis and Philemon welcome them. They set out simple food and steady a wobbling table. Their house has few resources, yet its visitors encounter attentive care.'),
      why: pair('Z tohoto příběhu vybíráme obyčejné gesto pohostinnosti. Přijetí nemusí být velkolepé ani vyčerpat hostitele.', 'We take an ordinary gesture of hospitality from this story. Welcome need not be grand or exhaust the host.'),
      question: pair('Jaké malé gesto by dnes řeklo: je tu pro tebe místo?', 'What small gesture would say today: there is room for you here?'),
      sourceIds: ['imagery-ovid-hospitality']
    },
    {
      id: 'ovulatory-nausicaa', kind: 'traditional',
      tradition: pair('Řecká tradice · Odysseia', 'Greek tradition · Odyssey'),
      title: pair('Nausiká a cizinec na břehu', 'Nausicaa and the stranger on the shore'),
      text: pair('Nausiká potká ztroskotaného Odyssea. Zařídí mu oděv a jídlo a poradí cestu do města. Odysseus požádá, aby se mohl umýt o samotě. Pomoc tedy neznamená obsadit celý prostor druhého. Setkání pokračuje s ohledem na jeho zranitelnost i na okolnosti jejího života.', 'Nausicaa meets the shipwrecked Odysseus. She arranges clothes and food and explains the way to the city. Odysseus asks to wash in private. Helping does not require occupying all of another person’s space. Their encounter continues with regard for his vulnerability and the circumstances of her life.'),
      why: pair('V našem čtení se laskavost ptá i na podobu pomoci. Blízkost může nechat druhému vlastní prostor.', 'In our reading, kindness considers the form of help too. Closeness can leave another person room of their own.'),
      question: pair('Jak se mohu přiblížit a přitom respektovat, co si druhý přeje nechat pro sebe?', 'How can I come closer while respecting what another person wishes to keep private?'),
      sourceIds: ['imagery-odyssey-meeting']
    },
    {
      id: 'ovulatory-krishna-sudama', kind: 'traditional',
      tradition: pair('Indická tradice · Bhágavata purána', 'Indian tradition · Bhagavata Purana'),
      title: pair('Kršna vítá Sudámu', 'Krishna welcomes Sudama'),
      text: pair('Chudý Sudáma přichází za Kršnou, přítelem ze společných studií. Nese trochu rýžových vloček zabalených do staré látky. Kršna mu jde vstříc, obejme ho a s úctou ho přijme ve svém sídle. Drží ho za ruku a vzpomínají. Okolní přepych nezakryje přátelství, kvůli kterému návštěva přišla.', 'The poor Sudama visits Krishna, his friend from their days as students. He carries a little flattened rice wrapped in old cloth. Krishna rises to meet him, embraces him and welcomes him with honour into his residence. Holding hands, they remember their past. The surrounding splendour does not eclipse their friendship.'),
      why: pair('V tomto čtení může setkání překročit rozdíl v majetku i postavení. Přijetí poznáme podle konkrétní pozornosti.', 'In this reading, a meeting can reach across differences in wealth and position. Welcome becomes visible through concrete attention.'),
      question: pair('Jak dám dnes najevo, že mi záleží na člověku, ne na tom, co přináší?', 'How will I show today that I care about the person, rather than what they bring?'),
      sourceIds: ['imagery-bhagavata-sudama']
    },
    {
      id: 'ovulatory-okuninushi', kind: 'traditional',
      tradition: pair('Japonská tradice · Kodžiki', 'Japanese tradition · Kojiki'),
      title: pair('Ókuninuši a zajíc z Inaby', 'Okuninushi and the hare of Inaba'),
      text: pair('Ókuninuši jde za svými bratry a nese jejich zavazadla. U cesty najde poraněného zajíce. Rada bratrů mu bolest ještě zhoršila. Ókuninuši se nejprve zeptá, co se stalo, a vyslechne jeho příběh. Potom poradí jinou pomoc, po které se zajíc v mýtu uzdraví a předpoví mu sňatek s princeznou.', 'Okuninushi follows his brothers, carrying their luggage. Beside the road he finds an injured hare whose pain their advice has made worse. Okuninushi first asks what happened and hears its story. He then offers different help. In the myth, the hare recovers and foretells his union with a princess.'),
      why: pair('Z příběhu vybíráme chvíli, kdy otázka předchází radě. Mýtický způsob uzdravení nepřenášíme do péče o zdraví.', 'We focus on the moment when a question comes before advice. The story’s miraculous remedy is not carried over into health care.'),
      question: pair('Na co se potřebuji zeptat, než nabídnu řešení?', 'What do I need to ask before offering a solution?'),
      sourceIds: ['imagery-kojiki-hare']
    },
    {
      id: 'ovulatory-thor-horn', kind: 'traditional',
      tradition: pair('Severská tradice · Prozaická Edda', 'Norse tradition · Prose Edda'),
      title: pair('Thór a roh spojený s mořem', 'Thor and the horn connected to the sea'),
      text: pair('Na dvoře Útgardského Lokiho dostane Thór roh, který má vypít. Ať se snaží sebevíc, nedaří se mu ho vyprázdnit. Teprve později hostitel odhalí klam: druhý konec rohu sahal do moře. Thórovo pití způsobilo odliv. Úkol byl mnohem větší, než mohl ze svého místa poznat.', 'At Utgarda-Loki’s court, Thor is given a drinking horn to empty. Despite his effort, he cannot finish it. Only later does his host reveal the illusion: the other end reached into the sea. Thor’s drinking caused the ebb of the tide. The task was far larger than it appeared from where he stood.'),
      why: pair('Naše čtení se ptá po měřítku a skrytých okolnostech. Viditelný výsledek nemusí vypovídat o celém úsilí.', 'Our reading asks about scale and hidden circumstances. A visible result may not tell the whole story of an effort.'),
      question: pair('Co o celé situaci ještě nevím, když hodnotím svůj podíl?', 'What do I still not know about the whole situation when judging my contribution?'),
      sourceIds: ['imagery-edda-thor']
    }
  ],
  luteal: [
    {
      id: 'luteal-ariadne', kind: 'traditional',
      tradition: pair('Řecká tradice · Apollodóros', 'Greek tradition · Apollodorus'),
      title: pair('Ariadnina nit', 'Ariadne’s thread'),
      text: pair('V Apollodórově podání získá Ariadna od Daidala způsob, jak projít labyrintem. Dá Théseovi nit, kterou přiváže u vchodu a cestou odvíjí. Když je zápas u konce, může se po ní vrátit. Vstoupit doprostřed nestačí. Je třeba uchovat i vztah k cestě ven.', 'In Apollodorus’s account, Ariadne learns from Daedalus how to pass through the labyrinth. She gives Theseus a thread to fasten at the entrance and unwind as he walks. After the struggle, he follows it back. Reaching the centre is not enough. The way out must also be kept in reach.'),
      why: pair('Pro nás je nit obrazem konkrétní opory. Může jí být domluva, poznámka nebo člověk, ke kterému se dá vrátit.', 'For us, the thread represents concrete support: an agreement, a note or a person we can return to.'),
      question: pair('Co mi pomáhá vrátit se k sobě, když je situace příliš složitá?', 'What helps me return to myself when a situation becomes too complicated?'),
      sourceIds: ['imagery-apollodorus-thread']
    },
    {
      id: 'luteal-sekhmet', kind: 'traditional',
      tradition: pair('Egyptská tradice · Sekhmet', 'Egyptian tradition · Sekhmet'),
      title: pair('Sekhmet a zastavená zkáza', 'Sekhmet and the destruction brought to a halt'),
      text: pair('Sluneční bůh Ra vyšle Sekhmet, aby zničila lidstvo. Později svého rozhodnutí lituje, ale její běsnění už nedokáže ovládnout. Nechá ji utišit pivem obarveným do červena, které připomíná krev. V egyptské tradici je tato lví bohyně spojena se zkázou i s možností ji zadržet.', 'The sun god Ra sends Sekhmet to destroy humanity. Later he regrets his decision, but can no longer control her fury. He has her subdued with beer coloured red to resemble blood. In Egyptian tradition, this lion-headed goddess is associated both with destruction and with the power to withhold it.'),
      why: pair('V našem čtení jde o okamžik, kdy je potřeba zastavit ničivý postup. Dnešní krok může být prostá, domluvená přestávka.', 'Our reading concerns recognising when a destructive course must stop. A present-day step can be a simple, agreed pause.'),
      question: pair('Podle čeho poznám, že je čas přerušit spor a vrátit se k němu později?', 'How will I recognise that it is time to pause a disagreement and return to it later?'),
      sourceIds: ['imagery-sekhmet']
    },
    {
      id: 'luteal-penelope', kind: 'traditional',
      tradition: pair('Řecká tradice · Odysseia', 'Greek tradition · Odyssey'),
      title: pair('Pénelopé získává čas', 'Penelope makes time'),
      text: pair('Nápadníci nutí Pénelopé rozhodnout o novém sňatku. Slíbí odpověď, až dokončí rubáš pro Láerta. Ve dne tká a v noci práci párá. Homérův příběh ukazuje ženu, která v tísnivých podmínkách získává čas, dokud je její postup odhalen.', 'Suitors press Penelope to decide on a new marriage. She promises an answer once she finishes Laertes’ shroud. She weaves by day and unravels the work at night. Homer shows a woman making time under oppressive conditions until her strategy is discovered.'),
      why: pair('Z příběhu si bereme právo nerozhodovat pod cizím tlakem. Otevřená dohoda o čase je pro běžný vztah vhodnější než skrytá hra.', 'We take from this story the right not to decide under someone else’s pressure. An open agreement about time is better suited to an ordinary relationship than a concealed strategy.'),
      question: pair('O jaký čas na rozhodnutí si potřebuji výslovně říci?', 'What time to decide do I need to ask for explicitly?'),
      sourceIds: ['imagery-odyssey-penelope']
    },
    {
      id: 'luteal-shiva-poison', kind: 'traditional',
      tradition: pair('Indická tradice · Bhágavata purána', 'Indian tradition · Bhagavata Purana'),
      title: pair('Šiva a jed z mléčného oceánu', 'Shiva and the poison from the ocean of milk'),
      text: pair('Bohové a asurové stloukají mléčný oceán, aby získali nektar nesmrtelnosti. Nejdřív se však objeví prudký jed, který ohrozí živé bytosti. Obrátí se na Šivu. Ten po rozhovoru s Bhavání jed přijme do dlaně a vypije. Jeho hrdlo zmodrá: i vytoužený společný záměr odkryl ničivou stránku.', 'The gods and asuras churn the ocean of milk to obtain the nectar of immortality. First, however, a potent poison emerges, threatening living beings. They turn to Shiva. After speaking with Bhavani, he takes the poison into his palm and drinks it. His throat turns blue: a desired common endeavour has revealed a destructive side.'),
      why: pair('Naše otázka míří ke skrytým nákladům společného úsilí. Šivův božský čin nedává člověku povinnost pohltit všechno, co druhým ubližuje.', 'Our question concerns the hidden costs of shared effort. Shiva’s divine act places no duty on a person to absorb everything that harms others.'),
      question: pair('Jakou cenu našeho záměru potřebujeme pojmenovat a nést společně?', 'What cost of our endeavour do we need to name and bear together?'),
      sourceIds: ['imagery-bhagavata-shiva']
    },
    {
      id: 'luteal-odin-runes', kind: 'traditional',
      tradition: pair('Severská tradice · Hávamál', 'Norse tradition · Havamal'),
      title: pair('Ódin nachází runy', 'Odin finds the runes'),
      text: pair('V Hávamálu Ódin vypráví o devíti nocích na stromě bičovaném větrem. Projde krajní zkouškou a zahlédne runy, které uchopí. Po návratu mluví o růstu porozumění: jedno slovo ho vede k dalšímu a čin k činu. Získané poznání tak ve vyprávění otevírá pokračování.', 'In the Havamal, Odin recounts nine nights on a wind-battered tree. He undergoes an extreme ordeal, sees the runes and takes them up. Afterwards, he describes understanding that continues to grow: one word leads to another and one deed to another. The knowledge gained opens a further path in the poem.'),
      why: pair('Z mýtu si bereme navazování zkušeností. Jeho tělesná zkouška není cvičení ani podmínka získání moudrosti.', 'We take from the myth the way experience builds upon experience. Its bodily ordeal is neither an exercise nor a condition for becoming wise.'),
      question: pair('Která zkušenost mi právě pomáhá lépe porozumět té další?', 'Which experience is helping me understand the next one more clearly?'),
      sourceIds: ['imagery-havamal-runes']
    }
  ]
};

export const CYCLE_IMAGERY_SOURCES = [
  {
    id: 'imagery-plotkin-map',
    title: 'Bill Plotkin · An Introduction to the Eco-Soulcentric Developmental Wheel',
    url: 'https://www.animas.org/wp-content/uploads/Intro-to-ESDW-for-Animas-website.pdf',
    note: pair('Plotkinova mapa celoživotního vývoje pracuje se čtyřmi směry. Propojení fází cyklu, ročních dob a spirály je naše autorské uspořádání.', 'Plotkin’s map of lifelong development uses four directions. The association of cycle phases, seasons and the spiral is our own editorial arrangement.')
  },
  {
    id: 'imagery-animas-activities',
    title: 'Sabina Wyss, Bill Plotkin & Donna Medeiros · Nature and the Human Soul: Experiential Activities',
    url: 'https://www.animas.org/books/nature-and-the-human-soul/nature-and-the-human-soul-experiential-activities/introductory-activities-nature-and-the-human-soul/',
    note: pair('Veřejný úvod spojuje přírodu, psaní a tvořivé vyjádření s každodenním životem. Krátké formy praxe v aplikaci jsme vytvořili samostatně.', 'The public introduction connects nature, writing and creative expression with everyday life. We created the app’s short practices independently.')
  },
  {
    id: 'imagery-animas-nature',
    title: 'Animas Valley Institute · Nature and the Human Soul: Stage 2 Activities',
    url: 'https://www.animas.org/books/nature-and-the-human-soul/nature-and-the-human-soul-experiential-activities/experiential-activities-stage-2/',
    note: pair('Inspirací je smyslová pozornost k přírodě a úcta k jejím vlastním potřebám. Nepřebíráme původní vývojový program ani jeho cvičení.', 'The inspiration is sensory attention to nature and respect for its own needs. We do not reproduce the original developmental programme or its exercises.')
  },
  {
    id: 'imagery-estes-excerpt',
    title: 'Clarissa Pinkola Estés · Women Who Run With the Wolves',
    url: 'https://cdn.penguin.co.uk/dam-assets/books/9781846046940/9781846046940-sample.pdf',
    note: pair('Čerpáme z vybraných pasáží legální ukázky nakladatele o hlasu, hranicích a práci s příběhy. Nepřebíráme její literární převyprávění ani klinické postupy.', 'We draw on selected passages of the publisher’s legal excerpt concerning voice, boundaries and stories. We do not reproduce her literary retellings or clinical methods.')
  },
  {
    id: 'imagery-shaw-liturgies',
    title: 'Martin Shaw · Liturgies of the Wild: Myths That Make Us',
    url: 'https://drmartinshaw.com/product/liturgies-of-the-wild-myths-that-make-us/',
    note: pair('Ověřený je veřejný autorský popis knihy o mýtu a životních přechodech, včetně jejího křesťanského rámce. Plný text jsme nepoužili. Nenabízíme Shawa jako autora našich rituálů.', 'We consulted the public author’s description of the book on myth and life transitions, including its Christian setting. We did not use the full text. Our rituals are not attributed to Shaw.')
  },
  {
    id: 'imagery-inana', title: 'Inana’s Descent to the Nether World · Oxford ETCSL 1.4.1',
    url: 'https://etcsl.orinst.ox.ac.uk/section1/tr141.htm',
    note: pair('Sumerský text v překladu Oxfordského projektu ETCSL. Dvě krátká shrnutí vycházejí ze sestupu a návratu. Otázky k dnešku a přiřazení fází jsou naše.', 'The Sumerian text in the Oxford ETCSL translation. Two brief summaries concern the descent and return. Today’s questions and phase associations are ours.')
  },
  {
    id: 'imagery-hymn-demeter', title: 'Homeric Hymn 2 · To Demeter',
    url: 'https://www-current.chs.harvard.edu/primary-source/homeric-hymn-to-demeter-sb/',
    note: pair('Antický hymnus, setkání Démétér s Hekaté. Shrnutí vlastními slovy. Naše čtení se týká doprovázení, ne biologického vysvětlení cyklu.', 'The ancient hymn, concerning Demeter’s meeting with Hecate. Summarised in our own words. Our reading concerns accompaniment, not a biological explanation of the cycle.')
  },
  {
    id: 'imagery-odyssey-rest', title: 'Homer · Odyssey, Book 5',
    url: 'https://classics.mit.edu/Homer/odyssey.5.v.html',
    note: pair('Závěr pátého zpěvu: Odysseův úkryt a spánek po ztroskotání. Krátké autorské shrnutí antické epizody.', 'The end of Book 5: Odysseus finds shelter and sleeps after shipwreck. A brief original summary of the ancient episode.')
  },
  {
    id: 'imagery-odyssey-meeting', title: 'Homer · Odyssey, Book 6',
    url: 'https://classics.mit.edu/Homer/odyssey.6.vi.html',
    note: pair('Setkání Nausikay s Odysseem. Oddělujeme děj antického textu od naší dnešní otázky po podobě pomoci.', 'Nausicaa’s meeting with Odysseus. We separate the ancient narrative from our present-day question about the form of help.')
  },
  {
    id: 'imagery-odyssey-penelope', title: 'Homer · Odyssey, Book 2',
    url: 'https://classics.mit.edu/Homer/odyssey.2.ii.html',
    note: pair('Vyprávění o Pénelopině tkaní a párání. Není návodem ke klamání partnera. Otázka na vlastní čas je naše současné čtení.', 'The account of Penelope weaving and unravelling. It is not advice to deceive a partner. The question about time to decide is our contemporary reading.')
  },
  {
    id: 'imagery-apuleius-psyche', title: 'Apuleius · The Golden Ass, Book 6',
    url: 'https://www.gutenberg.org/cache/epub/1666/pg1666-images.html',
    note: pair('Antický příběh Psyché a mravenců v historickém překladu Williama Adlingtona. Shrnutí čerpá přímo z této epizody, nikoli z moderní psychologické knihy.', 'The ancient story of Psyche and the ants in William Adlington’s historical translation. Our summary draws directly on that episode, not a modern psychology book.')
  },
  {
    id: 'imagery-ovid-hospitality', title: 'Ovid · Metamorphoses, Book 8: Baucis and Philemon',
    url: 'https://www.theoi.com/Text/OvidMetamorphoses8.html',
    note: pair('Ovidiova epizoda pohostinného páru. Vybíráme okamžik přijetí hostů. Náš krátký rituál stolování je samostatná autorská forma praxe.', 'Ovid’s episode of the hospitable couple. We focus on welcoming the guests. Our short table ritual is an independently created practice.')
  },
  {
    id: 'imagery-apollodorus-thread', title: 'Apollodorus · Epitome 1.8–1.9',
    url: 'https://www.theoi.com/Text/ApollodorusE.html',
    note: pair('Ariadnina pomoc s cestou labyrintem. Krátké shrnutí antického textu. Propojení nitě s každodenní oporou je naše autorské čtení.', 'Ariadne’s help in navigating the labyrinth. A brief summary of the ancient text. Connecting the thread with everyday support is our own reading.')
  },
  {
    id: 'imagery-amaterasu', title: 'Kokugakuin University · Encyclopedia of Shinto: Amenouzume',
    url: 'https://d-museum.kokugakuin.ac.jp/eos/detail/?id=9422',
    note: pair('Univerzitní heslo dokládá tanec Amenouzume a vyjití Amaterasu z jeskyně v Kodžiki a Nihon šoki. Krátké převyprávění a dnešní otázka jsou naše.', 'The university entry documents Amenouzume’s dance and Amaterasu’s emergence in the Kojiki and Nihon Shoki. The brief retelling and present-day question are ours.')
  },
  {
    id: 'imagery-plutarch-isis', title: 'Plutarch · Isis and Osiris 13–18',
    url: 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Moralia/Isis_and_Osiris*/A.html',
    note: pair('Egyptský mýtus v podání řeckého autora, nikoli přímý překlad faraonského textu. Shrnutí sleduje hledání truhly a částí těla.', 'An Egyptian myth as recounted by a Greek author, not a direct translation of a pharaonic text. Our summary follows the search for the chest and body parts.')
  },
  {
    id: 'imagery-kojiki-purification', title: 'Kojiki · Section X: The Purification of the August Person',
    url: 'https://sacred-texts.com/shi/kj/kj017.htm',
    note: pair('Kodžiki v historickém překladu B. H. Chamberlaina: Izanagiho očista a zrození Amaterasu a Cukujomi. Přiřazení k fázi je současné.', 'The Kojiki in B. H. Chamberlain’s historical translation: Izanagi’s purification and the birth of Amaterasu and Tsukuyomi. The phase association is contemporary.')
  },
  {
    id: 'imagery-edda-idunn', title: 'Snorri Sturluson · Prose Edda, Skaldskaparmal I',
    url: 'https://sacred-texts.com/neu/pre/pre05.htm',
    note: pair('Idunnin únos a návrat v překladu Arthura Gilchrista Brodeura. Shrnutí odděluje mýtické omlazení bohů od otázky po dnešní péči.', 'Idunn’s abduction and return in Arthur Gilchrist Brodeur’s translation. The summary separates the gods’ mythical renewal from our question about care today.')
  },
  {
    id: 'imagery-mahabharata-savitri', title: 'Mahabharata · Vana Parva: Savitri and Yama',
    url: 'https://sacred-texts.com/hin/m03/m03295.htm',
    note: pair('Rozhovor Sávitrí s Jamou v historickém překladu Kisari Mohana Ganguliho. Dary a Satjavánův návrat jsou děj eposu, nikoli příslib pro lidské ztráty.', 'Savitri’s conversation with Yama in Kisari Mohan Ganguli’s historical translation. The boons and Satyavan’s return belong to the epic, not a promise concerning human loss.')
  },
  {
    id: 'imagery-bhagavata-sudama', title: 'Bhagavata Purana · 10.80: The Brahmana Sudama Visits Lord Krishna',
    url: 'https://vedabase.io/en/library/sb/10/80/',
    note: pair('Vaišnavský text o setkání Kršny se Sudámou. Vlastní stručné shrnutí děje, bez přebírání moderního komentáře či tvrzení o cyklu.', 'A Vaishnava text about Krishna’s meeting with Sudama. A brief independent summary of the narrative, without reproducing modern commentary or asserting cycle correspondences.')
  },
  {
    id: 'imagery-kojiki-hare', title: 'Kojiki · Section XXI: The White Hare of Inaba',
    url: 'https://sacred-texts.com/shi/kj/kj028.htm',
    note: pair('Ókuninuši a zajíc v Chamberlainově překladu. Oddíl má v těle stránky číslo XXI; nadpis webu chybně uvádí XII. Mýtické uzdravení není zdravotní rada.', 'Okuninushi and the hare in Chamberlain’s translation. The body identifies Section XXI; the website heading incorrectly says XII. Mythical healing is not health advice.')
  },
  {
    id: 'imagery-edda-thor', title: 'Snorri Sturluson · Prose Edda, Gylfaginning XLVI–XLVII',
    url: 'https://sacred-texts.com/neu/pre/pre04.htm',
    note: pair('Thórovy zkoušky u Útgardského Lokiho v Brodeurově překladu. Vybíráme roh propojený s mořem a následné odhalení klamu.', 'Thor’s trials at Utgarda-Loki’s court in Brodeur’s translation. We select the horn connected to the sea and the subsequent revelation of the illusion.')
  },
  {
    id: 'imagery-sekhmet', title: 'British Museum · Feminine Power, large print guide, p. 63',
    url: 'https://www.britishmuseum.org/sites/default/files/2022-05/feminine_power_exhibition_large_print_guide.pdf',
    note: pair('Kurátorský popis egyptské Sekhmet dokládá Raovo rozhodnutí a červené pivo, které zkázu zastaví. Používáme tuto variantu, neslučujeme ji s odlišnými podáními Hathory.', 'The curatorial account of Egyptian Sekhmet records Ra’s decision and the red beer that halts destruction. We use this version without combining it with different accounts of Hathor.')
  },
  {
    id: 'imagery-bhagavata-shiva', title: 'Bhagavata Purana · 8.7: Lord Shiva Saves the Universe by Drinking Poison',
    url: 'https://vedabase.io/en/library/sb/8/7/',
    note: pair('Děj stloukání oceánu a Šivova přijetí jedu. Držíme se této verze, bez přidaného motivu stisknutí hrdla Párvatí.', 'The churning of the ocean and Shiva’s acceptance of the poison. We follow this version without adding the motif of Parvati squeezing his throat.')
  },
  {
    id: 'imagery-havamal-runes', title: 'Poetic Edda · Havamal, Bellows stanzas 139–142',
    url: 'https://sacred-texts.com/neu/poe/poe04.htm',
    note: pair('Runová epizoda v překladu Henryho Adamse Bellowse. Číslování 139–142 platí pro toto vydání. Tělesné strádání v mýtu není doporučená praxe.', 'The rune episode in Henry Adams Bellows’s translation. Stanza numbers 139–142 refer to this edition. Bodily suffering in the myth is not a recommended practice.')
  }
];
