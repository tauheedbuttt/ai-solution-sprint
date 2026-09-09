---
status: ready-for-agent
tracker: none — local markdown, no issue tracker configured for this repo
depends-on: 01-scaffolding.md, 02-home-tab.md
---

# Spec: Verify Tab — CarePass Lookup

## Problem Statement

A shopper about to buy something secondhand, from a private seller, or just handed a product by someone else has no quick way to check its real care and ownership history before buying. CareLoop already holds this record — Care Pass, the certification of ownership and care (`docs/challenge/03-careloop-glossary.md`) — and already serves it publicly at a per-product URL (e.g. `thecareloop.app/pass/<id>`, confirmed live). The Verify tab exists in the bottom nav (`01-scaffolding.md`, story 3) but its content is unspecified — right now it's a stub.

From the shopper's perspective: "Someone's selling me this. Before I buy it, I want to see what CareLoop actually knows about it — is it trustworthy, how has it been treated, was it even bought where they say?"

## Solution

A Verify tab that identifies any product — the shopper's own or someone else's — the same way Scan does (`02-home-tab.md`, stories 3, 4, 5): live camera, photo uploaded from the gallery, or a single manual-entry field. Whatever code that capture step resolves is looked up against CareLoop's own data and rendered as a read-only, in-app Care Pass screen:

- Identity: brand, product name, category, ownership status.
- Trust Score with its confidence level (e.g. "estimated"), repairability, expected lifespan, in-use-since date.
- Care & repair history (a timeline of logged events) and a separate Repairs list.
- Next-life status (e.g. "still in active use", or the routing outcome if the item has one).
- **Purchase history** — retailer/point of sale, purchase date, price — sourced from receipts uploaded through the CareLoop webapp. The mobile app has no receipt-upload flow of its own (out of scope, see below); for this demo, purchase-history rows are assumed already present in the DB for the products used in the walkthrough, exactly like Trust Score and care history already are.

A code that resolves to nothing shows a clear "no Care Pass record found" state, not a blocked or broken-looking screen. This spec covers only the Verify tab's lookup and display; it does not add any write actions (logging care, requesting repair, routing next life) from this screen, even for a product the shopper already owns.

## User Stories

1. As a shopper, I want to open the Verify tab and scan a product's barcode with my camera, so that I can pull up its Care Pass before deciding whether to buy it from someone else.
2. As a shopper, I want to upload a photo of a barcode or the product from my gallery on the Verify tab, so that I can check a product I already photographed rather than pointing my camera at it live.
3. As a shopper, I want a manual-entry option with a single input field on the Verify tab, so that I can type a barcode or code when scanning isn't possible.
4. As a shopper, I want the Verify tab to use the exact same capture screen as the Scan flow, so that I don't have to learn a second way of identifying a product.
5. As a shopper, I want to see a product's Trust Score and its confidence level, so that I know both how it scored and how reliable that score is.
6. As a shopper, I want to see repairability and expected lifespan, so that I can judge how much life is realistically left in the item.
7. As a shopper, I want to see the in-use-since date, so that I know how long the current owner has actually had it.
8. As a shopper, I want to see the care & repair history timeline, so that I can judge how well the item has actually been looked after.
9. As a shopper, I want a dedicated Repairs list, so that I can see repair events called out on their own, not buried in the general history.
10. As a shopper, I want to see the item's next-life status, so that I know whether it's still in active use or has already been routed to reuse/resale/donation/refurbish/recycle.
11. As a shopper, I want to see purchase history — where it was bought, when, and for how much — so that I can sanity-check what the seller is telling me against CareLoop's own record.
12. As a shopper, I want a clear "no Care Pass found" message when a scanned or entered code doesn't match anything, so that I understand the product just isn't in CareLoop's data rather than assuming the app is broken.
13. As a shopper, I want Verify to work for products that aren't in my own Ownership Log, so that I can check something before I own it, not just something I already do.
14. As a shopper, I want the Verify tab's Care Pass screen to be read-only, so that I can't accidentally log care or take any ownership action against a product that isn't mine.
15. As a user, I want the Verify tab and its Care Pass screen to follow the CareLoop design system (dark theme, one accent color, pill buttons, sharp-cornered cards), so that it feels part of the same app as Home, Discounts, and Epassi.

## Implementation Decisions

- **Reuse the Scan flow's capture component wholesale — one seam, not two.** Verify's identification step is the same Camera scan / Gallery upload / Manual entry sub-tabs specified in `02-home-tab.md`, not a re-implementation. Skip Scan's third sub-tab, Manual product entry — Verify only looks products up, it never creates a new unrecognized product.
- **Divergent downstream call, same capture UI.** Scan's FAB flow feeds a recognized code into "add to my Ownership Log"; Verify feeds the same recognized code into a new "look up Care Pass" call. The capture component doesn't know or care which flow invoked it.
- **Care Pass screen layout** mirrors the structure already live at CareLoop's public per-product page (verified directly): identity header (brand, product name, category, status) → a stat-card row (Trust Score, Confidence, Repairability, Expected lifespan, In use since) → Care & repair history list → Repairs list → Next life status. Rendered natively in-app, not a webview embed of the public page.
- **Purchase history is a new section this spec adds** beyond what the public Care Pass page currently shows: retailer/point of sale, purchase date, price, one row per purchase record tied to the product. Source is receipts uploaded via the CareLoop webapp — no receipt-upload UI exists or is being built in this mobile app. For this sprint, treat purchase-history rows as already seeded in the demo DB for whichever products the demo walks through, the same assumption already made for Trust Score and care history.
- **Not-found state.** If the resolved code matches no Care Pass record, show an explanatory empty state (not an error) with a way to try scanning/entering again.
- **Read-only, always.** No log-care, request-repair, or next-life controls on this screen, regardless of whether the resolved product is one the signed-in shopper already owns.
- **Test seam.** Extend the existing `services/api`-style module (`01-scaffolding.md`) with one new call: resolve a Care Pass by code (barcode / manual text / gallery-recognized code) → returns the Care Pass detail (identity, score/confidence/repairability/lifespan/in-use-since, care & repair history, repairs, next-life status, purchase history) or a not-found result. Reuses Scan's existing capture-to-code recognition rather than duplicating it — the only new logic is the Care Pass lookup and its display.
- **Design system usage:** same treatment as Discounts and Epassi (`03-discounts-tab.md`, `04-epassi-tab.md`) — dark background, coral/`--brown-ink` accent, sharp corners on cards, mono-uppercase for stat-card labels (matches the live public page's own "TRUST SCORE" / "CONFIDENCE" style eyebrows).
- **Terminology discipline:** this screen shows a **Care Pass** (`docs/challenge/03-careloop-glossary.md` — "the certification of ownership and care"), distinct from the Home screen's personal Care Score (`02-home-tab.md`). The Trust Score shown here is the per-product score from the glossary, not the personal Care Score — don't blur the two.

## Testing Decisions

None. Per project convention (`CLAUDE.md`): no automated tests for this project — it's a sprint demo, not production code. The `services/api` seam extension described above is for structural clarity only, not a test boundary.

## Out of Scope

- Receipt upload UI in the mobile app — receipts are uploaded only through the CareLoop webapp; this spec only reads purchase history that's assumed already in the DB.
- Editing, disputing, or flagging a Care Pass record from the mobile app.
- Any write action (log care, request repair, next life) from the Verify tab, even against a product the shopper already owns — that flow stays on Log (`02-home-tab.md`).
- Sharing or deep-linking a Care Pass out of the app (the public web page at `thecareloop.app/pass/<id>` already covers external sharing).
- A distinct visual treatment for "this is a product you already own" versus someone else's — not decided in this pass (see Further Notes).
- Publishing this spec to an external issue tracker — none configured for this repo.

## Further Notes

- Depends on `01-scaffolding.md` for the app shell and the `services/api` seam, and on `02-home-tab.md` for the Scan capture component (camera / gallery upload / manual entry) this spec reuses.
- Reference for the Care Pass screen's real shape: `https://thecareloop.app/pass/4220e00a69424ac0b624ca6a3cafc119` (live, checked via browser during this spec's authoring) — header, four/five stat cards, care & repair history, repairs, next life, plus a footer disclaimer ("A Care Pass is an ownership record issued by The Care Loop. It is not a Digital Product Passport and is not independently verified.") worth carrying into the in-app screen's copy.
- Open question for build time: should a resolved product that's already in the signed-in shopper's own Ownership Log get a visual "this is yours" badge on the Verify screen, or look identical to any other lookup? Not decided here.
