"use client";

import type { ReactNode } from "react";
import { Button, Header, ListBox, ListBoxItem, ListBoxSection, Popover, Select as AriaSelect, SelectValue, type Key } from "react-aria-components";

/**
 * The menu that replaces the native <select>.
 * - The current choice reads without hovering: pale selection fill + a check (CSS: .uv-option).
 * - Hover is a different color from "selected", so the two are never confused.
 * - Keyboard, type-ahead and screen readers come from React Aria.
 * - Two looks: "field" (filled, 36px, sits next to inputs) and "toolbar" (white, bordered).
 * - Duplicate values are dropped (React Aria throws on duplicate keys; a <select> tolerated them).
 * - An empty value ("Choose…") is a real option: React Aria wants non-empty keys, so we map it.
 */
export type Option = { value: string; label: string; group?: string; disabled?: boolean };

const EMPTY = "\u0000empty";
const toKey = (v: string) => (v === "" ? EMPTY : v);
const fromKey = (k: Key | null) => (k == null || k === EMPTY ? "" : String(k));

export function Select({
  value, onChange, options, appearance = "field", placeholder = "Choose…", prefix, icon,
  disabled, className, popoverClassName, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  appearance?: "field" | "toolbar";
  placeholder?: string;
  /** The filter's name in gray before the value: "Campaign  All". */
  prefix?: string;
  /** A pictogram before the value, like the calendar of a period. */
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const unique = options.filter((o, i, all) => all.findIndex((x) => x.value === o.value) === i);
  const known = unique.some((o) => o.value === value);
  const groups = [...new Set(unique.flatMap((o) => (o.group ? [o.group] : [])))];
  const item = (o: Option) => (
    <ListBoxItem key={toKey(o.value)} id={toKey(o.value)} textValue={o.label} isDisabled={o.disabled} className="uv-option">
      {o.label}
    </ListBoxItem>
  );
  return (
    <AriaSelect
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      isDisabled={disabled}
      placeholder={placeholder}
      selectedKey={known ? toKey(value) : null}
      onSelectionChange={(k) => { const v = fromKey(k); if (v !== value) onChange(v); }}
      className={className}
    >
      <Button className={`uv-select-trigger ${appearance === "field" ? "uv-field" : "uv-select-trigger--toolbar"}`}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {icon && <span aria-hidden style={{ display: "flex", color: "var(--uv-ink-3)" }}>{icon}</span>}
          {prefix && <span className="uv-prefix">{prefix}</span>}
          <SelectValue>{({ isPlaceholder, selectedText }) => (isPlaceholder ? <span className="uv-muted">{placeholder}</span> : selectedText)}</SelectValue>
        </span>
        <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6.5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Button>
      <Popover className={`uv-popover ${popoverClassName ?? ""}`} offset={6}>
        <ListBox style={{ outline: "none" }}>
          {unique.filter((o) => !o.group).map(item)}
          {groups.map((g) => (
            <ListBoxSection key={g} id={`group:${g}`}>
              <Header className="uv-popover-section">{g}</Header>
              {unique.filter((o) => o.group === g).map(item)}
            </ListBoxSection>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
