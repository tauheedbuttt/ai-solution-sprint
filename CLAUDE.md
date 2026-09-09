# ai-solution-sprint

- Challenge docs live in `docs/challenge/` (`01-careloop-challenge.md` = challenge definition, `02-careloop-brief.md` = partner brief, `03-careloop-glossary.md` = six core feature terms). Source PDFs and images in `assets/`.
- No automated tests for this project — sprint demo, not production code.
- Never boot dev servers (backend, mobile) yourself unless confirmed nothing's already running on that port. User keeps their own server running and tests manually — check with `lsof -i :<port>` first, or curl the port they're already using.
