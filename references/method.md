# The method: take a professional reference, measure it, map it, prove it

Taste is not invented on the spot. It is borrowed from a reference that already got it right, measured
precisely, and translated into your own colors. This is the loop that produced the catalogue.

## 1. Pick the reference for the screen, not for the app

For each screen, find the closest professional template:

| Your screen | Reference template |
|---|---|
| Analytics overview | a "marketing dashboard" template (KPI tiles, chart, funnel, top list) |
| AI assistant / brief / copilot | an "AI chat" or "AI image generation" template (thread, trace, composer, gallery) |
| Activity, audit log, uploads history | a "notification center" template |
| Settings page or drawer | a "settings modal" template + a "switch card" component |
| Bulk edit, lists of a thousand rows | a "data table / data grid" template |
| Onboarding, checklist | an "agent progress / task list" template |
| Long-running job | a "task list" with live steps |
| Date filters | a "date range picker" with presets |

Good sources: a component library you can inspect live (BoardUI, which ships an MCP server so an agent can
read its components; Radix Themes; React Aria's examples; Tailwind UI; Linear, Vercel, Stripe dashboards).
Free components can be installed and adapted. **Paid templates are reproduced from their principle and
your own measurements, never by copying their code.**

### With the BoardUI MCP (optional)

```bash
claude mcp add boardui -e BOARDUI_TELEMETRY_DISABLED=1 -e DO_NOT_TRACK=1 -- npx -y boardui@latest mcp
```

Restart Claude Code; its tools list, show and install components. Install free components into a separate
folder (`components/boardui/`), then **remap their tokens to yours** in one bridge stylesheet. Never import
the library's own theme or global CSS: it rewrites backgrounds, grays, shadows, fonts and dark mode across
your whole app.

## 2. Measure computed styles, don't eyeball

Open the reference page in headless Chrome and read the computed styles of the parts you care about. A
small snippet in the DevTools console (or through `scripts/capture.mjs`-style CDP evaluation):

```js
const pick = (sel) => { const e = document.querySelector(sel); if (!e) return null; const s = getComputedStyle(e);
  return { bg: s.backgroundColor, radius: s.borderRadius, padding: s.padding, font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`,
           color: s.color, border: s.border, shadow: s.boxShadow, gap: s.gap, height: s.height }; };
["[data-thread]", "[data-bubble]", "[data-composer]", "button[aria-label='Copy']"].map(pick);
```

Write the numbers down next to the component (a comment block in the CSS is perfect: "Measured on X:
thread #F7F7F7 at 24px radius; white bubble 16px radius, 11/12px padding, 14/20 text; actions 28px"). The
catalogue entries all come from notes like these.

## 3. Map, don't copy

| Reference value | Becomes |
|---|---|
| Their neutral fill (`#F7F7F7` on white) | your *sunken* token, one step darker than your canvas |
| Their brand blue for selection | your selection color (`--uv-sel`), pale tint for fills |
| Their primary button color | your accent, used once per screen |
| Their font | your fonts, same sizes and weights |
| Their radii, paddings, sizes, durations | kept as they are |

Keep the numbers, change the colors. That is the whole trick: the proportions carry the quality.

## 4. Rebuild the screen, then the siblings

Rebuilding one screen on its template is a visible step. Then apply the same details to every screen that
shares the pattern (all tables, all settings, all filters) in the same pass, or the app looks half-done.

## 5. Prove it with a before/after

1. Capture production (before) and your branch (after) with the same script and the same data
   (`scripts/capture.mjs screens …`).
2. Build the side-by-side page (`scripts/compare.mjs`).
3. **Only keep pairs where a person sees the difference at a glance.** If the owner says "I can't see any
   change", the change is not done: go bolder (that is how the second and third passes of this catalogue
   happened).
4. Let the owner react on the page, not on a description.

## 6. Run the no-regression pass

See `verification.md`. Polish that breaks a menu inside a modal, a test, or a form submission is not polish.
