import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { parseDate } from "@internationalized/date";
import { Select } from "../assets/react/Select";
import { NativeSelect } from "../assets/react/NativeSelect";
import { Switch, SwitchCard } from "../assets/react/Switch";
import { SettingsRow } from "../assets/react/SettingsRow";
import { Accordion } from "../assets/react/Accordion";
import { NumberField } from "../assets/react/NumberField";
import { Segmented } from "../assets/react/Segmented";
import { RollingNumber } from "../assets/react/RollingNumber";
import { ThinkingIndicator } from "../assets/react/ThinkingIndicator";
import { DateRangePicker } from "../assets/react/DateRangePicker";

afterEach(() => cleanup());
const open = (el: HTMLElement) => { fireEvent.click(el); return screen.getByRole("listbox"); };

describe("unvibe components", () => {
  it("Select: shows the choice, drops duplicate values, maps the empty value", () => {
    function Demo() { const [v, setV] = useState(""); return <><Select aria-label="Status" value={v} onChange={setV} options={[{ value: "", label: "Any" }, { value: "a", label: "Active" }, { value: "a", label: "Dup" }, { value: "p", label: "Paused" }]} /><p>v={v}</p></>; }
    render(<Demo />);
    const trigger = screen.getByLabelText("Status");
    const list = open(trigger);
    expect(within(list).getAllByRole("option").map((o) => o.textContent)).toEqual(["Any", "Active", "Paused"]);
    fireEvent.click(within(list).getByRole("option", { name: "Paused" }));
    expect(screen.getByText("v=p")).toBeTruthy();
    expect(screen.getByLabelText("Status").textContent).toContain("Paused");
  });
  it("NativeSelect: same children and onChange, named by its wrapping label", () => {
    const onChange = vi.fn();
    render(<label>Campaign<NativeSelect value="1" onChange={(e) => onChange(e.target.value)}><option value="1">One</option><optgroup label="More"><option value="2">Two</option></optgroup></NativeSelect></label>);
    const trigger = screen.getByLabelText("Campaign");
    fireEvent.click(within(open(trigger)).getByRole("option", { name: "Two" }));
    expect(onChange).toHaveBeenCalledWith("2");
  });
  it("Switch, SwitchCard and SettingsRow", () => {
    function Demo() { const [a, setA] = useState(false); const [b, setB] = useState(true); return <><SettingsRow title="Dynamic creative" description="Lets the platform mix your assets."><Switch label="Dynamic creative" checked={a} onChange={setA} /></SettingsRow><SwitchCard title="Audience expansion" checked={b} onChange={setB} /><p>{String(a)}-{String(b)}</p></>; }
    render(<Demo />);
    fireEvent.click(screen.getByRole("switch", { name: "Dynamic creative" }));
    fireEvent.click(screen.getByRole("switch", { name: /Audience expansion/ }));
    expect(screen.getByText("true-false")).toBeTruthy();
  });
  it("Accordion keeps closed content mounted but inert", () => {
    render(<Accordion title="Advanced"><input aria-label="Inside" /></Accordion>);
    const head = screen.getByRole("button", { name: /Advanced/ });
    expect(head.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById(head.getAttribute("aria-controls")!)!.hasAttribute("inert")).toBe(true);
    fireEvent.click(head);
    expect(head.getAttribute("aria-expanded")).toBe("true");
  });
  it("NumberField: buttons step faster than typing, bounded", () => {
    function Demo() { const [v, setV] = useState("9.50"); return <><NumberField aria-label="Bid" value={v} step={0.01} buttonStep={1} min={0} max={10} onChange={(e) => setV(e.target.value)} /><p>v={v}</p></>; }
    render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(screen.getByText("v=10.00")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Increase" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(screen.getByText("v=9.00")).toBeTruthy();
  });
  it("Segmented, RollingNumber, ThinkingIndicator", () => {
    function Demo() { const [v, setV] = useState<"7" | "30">("7"); return <Segmented label="Period" value={v} onChange={setV} options={[{ value: "7", label: "7 days" }, { value: "30", label: "30 days" }]} />; }
    render(<><Demo /><RollingNumber text="€22,342" /><ThinkingIndicator since={Date.now() - 3000} /></>);
    fireEvent.click(screen.getByRole("button", { name: "30 days" }));
    expect(screen.getByRole("button", { name: "30 days" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByLabelText("€22,342")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("Thinking");
  });
  it("DateRangePicker: a preset applies in one click", () => {
    const onApply = vi.fn();
    const r = { start: parseDate("2026-10-01"), end: parseDate("2026-10-30") };
    render(<DateRangePicker value={null} presets={[{ label: "Last 30 days", range: r }]} onApply={onApply} onCancel={() => {}} maxValue={parseDate("2026-10-31")} />);
    fireEvent.click(screen.getByRole("menuitemradio", { name: /Last 30 days/ }));
    expect(onApply).toHaveBeenCalledWith(r);
    expect(screen.getAllByRole("grid").length).toBe(2);
  });
});
