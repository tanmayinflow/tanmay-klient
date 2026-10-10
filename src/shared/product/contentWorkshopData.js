// Generic content workflow only. Never place owner posts, hooks, topics or notes here.
export const SOC_STAVY = [
  { k: "napad", cz: "Nápady", en: "Ideas", color: "yellow" },
  { k: "plan", cz: "Naplánováno", en: "Planned", color: "brown" },
  { k: "natocit", cz: "Vytvořit", en: "To create", color: "purple" },
  { k: "strih", cz: "Zpracování", en: "In post", color: "red" },
  { k: "publikovat", cz: "K publikaci", en: "To publish", color: "green" },
  { k: "vysledky", cz: "Vyhodnocení", en: "Reviewed", color: "blue" },
];
export const socStav = (k) => SOC_STAVY.find((s) => s.k === k) || SOC_STAVY[0];

export const SOC_PLATFORMY = ["Instagram", "YouTube", "TikTok", "E-mail"];

// Checklisty přesně podle šablon z Notionu (IG Carousel / IG Reel / TikTok /
// YouTube / Email Newsletter) · každý formát má i osnovu polí v detailu.
export const SOC_FORMATY = {
  reel: { cz: "Reel", en: "Reel", kroky: [
    ["Najdi nápad a hooky", "Identify the video idea and hooks"],
    ["Vyber audio, se kterým to spáruješ", "Identify audio to pair with"],
    ["Vygeneruj scénář — prompt v Zápisníku tvorby", "Generate the script — the prompt in the creation notebook"],
    ["Sestav shot list — prompt v Zápisníku tvorby", "Build a shot list — the prompt in the creation notebook"],
    ["Natoč a sestříhej", "Film and edit"],
    ["Napiš titulek", "Write the caption"],
    ["Přidej trendové audio", "Add trending audio"],
    ["Publikuj", "Publish"],
    ["Zapiš výsledky a poučení", "Log results and the lesson"],
  ]},
  karusel: { cz: "Karusel", en: "Carousel", kroky: [
    ["Najdi karusely, kterým se daří", "Identify carousel concepts that perform well"],
    ["Vygeneruj strukturu vyprávění — prompt v Zápisníku tvorby", "Generate the storytelling structure — the prompt in the creation notebook"],
    ["Napiš texty slidů a přepiš vlastním hlasem", "Write slide texts and revise in your own voice"],
    ["Vytvoř karusel (Canva / Adobe Express)", "Create the carousel (Canva / Adobe Express)"],
    ["Napiš SEO titulek", "Write an SEO-friendly caption"],
    ["Publikuj", "Publish"],
    ["Zapiš výsledky a poučení", "Log results and the lesson"],
  ]},
  tiktok: { cz: "TikTok", en: "TikTok", kroky: [
    ["Najdi koncept, který v tvé nice funguje", "Identify a high-performing concept in your niche"],
    ["Vygeneruj text — prompt v Zápisníku tvorby", "Generate the text — the prompt in the creation notebook"],
    ["Sestav shot list — prompt v Zápisníku tvorby", "Build a shot list — the prompt in the creation notebook"],
    ["Napiš titulek", "Write the caption"],
    ["Natoč / sestříhej", "Film / edit"],
    ["Přidej trendové audio", "Add trending audio"],
    ["Publikuj", "Publish"],
    ["Zapiš výsledky a poučení", "Log results and the lesson"],
  ]},
  youtube: { cz: "YouTube", en: "YouTube", kroky: [
    ["Najdi trendový nápad či video", "Identify a trending idea or video"],
    ["Vygeneruj scénář — prompt v Zápisníku tvorby", "Generate the script — the prompt in the creation notebook"],
    ["Sestav shot list — prompt v Zápisníku tvorby", "Build a shot list — the prompt in the creation notebook"],
    ["Napiš SEO popis", "Write SEO-friendly captions"],
    ["Natoč a sestříhej", "Film and edit"],
    ["Publikuj", "Publish"],
    ["Zapiš výsledky a poučení", "Log results and the lesson"],
  ]},
  email: { cz: "E-mail", en: "Email", kroky: [
    ["Urči jednu klíčovou zprávu", "Identify one key message"],
    ["Napiš tělo podle stavby příběhu v 5 dějstvích", "Script it with the 5-part story structure"],
    ["Přidej design, je-li potřeba", "Add designs if any"],
    ["Přepiš vlastním hlasem, škrtni redundanci", "Revise in your own voice, cut redundancy"],
    ["Zkontroluj tempo — ať to nezahltí", "Check pacing — don't overwhelm"],
    ["Odešli", "Send"],
    ["Zapiš Open rate a Click rate", "Log open rate and click rate"],
  ]},
  jine: { cz: "Jiné", en: "Other", kroky: [
    ["Vyjasni nápad a komu je určen", "Clarify the idea and who it serves"],
    ["Vytvoř", "Create"],
    ["Publikuj", "Publish"],
    ["Zapiš výsledky a poučení", "Log results and the lesson"],
  ]},
};

