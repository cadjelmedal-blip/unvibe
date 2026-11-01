# Case study: two days of polish on a real SaaS

The catalogue was not written from theory. It was extracted from a two-day polish pass on a production
B2B SaaS built largely with AI coding agents. The product worked. It looked generated.

## What the founder said, in order

1. "Let's improve the UX and the UI a bit." → menus, checkboxes and tooltips replaced. Result: "I can barely
   see any change."
2. "There are tons of things like that to make it much more pro." → the launch screen got a live journal.
3. "Dig through their site, take the best stuff, even the paid ones, we have to reproduce them." → the
   reference method: measure professional templates, rebuild screens on them.
4. Looking at an AI brief rendered as stacked cards: **"It's obvious this was made with an AI. I can spot it
   from 500 km away."** Then: "not just this page", "vibecoded to death". → the agent thread, the KPI tiles,
   the activity feed, the end of uppercase labels and colored left bars.
5. On switches: "I love this kind of button, we should use them more across the site." → every yes/no setting
   became a switch; settings became rows.
6. "Make it better again, everywhere." → the sweep: every screen, the same details.
7. On options he feared were removed: "I love this, it's understandable — maybe format it better." → radio
   cards, nothing removed.
8. Before shipping the last batch: **"I want zero regressions."** → the no-regression pass found a crash
   (duplicate values), a lost accessible name, three alignment gaps and a production bug (a filter panel
   off-screen at 1440px) — all fixed before the push.
9. "I love every micro-detail you did. List them all, make it a skill." → this repository.

## Numbers from the pass

- 107 native `<select>` replaced by real menus in 29 files, with a drop-in component.
- Every yes/no setting moved from checkbox to switch (launch settings, bulk edit, settings of three
  integrations).
- 9 screens rebuilt on professional templates: analytics overview, AI strategist, report insights, activity,
  campaigns, accounts, settings, onboarding, bulk edit grid, plus the launch preview and review modal.
- 1 global rule removed tracked uppercase labels from ~40 different elements.
- 24 tests rewritten to real gestures; 2 vacuous tests caught (`queryByRole("combobox")` returning null
  for every menu).
- No regression reported since the deploy; one long-standing production bug fixed on the way.

## Lessons

- **Subtle is invisible.** The first pass changed real things that nobody could see. Rebuild whole screens
  on a reference; keep only before/after pairs that are obvious.
- **The owner's words are the spec.** "I love these" and "I can't stand this render" told us more than any
  design system. Keep the things they like; never remove what they understand.
- **Consistency beats brilliance.** One header band, one field style, one menu everywhere did more than any
  single clever component.
- **Polish is engineering.** Menus in modals, duplicate keys, accessible names, CSS layers and React's purity
  rules all bit. The pitfalls file is the price of the screenshots.
