# {{APP_NAME}} Prototype Playground

A standalone prototyping clone of {{APP_NAME}} (source repo: `{{SOURCE_REPO}}`).
No backend, no network, no production secrets. Everything runs locally:

```bash
npm install
npm run dev
```

The index page (`#/`) is a Figma-files-style list of every prototype. Each
prototype is a full app screen at `#/<slug>`.

## Layout

| Path | Owns |
| --- | --- |
| `src/shell/` | Playground navigation (index page, chrome, registry). Neutral `pg-*` styling — do not restyle per prototype. |
| `src/design-system/` | Extracted tokens, typography, icons, illustrations, and core components. Single source of truth for all visual primitives. |
| `src/data/` | Fake data: `types.ts` (domain types), `fixtures.ts` (the editable dataset), `index.ts` (store + hooks). |
| `src/prototypes/master/` | Pixel-perfect clone of the production main screen. **Frozen — never edit.** |
| `src/prototypes/<slug>/` | One directory per iteration. |
| `reference/` | Production screenshots the master was verified against. |
| `public/thumbnails/` | Card images for the index page. |

## Rules

1. **Master is frozen.** `src/prototypes/master/` is the source of truth for
   what production looks like. Iterations copy from it; nothing edits it.
2. **One directory per iteration.** Iterations are self-contained: shared code
   lives in `design-system/` and `data/`, everything else is copied, not
   imported across iterations. Divergence between iterations is the point.
3. **All visuals come from the design system.** Use tokens and components from
   `src/design-system/`. Tokens live in the Tailwind v4 `@theme` block in
   `tokens.css`, so token-derived utilities (`bg-surface`, `text-muted`) are
   the normal way to style. If an iteration needs a new primitive, add it to
   the design system (token-driven), not inline.
4. **All data comes from fixtures.** Read state via the hooks in `src/data/`.
   To change what the app shows, edit `src/data/fixtures.ts` — nothing else.
   No fetch calls, no APIs, no timers pretending to be servers.
5. **Keep the registry truthful.** Every prototype has an entry in
   `src/shell/registry.ts` with an honest description of what it explores.

## Adding an iteration

1. Copy the starting point: `cp -r src/prototypes/master src/prototypes/<slug>`
   (or copy another iteration if that is the stated base).
2. Register it in `src/shell/registry.ts` with `kind: 'iteration'`, today's
   date, and a description of the idea being explored.
3. Build the variation. Reuse design-system components; extend the design
   system if the variation genuinely needs a new primitive.
4. Verify in the browser at `#/<slug>`, and check the index page still lists
   everything.
5. Optional: drop a screenshot at `public/thumbnails/<slug>.png` and set
   `thumbnail: '/thumbnails/<slug>.png'` on the registry entry.

Batch requests like "make six nav variants" = six iteration directories, six
registry entries, one shared design system and dataset.

## Deploying

`npm run build` emits a plain static site in `dist/` — no server, no env
vars. Host it anywhere static (Netlify drop, `npx vercel`, Cloudflare Pages,
GitHub Pages); hash routing means no rewrite rules are needed.
