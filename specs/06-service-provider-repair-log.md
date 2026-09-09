---
status: ready-for-agent
tracker: none — local markdown, no issue tracker configured for this repo
depends-on: 01-scaffolding.md, 02-home-tab.md, 05-verify-tab.md
---

# Spec: Service Provider — Scan + Repair Log, and Account Settings (all tabs)

## Problem Statement

A service provider (repair shop, technician) signs in with their role declared at sign-in (`01-scaffolding.md`, story 2), but today lands in the same four-tab shopper shell as everyone else — Home, Discounts, Epassi, Verify — none of which are theirs. There's no way for a provider to record, against a specific product, what they actually fixed. That work either goes unrecorded or lives outside CareLoop entirely, so the product's Care Pass never reflects repairs a provider performed on it.

From the provider's perspective: "Someone brings me their product to fix. I want to pull up that exact item and note down what I did to it, fast, so it's on record."

## Solution

A dedicated, single-screen provider experience that replaces the shopper's tab shell for anyone signed in with the `service_provider` role:

- No bottom tab bar — one screen, reached straight after sign-in.
- Identify the product the same way Scan and Verify already do (`02-home-tab.md` stories 3–5, reused wholesale minus its manual-product-entry fallback): live camera barcode scan, or a single manual-entry code field. A provider is always acting on a product that already exists in CareLoop — there's no "create a new catalog draft" path here.
- Once a product is identified, a short form to log what was done: what was fixed (short text), optional notes, submit.
- The entry writes into that product's shared care & repair history — the same history the shopper sees on their Verify tab Care Pass (`05-verify-tab.md`: care & repair history timeline, and the dedicated Repairs list). One record, one source of truth; the provider isn't writing to a private log only they can see.
- After submit, a lightweight confirmation, then straight back to identifying the next product — this is a repeat-all-day flow (in-shop, one item after another), so it should never trap the provider on a "done" dead end.

This spec does not build a job queue, an incoming-repair-request inbox, or any matching between a shopper's "Find repair" request (`02-home-tab.md`, story 12) and a provider's work. It's the smallest useful loop: identify a product, log what was fixed.

Separately, no screen in the app today — shopper or provider — has any way to check which account is signed in or sign out of it. This spec also adds a settings icon to a top app bar on every main screen (the shopper's four tabs — Home, Discounts, Epassi, Verify — and the provider's own screen). Tapping it opens a minimal sheet: the signed-in email address and a logout button, nothing else.

## User Stories

1. As a service provider, I want to land directly on my own screen after signing in, so that I'm not shown four shopper tabs that aren't for me.
2. As a service provider, I want no bottom tab bar at all, so that the screen stays as simple as the one thing I actually do here.
3. As a service provider, I want to scan a product's barcode with my camera, so that I can pull up the exact item in front of me without typing anything.
4. As a service provider, I want a manual-entry option with a single input field, so that I can identify a product by code when scanning fails or isn't practical.
5. As a service provider, I want the scan/manual-entry step to work the same way it does elsewhere in the app (Scan, Verify), so that I'm not learning a third variant of the same interaction.
6. As a service provider, I want a clear "not found" state if a scanned or entered code doesn't match any CareLoop product, so that I know to try again rather than assume the app is broken.
7. As a service provider, once a product is identified, I want to see enough identity (name, brand) to confirm it's the right item before I log anything against it.
8. As a service provider, I want a simple form to describe what I fixed, so that entering a repair takes seconds, not minutes.
9. As a service provider, I want an optional notes field for anything the short "what was fixed" text doesn't capture, so that I can add detail when it's actually useful without it being required every time.
10. As a service provider, I want one primary submit action to log the entry, so that finishing a repair record is a single clear step.
11. As a service provider, I want my logged repair to become part of that product's permanent care & repair history, so that the owner (and anyone checking its Care Pass later) can see it was professionally repaired.
12. As a service provider, I want a lightweight confirmation after I submit, so that I know the entry saved.
13. As a service provider, I want to be returned straight to the identify-a-product step after confirming, so that I can immediately log the next item without extra navigation.
14. As a service provider, I want this screen to follow the CareLoop design system (dark theme, one accent color, pill buttons, sharp-cornered cards), so that it feels like the same app, not a bolted-on tool.
15. As a service provider, I want to be able to sign out from this screen, so that a shared shop device can be handed to the next person.
16. As any signed-in user (shopper or provider), I want a settings icon on a top app bar on every main screen I land on, so that I always have one consistent place to check my account or sign out.
17. As any signed-in user, I want tapping the settings icon to show my signed-in email address, so that I can confirm which account I'm using.
18. As any signed-in user, I want a logout button in that same panel, so that signing out doesn't require hunting through a menu.
19. As any signed-in user, I want the settings panel to show nothing beyond email and logout, so that it stays a one-glance utility, not a preferences screen.
20. As any signed-in user, I want the settings panel to look and behave like the rest of the app's sheets/modals, so that it doesn't feel bolted on.

## Implementation Decisions

- **Navigation seam.** `navigation/root.tsx` already branches on `user` from `useAuth()` to choose between `SignInScreen` and `Tabs`. Extend that same branch on `user.role`: `service_provider` renders a new single-screen `ProviderHome`, everyone else keeps `Tabs` unchanged. No tab bar, no `Tabs`/`TabBar` involvement for providers — this is a peer of `Tabs` at the root, not a tab inside it.
- **Capture seam — reuse, don't rebuild.** Reuses the exact camera-scan / manual-entry pattern from `02-home-tab.md`'s Scan flow (already reused once by `05-verify-tab.md`), skipping only its third sub-tab (manual product entry), since a provider never creates a catalog draft — only looks up a product that must already exist. Same recognition call, same not-found handling shape as the other two consumers of this capture pattern.
- **Data-access seam — one new write, on the existing module.** Extend `services/api` with a repair-log write that appends to the same care & repair history / Repairs list `05-verify-tab.md` already reads for the Care Pass screen: `repairLog.add(productId, { summary: string; note?: string })` (naming indicative, not binding). No new read call needed for identification — reuses `products.recognize(code)` already in the seam. No new storage concept — extends whatever per-product history array already backs Verify's Care Pass timeline and Repairs list, so a provider's entry appears there without any change on the shopper side.
- **Not-found state.** Same explanatory empty state as Verify (`05-verify-tab.md`) — not an error — with a way to retry scan/manual entry.
- **Product confirmation before logging.** After a successful match, show minimal identity (name, brand) above the log form so the provider can confirm it's the right item before entering repair details — mirrors the identity header pattern already established on the Care Pass screen.
- **Log form fields, kept deliberately short:** what-was-fixed (required, short text — not a long-form description), optional notes (textarea). No category/type select, no partner select, no cost field — a provider logging their own completed work doesn't need the shopper-facing "Find repair" partner-matching fields (`02-home-tab.md` story 12), which are a different flow (a shopper requesting repair, not a provider recording one performed).
- **Loop-back after submit.** On successful save, show a brief confirmation (toast/inline, not a blocking modal) and reset straight back to the identify-a-product step — no intermediate "home" or summary screen, since this flow repeats all day against a stream of different products.
- **Settings seam — one shared component, mounted at two points.** A single `AppBar`-style component (settings icon, right-aligned) renders the same settings sheet everywhere: (1) added once via `screenOptions.header` on the shopper's `Tab.Navigator` (`navigation/tabs.tsx`), so it appears identically across Home, Discounts, Epassi, Verify without touching each screen file; (2) rendered directly at the top of `ProviderHome`, since that screen has no navigator to hang a shared header option off. Same component, same sheet content, two mount points — not two implementations. This also supersedes the earlier "small sign-out icon" idea for the provider screen (story 15) — the shared settings icon covers that need.
- **Settings sheet content.** Reuses the existing `Sheet`/`SheetHeader` modal pattern already used by Scan/Log capture. Body: signed-in email (from `useAuth().user.email`, read-only), one primary pill "Log out" button calling `useAuth().signOut()`. Nothing else — no profile editing, no preferences, no role display.
- **Design system usage:** same baseline as every other screen (`01-scaffolding.md`) — dark background, coral/`--brown-ink` accent, pill buttons, sharp-cornered cards, hairline-bordered form inputs, mono-uppercase eyebrows for small labels.

## Testing Decisions

None. Per project convention (`CLAUDE.md`): no automated tests for this project — it's a sprint demo, not production code. The `services/api` seam extension described above is for structural clarity only, not a test boundary.

## Out of Scope

- Job queue or incoming-repair-request inbox for providers — matching a shopper's "Find repair" request (`02-home-tab.md`, story 12) to a provider is a separate, unbuilt concept and needs its own spec if pursued.
- Any provider-side view of a product's full history beyond what's needed to confirm identity before logging (no full Care Pass screen for providers in this spec).
- Editing or deleting a previously logged repair entry.
- Multi-provider attribution, shop/account management, or any provider profile beyond the existing sign-in role.
- Cost, invoicing, or payment for the repair.
- Any settings beyond email display and logout — no name/avatar editing, no password change, no notification preferences, no theme toggle.
- A settings entry point on the sign-in screen (only relevant once signed in).
- Publishing this spec to an external issue tracker — none configured for this repo.

## Further Notes

- Depends on `01-scaffolding.md` for auth/role, the `services/api` seam, and the shopper's `Tab.Navigator` this spec adds a shared header to; `02-home-tab.md` for the reused Scan capture component; `05-verify-tab.md` for the shared care & repair history / Repairs list this spec's write feeds into.
- The settings/app-bar feature is intentionally cross-cutting — it touches the shopper's existing tab shell (`01-scaffolding.md`), not just the new provider screen this spec otherwise adds. Bundled here rather than as a separate spec since it's small and was requested alongside this one.
- Confirmed with the user before writing: (1) provider repair entries write into the same shared history the shopper's Verify Care Pass already displays, not a separate provider-only log; (2) the provider shell has no tab bar at all — a literal single screen; (3) the identify-a-product step reuses the existing ScanFlow capture pattern rather than a new one; (4) the settings panel is deliberately minimal — email + logout, nothing else.
- `ready-for-agent` in the frontmatter is a status marker only — no tracker workflow behind it. Treat it as "specified enough to hand to a build agent."
