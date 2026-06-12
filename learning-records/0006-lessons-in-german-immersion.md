# Decision: lessons are written in German (full immersion, ~B1)

The learner decided that **lessons** should be authored **entirely in German** — explanations,
instructions, headings, and quiz feedback — so each lesson reads like a German *Lehrbuch* and
provides immersion that pushes toward B2/C1. No English inside lessons (full immersion); the
German itself is pitched at roughly **B1** so it stays followable.

## Scope
- **Applies to:** all lesson files in `lessons/` — retrofit 01–05 and author 06+ in German.
- **Stays in English:** the workspace documentation that the teacher reasons over — MISSION, NOTES,
  RESOURCES, GLOSSARY definitions, learning records, and the hub/cheat-sheet chrome. (GLOSSARY keeps
  German term names with English definitions, as before.)
- **Games (`games/`):** vocabulary is already German; their UI instructions stay English for now
  (they're study tools, not lessons) — can be Germanised later if desired.

## Implications
- Quiz feedback strings (JS data) must be rewritten in German too, not just the prose.
- Example sentences drop their English translation glosses (immersion).
- Keep sentences short and B1-level; introduce any genuinely new lesson vocabulary in a way that's
  inferable from context (the learner chose full immersion knowingly).
- A small German "Anweisungen/instructions" register is now standard: Ergänze…, Wähle…, Markiere…,
  Bestimme den Kasus…, Richtig oder falsch?, Stell deinem Lehrer Fragen…
