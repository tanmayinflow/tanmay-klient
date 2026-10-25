// Reviewed transparent cover motifs. Selection uses saved metadata, never titles or personal content.
const art = name => `/media/source-covers/${name}-v3.webp`;

export const SOURCE_COVER_ART = Object.freeze({
  Philosophy: art("philosophy"),
  Psychology: art("book"),
  Spirituality: art("philosophy"),
  Novel: art("story"),
  Movement: art("practice"),
  Science: art("book"),
  "Self-help": art("practice"),
  Biography: art("story"),
  Business: art("book"),
  Poetry: art("story"),
  Documentary: art("film"),
  Drama: art("film"),
  "Sci-fi": art("film"),
  Thriller: art("film"),
  Comedy: art("film"),
  Animation: art("film"),
  Interview: art("podcast"),
  Education: art("book"),
  Storytelling: art("story"),
});

export const SOURCE_COVER_TYPE_ART = Object.freeze({
  Book: art("book"),
  Movie: art("film"),
  Podcast: art("podcast"),
  Article: art("article"),
  Feed: art("flow"),
});

// Filled with hashes of the reviewed WebP exports during asset integration.
export const SOURCE_COVER_HASHES = Object.freeze({
  "article-v3.webp": "d87c40c275c8a34e8bc4ab95a70a827c5491ae09837eb4d4921798a6c8d367bb",
  "book-v3.webp": "60591e848eaced62fe00ce6713ec11a33bc7928dd257e49424a6999b148fedc6",
  "film-v3.webp": "411165738224265946104329f54c90792d24b772730a2cd9f511ef1538853ca7",
  "flow-v3.webp": "de199e87524e18dfa2ea81a8abfedca20fce63e1d0febbbdcd1b675804d3b62c",
  "philosophy-v3.webp": "940176fe57165c7148fcc4cb4c694b9846ee46f6c0f62c196e553294539290ed",
  "podcast-v3.webp": "8a442adb2d0a8f3b7bd64637e9d7b8c10c6c22dee83f2df0982cb5b00e230eb9",
  "practice-v3.webp": "604cdf89e56acf213a52cde8289538901b61d5f6620f514394cf241a0a167e85",
  "story-v3.webp": "09e4feca8b44890abc1f4fb0c3cbf42bbd314284bf1652ca3b27d8da686651c0"
});

/** Book genres choose a motif; other known media retain their recognizable medium. */
export function sourceCoverArt(category, type) {
  const knownType = typeof type === "string" && Object.hasOwn(SOURCE_COVER_TYPE_ART, type);
  if (knownType && type !== "Book") return SOURCE_COVER_TYPE_ART[type];
  if (typeof category === "string" && Object.hasOwn(SOURCE_COVER_ART, category)) return SOURCE_COVER_ART[category];
  return knownType ? SOURCE_COVER_TYPE_ART[type] : null;
}
