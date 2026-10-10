// The same short instructions in both apps. A timer measures a session;
// it does not save a training result by itself.
export const TRAINING_TIMER_MODES = [
  { k: "countdown", cz: "Odpočet", en: "Countdown", say: ["Nastav délku cvičení nebo pauzy. Časovač odpočítá do nuly.", "Set the length of your exercise or rest. The timer counts down to zero."] },
  { k: "stopwatch", cz: "Stopky", en: "Stopwatch", say: ["Měř uplynulý čas. Stopky zastavíš, až skončíš.", "Measure elapsed time. Stop the clock when you finish."] },
  { k: "interval", cz: "Intervaly", en: "Intervals", say: ["Střídej cvičení a odpočinek podle nastavených časů a počtu kol.", "Alternate exercise and rest for the times and number of rounds you set."] },
  { k: "tabata", cz: "Tabata", en: "Tabata", say: ["Klasická tabata má osm kol: 20 sekund cvičení a 10 sekund odpočinku.", "Classic tabata has eight rounds: 20 seconds of exercise and 10 seconds of rest."] },
  { k: "emom", cz: "EMOM", en: "EMOM", say: ["EMOM znamená začít každou minutu. Udělej zadaná opakování a do dalšího úseku odpočívej.", "EMOM means every minute on the minute. Complete your reps, then rest until the next interval."] },
  { k: "amrap", cz: "AMRAP", en: "AMRAP", say: ["AMRAP: za daný čas zvládni co nejvíc kol nebo opakování se zachovanou technikou.", "AMRAP: complete as many rounds or reps as possible within the time limit, keeping good form."] },
];

export const TRAINING_FLOWS = [
  { k: "sets", cz: "Série a pauzy", en: "Sets and rests", say: ["Dokonči série jednoho cviku, pak přejdi k dalšímu. Pauzy určuješ ty.", "Complete the sets of one exercise, then move to the next. You control the rests."] },
  { k: "rounds", cz: "Kruh", en: "Circuit", say: ["Projdi všechny cviky, odpočiň si a celý okruh zopakuj.", "Complete every exercise, rest, then repeat the circuit."] },
  { k: "emom", cz: "EMOM", en: "EMOM", say: ["EMOM: na začátku každého úseku udělej zadaná opakování. Zbytek času odpočívej. Běžný úsek trvá minutu.", "EMOM: complete the prescribed reps at the start of each interval. Rest for the remaining time. The usual interval is one minute."] },
  { k: "amrap", cz: "AMRAP", en: "AMRAP", say: ["AMRAP: za daný čas zopakuj celý okruh co nejvíckrát se zachovanou technikou.", "AMRAP: repeat the full circuit as many times as possible within the time limit, keeping good form."] },
  { k: "interval", cz: "Intervaly", en: "Intervals", say: ["Cvič a odpočívej v nastavených intervalech. Časovač tě provede jednotlivými cviky.", "Exercise and rest for the set intervals. The timer guides you through each exercise."] },
  { k: "mobility", cz: "Mobilita", en: "Mobility", say: ["Procházej cviky vlastním tempem. Čas sleduješ bez zvukových signálů.", "Move through the exercises at your own pace. Time is tracked without sound cues."] },
  { k: "recovery", cz: "Regenerace", en: "Recovery", say: ["Nastav si čas na odpočinek. Časovač odpočítá do konce.", "Set aside time to rest. The timer counts down to the end."] },
];

export const TRAINING_TIMER_NOTE = [
  "Časovač pouze měří čas. Průběh a výsledky si zaznamenej u konkrétního tréninku.",
  "The timer only measures time. Record your session and results in the workout itself.",
];
