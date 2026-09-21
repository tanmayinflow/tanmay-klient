import React, { useEffect, useState } from "react";
import { dailyIndex, nextMidnightDelay, wrapIndex } from "../product/dailyRotation.js";
import { TmIcon } from "./icons.jsx";

// Content is supplied by the owning application; no personal material in core.
export function MorningSpells({ items, L }) {
  const [day, setDay] = useState(() => new Date().toDateString());
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      const now = new Date();
      setDay(now.toDateString());
      timer = setTimeout(refresh, nextMidnightDelay(now));
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  useEffect(() => { setOffset(0); }, [day]);
  if (!items.length) return null;
  const index = wrapIndex(dailyIndex(new Date(day), items.length) + offset, items.length);
  const step = (direction) => setOffset((value) => wrapIndex(value + direction, items.length));
  return <section className="tm-morning-spells" aria-label={L("Věty proti zmaru", "Anti-doom spells")}>
    <div className="tm-spell-composition">
      <span className="tm-spell-sword" role="img" aria-label={L("Maňdžušrího hořící meč moudrosti", "Manjushri’s flaming sword of wisdom")} />
      <div className="tm-spell-reading">
        <h2>{L("Věty proti zmaru", "Anti-doom spells")}</h2>
        <p aria-live="polite" aria-atomic="true">{L(items[index].cs, items[index].en)}</p>
        <div className="tm-spell-controls">
          <button type="button" onClick={() => step(-1)} aria-label={L("Předchozí věta", "Previous statement")}><TmIcon id="back" size={18} /></button>
          <span>{index + 1} / {items.length}</span>
          <button type="button" onClick={() => step(1)} aria-label={L("Další věta", "Next statement")}><TmIcon id="forward" size={18} /></button>
        </div>
      </div>
    </div>
  </section>;
}
