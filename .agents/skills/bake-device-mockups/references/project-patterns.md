# Device mockup patterns in this portfolio

## Core rule

The reusable unit is a transparent device image with the screenshot already composited inside it. The page treats the result as ordinary artwork. Do not combine a live screenshot element with a CSS bezel unless the experience must remain interactive, such as the Surface Studio video.

## Existing references

Use these assets as visual and geometric references:

| Pattern | Assets | Typical intrinsic size |
| --- | --- | --- |
| Prism desktop | `doordash-prism-device-desktop.png` | 1680 × 1065 |
| Prism phones | `doordash-prism-device-mobile.png`, `caviar-prism-device-mobile.png` | 760 × 1493 |
| Outlook phones | `outlook-device-inbox.png`, `outlook-device-dark-inbox.png`, `outlook-device-calendar.png` | 840 px wide |
| Sunrise phones | `sunrise-device-agenda.png`, `sunrise-device-event-detail.png` | 840 px wide |
| Foursquare archive | `foursquare/*-device-*.png` | varies |

The current React implementation is in `src/App.jsx`. The placement rules are in `src/styles.css` under `.prism-device-*`, `.outlook-phone-*`, `.sunrise-phone-*`, and related breakpoint blocks.

## Baked image construction

1. Start with the highest-resolution screenshot available.
2. Correct the screenshot before adding the frame:
   - Crop promotional copy outside the actual app UI.
   - Remove accidental gaps above or below the screen.
   - Preserve the real app top bar when possible.
   - If a status area is missing, extend it with the top-bar color.
   - If a system navigation area is missing, add a simple matching bar instead of borrowing an inconsistent one.
3. Composite the corrected screenshot into a transparent frame.
4. Export one RGBA PNG with generous transparent bounds only where a shadow needs room.
5. Keep the screen and frame unrotated in the PNG. Apply rotation in CSS so placement can be tuned responsively.

## Screen safety

Before export, identify a vertical safe range:

- Top safe edge: app identity, title, status bar, or navigation.
- Bottom safe edge: primary call to action or app tab bar.

At every breakpoint, both safe edges must remain visible. The physical chin, speaker area, or drop shadow is decorative and may be partially clipped.

For food-ordering screens, the red or orange `Add to order` action is the bottom safe edge. For mail and calendar screens, preserve the bottom tab bar and use a consistent system-navigation treatment.

## Placement strategy

The card owns an absolutely positioned stack. Each baked image is independently positioned with percentage values.

- Give the desktop image the lowest `z-index`.
- Layer phones over the desktop.
- Use small opposing rotations, usually within about five degrees.
- Keep enough overlap to read as one composition without making the phones merge.
- Adjust `top`, `right`, `bottom`, `left`, and `width` per breakpoint.
- Prefer `bottom` anchoring when bottom actions must remain visible.
- Allow `bottom` to move slightly below the card when only the decorative chin should clip.

The current breakpoint families are:

- Base/large desktop.
- `max-width: 1050px`.
- `max-width: 760px`.
- `max-width: 480px`.
- `max-width: 360px`.

## Baked versus live frame

Use a baked frame for static screenshots. Use a layered frame only when the inner content must play, scroll, or otherwise remain interactive. The Surface Studio uses a transparent outer frame plus a measured live screen inset for video; it is intentionally an exception.

## Common failures

- **White gap at the top:** screenshot crop and screen inset do not meet.
- **Background bleed at the bottom:** screenshot or system bar ends before the inner screen clip.
- **Thick or doubled bezel:** the source already contained a frame before another frame was added.
- **Missing primary action:** placement clips essential content; shift the whole baked image before changing its scale.
- **Misaligned bars:** an added status/system bar uses a color or height inconsistent with the screenshot.
- **Soft UI text:** a low-resolution screenshot was enlarged before compositing.
- **CSS complexity:** screen content, bars, and bezel were split back into DOM layers; re-bake them.
