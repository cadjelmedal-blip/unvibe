"use client";

import { useState } from "react";
import { Button, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, Heading, RangeCalendar } from "react-aria-components";
import type { DateValue } from "@internationalized/date";

/**
 * A date range like a pro analytics tool: one-click presets on the left (Yesterday, 7/14/30 days,
 * This month, Last month, 90/180/365 days, All), two months on the right where you draw your range,
 * Cancel / Apply, and the range with its day count in the footer. Days without data are disabled
 * (pass minValue = first day with data, maxValue = yesterday).
 */
export type DateRange = { start: DateValue; end: DateValue };
export type Preset = { label: string; hint?: string; range: DateRange };

export function DateRangePicker({ value, presets, onApply, onCancel, minValue, maxValue, locale = "en-US" }: {
  value: DateRange | null;
  presets: Preset[];
  onApply: (range: DateRange) => void;
  onCancel: () => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
}) {
  const [draft, setDraft] = useState<DateRange | null>(value);
  const days = draft ? draft.end.compare(draft.start) + 1 : 0;
  const same = (a: DateRange | null, b: DateRange) => Boolean(a && a.start.compare(b.start) === 0 && a.end.compare(b.end) === 0);
  const fmt = (d: DateValue) => new Date(d.year, d.month - 1, d.day).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  const grid = (offset: number) => (
    <CalendarGrid offset={offset ? { months: offset } : undefined} className="uv-range__month">
      <CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
      <CalendarGridBody>{(date) => <CalendarCell date={date} className="uv-day" />}</CalendarGridBody>
    </CalendarGrid>
  );
  return (
    <div className="uv-range">
      <ul className="uv-range__presets" role="menu" aria-label="Presets">
        {presets.map((p) => (
          <li key={p.label}>
            <button type="button" role="menuitemradio" aria-checked={same(draft, p.range)} onClick={() => onApply(p.range)}>
              {p.label}{p.hint && <small>{p.hint}</small>}
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <RangeCalendar aria-label="Date range" visibleDuration={{ months: 2 }} value={draft} onChange={setDraft} minValue={minValue} maxValue={maxValue}>
          <header className="uv-range__nav">
            <Button slot="previous" aria-label="Previous month">‹</Button>
            <Heading />
            <Button slot="next" aria-label="Next month">›</Button>
          </header>
          <div className="uv-range__months">{grid(0)}{grid(1)}</div>
        </RangeCalendar>
        <footer className="uv-range__foot">
          <span className="uv-num">{draft ? `${fmt(draft.start)} – ${fmt(draft.end)} · ${days} day${days > 1 ? "s" : ""}` : "Pick a start and an end"}</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" className="uv-btn uv-btn--ghost" onClick={onCancel}>Cancel</button>
            <button type="button" className="uv-btn" disabled={!draft} onClick={() => draft && onApply(draft)}>Apply</button>
          </span>
        </footer>
      </div>
    </div>
  );
}
