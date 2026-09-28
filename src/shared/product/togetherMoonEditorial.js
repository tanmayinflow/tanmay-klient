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
};
