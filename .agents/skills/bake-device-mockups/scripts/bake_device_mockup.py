#!/usr/bin/env python3
"""Bake a screenshot into a transparent light phone or desktop frame PNG."""

from __future__ import annotations

import argparse
import base64
import mimetypes
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from xml.sax.saxutils import escape


@dataclass(frozen=True)
class Profile:
    width: int
    height: int
    outer: tuple[int, int, int, int, int]
    screen: tuple[int, int, int, int, int]
    kind: str


PROFILES = {
    "phone-light": Profile(
        width=760,
        height=1493,
        outer=(60, 48, 640, 1397, 44),
        screen=(80, 100, 600, 1313, 20),
        kind="phone",
    ),
    "desktop-light": Profile(
        width=1680,
        height=1065,
        outer=(70, 60, 1540, 945, 32),
        screen=(90, 133, 1500, 852, 8),
        kind="desktop",
    ),
}

ALIGNMENTS = {
    "top-left": "xMinYMin",
    "top": "xMidYMin",
    "top-right": "xMaxYMin",
    "left": "xMinYMid",
    "center": "xMidYMid",
    "right": "xMaxYMid",
    "bottom-left": "xMinYMax",
    "bottom": "xMidYMax",
    "bottom-right": "xMaxYMax",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Composite a screenshot and procedural frame into one RGBA PNG."
    )
    parser.add_argument("screenshot", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--profile", choices=PROFILES, default="phone-light")
    parser.add_argument("--fit", choices=("contain", "cover"), default="contain")
    parser.add_argument("--align", choices=ALIGNMENTS, default="center")
    parser.add_argument("--frame-color", default="#ffffff")
    parser.add_argument("--frame-stroke", default="#d9dddf")
    parser.add_argument("--screen-background", default="#ffffff")
    parser.add_argument("--status-bar-height", type=int, default=0)
    parser.add_argument("--status-bar-color", default="#ffffff")
    parser.add_argument("--system-bar-height", type=int, default=0)
    parser.add_argument("--system-bar-color", default="#ffffff")
    parser.add_argument("--bar-foreground", default="#596166")
    parser.add_argument(
        "--keep-svg",
        action="store_true",
        help="Keep a self-contained SVG next to the PNG for geometry tuning.",
    )
    return parser.parse_args()


def color(value: str) -> str:
    if not value.startswith("#") or len(value) not in (4, 7, 9):
        raise ValueError(f"Expected a hex color, got {value!r}")
    return escape(value)


def image_data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "image/png"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def bar_markup(
    screen_x: int,
    screen_y: int,
    screen_w: int,
    screen_h: int,
    status_h: int,
    system_h: int,
    status_color: str,
    system_color: str,
    foreground: str,
) -> str:
    elements: list[str] = []
    if status_h:
        cy = screen_y + max(8, status_h // 2)
        elements.extend(
            [
                f'<rect x="{screen_x}" y="{screen_y}" width="{screen_w}" '
                f'height="{status_h}" fill="{status_color}"/>',
                f'<rect x="{screen_x + 24}" y="{cy - 4}" width="54" height="8" '
                f'rx="4" fill="{foreground}" opacity=".92"/>',
                f'<rect x="{screen_x + screen_w - 98}" y="{cy - 10}" '
                f'width="7" height="14" rx="2" fill="{foreground}" opacity=".92"/>',
                f'<rect x="{screen_x + screen_w - 87}" y="{cy - 14}" '
                f'width="7" height="18" rx="2" fill="{foreground}" opacity=".92"/>',
                f'<rect x="{screen_x + screen_w - 76}" y="{cy - 18}" '
                f'width="7" height="22" rx="2" fill="{foreground}" opacity=".92"/>',
                f'<rect x="{screen_x + screen_w - 54}" y="{cy - 12}" '
                f'width="30" height="18" rx="5" fill="none" stroke="{foreground}" '
                f'stroke-width="4" opacity=".92"/>',
            ]
        )
    if system_h:
        y = screen_y + screen_h - system_h
        pill_w = min(132, screen_w // 4)
        elements.extend(
            [
                f'<rect x="{screen_x}" y="{y}" width="{screen_w}" '
                f'height="{system_h}" fill="{system_color}"/>',
                f'<rect x="{screen_x + (screen_w - pill_w) / 2}" '
                f'y="{y + max(8, (system_h - 7) / 2)}" width="{pill_w}" '
                f'height="7" rx="4" fill="{foreground}" opacity=".9"/>',
            ]
        )
    return "\n".join(elements)


def svg_document(args: argparse.Namespace) -> str:
    profile = PROFILES[args.profile]
    ox, oy, ow, oh, outer_radius = profile.outer
    sx, sy, sw, sh, screen_radius = profile.screen
    status_h = max(0, args.status_bar_height)
    system_h = max(0, args.system_bar_height)
    if status_h + system_h >= sh:
        raise ValueError("Status and system bars must leave positive screen content height")

    content_y = sy + status_h
    content_h = sh - status_h - system_h
    align = ALIGNMENTS[args.align]
    aspect = f"{align} {'meet' if args.fit == 'contain' else 'slice'}"
    frame_color = color(args.frame_color)
    frame_stroke = color(args.frame_stroke)
    screen_background = color(args.screen_background)
    status_color = color(args.status_bar_color)
    system_color = color(args.system_bar_color)
    foreground = color(args.bar_foreground)
    screenshot_uri = escape(image_data_uri(args.screenshot))

    if profile.kind == "phone":
        chrome = (
            f'<rect x="{profile.width / 2 - 42}" y="{oy + 18}" width="84" '
            f'height="6" rx="3" fill="#c6cbce"/>'
        )
    else:
        chrome = "\n".join(
            [
                f'<rect x="{sx}" y="{oy + 20}" width="{sw}" height="53" '
                f'fill="#f5f7f8"/>',
                f'<circle cx="{sx + 31}" cy="{oy + 46}" r="7" fill="#f45f5f"/>',
                f'<circle cx="{sx + 55}" cy="{oy + 46}" r="7" fill="#f1bd43"/>',
                f'<circle cx="{sx + 79}" cy="{oy + 46}" r="7" fill="#43b965"/>',
                f'<line x1="{sx}" y1="{sy}" x2="{sx + sw}" y2="{sy}" '
                f'stroke="#d9dddf" stroke-width="2"/>',
            ]
        )

    bars = bar_markup(
        sx,
        sy,
        sw,
        sh,
        status_h,
        system_h,
        status_color,
        system_color,
        foreground,
    )

    return f"""<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="{profile.width}" height="{profile.height}"
  viewBox="0 0 {profile.width} {profile.height}">
  <defs>
    <clipPath id="screen-clip">
      <rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="{screen_radius}"/>
    </clipPath>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="18"
        flood-color="#000000" flood-opacity=".22"/>
    </filter>
  </defs>
  <rect x="{ox}" y="{oy}" width="{ow}" height="{oh}" rx="{outer_radius}"
    fill="{frame_color}" stroke="{frame_stroke}" stroke-width="2"
    filter="url(#shadow)"/>
  <g clip-path="url(#screen-clip)">
    <rect x="{sx}" y="{sy}" width="{sw}" height="{sh}"
      fill="{screen_background}"/>
    <image x="{sx}" y="{content_y}" width="{sw}" height="{content_h}"
      preserveAspectRatio="{aspect}" href="{screenshot_uri}"
      xlink:href="{screenshot_uri}"/>
    {bars}
  </g>
  <rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="{screen_radius}"
    fill="none" stroke="{frame_stroke}" stroke-width="1"/>
  {chrome}
</svg>
"""


def render_png(svg: str, output: Path) -> None:
    sips = Path("/usr/bin/sips")
    if not sips.is_file():
        raise RuntimeError("macOS sips is required but was not found")
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".svg", mode="w", delete=False) as handle:
        handle.write(svg)
        svg_path = Path(handle.name)
    try:
        subprocess.run(
            [
                str(sips),
                "-s",
                "format",
                "png",
                str(svg_path),
                "--out",
                str(output),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
        )
    finally:
        svg_path.unlink(missing_ok=True)


def main() -> int:
    args = parse_args()
    try:
        if not args.screenshot.is_file():
            raise FileNotFoundError(f"Screenshot not found: {args.screenshot}")
        if args.output.suffix.lower() != ".png":
            raise ValueError("Output must use a .png extension")
        svg = svg_document(args)
        if args.keep_svg:
            args.output.with_suffix(".svg").write_text(svg)
        render_png(svg, args.output)
    except (OSError, ValueError, RuntimeError, subprocess.CalledProcessError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
