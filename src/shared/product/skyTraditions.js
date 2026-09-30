// The public reading and its coordinate system are selected together.
export const SKY_TRADITIONS = [
  {id:"western",name:["Západní","Western"],title:["Západní astrologie","Western astrology"],text:["Planety, znamení a jejich vzájemné vztahy. Začni dnešní oblohou a postupně rozviň podrobnosti.","Planets, signs and their relationships. Begin with today's sky and unfold the details at your own pace."]},
  {id:"hellenistic",name:["Helénistická","Hellenistic"],title:["Helénistická astrologie","Hellenistic astrology"],text:["Sedm tradičních světel, jejich vládci a podmínky. Osobní roční témata najdeš v Období po doplnění narození.","The seven traditional lights, their rulers and conditions. Add your birth details to explore personal annual themes in Periods."]},
  {id:"jyotish",name:["Džjótiša","Jyotisha"],title:["Džjótiša","Jyotisha"],text:["Indická astrologie se siderickým zvěrokruhem. Pančánga přibližuje kvality dne; osobní období najdeš po doplnění narození.","Indian astrology with a sidereal zodiac. Panchanga introduces the qualities of the day; birth details open personal periods."]},
];
export const skyTradition=value=>SKY_TRADITIONS.some(t=>t.id===value)?value:"western";
export const skyZodiac=tradition=>tradition==="jyotish"?"sidereal":"tropical";
export function skyReading(settings,selected){
  const standard=SKY_TRADITIONS.some(t=>t.id===selected)?selected:skyTradition(settings.tradition);
  const reading=selected==="tibetan"&&settings.tibetanEnabled===true?"tibetan":standard;
  const lens=reading==="tibetan"?"western":reading;
  return {reading,lens,zodiac:skyZodiac(lens)};
}
