import type { ReactNode } from "react";

/**
 * A setting is a row: what it does on the left, the control on the right.
 * Locked rows say WHY in gray, without a yellow warning icon.
 */
export function SettingsRow({ title, description, locked, stacked = false, icon, children }: {
  title: string; description?: ReactNode; locked?: string; stacked?: boolean; icon?: ReactNode; children: ReactNode;
}) {
  return (
    <div className={`uv-setting${stacked ? " uv-setting--stacked" : ""}${locked ? " uv-setting--locked" : ""}`}>
      <div className="uv-setting__text">
        <p className="uv-setting__title">{icon}{title}</p>
        {description && <p className="uv-setting__desc">{description}</p>}
        {locked && <p className="uv-setting__desc">{locked}</p>}
      </div>
      <div className="uv-setting__control" inert={locked ? true : undefined}>{children}</div>
    </div>
  );
}
