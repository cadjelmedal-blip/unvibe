"use client";

import type { ReactNode } from "react";
import { Switch as AriaSwitch } from "react-aria-components";

/** Every yes/no setting is a switch. Checkboxes stay for multi-select lists and consents. */
export function Switch({ checked, onChange, label, size = "md", disabled }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; size?: "sm" | "md"; disabled?: boolean;
}) {
  return (
    <AriaSwitch isSelected={checked} onChange={onChange} isDisabled={disabled} aria-label={label} className={`uv-switch${size === "sm" ? " uv-switch--sm" : ""}`}>
      <span className="uv-switch__thumb" />
    </AriaSwitch>
  );
}

/** One important setting on its own: the whole card toggles. */
export function SwitchCard({ checked, onChange, title, description, icon, disabled }: {
  checked: boolean; onChange: (v: boolean) => void; title: string; description?: ReactNode; icon?: ReactNode; disabled?: boolean;
}) {
  return (
    <AriaSwitch isSelected={checked} onChange={onChange} isDisabled={disabled} className={`uv-switch-card${checked ? " is-on" : ""}`}>
      <span className="uv-setting__text">
        <span className="uv-setting__title">{icon}{title}</span>
        {description && <span className="uv-setting__desc">{description}</span>}
      </span>
      <span className="uv-switch" data-selected={checked || undefined} aria-hidden><span className="uv-switch__thumb" /></span>
    </AriaSwitch>
  );
}
