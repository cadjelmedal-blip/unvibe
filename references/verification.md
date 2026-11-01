# Verification: before/after, then "no regression"

Two different jobs. The before/after proves the change is *visible*. The no-regression pass proves nothing
else changed. Ship only when both are done.

## Before / after

1. List the screens you touched in a `screens.json`:
   ```json
   [
     { "url": "/dashboard", "name": "home" },
     { "url": "/reports?r=top", "name": "filter-open", "click": ["Add a filter"] },
     { "url": "/settings", "name": "settings", "scroll": true },
     { "url": "/campaigns", "name": "status-menu", "openMenu": 1 }
   ]
   ```
2. Capture production, then your local branch, signed in with the same account (a `cookies.json` you never
   commit):
   ```bash
   node scripts/capture.mjs screens https://app.example.com before screens.json cookies.json
   node scripts/capture.mjs screens http://localhost:3000   after  screens.json cookies.json
   node scripts/compare.mjs before after compare.html "Polish pass"
   ```
3. Open `compare.html`. Delete every pair where the difference is not obvious. Show the page to the owner.
4. Never click irreversible actions in a walk (launch, publish, pay, send, upload to a third party). Stop
   one step before.

## The no-regression pass (do all of it)

1. **Audit replaced usages by script.** For each swapped component, list every call site and check: props
   the new component does not support, handlers reading more than the value, sentinel values, forms relying
   on native submission, CSS selectors that targeted the old element, compact layouts.
2. **Diff refactors against production** (`git diff <last-deployed-sha> -- file`) and re-read each change:
   state resets, effect dependencies, memoization removed (is the function used in an effect's deps?),
   behavior on first render and on remount.
3. **Real interactions in a real browser**, with real pointer events (move, press, release):
   - choose an option with the pointer, inside a modal: value changes, modal stays open;
   - press Escape with a menu open: the menu closes, the modal stays;
   - keyboard: ArrowDown + Enter selects; focus returns to the trigger;
   - open the widest panels near the right edge of a 1440px screen: nothing off-screen.
4. **Console clean** on every touched screen, hydration warnings included (`capture.mjs screens` prints
   them).
5. **Counts**: no native `<select>` left where you meant to replace them, no menu without an accessible
   name (`capture.mjs` prints both).
6. **Tests** updated to real gestures (see `pitfalls.md`), the full suite green, typecheck and lint clean.
7. **Production build** succeeds locally before pushing.
8. After deploy, re-run the screens on production and read the console again.

Report what you checked and what you did not. "No regression" is a claim; back it with the list above.
