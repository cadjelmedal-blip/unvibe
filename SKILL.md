---
name: unvibe
description: Make AI-built ("vibecoded") web interfaces look hand-designed. A catalogue of 140+ measured micro-details (buttons, filled fields, real menus instead of native selects, switches and settings rows, KPI tiles, tables and data grids, trees, activity feeds, AI agent threads, progress journals, date ranges, motion) with exact values, a drop-in CSS file, React Aria components, a reference-driven method (measure a professional template, map it to your tokens) and a before/after + no-regression protocol. Use whenever someone says the UI looks generic, generated, AI-made, "vibecoded", "cheap", "not pro", asks to "make it better", "polish", "level up the design", "clean up the UI", "make it look like Linear/Stripe", or wants to replace native selects/checkboxes, redo a dashboard, settings page, activity log or AI chat screen — even if they never say "design system". Works with React/Next.js and any CSS setup (Tailwind 3 or 4, plain CSS).
---

# unvibe

This skill turns an interface that looks generated into one that looks designed. It does not invent a new
style: it applies a catalogue of small, measured details that professional interfaces share and generated
ones miss, mapped to the project's own colors. It was extracted from a real two-day polish pass on a
production SaaS (`references/case-study.md`); every rule exists because breaking it was noticed.

**Map your colors, keep the numbers.** The proportions (radii, paddings, sizes, durations, weights) carry the
quality. Colors are the only thing you adapt.

## Before you start

1. Read `references/tells.md` (what makes a UI look generated, with the replacement for each).
2. Read the project's design tokens and any design doc. Fill the token table in `references/porting.md`.
3. Ask the owner which screens bother them most and what they like. **Keep what they like**; never remove
   what they understand ("I love this, it's understandable — just format it better" means restyle, not cut).
4. Note the stack: React or not, Tailwind 3/4 or plain CSS, an existing component library or not, a
   headless library (React Aria) or not.

## The workflow

### Phase 1 · Foundations (one pass, whole app)
Tokens (`assets/css/unvibe.css` section 1, mapped), native leftovers in the brand color, tabular numbers,
reduced motion, motion curves. Then **words**: remove tracked uppercase labels, emoji headings, ✓ glyphs in
badges, exclamation marks (catalogue §0–§1). Fast, visible, zero risk.

### Phase 2 · Controls (one pass, whole app)
Buttons with relief and one primary per screen (§2) · filled fields, one height per row (§3) · real menus
instead of native selects (§4; audit every call site first, `references/pitfalls.md`) · switches for every
yes/no, switch cards for important ones, radio cards for visible choices, tags (§6) · segmented controls
whose pill glides (§5).

### Phase 3 · Rebuild the most visible screens on references
Pick the 3–5 screens people see most and rebuild each on the closest professional template, measured
(`references/method.md`): analytics overview → KPI tiles (§9); AI screen → agent thread (§12); activity →
feed (§11); settings → rows (§7); bulk lists → data grid (§10); long jobs → journal (§13); dates → presets +
two months (§15).

### Phase 4 · The sweep
Every remaining screen gets the same details: one table header band, one field style, one menu, one badge
style, callouts as filled zones, lists as framed blocks, the same filter height on every list page (§8, §10,
§16). Inconsistency between sibling screens is itself a tell.

### Phase 5 · Prove it
Before/after captures of production vs branch with `scripts/capture.mjs` and a side-by-side page with
`scripts/compare.mjs`. Keep only pairs whose difference is obvious at a glance. Then run the full
no-regression pass in `references/verification.md` before pushing.

## Golden rules

1. **Selection ≠ action.** A calm color marks what is chosen; the loud brand color is for the one primary
   action per screen.
2. **Hover ≠ selected.** Hover is neutral; selected is a pale tint plus a check.
3. **Three surfaces**: canvas, white for what floats, a darker *sunken* fill for fields and tiles.
4. **No tracked capitals, no emoji headings, no check glyphs, no colored left bars.**
5. **Every control on a row shares height and fill.**
6. **Every yes/no is a switch**; checkboxes are for lists and consents.
7. **A setting is a row**: what it does on the left, the control on the right; locked rows say why in gray.
8. **Numbers are 24/34 in filled tiles** with an icon chip and a delta pill colored by meaning (a cost going
   up is red).
9. **One table header band everywhere**, sentence case, in a 16px frame; selected rows get a 3px inset bar.
10. **AI answers are text in a thread**, with what was read and the real elapsed time; never fake steps.
11. **Motion follows a state change**, never a hover; press scales to .985; menus and modals arrive.
12. **Never a guessed number, never a decorative control.** If data is missing, say "Not determined"; if a
    field does not do anything, remove it.
13. **Do the siblings in the same pass.**
14. **Show only visible differences**, and prove there is no regression.

## What is in this skill

| Path | Use it for |
|---|---|
| `references/catalogue.md` | every detail with its exact values (§0 foundations → §17 never-list) |
| `references/tells.md` | the generated-UI tells and their replacements |
| `references/method.md` | reference-driven redesign: pick, measure, map, rebuild, prove |
| `references/pitfalls.md` | the bugs polish brings (menus in modals, duplicate keys, lost names, CSS layers, tests) |
| `references/verification.md` | before/after and the no-regression pass |
| `references/porting.md` | token mapping, Tailwind 3/4, other frameworks, retrofit order, dark stages |
| `references/case-study.md` | the real pass this came from, with the owner's words |
| `assets/css/unvibe.css` | the drop-in stylesheet (plain CSS, `uv-` classes, tokens on `:root`) |
| `assets/react/*` | Select, NativeSelect (drop-in for `<select>`), Switch/SwitchCard, SettingsRow, Accordion, NumberField, Segmented (gliding pill), RollingNumber, ThinkingIndicator, DateRangePicker, useFlipToFit |
| `scripts/capture.mjs` | headless Chrome shots of `[data-shot]` elements, or app screens with a console check |
| `scripts/compare.mjs` | the side-by-side before/after page |
| `demo/index.html` | every pattern, before and after, on fictional data |

## Using the assets

- **CSS**: copy `assets/css/unvibe.css` into the project, map section 1 to the project's tokens, import it
  after the base styles. Use classes as-is or translate them into the project's own class names (keep the
  values).
- **React**: copy the components you need; they depend on `react-aria-components` (and
  `@internationalized/date` for the date range). They carry no Tailwind classes.
- **Existing component library**: restyle its parts with the catalogue's numbers rather than replacing it.

## What to hand back

1. The before/after page (only visible differences).
2. A short list of what changed, by family, and the screens touched.
3. The no-regression report: what was audited, which interactions were tested in a browser, console status,
   tests, build. Say plainly what was not checked.
