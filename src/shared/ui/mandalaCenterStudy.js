// Source locations follow the 2013 EPUB. The linked PDF expands the appendix.
const chapter = "https://www.wildmindbook.com/wp-content/uploads/Wild-Mind-Excerpts.pdf";
const appendix = "https://learningforchange.net/wp-content/uploads/2018/08/Four-Practices-for-Wholing-and-Self-Healing.pdf";
const book = "https://newworldlibrary.com/product/wild-mind";

export const CENTER_STUDY = {
  reading: {
    cz: "Představ si, že tě přítel požádá o pomoc právě ve chvíli, kdy ji sám potřebuješ. Sever ví, jak pečovat. Jih cítí únavu. Východ možná uvidí třetí možnost a Západ si všimne obrazu, který se ti v takových chvílích vrací. Uprostřed stojíš ty. Odpověď příteli dáš vlastními slovy. Plotkin označuje střed jako ego a čtyři směry jako různé stránky jednoho Self. Ke stejnému cvičení se můžeš vrátit pokaždé, když řešíš novou otázku.",
    en: "Imagine a friend asking for help just as you need some yourself. North knows how to care. South feels the tiredness. East might see a third option. West notices an image that keeps coming back at moments like this. You stand in the middle. The answer you give your friend will be yours. Plotkin places the ego at the center and describes the four directions as facets of one Self. You can return to the same exercise whenever a new question comes up.",
  },
  sources: [
    { id: "map", title: "Wild Mind (2013) · 1 · The Center / How the Ego Operates", url: chapter },
    { id: "wheel", title: "Wild Mind · Coda · The Self as a Turning Wheel", url: book },
    { id: "voices", title: "Wild Mind · Appendix · Voice Dialogue", url: appendix + "#page=1" },
    { id: "circle", title: "Wild Mind · Appendix · Four-Directions Circles", url: appendix + "#page=9" },
    { id: "dream", title: "Wild Mind · Appendix · Dreamwork with the Facets of the Self", url: appendix + "#page=13" },
    { id: "imagery", title: "Wild Mind · Appendix · Deep Imagery", url: appendix + "#page=15" },
  ],
  practices: [
    {
      id: "center-voices", group: "method", kind: "method", source: "voices",
      cz: {
        title: "Rozhovor hlasů",
        when: "Když tě jedna část táhne odpovědět hned a druhá se chce stáhnout. Metodu Voice Dialogue vytvořili Hal a Sidra Stoneovi. Plotkin popisuje také způsob vedení od Geneen Marie Haugen.",
        steps: [
          "Vyber si nenáročnou situaci ze dneška. Všimni si postoje svého těla. V první osobě vyslov, co chce udělat hlas, který se obvykle ozve nejdřív.",
          "Přesuň se o kousek. Dej slovo tomu, kdo se ke slovu dostává zřídka. Třeba co by zaznělo, kdyby mohl mluvit tvůj humor?",
          "Vrať se na své místo a poděkuj oběma hlasům. Rozhodni, co řekneš vlastními slovy. Při nejbližším rozhovoru si všimni, zda můžeš čerpat i z tiššího hlasu.",
        ],
        reflect: "Co jsem slyšel až ve chvíli, kdy jsem dal druhému hlasu čas domluvit?",
      },
      en: {
        title: "Voice dialogue",
        when: "When part of you wants to answer at once and another part wants to withdraw. Hal and Sidra Stone developed Voice Dialogue. Plotkin also describes a facilitation approach by Geneen Marie Haugen.",
        steps: [
          "Choose an ordinary situation from today. Notice your posture. Speak in the first person as the voice that usually responds first, and say what you want to do.",
          "Shift position. Give a quieter voice a turn. For instance, what would your sense of humor say if it could speak?",
          "Return to your seat and thank both voices. Decide what you will say in your own words. In your next conversation, see whether the quieter voice is available to you.",
        ],
        reflect: "What could I hear only after I let the quieter voice finish?",
      },
    },
    {
      id: "center-circle", group: "method", kind: "method", source: "circle",
      cz: {
        title: "Kruh čtyř směrů",
        when: "Když se rozhoduješ mezi dvěma možnostmi a u obou se vracíš ke stejnému argumentu.",
        steps: [
          "Najdi místo venku a vyznač čtyři směry. Doma mohou posloužit čtyři židle. Ze středu si všimni, jak se okolí v každém směru liší. Vyber jednu otázku a směr, jehož schopnost potřebuješ.",
          "Připomeň si člověka nebo příběhovou postavu, u které tuto schopnost znáš. Přejdi na obvod a přijmi postoj těla, který jí odpovídá. Vrať se do středu a vlastními slovy vyslov svou otázku.",
          "Vrať se na vybrané místo, otoč se ke středu a odpověz nahlas. Ze středu rozhodni, kterou část odpovědi uskutečníš. Než odejdeš, poděkuj místu.",
        ],
        reflect: "Ze kterého místa se moje původní otázka začala jevit jinak?",
      },
      en: {
        title: "Four directions circle",
        when: "When you keep making the same argument for or against a decision.",
        steps: [
          "Mark the four directions outdoors, or use four chairs indoors. From the middle, notice how your surroundings differ in each direction. Choose a question and one direction whose capacity it calls for.",
          "Remember a person or story character in whom you recognize this capacity. Walk to that point on the circle and try a posture that expresses it. Come back to the middle and put your question into your own words.",
          "Return to the chosen spot, turn toward the center and answer aloud. From the middle, decide which part of the response you can act on. Thank the place before leaving.",
        ],
        reflect: "From which position did my original question start to look different?",
      },
    },
    {
      id: "center-dream", group: "method", kind: "method", source: "dream",
      cz: {
        title: "Návrat k obrazu ze snu",
        when: "Když ti po probuzení utkvěla přesná scéna, třeba zvíře stojící na prahu.",
        steps: [
          "Zapiš jedinou scénu v přítomném čase. Doplň detail, podle kterého bys ji znovu poznal.",
          "Pokračuj, jen pokud si dokážeš scénu znovu živě vybavit. Oslov jednu bytost nebo místo, které tě oslovilo svou přítomností. Počkej, jestli přijde odpověď. Pokud ti obraz dovolí podívat se na scénu jeho očima, všimni si, jak odsud působíš ty.",
          "Vrať pozornost do místnosti. Zaznamenej si zvlášť, co se skutečně zdálo a co tě napadlo teprve po probuzení.",
        ],
        reflect: "Co ve snu zůstává živé, i když mu zatím nerozumím?",
      },
      en: {
        title: "Return to a dream image",
        when: "When you wake with one precise scene in mind, perhaps an animal standing in a doorway.",
        steps: [
          "Write down one scene in the present tense. Add the detail you would recognize it by.",
          "Continue only if you can vividly re-enter the scene. Address one being or place whose presence caught your attention, and leave room for a response. If the image lets you see the scene through its eyes, notice how your dreaming self looks from there.",
          "Bring your attention back to the room. Record what actually appeared in the dream separately from what occurred to you after waking.",
        ],
        reflect: "What still feels alive in this dream even though I cannot explain it?",
      },
    },
    {
      id: "center-imagery", group: "method", kind: "method", source: "imagery",
      cz: {
        title: "Zvíře v představě",
        when: "Když chceš některý směr poznat v obrazech. Tato práce s představivostí vychází také z přístupu Stephena Gallegose.",
        steps: [
          "Vyber si jeden směr a pohodlně se posaď. V představě se k němu obrať a pozvi zvíře, které by ti mohlo přiblížit jeho kvalitu. Počkej, co se samo objeví jako obraz, zvuk nebo pohyb.",
          "Jestli se nějaké zvíře objeví, pověz mu, proč jsi přišel. Co ti ukazuje? Co by od tebe potřebovalo? Dopřej setkání čas. Když se nic neobjeví, můžeš u toho dnes skončit.",
          "Podívej se zpět kolem sebe. Nakresli malý detail, který tě překvapil, a nech vedle něj místo pro příští setkání.",
        ],
        reflect: "Jak se vyvíjela moje zvědavost, když jsem nechal obraz chvíli být?",
      },
      en: {
        title: "Meet an animal in imagination",
        when: "When you want to meet a direction through imagery. This form of deep imagery also draws on the work of Stephen Gallegos.",
        steps: [
          "Sit comfortably and choose one direction. In imagination, turn toward it and invite an animal that could help you explore its quality. Wait for a spontaneous image, sound or movement.",
          "If an animal appears, tell it why you came. What might it show you? What might it need from you? Give the encounter time. If nothing appears, that can be the whole encounter today.",
          "Look around the room again. Sketch one surprising detail, leaving a little space beside it for another visit.",
        ],
        reflect: "How did my curiosity change when I let the image take its own time?",
      },
    },
    {
      id: "center-decision", group: "application", kind: "adaptation", source: "map",
      cz: {
        title: "Odpověď na skutečnou prosbu",
        when: "Když už máš na jazyku automatické ano. Stačí poslední prosba, kterou ti někdo poslal.",
        steps: [
          "Napiš odpověď, kterou bys odeslal okamžitě. Přečti ji nahlas a všimni si jednoho slova, které ti nesedí.",
          "Přizvi dva směry, které se v té větě nepotkaly. Můžeš například laskavě uznat, co druhý potřebuje, a zároveň pojmenovat vlastní únavu.",
          "Sestav odpověď, jejíž důsledky chceš nést. Může mít dvě věty. O případném odeslání rozhodni sám.",
        ],
        reflect: "Co druhý teď může z mé odpovědi skutečně poznat?",
      },
      en: {
        title: "Answer a real request",
        when: "When an automatic yes is on the tip of your tongue. Use the most recent request someone sent you.",
        steps: [
          "Write the reply you would send immediately. Read it aloud and notice one word that feels off.",
          "Invite two directions the sentence left apart. For example, acknowledge what the other person needs and name your own tiredness.",
          "Compose a reply whose consequences you are willing to carry. Two sentences may be enough. Decide for yourself whether to send it.",
        ],
        reflect: "What can the other person actually learn from my answer now?",
      },
    },
    {
      id: "center-return", group: "application", kind: "adaptation", source: "wheel",
      cz: {
        title: "Jeden večer, čtyři pohledy",
        when: "Večer po chvíli, kdy jsi jednal jinak, než jsi ráno zamýšlel.",
        steps: [
          "Vyber dnešní událost, třeba chvíli, kdy někdo nechal plnou práci na tobě. Začni na Východě. Jednou větou popiš, co by viděl další člověk. Na Jihu doplň, co se v tu chvíli ozvalo v těle.",
          "Na Západě dej prostor nečekané možnosti. Jak by šla situace rozehrát jinak? Na Severu vyber první proveditelný krok a pojmenuj, komu prospěje.",
          "Až krok vyzkoušíš, vrať se k Východu. Čeho si teď můžeš všimnout, když víš, jak na to ostatní reagovali?",
        ],
        reflect: "Podle čeho zítra poznám, že jsem si nechal prostor k volbě?",
      },
      en: {
        title: "One evening, four perspectives",
        when: "In the evening after a moment when you acted differently from what you intended that morning.",
        steps: [
          "Choose one event, perhaps a moment when someone left you to do all the work. Start in East: describe what another person could have observed. From South, add what you felt in your body.",
          "In West, make room for an unexpected possibility. How else might the situation unfold? From North, choose one feasible action and name who might benefit.",
          "After you try it, return to East. What can you now see in light of how others responded?",
        ],
        reflect: "What would tell me tomorrow that I left myself room to choose?",
      },
    },
  ],
};
