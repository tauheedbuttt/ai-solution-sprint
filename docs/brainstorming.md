# Brainstorming — Retention Ideas

Raw ideas for the "Use fully" step. Focus is retention: what keeps an owner opening the app between the rare moments something breaks.

Related: [`challenge/02-careloop-brief.md`](challenge/02-careloop-brief.md), [`challenge/03-careloop-glossary.md`](challenge/03-careloop-glossary.md), [`challenge/checklist.md`](challenge/checklist.md).

---

## 1. Proactive nudges by email and push

Notify the owner with a suggested next action for a product they own. Repair, service, sell, keep, recycle.

- Trigger comes from product age, warranty window, logged usage, season, known failure patterns for that model.
- Message carries the reason, not just the reminder. "Your washer is 6 years old, drum bearings usually go now, a service costs less than a replacement."
- Covers Notice and Understand in the Notice -> Understand -> Decide -> Act chain.

AI role: predict the moment, recommend the action, write the message in plain language.

Open questions:
- How often before it becomes spam.
- What signal proves the nudge was right, so Learn has something to train on.

## 2. Rewards and streaks for logging

Give the owner something back when they enter product information or log a report.

- Points for adding a product, adding a receipt, logging a repair, confirming an outcome.
- Streak for keeping the log current over weeks or months.
- Rewards can be status, Care Print progress, or real value from partners.

Why it matters: the Ownership Log is only as good as what the owner puts in. Data entry is the weak link in the whole loop, so it should pay.

Open questions:
- Streaks reward frequency, but care is naturally rare. Maybe the streak counts months with the log kept accurate, not daily opens.
- Guard against junk entries farmed for points.

## 3. Discounts from verified repair shops

The owner gets a discount at CareLoop verified repair shops. The discount is funded by the insurer or by the shop.

- Insurer angle: a repaired product is a claim avoided, so subsidising the repair is cheaper than the payout.
- Shop angle: the discount buys access to a customer at the exact moment of need.
- Makes the "repair" choice economically obvious, not just virtuous.

Ties to the ecosystem table in the brief. Service providers need access to customers at the moment of need.

Open questions:
- Who verifies the shops and on what criteria.
- Does the insurer need the Ownership Log as proof of care before funding.

## 4. Verify a marketplace listing by scanning

A buyer scans the barcode or QR code from a listing and sees the product history behind it.

- Turns the Care Pass into something a stranger can check before paying.
- Seller benefit: verified history raises resale price.
- Buyer benefit: no more guessing whether the listing is honest.
- Brings people into the app who own nothing yet, which is a new acquisition path, not only retention.

Open questions:
- Privacy. What part of the log is public, what stays with the owner.
- Preventing a code being copied onto a different unit.

## 5. Auto logging by verified repair shops

A verified shop writes the repair straight into the Ownership Log when it handles the job.

- Removes the manual entry that owners forget to do.
- Third party entries are more trustworthy than self reported ones, which is what makes the Care Pass worth something.
- Shop gets a repeat channel to the customer.

Open questions:
- Consent flow. Owner should approve a shop writing to their log.
- What the record looks like so it maps cleanly to Digital Product Passport fields.

## 6. Home screen widget

A widget on the phone home screen showing the current suggestion and the actions available right now.

- Notice happens without opening the app. The nudge sits where the owner already looks.
- Understand comes from one line of reason on the widget face. "Filter due, 3 months since last change."
- Decide and Act are the tap targets. Log it done, book a shop, snooze, ask why.
- Tapping an action writes to the Ownership Log directly, so logging costs one tap instead of a session.

Why it matters: the app has no daily reason to be opened. The widget removes the need to open it at all, and still collects the log entry.

AI role: pick which single product and action to surface today out of everything the owner has.

Open questions:
- Only one slot at a time. What ranking decides the winner.
- What the widget shows when nothing is due. Care Print progress, or a resale value, or nothing.
- Android and iOS widget limits on refresh and interaction.

## 7. Employer sponsored logging

An employer pays for CareLoop as a staff benefit. Employees get rewards for logging and caring for what they own. The employer gets an aggregate sustainability figure to report.

- Employee side: the reward in idea 2 stops being points and becomes real value, funded by the employer.
- Employer side: repairs made, replacements avoided, waste diverted, all rolled up across staff who opted in.
- Sells CareLoop to a buyer with a budget, instead of asking consumers to pay.
- Fits alongside existing benefit schemes like bike or wellbeing allowances, so the buying process is familiar.

Why it matters: retention gets an outside sponsor. Someone other than the owner now wants the log kept current.

Open questions:
- Honest framing. Employee household appliances are not a company's Scope 3 emissions. This is voluntary CSR and staff engagement reporting, not an audited CSRD line. Overclaiming it is exactly the greenwashing the challenge warns about.
- Privacy. The employer sees aggregates only, never an individual log. Needs a hard line in the data model.
- Opt in must be genuine. A benefit that pressures staff to hand over home data is a liability.
- What the employer receives. A dashboard, a CSV, or a signed figure they can quote.

## Threads worth pulling

- Ideas 3 and 5 are the same partnership seen from two sides. One verified shop network could carry both.
- Ideas 2 and 5 pull in opposite directions. If shops auto log, the owner has less to log and fewer points to earn. Rewards may need to shift toward confirming outcomes rather than typing entries.
- Idea 4 is the payoff that makes ideas 2 and 5 worth the effort. History only has value if someone downstream will pay for it.
- Idea 6 is the delivery surface for idea 1. Same prediction engine, one pushes, one waits to be glanced at. The widget is the quieter version, and quieter may survive longer.
- Idea 7 changes who pays. Ideas 2, 3 and 5 all need someone to fund the reward or the discount. Employer, insurer and repair shop are three candidates for the same slot.
- Everything here depends on a log structure that a shop, an insurer and a buyer can all read. That is the data structure the challenge asks for.
