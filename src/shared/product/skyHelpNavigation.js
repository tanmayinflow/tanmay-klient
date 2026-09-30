// Navigation labels are separate from the three reviewed explanatory sentences.
export const SKY_HELP_GROUPS=[
  {prefix:"G",name:["Orientace v Obloze","Finding your way"]},
  {prefix:"N",name:["Den · Nebe","Day · Sky"]},
  {prefix:"D",name:["Planety a jejich vztahy","Planets and relationships"]},
  {prefix:"H",name:["Helénistický klíč","Hellenistic key"]},
  {prefix:"J",name:["Džjótiš klíč","Jyotisha key"]},
  {prefix:"O",name:["Volba období","Choosing a period"]},
  {prefix:"W",name:["Týden","Week"]},
  {prefix:"M",name:["Měsíc","Month"]},
  {prefix:"Y",name:["Rok","Year"]},
  {prefix:"L",name:["Život","Life"]},
  {prefix:"S",name:["Nastavení","Settings"]},
];
// Explicit public surface: old IDs stay in SKY_HELP for preserved private history,
// but enabling the traditional Tibetan introduction does not restore the old model.
export const SKY_ACTIVE_HELP_IDS=Object.freeze([
  "G01","G02","G03","G04","G05","G06","G07","G08","G09",
  "N01","N02","N03","N04","N05","N06","N07","N08","N09","N10","N11","N12","N13","N14","N15","N16","N17","N18","N19",
  "D01","D02","D03","D04","D05","D06","H01","H02","H03","H04","J01","J02","J03","J04","J05",
  "O01","W01","W02","M01","Y01","Y02","Y03","L01","L02","L05",
  "S01","S02","S03","S04","S05","S06","S07","S08","S11","S12","S13","S14",
]);
export const SKY_HELP_RELATED={
  G02:["G01","G03","G04","G05","G06"],N09:["N10"],
  S01:["S02"],S03:["S04","S05","S08"],S13:["G09"],
};
export const SKY_HELP_EN_TITLES={
  G01:"The Sky space",G02:"Day, Period and Settings",G03:"Date and today",G04:"Time and playback",G05:"Place and time zone",G06:"Explanations",G07:"Carry the image into life",G08:"Key to traditions",G09:"Methods and sources",
  N01:"One sentence for today",N02:"Sunrise and sunset",N03:"Moonlight and two timescales",N04:"Lunar day",N05:"Nakshatra and pada",N06:"Day ruler",N07:"Current planetary hour",N08:"The day's hours",N09:"The sky as a whole",N10:"Day and week",N11:"Sky wheel",N12:"Tropical and sidereal",N13:"Chart layers and filters",N14:"Planet list",N15:"Retrogrades and stations",N16:"Eclipses",N17:"Longer background",N18:"Changes in the period",N19:"How the layers fit",
  D01:"Position and motion",D02:"Sign, element and mode",D03:"Aspects and their meaning",D04:"Gift and shadow",D05:"Dignity and host",D06:"Separation from the Sun",
  H01:"Rulers and dignities",H02:"Day and night sect",H03:"Year ruler",H04:"Fortune and Spirit",
  J01:"Panchanga",J02:"Transits and lunar nodes",J03:"Vimshottari dasha",J04:"Panchanga yoga",J05:"Karana",
  T01:"Vajra body map",T02:"Rahu",T03:"Saturn",T04:"Ketu",T05:"Sun and Moon",T06:"Six elements",T07:"Ten winds",T08:"Inner sun",T09:"Inner signs and sides",T10:"Nostril observation",T11:"Expected nostril",T12:"Observation history",T13:"La",T14:"Your cycle beside the Moon",T15:"Dream record",T16:"Dream in the body map",
  P01:"Today's practice",P02:"Lunar practice days",P03:"Yogini nights",P04:"Planetary practice reminders",P05:"Daily rhythm",P06:"Full sadhana",P07:"Practice and menstruation",P08:"Question and observation",P09:"Throw and decision",P10:"Review after twenty-one days",P11:"A teaching sentence",
  O01:"Period and navigation",W01:"Seven days of sky",W02:"The week's connections",W03:"Weekly observations",W04:"Weekly practice calendar",M01:"The Moon and monthly changes",M02:"Two rhythms together",M03:"Days and nights of practice",Y01:"The Sun through the year",Y02:"Yearly reversals and eclipses",Y03:"Your personal year ruler",Y04:"Outer year and inner day",Y05:"A year of practice",L01:"Dasha",L02:"Profections and transits",L03:"Personal body map",L04:"Living this period",L05:"Life without birth details",
  S01:"Personal profile",S02:"Your cycle experience",S03:"Astrological systems",S04:"Zodiac and ayanamsa",S05:"Lunar node conventions",S06:"Location and time zone",S07:"Birth details and certainty",S08:"Tibetan tradition · optional",S09:"Your forms of practice",S10:"Optional modules",S11:"Language",S12:"Private records archive",S13:"Sources",S14:"Shared Google Calendar",
};
