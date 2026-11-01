# The catalogue: every micro-detail, with its numbers

Each entry says what to change, why it reads as "designed", and the exact values. Class names refer to
`assets/css/unvibe.css`; components to `assets/react/`. Colors are given as tokens (map them to your brand,
see `porting.md`); the example values are the warm green/lemon theme the catalogue was proven on.

Work family by family. Never apply a detail half-way on one screen and not on its siblings: inconsistency
is itself a tell.

---

## 0. Foundations (do these first, everything else leans on them)

| # | Detail | Values | Why |
|---|---|---|---|
| 0.1 | **Three surfaces, not two.** Page canvas, white for what floats, a darker *sunken* fill for fields and tiles. | canvas `#F6F4EE`, surface `#FFF`, sunken `#EFEDE6`, sunken-hover `#EAE7DF`, sunken-soft `#F7F5F0` (inside white surfaces), track `#ECE9E1`, chip `#E4E1D8` | Reference libraries use `#F7F7F7` fills on white. On a tinted page that gray disappears; go one step darker than your canvas. |
| 0.2 | **Selection ≠ primary action.** One color says "this is chosen/current" (menus, rows, tabs, focus); another says "do this" (one button per screen). | selection `--uv-sel #2E6B5A`, tint `#E9F0D4`, tint-line `#A3CDBC`; accent `#D9E86B` | Using the brand accent for every selected thing makes screens loud and dilutes the main action. |
| 0.3 | **Hover ≠ selected.** Hover is a neutral cream; selected is the pale selection tint + a check. | hover `#F2F0EA`; selected `--uv-sel-tint` + 14px check | When both are the same pale color, people cannot tell where they are in a menu. |
| 0.4 | **Ink in three levels, all readable.** | ink `#203A33`, ink-2 `#46524E`, ink-3 `#5E6864` (≥ 4.5:1 on canvas) | Light-gray secondary text (`#9CA3AF`) is the most common accessibility failure in generated UIs. |
| 0.5 | **Shadows tinted with the ink**, never black, and only three of them. | 1px raised `0 1px 2px rgb(ink/.06)`; popover `0 1px 2px rgb(ink/.06), 0 16px 40px rgb(ink/.16)`; modal `0 24px 60px rgb(ink/.18), 0 2px 8px rgb(ink/.07)` | Default `shadow-md/lg` everywhere is a tell. Only things that float get a real shadow. |
| 0.6 | **Radius grows with size.** | badge 6 · menu item 8 · button/field 10 · card/popover/switch-card 12 · list/frame 14 · tile/modal 16 · canvas 24 · pills 999 | One radius for everything (or 18–34px everywhere) looks generated. |
| 0.7 | **One motion curve, four durations, one spring.** | ease `cubic-bezier(.22,1,.36,1)`; in `(.16,1,.3,1)`; out `(.7,0,.84,0)`; 120 / 160 / 240 / 520ms; spring = `linear()` with a .15 bounce (in the CSS) | Motion follows a state change (a choice, a value, an opening), never a mere hover. Nothing lasts more than half a reading beat. |
| 0.8 | **Reduced motion turns everything off** in one media query. | `@media (prefers-reduced-motion: reduce)` block at the end of the CSS | Respect is part of polish. |
| 0.9 | **Native leftovers take the brand.** | `accent-color: var(--uv-sel)` on checkbox, radio, range, progress | A blue OS checkbox in a green product screams "unfinished". |
| 0.10 | **Tabular numbers** wherever numbers line up (tables, KPIs, timers, dates). | `font-variant-numeric: tabular-nums` | Jumping digit widths look cheap the moment a number updates. |

## 1. Words and labels (the fastest win)

| # | Detail | Values / rule |
|---|---|---|
| 1.1 | **No letter-spaced capitals.** Section labels, table headers, menu group titles, eyebrows, kickers: sentence case. | 12.5–13px, weight 500, letter-spacing 0, ink-3, `::first-letter { text-transform: uppercase }` |
| 1.2 | Capitals survive only on **tiny tags** (BETA, SOON), never on titles. | 9.5px, .04em tracking, soft fill |
| 1.3 | **One page title style**, the display face. | 34px / 1.05, weight 800, −.04em (`.uv-page-title`) |
| 1.4 | Section titles inside pages. | 22px / 28px, weight 700, −.02em (`.uv-section-title`) |
| 1.5 | Big numbers are **24/34 at 700**, not 36px at 800–900. Key figures 22–24px; status text in a tile 18px/600. | `.uv-kpi__value` |
| 1.6 | **No emoji as icons**, no ✓ / ✔ glyphs inside badges ("✓ Done" → "Done"). Use one SVG icon set, 16px, stroke 1.8, in ink-3. | |
| 1.7 | **No exclamation marks**, no "Consider reallocating budget!" filler; the first sentence of an AI answer is the conclusion with its number. | |
| 1.8 | Write the user's words, not the system's ("Retrieve my past results", not "Import account data"). One idea per sentence; no em-dash asides. | |
| 1.9 | Headers stay **consistent across sections** ("X Ads", "LinkedIn Ads", "Pinterest Ads"; never one of them in capitals). | |

## 2. Buttons

| # | Detail | Values |
|---|---|---|
| 2.1 | **Primary with relief**: tonal vertical gradient + inner top highlight + two soft shadows. | gradient `#E5F190 → #D3E35E`, border `#B5CB42`, `inset 0 1px 0 rgb(255 255 255/.65), 0 1px 2px rgb(ink/.18), 0 3px 8px -3px rgb(ink/.25)` |
| 2.2 | Hover goes **one notch lighter**, active **one notch darker** with an inset shadow; 150ms. | hover `#ECF5A6 → #DCEA70`; active `#D0E05A → #C6D84E` + `inset 0 1px 2px rgb(ink/.25)` |
| 2.3 | **Press, don't bounce**: `scale: .985` on `:active`; nothing moves on hover. Animate the `scale` property, not `transform`. | 120ms |
| 2.4 | Secondary: white, 1px rule, a hairline shadow and a 1px inner bottom line. | `0 1px 2px rgb(ink/.08), inset 0 -1px 0 rgb(ink/.04)`; hover `#FAF8F3`; active `#F1EEE6` |
| 2.5 | Ghost/text buttons darken their background by 5% of the ink on hover. | `rgb(ink/.05)` |
| 2.6 | **Focus ring** on every clickable: 2px selection color, 2px offset. | `outline: 2px solid var(--uv-sel); outline-offset: 2px` |
| 2.7 | Disabled: no shadow, sunken fill, ink-3, `not-allowed`. Primary disabled: flat accent at 55%. | |
| 2.8 | Geometry: 36px min height, 8/14 padding, 14px/500 (primary 600), radius 10, 7px icon gap. | |
| 2.9 | **One primary (accent) button per screen.** Other "new / add" buttons go white. | Exception only if your brand decides one (e.g. the global "New" in a sidebar). |
| 2.10 | Pressed toggles (`aria-pressed=true`) use the selection tint, not the accent. | |
| 2.11 | Icon actions under content (copy, retry): 28px squares, radius 8, chip fill, ink-2 → ink on hover. | `.uv-icon-btn` |
| 2.12 | A button that *picks something* (opens a chooser) looks like a field **with a chevron**, text left. | `.uv-field` + `justify-content: space-between` + chevron |

## 3. Fields

| # | Detail | Values |
|---|---|---|
| 3.1 | **Filled, borderless at rest.** | sunken fill, 1px transparent border, radius 10, 36px, 7/12 padding, 14/20 text |
| 3.2 | Hover darkens the fill; **focus turns white** with a selection border and a 3px tint ring. | hover `#EAE7DF`; focus `background #fff; border-color sel; box-shadow 0 0 0 3px sel-tint` |
| 3.3 | Same look for **textareas** (use `py 7px` so single-line and multi-line share the 36px rhythm). | |
| 3.4 | **Every control on a row has the same height and fill**: inputs, menus, date fields. A gray menu next to a white bordered input is a tell. | 36px; 46px when a search heads a big table (then the filter menu next to it is 46px too) |
| 3.5 | Inside a white modal, fields go one step lighter (sunken-soft) so they do not look like holes. | `.uv-on-surface .uv-field` |
| 3.6 | **Search**: one filled field with the magnifier *inside*, not a box around a field. | icon at left 14px, input padding-left 40px |
| 3.7 | **Number fields get − and + inside the field**; browser spinners hidden. Buttons respect min/max and emit the same change event as typing. | 28px buttons, radius 7, inset 4px; hover = white raised |
| 3.8 | The buttons may **step faster than typing**: a bid typed to the cent, nudged by the unit (`buttonStep`). | `NumberField.tsx` |
| 3.9 | A locked field **says why in gray** under it. No yellow warning icon, no alert box. | `.uv-hint` 13/18 ink-3 |
| 3.10 | Required asterisks are ink-3, not red. Section icons are ink-3, not brand-colored. | |

## 4. Menus and selects

| # | Detail | Values |
|---|---|---|
| 4.1 | **Replace every native `<select>`** with a real listbox (React Aria Select): keyboard, type-ahead, screen readers included. | `Select.tsx` |
| 4.2 | Popover: radius 14, 8px padding, 1px rule, popover shadow, min width = max(trigger, 220px); a wider list when labels are long (campaign names: 340px). | `.uv-popover` |
| 4.3 | Options: 9/10 padding, radius 10, 14/20; hover cream; **selected = tint + check** (14px, stroke 2.2). | `.uv-option` |
| 4.4 | Group headers in lowercase 12px ink-3, no separators shouting. | `.uv-popover-section` |
| 4.5 | Menus **arrive**: opacity 0 → 1, `scale .97 → 1`, `translate 0 -4px → 0`, 240ms ease-in; origin top (top-right when flipped). | `@keyframes uv-menu-in` |
| 4.6 | Two appearances of the same menu: **field** (filled, sits in forms) and **toolbar** (white, bordered, sits next to buttons). | `.uv-field` / `.uv-select-trigger--toolbar` |
| 4.7 | **Prefix** the filter name in gray inside the trigger ("Campaign  All"); an **icon** before the value for periods (calendar). | `prefix`, `icon` props |
| 4.8 | The chevron turns 180° when open. | 200ms |
| 4.9 | A menu whose panel would overflow the right edge **opens toward the left**, measured at open time (no flash). | `useFlipToFit.ts`, `.uv-popover.is-end` |
| 4.10 | A drop-in for existing `<select>`s (`NativeSelect.tsx`): same children, same `onChange(e.target.value)`, takes its **accessible name from the wrapping `<label>`**, drops duplicate values. | see `pitfalls.md` |
| 4.11 | On a dark stage (media viewer), the menu stays dark: no light pill in the middle of it. | `.uv-on-dark` |
| 4.12 | Compact contexts (filter rows inside a popover, pagination "20 per page") keep compact sizes, but the row stays homogeneous (value input same gray/height as its menus). | |

## 5. Segmented controls and tabs

| # | Detail | Values |
|---|---|---|
| 5.1 | **A white pill that glides** on a gray track, on a spring, instead of one segment switching off and another on. | track `#ECE9E1`, radius 11, padding 3; pill white radius 8, `0 1px 2px rgb(ink/.14), 0 0 0 .5px rgb(ink/.06)`; 520ms spring |
| 5.2 | The first placement does not animate (set `data-settled` after one frame). | `Segmented.tsx` |
| 5.3 | Items 28px, 0/11 padding, 12.5px/500 ink-2; active ink/600. | |
| 5.4 | The same glide for sidebar navigation (pale tint pill), a step bar (2px underline that slides over the rule), a command palette (tint pill on the highlighted row). | |
| 5.5 | **Compact segmented** inside a settings row: sunken track, 13px items. | `.uv-seg--compact` |
| 5.6 | **Tabs with counts**: white pill on a sunken track; the count is a small chip that turns lighter on the active tab. | `.uv-tabs`, `.uv-count` |

## 6. Switches, checkboxes, radios, tags

| # | Detail | Values |
|---|---|---|
| 6.1 | **Every yes/no setting is a switch.** Checkboxes remain only for multi-select lists and consents ("I authorize delivery"). | |
| 6.2 | Switch: 36×20 track, 16px thumb; off `#E4E1D8` (hover `#DBD7CC`); on = selection gradient `#367A66 → sel`; thumb white → `#EEEBE3` gradient with a soft shadow; spring travel. Small: 28×16. | `.uv-switch` |
| 6.3 | **Switch card** for one important setting on its own: the whole card toggles; 12px radius, 1px rule, 12/20/12/16 padding; on = tint-line border, faint tint fill. | `.uv-switch-card`, `SwitchCard` |
| 6.4 | **Radio cards** for choices that deserve to be seen (structures, plans, modes): a small illustration on a sunken panel, title 14/500, description 13/ink-3, a 16px radio dot top-right; selected = selection border + tint + 1px ring. | `.uv-radio-card` |
| 6.5 | A native radio redrawn like a library one: 16px, filled selection color, white 6px dot that scales in. | `.uv-radio` |
| 6.6 | **Tags to toggle** (attribution windows, filters): pills 6/12, 13px/500; on = tint fill, tint-line border, selection text. | `.uv-tag` |
| 6.7 | **Values** (axis values, labels): white pill with a soft shadow, a count chip, and a remove × that appears on hover. | `.uv-value` |
| 6.8 | Checkbox: a drawn check (not the OS glyph), selection color. | (React Aria Checkbox + SVG) |

## 7. Settings screens

| # | Detail | Values |
|---|---|---|
| 7.1 | **A setting is a row**: title + description on the left, the control on the right. | `.uv-setting`: 12/20/12/16 padding, radius 12, 1px `rule-2`, gap 16 |
| 7.2 | Title 14/20 500 ink; description 13/18 ink-3; rows stacked with 8px gaps. | |
| 7.3 | Stacked variant when the control is wide (a list of chips, a text field). | `--stacked` |
| 7.4 | **Locked rows** at 55% opacity on title and control, with the reason as description. No warning icons. | `--locked` |
| 7.5 | **Accordions instead of `<details>`**: chevron rotates 180° (260ms), body animates `grid-template-rows 0fr → 1fr` (280ms) + opacity; closed content stays mounted but `inert`. | `Accordion.tsx` |
| 7.6 | Navigation inside a long settings drawer **opens the section it points to**. | |
| 7.7 | A settings *page*: 22px title, groups labelled in gray 13px, lists in filled blocks (radius 14) with light dividers, soft badges; **no green check in front of every permission**. | `.uv-list` inside `.uv-on-surface` |
| 7.8 | "Apply" without a check icon. Icons on actions only when they add meaning. | |

## 8. Badges, statuses, callouts

| # | Detail | Values |
|---|---|---|
| 8.1 | **Badges are soft**: 1/7 padding, radius 6, 11.5px/500, no border; ok = tint/selection, warn = `#FBF3D9/#8A6411`, neutral = chip. | `.uv-badge` |
| 8.2 | Status as the *point* of a row → pill with a 6px dot; status as *metadata* → just a 6px colored dot + word. | `.uv-status`, `.uv-dot` |
| 8.3 | Account/connection states in pills ("Ready", "Check") instead of "● Ready" plain text. | |
| 8.4 | **Callouts are filled zones**, never a colored bar on the left. Sunken fill, radius 14–16, 16/18 padding, 14/22 text. | `.uv-callout` |
| 8.5 | AI insights are *signed* in gray with a small spark icon ("Insight · report"), not wrapped in a lemon-bordered card. | `.uv-callout__sign` |
| 8.6 | Counts in pills (`3 selected` turns into a selection-tint pill as soon as something is selected). | `.uv-grid__count.is-active` |

## 9. Numbers and dashboards

| # | Detail | Values |
|---|---|---|
| 9.1 | **KPI tiles are filled, borderless**: sunken, radius 16, 16/18 padding, 12px gaps. | `.uv-kpi` |
| 9.2 | Each tile has a **30px white icon chip** (radius 9, 1px shadow, 16px icon ink-2) above the label. | `.uv-kpi__icon` |
| 9.3 | Label 14/20 ink-2 *above* the number; number 24/34, 700, −.02em, selection color, tabular. | |
| 9.4 | **Delta pill** next to the value (radius 6, 12px/600): green when it is good news, **red when a cost goes up** even though the number grew. | `.uv-delta--good/--bad` |
| 9.5 | Text values in a tile (a date, "Per ad set") drop to 18px/600 ink; missing values say so in ink-3 ("Not set"), never a fake 0. | |
| 9.6 | **Never show a number you guessed.** If the data does not exist, write "Not determined". | |
| 9.7 | Choose the KPIs from what the account actually does (purchases → spend, purchases, cost per purchase, ROAS; leads → spend, leads, cost per lead, CTR). | |
| 9.8 | Funnels as **stage bars** with name and value inside the bar; a stage that is not measured disappears instead of showing zero. | |
| 9.9 | Daily bars with the result as a line; the chart title shows the hovered day. | |
| 9.10 | **Rolling digits** when a number changes (odometer, 32ms stagger, spring); separators stay still. | `RollingNumber.tsx` |
| 9.11 | Never add amounts in different currencies. | |

## 10. Tables, grids, trees

| # | Detail | Values |
|---|---|---|
| 10.1 | **One header band for every table in the app**: sunken-soft `#F7F5F0`, 12.5/18, 500, ink-3, sentence case, 10/14 padding. | `.uv-table thead th` |
| 10.2 | Tables live in a **frame**: 1px rule, radius 14–16, `overflow: clip`. | `.uv-frame` |
| 10.3 | Row hover `#FAF8F3` (120ms). No zebra stripes. | |
| 10.4 | **Selected row**: selection-row tint + a 3px inset bar on the left (`box-shadow: inset 3px 0 0 sel`), hover a step darker; its borders stay gray. | `.is-selected` |
| 10.5 | Numbers right-aligned and tabular; names with a 30×38 thumbnail (radius 6) and a gray sub-line. | |
| 10.6 | **Data grid**: sticky header band ("Select all" + count) that stays while scrolling a thousand rows; group rows for parents (`#FCFBF8`), indented 24px per level; full-width rows. | `.uv-grid` |
| 10.7 | Filters above a grid are menus with the filter name as prefix, at the height of the search field. | |
| 10.8 | **Trees** (campaign → set → item): framed, a cream header for the root (icon chip + small gray kind + 15/600 name + a settings icon button), levels at 16/40/64px, rows 52px, hover `#FAF9F6`, chevrons rotate. | `.uv-tree` |
| 10.9 | Leaves with a thumbnail and a "View" that turns into a white pill on row hover. | `.uv-leaf` |
| 10.10 | A list on the page = white framed block; the same list inside a white modal = sunken-soft block without border. | `.uv-list`, `.uv-on-surface` |

## 11. Feeds and activity

| # | Detail | Values |
|---|---|---|
| 11.1 | **Activity is a feed, not a table**: counted tabs, then days as gray zones (radius 16, padding 4, gap 4) holding one white tile per event (radius 12, 12/14/12/12 padding). | `.uv-feed-day`, `.uv-feed-item` |
| 11.2 | Day titles in 13px ink-3 sentence case ("Today", "Yesterday", then dates). | |
| 11.3 | The author as **initials avatar** (36px, dark fill, accent letters, display font 700 12px) with the **platform badge** (17px white disc) bottom-right; unknown author = sunken avatar with "?" and an italic "Author not recorded". | `.uv-avatar` |
| 11.4 | The sentence says what happened with numbers ("Launched 21 ads on Acme US"); meta line 13/18 ink-3. | |
| 11.5 | Right column: time (tabular, ink-3) above a **status dot** (done green, stopped red, check amber, running gray). No badges. | `.uv-feed-item__side` |
| 11.6 | Tiles rise in (6px, 300ms) and get a soft shadow on hover; "Show more" after 40 entries. | |
| 11.7 | No actions inside a tile when there is nowhere meaningful to go. | |

## 12. AI screens (agent thread)

| # | Detail | Values |
|---|---|---|
| 12.1 | **An AI screen is a conversation, not a stack of cards.** One sunken canvas, radius 24. | `.uv-agent__thread` |
| 12.2 | The user's request as a **white bubble** on the right: radius 16, 11/12 padding, 14/20, max 520px/72%. | `.uv-bubble` |
| 12.3 | **What the agent read**, as a search-trail tree: a gray line with hooked connectors (12×16, radius 7), each source with its meta on the right (counts, tabular), thumbnails as stacked 20px marks. | `.uv-trace` |
| 12.4 | **The answer is text**: a 15/24 lead sentence that gives the conclusion with its number, 14/20 600 headings, simple disc lists, numbered items, quotes with a 2px gray bar. No emoji headings, no colored cards. | `.uv-answer` |
| 12.5 | Copy / redo as **28px icon buttons** under the answer. | `.uv-icon-btn` |
| 12.6 | **Composer in two tiers**: a status tab peeking above (chip fill, radius 14 14 0 0, 13/18 500) and the white box (radius 20, soft double shadow); textarea 40–120px; a period menu and a **32px round accent send button**. | `.uv-composer`, `.uv-send` |
| 12.7 | **Empty state = conversation starter**: a 40px white mark, one sentence, three suggestion pills that send on click. | `.uv-starter`, `.uv-suggestions` |
| 12.8 | Side panel: what the agent looked at, as a two-column masonry gallery (radius 12) with names and a gray meta line; dedupe identical images. | `.uv-gallery` |
| 12.9 | The scroll area **fades out under the composer** (mask 28px) instead of being cut. | |
| 12.10 | While working: **waving dots + a calm shimmer label + the REAL elapsed time**. Never fake steps that get checked at random when the server does one call. | `ThinkingIndicator.tsx` |
| 12.11 | Messages rise in (6px, 260–340ms, staggered by type). | |
| 12.12 | The user's instruction is **really sent** (bounded, 300 chars, one line), and the answer shows what it was based on. No decorative composer. | |

## 13. Progress, loading, long jobs

| # | Detail | Values |
|---|---|---|
| 13.1 | **Skeletons keep the place** of the content instead of a spinner and "Loading…". Sweep gradient 1.5s. | `.uv-skeleton` |
| 13.2 | A **calm light runs through the words** of a running task (2.2s linear). | `.uv-shimmer` |
| 13.3 | Onboarding as an **agent-progress step list**: done = gray filled circle with a white check (ink-3 text), current = white raised row with a selection ring, next = dashed circle; a progress ring with "2 of 5". | `.uv-steps`, `.uv-ring` |
| 13.4 | **A long job on a dark stage is a journal**: lines appear as real work happens (checking, uploading, encoding only if videos, validating, creating); the current line spins (accent top border) and shimmers; done lines get a thin check; the last line says the result in numbers ("24 ads are live, paused"). | `.uv-journal` |
| 13.5 | A rate-limit pause is **one sentence under its step** in amber ("The platform asked us to slow down: resuming in 2 min"), not an error. | `.uv-journal__wait` |
| 13.6 | The percentage stays the only number; thumbnails of uploaded files appear at upload pace (24×30, radius 4). | |

## 14. Floating things

| # | Detail | Values |
|---|---|---|
| 14.1 | **Modals arrive**: opacity + `scale .975` + `translate 0 8px`, 300ms ease-in; the overlay fades 240ms with a 2px blur. Animate `scale`/`translate` properties because modals are often centered with `transform`. | `.uv-modal`, `.uv-overlay` |
| 14.2 | **Toasts are cards**: white, radius 12, 14/16 padding, popover shadow, a 28px colored disc per meaning (success tint, error danger-tint, warning amber, info blue), title 14/600, description 13/18; actions 30px. | `.uv-toast` |
| 14.3 | **Tooltips** on icon-only navigation (collapsed sidebar) on hover AND keyboard focus; deep ink bubble, 12.5px/500, radius 8. Never the native `title`. | `.uv-tooltip` |
| 14.4 | **Command palette**: 640px, radius 9, the only big shadow; 54px input row with a rule under it; groups in 12.5px gray; 40px rows with the tint pill gliding on the highlighted one; right-side hints; footer with `kbd` keys. | `.uv-palette` |
| 14.5 | **Confirm dialog**: one sentence, two buttons, the focus on "Cancel", danger variant in red outline. | `.uv-confirm` |

## 15. Dates

| # | Detail | Values |
|---|---|---|
| 15.1 | **Presets on the left** (Yesterday, 7/14/30 days, This month, Last month, 90/180/365 days, All) that apply in one click; the chosen one is a white raised row with its dates under it. | `DateRangePicker.tsx` |
| 15.2 | **Two months on the right**: the range as a pale band, its ends in solid selection color with rounded outer corners (9px), today's limits respected: days after yesterday and before the first data day are disabled. | `.uv-day` |
| 15.3 | Footer: "Oct 2 – Oct 31, 2026 · 30 days", Cancel (ghost) and Apply. | |
| 15.4 | Editable From / To fields (34px, sunken) for people who type. | |

## 16. Screen-level patterns

| # | Detail |
|---|---|
| 16.1 | **Rebuild a screen on a professional template** (dashboard, AI chat, notification center, settings modal, data table, task list) instead of patching cards. Measure, then map (see `method.md`). |
| 16.2 | **Lists on a tinted page are white framed blocks; in a white modal they are filled blocks.** |
| 16.3 | The order of things follows **what exists first**: available features/platforms first, beta after, "coming soon" last. Sales screens may keep the plan order. |
| 16.4 | Every repeated element is identical across sibling screens (the same filter at the same height on every list page). |
| 16.5 | A preview/review screen shows key numbers as tiles, the structure as a framed tree, and settings that change what ships as a settings row (icon chip, title, description, "Edit"). |
| 16.6 | Options that explain themselves ("How do you want to test?") become radio cards with a tiny diagram, never removed for minimalism. |
| 16.7 | Desktop-dense where volume demands it: commands stay reachable while scrolling 500 items (sticky bars). |

## 17. Never (the short list)

Gradient purple buttons · bordered cards stacked as a layout · `shadow-lg` on everything · tracked uppercase
labels · emoji headings · ✓ glyphs in badges · colored left-border callouts · giant 36–48px numbers · zebra
tables · native selects and blue OS checkboxes · "Loading…" with a spinner · fake progress steps · a primary
color on every selected thing · decorative fields that do nothing · guessed numbers. The full list with the
replacement for each is in `tells.md`.
