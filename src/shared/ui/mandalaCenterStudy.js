// The four methods are named in the appendix. The situations and prompts below
// are original, short ways to try them, not transcriptions of the book.
const chapter = "https://www.wildmindbook.com/wp-content/uploads/Wild-Mind-Excerpts.pdf";
const appendix = "https://learningforchange.net/wp-content/uploads/2018/08/Four-Practices-for-Wholing-and-Self-Healing.pdf";

export const CENTER_STUDY = {
  reading: {
    cz: "Představ si, že tě přítel požádá o pomoc právě ve chvíli, kdy ji sám potřebuješ. Sever ví, jak pečovat. Jih cítí únavu. Východ možná uvidí třetí možnost a Západ si všimne obrazu, který se ti v takových chvílích vrací. Uprostřed stojíš ty. Odpověď příteli dáš vlastními slovy. Plotkin označuje střed jako ego a čtyři směry jako různé stránky jednoho Self. Čtyři formy praxe z dodatku ke knize můžeš zkoušet znovu, pokaždé s jinou otázkou.",
    en: "Imagine a friend asking for help just as you need some yourself. North knows how to care. South feels the tiredness. East might see a third option. West notices an image that keeps coming back at moments like this. You stand in the middle. The answer you give your friend will be yours. Plotkin places the ego at the center and describes the four directions as facets of one Self. You can revisit the four methods from the appendix with a different question each time.",
  },
  sources: [
    { id: "map", title: "Bill Plotkin · Wild Mind · 1 (2013), pp. 11–29", url: chapter },
    { id: "voices", title: "Bill Plotkin · Four Practices · Voice Dialogue (pp. 1–9)", url: appendix + "#page=1" },
    { id: "circle", title: "Bill Plotkin · Four Practices · Four Directions Circles (pp. 9–13)", url: appendix + "#page=9" },
    { id: "dream", title: "Bill Plotkin · Four Practices · Dreamwork (pp. 13–15)", url: appendix + "#page=13" },
    { id: "imagery", title: "Bill Plotkin · Four Practices · Deep Imagery (pp. 15–18)", url: appendix + "#page=15" },
  ],
  practices: [
    {
      id: "center-voices", kind: "method", source: "voices",
      cz: {
        title: "Rozhovor hlasů",
        when: "Když tě jedna část táhne odpovědět hned a druhá se chce stáhnout. Metodu Voice Dialogue vytvořili Hal a Sidra Stoneovi. Plotkin popisuje také způsob vedení od Geneen Marie Haugen.",
        steps: [
          "Vezmi jednu dnešní situaci. Z jednoho místa vyslov nahlas větu hlasu, který při ní obvykle promluví první.",
          "Přesuň se o kousek. Dej slovo tomu, kdo se ke slovu dostává zřídka. Třeba co by zaznělo, kdyby mohl mluvit tvůj humor?",
          "Vrať se na své místo a odpověz oběma. Kterou jejich připomínku skutečně použiješ při příštím rozhovoru?",
        ],
        reflect: "Co jsem slyšel až ve chvíli, kdy jsem dal druhému hlasu čas domluvit?",
      },
      en: {
        title: "Voice dialogue",
        when: "When part of you wants to answer at once and another part wants to withdraw. Hal and Sidra Stone developed Voice Dialogue. Plotkin also describes a facilitation approach by Geneen Marie Haugen.",
        steps: [
          "Choose one situation from today. From one spot, say aloud what the voice that usually speaks first would say.",
          "Shift position. Give a quieter voice a turn. For instance, what would your sense of humor say if it could speak?",
          "Return to your own spot and answer both voices. Choose one thing you heard to take into your next conversation.",
        ],
        reflect: "What could I hear only after I let the quieter voice finish?",
      },
    },
    {
      id: "center-circle", kind: "method", source: "circle",
      cz: {
        title: "Kruh čtyř směrů",
        when: "Když se rozhoduješ mezi dvěma možnostmi a u obou se vracíš ke stejnému argumentu.",
        steps: [
          "Vyznač kolem sebe čtyři směry. Venku poslouží čtyři místa, doma čtyři lístky na stole. Z prostředku polož jednu otázku.",
          "U Severu hledej, co potřebuje péči. U Východu se podívej na širší obraz. Na Jihu si všimni tělesné reakce. Na Západě si počkej na obraz nebo přirovnání.",
          "Vrať se doprostřed. Vyslov rozhodnutí, které můžeš uskutečnit, a pojmenuj pohled, jenž je změnil.",
        ],
        reflect: "Ze kterého místa se moje původní otázka začala jevit jinak?",
      },
      en: {
        title: "Four directions circle",
        when: "When you keep making the same argument for or against a decision.",
        steps: [
          "Mark the directions around you. Use four places outdoors or four slips of paper on a table. Ask one question from the middle.",
          "In North, consider what needs care. In East, widen the frame. In South, notice your bodily response. In West, allow an image or comparison to emerge.",
          "Come back to the middle. Say what you can do and name the perspective that changed your decision.",
        ],
        reflect: "From which position did my original question start to look different?",
      },
    },
    {
      id: "center-dream", kind: "method", source: "dream",
      cz: {
        title: "Návrat k obrazu ze snu",
        when: "Když ti po probuzení utkvěla přesná scéna, třeba zvíře stojící na prahu.",
        steps: [
          "Zapiš jedinou scénu v přítomném čase. Doplň detail, podle kterého bys ji znovu poznal.",
          "Pokud si scénu živě vybavuješ, chvíli v ní pobuď. Čeho si postava nebo zvíře všímá? Co zůstává tobě skryté?",
          "Vrať pozornost do místnosti. Zaznamenej si zvlášť, co se skutečně zdálo a co tě napadlo teprve po probuzení.",
        ],
        reflect: "Co ve snu zůstává živé, i když mu zatím nerozumím?",
      },
      en: {
        title: "Return to a dream image",
        when: "When you wake with one precise scene in mind, perhaps an animal standing in a doorway.",
        steps: [
          "Write down one scene in the present tense. Add the detail you would recognize it by.",
          "If you can vividly recall the scene, stay with it for a moment. What does the figure or creature notice? What is outside your own view?",
          "Bring your attention back to the room. Record what actually appeared in the dream separately from what occurred to you after waking.",
        ],
        reflect: "What still feels alive in this dream even though I cannot explain it?",
      },
    },
    {
      id: "center-imagery", kind: "method", source: "imagery",
      cz: {
        title: "Zvíře v představě",
        when: "Když chceš některý směr poznat v obrazech. Tato práce s představivostí vychází také z přístupu Stephena Gallegose.",
        steps: [
          "Vyber si směr, který dnes skoro nedostal prostor. Na chvíli si představ krajinu, kde by ses mohl setkat se zvířetem.",
          "Jestli se nějaké objeví, pozoruj jeho pohyb a vzdálenost. Můžeš zůstat opodál. Když se nic neobjeví, i tím může dnešní pokus skončit.",
          "Podívej se zpět kolem sebe. Nakresli malý detail, který tě překvapil, a nech vedle něj místo pro příští setkání.",
        ],
        reflect: "Jak se vyvíjela moje zvědavost, když jsem nechal obraz chvíli být?",
      },
      en: {
        title: "Meet an animal in imagination",
        when: "When you want to meet a direction through imagery. This form of deep imagery also draws on the work of Stephen Gallegos.",
        steps: [
          "Choose a direction that has had little room today. Picture a landscape where you might encounter an animal.",
          "If one appears, notice its movement and distance. You can stay where you are. If nothing appears, that can be the whole encounter today.",
          "Look around the room again. Sketch one surprising detail, leaving a little space beside it for another visit.",
        ],
        reflect: "How did my curiosity change when I let the image take its own time?",
      },
    },
    {
      id: "center-decision", kind: "adaptation", source: "map",
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
      id: "center-return", kind: "adaptation", source: "map",
      cz: {
        title: "Ohlédnutí po jednom dni",
        when: "Večer po chvíli, kdy jsi jednal jinak, než jsi ráno zamýšlel.",
        steps: [
          "Vyber jednu událost. Popiš jen to, co by ve stejné místnosti mohl vidět nebo slyšet také někdo další.",
          "Doplň, co jsi chtěl ochránit. Která schopnost ti tehdy pomohla a kterou bys rád přizval příště?",
          "Připrav jeden konkrétní začátek pro příště, třeba první otázku, již položíš, než nabídneš řešení.",
        ],
        reflect: "Podle čeho zítra poznám, že jsem si nechal prostor k volbě?",
      },
      en: {
        title: "Look back on one day",
        when: "In the evening after a moment when you acted differently from what you intended that morning.",
        steps: [
          "Choose one event. Describe only what another person in the same room could have seen or heard.",
          "Add what you wanted to protect. Which capacity helped you and which would you invite next time?",
          "Prepare one specific opening for next time, perhaps the first question you will ask before offering a solution.",
        ],
        reflect: "What would tell me tomorrow that I left myself room to choose?",
      },
    },
  ],
};
