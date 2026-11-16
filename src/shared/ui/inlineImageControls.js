// Images remain part of the note. Selection of their editing controls is
// transient DOM state and never becomes note content or sync data.
export function attachInlineImageControls(editor, { isLocked = () => false, label = "Edit image" } = {}) {
  if (!editor) return () => {};
  const doc = editor.ownerDocument;
  let held = null, active = null, timer = null, released = false;
  const figureAt = target => target?.closest?.("figure.tm-fig[data-img]");
  const cancelHold = () => { clearTimeout(timer); timer = null; held = null; };
  const hide = () => {
    cancelHold();
    if (active) {
      active.removeAttribute("data-tools-open");
      active.querySelector(".tm-fig-tools")?.setAttribute("aria-hidden", "true");
      active.querySelectorAll(".tm-fig-tools button").forEach(b => b.tabIndex = -1);
    }
    active = null;
  };
  const show = figure => {
    if (released || isLocked() || !editor.contains(figure)) return;
    hide(); active = figure;
    figure.setAttribute("data-tools-open", "true");
    figure.querySelector(".tm-fig-tools")?.setAttribute("aria-hidden", "false");
    figure.querySelectorAll(".tm-fig-tools button").forEach(b => b.tabIndex = 0);
  };
  const prepare = () => {
    if (active && !editor.contains(active)) hide();
    editor.querySelectorAll("figure.tm-fig[data-img]").forEach(figure => {
      figure.tabIndex = isLocked() ? -1 : 0;
      figure.setAttribute("role", "group");
      figure.setAttribute("aria-label", label);
      if (figure !== active) {
        figure.removeAttribute("data-tools-open");
        figure.querySelector(".tm-fig-tools")?.setAttribute("aria-hidden", "true");
        figure.querySelectorAll(".tm-fig-tools button").forEach(b => b.tabIndex = -1);
      }
    });
  };
  const down = e => {
    const figure = figureAt(e.target);
    if (active && (!figure || figure !== active)) hide();
    cancelHold();
    if (e.isPrimary === false || e.button > 0 || isLocked() || !figure || !editor.contains(figure) || e.target.closest(".tm-fig-tools")) return;
    held = { figure, x: e.clientX, y: e.clientY, pointerId: e.pointerId };
    timer = setTimeout(() => { if (held) show(held.figure); }, 500);
  };
  const move = e => {
    if (held && (e.pointerId !== held.pointerId || Math.hypot(e.clientX - held.x, e.clientY - held.y) > 10)) cancelHold();
  };
  const key = e => {
    const figure = figureAt(e.target);
    if (!figure || !editor.contains(figure)) return;
    if (e.key === "Escape" && active) {
      e.preventDefault(); e.stopPropagation(); hide(); figure.focus();
    } else if ((e.key === "Enter" || e.key === " ") && e.target === figure && !isLocked()) {
      e.preventDefault(); e.stopPropagation(); show(figure); figure.querySelector(".tm-fig-tools button")?.focus();
    }
  };
  const context = e => {
    const figure = figureAt(e.target);
    if (!figure || !editor.contains(figure) || isLocked()) return;
    e.preventDefault(); show(figure);
  };
  const blur = e => { if (active && e.relatedTarget && !active.contains(e.relatedTarget)) hide(); };
  const Observer = doc.defaultView.MutationObserver;
  const observer = new Observer(prepare);
  observer.observe(editor, { childList: true, subtree: true });
  prepare();
  doc.addEventListener("pointerdown", down, true);
  doc.addEventListener("pointermove", move, { passive: true });
  doc.addEventListener("pointerup", cancelHold, true);
  doc.addEventListener("pointercancel", cancelHold, true);
  doc.addEventListener("scroll", hide, true);
  editor.addEventListener("keydown", key, true);
  editor.addEventListener("contextmenu", context);
  editor.addEventListener("focusout", blur);
  return () => {
    released = true; hide(); observer.disconnect();
    doc.removeEventListener("pointerdown", down, true);
    doc.removeEventListener("pointermove", move);
    doc.removeEventListener("pointerup", cancelHold, true);
    doc.removeEventListener("pointercancel", cancelHold, true);
    doc.removeEventListener("scroll", hide, true);
    editor.removeEventListener("keydown", key, true);
    editor.removeEventListener("contextmenu", context);
    editor.removeEventListener("focusout", blur);
  };
}
