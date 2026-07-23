# Design System Extraction

Goal: produce the design system **as it should exist**, not as it exists.
Source repos accumulate duplicate tokens, near-identical grays, and three
button implementations. The playground gets one clean, semantic system that
reproduces the same rendered pixels.

## 1. Find the raw material

Search the source repo in this order; most apps use several at once.

| Where tokens hide | What to look for |
| --- | --- |
| Tailwind | `tailwind.config.{js,ts}` `theme`/`extend`; Tailwind v4 `@theme` blocks in CSS |
| CSS custom properties | `:root { --* }` in global/app CSS, theme files, `[data-theme]` blocks |
| CSS-in-JS themes | `ThemeProvider` value; `theme.ts`, `createTheme` (MUI), `extendTheme` (Chakra), Mantine/styled-components theme objects |
| Token pipelines | `tokens.json`, `*.tokens.json`, Style Dictionary configs, Figma-tokens exports |
| Sass/Less | `_variables.scss`, `_colors.scss`, `$`/`@` variable files |
| Constants | `colors.ts`, `typography.ts`, `spacing.ts` exported objects |

Also inventory: `@font-face` declarations and font files; icon usage (which
npm library and which names, or local SVG directories); logos and
illustrations (`public/`, `assets/`, `static/`); global CSS resets.

If tokens are nowhere defined (all hardcoded hex values), harvest computed
styles from the running app via browser devtools/JS evaluation on the real
elements of the main screen, then normalize.

## 2. Clean while extracting

Write the result as CSS custom properties in `src/design-system/tokens.css`,
two tiers:

1. **Primitives** — the raw ramps: `--color-gray-100…900`, `--color-brand-*`,
   type sizes, spacing steps, radii, shadows.
2. **Semantic aliases** — what components consume: `--color-bg-surface`,
   `--color-text-muted`, `--color-border-default`, `--radius-input`.

Cleaning rules:

- **Collapse near-duplicates.** Thirteen grays within a few RGB points become
  one ramp; map each source value to its nearest survivor. Keep a short
  comment block at the top of `tokens.css` recording non-obvious mappings
  (e.g. `#f4f4f5 and #f5f5f4 → --color-gray-100`).
- **One spacing scale** (usually 4px-based) and **one type ramp**
  (family, size, weight, line-height per level). Name levels semantically
  (`--text-body`, `--text-label`, `--text-title`), not by pixel.
- **Fidelity beats purity where it shows.** If the main screen visibly uses
  an off-scale value (a 13px label, a 10px radius), keep it as a token rather
  than rounding it away — cleaning must not change rendered pixels.
- Include dark mode only if the source app's main screen ships it.

## 3. Assets are copied verbatim

Cleaning applies to structure, never to artwork.

- **Fonts**: copy the exact font files (woff2) into
  `src/design-system/fonts/` with `@font-face` rules, or reproduce the same
  hosted `<link>`. A substitute font guarantees pixel mismatch. Note the
  license if the font is commercial.
- **Icons**: if the app uses a public npm icon library, install the same
  library at the same size/stroke settings. If icons are bespoke, copy the
  SVGs used by the main screen into `src/design-system/icons/` and wrap them
  in one typed `<Icon name="…" />` component.
- **Logos and illustrations**: copy files as-is into
  `src/design-system/illustrations/`.

## 4. Core components

Build only what is needed: every component the master screen renders, plus the
universal primitives an iteration will inevitably reach for — Button, Input,
Select, Checkbox/Switch, Badge, Avatar, Card, Tooltip, Modal, Tabs, Menu.
Skip any of these the source app genuinely lacks.

- Read the **source component's code** for exact padding, radius, border,
  font, and state styles — do not eyeball from screenshots when code exists.
  Port hover/focus/active/disabled states; skip rare props and edge variants.
- Every component consumes tokens. A hardcoded color or size in a component
  is a bug in the extraction.
- Keep components in `src/design-system/components/`, one file each, typed
  props, no external UI-kit dependency (unless the source app's kit — e.g.
  Radix primitives — is load-bearing for behavior worth keeping).
- Add a `#/design-system` prototype-like gallery page only if asked; default
  is components proven through the master screen.
