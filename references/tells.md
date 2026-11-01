# The tells: how people spot a generated interface, and what replaces each one

"It's obvious this was made with an AI. I can spot it from 500 km away." That is how this skill started.
People do not name the rules, they just feel them. Read this list before touching any screen, then again on
the final render. Each tell comes with its replacement.

## Layout and surfaces

| Tell | Replace with |
|---|---|
| Every section is a white card with a gray border and `shadow-md`, stacked | One surface per screen; filled zones (sunken) for groups; frames only around tables, trees and lists |
| Three feature cards in a row; a bento grid | The product itself, large; real data in its real layout |
| A colored stripe at the top of cards | Nothing; hierarchy comes from type and fill |
| Colored left-border callouts (`border-l-4 border-indigo-500 bg-indigo-50`) | A filled zone, radius 14–16, a small gray signature line if needed |
| `shadow-lg` on everything | Shadows only on what floats (menus, modals, toasts); hairline 1px shadows on raised pills |
| One radius everywhere, or very soft 18–34px corners | A radius scale that grows with size (6 → 24) |
| Pure white page | A warm or cool off-white canvas; white is for what floats |
| Dot grid, blurred orbs, sparkles, liquid glass, aurora gradients | Nothing. Texture, if any, comes from real content |
| Purple/indigo gradient buttons, neon, rainbow, faded pastels | Your brand's two colors: one for selection, one for the primary action |

## Type and words

| Tell | Replace with |
|---|---|
| Tiny tracked UPPERCASE labels (`text-xs tracking-widest uppercase`) | Sentence-case labels 12.5–13px/500 in the third ink |
| Emoji in headings ("📊 Summary", "🚀 Next steps") | No emoji; one icon set, 16px, gray |
| Green check bullets (✅ ✔) everywhere | Plain lists; checks only for state (done steps), drawn as SVG |
| Giant 36–48px bold numbers | 24/34 at 700 in tiles; the delta as a small pill |
| "It's not X, it's Y" slogans, exclamation marks, "Consider reallocating budget!" | The conclusion with its number first, then the reasons |
| Invented testimonials, fake logos, placeholder stats | Real data or nothing; "Not determined" when unknown |
| Generic font choices with no hierarchy | A display face for titles and numbers, a text face for the rest, a strict scale |
| Inconsistent naming across sections (one header in caps, others not) | The same pattern everywhere |

## Controls

| Tell | Replace with |
|---|---|
| Native `<select>` with the OS dropdown | A listbox menu: selected = tint + check, hover = neutral, keyboard included |
| Blue OS checkboxes for yes/no settings | Switches (and switch cards for important ones) |
| White bordered inputs next to gray menus on the same row | One field style: filled, borderless, 36px, white + ring on focus |
| Number inputs with browser spinners | − and + inside the field |
| `<details>` with the default triangle | An accordion: rotating chevron, smooth height, inert when closed |
| A segmented control where the active item just changes color | A white pill that glides to the choice |
| Every selected thing in the primary color | A pale selection tint; the accent stays for the one action |
| Several accent (primary) buttons on one screen | One; the rest white |
| A button that opens a picker but looks like an input without affordance | Field look + chevron |
| Hover animations on everything (lifting cards, arrows that slide) | Motion only on state changes; press = scale .985 |

## Data

| Tell | Replace with |
|---|---|
| UPPERCASE table headers on a colored band, zebra rows, blue underlined links | One sentence-case header band, row hover, names in ink with a thumbnail |
| Status as loud uppercase badges with borders | Soft pills, or a 6px dot + word when it is metadata |
| A cost that went up shown in green because "up = green" | Color by meaning: a cost going up is red |
| Charts without a story; a chart for every number | The few numbers that matter as tiles; one chart that answers a question |
| An activity log as a table of emails and timestamps | A feed: days, tiles, avatars with the platform badge, time and status dot |

## AI features

| Tell | Replace with |
|---|---|
| The answer as a stack of colored cards | A conversation: bubble, what was read, text answer, actions |
| Fake progress steps checked one after the other | Waving dots, a calm label, the real elapsed time |
| "Loading…" with a spinner | Skeletons in place of the content |
| A chat box that is decorative (the instruction is not sent) | The instruction is really used, bounded, and the answer shows its sources |
| An empty screen with a text field | A starter: one sentence and three suggestions that send on click |

## Process

| Tell | Replace with |
|---|---|
| Zero real demo: mockups drawn in SVG | Real screens, real captures (fictional data only when publishing) |
| Three pricing tiers by reflex | Whatever the business decided, laid out like the reference the owner chose |
| Polishing one screen while its siblings stay as they were | The same detail on every sibling screen in the same pass |
| Changes too subtle to see in a before/after | Only ship visible differences; a before/after pair must be obvious at a glance |
