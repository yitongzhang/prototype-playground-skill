# Pixel-Perfect Verification

The master prototype must be verified against real production pixels, in a
loop, with screenshots — never declared pixel-perfect from code reading.

## 1. Get reference pixels

In order of preference:

1. **Run the source app locally** and screenshot the main screen. Do not sink
   unbounded time here — if the app needs secrets or infrastructure that is
   not already configured, stop and use option 2 or 3.
2. **Ask the user for a production screenshot** of the main screen (full
   window, known viewport size, default zoom, standard display scale).
3. **Existing captures** in the source repo: e2e/visual-test snapshots,
   Storybook screenshots, marketing assets (verify they are current).

Store references in `reference/` in the playground (e.g.
`reference/main-screen.png`) with a note of viewport size and device pixel
ratio. Without a reference image there is no pixel-perfect claim — say so and
downgrade the goal to "faithful reconstruction" explicitly in the final
report.

## 2. The loop

1. Set the browser viewport to the reference's CSS pixel dimensions and
   matching DPR.
2. Screenshot the playground master at `#/master`.
3. Compare against the reference — side by side first, then overlay. With
   ImageMagick: `magick compare -metric AE ref.png shot.png diff.png` or a
   50% blend (`magick composite -blend 50 ref.png shot.png overlay.png`).
   Without ImageMagick, alternate the two images at identical zoom and look
   for jumps.
4. Fix the largest structural mismatch first (layout → spacing → type →
   color → detail). Repeat until remaining diffs are only the accepted ones
   below.

Iterate region by region: nav, header, list rows, side panels. Zooming both
images to the same crop finds spacing errors full-page comparison hides.

## 3. What must match vs. may differ

Must match: layout geometry and alignment; spacing; font family, size,
weight, line-height, letter-spacing; colors; border widths and radii;
shadows; icon set, size, and stroke; density (row heights, paddings);
scroll-area boundaries.

May differ: the **content** — names, text, avatars, counts, timestamps come
from fixtures, not production data. Fake content should be shaped like the
reference (similar text lengths, same number of visible rows) so layout still
compares. Also acceptable: font antialiasing differences across OS/browser,
native scrollbar rendering, caret/focus rings from the probing itself.

## 4. Common causes of "almost right"

- **Font not loaded** at screenshot time — await `document.fonts.ready`;
  check the family actually resolved (fallback serif/sans is obvious in
  overlay).
- **Missing CSS reset** — UA default margins, `line-height: normal`,
  `box-sizing: content-box`. The scaffold sets `box-sizing: border-box` and
  zero body margin; port the source app's reset if it has one.
- **DPR mismatch** — a 2x reference compared against a 1x capture (or vice
  versa) misreports every size. Normalize before comparing.
- **Wrong line-height arithmetic** — px vs unitless line-heights change
  vertical rhythm; copy the exact value from source code/computed styles.
- **Sub-pixel borders** — `0.5px` borders and `hairline` styles on retina
  references.
- **System font stacks** rendering differently than the app's bundled font.

## 5. Exit criterion

Done when an overlay comparison shows no structural, spacing, type, or color
differences — only accepted content/rendering differences. In the final
report, list every remaining known difference honestly. "Pixel-perfect except
X and Y" with evidence beats an unqualified claim.
