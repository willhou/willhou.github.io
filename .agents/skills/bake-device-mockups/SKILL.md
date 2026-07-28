---
name: bake-device-mockups
description: Create or update this portfolio's baked device-frame images by compositing app screenshots into transparent phone or desktop PNGs, then place those finished images responsively in project showcases. Use when adding screenshots, repairing bezels/status or navigation bars, preventing important UI from being cropped, replacing CSS-built frames with one-image mockups, or tuning rotations and placement across breakpoints.
---

# Bake Device Mockups

## Goal

Produce one transparent image per device that already contains its screenshot, bezel, speaker, status bar, and system navigation treatment. Keep React and CSS responsible only for choosing the image, sizing it, positioning it, layering it, and rotating it.

Read [references/project-patterns.md](references/project-patterns.md) before changing an existing showcase.

## Workflow

1. Inspect the source screenshot and the closest existing baked device in `public/images/projects/`.
2. Identify the screen crop, required top and bottom bars, frame color, and the UI that must remain visible.
3. Generate a transparent composite:
   - Prefer editing the current baked asset when preserving an established frame.
   - Use `scripts/bake_device_mockup.py` for a new light phone or desktop frame.
   - Match a status bar background to the app's top bar when extending an incomplete screenshot.
   - Add a simple system-navigation bar when the source lacks one.
4. Inspect the exported PNG at original resolution. Reject white gaps, doubled bezels, background bleed, blurry text, or mismatched bar colors.
5. Store the final asset under `public/images/projects/` with a `*-device-*` name.
6. Render it as a single `<img>` with intrinsic `width` and `height`. Do not rebuild its inner screen in CSS.
7. Position the complete image with absolute layout, percentages, `z-index`, and a restrained rotation.
8. Preview all relevant breakpoints and adjust CSS placement, not the baked crop, unless the screenshot itself is wrong.

## Bake a New Frame

Run:

```bash
python3 .agents/skills/bake-device-mockups/scripts/bake_device_mockup.py \
  public/images/projects/example-screen.png \
  public/images/projects/example-device-phone.png \
  --profile phone-light \
  --fit contain
```

Add missing low-fidelity system areas without covering the screenshot:

```bash
python3 .agents/skills/bake-device-mockups/scripts/bake_device_mockup.py \
  public/images/projects/example-screen.png \
  public/images/projects/example-device-phone.png \
  --profile phone-light \
  --fit cover \
  --status-bar-height 42 \
  --status-bar-color "#1473e6" \
  --system-bar-height 34 \
  --system-bar-color "#ffffff" \
  --bar-foreground "#ffffff"
```

Use `--keep-svg` while tuning geometry. The script is macOS-local: it embeds the screenshot into a self-contained SVG and uses `sips` to rasterize the result to PNG.

## Preserve Important UI

Treat primary actions, critical navigation, and identifying top bars as safe-zone content.

- Keep red or orange primary buttons visible at every supported breakpoint.
- Allow a phone's decorative chin to clip before allowing its primary action to clip.
- Preserve a status bar when it establishes the top edge of the app.
- Prefer `--fit contain` when a full-height app screen matters.
- Prefer `--fit cover` only when the crop is intentional and verified.
- Re-bake the asset when content is missing inside the screen.
- Change CSS when the complete device is merely too high, low, large, small, or far apart.

## Place the Baked Images

Use a stack container and one image per device:

```jsx
<div className="example-device-stack" aria-hidden="true">
  <img
    className="example-device example-device-desktop"
    src="/images/projects/example-device-desktop.png"
    width="1680"
    height="1065"
    alt=""
  />
  <img
    className="example-device example-device-phone"
    src="/images/projects/example-device-phone.png"
    width="760"
    height="1493"
    alt=""
  />
</div>
```

```css
.example-device-stack {
  position: absolute;
  inset: 0;
}

.example-device {
  position: absolute;
  display: block;
  height: auto;
  transform-origin: 50% 100%;
}
```

Use percentage geometry so the composition scales with the showcase card. Avoid adding CSS borders, rounded corners, status bars, or nav bars around an already baked image.

## Validate

Check at least:

- Large desktop around 1513 px wide.
- Standard desktop/tablet around 961, 835, and 760 px.
- Mobile around 480, 395, 360, and 320 px.
- Light and dark color schemes when the card background changes.

Confirm:

- The composite remains sharp and transparent outside the frame.
- Primary actions remain visible.
- Devices overlap intentionally without hiding essential content.
- The active card transition does not expose transparent seams.
- Decorative chins may crop, but screens do not appear broken.
- CSS contains only outer composition rules.
