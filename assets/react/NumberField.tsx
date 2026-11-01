"use client";

import type { InputHTMLAttributes } from "react";

/**
 * A number input with − and + inside the field (the browser spinners are hidden).
 * `buttonStep` lets the buttons move faster than typing precision: a bid is typed to the cent and
 * nudged by the euro. The buttons respect min/max and emit the same { target: { value } } as typing.
 */
export function NumberField({ value, onChange, step = 1, buttonStep, min, max, ...rest }: {
  value: string; onChange: (e: { target: { value: string } }) => void; step?: number; buttonStep?: number; min?: number; max?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "min" | "max" | "step">) {
  const by = buttonStep ?? step;
  const decimals = (String(step).split(".")[1] ?? "").length;
  const bump = (dir: 1 | -1) => {
    const n = value === "" ? 0 : Number(value);
    if (!Number.isFinite(n)) return;
    let next = n + dir * by;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    onChange({ target: { value: next.toFixed(decimals) } });
  };
  const n = Number(value);
  return (
    <div className="uv-number-field">
      <input {...rest} className="uv-field uv-num" type="number" inputMode="decimal" value={value} step={step} min={min} max={max} onChange={(e) => onChange({ target: { value: e.target.value } })} />
      <span className="uv-stepper">
        <button type="button" aria-label="Decrease" disabled={rest.disabled || (min !== undefined && n <= min)} onClick={() => bump(-1)}>−</button>
        <button type="button" aria-label="Increase" disabled={rest.disabled || (max !== undefined && n >= max)} onClick={() => bump(1)}>+</button>
      </span>
    </div>
  );
}
