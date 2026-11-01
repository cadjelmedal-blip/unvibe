# Pitfalls: the bugs that come with polish (all met in production, all fixed)

## React Aria (and any headless library) inside a modal

**Symptom**: a menu inside a modal opens, but its options cannot be clicked, or the keyboard jumps back to
the modal, or Escape closes the whole modal.

**Cause**: the menu's popover renders in `<body>`, outside the modal. The modal's focus trap pulls focus back
and its "click outside" lock makes the options inert (Radix Dialog does exactly this).

**Fix**: render the popovers *inside* the modal. With React Aria, wrap the modal content in
`UNSAFE_PortalProvider` pointing to a fixed layer inside the modal:

```tsx
import { UNSAFE_PortalProvider } from "react-aria";
// inside your modal content:
const [layer, setLayer] = useState<HTMLDivElement | null>(null);
<UNSAFE_PortalProvider getContainer={() => layer}>
  {children}
  <div ref={setLayer} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60 }} />
</UNSAFE_PortalProvider>
// and give popovers `pointer-events: auto` (React Aria sets it on the popover itself).
```

Then make Escape close the menu, not the modal (React Aria handles it when the popover is inside), and
return focus to the trigger when the list closes. **If the modal is centered with `transform`**, a
`position: fixed` layer inside it is positioned relative to the modal, and the list gets clipped: center the
modal without `transform` (grid/flex centering) instead.

## Two copies of `react-aria`

**Symptom**: popovers silently fall back to `<body>` again, no error. **Cause**: `react-aria-components`
pins a `react-aria` version; a second copy (different version) has its own portal context. **Fix**: install
`react-aria` at the exact version `react-aria-components` depends on, and add a test that fails if two
copies exist (read `node_modules/react-aria/package.json` and the nested ones). Same for
`@internationalized/date` (the calendar breaks with two copies).

## Duplicate option values crash the screen

A native `<select>` tolerates two `<option>`s with the same value. React Aria throws ("Duplicate key …") and
the whole tree unmounts. It happens with sentinels: an "All" option whose value is `all` next to a real item
whose id is also `all`. **Fix**: dedupe by value (keep the first) in your Select wrapper, and audit sentinel
values (`all`, `new`, `none`, `""`) against real ids.

## Empty values

React Aria keys must be non-empty; a "Choose…" option with `value=""` is common. Map `""` to a private
sentinel key inside the wrapper and back on change. A value that matches no option should show the
placeholder, not the first option (a native select shows the first option, which lies about the state).

## The accessible name disappears

A `<select>` inside a `<label>` is named by the label. A React Aria trigger inside the same label is named
by **its current value** ("Active" instead of "Status"), because it gets `aria-labelledby` pointing to its
own value. Screen readers and tests both lose the name. **Fix**: give the menu an `aria-label`, or adopt the
wrapping label's text at mount (without the menu's own text) and watch it with a `MutationObserver` for
labels that change. `NativeSelect.tsx` does this.

## Tests that pass for the wrong reason

- `fireEvent.change(select, …)` does nothing on a React Aria menu: open it and click the option
  (`getByLabelText` → click → `getByRole("option")` → click). Write a `choose(menu, value)` helper.
- `queryByRole("combobox", { name })` returns null for *every* React Aria menu (its trigger is a `button`),
  so `expect(...).toBeNull()` passes even when the menu is there. Use `queryByLabelText`.
- Read the current value from the hidden `<select>` React Aria renders, or from the trigger text.
- Switches are `role="switch"`, not `checkbox`.
- `ResizeObserver` does not exist in jsdom: guard it.

## CSS that does not win

- **Tailwind v4 utilities live in `@layer utilities`**: any unlayered rule beats them regardless of
  specificity. Handy for overrides, surprising when an old unlayered rule beats your new utility.
- At equal specificity, the stylesheet loaded last wins. `:is(.a, .b) span.x` has the specificity of its
  most specific argument: a rule you think is weaker may tie. Raise specificity (`.parent > div > .x`)
  rather than piling `!important`.
- Demo/sandbox pages that do not load your polish stylesheet will not show your changes: put base rules in
  the stylesheet every page loads.
- Old global rules like "all `.eyebrow` uppercase `!important`" silently undo sentence case: search for
  `text-transform: uppercase` and `letter-spacing` across all stylesheets.

## Animations that fight layout

Animate the individual `scale` and `translate` properties, not `transform`, on anything that might already
be positioned with `transform` (centered modals): otherwise the animation overrides the centering for its
duration and the modal jumps.

## React's purity rules (React 19 / compiler lint)

- No `setState` synchronously inside an effect to "reset" state when a key changes: **key the state** by the
  request (`{ key, data }` and compare keys at render), or reset in the event handler that opens the thing.
- No `ref.current` reads during render.
- No `Date.now()` during render: read the clock in a module-level function called from effects/handlers.
- Read the URL with `useSyncExternalStore` (server snapshot `null`) instead of setting state in an effect.
- Measuring the DOM to adjust (flip a popover, glide a pill): a **ref callback** or `useLayoutEffect`, so the
  correction happens before paint.

## Overflowing popovers

A wide panel anchored to a trigger near the right edge goes off-screen (its main button invisible). Measure
the panel when it mounts and right-align it if `rect.right > innerWidth - 8` (`useFlipToFit.ts`).

## A drop-in replacement that changes behavior

Before swapping a component across a codebase (a hundred `<select>`s), audit every usage with a script:
extra props (`multiple`, `required`, `name`, `form`), handlers that read more than `target.value`
(`selectedOptions`, `selectedIndex`), sentinel values, CSS that targeted the old element (`.x select {}`),
compact contexts that relied on a smaller size. Fix the outliers by hand.
