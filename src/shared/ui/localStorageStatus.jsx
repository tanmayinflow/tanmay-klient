import React, { useState } from "react";
import { storageSizeSummary, createRecoveryArchive, localSaveDiagnostic } from "../product/localPersistence.js";

/** Read-only, local diagnostics. Never renders keys, record text or identifiers. */
export function LocalStorageStatus({ t, L, getDocument, writer, documentStorage }) {
  const [result, setResult] = useState(null);
  const inspect = async () => {
    try {
      await writer.settled();
      const storage = window.localStorage, { coll, edits } = getDocument();
      const documents = documentStorage || storage;
      const collText = documents.getItem("tanmay_coll_v1"), editsText = documents.getItem("tanmay_edits_v1");
      const persisted = JSON.parse(collText || "null");
      const sizes = storageSizeSummary(storage);
      let snapshots = null, archiveError = null, archive = null;
      try { archive = await createRecoveryArchive({ getStorage: () => storage }).inspect(); snapshots = archive.count; } catch (error) { archiveError = error?.name || "Error"; }
      setResult({ matches: collText === JSON.stringify(coll) && editsText === JSON.stringify(edits), sizes,
        exercises: Array.isArray(persisted?.tEx) ? persisted.tEx.length : 0, snapshots, archiveError,
        durableDocument: !!documentStorage?.isActive(), documentCharacters: (collText || "").length + (editsText || "").length,
        compressed: archive?.compressed, separateCharacters: archive?.separateCharacters || 0, lastFailure: writer.lastFailure() });
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
        {result.durableDocument && <div>{L("Dokument v rozšířeném místním úložišti", "Document in expanded local storage")}: {chars(result.documentCharacters)} {L("znaků", "characters")}</div>}
        <div>{L("Znaky: dokument / zálohy / ostatní", "Characters: document / backups / other")}: {chars(result.sizes.documentCharacters)} / {chars(result.sizes.backupCharacters)} / {chars(result.sizes.otherCharacters)}</div>
        <div>{L("Obnovitelné snímky", "Recoverable snapshots")}: {result.archiveError || result.snapshots}{result.compressed && !result.archiveError ? L(" · bezeztrátově komprimované", " · losslessly compressed") : ""}</div>
        {result.separateCharacters > 0 && <div>{L("Zálohy v odděleném úložišti", "Backups in separate storage")}: {chars(result.separateCharacters)} {L("znaků", "characters")}</div>}
        {result.lastFailure && <div>{L("Poslední chyba v tomto otevření", "Last error during this visit")}: {localSaveDiagnostic(result.lastFailure, L)}</div>}
      </>}
    </div>}
  </details>;
}
