/**
 * Original optional prompts for a conversation away from the screen.
 * These are an editorial synthesis, not a validated assessment or therapy protocol.
 * Stable ids identify content; no personal answers or sharing preferences belong here.
 * The legacy seven TOGETHER_QUESTIONS and their historical date mapping stay intact.
 */
export const WEEKLY_PROMPTS = [
  {
    id: 'arrive',
    title: {cs: 'Jak nám je', en: 'How we are'},
    question: {cs: 'S čím do našeho ohlédnutí přicházíš a na co máš dnes prostor?', en: 'What are you bringing to our reflection, and what do you have room for today?'},
    followup: {cs: 'Potřebuješ nejdřív vyslechnout, chvíli klidu, nebo se k tomu vrátit jindy?', en: 'Would it help to be heard first, have a quiet moment, or come back another time?'},
  },
  {
    id: 'appreciate',
    title: {cs: 'Co nás přiblížilo', en: 'What brought us closer'},
    question: {cs: 'Ve které chvíli ti se mnou tento týden bylo dobře a čím to bylo?', en: 'When did it feel good to be with me this week, and what made that moment matter?'},
    followup: {cs: 'Čeho konkrétního sis na mně všiml/a a chceš, abych to věděl/a?', en: 'What did you notice and appreciate about me that you would like me to know?'},
  },
  {
    id: 'understand',
    title: {cs: 'Co zůstalo mezi námi', en: 'What is still between us'},
    question: {cs: 'Zůstalo mezi námi něco, čemu bych měl/a lépe porozumět?', en: 'Is there anything still between us that you would like me to understand better?'},
    followup: {cs: 'Jestli ano: co se stalo, jak ti v tom bylo a co bylo pro tebe v sázce? Stačí jedna situace.', en: 'If so: what happened, how did it feel, and what mattered to you? One situation is enough.'},
  },
  {
    id: 'support',
    title: {cs: 'Co teď potřebujeme', en: 'What we need now'},
    question: {cs: 'Co tě teď zatěžuje a jaká moje konkrétní podpora by ti ulevila?', en: 'What is weighing on you, and what specific support from me would make it lighter?'},
    followup: {cs: 'Co potřebujeme jinak rozdělit, omezit nebo nechat být, aby měl každý z nás prostor?', en: 'What could we share differently, reduce or let go of so each of us has room?'},
  },
  {
    id: 'follow-through',
    title: {cs: 'Co se pohnulo', en: 'What has shifted'},
    question: {cs: 'Jak nám posloužilo to, na čem jsme se domluvili minule?', en: 'How did the small agreement we made last time work for us?'},
    followup: {cs: 'Co pomohlo? Co překáželo? Když se to nepovedlo, zmenšíme krok, nebo zvolíme jiný?', en: 'What helped, and what got in the way? If it did not happen, should we make it smaller or choose something else?'},
  },
  {
    id: 'one-next-step',
    title: {cs: 'Jedna věc pro další týden', en: 'One thing for the week ahead'},
    question: {cs: 'Jaký jeden malý krok chceme do příště zkusit, aby nám spolu bylo lépe?', en: 'What one small step would we both like to try before next time to make life together feel better?'},
    followup: {cs: 'Kdo co udělá a kdy? A na jakou obyčejnou společnou chvíli se chceme těšit?', en: 'Who will do what, and when? What ordinary moment together would we like to look forward to?'},
  },
];

export const DAILY_CONNECTION_PROMPTS = [
  {id:'feel-seen',category:{cs:'Blízkost',en:'Closeness'},depth:'light',question:{cs:'Čeho bych si dnes na tobě mohl/a víc všimnout?',en:'What small thing about you would you like me to notice today?'}},
  {id:'welcome-home',category:{cs:'Blízkost',en:'Closeness'},depth:'light',question:{cs:'Jaké přivítání by ti dnes udělalo dobře?',en:'What kind of welcome would feel good to you today?'}},
  {id:'safe-to-be',category:{cs:'Blízkost',en:'Closeness'},depth:'deeper',question:{cs:'Co ti ode mě pomáhá cítit, že můžeš být opravdu sám/sama sebou?',en:'What do I do that helps you feel free to be yourself?'}},
  {id:'unspoken-joy',category:{cs:'Blízkost',en:'Closeness'},depth:'light',question:{cs:'Co ti dnes udělalo radost a ještě jsem o tom neslyšel/a?',en:'What brought you joy today that I have not heard about yet?'}},
  {id:'kind-attention',category:{cs:'Blízkost',en:'Closeness'},depth:'light',question:{cs:'Jakou pozornost by sis ode mě přál/a, i kdyby byla úplně malá?',en:'What bit of attention would you welcome from me, however small?'}},
  {id:'touch-or-space',category:{cs:'Blízkost',en:'Closeness'},depth:'light',question:{cs:'Jaká blízkost je ti dnes příjemná: dotek, povídání, společné ticho, nebo víc prostoru?',en:'What kind of closeness feels good today: touch, talking, shared quiet, or more space?'}},
  {id:'still-curious',category:{cs:'Blízkost',en:'Closeness'},depth:'light',question:{cs:'Co tě teď zajímá tak, že bys mi o tom mohl/a chvíli vyprávět?',en:'What has caught your interest lately that you would enjoy telling me about?'}},
  {id:'invisible-load',category:{cs:'Každodenní péče',en:'Everyday care'},depth:'light',question:{cs:'Co ti teď zabírá místo v hlavě, i když to zvenčí není vidět?',en:'What is taking up space in your mind that I might not see from the outside?'}},
  {id:'help-that-fits',category:{cs:'Každodenní péče',en:'Everyday care'},depth:'light',question:{cs:'Kdy ti moje pomoc sedí a kdy bys potřeboval/a, abych se nejdřív zeptal/a?',en:'When does my help fit, and when would you prefer me to ask first?'}},
  {id:'protect-rest',category:{cs:'Každodenní péče',en:'Everyday care'},depth:'light',question:{cs:'Který malý kus dne bychom ti mohli nechat opravdu na odpočinek?',en:'What small part of the day could we protect for your rest?'}},
  {id:'too-much',category:{cs:'Každodenní péče',en:'Everyday care'},depth:'light',question:{cs:'Čeho je na tebe tento týden moc a co bychom mohli zjednodušit?',en:'What feels like too much this week, and what could we simplify?'}},
  {id:'share-responsibility',category:{cs:'Každodenní péče',en:'Everyday care'},depth:'deeper',question:{cs:'Kterou společnou starost bychom měli rozdělit tak, abys ji nemusel/a pořád držet v hlavě?',en:'Which shared responsibility could we divide so you do not have to keep carrying it in your head?'}},
  {id:'practice-support',category:{cs:'Každodenní péče',en:'Everyday care'},depth:'light',question:{cs:'V čem ze své praxe nebo péče o sebe bys teď ocenil/a moji podporu?',en:'Where would you welcome my support in your practice or in caring for yourself?'}},
  {id:'less-pressure',category:{cs:'Každodenní péče',en:'Everyday care'},depth:'light',question:{cs:'Co dnes můžeme pustit, aby mezi námi bylo méně spěchu?',en:'What could we let go of today so there is less rushing between us?'}},
  {id:'under-the-reaction',category:{cs:'O kousek hlouběji',en:'A little deeper'},depth:'deeper',question:{cs:'Když se mezi námi stáhneš nebo rozčílíš, co bys chtěl/a, abych o tom věděl/a?',en:'When you pull back or get upset between us, what would you like me to understand?'}},
  {id:'learned-care',category:{cs:'O kousek hlouběji',en:'A little deeper'},depth:'deeper',question:{cs:'Jak se u vás doma dávala najevo péče a co z toho si chceš nést do našeho vztahu?',en:'How was care shown in your family, and what would you like to bring from that into our relationship?'}},
  {id:'change-in-you',category:{cs:'O kousek hlouběji',en:'A little deeper'},depth:'deeper',question:{cs:'V čem se poslední dobou měníš a já tě možná pořád vidím postaru?',en:'How have you been changing lately while I may still be seeing an older version of you?'}},
  {id:'boundary-as-care',category:{cs:'O kousek hlouběji',en:'A little deeper'},depth:'deeper',question:{cs:'Kterou svou hranici bys chtěl/a umět říct snáz a co by ti ode mě pomohlo?',en:'What boundary would you like to express more easily, and what could I do to help?'}},
  {id:'assumption-check',category:{cs:'O kousek hlouběji',en:'A little deeper'},depth:'deeper',question:{cs:'Co si o tobě někdy vykládám jinak, než jak to skutečně prožíváš?',en:'What do I sometimes read differently from how you actually experience it?'}},
  {id:'repair-sign',category:{cs:'O kousek hlouběji',en:'A little deeper'},depth:'deeper',question:{cs:'Podle čeho poznáš, že se po neshodě opravdu snažím znovu přiblížit?',en:'What helps you recognise that I am trying to reconnect after a disagreement?'}},
  {id:'own-part',category:{cs:'O kousek hlouběji',en:'A little deeper'},depth:'deeper',question:{cs:'Je něco v mém jednání, za co chci převzít odpovědnost a příště to udělat jinak?',en:'Is there something in my own behaviour I want to take responsibility for and do differently next time?'}},
  {id:'small-adventure',category:{cs:'Radost a směr',en:'Joy and direction'},depth:'light',question:{cs:'Jaké malé dobrodružství by nás teď oba bavilo?',en:'What small adventure would we both enjoy right now?'}},
  {id:'our-kind-of-day',category:{cs:'Radost a směr',en:'Joy and direction'},depth:'light',question:{cs:'Co by mělo být v obyčejném dni, o kterém si řekneme: takhle je nám dobře?',en:'What belongs in an ordinary day that makes us think: this feels like us?'}},
  {id:'shared-value',category:{cs:'Radost a směr',en:'Joy and direction'},depth:'deeper',question:{cs:'Kterou hodnotu chceme ve svém vztahu víc žít a jak by to bylo tento týden vidět?',en:'What value would we like to live more fully in our relationship, and what would that look like this week?'}},
  {id:'your-small-dream',category:{cs:'Radost a směr',en:'Joy and direction'},depth:'light',question:{cs:'Na jaké svoje malé přání nechceš v běžném shonu zapomenout?',en:'What small wish of your own do you not want to lose in the everyday rush?'}},
  {id:'laugh-together',category:{cs:'Radost a směr',en:'Joy and direction'},depth:'light',question:{cs:'U čeho jsme se naposledy spolu smáli a co podobného bychom si mohli dopřát?',en:'What last made us laugh together, and what could bring a little of that back?'}},
  {id:'keep-a-ritual',category:{cs:'Radost a směr',en:'Joy and direction'},depth:'light',question:{cs:'Která naše drobná společná chvíle stojí za to, abychom si ji chránili?',en:'Which small moment together is worth protecting in our days?'}},
  {id:'one-real-change',category:{cs:'Radost a směr',en:'Joy and direction'},depth:'deeper',question:{cs:'Jakou malou změnu bychom za měsíc chtěli opravdu žít, nejen o ní mluvit?',en:'What small change would we like to be living a month from now, rather than just talking about?'}},
];

export const PLAN_INSPIRATIONS = [
  {id:'one-cup',minutes:15,energy:1,context:'home',title:{cs:'Jeden čaj, žádný další úkol',en:'One cup of tea, no extra task'},note:{cs:'Udělejte si čaj a na čtvrt hodiny odložte telefony. Každý může přinést jednu věc ze svého dne. Rady jen na přání.',en:'Make tea and set your phones aside for fifteen minutes. Each can bring one thing from the day. Offer advice only if wanted.'}},
  {id:'new-turn',minutes:25,energy:2,context:'outside',title:{cs:'Na procházce odbočit jinam',en:'Take a different turn'},note:{cs:'Projděte známé okolí trochu jinou cestou. Každý vybere jednu odbočku a ukáže něco, čeho si všiml. Délku přizpůsobte tomu, jak vám je.',en:'Walk a different route through familiar surroundings. Each chooses a turn and points out something they notice. Adapt the distance to how you feel.'}},
  {id:'tiny-tasting',minutes:20,energy:1,context:'home',title:{cs:'Malá ochutnávka doma',en:'A little tasting at home'},note:{cs:'Vyberte tři chutě z toho, co máte doma. Ochutnávejte pomalu a porovnejte dojmy. Nemusíte nic kupovat ani poznávat poslepu.',en:'Pick three flavours from what you already have. Taste slowly and compare impressions. No shopping or blindfolds needed.'}},
  {id:'show-your-world',minutes:20,energy:1,context:'anywhere',title:{cs:'Ukaž mi kousek svého světa',en:'Show me a piece of your world'},note:{cs:'Každý má pár minut na něco, co ho teď baví: knihu, hudbu, místo nebo dovednost. Druhý se zeptá na to, co ho opravdu zajímá.',en:'Take a few minutes each to share something you enjoy: a book, music, a place or a skill. The listener asks about what genuinely interests them.'}},
  {id:'one-song-each',minutes:15,energy:1,context:'anywhere',title:{cs:'Dvě písničky a jejich příběh',en:'Two songs and their stories'},note:{cs:'Každý vybere jednu skladbu spojenou s nějakou chvílí. Poslechněte si ji a řekněte si, proč jste vybrali právě tu. Jde to i na dálku.',en:'Each chooses a song connected with a moment in their life. Listen and share why you picked it. This works from a distance too.'}},
  {id:'practice-side-by-side',minutes:15,energy:1,context:'home',title:{cs:'Praxe vedle sebe',en:'Practice side by side'},note:{cs:'Vyberte z Praxe něco krátkého, co už znáte. Můžete dělat každý svou věc ve stejný čas. Pak si řekněte jednu větu o tom, jak vám je.',en:'Choose a short practice you already know from Practice. You can each do your own thing at the same time. Afterwards, share one sentence about how you feel.'}},
  {id:'sunset-pause',minutes:20,energy:1,context:'outside',title:{cs:'Chvíle pod večerní oblohou',en:'A moment under the evening sky'},note:{cs:'Najděte blízké místo, kde se dá chvíli sedět. Sledujte proměnu světla a pak si řekněte, co si z dne chcete nechat a co odložit.',en:'Find a nearby place to sit for a while. Watch the light change, then share what you want to keep from the day and what you want to set down.'}},
  {id:'new-recipe',minutes:50,energy:2,context:'home',title:{cs:'Uvařit něco poprvé',en:'Cook something for the first time'},note:{cs:'Vyberte jednoduché jídlo, které jste ještě spolu nedělali. Rozdělte si i rozhodování a úklid. Cílem je společný večer, ne dokonalý výsledek.',en:'Choose a simple dish you have not made together. Share the decisions and cleaning up too. The point is an evening together, not a perfect result.'}},
  {id:'memory-with-detail',minutes:20,energy:1,context:'anywhere',title:{cs:'Jedna vzpomínka ze dvou stran',en:'One memory, two perspectives'},note:{cs:'Vyberte příjemnou společnou vzpomínku nebo fotku. Každý řekne jeden detail, který si pamatuje. Rozdíly nemusíte rozhodovat.',en:'Choose a pleasant shared memory or photo. Each shares one detail they remember. Different memories do not need a verdict.'}},
  {id:'week-lightener',minutes:20,energy:1,context:'home',title:{cs:'Ulehčit si příští týden',en:'Make next week lighter'},note:{cs:'Vyberte jednu společnou starost a domluvte, kdo za ni převezme celý malý díl včetně plánování. Zbytek času si nechte na něco příjemného.',en:'Pick one shared responsibility and agree who will own one manageable part, including planning it. Leave the rest of the time for something pleasant.'}},
  {id:'draw-an-ordinary-day',minutes:25,energy:1,context:'home',title:{cs:'Nakreslit si dobrý obyčejný den',en:'Sketch a good ordinary day'},note:{cs:'Na papír každý načrtne den, ve kterém by mu bylo dobře. Porovnejte jednu podobnost a jeden rozdíl. Vyberte maličkost, kterou jde zkusit už teď.',en:'Each sketches an ordinary day that would feel good. Find one similarity and one difference. Choose a tiny part you could try now.'}},
  {id:'local-discovery',minutes:60,energy:2,context:'outside',title:{cs:'Turisté ve vlastním okolí',en:'Visitors in your own neighbourhood'},note:{cs:'Najděte místo blízko domova, kde ani jeden nebyl: zahradu, galerii nebo uličku. Předem se domluvte na čase a rozpočtu.',en:'Find somewhere nearby neither of you has been: a garden, gallery or street. Agree on the time and budget beforehand.'}},
  {id:'teach-small-skill',minutes:25,energy:2,context:'anywhere',title:{cs:'Nauč mě jednu drobnost',en:'Teach me one small thing'},note:{cs:'Jeden ukáže jednoduchou dovednost a druhý ji zkusí vlastním tempem. Vyberte něco, u čeho je v pořádku nevědět a zasmát se.',en:'One person shares a simple skill and the other tries at their own pace. Choose something where it is okay not to know and to laugh.'}},
  {id:'gentle-movement',minutes:20,energy:2,context:'home',title:{cs:'Pohyb bez výkonu',en:'Movement without a target'},note:{cs:'Pusťte oblíbenou hudbu nebo vyberte známou jemnou praxi. Každý si zvolí intenzitu. Bez porovnávání a opravování druhého.',en:'Put on music you enjoy or choose a familiar gentle practice. Each chooses their own intensity. No comparing or correcting each other.'}},
  {id:'quiet-nature',minutes:60,energy:2,context:'outside',title:{cs:'Do přírody za jedním místem',en:'Visit one place in nature'},note:{cs:'Vyberte dosažitelné místo, kde lze jen chvíli být. Cesta nemusí mít cíl v kilometrech. Všimněte si každý něčeho, co by vám jinak uniklo.',en:'Choose an accessible place where you can simply spend some time. The walk needs no distance target. Each notice something you might otherwise miss.'}},
  {id:'play-for-us',minutes:30,energy:2,context:'home',title:{cs:'Hra, u které jsme spolu',en:'A game to share'},note:{cs:'Vyberte krátkou hru, skládačku nebo společné kreslení. Pokud soutěžení dnes nepomáhá, zvolte spolupráci. Skončete, dokud vás to baví.',en:'Choose a short game, puzzle or shared drawing. If competition does not feel good today, work together. Finish while you are still enjoying it.'}},
  {id:'little-celebration',minutes:20,energy:1,context:'anywhere',title:{cs:'Oslavit malou dobrou věc',en:'Celebrate one small good thing'},note:{cs:'Každý řekne něco, co se mu povedlo nebo co ho potěšilo. Doptávejte se na příběh. Oslavou může být čaj, hudba nebo krátká společná chvíle.',en:'Each shares something that went well or brought joy. Ask about the story. Tea, music or a little time together can be the celebration.'}},
  {id:'same-view-distance',minutes:15,energy:1,context:'distance',title:{cs:'Na dálku u stejné oblohy',en:'The same sky from a distance'},note:{cs:'Zavolejte si z klidného místa, u okna nebo venku. Každý popíše tři věci kolem sebe a jednu ze svého dne. Kamera není potřeba.',en:'Call from somewhere quiet, by a window or outdoors. Each describes three things around them and one from their day. No camera needed.'}},
  {id:'read-aloud',minutes:20,energy:1,context:'home',title:{cs:'Přečíst si něco nahlas',en:'Read something aloud'},note:{cs:'Každý vybere krátký úryvek z knihy, básně nebo vlastního zápisu, který chce sdílet. Řekněte si, co ve vás zůstalo. Soukromé stránky mohou zůstat soukromé.',en:'Each chooses a short passage from a book, poem or their own writing that they want to share. Say what stayed with you. Private pages may stay private.'}},
  {id:'couple-reflection',minutes:20,energy:1,context:'anywhere',title:{cs:'Týdenní ohlédnutí naživo',en:'A weekly reflection in person'},note:{cs:'Projděte otázky v Rozhovorech vlastním tempem. Vyberte jednu věc, které chcete porozumět, a jeden malý krok. Zapište jen to, k čemu se chcete vrátit.',en:'Move through the questions in Conversations at your own pace. Pick one thing to understand and one small step. Record only what you want to return to.'}},
  {id:'try-something-playful',minutes:45,energy:3,context:'outside',title:{cs:'Zkusit novou malou výzvu',en:'Try a small new challenge'},note:{cs:'Vyberte novou činnost, která láká oba a odpovídá vašim možnostem: třeba orientační procházku nebo venkovní hru. Náročnost domluvte předem.',en:'Choose something new that appeals to both and fits your abilities, such as a simple navigation walk or outdoor game. Agree on the challenge beforehand.'}},
  {id:'one-personal-wish',minutes:20,energy:1,context:'anywhere',title:{cs:'Dát místo jednomu přání',en:'Make room for one wish'},note:{cs:'Každý přinese malé osobní přání. Druhý nejdřív poslouchá, potom se zeptá, jestli a jak může pomoci. Přání nemusí být společné.',en:'Each brings one small personal wish. The other listens first, then asks whether and how they could help. Your wishes do not have to be shared.'}},
  {id:'slow-morning',minutes:30,energy:1,context:'home',title:{cs:'Pomalé společné ráno',en:'A slow morning together'},note:{cs:'Domluvte jedno ráno nebo jinou část dne bez okamžitého zařizování. Připravte jednoduché jídlo a nechte si čas na to, jak vám právě je.',en:'Choose a morning or another part of the day without immediately doing chores. Make simple food and leave time to notice how you are feeling.'}},
  {id:'shared-distant-practice',minutes:20,energy:1,context:'distance',title:{cs:'Stejná chvíle, dvě místa',en:'One moment, two places'},note:{cs:'Domluvte si čas na známou praxi každý u sebe. Potom krátce zavolejte. Každý sdílí jen to, co chce; záznam zůstává na svém místě v Praxi.',en:'Agree on a time for a familiar practice in your own places, then have a short call. Share only what you want; keep the record in Practice.'}},
];
