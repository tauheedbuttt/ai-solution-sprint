---
status: ready-for-agent
tracker: none — local markdown, no issue tracker configured for this repo
depends-on: 01-scaffolding.md, 03-discounts-tab.md
---

# Spec: Epassi Tab — Strong Identification Gate + Employer Benefits List

## Problem Statement

The Epassi tab in the bottom nav (`01-scaffolding.md`, story 3) is unspecified — right now it's a stub. The real Epassi ties benefit access to strong identification (e.g. BankID-style e-ID) so an employer can confirm an employee's identity before releasing paid benefits. Owners have no way in the app yet to see what their employer offers, or what's blocking access to it.

From the owner's perspective: "My employer offers benefits through Epassi. I want to see them and know what I need to do to unlock each one."

## Solution

A two-state Epassi tab:

1. **Gate screen (default).** Shown until the owner enables strong identification. Copy explains benefits sit behind an identification requirement. Single CTA: "Enable strong identification." Tapping it sets an identified flag to true — no real auth flow or external redirect, demo only, consistent with this project's no-tests / sprint-demo convention (`CLAUDE.md`).
2. **Benefits screen (post-identification).** A list of benefits offered by the owner's employer. Reuses the Discounts tab's progress/lock mechanic (`03-discounts-tab.md`): each benefit shows a threshold (log count + period), a progress bar against the owner's current-period log count, a locked CTA with remaining-logs copy until the threshold is met, and an active CTA once unlocked.

This spec has a single actor (the owner's own employer), so there's no actor-type category row like Discounts has. The detail page mirrors the Discounts detail page layout, minus actor-type context.

## User Stories

1. As a shopper, I want to open the Epassi tab and see a strong-identification gate if I haven't identified yet, so I understand benefits require verifying who I am first.
2. As a shopper, I want a single tap to enable strong identification (demo, no real verification flow), so I can reach the benefits screen quickly in this sprint build.
3. As a shopper, once identified, I want to see every benefit my employer offers, not just the ones I've unlocked, so I know what's available and what to work toward.
4. As a shopper, I want each benefit card to show a progress bar against its own log threshold and period, so I can tell how close I am to unlocking it.
5. As a shopper, I want a locked benefit's CTA to state how many more logs I need, so I know exactly what to do next.
6. As a shopper, I want an unlocked benefit's CTA to be active, so I can act on it immediately.
7. As a shopper, I want to tap a benefit card and land on its detail page (employer name, headline, description/terms, same progress/lock state), so I can read the full offer before acting.
8. As a shopper, I want back and share actions on the detail page, matching the Discounts detail page, so navigation stays consistent across tabs.
9. As a user, I want the Epassi tab to follow the CareLoop design system (dark theme, one accent color, pill buttons, sharp-cornered cards), so it feels part of the same app as Home and Discounts.

## Implementation Decisions

- **Identification state is local, demo-only, non-persisted — confirmed with user.** No BankID/e-ID integration, no backend call. A boolean flag (in-memory only, e.g. component/app state) flips on tap of the gate CTA. It resets on app reload/restart — no `AsyncStorage`, no backend write. Every fresh app open shows the gate screen again.
- **Gate screen content:** short headline plus one line explaining benefits are locked behind strong identification, single primary pill CTA "Enable strong identification." No form fields, no external redirect.
- **Benefits list reuses the Discounts mechanic exactly** (`03-discounts-tab.md`): threshold shape (log count + period), progress numerator (any Ownership Log entry in the current period, per 03's confirmed rule), period reset behavior, and the locked/unlocked CTA states and copy pattern ("Log N more to unlock").
- **No actor-type tabs.** The employer is the only actor here; skip Discounts' Brand / Service provider / Retailer / City row entirely.
- **Detail page layout** mirrors `03-discounts-tab.md`'s detail page (hero image, back/share icons, headline, description/terms, progress bar, locked/unlocked messaging, primary pill CTA pinned near the bottom), minus actor-type context and minus favoriting (no heart icon, consistent with 03).
- **Test seam:** extend the existing `services/api`-style module (introduced in `01-scaffolding.md`, extended by `03-discounts-tab.md`). Add: identification-state read/write (demo stub), employer benefits list, and benefit detail by id. Reuse the existing current-period log count logic from 03 rather than duplicating it.
- **Design system usage:** same treatment as `03-discounts-tab.md` (dark background, coral/`--brown-ink` accent on progress-bar fill and the primary CTA, sharp corners on cards, pill radius on the CTA button, mono-uppercase for small labels/eyebrow text).
- **Terminology discipline:** call these "benefits," never "discounts" or "coupons." Keep distinct from the Discounts tab's content and from Care Score / Trust Score (`docs/challenge/03-careloop-glossary.md`).

## Testing Decisions

None. Per project convention (`CLAUDE.md`): no automated tests for this project — it's a sprint demo, not production code. The `services/api` seam extension described above is for structural clarity only, not a test boundary.

## Out of Scope

- Real strong identification / e-ID integration (BankID or equivalent). The gate is a single demo tap, no verification.
- The employer portal where benefits and thresholds get authored — out of scope, same as `03-discounts-tab.md`'s actor portals.
- Actor-type category tabs — single actor (employer) only.
- Favoriting/wishlist on benefit cards or the detail page.
- Actual redemption mechanics behind the unlocked CTA.
- Notifications when a benefit newly unlocks.
- Publishing this spec to an external issue tracker — none configured for this repo.

## Further Notes

- Depends on `01-scaffolding.md` for the app shell and the `services/api` seam, and on `03-discounts-tab.md` for the progress/lock mechanic this spec reuses rather than reinvents.
