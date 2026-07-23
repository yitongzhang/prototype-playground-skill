# prototype-playground

A [Claude Code skill](https://docs.anthropic.com/en/docs/claude-code) that
turns any product repo into a **standalone prototype playground**: a small
local app with your product's design system, fake data, and a pixel-perfect
clone of your main screen — so an agent can crank out UI iterations without
touching production builds, backends, or secrets.

## Why

Prototyping inside a production repo is slow. CI builds are heavy, secrets
are missing, the backend has to be up, and every experiment risks breaking
something real. Iterating on data shapes through a live database is even
worse.

This skill does a one-time extraction into a clean sibling repo. After that,
requests like *"give me six versions of this app with six different
navigation styles"* become six cheap, self-contained iteration directories —
no infrastructure involved.

## What you get

Running the skill against a source repo produces a `<your-app>-playground`
repo containing:

1. **A cleaned design system** — tokens (color, type, spacing, radius,
   shadow), fonts, icons, illustrations, and core components, extracted *as
   they should exist*: one semantic system, duplicates collapsed, identical
   rendered pixels.
2. **A fake data layer** — typed fixtures replicating your app's core data
   shapes. The whole app runs off one editable `fixtures.ts`; interactions
   work through a tiny observable store. No network, ever.
3. **A master prototype** — your app's main screen, rebuilt from the design
   system and fixtures, verified pixel-perfect against a production
   screenshot in a screenshot-diff loop. It's registered as the frozen
   source of truth.
4. **A Figma-files-style shell** — the index page lists every prototype as a
   card (master + iterations); click into one for a full-screen prototype
   with prev/next switching. A generated `AGENTS.md` inside the playground
   teaches future agent sessions how to add iterations correctly.

The playground itself is dependency-light on purpose: React + Vite, hash
routing, zero router/state libraries. `npm install && npm run dev` is the
entire setup.

## Install

Clone into your Claude Code skills directory — globally:

```bash
git clone https://github.com/yitongzhang/prototype-playground-skill ~/.claude/skills/prototype-playground
```

or per-project:

```bash
git clone https://github.com/yitongzhang/prototype-playground-skill .claude/skills/prototype-playground
```

## Use

From the repo you want to clone:

```
/prototype-playground
```

or with arguments:

```
/prototype-playground path/to/repo "the inbox screen"
```

The skill surveys the repo, asks for a production screenshot only if it
can't run the app locally, and builds the playground as a sibling directory.
Afterwards, work directly in the playground:

> "Copy master and try a version with a command-bar-first navigation."
>
> "Make six iterations exploring different sidebar densities."
>
> "Add 50 more tasks to the fixtures with longer titles."

## Repo layout

```
SKILL.md                          # the workflow (phases 0–7 + robustness notes)
references/
  design-system-extraction.md     # where tokens hide per stack; cleaning rules
  pixel-perfect-verification.md   # screenshot-diff loop; exit criteria
templates/scaffold/               # copied to create each new playground
  AGENTS.md                       # rules shipped inside every playground
  src/shell/                      # Figma-style index + prototype chrome
  src/design-system/              # tokens + components (filled by extraction)
  src/data/                       # store + fixtures (filled by extraction)
  src/prototypes/master/          # replaced by the pixel-perfect clone
```

## Notes

- Works best with a high-capability model — the extraction and
  pixel-matching phases are judgment-heavy.
- The source repo is only ever read, never modified.
- Templates are React; for Vue/Svelte/Angular sources the skill recreates
  the five small shell files in the source framework instead.

## License

MIT
