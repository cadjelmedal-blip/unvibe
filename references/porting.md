# Porting: your colors, your stack

## 1. Map the tokens (10 minutes)

Open your design tokens (CSS variables, `tailwind.config`, a `DESIGN_SYSTEM.md`) and fill this table. Keep
every size, radius, duration and weight from `unvibe.css`; change only colors and fonts.

| unvibe token | Role | How to choose yours |
|---|---|---|
| `--uv-canvas` | page background | your app background (slightly tinted is better than pure white) |
| `--uv-surface` | what floats: menus, modals, tiles inside sunken areas | usually `#fff` |
| `--uv-sunken` | fields, KPI tiles, tracks | canvas darkened by ~3–4% lightness |
| `--uv-sunken-hover` | field hover | sunken darkened by ~2% |
| `--uv-sunken-soft` | header bands, filled lists inside white | between canvas and white |
| `--uv-track`, `--uv-chip` | segmented tracks, count chips, icon buttons | sunken darkened by 2% and 5% |
| `--uv-rule`, `--uv-rule-2`, `--uv-rule-3` | hairlines, borders, strong borders | your existing border grays |
| `--uv-ink`, `--uv-ink-2`, `--uv-ink-3` | text levels | check ≥ 4.5:1 for ink-3 on canvas |
| `--uv-sel`, `--uv-sel-tint`, `--uv-sel-line` | selected / current / focus | your brand's calm color (blue, green, violet…) at ~45% lightness, its tint at ~93% |
| `--uv-accent` + gradient stops | the one primary action | your brand's loud color; top stop +6% lightness, bottom −3% |
| `--uv-danger`, `--uv-warn`, `--uv-info` + tints | meaning | keep them muted, tints at ~95% lightness |
| `--uv-shadow-rgb` | shadow tint | your darkest ink as `r g b` |
| `--uv-font`, `--uv-font-display` | text and display faces | your fonts |

If your brand uses **one** color for both selection and action, keep it for the action and derive a calmer
selection color (darker, less saturated) — the separation is worth it.

## 2. Pick the integration

- **Plain CSS / any framework (Vue, Svelte, Rails, Django templates)**: import `assets/css/unvibe.css`
  after your base styles and use the `uv-` classes. Only the interactive behaviors (menus, glide, number
  steppers) need a few lines of JS in your framework.
- **Tailwind 3**: import the CSS file globally (it is plain CSS; it does not need Tailwind). Optionally mirror
  the tokens in `tailwind.config.js` `theme.extend.colors` so utilities can use them.
- **Tailwind 4**: import it after `@import "tailwindcss"`. Unlayered rules beat `@layer utilities`, so the
  `uv-` classes win over utilities on the same element; put utilities on wrappers instead.
- **React**: the components in `assets/react/` need `react-aria-components` (and `@internationalized/date`
  for the date picker), React 18+. They use the `uv-` classes, not Tailwind, so they work with any CSS setup.
- **An existing component library** (shadcn/ui, MUI, Mantine…): do not fight it; restyle its parts with the
  catalogue's numbers (radius, fills, focus ring, menu item states). shadcn's Select/Popover/Switch map 1:1.

## 3. Retrofit an existing app in this order

1. Tokens and the global rules (accent-color, tabular numbers, reduced motion).
2. Words: kill tracked uppercase labels, emoji headings, check glyphs (fast, visible, zero risk).
3. Buttons and fields (one pass across the app).
4. Menus: replace native selects (audit first, see `pitfalls.md`).
5. Switches for yes/no settings; settings rows.
6. Tables: one header band; frames; selected rows.
7. Rebuild the 3–5 most visible screens on references (dashboard, AI screen, activity, settings, bulk grid).
8. The sweep: every remaining screen, the same details.
9. Verification (before/after + no regression).

## 4. Dark surfaces

The catalogue is written for light screens with a dark "stage" for long jobs and media viewers. On a dark
stage: translucent light fills (`rgb(canvas / .04–.08)`) instead of white, light borders at 8% opacity, text
in a pale tint of your selection color, the accent for the final success mark only, and dark menus (no light
pill in the middle of a dark area). A full dark theme is the same mapping with inverted lightness steps.
