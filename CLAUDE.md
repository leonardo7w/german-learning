# German Learning Workspace

This repository is a **stateful teaching workspace** for learning German, driven by
the `/teach` skill (installed at `.claude/skills/teach/`).

## How this workspace works

Run `/teach` to start or continue a German lesson. The skill treats this repo's
root as the workspace and reads/writes the following state:

- `MISSION.md` — why I'm learning German and what success looks like. Grounds every lesson.
- `RESOURCES.md` — curated, high-trust sources for German learning.
- `GLOSSARY.md` — canonical terminology (built up only as concepts are genuinely understood).
- `NOTES.md` — my teaching preferences and working notes.
- `lessons/*.html` — self-contained, beautiful HTML lessons (`0001-<slug>.html`, incrementing).
- `reference/*.html` — compressed cheat-sheets / reference material to revisit.
- `learning-records/*.md` — what I've actually learned (`0001-<slug>.md`), used to gauge my zone of proximal development.

These files don't exist yet — they're created on demand as learning progresses. See
`.claude/skills/teach/` for the formats.

## Conventions for the teacher (Claude)

- Ground all teaching in `MISSION.md`. If it's empty or unclear, interview me first.
- Draw knowledge from `RESOURCES.md`, not parametric guesses; cite sources in lessons.
- Each lesson teaches exactly one thing, tied to the mission, in my zone of proximal development.
- Lessons are German-language learning content — explanations in English, German examples
  with translations, and an interactive feedback loop (quiz or practice).
- Keep lessons openable with a single command (e.g. `open lessons/0001-*.html`).
