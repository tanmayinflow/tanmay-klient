import React, { useState } from "react";
import { storageSizeSummary, decodeRecoveryArchive, localSaveDiagnostic } from "../product/localPersistence.js";

/** Read-only, local diagnostics. Never renders keys, record text or identifiers. */
export function LocalStorageStatus({ t, L, getDocument, writer }) {
  const [result, setResult] = useState(null);
  const inspect = async () => {
    try {
      const storage = window.localStorage, { coll, edits } = getDocument();
      const collText = storage.getItem("tanmay_coll_v1"), editsText = storage.getItem("tanmay_edits_v1");
      const persisted = JSON.parse(collText || "null");
      const sizes = storageSizeSummary(storage), rawArchive = storage.getItem("tanmay_zaloha_v1");
      let snapshots = null, archiveError = null;
      try { snapshots = (await decodeRecoveryArchive(rawArchive)).length; } catch (error) { archiveError = error?.name || "Error"; }
      setResult({ matches: collText === JSON.stringify(coll) && editsText === JSON.stringify(edits), sizes,
        exercises: Array.isArray(persisted?.tEx) ? persisted.tEx.length : 0, snapshots, archiveError,
        compressed: !!rawArchive && !rawArchive.trimStart().startsWith("["), lastFailure: writer.lastFailure() });
    } catch (error) { setResult({ error: error?.name || "Error" }); }
  };
  const chars = n => Number(n).toLocaleString(L("cs-CZ", "en-GB"));
  return <details style={{ padding: "10px 8px", fontSize: 12, lineHeight: 1.6, color: t.textSec }}>
    <summary style={{ cursor: "pointer" }}>{L("Kontrola místního uložení", "Check local saving")}</summary>
    <p>{L("Kontrola pouze čte uložená data v tomto zařízení. Zobrazuje jejich velikost a počty, bez obsahu zápisků.", "This check only reads saved data on this device. It shows sizes and counts without the contents of your writing.")}</p>
    <button type="button" onClick={inspect} style={{ color: t.text, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>{L("Zkontrolovat uložení", "Check saving")}</button>
    {result && <div role="status" aria-live="polite" style={{ marginTop: 8, overflowWrap: "anywhere" }}>
      {result.error ? result.error : <>
        <div>{result.matches ? L("Místní dokument odpovídá aktuálním změnám.", "The local document matches the current changes.") : L("Místní dokument se liší od aktuálního stavu. Zkus uložení znovu nebo stáhni zálohu.", "The local document differs from the current state. Try saving again or download a backup.")}</div>
        <div>{L("Uložených cviků", "Saved exercise rows")}: {result.exercises}</div>
        <div>{L("Znaky: dokument / zálohy / ostatní", "Characters: document / backups / other")}: {chars(result.sizes.documentCharacters)} / {chars(result.sizes.backupCharacters)} / {chars(result.sizes.otherCharacters)}</div>
        <div>{L("Obnovitelné snímky", "Recoverable snapshots")}: {result.archiveError || result.snapshots}{result.compressed && !result.archiveError ? L(" · bezeztrátově komprimované", " · losslessly compressed") : ""}</div>
        {result.lastFailure && <div>{L("Poslední chyba v tomto otevření", "Last error during this visit")}: {localSaveDiagnostic(result.lastFailure, L)}</div>}
      </>}
    </div>}
  </details>;
}
