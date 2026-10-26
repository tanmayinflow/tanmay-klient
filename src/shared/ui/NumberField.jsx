import React, { useRef } from "react";
import { TmIcon } from "./icons.jsx";

// Native numeric editing/keyboard behaviour, with transparent themed steppers.
export function NumberField({ theme: t, L, style, onChange, ...props }) {
  const ref = useRef(null);
  const step = direction => {
    if (props.disabled || props.readOnly) return;
    direction > 0 ? ref.current.stepUp() : ref.current.stepDown();
    onChange?.({ target: ref.current, currentTarget: ref.current });
  };
  return <span style={{ display: "inline-flex", position: "relative", minWidth: 0, width: style?.width || "100%" }}>
    <input {...props} ref={ref} type="number" onChange={onChange} style={{ ...style, width: "100%", minWidth: 0, minHeight: 44, paddingRight: 38, boxSizing: "border-box" }}/>
    <span style={{ position: "absolute", right: 1, top: 1, bottom: 1, width: 34, display: "grid", gridTemplateRows: "1fr 1fr" }}>
      {[1, -1].map(direction => <button key={direction} type="button" tabIndex={-1} disabled={props.disabled || props.readOnly}
        aria-label={direction > 0 ? L("Zvýšit hodnotu", "Increase value") : L("Snížit hodnotu", "Decrease value")}
        onClick={() => step(direction)} style={{ display: "grid", placeItems: "center", padding: 0, border: 0, background: "transparent", color: t.textMuted, cursor: "pointer" }}>
        <TmIcon id="expand" size={12} style={{ transform: direction > 0 ? "rotate(180deg)" : "none" }}/>
      </button>)}
    </span>
  </span>;
}
