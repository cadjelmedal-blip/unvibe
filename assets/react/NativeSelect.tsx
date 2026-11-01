"use client";

import { Children, Fragment, isValidElement, useCallback, useState, type ChangeEvent, type ReactNode } from "react";
import { Select, type Option } from "./Select";

/**
 * A drop-in for an existing <select>: same <option>/<optgroup> children, same onChange
 * (an event whose target.value carries the value, as text). Swap the tag, change nothing else.
 *
 * Two things a naive swap breaks, handled here:
 * 1. The accessible name. A <select> inside a <label> is named by the label; a React Aria trigger
 *    is named by its current value ("All" instead of "Status"). We read the wrapping <label>
 *    (or label[for=id]) after mount, without the menu's own text, and keep it in sync.
 * 2. Duplicate values (Select drops them: React Aria would throw and blank the screen).
 */
type Props = {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children?: ReactNode;
};

function text(node: ReactNode): string {
  return Children.toArray(node).map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement(c) ? text((c.props as { children?: ReactNode }).children) : "")).join("");
}

function read(children: ReactNode, group?: string): Option[] {
  const out: Option[] = [];
  Children.forEach(children, (c) => {
    if (!isValidElement(c)) return;
    const p = c.props as { value?: string | number; children?: ReactNode; disabled?: boolean; label?: string };
    if (c.type === "option") out.push({ value: String(p.value ?? text(p.children)), label: text(p.children), disabled: p.disabled, group });
    else if (c.type === "optgroup") out.push(...read(p.children, p.label));
    else if (c.type === Fragment) out.push(...read(p.children, group));
  });
  return out;
}

/** The label's text without the menu inside it: what a <select> would have used as its name. */
function labelText(label: HTMLElement, menu: HTMLElement): string {
  const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
  let s = "";
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const control = n.parentElement?.closest("button, select, textarea, [aria-hidden='true'], .uv-native-select");
    if (!menu.contains(n) && !(control && label.contains(control))) s += n.textContent ?? "";
  }
  return s.replace(/\s+/g, " ").trim();
}

export function NativeSelect({ value, defaultValue, onChange, children, className, ...rest }: Props) {
  const options = read(children);
  const [inner, setInner] = useState(String(defaultValue ?? options[0]?.value ?? ""));
  const current = value !== undefined ? String(value) : inner;
  const [adopted, setAdopted] = useState<string>();
  const named = Boolean(rest["aria-label"] || rest["aria-labelledby"]);
  const adoptLabel = useCallback((el: HTMLSpanElement | null) => {
    const label = el && !named ? (el.parentElement?.closest("label") ?? (rest.id ? document.querySelector<HTMLElement>(`label[for="${CSS.escape(rest.id)}"]`) : null)) : null;
    if (!el || !label) return;
    const sync = () => setAdopted(labelText(label, el) || undefined);
    sync();
    const watch = new MutationObserver(sync);   // a label that changes ("Campaign" ↔ "Ad set") renames the menu
    watch.observe(label, { subtree: true, childList: true, characterData: true });
    return () => watch.disconnect();
  }, [named, rest.id]);
  return (
    <span ref={adoptLabel} className={`uv-native-select ${className ?? ""}`} style={{ display: "block" }}>
      <Select
        value={current}
        options={options}
        disabled={rest.disabled}
        aria-label={rest["aria-label"] ?? (rest["aria-labelledby"] ? undefined : adopted)}
        aria-labelledby={rest["aria-labelledby"]}
        onChange={(v) => {
          if (value === undefined) setInner(v);
          const target = { value: v, name: rest.name ?? "" };
          onChange?.({ target, currentTarget: target } as unknown as ChangeEvent<HTMLSelectElement>);
        }}
      />
      {rest.name && <input type="hidden" name={rest.name} value={current} />}
    </span>
  );
}
