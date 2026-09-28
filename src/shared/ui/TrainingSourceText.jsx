import React from 'react';

// Provenance lives in the public intro, so it survives template copies and
// client delivery without widening the private training document schema.
export function TrainingSourceText({ text, color }) {
  if (!text) return null;
  const parts = String(text).split(/\n\n(?:Zdroje|Sources):\n/);
  const urls = /(https:\/\/[^\s]+)/g;
  const link = line => line.split(urls).map((part,i) => {
    if (!/^https:\/\//.test(part)) return part;
    try {
      const url=new URL(part);
      return <a key={i} href={url.href} target="_blank" rel="noopener noreferrer" style={{color,overflowWrap:'anywhere'}}>{url.hostname === 'www.youtube.com' ? 'YouTube ↗' : url.hostname + ' ↗'}</a>;
    } catch { return part; }
  });
  return <div style={{whiteSpace:'pre-line',lineHeight:1.6}}>
    {link(parts[0])}
    {parts[1] && <details style={{marginTop:10,fontStyle:'normal',fontSize:13}}><summary style={{cursor:'pointer',minHeight:40,display:'list-item',padding:'8px 0'}}>{String(text).includes('\n\nZdroje:') ? 'Zdroje a původ sestavy' : 'Sources and provenance'}</summary>{parts[1].split('\n').map((line,i)=><p key={i} style={{margin:'6px 0',overflowWrap:'anywhere'}}>{link(line)}</p>)}</details>}
  </div>;
}
