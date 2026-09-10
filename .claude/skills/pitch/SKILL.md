---
name: pitch
description: Compare a practice pitch transcript (from Wispr Flow) against the hackathon jury evaluation criteria and score it. Use when the user invokes /pitch or asks to review/score a practice pitch recording.
---

Score a practice pitch recording against `docs/challenge/04-jury-evaluation-criteria.md`, the jury evaluation criteria for this hackathon.

## Args

`$ARGUMENTS` names which transcript to use — a meeting/note title, date, or keyword (e.g. `/pitch practice run 3`, `/pitch today`, `/pitch monday afternoon`). If empty, use the most recent pitch-practice recording.

## Process

1. Read `docs/challenge/04-jury-evaluation-criteria.md` for the six criteria and their 1/3/5 score descriptions.

2. Find the transcript in Wispr Flow (`mcp__wispr__*` tools):
   - Try `search_meetings` and `search_scratchpad_notes` with the arg text as query.
   - If arg is empty or clearly a relative date ("today", "yesterday"), use `list_upcoming_meetings` / recent search and pick the most recent pitch-practice-sounding result.
   - If multiple plausible matches come back, list them (title + time) and ask the user which one, rather than guessing.
   - Fetch full content with `get_meeting` or `get_scratchpad_note` once you have the right id.
   - Convert any UTC timestamps to the user's local time before showing them.

3. Read the full transcript text.

4. For each of the six criteria (Problem, Solution, Value Proposition, Hackathon results + project proposal, Team, Pitch quality), judge what the transcript actually delivers against the 1/3/5 rubric descriptions, and assign the closest score (1, 3, or 5 — don't invent 2/4 unless the transcript is genuinely split between two rows).

5. Report as a table: Criteria | Score | Why (1-2 sentences quoting or paraphrasing the transcript) | What would push it to the next score up.

6. End with total score (out of 25) and the single highest-leverage change to make before the real pitch.

Don't rewrite the pitch for the user unless asked — this is a scoring pass, not a rewrite.
