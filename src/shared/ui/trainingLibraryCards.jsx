import React, {useState} from 'react';
import {L} from '../lang/lang.js';
import {FONT_BODY} from './type.js';

export const TRAINING_LIBRARY_PAGE_SIZE = 24;

// A saved list view must not mount the entire growing library on a phone.
// Filtering still operates on all records; this only bounds the card surface.
export function TrainingLibraryCards({items, renderCard, t}) {
  const key = JSON.stringify(items.map(item => item.id));
  const [page, setPage] = useState({key, count: TRAINING_LIBRARY_PAGE_SIZE});
  // Reset synchronously when search/order changes, before any cards mount.
  const count = page.key === key ? page.count : TRAINING_LIBRARY_PAGE_SIZE;
  if (page.key !== key) setPage({key, count: TRAINING_LIBRARY_PAGE_SIZE});
  const visible = items.slice(0, count), remaining = items.length - visible.length;
  return <div data-training-library-page="">
    <div className="tm-reveal" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(min(236px, 100%), 1fr))',gap:10,minWidth:0}}>
      {visible.map(renderCard)}
    </div>
    {remaining > 0 && <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginTop:12}}>
      <button type="button" onClick={() => setPage({key, count: count + TRAINING_LIBRARY_PAGE_SIZE})}
        style={{background:'transparent',border:`1px solid ${t.border}`,borderRadius:8,padding:'8px 14px',minHeight:44,cursor:'pointer',fontFamily:FONT_BODY,fontSize:13,color:t.inkSand || t.text}}>
        {L('Načíst dalších', 'Load more')} {Math.min(TRAINING_LIBRARY_PAGE_SIZE, remaining)}
      </button>
      <span aria-live="polite" style={{fontFamily:FONT_BODY,fontSize:12,color:t.textMuted}}>{visible.length} {L('z', 'of')} {items.length}</span>
    </div>}
  </div>;
}
