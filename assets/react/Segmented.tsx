"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * A segmented control whose white pill GLIDES to the chosen option (spring), instead of one option
 * switching off and another switching on. The pill is one element moved with CSS variables.
 * The first placement does not animate (data-settled is set after it), so nothing flies in on load.
 */
export function Segmented<T extends string>({ value, onChange, options, label, compact = false }: {
  value: T; onChange: (v: T) => void; options: Array<{ value: T; label: ReactNode }>; label: string; compact?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);
  useLayoutEffect(() => {
    const root = track.current;
    const active = root?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!root || !active) return;
    const place = () => {
      root.style.setProperty("--g-x", `${active.offsetLeft}px`);
      root.style.setProperty("--g-y", `${active.offsetTop}px`);
      root.style.setProperty("--g-w", `${active.offsetWidth}px`);
      root.style.setProperty("--g-h", `${active.offsetHeight}px`);
    };
    place();
    // Labels can change width (fonts loading, translations): keep the pill on its option.
    const watch = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    watch?.observe(root);
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => { watch?.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return (
    <div ref={track} role="group" aria-label={label} className={`uv-seg${compact ? " uv-seg--compact" : ""}`} data-glide="" data-settled={settled ? "" : undefined}>
      <span className="uv-seg__glide" aria-hidden />
      {options.map((o) => (
        <button key={o.value} type="button" className="uv-seg__item" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
