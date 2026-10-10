import React, {useState} from "react";
import {TmIcon as FamilyIcon} from "./icons.jsx";
import {FONT_BODY,FONT_TAG} from "./type.js";

export function createCalendarUI({useT,useStore,L,getLang,fmtCZ,engine,SetSection,SetSwitch,SetChoice,PersonalSettingsSections}) {
const {CAL_KINDS,tmCalDesired,tmCalBody,tmCalHash,tmCalTz,tmCalLive,tmCalAvailable,tmCalAuth,tmCalScopeFor,tmCalMaCteni,tmCalSync,tmCalDisconnect,tmCalIcs,tmCalTichoZakazano,tmCalTichoZapis,tmOrigin} = engine;
const client = engine.role === "client";
const klDownload = (name, text) => {
  const url=URL.createObjectURL(new Blob([text],{type:"text/calendar;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
};
function CalAuto() {
  const st = useStore();
  /* Odkaz na store se drží v ref a efekt nemá závislosti. Kdyby v nich `st`
     stálo, efekt by se přepínal při každém překreslení — a protože store je
     pokaždé nový objekt, znamenalo by to interval, který se ruší dřív, než
     stihne tiknout. Ref navíc zaručí, že se pracuje s aktuálním stavem,
     ne se snímkem z chvíle, kdy se efekt zakládal. */
  const ref = React.useRef(st);
  ref.current = st;
  const sig = React.useRef(null);
  const dohnat = React.useRef(true); // po naostření se jednou dožene, co uteklo
  const bezi = React.useRef(false);
  React.useEffect(() => {
    const tick = () => {
      if (bezi.current) return;
      try {
        const s0 = ref.current;
        const cfg = s0.calCfg();
        if (!cfg.clientId || !cfg.calId || !tmCalLive() || !tmCalAvailable()) return;
        const tz = tmCalTz();
        const s2 = tmCalDesired(s0, cfg).map((e) => e.key + "~" + tmCalHash(tmCalBody(e, tz))).sort().join("|") + "|allDay:" + JSON.stringify((s0.coll.calendarAllDay || []).map(r=>[r.id,r.rev,r.deleted]));
        if (!dohnat.current && s2 === sig.current) return;
        sig.current = s2;
        dohnat.current = false;
        bezi.current = true;
        tmCalSync(s0, { interactive: false }).then(() => { bezi.current = false; }, () => { bezi.current = false; });
      } catch (e) { bezi.current = false; }
    };
    /* Čtení má vlastní, pomalejší tep. Odchozí synchronizace se spouští ze
       změny v aplikaci — jenže když se událost změní v Googlu, žádná změna
       v aplikaci nenastane a nic by se nespustilo. Minuta je kompromis: dost
       často na to, aby se to stihlo všimnout, a šedesátkrát méně dotazů, než
       kdyby se ptalo v jednom tepu s odesíláním. */
    const cti = () => {
      if (bezi.current) return;
      try {
        const s0 = ref.current;
        const cfg = s0.calCfg();
        if (!cfg.clientId || !cfg.calId || !tmCalLive() || !tmCalAvailable()) return;
        if (cfg.zpet === "vse" && !tmCalMaCteni()) return;
        bezi.current = true;
        tmCalSync(s0, {interactive:false}).then(() => { bezi.current = false; }, () => { bezi.current = false; });
      } catch (e) { bezi.current = false; }
    };
    const idR = setInterval(cti, 60000);
    const initialRead = setTimeout(cti, 6000);
    /* A hlavně: při návratu do aplikace. Tohle je ta chvíle, kdy se člověk
       dívá — a kdy je změna z kalendáře nejužitečnější. Levnější a rychlejší
       než častější ptaní naslepo. */
    const zpatky = () => { if (!document.hidden) cti(); };
    document.addEventListener("visibilitychange", zpatky);
    window.addEventListener("focus", zpatky);
    const id = setInterval(tick, 4000);
    /* NAOSTŘENÍ TOKENU PŘI PRVNÍM DOTEKU. Token platí hodinu a po otevření
       aplikace žádný není. Říct si o něj po načtení nejde: okno bez
       uživatelského gesta prohlížeč zavře jako vyskakovací. Ale krátce po
       každém kliknutí gesto „platí" (Chrome tomu říká přechodná aktivace),
       takže se o něj řekne při prvním doteku kdekoli v aplikaci — tiše,
       bez ptaní, protože souhlas už jednou padl.

       O PŘIHLÁŠENÍ ALE ROZHODUJE ČLOVĚK. Když tiché vydání neprojde (Google
       místo něj ukáže přihlašovací okno), pokus se NEOPAKUJE — ani při
       dalším kliknutí, ani při příštím otevření (`tmCalTicho` = „0").
       Kalendář pak prostě čeká a přihlásí se, až člověk sám stiskne
       Odeslat v Nastavení → Kalendář. Dřív se to zkoušelo znovu při každém
       prvním doteku a na počítači, kde tiché vydání neprocházelo, vyskakovalo
       přihlášení do Googlu pořád dokola. */
    let naostreno = false;
    const dotek = () => {
      if (naostreno) return;
      try {
        const cfg = ref.current.calCfg();
        if (!cfg.clientId || !cfg.calId || tmCalLive() || !tmCalAvailable()) return;
        if (tmCalTichoZakazano()) { naostreno = true; return; }
        naostreno = true;
        tmCalAuth(cfg.clientId, false, tmCalScopeFor(cfg)).then(() => { dohnat.current = true; }, () => { tmCalTichoZapis(false); });
      } catch (e) {}
    };
    document.addEventListener("pointerdown", dotek, true);
    return () => {
      clearInterval(id); clearInterval(idR); clearTimeout(initialRead);
      document.removeEventListener("pointerdown", dotek, true);
      document.removeEventListener("visibilitychange", zpatky);
      window.removeEventListener("focus", zpatky);
    };
  }, []);
  return null;
}
function CalSettings({ open, onOpen, settingsId="kal", togetherEnabled=true }) {
  const { t } = useT();
  const st = useStore();
  const cfg = engine.config(st.calCfg());
  const [stav, setStav] = useState("");      // "" | "jde" | "hotovo" | "chyba"
  const [zprava, setZprava] = useState("");
  const [otevreno, setOtevreno] = useState(false);
  const [navod, setNavod] = useState(false);
  const [nahled, setNahled] = useState(false);
  const set = (p) => st.setCalCfg(p);
  const pripojeno = !!cfg.calId && !!cfg.clientId;
  const kolik = () => { try { return tmCalDesired(st, cfg).length; } catch (e) { return 0; } };

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
      setZprava(m === "no-client-id" ? L("Chybí ID klienta.", "Client ID is missing.")
        : /popup|auth|token/i.test(m) ? L("Google nepustil dovnitř. Zkus Připojit znovu.", "Google did not let us in. Try Connect again.")
        : L("Nepovedlo se · " + m, "Failed · " + m));
    });
  };
  const odpojit = (smazat) => {
    tmCalDisconnect(st, smazat).then((v) => {
      setStav("");
      setZprava(!smazat
        ? L("Odpojeno. Kalendář v Googlu zůstal.", "Disconnected. The calendar stayed in Google.")
        : (v && v.smazano)
          ? L("Kalendář smazán.", "Calendar deleted.")
          : L("Odpojeno, ale smazat kalendář se nepovedlo — v Googlu zůstal. Smaž ho tam ručně.", "Disconnected, but the calendar could not be deleted — it stayed in Google. Remove it there by hand."));
    });
  };
  const stavText = () => {
    if (stav === "jde") return L("Synchronizuji…", "Syncing…");
    if (!pripojeno) return L("Nepřipojeno", "Not connected");
    if (!tmCalLive()) return L("Připojeno · obnov přihlášení ke Googlu", "Connected · renew Google authorization");
    if (cfg.lastErr) return L("Synchronizace není dokončená", "Sync is incomplete");
    if (!cfg.lastSync) return L("Připojeno · zatím neodesláno", "Connected · nothing sent yet");
    const d = new Date(cfg.lastSync);
    return L("Připojeno · naposledy ", "Connected · last sent ") + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  };
  const stavBarva = stav === "jde" ? t.sand : (!pripojeno ? t.textMuted : cfg.lastErr ? t.accent : t.sage);
  const radek = { fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.6, color: t.textMuted, margin: "0 8px 8px" };

  return (
    <SetSection title={L("Kalendář", "Calendar")} id={settingsId} open={open} onOpen={onOpen}>
      <PersonalSettingsSections t={t} lang={getLang()} section="calendar" togetherEnabled={togetherEnabled}/>
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", padding: "2px 8px 10px" }}>
        <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: stavBarva, animation: stav === "jde" ? "tmPulse 1.1s ease-in-out infinite" : "none" }} />
        <span style={{ flex: 1, minWidth: 0, fontFamily: FONT_BODY, fontSize: 13, color: t.text }}>{stavText()}</span>
        {pripojeno && <button onClick={() => sync(false)} disabled={stav === "jde"} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "5px 14px", minHeight: 44, cursor: "pointer", color: t.textSec, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12 }}>{L("Synchronizovat", "Sync")}</button>}
      </div>
      {zprava && <p style={{ ...radek, color: stav === "chyba" ? t.accent : t.sage }}>{zprava}</p>}
      {/* SAMO SE NEPŘIHLAŠUJE. Když Google posledně místo tichého vydání
          tokenu ukázal přihlašovací okno, aplikace se přestala ptát sama
          (viz `tmCalTicho`). Tady je jediné místo, kde se rozhodne člověk. */}
      {pripojeno && stav !== "jde" && !tmCalLive() && tmCalTichoZakazano() && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "0 8px 10px" }}>
          <span style={{ flex: 1, minWidth: 0, flexBasis: 190, fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.6, color: t.textMuted }}>
            {L("Google chtěl posledně potvrzení, tak se aplikace už nepřihlašuje sama a nic na tebe nevyskakuje. Kalendář počká, dokud se nepřihlásíš tady.",
               "Google asked for confirmation last time, so the app no longer signs in on its own and nothing pops up at you. The calendar waits until you sign in here.")}
          </span>
          <button onClick={() => sync(true)} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 999, padding: "6px 14px", minHeight: 44, cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12 }}>{L("Přihlásit a odeslat", "Sign in and send")}</button>
        </div>
      )}

      {!pripojeno && (
        <>
          <p style={radek}>
            {L("Aplikace si v tvém Googlu založí ", "The app will create a calendar in your Google account called ")}
            <span style={{ color: t.inkSand || t.sand }}>{L("vlastní kalendář „", "“")}{cfg.calName || "tanmay"}{L("“", "”")}</span>
            {L(" a propojí ho s tím, co si níž zapneš. Hlavní kalendář připojí jen s tvým samostatným souhlasem.",
               " and link it to the items you enable below. Your primary calendar is included only with your separate consent.")}
          </p>
          <p style={radek}>
            {client ? L("Samostatné celodenní události a vlastní bloky rozvrhu se propojují oběma směry. Změny z Googlu se načtou při návratu do aplikace a během používání přibližně každou minutu, dokud platí přihlášení ke Googlu.", "Standalone all-day events and your schedule blocks sync both ways. Google changes are read when you return and approximately every minute while the app is in use and Google authorization is valid.") : L("Samostatné celodenní události a vlastní bloky rozvrhu se propojují oběma směry. Souhrny tréninků, motiv dne a klientská sezení upravuj v aplikaci. Změny z Googlu se načtou při návratu do aplikace a během používání přibližně každou minutu, dokud platí přihlášení ke Googlu.",
               "Standalone all-day events and your schedule blocks sync both ways. Edit training summaries, the daily motif and client sessions in the app. Google changes are read when you return and approximately every minute while the app is in use and Google authorization is valid.")}
          </p>
          <p style={radek}>{L("Zpátky to jde kdykoli: v Googlu stačí odškrtnout ten jeden kalendář a všechno zmizí z pohledu. Odpojením tady se navíc dá celý smazat.", "Undo any time: unticking that one calendar in Google hides all of it. Disconnecting here can delete it outright.")}</p>
        </>
      )}

      <button onClick={() => setNahled((x) => !x)} className="tm-nav-item" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "9px 8px", minHeight: 44, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 13 }}>
        <span style={{ transition: "transform .18s ease", transform: nahled ? "rotate(90deg)" : "none", color: t.sage, display: "inline-flex" }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
        {L("Ukázat, co se odešle", "Show what would be sent")}
        <span style={{ marginLeft: "auto", fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.1em", color: t.textMuted }}>{kolik()}</span>
      </button>
      {nahled && <CalPreview />}

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      {CAL_KINDS.map((k) => (
        <SetSwitch key={k.k} label={L(k.cz, k.en)} hint={L(k.cz2, k.en2)} on={!!cfg[k.k]} onChange={(v) => set({ [k.k]: v })} />
      ))}

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      <SetChoice label={L("Číst zpět do rozvrhu", "Read back into the schedule")} value={cfg.zpet || ""}
        options={[{ v: "", label: L("ne", "no") }, { v: "tanmay", label: L("z aplikace", "from the app") }, { v: "vse", label: L("i z hlavního", "and the main one") }]}
        onChange={(v) => { set({ zpet: v }); if (v === "vse") setZprava(L("Klepni na Synchronizovat. Google se zeptá na nové oprávnění.", "Tap Sync. Google will ask for the new permission.")); }} />
      <p style={radek}>
        {cfg.zpet === "vse"
          ? L("Celodenní události se propisují oběma směry. Google při připojení požádá o čtení a úpravy událostí; aplikace upravuje jen ty, které zde změníš. Časové události se do rozvrhu načítají ke čtení.",
              "All-day events sync both ways. Google will ask to read and edit events; the app edits only those you change here. Timed events are imported read-only.")
          : cfg.zpet === "tanmay"
            ? L("Co zapíšeš přímo do kalendáře aplikace, se objeví v rozvrhu dne. Bez dalšího oprávnění — na svůj vlastní kalendář aplikace vidí.",
                "What you write straight into the tanmay calendar shows up in the day schedule. No extra permission — the app can see its own calendar.")
            : L("Celodenní události v kalendáři aplikace se propisují oběma směry. Další časové události se načtou po zapnutí čtení zpět.", "All-day events in the tanmay calendar sync both ways. Enable read-back to import other timed events.")}
      </p>
      {!!cfg.zpet && <p style={radek}>{L("Řádek s tvým vlastním textem se nikdy nepřepíše. Zapisuje se jen do prázdných. Události mimo 6:00–23:00 a celodenní se do hodinového rozvrhu nevejdou, takže se neberou.", "A row you wrote in yourself is never overwritten. Only empty rows get filled. Events outside 6:00–23:00 and all-day ones do not fit an hourly schedule, so they are skipped.")}</p>}

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      <SetChoice label={L("Jak daleko dopředu", "How far ahead")} value={String(cfg.horizon)}
        options={[{ v: "7", label: L("týden", "a week") }, { v: "14", label: L("dva týdny", "two weeks") }, { v: "30", label: L("měsíc", "a month") }]}
        onChange={(v) => set({ horizon: +v })} />
      <p style={radek}>{L("Minulost se neposílá nikdy. Kalendář není deník a hotová věc už nikomu čas nezabírá.", "The past is never sent. A calendar is not a log, and a finished thing takes no one's time.")}</p>
      <SetChoice label={L("Ukázat jako obsazené", "Show as busy")} value={cfg.busy}
        options={[...(!client ? [{ v: "klienti", label: L("jen sezení", "sessions only") }] : []), { v: "vse", label: L("vše", "everything") }, { v: "nic", label: L("nic", "nothing") }]}
        onChange={(v) => set({ busy: v })} />
      <SetChoice label={L("Názvy událostí", "Event titles")} value={cfg.titles}
        options={[{ v: "plne", label: L("plné", "full") }, { v: "obecne", label: L("obecné", "generic") }]}
        onChange={(v) => set({ titles: v })} />
      <p style={radek}>{client ? L("Obecné názvy skryjí vlastní text bloku za název „Praxe“.", "Generic titles replace your schedule text with “Practice”.") : L("Obecné názvy jsou pro sdílený kalendář: místo jména klienta jen „Sezení“.", "Generic titles are for a shared calendar: just “Session” instead of the client's name.")}</p>

      <div style={{ height: 1, background: t.borderSoft, margin: "8px 8px" }} />

      <button onClick={() => setOtevreno((x) => !x)} className="tm-nav-item" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "9px 8px", minHeight: 44, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 13 }}>
        <span style={{ transition: "transform .18s ease", transform: otevreno ? "rotate(90deg)" : "none", color: t.sage, display: "inline-flex" }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
        {L("Připojení ke Googlu", "Google connection")}
      </button>
      {otevreno && (
        <div style={{ padding: "0 8px 6px" }}>
          <label style={{ display: "block", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12, color: t.sage, margin: "4px 0 5px" }}>{L("ID klienta OAuth", "OAuth client ID")}</label>
          <input value={cfg.clientId} onChange={(e) => set({ clientId: e.target.value.trim() })} placeholder="…apps.googleusercontent.com" spellCheck={false} autoCapitalize="off" autoCorrect="off"
            style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: FONT_BODY, fontSize: 12, padding: "9px 11px", outline: "none", minHeight: 42 }} />
          <button onClick={() => setNavod((x) => !x)} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.accentInk || t.accent, fontFamily: FONT_BODY, fontSize: 12, padding: "8px 0 4px", minHeight: 36, textAlign: "left" }}>{navod ? L("Skrýt návod", "Hide the steps") : L("Kde ho vzít · pět kroků", "Where to get one · five steps")}</button>
          {navod && (<>
            <ol style={{ margin: "2px 0 10px", paddingLeft: 18, fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.8, color: t.textMuted }}>
              <li>{L("Na console.cloud.google.com/projectcreate založ projekt. Stačí název.", "At console.cloud.google.com/projectcreate create a project. A name is enough.")}</li>
              <li>{L("V APIs & Services → Library najdi Google Calendar API a dej Enable. Platit se nic nemusí.", "In APIs & Services → Library find Google Calendar API and hit Enable. Nothing to pay.")}</li>
              <li>{L("Google Auth Platform → Branding → Get started. Vyplň název aplikace a e-mail, u Audience zvol External, potvrď.", "Google Auth Platform → Branding → Get started. Fill in the app name and e-mail, pick External under Audience, confirm.")}</li>
              <li>{L("Google Auth Platform → Audience → Publish app. Nenechávej to v Testing — tam Google souhlas po sedmi dnech ruší a každý týden jej potřebuješ potvrdit znovu.", "Google Auth Platform → Audience → Publish app. Do not leave it in Testing — there Google expires the grant after seven days and you would have to consent again every week.")}</li>
              <li>{L("Google Auth Platform → Data Access → Add or remove scopes. Do políčka vlož calendar.app.created, zaškrtni a ulož. Bez toho to sice funguje, ale Google při každém přihlášení ukáže varovnou obrazovku.", "Google Auth Platform → Data Access → Add or remove scopes. Paste calendar.app.created into the box, tick it and save. Without this it still works, but Google shows a warning screen at every sign-in.")}</li>
              <li>{L("Google Auth Platform → Clients → Create client → Web application. Do Authorized JavaScript origins vlož adresu níž. Redirect URIs nech PRÁZDNÉ — tenhle způsob přihlášení je nepoužívá.", "Google Auth Platform → Clients → Create client → Web application. Put the address below into Authorized JavaScript origins. Leave Redirect URIs EMPTY — this sign-in method does not use them.")}</li>
              <li>{L("Vzniklé ID vlož sem a dej Připojit. Google jednou ukáže obrazovku, že aplikaci neověřil — je to tím, že je tvoje a neprošla revizí. Rozklikni Advanced a pokračuj; je tam název projektu, ne aplikace.", "Paste the resulting ID here and hit Connect. Google will show a screen saying the app is unverified — that is because it is yours and has not been reviewed. Open Advanced and continue; it shows the project name, not the app name.")}</li>
            </ol>
            {/* ADRESA K ZKOPÍROVÁNÍ. „Origin mismatch" je zdaleka nejčastější
                chyba při zapojování a vzniká z přepsané adresy: lomítko navíc,
                chybějící port, http místo https. Tady se nepřepisuje. */}
            <div style={{ border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: "9px 12px", margin: "0 0 10px", background: t.callout }}>
              <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12, color: t.sage, marginBottom: 4 }}>{L("Tvoje adresa · vlož ji do Authorized JavaScript origins", "Your origin · paste into Authorized JavaScript origins")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ flex: 1, minWidth: 0, fontFamily: FONT_TAG, fontSize: 12, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tmOrigin()}</code>
                <button onClick={() => { try { navigator.clipboard.writeText(tmOrigin()); setZprava(L("Adresa zkopírována.", "Origin copied.")); setStav(""); } catch (e) {} }}
                  style={{ flexShrink: 0, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "4px 12px", minHeight: 32, cursor: "pointer", color: t.textSec, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12 }}>{L("Kopírovat", "Copy")}</button>
              </div>
              <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 6, lineHeight: 1.5 }}>{L("Přesně takhle, bez lomítka na konci. Změna se může projevit až za pár hodin.", "Exactly like this, no trailing slash. A change can take a few hours to take effect.")}</div>
            </div>
          </>)}
          {!!cfg.clientId && !pripojeno && (
            <button onClick={() => sync(true)} disabled={stav === "jde"} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 999, padding: "10px 22px", minHeight: 44, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13, marginTop: 2 }}>{L("Připojit ke Googlu", "Connect to Google")}</button>
          )}
          {pripojeno && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <button onClick={() => st.ask(L("Odpojit a kalendář v Googlu nechat být?", "Disconnect and leave the calendar in Google?"), () => odpojit(false), { yes: L("Odpojit", "Disconnect") })}
                style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "8px 16px", minHeight: 40, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Odpojit", "Disconnect")}</button>
              <button onClick={() => st.ask(L("Smazat celý kalendář „" + (cfg.calName || "tanmay") + "“ v Googlu? V aplikaci zůstane všechno, zmizí jen ta kopie v kalendáři.", "Delete the whole “" + (cfg.calName || "tanmay") + "” calendar in Google? Everything stays in the app — only the calendar copy goes."), () => odpojit(true), { yes: L("Smazat", "Delete") })}
                style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "8px 16px", minHeight: 40, cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Odpojit a smazat kalendář", "Disconnect and delete the calendar")}</button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => klDownload("tanmay-kalendar.ics", tmCalIcs(st))} className="tm-nav-item"
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "10px 8px", minHeight: 44, cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 13 }}>
        <span style={{ color: t.sage }}><FamilyIcon id="download" size={16} label={L("Dolů","Down")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>{L("Stáhnout jako .ics", "Download as .ics")}
      </button>
      <p style={{ ...radek, marginTop: -2 }}>{L("Bez Googlu a bez přihlašování. Naimportuje se do jakéhokoli kalendáře — ale je to snímek, ne spojení: po změně je potřeba stáhnout znovu.", "No Google, no sign-in. Imports into any calendar — but it is a snapshot, not a link: after a change you download it again.")}</p>
    </SetSection>
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
  try { evs = tmCalDesired(st, cfg); } catch (e) { evs = []; }
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
