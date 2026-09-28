export const togetherTheme=t=>({
  '--tg-bg':t.bg,'--tg-text':t.text,'--tg-muted':t.textSec,'--tg-line':t.border,
  '--tg-soft':t.borderSoft,'--tg-card':t.card,'--tg-sheet':t.sheet,
  '--tg-accent':t.accentInk||t.accent,'--tg-on':t.onAccent,'--tg-fill':t.accent,'--tg-heading':t.heading,
});

// Same reading axis, field treatment and disclosure rhythm as Practice.
export const togetherStyles=`
.tm-together{max-width:760px;margin:0 auto;color:var(--tg-text);font-family:var(--tm-font-body);overflow-wrap:anywhere}
.tm-together .tm-page-title{min-height:106px;padding-top:16px}
.tm-together .tm-page-title::before{content:none!important}
.tm-together .tm-page-title h1{padding-right:112px}
.tm-together h2{font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;line-height:1.5;margin:0 0 12px;color:var(--tg-accent)}
.tm-together h3{font-family:var(--tm-font-display);font-size:21px;font-weight:400;line-height:1.3;color:var(--tg-heading);margin:20px 0 8px}
.tm-together p{font-size:14px;line-height:1.65;color:var(--tg-muted);margin:8px 0 16px;max-width:70ch}
.tm-together-section{padding:24px 0;border-bottom:0}
.tm-together-section+.tm-together-section{border-top:1px solid var(--tg-soft)}
.tm-together button,.tm-together select,.tm-together input,.tm-together textarea{font-family:var(--tm-font-body);font-size:14px;font-weight:400;color:var(--tg-text);min-height:44px;border:1px solid var(--tg-line);border-radius:8px;background:transparent;padding:10px 12px;max-width:100%;box-sizing:border-box}
.tm-together button{cursor:pointer;line-height:1.25;transition:color .16s ease,border-color .16s ease}
.tm-together button:hover:not(:disabled){border-color:var(--tg-accent);color:var(--tg-accent)}
.tm-together button:disabled{opacity:.5;cursor:default}
.tm-together button.primary{background:var(--tg-fill);background-image:var(--tm-action-material,none);background-size:768px auto;color:var(--tg-on);border-color:var(--tg-fill)}
.tm-together button.primary:hover:not(:disabled){color:var(--tg-on)}
.tm-together input,.tm-together textarea,.tm-together select{width:100%;font-size:15px}
.tm-together input:not([type=checkbox]):not([type=radio]):not([type=date]):not([type=time]):not([type=number]),.tm-together textarea{background:transparent;border:0;border-bottom:1px solid var(--tg-soft);border-radius:0;padding:3px 2px 8px;line-height:1.62;display:block;min-height:44px}
.tm-together textarea{resize:none;overflow:hidden}
.tm-together :is(select,input[type=date],input[type=time],input[type=number]){background:var(--tg-sheet)}
.tm-together label{display:block;font-family:var(--tm-font-display);font-size:19px;font-weight:400;color:var(--tg-accent);line-height:1.3;margin:18px 0 4px}
.tm-together label :is(input,textarea,select){margin-top:4px;font-family:var(--tm-font-body);font-weight:400}
.tm-together :is(button,input,textarea,select,summary,a):focus-visible{outline:2px solid var(--tg-accent);outline-offset:3px}
.tm-together :is(input,textarea):focus{border-bottom-color:var(--tg-accent)}
.tm-together ::selection{background:var(--tg-fill);color:var(--tg-on)}
.tm-together .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.tm-together .fields{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
.tm-together .tabs{display:flex;gap:4px;margin:8px 0 4px;border:0}
.tm-together .tabs button{flex:1;min-width:0;border:0;border-radius:0;padding:8px 4px 9px;border-bottom:2px solid transparent;font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--tg-muted);display:flex;align-items:center;justify-content:center;gap:6px}
.tm-together .tabs button[aria-pressed=true]{border-bottom-color:var(--tg-accent);color:var(--tg-accent)}
.tm-together .tabs button[aria-pressed=true]::before{content:'';width:4px;height:4px;border-radius:50%;background:currentColor;flex-shrink:0}
.tm-together .overview{padding:16px 0 0}
.tm-together .overview strong{display:block;font-family:var(--tm-font-display);font-size:23px;font-weight:400;color:var(--tg-heading)}
.tm-together .item{padding:12px 0;border-bottom:1px solid var(--tg-soft)}
.tm-together .item strong{font-size:15px;font-weight:500}
.tm-together .hint{font-size:12px;line-height:1.6;color:var(--tg-muted)}
.tm-together details{border:0;border-top:1px solid var(--tg-soft);padding:0;margin:0}
.tm-together summary{cursor:pointer;min-height:44px;box-sizing:border-box;padding:12px 0;display:flex;align-items:center;justify-content:space-between;gap:12px;list-style:none;font-family:var(--tm-font-body);font-size:15px;font-weight:500;line-height:1.4;color:var(--tg-text)}
.tm-together summary::-webkit-details-marker{display:none}
.tm-together summary::marker{content:''}
.tm-together summary::after{content:'';width:6px;height:6px;border-top:1px solid currentColor;border-right:1px solid currentColor;transform:rotate(45deg);flex-shrink:0;margin-right:4px;transition:transform .18s ease;color:var(--tg-accent)}
.tm-together details[open]>summary::after{transform:rotate(135deg)}
.tm-together summary:hover{color:var(--tg-accent)}
.tm-together .tg-section-fold>summary{font-family:var(--tm-font-tag);font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.18em;padding:16px 0;color:var(--tg-accent)}
.tm-together .tg-section-fold>summary::after{content:none}
.tm-together .tg-fold-arrow{flex-shrink:0;transition:transform .18s ease}
.tm-together .tg-section-fold[open]>summary .tg-fold-arrow{transform:rotate(90deg)}
.tm-together .tg-fold-body{padding:0 0 20px}
.tm-together .tg-fold-body>.tm-together-section{padding-top:8px}
.tm-together a{color:var(--tg-accent);text-underline-offset:3px}
.tm-together li{font-size:14px;line-height:1.65;margin:6px 0}
.tm-together .tg-header{position:relative;min-height:180px}
.tm-together .tg-intro-row{display:flex;align-items:center;gap:18px;margin-bottom:18px}
.tm-together .tg-intro{flex:1;min-width:0;font-size:14px;margin:0;max-width:none}
.tm-together .tg-sharing-trigger{flex:0 0 128px;text-align:center;line-height:1.5}
.tm-together button.tg-moon{position:absolute;right:0;top:0;width:140px;height:150px;border:0;padding:0;color:var(--tm-room-art-ink,var(--tg-accent));background:transparent;display:flex;flex-direction:column;align-items:center}
.tg-moon svg{width:120px;height:144px;transition:transform .2s ease}
.tg-moon:hover svg{transform:rotate(3deg)}
.tg-moon span{position:absolute;top:194px;font-size:12px;line-height:1.4;color:var(--tg-accent);text-decoration:none;max-width:132px;text-align:center}
.tg-moon-sheet summary{cursor:pointer;min-height:44px;padding:12px 0}
.tg-moon-sheet a{color:inherit;text-underline-offset:3px}
.tg-moon-sheet h3{font-family:var(--tm-font-display);font-size:25px;font-weight:400;margin:26px 0 8px}
.tm-together .notice{padding:12px 0;color:var(--tg-accent);font-size:14px}
.tm-together .error{border:1px solid var(--tg-line);border-radius:8px;padding:14px;margin:16px 0}
.tm-together label.consent{font-family:var(--tm-font-body);font-size:14px;color:var(--tg-text);display:flex;gap:12px;align-items:center;min-height:44px;cursor:pointer}
.tm-together .consent input{appearance:none;-webkit-appearance:none;width:22px;height:22px;min-height:22px;padding:0;flex-shrink:0;background:transparent;border:1px solid var(--tg-accent);border-radius:5px 7px 4px 6px;display:grid;place-content:center;cursor:pointer}
.tm-together .consent input:checked{background:var(--tg-fill);border-color:var(--tg-fill)}
.tm-together .consent input:checked::after{content:'';width:9px;height:5px;border-left:1.6px solid var(--tg-on);border-bottom:1.6px solid var(--tg-on);transform:rotate(-45deg) translateY(-1px)}
.tm-together [hidden]{display:none!important}
.tm-together .tg-settings-row{display:flex;justify-content:flex-end}
.tm-together .tg-text-button,.tm-together .tg-overview-trigger{border:0;background:transparent;border-radius:0;padding:10px 0;font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--tg-accent)}
.tm-together .tg-overview-trigger{display:block;margin:12px 0 0 auto;letter-spacing:.22em}
.tm-together .tg-settings-nav{padding:12px 0}
.tm-together .tg-settings-nav [aria-pressed=true]{border-color:var(--tg-accent);color:var(--tg-accent)}
.tm-together .tg-personal{font-family:var(--tm-font-display);font-size:24px;line-height:1.35;color:var(--tg-heading);margin:8px 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}
.tm-together .tg-partner{padding:14px 16px;background:var(--tg-sheet);border:1px solid var(--tg-soft);border-radius:8px;margin:8px 0 4px}
.tm-together .tg-partner h2{margin-bottom:8px}
.tm-together .tg-partner .tg-personal{font-size:22px}
.tm-together .tg-partner p:last-child{margin-bottom:0}
.tm-together .tg-partner+.tm-together-section{border-top:0}
.tm-together .tg-needs{display:grid;grid-template-columns:1fr 1fr;gap:0 12px;margin:4px 0 8px}
.tm-together .tg-needs button{border:0;border-radius:0;font-size:13px;padding:8px 0;text-align:left;display:flex;align-items:center;gap:8px}
.tm-together .tg-needs button::before{content:'';width:10px;height:10px;border-radius:50%;border:1px solid var(--tg-line);flex-shrink:0}
.tm-together .tg-needs button[aria-pressed=true]{color:var(--tg-accent)}
.tm-together .tg-needs button[aria-pressed=true]::before{background:var(--tg-accent);border-color:var(--tg-accent)}
.tm-together .tg-optional{margin:16px 0}
.tm-together .tg-optional>summary{font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:400;color:var(--tg-accent)}
.tm-together .tg-actions{gap:8px}
.tm-together .tg-partner-answer{margin-top:24px}
.tm-together .tg-ritual summary>span{font-family:var(--tm-font-display);font-size:20px;font-weight:400;color:var(--tg-heading)}
.tm-together .tg-ritual summary small{display:block;font-family:var(--tm-font-tag);font-size:12px;font-weight:400;letter-spacing:.06em;color:var(--tg-muted);margin-top:4px}
.tm-together .tg-ritual ol{padding-left:22px}
.tm-together .tg-plan-row{border:1px solid var(--tg-soft);border-radius:8px;padding:0 12px;margin:8px 0;background:var(--tg-sheet)}
.tm-together .tg-plan-row>summary{font-family:var(--tm-font-display);font-size:21px;font-weight:400;color:var(--tg-heading)}
.tm-together .tg-plan-row small{display:block;font-family:var(--tm-font-body);font-size:12px;line-height:1.5;color:var(--tg-muted);margin-top:4px}
.tm-together .tg-plan-row .row{padding:4px 0 14px}
.tm-together :is(textarea,input)::placeholder{color:var(--tg-muted);opacity:1}
.tm-together :is(input,textarea){caret-color:var(--tg-accent)}
.tm-together [data-tg-view]>h2,.tm-together [data-tg-nav]{scroll-margin-top:calc(96px + env(safe-area-inset-top))}
.tm-together [data-tg-view]>h2:focus-visible{outline:2px solid var(--tg-accent);outline-offset:6px}
.tm-together .tg-date-row{display:flex;align-items:center;gap:4px;padding:8px 0 12px}
.tm-together .tg-date-row button{border:0;padding:8px;background:transparent}
.tm-together .tg-date-row .tg-date{font-family:var(--tm-font-display);font-size:22px;color:var(--tg-heading);padding:8px 12px}
.tm-together .tg-date-row .tg-date-today{margin-left:auto;font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.tm-together .tg-date-chooser{padding:0 0 12px;max-width:440px}
.tm-together .tg-entry-fields{border:0;padding:0;margin:0;min-width:0}
.tm-together .tg-entry-fields:disabled{opacity:.55}
.tm-together .tg-entry-fields .tm-navod::placeholder{font-family:var(--tm-font-display);font-style:italic;font-size:17px;line-height:1.45}
.tm-together .tm-navod{font-family:var(--tm-font-body);font-size:15px;font-style:normal;font-weight:400}
.tm-together .tg-inline-fold>summary{justify-content:flex-start;gap:8px}
.tm-together .tg-live-questions .tg-question-library{border-top:0;margin-top:14px}
.tm-together .tg-live-questions .row>button{min-height:40px;padding:8px 11px}
.tm-together .tg-reset-confirm{border:1px solid var(--tg-line);border-radius:8px;padding:14px;margin-top:14px}
.tm-together label.tg-check{display:flex;align-items:center;gap:9px;min-height:44px;font-family:var(--tm-font-body);font-size:14px;line-height:1.4;color:var(--tg-text);margin:0;cursor:pointer}
.tm-together .tg-check input:is([type=radio],[type=checkbox]){width:17px;height:17px;min-height:17px;flex-shrink:0;margin:0;padding:0;accent-color:var(--tg-accent)}
.tm-together .tg-cycle-phase{font-family:var(--tm-font-display);font-size:30px;font-weight:400;line-height:1.2;color:var(--tg-heading);display:block}
.tm-together .tg-overview-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0}
.tm-together .tg-overview-stats>div{padding:14px;background:var(--tg-sheet);border:1px solid var(--tg-soft);border-radius:8px}
.tm-together .tg-overview-stats strong{font-family:var(--tm-font-display);font-size:28px;font-weight:400;display:block;color:var(--tg-heading)}
.tm-together .tg-stat span{font-size:13px;line-height:1.5;color:var(--tg-muted)}
.tm-together .tg-section-fold>summary{scroll-margin-top:96px}
@media(max-width:380px){.tm-together .fields{grid-template-columns:1fr}.tm-together .tm-page-title h1{font-size:38px}.tm-together .tabs button{letter-spacing:.08em}.tm-together .tg-sharing-trigger{flex-basis:108px}.tm-together .tg-intro-row{gap:12px}}
@media(prefers-reduced-motion:reduce){.tm-together *, .tg-moon svg{transition:none!important}.tg-moon:hover svg{transform:none}}
`;
