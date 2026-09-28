// Pure library projection: never rewrites recorded sessions or their results.
// Main templates keep their IDs; preparation becomes an independently addable
// template. Running twice is safe, including a user-edited preparation copy.
const copyText = v => Array.isArray(v) ? v.join(' ') : String(v || '');
const explicitlyPreparation = b => /^(?:rozcvičk|rozcvičen|rozehřát|zahřát|warm[- ]?up|rozklus)/i.test(copyText(b.coachNote).trim());
export function separateWarmupTemplates(templates) {
  const supplied = new Set(templates.map(t => t.id));
  return templates.flatMap(t => {
    const all = t.blocks || [];
    const marked = b => explicitlyPreparation(b) || ((t.id === 'working_skill_base' || t.id === 'working_skill_wall') && ['wrists','scapush'].includes(b.exId));
    const warm = [], main = [];
    for (const b of all) {
      const sets = b.sets || [];
      const prepSets = marked(b) ? sets : sets.filter(s => s.type === 'warmup');
      const mainSets = marked(b) ? [] : sets.filter(s => s.type !== 'warmup');
      if (prepSets.length) warm.push({...b,sets:prepSets.map(s=>({...s,type:'warmup'}))});
      if (mainSets.length) main.push({...b,sets:mainSets});
    }
    if (!warm.length || !main.length) return [t];
    const id = t.id + '__warmup';
    const prep = {...t,id,cz:'Rozcvičení · '+t.cz,en:'Warm-up · '+t.en,blocks:warm,
      working:false,aims:['rozcvičení'],tags:[...(t.tags||[]),'rozcvičení'],
      intro:['Samostatná příprava k sestavě '+t.cz+'. Přidej ji do dne před hlavní trénink. Cvič lehce, bez únavy.' + sourceTail(t.intro?.[0], 'Zdroje:'),
        'Separate preparation for '+t.en+'. Add it to your day before the main workout. Keep it easy, without fatigue.' + sourceTail(t.intro?.[1], 'Sources:')]};
    return [{...t,blocks:main},...(supplied.has(id)?[]:[prep])];
  });
}
function sourceTail(text, marker) {
  const start = String(text || '').indexOf(marker);
  return start < 0 ? '' : '\n\n' + text.slice(start);
}
