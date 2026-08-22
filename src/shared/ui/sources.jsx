// ----------------------------------------------------------------------
// PRAMENY · dva původy, jedna místnost
// ----------------------------------------------------------------------
// Knihovna, řádek, detail. Dosud to byly dvě implementace a klientská byla
// o generaci pozadu: bez hledání, bez přepínače zobrazení, bez dlouhého
// stisku, bez hromadných akcí, bez „věty, kterou si nesu".
//
// Rozdíl role se řeší tím, co se do továrny předá:
//   · `ExportBtn`   sdílení hotového dokumentu · zatím jen osobní aplikace
//   · `gdEmbed`     vkládání odkazů z Google Drive · totéž
//   · adaptér dat   `st.allSources()` a `st.updateSourceNote()` rozhodují,
//                   jestli je pramen klientův, nebo od Tanmaye
//
// MŮJ PRAMEN    celý jeho. Trenér ho nevidí.
// OD TANMAYE    trenér drží název, autora, výňatek, pokyn a to, proč na něm
//               záleží. Klient k němu píše svoje: poznámku, „co si nést dál"
//               a stav. To trenér nečte. Odebrání ze sdílení jeho poznámku
//               nemaže; kdo chce pramen po svém, udělá si kopii.
//
// Písmo se bere z CSS proměnných (--tm-font-*).
import React, { useState } from "react";
import { SOURCE_ORIGIN, mayEditSourceField, sourceOriginLabel } from "../product/sources.js";

export function createSourcesUI(deps) {
  const {
    useT, useStore, L, LV, hexA, uid, getLang,
    Tag, Select, PropRow,
    PageTitle, Prazdno, CenterSheet, RichArea, AttachmentStrip, filesToAtts,
    ViewCycle, HdrIcon, HdrSearch, HdrLbl, FiltrPill, UndoBar, useHoldSelect, RoomView, TmIcFiltr, tmViewOk,
    useHoldReorder, PinDot, PinToggle, isEntryPinned, imgSrc, r2Put, r2Del, resizeImageToBlob,
    TmIcPrameny, TmIcLupa, TmIcKniha, ClipIcon, TmArtKapka,
    // glyf typu se bere až za běhu · v osobní aplikaci vzniká pozdě ve zdroji
    typeGlyph,
    iconBtn, fieldStyle, tmPlain, tmToTop,
    C_TYPES, C_TYPE_LABEL, C_TYPE_COLOR, C_PROGRESS, C_PROG_LABEL, C_PROG_COLOR,
    C_CATS, C_CATS_BY_TYPE, C_CAT_LABEL, tmDocPramene,
    // volitelné · osobní aplikace je má, klientská zatím ne
    ExportBtn = null, gdEmbed = null,
  } = deps;

  const tmGdEmbed = gdEmbed || (() => null);
  const glyfTypu = typeGlyph || (() => TmIcKniha);
  const lang = () => (getLang ? getLang() : "cs");
  /** Prameny z adaptéru dat. Osobní dům vrací svou kolekci, klient sloučený seznam. */
  const sourcesOf = (st) => (typeof st.allSources === "function" ? st.allSources() : (st.coll.content || []));

  // Můj / Od Tanmaye · klidný štítek, ne zámek. U vlastního se ukáže jen tam,
  // kde obě třídy současně existují — jinak by „Můj" byl šum.
  function OriginBadge({ s }) {
    const { t } = useT();
    const st = useStore();
    const coach = s && s.origin === SOURCE_ORIGIN.COACH;
    const obe = typeof st.hasCoachSources === "function" ? st.hasCoachSources() : false;
    if (!coach && !obe) return null;
    return (
      <span style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, padding: "2px 8px", borderRadius: "var(--tm-r-tag)", whiteSpace: "nowrap", flexShrink: 0, color: coach ? (t.accentInk || t.accent) : t.sage, background: hexA(coach ? t.accent : t.sage, 0.1), border: `1px solid ${hexA(coach ? t.accent : t.sage, 0.28)}` }}>
        {sourceOriginLabel(s, lang())}
      </span>
    );
  }

  function ContentDetail({ id, onClose, onExpand, wide }) {
    const { t } = useT();
    const st = useStore();
    const e = sourcesOf(st).find((x) => x.id === id);
    const coverRef = React.useRef(null);
    const fileRef = React.useRef(null);
    const taRef = React.useRef(null);
    const autosize = () => { const el = taRef.current; if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; } };
    React.useEffect(() => { autosize(); }, [id]);
    const [gdOpen, setGdOpen] = useState(false);
    const [gdUrl, setGdUrl] = useState("");
    if (!e) return null;
    const odTanmaye = e.origin === SOURCE_ORIGIN.COACH;
    // Zápis prochází jedinou tabulkou pravomocí (product/sources.js). Kanonický
    // obsah od trenéra klient nepřepíše; svou poznámku, zvýraznění, stav
    // a „co si nést dál" ano — a to trenér nečte.
    const upd = (patch) => {
      if (!odTanmaye) return st.updateEntry("content", e.id, patch);
      const dovolene = {};
      for (const k of Object.keys(patch || {})) if (mayEditSourceField("client", e, k)) dovolene[k] = patch[k];
      if (Object.keys(dovolene).length) st.updateSourceNote(e.id, dovolene);
    };
    const cycle = (list, cur, key) => upd({ [key]: list[(list.indexOf(cur) + 1) % list.length] });
    const pickCover = async (file) => {
      if (!file) return;
      try {
        const old = e.icon;
        const blob = await resizeImageToBlob(file, 360);
        const id = uid() + "i";
        await r2Put(id, blob, file.name);
        upd({ icon: { r2id: id } });
        if (old && old.r2id) r2Del(old.r2id);
      } catch (err) {}
      if (coverRef.current) coverRef.current.value = "";
    };
    const findCover = () => {
      const q = ((e.title || "") + " " + (e.author || "")).trim() || L("obálka", "cover");
      window.open("https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(q + " cover"), "_blank", "noopener,noreferrer");
    };
    const sourceLink = () => {
      const q = encodeURIComponent(((e.title || "") + " " + (e.author || "")).trim());
      if (e.type === "Movie") return { url: "https://www.imdb.com/find/?q=" + encodeURIComponent(e.title || ""), label: "IMDb" };
      if (e.type === "Podcast" || e.type === "Feed") return { url: "https://www.google.com/search?q=" + q, label: "Google" };
      return { url: "https://www.goodreads.com/search?q=" + q, label: "Goodreads" };
    };
    const attach = async (fileList) => {
      const added = await filesToAtts(fileList, st.ask);
      if (added.length) upd({ att: [...(e.att || []), ...added] });
      if (fileRef.current) fileRef.current.value = "";
    };
    const scoreN = e.score === "" || e.score == null ? null : +e.score;
    return (
      <div style={wide ? { maxWidth: 640 } : undefined}>
        <input ref={coverRef} type="file" accept="image/*" onChange={(ev) => pickCover(ev.target.files && ev.target.files[0])} style={{ display: "none" }} />
        {odTanmaye && <div style={{ marginBottom: 10 }}><OriginBadge s={e} /></div>}
        <button title={L("Nahrát obálku", "Upload cover")} disabled={odTanmaye} onClick={() => { if (!odTanmaye && coverRef.current) coverRef.current.click(); }} style={{ background: "transparent", border: "none", cursor: odTanmaye ? "default" : "pointer", padding: 0, marginBottom: 12, display: "block" }}>
          {e.icon
            ? <img src={imgSrc(e.icon)} alt="" style={{ width: 92, height: 128, objectFit: "cover", borderRadius: 8, border: `1px solid ${t.border}`, boxShadow: "0 8px 20px rgba(0,0,0,0.3)", display: "block" }} />
            : <span style={{ width: 92, height: 128, borderRadius: 8, border: `1px dashed ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}><span style={{ color: t.sand }}>{React.createElement(glyfTypu(e.type), { size: 26 })}</span>{L("nahrát obálku", "upload cover")}<span onClick={(ev) => { ev.stopPropagation(); findCover(); }} title={L("Otevře Google obrázky s názvem — obrázek stáhni a nahraj", "Opens Google Images for the title — download and upload it")} style={{ marginTop: 4, paddingTop: 6, borderTop: `1px dashed ${t.borderSoft}`, width: "72%", textAlign: "center", color: t.sand, fontSize: 12 }}>{L("Najít obálku", "Find cover")}</span></span>}
        </button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 12 }}>
          {e.icon && !odTanmaye && <button onClick={() => { if (e.icon && e.icon.r2id) r2Del(e.icon.r2id); upd({ icon: null }); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{L("Odebrat", "Remove")}</button>}
        </div>
        <div style={{ marginBottom: 14 }}>
          {st.editMode && !odTanmaye
            ? <input value={e.title} onChange={(ev) => upd({ title: ev.target.value })} placeholder={L("Název…", "Title…")} style={{ width: "100%", background: "transparent", border: "none", fontFamily: "var(--tm-font-display)", fontSize: 28, fontWeight: 500, color: t.heading, outline: "none", padding: 0, lineHeight: 1.2 }} />
            : (() => { const s = sourceLink(); return <a href={e.title ? s.url : undefined} target="_blank" rel="noopener noreferrer" title={e.title ? L("Vyhledat · ", "Search · ") + s.label : ""} onMouseOver={(ev) => { if (e.title) ev.currentTarget.style.color = t.accent; }} onMouseOut={(ev) => { ev.currentTarget.style.color = t.heading; }} style={{ display: "block", fontFamily: "var(--tm-font-display)", fontSize: 28, fontWeight: 500, color: t.heading, lineHeight: 1.2, textDecoration: "none", cursor: e.title ? "pointer" : "default", transition: "color .18s ease" }}>{e.title || L("Bez názvu", "Untitled")}</a>; })()}
        </div>
        <PropRow icon="◌" label={L("Stav", "Progress")}><button onClick={() => cycle(C_PROGRESS, e.progress, "progress")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}><Tag label={C_PROG_LABEL(e.progress, e.type)} color={C_PROG_COLOR[e.progress] || "default"} /></button></PropRow>
        <PropRow icon="≡" label={L("Autor", "Author")}>{odTanmaye
          ? <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: e.author ? t.text : t.textMuted }}>{e.author || "—"}</span>
          : <input value={e.author || ""} onChange={(ev) => upd({ author: ev.target.value })} placeholder="—" aria-label={L("Autor", "Author")} style={{ width: "100%", background: "transparent", border: "none", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, outline: "none" }} />}</PropRow>
        {!odTanmaye && <PropRow icon="▦" label={L("Dokončeno dne", "Date finished")}><input type="date" aria-label={L("Dokončeno dne", "Date finished")} value={e.dateFinished || ""} onChange={(ev) => upd({ dateFinished: ev.target.value })} style={{ background: "transparent", border: "none", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, outline: "none", colorScheme: t.mode === "light" ? "light" : "dark" }} /></PropRow>}
        {!odTanmaye && <PropRow icon="#" label={L("Skóre /10", "Score /10")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => upd({ score: String(Math.max(0, (scoreN == null ? 5 : scoreN) - 1)) })} aria-label={L("Ubrat bod", "Remove a point")} style={{ ...iconBtn(t), width: 26, height: 26 }}>−</button>
            <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 17, color: scoreN != null ? t.heading : t.textMuted, minWidth: 26, textAlign: "center" }}>{scoreN != null ? scoreN : "—"}</span>
            <button onClick={() => upd({ score: String(Math.min(10, (scoreN == null ? 5 : scoreN) + 1)) })} aria-label={L("Přidat bod", "Add a point")} style={{ ...iconBtn(t), width: 26, height: 26 }}>＋</button>
          </span>
        </PropRow>}
        <PropRow icon="„" label={L("Věta, kterou si nesu", "A line I carry")}><input value={e.carry || ""} onChange={(ev) => upd({ carry: ev.target.value })} placeholder={L("jedna věta z tohoto pramene…", "one line from this source…")} style={{ width: "100%", background: "transparent", border: "none", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, outline: "none" }} /></PropRow>
        {!odTanmaye && <PropRow icon="⊙" label={L("Typ", "Type")}><button onClick={() => cycle(C_TYPES, e.type, "type")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}><Tag label={e.type ? C_TYPE_LABEL(e.type) : "—"} color={C_TYPE_COLOR[e.type] || "default"} /></button></PropRow>}
        {!odTanmaye && <PropRow icon="⊙" label={L("Žánr", "Genre")}><Select small value={e.category || ""} onChange={(v) => upd({ category: v })} placeholder="—" style={{ maxWidth: 170, width: 170 }} options={(C_CATS_BY_TYPE[e.type] || C_CATS).map((c) => ({ v: c, label: C_CAT_LABEL(c) }))} /></PropRow>}
        {!odTanmaye && (
        <PropRow icon="▤" label={L("Archiv", "Archive")}>
          <button onClick={() => upd({ archive: !e.archive })} title={e.archive ? L("Vrátit z archivu", "Restore from archive") : L("Archivovat", "Archive")} aria-label={e.archive ? L("Vrátit z archivu", "Restore from archive") : L("Archivovat", "Archive")} style={{ width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: `1.5px solid ${e.archive ? t.accent : t.border}`, background: e.archive ? t.accent : "transparent", cursor: "pointer", color: t.bg, fontSize: 12, lineHeight: 1, padding: 0 }}>{e.archive ? "✓" : ""}</button>
        </PropRow>)}

        {odTanmaye && (e.why || e.instruction || e.excerpt) && (
          <div style={{ borderLeft: `2px solid ${hexA(t.accent, 0.4)}`, paddingLeft: 12, margin: "14px 0 4px" }}>
            {e.why && <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 14, color: t.textSec, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{e.why}</div>}
            {e.instruction && <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text, lineHeight: 1.6, whiteSpace: "pre-wrap", marginTop: 8 }}>{e.instruction}</div>}
            {e.excerpt && <div style={{ fontFamily: "var(--tm-font-display)", fontStyle: "italic", fontSize: 16, color: t.heading, lineHeight: 1.6, whiteSpace: "pre-wrap", marginTop: 10 }}>{e.excerpt}</div>}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "12px 0 6px", flexWrap: "wrap" }}>
          <input ref={fileRef} type="file" multiple accept=".pdf,audio/*,image/*,.doc,.docx,.txt" onChange={(ev) => attach(ev.target.files)} style={{ display: "none" }} />
          {!odTanmaye && <button onClick={() => fileRef.current && fileRef.current.click()} style={{ background: "transparent", border: `1px dashed ${t.border}`, borderRadius: 8, padding: "8px 12px", minHeight: 38, cursor: "pointer", color: t.inkSand || t.sand, fontFamily: "var(--tm-font-body)", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 7 }}><ClipIcon size={13} />{L("PDF · audio shrnutí · soubor", "PDF · audio summary · file")}</button>}
          {gdEmbed && !odTanmaye && <button onClick={() => setGdOpen(!gdOpen)} style={{ background: "transparent", border: `1px dashed ${gdOpen ? t.accent : t.border}`, borderRadius: 8, padding: "8px 12px", minHeight: 38, cursor: "pointer", color: gdOpen ? (t.accentInk || t.accent) : (t.inkSand || t.sand), fontFamily: "var(--tm-font-body)", fontSize: 12 }}>Google Drive</button>}
          {onExpand && <button title={L("Otevřít jako stránku", "Open as page")} onClick={onExpand} style={{ ...iconBtn(t), border: "none", color: t.textMuted, fontSize: 13 }}>⤢</button>}
          {wide && <PinToggle entry={e} />}
          <span style={{ flex: 1 }} />
          {odTanmaye && <button onClick={() => { const nid = st.forkCoachSource(e.id); if (nid) { onClose && onClose(); } }} title={L("Udělá kopii, která je od té chvíle tvoje", "Makes a copy that is yours from then on")} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 14, padding: "8px 14px", minHeight: 38, cursor: "pointer", color: t.sand, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{L("Udělat vlastní kopii", "Make my own copy")}</button>}
          {!odTanmaye && (st.editMode || wide) && <button onClick={() => st.ask(L(`Přesunout „${e.title}" do koše?`, `Move "${e.title}" to trash?`), () => { st.removeEntry("content", e.id); onClose && onClose(); }, { soft: true })} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 14, padding: "4px 14px", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{L("Do koše", "To trash")}</button>}
        </div>
        {gdEmbed && gdOpen && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "2px 0 8px" }}>
            <input value={gdUrl} onChange={(ev) => setGdUrl(ev.target.value)} placeholder={L("vlož odkaz z Google Drive — soubor, dokument, složka…", "paste a Google Drive link — file, doc, folder…")} autoFocus
              style={{ flex: 1, background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 8, color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "7px 10px", outline: "none" }} />
            <button onClick={() => { const u = gdUrl.trim(); if (u && tmGdEmbed(u)) { upd({ att: [...(e.att || []), { id: uid(), type: "gdrive", url: u, name: "Google Drive" }] }); setGdUrl(""); setGdOpen(false); } }} disabled={!tmGdEmbed(gdUrl.trim())}
              style={{ background: "transparent", border: `1px solid ${tmGdEmbed(gdUrl.trim()) ? t.accent : t.borderSoft}`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", color: tmGdEmbed(gdUrl.trim()) ? (t.accentInk || t.accent) : t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{L("Vložit", "Embed")}</button>
          </div>
        )}
        <AttachmentStrip att={odTanmaye ? (e.attachment ? [e.attachment] : []) : e.att} onRemove={odTanmaye ? undefined : ((aid) => upd({ att: (e.att || []).filter((x) => x.id !== aid) }))} />

        <div style={{ borderTop: `1px solid ${t.borderSoft}`, marginTop: 14, paddingTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ flex: 1, fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage }}>{L("Postřehy", "Notes")}</div>
            {ExportBtn && <ExportBtn small doc={() => ({
              title: e.title || L("Titul", "Title"),
              sub: [e.author, C_TYPE_LABEL(e.type)].filter(Boolean).join(" · "),
              date: e.dateFinished || "",
              room: L("Prameny", "Sources"),
              text: (e.carry ? "> " + e.carry + "\n\n" : "") + (e.text || ""),
            })} />}
          </div>
          {odTanmaye && <div style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted, margin: "-2px 0 8px", lineHeight: 1.55 }}>{L("Tvoje. Tanmay to nečte.", "Yours. Tanmay does not read this.")}</div>}
          <RichArea value={odTanmaye ? (e.note || "") : (e.text || "")} onChange={(v) => upd(odTanmaye ? { note: v } : { text: v })} placeholder={L("Co si z toho odnáším…", "What I take from it…")} />
        </div>
      </div>
    );
  }

  function ContentRow({ e, cols, last, onOpen, noDrag, selecting, selected, onToggleSel, holdManaged }) {
    const { t } = useT();
    const st = useStore();
    const rootRef = React.useRef(null);
    const onOverRef = React.useRef(null);
    onOverRef.current = (overId) => st.reorderEntry("content", e.id, overId);
    const odTanmaye = e.origin === SOURCE_ORIGIN.COACH;
    // Sdílený pramen se nepřeuspořádává mezi vlastními · pořadí drží trenér.
    const disRef = React.useRef(false); disRef.current = !!noDrag || !!selecting || !!holdManaged || odTanmaye;
    const dragging = useHoldReorder(rootRef, e.id, "data-cid", onOverRef, disRef);
    return (
      <div
        ref={rootRef}
        data-cid={e.id}
        data-pick={e.id}
        draggable={!noDrag && !selecting && !odTanmaye}
        onDragStart={!noDrag && !selecting && !odTanmaye ? (ev) => { ev.dataTransfer.setData("text/plain", "cid:" + e.id); ev.dataTransfer.effectAllowed = "move"; } : undefined}
        onDragOver={(ev) => ev.preventDefault()}
        onDrop={(ev) => { ev.preventDefault(); const d = (ev.dataTransfer.getData("text/plain") || "").split(":"); if (d[0] === "cid" && d[1] && d[1] !== e.id) st.reorderEntry("content", d[1], e.id); }}
        className="tm-nav-item"
        onClick={selecting ? () => onToggleSel(e.id) : () => onOpen(e.id)}
        style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${selected || dragging ? t.accent : t.borderSoft}`, borderRadius: 10, margin: "8px 0", padding: "10px 12px", cursor: "pointer", background: selected ? hexA(t.accent, 0.07) : dragging ? hexA(t.accent, 0.08) : t.card, boxShadow: dragging ? t.shadowLift : t.shadow, transform: dragging ? "scale(1.008)" : "none", transition: "transform .12s ease, box-shadow .12s ease", userSelect: dragging ? "none" : "auto" }}
      >
        {selecting && <span className="tm-selmark" style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 7, border: `1.5px solid ${selected ? t.accent : t.border}`, background: selected ? t.accent : "transparent", color: t.onAccent, fontSize: 12, lineHeight: "19px", textAlign: "center", touchAction: "none" }}>{selected ? "✓" : ""}</span>}
        {e.icon
          ? <img src={imgSrc(e.icon)} alt="" style={{ width: 30, height: 40, objectFit: "cover", borderRadius: 5, flexShrink: 0, border: `1px solid ${t.borderSoft}` }} />
          : <span style={{ width: 30, flexShrink: 0, display: "inline-flex", justifyContent: "center", color: t.sand }}>{React.createElement(glyfTypu(e.type), { size: 19 })}</span>}
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 17, color: t.heading, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</span>
            <PinDot id={e.id} />
            <OriginBadge s={e} />
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4, flexWrap: "wrap" }} onClick={(ev) => ev.stopPropagation()}>
            <button onClick={() => { const dal = C_PROGRESS[(C_PROGRESS.indexOf(e.progress) + 1) % C_PROGRESS.length]; if (odTanmaye) st.updateSourceNote(e.id, { progress: dal }); else st.updateEntry("content", e.id, { progress: dal }); }} title={L("Klikni a přepínej", "Click to cycle")} aria-label={L("Změnit stav", "Change progress")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, minHeight: 30 }}>
              <Tag label={C_PROG_LABEL(e.progress, e.type)} color={C_PROG_COLOR[e.progress] || "default"} />
            </button>
            {e.category ? <Tag label={C_CAT_LABEL(e.category)} color="default" /> : null}
            {e.author ? <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{e.author}</span> : null}
          </span>
        </span>
        {e.score
          ? <span style={{ flexShrink: 0, fontFamily: "var(--tm-font-display)", fontSize: 17, color: t.sand, whiteSpace: "nowrap" }}>{e.score}<span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted }}> /10</span></span>
          : <span style={{ flexShrink: 0, fontFamily: "var(--tm-font-display)", fontSize: 17, color: t.textMuted }}>—</span>}
      </div>
    );
  }

  function PageContent() {
    const { t } = useT();
    const st = useStore();
    React.useEffect(() => { st.importContent(); st.migrateContentSchema(); }, []);
    const all = sourcesOf(st);
    const [view, setView] = useState("Vše");
    const [fProg, setFProg] = useState("Vše");
    const [fCat, setFCat] = useState("Vše");
    const [offlineOnly, setOfflineOnly] = useState(false);
    // zobrazení a řazení si místnost pamatuje sama · přežije zavření aplikace
    const meta = st.pageMetaOf("prameny");
    // Prameny mají obálky · knihovna se prohlíží očima, ne po řádcích
    const vw = tmViewOk(meta.view || "gal");
    const setVw = (v) => st.setPageMeta("prameny", { view: v });
    const sortBy = meta.sort || "manual";
    const setSortBy = (v) => st.setPageMeta("prameny", { sort: v });
    const [sel, setSel] = useState(null);   // drawer id
    const [full, setFull] = useState(null); // full-page id
    React.useEffect(() => { if (full) tmToTop(); }, [full]);
    // Prameny, které Tanmay odebral ze sdílení · poznámka po nich zůstává.
    const sirotci = typeof st.orphanSourceNotes === "function" ? st.orphanSourceNotes() : [];
    const [adding, setAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState("Book");
    const [q, setQ] = useState("");
    const [qOpen, setQOpen] = useState(false);
    const [fOpen, setFOpen] = useState(false);
    const [selecting, setSelecting] = useState(false);
    const [selIds, setSelIds] = useState([]);
    const toggleSelC = (id) => setSelIds((xs) => xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]);
    // přišlo se sem z hledání · otevři přesně ten titul
    React.useEffect(() => {
      const tgt = st.openTarget;
      if (tgt && tgt.kind === "content") { setView("Vše"); setSel(tgt.id); st.setOpenTarget(null); }
    }, [st.openTarget]);
    const exitSelectC = () => { setSelecting(false); setSelIds([]); };
    // ——— dlouhý stisk · výběr a přeuspořádání ———
    // Puštění na dlaždici tady zatím nic nedělá: v Pramenech jsou dlaždice typy
    // a přetáhnout knihu na „Podcast" nedává smysl. V dávce 5 z nich budou stavy.
    const listRefC = React.useRef(null);
    const [undoBarC, setUndoBarC] = useState(null);
    const holdStateC = React.useRef({});
    const holdActC = React.useRef({});
    const holdingC = useHoldSelect({ rootRef: listRefC, attr: "data-pick", tabAttr: "data-cstat", stateRef: holdStateC, actionsRef: holdActC });

    const TABS = ["Vše", ...C_TYPES];
    const live = all.filter((e) => !e.archive);
    let shown = view === "Archiv" ? all.filter((e) => e.archive) : view === "Vše" ? live : live.filter((e) => e.type === view);
    if (fProg !== "Vše") shown = shown.filter((e) => e.progress === fProg);
    if (fCat !== "Vše") shown = shown.filter((e) => e.category === fCat);
    const catOpts = Array.from(new Set(live.map((e) => e.category).filter(Boolean))).sort((a, b) => C_CAT_LABEL(a).localeCompare(C_CAT_LABEL(b), "cs"));
    const sorters = {
      score: (a, b) => (+(b.score || -1)) - (+(a.score || -1)),
      dateDesc: (a, b) => (b.dateFinished || "").localeCompare(a.dateFinished || ""),
      name: (a, b) => (a.title || "").localeCompare(b.title || "", "cs"),
      cat: (a, b) => (a.category || "").localeCompare(b.category || "") || (+(b.score || -1)) - (+(a.score || -1)),
    };
    if (sortBy !== "manual") shown = [...shown].sort(sorters[sortBy] || sorters.score);
    // hvězdička drží nahoře · v Zápisníku to tak bylo vždy, v Pramenech ne — teď ano.
    // (Deník ji záměrně nemá: tam pořadí určuje čas a vytahovat zápis z proudu by ho rozbilo.)
    shown = [...shown.filter((e) => e.star), ...shown.filter((e) => !e.star)];
    if (q.trim()) { const needle = q.trim().toLowerCase(); shown = shown.filter((e) => ((e.title || "") + " " + (e.author || "")).toLowerCase().includes(needle)); }
    if (offlineOnly) shown = shown.filter((e) => isEntryPinned(e.id));
    const counts = { "Vše": live.length, "Archiv": all.length - live.length };
    C_TYPES.forEach((x) => { counts[x] = live.filter((e) => e.type === x).length; });
    const progBase = view === "Archiv" ? all.filter((e) => e.archive) : view === "Vše" ? live : live.filter((e) => e.type === view);
    const progCounts = {};
    C_PROGRESS.forEach((p) => { progCounts[p] = progBase.filter((e) => e.progress === p).length; });

    const addNew = () => {
      const v = newTitle.trim();
      if (!v) return;
      const id = uid();
      st.addEntry("content", { id, title: v, author: "", score: "", type: newType, progress: "Ready to start", category: (C_CATS_BY_TYPE[newType] || [])[0] || "", dateFinished: "", text: "", icon: null });
      setNewTitle(""); setAdding(false); setSel(id);
    };

    if (full) {
      return (
        <>
          <button onClick={() => setFull(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "0 0 16px", display: "inline-flex", alignItems: "center", gap: 6 }}>‹ {L("Prameny", "Sources")}</button>
          <ContentDetail id={full} wide onClose={() => setFull(null)} />
        </>
      );
    }

    const cols = "minmax(200px, 1fr) 118px 112px 42px 128px";
    const noDragC = sortBy !== "manual" || view !== "Vše" || fProg !== "Vše";
    holdStateC.current = { selecting, sel: selIds, sortManual: !noDragC };
    holdActC.current = {
      label: (id) => { const e = all.find((x) => x.id === id); return (e && e.title) || L("Titul", "Title"); },
      paint: (id, add) => setSelIds((xs) => add ? (xs.includes(id) ? xs : [...xs, id]) : xs.filter((x) => x !== id)),
      enter: (id) => { setSelecting(true); setSelIds([id]); },
      reorder: (dragId, overId) => st.reorderEntry("content", dragId, overId),
      // v Pramenech dlaždice nesou stav · pustit knihu na „Čtu" je celá věta
      dropTab: (ids, status) => {
        const before = ids.map((id) => { const e = all.find((x) => x.id === id); return e ? { id, progress: e.progress, coach: e.origin === SOURCE_ORIGIN.COACH } : null; }).filter(Boolean);
        if (!before.length) return;
        before.forEach((b) => (b.coach ? st.updateSourceNote(b.id, { progress: status }) : st.updateEntry("content", b.id, { progress: status })));
        exitSelectC();
        setUndoBarC({ text: before.length > 1 ? before.length + " → " + C_PROG_LABEL(status) : L("Posunuto na ", "Moved to ") + C_PROG_LABEL(status), fn: () => before.forEach((b) => (b.coach ? st.updateSourceNote(b.id, { progress: b.progress }) : st.updateEntry("content", b.id, { progress: b.progress }))) });
      },
    };
    const selectAllC = () => setSelIds(shown.map((e) => e.id));
    const bulkProgC = (status) => {
      const ids = [...selIds];
      const before = ids.map((id) => { const e = all.find((x) => x.id === id); return e ? { id, progress: e.progress, coach: e.origin === SOURCE_ORIGIN.COACH } : null; }).filter(Boolean);
      before.forEach((b) => (b.coach ? st.updateSourceNote(b.id, { progress: status }) : st.updateEntry("content", b.id, { progress: status })));
      exitSelectC();
      setUndoBarC({ text: ids.length + " → " + C_PROG_LABEL(status), fn: () => before.forEach((b) => (b.coach ? st.updateSourceNote(b.id, { progress: b.progress }) : st.updateEntry("content", b.id, { progress: b.progress }))) });
    };
    // Žánr, archiv a koš patří jen vlastním pramenům. Sdílené se z výběru
    // tiše vynechají — mazat cizí zadání není klientova věc.
    const vlastniIds = () => selIds.filter((id) => { const e = all.find((x) => x.id === id); return e && e.origin !== SOURCE_ORIGIN.COACH; });
    const bulkCatC = (cat) => {
      const ids = vlastniIds();
      const before = ids.map((id) => { const e = all.find((x) => x.id === id); return e ? { id, category: e.category } : null; }).filter(Boolean);
      before.forEach((b) => st.updateEntry("content", b.id, { category: cat }));
      exitSelectC();
      setUndoBarC({ text: ids.length + " → " + C_CAT_LABEL(cat), fn: () => before.forEach((b) => st.updateEntry("content", b.id, { category: b.category })) });
    };
    const bulkArchC = (on) => {
      const ids = vlastniIds();
      const before = ids.map((id) => { const e = all.find((x) => x.id === id); return e ? { id, archive: !!e.archive } : null; }).filter(Boolean);
      before.forEach((b) => st.updateEntry("content", b.id, { archive: on }));
      exitSelectC();
      setUndoBarC({ text: ids.length + " · " + (on ? L("do archivu", "archived") : L("z archivu", "unarchived")), fn: () => before.forEach((b) => st.updateEntry("content", b.id, { archive: b.archive })) });
    };
    const bulkTrashC = () => {
      const ids = vlastniIds();
      st.removeEntries("content", ids);
      exitSelectC();
      setUndoBarC({ text: L("Přesunuto do koše · ", "Moved to trash · ") + ids.length, fn: () => st.restoreEntries("content", ids) });
    };
    // titul v jiném zobrazení · obálka je tvář, jinak glyf typu
    const cItem = (e) => ({
      id: e.id,
      title: e.title || L("Bez názvu", "Untitled"),
      date: e.score ? e.score + "/10" : "",
      preview: [e.author, tmPlain(e.origin === SOURCE_ORIGIN.COACH ? (e.note || e.why || "") : e.text).split("\n").map((x) => x.trim()).filter(Boolean).join(" ")].filter(Boolean).join(" · "),
      star: !!e.star,
      meta: <>
        <Tag label={C_PROG_LABEL(e.progress, e.type)} color={C_PROG_COLOR[e.progress] || "default"} />
        {e.category ? <Tag label={C_CAT_LABEL(e.category)} color="default" /> : null}
        {e.origin === SOURCE_ORIGIN.COACH ? <OriginBadge s={e} /> : null}
      </>,
      metaGal: <>
        <Tag label={C_PROG_LABEL(e.progress, e.type)} color={C_PROG_COLOR[e.progress] || "default"} />
        {e.origin === SOURCE_ORIGIN.COACH ? <OriginBadge s={e} /> : null}
      </>,
      face: {
        img: e.icon ? imgSrc(e.icon) : null,
        ini: (e.title || "·").trim().charAt(0).toUpperCase(),
        glyph: e.icon ? null : (glyfTypu(e.type)),
        badge: e.icon ? null : (e.score || null),
      },
    });

    return (
      <>
        <PageTitle icon={<span style={{ color: t.sand, display: "inline-flex" }}><TmIcPrameny size={38} /></span>} pageKey="prameny" kicker={L("Co si nést dál", "What to carry forward")}
          right={<HdrIcon on={qOpen || !!q} title={L("Hledat v pramenech", "Search the sources")} onClick={() => setQOpen((x) => !x)}><TmIcLupa size={17} /></HdrIcon>}>{L("Prameny", "Sources")}</PageTitle>

        {qOpen && <HdrSearch value={q} onChange={setQ} onClose={() => setQOpen(false)} placeholder={L("Hledat v pramenech…", "Search the sources…")} />}

        <div className="tm-tabsrow" style={{ borderBottom: `1px solid ${t.border}`, marginBottom: 12 }}>
          <div className="tm-typerow" style={{ display: "flex", gap: 2, alignItems: "center", flex: 1, minWidth: 0 }}>
            {/* prázdné typy mlčí · záložka se ukáže, až když má co nést */}
            {TABS.filter((v) => v === "Vše" || v === view || (counts[v] || 0) > 0).map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 10px 9px", fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: view === v ? t.accent : t.textMuted, borderBottom: view === v ? `2px solid ${t.accent}` : "2px solid transparent", marginBottom: -1, flexShrink: 0 }}>
                {C_TYPES.includes(v) ? C_TYPE_LABEL(v) : LV(v)}<span style={{ marginLeft: 5, opacity: 0.6, fontSize: 12 }}>{counts[v] || 0}</span>
              </button>
            ))}
          </div>
          <div className="tm-tabsctrl">
            <ViewCycle value={vw} onChange={setVw} />
            <HdrIcon on={fOpen || sortBy !== "manual" || fProg !== "Vše" || fCat !== "Vše" || offlineOnly} title={L("Filtry, řazení a nastavení", "Filters, sorting and settings")} onClick={() => setFOpen((x) => !x)}><TmIcFiltr /></HdrIcon>
          </div>
        </div>

        {/* stavy mají vlastní řádek · jsou zároveň filtr a cíl tažení, a schované
            pod ovládáním by nebyly ani jedno */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", margin: "0 0 12px", flexWrap: "wrap" }}>
          {C_PROGRESS.map((p) => (
            <button key={p} data-cstat={p} onClick={() => setFProg(fProg === p ? "Vše" : p)}
              title={L("Filtr · sem se dá i přetáhnout", "Filter · you can also drag here")}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, background: fProg === p ? hexA(t.accent, 0.14) : "transparent", border: `1px solid ${fProg === p ? t.accent : t.borderSoft}`, cursor: "pointer", padding: "5px 12px", borderRadius: 999, minHeight: 32, fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: fProg === p ? t.accent : t.textMuted, flexShrink: 0 }}>
              {C_PROG_LABEL(p)}<span style={{ opacity: 0.6, fontSize: 12 }}>{progCounts[p] || 0}</span>
            </button>
          ))}
        </div>

        {fOpen && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", padding: "2px 2px 0", margin: "0 0 14px" }}>
            <HdrLbl>{L("Řazení", "Sorting")}</HdrLbl>
            {[{ v: "manual", label: L("vlastní pořadí", "custom order") }, { v: "score", label: L("skóre", "score") }, { v: "dateDesc", label: L("nejnovější", "newest") }, { v: "cat", label: L("žánr", "genre") }, { v: "name", label: "A–Z" }].map((so) => (
              <FiltrPill key={so.v} on={sortBy === so.v} onClick={() => setSortBy(so.v)}>{so.label}</FiltrPill>
            ))}
            <HdrLbl>{L("Filtr", "Filter")}</HdrLbl>
            {catOpts.length > 0 && <Select ghost value={fCat} onChange={setFCat} style={{ width: "auto" }} options={[{ v: "Vše", label: L("žánr: vše", "genre: all") }, ...catOpts.map((c) => ({ v: c, label: C_CAT_LABEL(c) }))]} />}
            <FiltrPill on={offlineOnly} onClick={() => setOfflineOnly((x) => !x)}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block", marginRight: 5 }} />offline</FiltrPill>
            <FiltrPill on={view === "Archiv"} onClick={() => setView(view === "Archiv" ? "Vše" : "Archiv")}>{LV("Archiv")} {counts["Archiv"] || 0}</FiltrPill>
            <HdrLbl>{L("Nastavení", "Settings")}</HdrLbl>
            <FiltrPill on={selecting} onClick={() => selecting ? exitSelectC() : setSelecting(true)}>{selecting ? L("Zrušit výběr", "Cancel selection") : L("☑ Vybrat", "☑ Select")}</FiltrPill>
          </div>
        )}

        {adding ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", background: t.callout, border: `1px solid ${t.border}`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addNew(); }} placeholder={L("Název titulu…", "Title name…")} style={{ ...fieldStyle(t), flex: 1, minWidth: 180 }} />
            <Select value={newType} onChange={setNewType} style={{ maxWidth: 130, width: 130 }} options={C_TYPES.map((x) => ({ v: x, label: C_TYPE_LABEL(x) }))} />
            <button onClick={addNew} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{L("Přidat", "Add")}</button>
            <button onClick={() => setAdding(false)} style={{ background: "transparent", color: t.textSec, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{L("Zrušit", "Cancel")}</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="tm-dash" style={{ background: "transparent", border: "none", borderRadius: 8, padding: "10px 2px", cursor: "pointer", color: t.inkSand, fontFamily: "var(--tm-font-body)", fontSize: 13, width: "100%", textAlign: "left", marginBottom: 12 }}>＋ {L("Nový titul", "New title")}</button>
        )}

        <div ref={listRefC} className="tm-scroll tm-dnolist" style={{ marginTop: 6, maxHeight: "min(620px, calc(62 * var(--tm-vh)))", overflowY: "auto", border: `1px solid ${holdingC ? t.accent : t.borderSoft}`, borderRadius: 20, padding: "4px 10px 10px", transition: "border-color .15s ease" }}>
          <div>
            {vw === "rows" && shown.map((e, i) => (
              <ContentRow key={e.id} e={e} cols={cols} last={i === shown.length - 1} onOpen={setSel} noDrag={noDragC} selecting={selecting} selected={selIds.includes(e.id)} onToggleSel={toggleSelC} holdManaged />
            ))}
            {vw !== "rows" && shown.length > 0 && (
              <RoomView view={vw} items={shown.map(cItem)} selecting={selecting} selIds={selIds} onToggleSel={toggleSelC} onOpen={setSel} />
            )}
            {shown.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 14px 26px", animation: "tmsettle .4s ease-out" }}>
                <TmArtKapka size={130} color={t.sand} />
                <Prazdno kind="prvni"
                  fakt={L("Prázdný sešit.", "An empty notebook.")}
                  pozvani={L("Sem patří to, co ještě nemá tvar.", "This is where things go before they have a shape.")}
                  uvolneni={L("Nemusí to dávat smysl hned. Od toho to je zapsané.", "It doesn't have to make sense yet. That's what writing it down is for.")} />
              </div>
            )}
          </div>
        </div>

        {sirotci.length > 0 && (
          <div style={{ marginTop: 12, border: `1px solid ${t.borderSoft}`, borderRadius: 12, padding: "12px 14px", background: t.callout }}>
            <div style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage, marginBottom: 6 }}>{L("Tvoje poznámky k odebraným pramenům", "Your notes on sources no longer shared")}</div>
            <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, lineHeight: 1.6, marginBottom: 8 }}>{L("Tanmay tyhle prameny přestal sdílet. Co sis k nim napsal, zůstalo tobě.", "Tanmay stopped sharing these. What you wrote about them stayed yours.")}</div>
            {sirotci.map((o) => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: `1px solid ${t.borderSoft}` }}>
                <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tmPlain(o.note || o.carry || "").slice(0, 90) || L("(bez textu)", "(no text)")}</span>
                <button onClick={() => st.keepOrphanNote(o.id)} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 999, minHeight: 34, padding: "5px 13px", cursor: "pointer", color: t.sand, fontFamily: "var(--tm-font-body)", fontSize: 12, flexShrink: 0 }}>{L("Nechat si to", "Keep it")}</button>
              </div>
            ))}
          </div>
        )}

        {selecting && (
          <div className="tm-selbar" style={{ position: "sticky", bottom: 16, display: "flex", alignItems: "center", gap: 8, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", zIndex: 50, flexWrap: "wrap", marginTop: 10 }}>
            <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.heading }}>{selIds.length} {L("vybráno", "selected")}</span>
            <button onClick={() => selIds.length === shown.length ? setSelIds([]) : selectAllC()} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 999, minHeight: 32, padding: "4px 12px", cursor: "pointer", color: t.textSec, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{selIds.length === shown.length && shown.length > 0 ? L("Zrušit vše", "Clear all") : L("Vybrat vše", "Select all")}</button>
            <span style={{ flex: 1 }} />
            {selIds.length > 0 && <Select small value="" onChange={bulkProgC} placeholder={L("Stav…", "Status…")} style={{ maxWidth: 130, width: 130 }} options={C_PROGRESS.map((p) => ({ v: p, label: C_PROG_LABEL(p) }))} />}
            {selIds.length > 0 && catOpts.length > 0 && <Select small value="" onChange={bulkCatC} placeholder={L("Žánr…", "Genre…")} style={{ maxWidth: 130, width: 130 }} options={catOpts.map((c) => ({ v: c, label: C_CAT_LABEL(c) }))} />}
            {ExportBtn && selIds.length > 0 && <ExportBtn label={L("Sdílet", "Share")} pocet={selIds.length} jmeno={L("prameny-vyber", "sources-selection")} docs={() => sourcesOf(st).filter((e) => selIds.includes(e.id)).map(tmDocPramene)} />}
            {selIds.length > 0 && <button onClick={() => bulkArchC(view !== "Archiv")} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, minHeight: 32, padding: "6px 14px", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{view === "Archiv" ? L("Z archivu", "Unarchive") : L("Do archivu", "Archive")}</button>}
            {selIds.length > 0 && <button onClick={() => st.ask(L(`Přesunout ${selIds.length} titulů do koše?`, `Move ${selIds.length} titles to trash?`), bulkTrashC)} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, minHeight: 32, padding: "6px 14px", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{L("Do koše", "To trash")}</button>}
            <button onClick={exitSelectC} title={L("Zrušit výběr", "Cancel selection")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 15, width: 30, height: 32 }}>×</button>
          </div>
        )}
        {!selecting && <UndoBar bar={undoBarC} onClose={() => setUndoBarC(null)} />}

        {sel && (
          <CenterSheet center title={((sourcesOf(st).find((x) => x.id === sel) || {}).title) || L("Titul", "Title")} onClose={() => setSel(null)}>
            <ContentDetail id={sel} onClose={() => setSel(null)} onExpand={() => { setFull(sel); setSel(null); }} />
          </CenterSheet>
        )}
      </>
    );
  }

  return { OriginBadge, ContentDetail, ContentRow, PageContent };
}
