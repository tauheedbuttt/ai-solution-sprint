---
status: ready-for-agent
tracker: none — local markdown, no issue tracker configured for this repo
---

# Spec: App Scaffolding — Auth, Navigation Shell, Data-Access Seam

## Problem Statement

Before any CareLoop feature (Home, Discounts, Epassi, Verify, Scan, Log) can exist, the app needs a bare shell: a way in, and a way to move between the app's four top-level destinations. Right now there is no app at all — no auth, no navigation, no agreed boundary between screens and data.

From the owner's perspective: "I need to sign in, tell the app who I am, and land somewhere I can actually get around."

## Solution

The minimal scaffold every other spec in this repo builds on:

- Sign in with email and password, declaring a role (shopper or service provider) before authenticating.
- A bottom tab bar with four icon-only destinations — Home, Discounts, Epassi, Verify — routed but not yet populated with feature content.
- One data-access seam (`services/api`-style module) that every screen reads and writes through, so mock and real data can be swapped in one place.
- The CareLoop design system baseline (dark theme, one accent color, pill buttons, sharp-cornered cards) applied consistently from the first screen, so every feature spec inherits it rather than re-deciding it.

This spec stops at the point of a navigable, empty shell: four tabs exist and route correctly, but their content is specified elsewhere (`02-home-tab.md` for Home; Discounts, Epassi, and Verify tab content in `03-discounts-tab.md`, `04-epassi-tab.md`, `05-verify-tab.md`). The floating action button and its Scan/Log capture flows are also feature content, not scaffolding — see `02-home-tab.md`.

## User Stories

1. As a shopper, I want to sign in with email and password, so that my Ownership Log is tied to my account.
2. As a user, I want to declare my role (shopper or service provider) before I sign in, so that the app routes me to the right experience.
3. As a signed-in shopper, I want a bottom tab bar with four icon-only destinations (Home, Discounts, Epassi, Verify), so that I can move around the app without reading labels every time.
4. As a user, I want every screen to visually follow the CareLoop design system (dark theme, one accent color, pill buttons, sharp-cornered cards, hairline-bordered forms), so that the app feels like part of the same product as the marketing site.
5. As a service provider, I want to sign in through the same flow with my role recognized, so that I'm not blocked from using the app even though my dedicated screens aren't built yet in this MVP.

## Implementation Decisions

- **Platform**: React Native + Expo. Demoed through `react-native-web` at a mobile viewport (~390×844) via browser device emulation — no native build in this sprint.
- **Test seam — single data-access module.** All screens read and write through one `services/api`-style module. This scaffold introduces it with no calls yet defined — each feature spec (`02-home-tab.md`, `03-discounts-tab.md`, `04-epassi-tab.md`, `05-verify-tab.md`) extends it with the calls its own screens need. This is the one seam in the app; screens never call a backend/mock directly.
- **No automated tests** for this project (sprint demo, not production code) — see `CLAUDE.md`. The seam above exists for structural clarity (one place to swap real/mock data), not for test substitution.
- **Auth**: email + password fields, one primary pill submit button. A role selector (Shopper / Service provider segmented control) sits above the form and is captured at sign-in, not toggled later in this MVP.
- **Navigation shell**: bottom tab bar, four icon-only items (Home, Discounts, Epassi, Verify), active state indicated by accent color + underline treatment adapted from the design system's tab-bar pattern. No text labels. Routes to each tab's screen; tab content itself is out of scope here.
- **Design system usage**: pull tokens/patterns, don't port the design-system file wholesale. Dark background + one accent color (coral/`--brown-ink`) for primary actions; mint reserved for icons/success; pill radius only on buttons/chips/FAB; sharp corners (radius 0) everywhere else; mono uppercase reserved for small labels/eyebrows; flat hairline-bordered form inputs on the sign-in form. Every downstream spec inherits this baseline rather than restating it in full.
- **Service provider role**: for this MVP, routes into the same four-tab shell as a shopper. A dedicated service-provider experience (job queue, incoming repair requests) isn't scaffolded here and needs its own spec.
- **Screens out of this spec's detail**: FAB, Scan, Log, and Home content (`02-home-tab.md`); Discounts, Epassi, Verify tab content (`03-discounts-tab.md`, `04-epassi-tab.md`, `05-verify-tab.md`) — all stubs at this layer.

## Testing Decisions

None. Per project convention (`CLAUDE.md`): no automated tests for this project — it's a sprint demo, not production code. The single data-access seam described above is a structural decision for keeping mock/real data swappable, not a test boundary.

## Out of Scope

- Any tab's feature content — Home (`02-home-tab.md`), Discounts (`03-discounts-tab.md`), Epassi (`04-epassi-tab.md`), Verify (`05-verify-tab.md`).
- The floating action button and its Scan/Log capture flows — feature content, specified in `02-home-tab.md`.
- Dedicated service-provider screens (job queue, incoming repair requests).
- Sign-up and forgot-password flows.
- Publishing this spec to an external issue tracker — none is configured for this repo (no git remote, no `docs/agents/issue-tracker.md`); specs stay as local markdown under `specs/`.

## Further Notes

- Every other spec in this repo depends on this one for the app shell, sign-in, navigation, and the `services/api` seam: `02-home-tab.md`, `03-discounts-tab.md`, `04-epassi-tab.md`, `05-verify-tab.md`.
- `ready-for-agent` in the frontmatter is a status marker only — there's no tracker workflow behind it to enforce that state machine. Treat it as "this doc is specified enough to hand to a build agent," not as a ticket state.
