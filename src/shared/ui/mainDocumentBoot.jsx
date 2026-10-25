import React, { useEffect, useState } from "react";
import { mainDocuments } from "../product/mainDocumentStore.js";

// Do not mount the app's seed/sync effects until its latest local document is
// available. A failed read must never be mistaken for a first, empty visit.
export function MainDocumentBoot({ children }) {
  const [state, setState] = useState({ loading: true });
  const open = async () => {
    setState({ loading: true });
    try { await mainDocuments.initialize(); setState({ ready: true }); }
    catch (error) { setState({ error }); }
  };
  useEffect(() => { let current = true; mainDocuments.initialize().then(() => { if (current) setState({ ready: true }); }, error => { if (current) setState({ error }); }); return () => { current = false; }; }, []);
  if (state.ready) return children;
  let en = false;
  try { en = localStorage.getItem("tm-lang") === "en"; } catch {}
  const L = (cs, english) => en ? english : cs;
  const branch = state.error?.name === "DocumentBranchConflict";
  const download = () => {
    let legacy;
    try { legacy = { coll: localStorage.getItem("tanmay_coll_v1"), edits: localStorage.getItem("tanmay_edits_v1") }; } catch {}
    const blob = new Blob([JSON.stringify({ format: "tanmay-local-recovery-v1", durable: state.error?.durable, legacy: state.error?.legacy || legacy }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = "tanmay-local-recovery.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const choose = async choice => {
    setState({ ...state, loading: true });
    try { await mainDocuments.resolveBranch(choice); setState({ ready: true }); }
    catch (error) { setState({ error }); }
  };
  const button = { font: "inherit", color: "inherit", padding: "12px 16px", border: "1px solid currentColor", borderRadius: 10, background: "transparent", cursor: "pointer" };
  return <main style={{ maxWidth: 520, margin: "12vh auto", padding: 24, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
    <p role="status">{state.loading ? L("Načítám uložené změny…", "Loading saved changes…") : branch
      ? L("V tomto zařízení jsou dvě různé uložené verze. Obě zůstanou zachované; vyber, se kterou chceš pokračovat.", "This device has two different saved versions. Both will be preserved; choose which one to continue with.")
      : L("Uložená data se nepodařilo načíst. Zkus otevření znovu. Původní data zůstávají zachovaná.", "Saved data could not be loaded. Try opening again. The original data is preserved.")}</p>
    {!state.loading && <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <button style={button} onClick={open}>{L("Zkusit znovu", "Try again")}</button>
      <button style={button} onClick={download}>{branch ? L("Stáhnout obě verze", "Download both versions") : L("Stáhnout dostupnou zálohu", "Download available backup")}</button>
      {branch && <>
        <button style={button} onClick={() => choose("durable")}>{L("Verze z této aplikace", "Version from this app")}</button>
        <button style={button} onClick={() => choose("legacy")}>{L("Verze ze staršího okna", "Version from the older window")}</button>
      </>}
    </div>}
  </main>;
}
