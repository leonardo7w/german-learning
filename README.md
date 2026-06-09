# 🇩🇪 German Learning

A personal, stateful workspace for learning German with [Claude Code](https://claude.com/claude-code),
powered by the [`/teach` skill](https://github.com/mattpocock/skills) by Matt Pocock.

## Getting started

Open this repo in Claude Code and run:

```
/teach German
```

On the first run, the teacher will interview you about *why* you want to learn German
(your mission), then produce short, beautiful, interactive HTML lessons — one tightly-scoped
thing at a time — and track your progress across sessions.

## What lives here

| Path | Purpose |
| --- | --- |
| `MISSION.md` | Why you're learning German + what success looks like |
| `RESOURCES.md` | Curated, high-trust learning sources |
| `GLOSSARY.md` | Canonical German terms you've mastered |
| `lessons/` | Self-contained HTML lessons (`0001-…html`) |
| `reference/` | Cheat-sheets to revisit (grammar tables, etc.) |
| `learning-records/` | Decision-grade records of what you've learned |
| `.claude/skills/teach/` | The installed teaching skill |

> The content files are created on demand as you learn — the repo starts mostly empty by design.

## Updating the skill

The `/teach` skill is vendored from `mattpocock/skills` (`skills/productivity/teach`).
To update it, re-copy that directory into `.claude/skills/teach/`.
