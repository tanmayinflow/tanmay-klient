import React, {useState} from "react";
import {TmIcon as FamilyIcon} from "./icons.jsx";
import {FONT_BODY,FONT_TAG} from "./type.js";

export function createCalendarUI({useT,useStore,L,getLang,fmtCZ,engine,SetSection,SetSwitch,SetChoice,PersonalSettingsSections}) {
const {CAL_KINDS,tmCalDesired,tmCalBody,tmCalHash,tmCalTz,tmCalReady,tmCalLoad,tmCalPrepare,tmCalAccount,tmCalAvailable,tmCalSync,tmCalDisconnect,tmCalIcs,tmCalTichoZakazano,tmCalTichoZapis,tmOrigin} = engine;
const client = engine.role === "client";
const klDownload = (name, text) => {
  const url=URL.createObjectURL(new Blob([text],{type:"text/calendar;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
};
function CalAuto() {
  const st = useStore();
  const ref = React.useRef(st);
  ref.current = st;
  React.useEffect(() => {
    let disposed=false,busy=false,restoring=false,preparedConfig=false,signature=null,catchUp=true,retryAt=0,connection='';
    const cfgOf=()=>engine.config(ref.current.calCfg());
    const keyOf=cfg=>`${tmCalAccount()}|${cfg.clientId}|${cfg.calId}`;
    const sync=force=>{
      if(disposed||document.hidden||busy||Date.now()<retryAt)return;
      try {
        const s0=ref.current,cfg=cfgOf(),key=keyOf(cfg);
        if(key!==connection){connection=key;signature=null;catchUp=true;retryAt=0;}
        if(!cfg.clientId||!cfg.calId||cfg.calDisconnected||!tmCalAvailable()||!tmCalReady(cfg))return;
        const tz=tmCalTz();
        const settings=[cfg.cycle,cfg.trenink,cfg.rozvrh,cfg.klienti,cfg.motiv,cfg.zpet,cfg.horizon,cfg.titles,cfg.busy];
        const training=client&&cfg.trenink?s0.getClientTrainingCalendar?.().schedule:null;
        const next=tmCalDesired(s0,cfg).map(e=>e.key+'~'+tmCalHash(tmCalBody(e,tz))).sort().join('|')+'|allDay:'+JSON.stringify((s0.coll.calendarAllDay||[]).map(r=>[r.id,r.rev,r.deleted]))+'|settings:'+JSON.stringify(settings)+'|training:'+JSON.stringify(training);
        if(!force&&!catchUp&&next===signature)return;
        busy=true;
        tmCalSync(s0,{interactive:false}).then(result=>{
          if(disposed||key!==keyOf(cfgOf()))return;
          if(!result.chyby){signature=next;catchUp=false;}else retryAt=Date.now()+60000;
        },()=>{if(!disposed&&key===keyOf(cfgOf()))retryAt=Date.now()+60000;}).finally(()=>{busy=false;});
      }catch{busy=false;retryAt=Date.now()+60000;}
    };
    const restore=()=>{
      if(disposed||document.hidden||restoring||!tmCalAvailable())return;
      restoring=true;
      const owner=tmCalAccount();
      // Server restoration never opens Google. Only an explicit Connect tap
      // may authorize; unrelated taps and recurring timers never do.
      Promise.resolve(preparedConfig?undefined:tmCalPrepare()).then(()=>{
        preparedConfig=true;
        return engine.tmCalRestore?.();
      }).then(()=>{
        if(!disposed&&owner===tmCalAccount())sync(true);
      },()=>{}).finally(()=>{restoring=false;});
    };
    const back=()=>{if(!document.hidden){retryAt=0;restore();}};
    restore();
    const outgoing=setInterval(()=>sync(false),4000),incoming=setInterval(restore,60000);
    document.addEventListener('visibilitychange',back);
    window.addEventListener('focus',back);
    window.addEventListener('online',back);
    return ()=>{disposed=true;clearInterval(outgoing);clearInterval(incoming);document.removeEventListener('visibilitychange',back);window.removeEventListener('focus',back);window.removeEventListener('online',back);};
  },[]);
  return null;
}
function CalSettings({ open, onOpen, settingsId="kal", togetherEnabled=true }) {
  const { t } = useT();
  const st = useStore();
  const cfg = engine.config(st.calCfg());
  // Existing read-only grants keep working until the person explicitly
  // confirms the write permission needed for primary-calendar edits.
  const settingsReady=tmCalReady(cfg);
  const durable=!!engine.tmCalDurable?.();
  const [stav, setStav] = useState("");      // "" | "jde" | "hotovo" | "chyba"
  const [zprava, setZprava] = useState("");
  const [otevreno, setOtevreno] = useState(false);
  const [navod, setNavod] = useState(false);
  const [nahled, setNahled] = useState(false);
  const [prepared, setPrepared] = useState('');
  const [prepareTry, setPrepareTry] = useState(0);
  React.useEffect(() => {
    if (!open) return;
    let alive=true;
    setPrepared('loading');
    // Resolve the app's public OAuth configuration and preload GIS before a
    // person presses Connect. No authorization popup is opened by this effect.
    tmCalPrepare().catch(error => {if(!engine.config(st.calCfg()).clientId)throw error;}).then(() => {
      if (!engine.config(st.calCfg()).clientId) throw Error('no-client-id');
      return tmCalLoad().then(()=>engine.tmCalPrepareAuth?.(engine.config(st.calCfg())));
    }).then(() => {if(alive)setPrepared('ready');}, () => {if(alive)setPrepared('unavailable');});
    return () => {alive=false;};
  }, [open, cfg.clientId, cfg.zpet, cfg.allDayWrite, prepareTry]);
  const set = (p) => st.setCalCfg(p);
  const pripojeno = !!cfg.calId && !!cfg.clientId && !cfg.calDisconnected;
  const kolik = () => { try { return tmCalDesired(st, cfg).length; } catch { return 0; } };

  const sync = (interactive) => {
    setStav("jde"); setZprava("");
    tmCalSync(st, { interactive: interactive }).then((r) => {
      setStav(r.chyby ? "chyba" : "hotovo");
      const zpet = (r.vlozeno || r.uklizeno)
        ? L(` · z kalendáře ${r.vlozeno || 0}`, ` · from the calendar ${r.vlozeno || 0}`) : "";
      setZprava(r.chyby
        ? L(`Nepovedlo se ${r.chyby} · ${r.prvni || ""}`, `${r.chyby} failed · ${r.prvni || ""}`)
        : r.bezCteni
          ? L("Odesláno, ale čtení hlavního kalendáře Google nepovolil. Zkus to znovu a to políčko zaškrtni.", "Sent, but Google did not grant reading the main calendar. Try again and tick that box.")
          : L(`Přidáno ${r.pridano} · upraveno ${r.zmeneno} · odebráno ${r.smazano}` + zpet, `Added ${r.pridano} · updated ${r.zmeneno} · removed ${r.smazano}` + zpet));
    }, (e) => {
      const m = String((e && (e.reason || e.message)) || "");
      setStav("chyba");
      if (/nonce|prepared|consent-required/.test(m)) setPrepareTry(n=>n+1);
      setZprava(m === "no-client-id" ? L("Propojení Google kalendáře zatím není dostupné.", "Google Calendar connection is not available yet.")
        : m === 'google-loading' ? L('Google se ještě načítá. Za chvíli klepni znovu na připojení.','Google is still loading. Try connecting again in a moment.')
        : /calendar-reconnect-required|calendar-refresh-consent-required/.test(m) ? L('Google potřebuje znovu potvrdit přístup. Klepni na Připojit.','Google needs you to confirm access again. Tap Connect.')
        : /nonce|prepared/.test(m) ? L('Propojení znovu připravuji. Za chvíli klepni na Připojit.','Preparing the connection again. Tap Connect in a moment.')
        : m === 'calendar-target-unavailable' ? L('Původní kalendář v tomto Google účtu není dostupný. Připoj účet, ve kterém byl vytvořený. Uložené události zůstaly zachované.','The original calendar is unavailable in this Google account. Connect the account where it was created. Saved events have been preserved.')
        : m === 'calendar-permission-required' ? L('Google nepovolil vše potřebné. Klepni na připojení a potvrď požadovaný přístup ke kalendáři.','Google did not grant all required permissions. Connect again and confirm the requested calendar access.')
        : /popup|auth|token/i.test(m) ? L("Google nepustil dovnitř. Zkus Připojit znovu.", "Google did not let us in. Try Connect again.")
        : L("Nepovedlo se · " + m, "Failed · " + m));
    });
  };
  const odpojit = (smazat) => {
    tmCalDisconnect(st, smazat).then((v) => {
      setStav("");
      const message=!smazat
        ? L("Odpojeno. Kalendář v Googlu zůstal.", "Disconnected. The calendar stayed in Google.")
        : (v && v.smazano)
          ? L("Kalendář smazán.", "Calendar deleted.")
          : L("Odpojeno, ale smazat kalendář se nepovedlo — v Googlu zůstal. Smaž ho tam ručně.", "Disconnected, but the calendar could not be deleted — it stayed in Google. Remove it there by hand.");
      setZprava(message+(cfg.cycleCalId?L(' Samostatný kalendář cyklu v Googlu zůstal a už se nesynchronizuje.',' The separate cycle calendar stayed in Google and no longer syncs.'):''));
    }, () => {
      setStav('chyba');
      setZprava(L('Odpojení se nepovedlo potvrdit. Zkontroluj připojení k internetu a zkus to znovu.','Could not confirm disconnection. Check your internet connection and try again.'));
    });
  };
  const stavText = () => {
    if (stav === "jde") return L("Synchronizuji…", "Syncing…");
    if (!pripojeno) return L("Nepřipojeno", "Not connected");
    if (prepared==='loading') return L("Ověřuji propojení…", "Checking connection…");
    if (!settingsReady) return L("Propojení čeká na potvrzení", "Connection needs confirmation");
    if (cfg.lastErr) return L("Synchronizace není dokončená", "Sync is incomplete");
    if (!cfg.lastSync) return L("Připojeno · zatím neodesláno", "Connected · nothing sent yet");
    const d = new Date(cfg.lastSync);
    return L("Automaticky propojeno · naposledy ", "Automatically connected · last sync ") + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  };
  const stavBarva = stav === "jde" ? t.sand : (!pripojeno ? t.textMuted : cfg.lastErr || !settingsReady ? t.accent : t.sage);
  const radek = { fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.6, color: t.textMuted, margin: "0 8px 8px" };

  return (
    <div data-calendar-controls=""><SetSection title={L("Kalendář", "Calendar")} id={settingsId} open={open} onOpen={onOpen}>
      <PersonalSettingsSections t={t} lang={getLang()} section="calendar" togetherEnabled={togetherEnabled}/>
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", padding: "2px 8px 10px" }}>
        <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: stavBarva, animation: stav === "jde" ? "tmPulse 1.1s ease-in-out infinite" : "none" }} />
        <span style={{ flex: 1, minWidth: 0, fontFamily: FONT_BODY, fontSize: 13, color: t.text }}>{stavText()}</span>
      </div>
      <div style={{padding:'0 8px 10px'}}>
        <button onClick={() => sync(!settingsReady)} disabled={stav==='jde' || prepared!=='ready' || !cfg.clientId}
          style={{background:t.accent,color:t.onAccent,border:'none',borderRadius:999,padding:'10px 18px',minHeight:44,fontFamily:FONT_BODY,fontSize:14,cursor:stav==='jde'||prepared!=='ready'?'default':'pointer',opacity:stav==='jde'||prepared!=='ready'?0.6:1}}>
          {stav==='jde'?L('Synchronizuji…','Syncing…'):pripojeno?settingsReady?L('Synchronizovat','Sync'):L('Obnovit propojení','Renew connection'):L('Připojit Google kalendář','Connect Google Calendar')}
        </button>
        {prepared==='loading' && <p role="status" style={{...radek,margin:'8px 0 0'}}>{L('Připravuji propojení…','Preparing connection…')}</p>}
        {prepared==='unavailable' && <p style={{...radek,margin:'8px 0 0'}}>{L('Propojení teď není dostupné.','The connection is currently unavailable.')} <button onClick={()=>setPrepareTry(n=>n+1)} style={{background:'transparent',border:'none',padding:'6px 0',color:t.accentInk||t.accent,cursor:'pointer',fontFamily:FONT_BODY}}>{L('Zkusit znovu','Try again')}</button></p>}
      </div>
      {zprava && <p style={{ ...radek, color: stav === "chyba" ? t.accent : t.sage }}>{zprava}</p>}
      {/* Failed renewal or a new scope waits for an explicit connection. */}
      {pripojeno && stav !== "jde" && !settingsReady && tmCalTichoZakazano() && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "0 8px 10px" }}>
          <span style={{ flex: 1, minWidth: 0, flexBasis: 190, fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.6, color: t.textMuted }}>
            {L('Google potřebuje tvoje potvrzení. Změny zůstanou uložené a po propojení se synchronizace obnoví.','Google needs your confirmation. Your changes stay saved and synchronization resumes after connecting.')}
          </span>
        </div>
      )}
      <p style={radek}>{durable ? L('Po prvním propojení se přístup obnovuje automaticky. Změny se přenesou během používání aplikace a při návratu do ní. Pokud přístup v Googlu odebereš, aplikace si vyžádá nové potvrzení.','After connecting, access renews automatically. Changes sync while you use the app and when you return. If you revoke access in Google, the app will ask you to connect again.') : L('Přihlášení přes Google samo nepovoluje kalendář. Při propojení jednou potvrdíš přístup. Změny se potom přenášejí během používání aplikace a při návratu do ní.','Signing in with Google does not grant calendar access. Confirm access when connecting. Changes then sync while you use the app and when you return to it.')}</p>

      {!pripojeno && (
        <>
          <p style={radek}>
            {L("Aplikace si v tvém Googlu založí ", "The app will create a calendar in your Google account called ")}
            <span style={{ color: t.inkSand || t.sand }}>{L("vlastní kalendář „", "“")}{cfg.calName || "tanmay"}{L("“", "”")}</span>
            {L(" pro tvůj plán dne. Po potvrzení čtení se v plánu zobrazí i události z tvého hlavního Google kalendáře.",
               " for your day plan. When you approve reading access, events from your primary Google calendar also appear in the plan.")}
          </p>
          <p style={radek}>
            {client ? L("Samostatné celodenní události a vlastní bloky rozvrhu se propojují oběma směry. V Googlu můžeš přesunout také datum budoucího, ještě nezačatého tréninku. Jeho obsah a výsledky zůstávají v aplikaci. Změny se načtou při návratu a během používání přibližně každou minutu, dokud platí přístup ke Googlu.", "Standalone all-day events and your schedule blocks sync both ways. You can also move the date of a future training session that has not started. Its content and results stay in the app. Changes are read when you return and approximately every minute while the app is in use and Google authorization is valid.") : L("Samostatné celodenní události a vlastní bloky rozvrhu se propojují oběma směry. Souhrny tréninků, motiv dne a klientská sezení upravuj v aplikaci. Změny z Googlu se načtou při návratu do aplikace a během používání přibližně každou minutu, dokud platí přihlášení ke Googlu.",
               "Standalone all-day events and your schedule blocks sync both ways. Edit training summaries, the daily motif and client sessions in the app. Google changes are read when you return and approximately every minute while the app is in use and Google authorization is valid.")}
          </p>
          <p style={radek}>{L("Zpátky to jde kdykoli: v Googlu stačí odškrtnout ten jeden kalendář a všechno zmizí z pohledu. Odpojením se zastaví přenos změn, události v Googlu zůstanou.", "Undo any time: unticking that one calendar in Google hides all of it. Disconnecting stops synchronization and keeps your Google events.")}</p>
        </>
      )}

      <button onClick={() => setNahled((x) => !x)} className="tm-nav-item" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "9px 8px", minHeight: 44, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 13 }}>
        <span style={{ transition: "transform .18s ease", transform: nahled ? "rotate(90deg)" : "none", color: t.sage, display: "inline-flex" }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
        {L('Náhled rozvrhu a dalších událostí','Preview schedule and other events')}
        <span style={{ marginLeft: "auto", fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.1em", color: t.textMuted }}>{kolik()}</span>
      </button>
      {nahled && <><CalPreview /><p style={radek}>{client?L('Cyklus a termíny z tréninkového plánu se propojují samostatně a v tomto náhledu nejsou.','Cycle dates and training plan dates sync separately and are not included in this preview.'):L('Cyklus se propojuje samostatně a v tomto náhledu není.','Cycle dates sync separately and are not included in this preview.')}</p></>}

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      {CAL_KINDS.filter(k=>k.k!=='cycle').map((k) => (
        <SetSwitch key={k.k} label={L(k.cz, k.en)} hint={L(k.cz2, k.en2)} on={!!cfg[k.k]} onChange={(v) => set({ [k.k]: v })} />
      ))}
      {togetherEnabled && <SetSwitch label={L('Můj menstruační cyklus','My menstrual cycle')}
        hint={L('Volitelné propojení vlastního cyklu. Do Googlu se přenesou jen data menstruace a označené odhady, bez příznaků a poznámek. Zkontroluj, komu svůj Google kalendář sdílíš.','Optional connection for your own cycle. Only period dates and labelled estimates go to Google, without symptoms or notes. Check who can see your Google calendar.')}
        on={!!cfg.cycle} onChange={value=>set({cycle:value})} />}

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      <SetChoice label={L("Číst zpět do rozvrhu", "Read back into the schedule")} value={cfg.zpet || ""}
        options={[{ v: "", label: L("ne", "no") }, { v: "tanmay", label: L("z aplikace", "from the app") }, { v: "vse", label: L("i z hlavního", "and the main one") }]}
        onChange={(v) => { set({ zpet: v }); if (v === "vse" && cfg.zpet !== "vse" && !tmCalReady({...cfg,zpet:v})) {tmCalTichoZapis(false);setZprava(L("Klepni na Obnovit propojení a potvrď přístup k hlavnímu kalendáři.", "Tap Renew connection and confirm access to your primary calendar."));} }} />
      <p style={radek}>
        {cfg.zpet === "vse"
          ? L("Tvůj hlavní Google kalendář se načítá do plánu dne včetně přesných časů. Nové bloky z aplikace se odesílají do kalendáře „tanmay“. Záznamy z hlavního kalendáře upravuj přímo v Googlu.",
              "Your primary Google calendar appears in the day plan with exact times. New app blocks are sent to the “tanmay” calendar. Edit primary-calendar events in Google.")
          : cfg.zpet === "tanmay"
            ? L("Co zapíšeš přímo do kalendáře aplikace, se objeví v rozvrhu dne. Bez dalšího oprávnění — na svůj vlastní kalendář aplikace vidí.",
                "What you write straight into the tanmay calendar shows up in the day schedule. No extra permission — the app can see its own calendar.")
            : L("Celodenní události v kalendáři aplikace se propisují oběma směry. Další časové události se načtou po zapnutí čtení zpět.", "All-day events in the tanmay calendar sync both ways. Enable read-back to import other timed events.")}
      </p>
      {!!cfg.zpet && <p style={radek}>{L("Události z Googlu se zobrazí v přesný čas vedle tvého plánu. Překrývající se události i noční časy zůstanou vidět. Celodenní události mají vlastní místo.", "Google events appear at their exact time alongside your plan. Overlapping events and overnight times remain visible. All-day events have their own place.")}</p>}

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      <SetChoice label={L("Jak daleko dopředu", "How far ahead")} value={String(cfg.horizon)}
        options={[{ v: "7", label: L("týden", "a week") }, { v: "14", label: L("dva týdny", "two weeks") }, { v: "30", label: L("měsíc", "a month") }]}
        onChange={(v) => set({ horizon: +v })} />
      <p style={radek}>{L('Tato volba platí pro plánované události. Pokud zapneš vlastní cyklus, přenesou se i zapsaná data menstruace z minulosti.','This applies to planned events. If you enable your own cycle, recorded period dates from the past are included too.')}</p>
      <SetChoice label={L("Ukázat jako obsazené", "Show as busy")} value={cfg.busy}
        options={[...(!client ? [{ v: "klienti", label: L("jen sezení", "sessions only") }] : []), { v: "vse", label: L("vše", "everything") }, { v: "nic", label: L("nic", "nothing") }]}
        onChange={(v) => set({ busy: v })} />
      <SetChoice label={L("Názvy událostí", "Event titles")} value={cfg.titles}
        options={[{ v: "plne", label: L("plné", "full") }, { v: "obecne", label: L("obecné", "generic") }]}
        onChange={(v) => set({ titles: v })} />
      <p style={radek}>{client ? L("Obecné názvy skryjí vlastní text bloku za název „Praxe“.", "Generic titles replace your schedule text with “Practice”.") : L("Obecné názvy jsou pro sdílený kalendář: místo jména klienta jen „Sezení“.", "Generic titles are for a shared calendar: just “Session” instead of the client's name.")}</p>

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      {!client && <button onClick={() => setOtevreno((x) => !x)} className="tm-nav-item" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "9px 8px", minHeight: 44, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 13 }}>
        <span style={{ transition: "transform .18s ease", transform: otevreno ? "rotate(90deg)" : "none", color: t.sage, display: "inline-flex" }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
        {L("Pokročilé nastavení připojení", "Advanced connection settings")}
      </button>}
      {!client && otevreno && (
        <div style={{ padding: "0 8px 6px" }}>
          <label style={{ display: "block", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12, color: t.sage, margin: "4px 0 5px" }}>{L("ID klienta OAuth", "OAuth client ID")}</label>
          <input value={cfg.clientId} onChange={(e) => set({ clientId: e.target.value.trim() })} placeholder="…apps.googleusercontent.com" spellCheck={false} autoCapitalize="off" autoCorrect="off"
            style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: FONT_BODY, fontSize: 12, padding: "9px 11px", outline: "none", minHeight: 42 }} />
          <button onClick={() => setNavod((x) => !x)} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.accentInk || t.accent, fontFamily: FONT_BODY, fontSize: 12, padding: "8px 0 4px", minHeight: 36, textAlign: "left" }}>{navod ? L("Skrýt informace", "Hide information") : L("Pro správce aplikace", "For the app administrator")}</button>
          {navod && (<>
            <p style={{...radek,margin:'4px 0 10px'}}>{L('Běžné propojení používá nastavení aplikace. Vlastní ID je určené pro správce: projekt v Google Cloud musí mít povolené Calendar API, potřebná oprávnění a tuto adresu mezi Authorized JavaScript origins.','The standard connection uses the app configuration. A custom ID is for administrators: the Google Cloud project must enable Calendar API, the required permissions, and this address in Authorized JavaScript origins.')}</p>
            {/* ADRESA K ZKOPÍROVÁNÍ. „Origin mismatch" je zdaleka nejčastější
                chyba při zapojování a vzniká z přepsané adresy: lomítko navíc,
                chybějící port, http místo https. Tady se nepřepisuje. */}
            <div style={{ border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: "9px 12px", margin: "0 0 10px", background: t.callout }}>
              <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12, color: t.sage, marginBottom: 4 }}>{L("Tvoje adresa · vlož ji do Authorized JavaScript origins", "Your origin · paste into Authorized JavaScript origins")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ flex: 1, minWidth: 0, fontFamily: FONT_TAG, fontSize: 12, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tmOrigin()}</code>
                <button onClick={() => { try { navigator.clipboard.writeText(tmOrigin()); setZprava(L("Adresa zkopírována.", "Origin copied.")); setStav(""); } catch {} }}
                  style={{ flexShrink: 0, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "4px 12px", minHeight: 32, cursor: "pointer", color: t.textSec, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12 }}>{L("Kopírovat", "Copy")}</button>
              </div>
              <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 6, lineHeight: 1.5 }}>{L("Přesně takhle, bez lomítka na konci. Změna se může projevit až za pár hodin.", "Exactly like this, no trailing slash. A change can take a few hours to take effect.")}</div>
            </div>
          </>)}
        </div>
      )}
          {pripojeno && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <button onClick={() => st.ask(L("Odpojit a kalendář v Googlu nechat být?", "Disconnect and leave the calendar in Google?"), () => odpojit(false), { yes: L("Odpojit", "Disconnect") })}
                style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "8px 16px", minHeight: 40, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Odpojit", "Disconnect")}</button>
              {!durable && <button onClick={() => st.ask(L("Smazat celý kalendář „" + (cfg.calName || "tanmay") + "“ v Googlu? V aplikaci zůstane všechno, zmizí jen ta kopie v kalendáři.", "Delete the whole “" + (cfg.calName || "tanmay") + "” calendar in Google? Everything stays in the app — only the calendar copy goes.")+(cfg.cycleCalId?L(' Samostatný kalendář cyklu se nesmaže a už se nebude synchronizovat.',' The separate cycle calendar will remain and stop syncing.'):''), () => odpojit(true), { yes: L("Smazat", "Delete") })}
                style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "8px 16px", minHeight: 40, cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{L('Odpojit a smazat kalendář aplikace','Disconnect and delete the app calendar')}</button>}
            </div>
          )}

      <button onClick={() => klDownload("tanmay-kalendar.ics", tmCalIcs(st))} className="tm-nav-item"
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "10px 8px", minHeight: 44, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 13 }}>
        <span style={{ color: t.sage }}><FamilyIcon id="download" size={16} label={L("Dolů","Down")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>{L("Stáhnout jako .ics", "Download as .ics")}
      </button>
      <p style={{ ...radek, marginTop: -2 }}>{L("Bez Googlu a bez přihlašování. Naimportuje se do jakéhokoli kalendáře — ale je to snímek, ne spojení: po změně je potřeba stáhnout znovu.", "No Google, no sign-in. Imports into any calendar — but it is a snapshot, not a link: after a change you download it again.")}</p>
    </SetSection></div>
  );
}
/* UKÁZKA · skutečné události z nejbližších dnů, vysázené tak, jak budou
   vypadat. Konkrétní řádky s vlastními názvy jde posoudit; „spravovat
   kalendáře" ne. */
function CalPreview() {
  const { t } = useT();
  const st = useStore();
  const cfg = engine.config(st.calCfg());
  let evs = [];
  try { evs = tmCalDesired(st, cfg); } catch { evs = []; }
  evs = evs.sort((a, b) => (a.date + (a.time || "00:00")).localeCompare(b.date + (b.time || "00:00"))).slice(0, 10);
  const barva = (k) => (k === "klienti" ? t.accent : k === "trenink" ? t.sand : k === "rozvrh" ? t.sage : t.textMuted);
  if (!evs.length) return (
    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, margin: "0 8px 10px", lineHeight: 1.6 }}>
      {L("Zatím není co poslat. Zapni aspoň jednu věc níž — a musí být v nejbližších dnech něco naplánovaného.", "Nothing to send yet. Switch on at least one thing below — and there has to be something scheduled in the coming days.")}
    </p>
  );
  let last = "";
  return (
    <div style={{ margin: "0 8px 10px", border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: "4px 12px 10px", background: t.callout }}>
      {evs.map((e) => {
        const novy = e.date !== last; last = e.date;
        return (
          <div key={e.key}>
            {novy && <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12, color: t.sage, margin: "10px 0 3px" }}>{fmtCZ(e.date)}</div>}
            <div style={{ display: "flex", alignItems: "baseline", gap: 9, padding: "3px 0" }}>
              <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: barva(e.kind), transform: "translateY(-2px)" }} />
              <span style={{ fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.04em", color: t.textMuted, width: 44, flexShrink: 0 }}>{e.allDay || !e.time ? L("celý den", "all day") : e.time}</span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: FONT_BODY, fontSize: 13, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


return {CalAuto,CalSettings};
}
