"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Replaces <details>: the chevron turns, the opening pushes what follows smoothly (grid rows 0fr → 1fr),
 * and closed content stays mounted but inert (no hidden focus traps, no lost form state).
 */
export function Accordion({ title, icon, open: controlled, defaultOpen = false, onOpenChange, children }: {
  title: ReactNode; icon?: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode;
}) {
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ?? inner;
  const id = useId();
  const toggle = () => { const next = !open; if (controlled === undefined) setInner(next); onOpenChange?.(next); };
  return (
    <div className={`uv-accordion${open ? " is-open" : ""}`}>
      <button type="button" className="uv-accordion__head" aria-expanded={open} aria-controls={id} onClick={toggle}>
        {icon}{title}
        <svg className="uv-accordion__chev" aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6.5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div id={id} className="uv-accordion__body" inert={!open ? true : undefined}>
        <div className="uv-accordion__inner">{children}</div>
      </div>
    </div>
  );
}
