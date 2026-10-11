// The room remains paper and ink. Motion marks a deliberate change of work.
export const CONTENT_WORKSHOP_CSS = `
.tm-content-workshop { min-width:0; }
.tm-content-workshop .tm-page-title[data-art-room="socsite"] { min-height:146px !important; padding-bottom:0 !important; }
.tm-content-workshop .tm-page-title[data-art-room="socsite"] h1 { max-width:calc(100% - 128px); line-height:.96 !important; gap:8px !important; align-items:flex-start !important; }
.tm-content-workshop .tm-page-title[data-art-room="socsite"] .tm-page-title-text { max-width:4em; text-wrap:balance; }
.tm-content-workshop .tm-page-title[data-art-room="socsite"]::before { inset:18px 0 auto auto !important; width:158px !important; height:138px !important; opacity:.5 !important; }
.tm-content-edit-text { box-sizing:border-box; width:100%; min-width:0; min-height:44px; border:0; border-bottom:1px solid var(--content-line); border-radius:0; padding:8px 2px; color:var(--content-ink); background:transparent; font-family:var(--tm-font-body); font-size:16px; line-height:1.5; resize:vertical; }
.tm-content-edit-action { display:inline-flex; align-items:center; justify-content:center; gap:8px; flex-shrink:0; min-width:44px; min-height:44px; padding:8px 4px; border:0; background:transparent; color:var(--content-accent); font-family:var(--tm-font-body); font-size:13px; cursor:pointer; }
.tm-content-edit-action:disabled { opacity:.45; cursor:default; }
.tm-content-workshop textarea:focus-visible { outline:2px solid var(--content-accent); outline-offset:3px; }
.tm-content-tabs { display:flex; flex-wrap:wrap; gap:4px 14px; margin:12px 0 22px; }
.tm-content-tabs button { min-height:44px; padding:8px 0; background:transparent; border:0; border-bottom:1px solid transparent; color:var(--content-muted); font-family:var(--tm-font-tag); text-transform:uppercase; letter-spacing:.12em; font-size:13px; cursor:pointer; }
.tm-content-tabs button[aria-pressed=true] { border-color:var(--content-accent); color:var(--content-accent); }
.tm-content-path { display:grid; grid-template-columns:repeat(6,minmax(max-content,1fr)); gap:0; margin:4px 0 22px; padding:4px 0; overflow-x:auto; overscroll-behavior-x:contain; scrollbar-width:thin; scrollbar-color:var(--content-line) transparent; }
.tm-content-path button { background:transparent; border:0; padding:10px 2px; min-width:44px; min-height:76px; position:relative; color:var(--content-muted); cursor:pointer; display:flex; align-items:center; flex-direction:column; gap:8px; }
.tm-content-path button::after { content:''; position:absolute; width:calc(100% - 30px); height:1px; top:22px; left:calc(50% + 15px); background:var(--content-line); }
.tm-content-path button:last-child::after { display:none; }
.tm-content-path button[aria-pressed=true] { color:var(--content-accent); }
.tm-content-path button[aria-pressed=true] svg { transform:scale(1.12); }
.tm-content-path svg { transition:transform .3s cubic-bezier(.16,1,.3,1); }
.tm-content-path .phase-name { font-family:var(--tm-font-tag); font-size:12px; line-height:1.25; white-space:nowrap; overflow-wrap:normal; }
.tm-content-path .phase-count { font-family:var(--tm-font-body); font-size:11px; font-variant-numeric:tabular-nums; }
.tm-content-intro { position:relative; min-height:126px; padding-right:128px; display:flex; flex-direction:column; justify-content:center; margin:8px 0 18px; }
.tm-content-intro h2 { font-family:var(--tm-font-display); font-weight:400; font-size:29px; line-height:1.15; margin:0 0 7px; }
.tm-content-intro p,.tm-content-intro > div { margin:0; font-size:13px; line-height:1.65; }
.tm-content-art { position:absolute; width:120px; height:126px; right:0; top:0; background:var(--content-ink); opacity:.56; mask:var(--content-art) center/contain no-repeat; -webkit-mask:var(--content-art) center/contain no-repeat; pointer-events:none; }
.tm-content-panel { animation:tmcontentreveal .32s cubic-bezier(.16,1,.3,1); min-width:0; }
.tm-content-note-heading { margin:26px 0 8px; font-family:var(--tm-font-display); font-size:25px; font-weight:400; }
.tm-content-workshop button:focus-visible,.tm-content-workshop input:focus-visible { outline:2px solid var(--content-accent); outline-offset:3px; }
.tm-content-workshop input::placeholder { color:var(--content-muted); opacity:1; }
.tm-content-workshop .tm-content-card { display:block; width:100%; text-align:left; font:inherit; box-sizing:border-box; }
.tm-content-workshop .tm-content-card:focus-visible { outline:2px solid var(--content-accent); outline-offset:3px; }
@keyframes tmcontentreveal { from { opacity:.8; clip-path:inset(0 0 8% 0); } to { opacity:1; clip-path:inset(0); } }
@media(max-width:380px) { .tm-content-intro{padding-right:104px}.tm-content-art{width:96px}.tm-content-intro h2{font-size:26px}.tm-content-path button{gap:7px} }
@media(max-width:360px) { .tm-content-workshop .tm-page-title[data-art-room="socsite"] h1{max-width:calc(100% - 96px)}.tm-content-workshop .tm-page-title[data-art-room="socsite"]::before{width:120px !important;height:122px !important;right:-4px !important} }
@media(prefers-reduced-motion:reduce) { .tm-content-panel{animation:none}.tm-content-path svg{transition:none} }
`;
