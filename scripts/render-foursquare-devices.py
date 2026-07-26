from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "images" / "projects" / "foursquare"

CANVAS_SIZE = (420, 780)
DEVICE_BOUNDS = (35, 28, 385, 728)
SCREEN_BOUNDS = (52, 88, 368, 650)
SCREEN_SIZE = (
    SCREEN_BOUNDS[2] - SCREEN_BOUNDS[0],
    SCREEN_BOUNDS[3] - SCREEN_BOUNDS[1],
)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius, fill=255)
    return mask


def render_device(source_name, output_name, crop_box=None):
    source = Image.open(ASSET_DIR / source_name).convert("RGB")
    if crop_box is not None:
        source = source.crop(crop_box)

    screen = ImageOps.fit(
        source,
        SCREEN_SIZE,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    ).convert("RGBA")
    screen.putalpha(rounded_mask(SCREEN_SIZE, 20))

    canvas = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))

    shadow = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (43, 48, 393, 748),
        48,
        fill=(0, 0, 0, 150),
    )
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(18)))

    body = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    body_draw = ImageDraw.Draw(body)
    body_draw.rounded_rectangle(
        DEVICE_BOUNDS,
        48,
        fill=(24, 30, 33, 255),
        outline=(77, 89, 94, 255),
        width=3,
    )
    body_draw.rounded_rectangle(
        (40, 33, 380, 723),
        43,
        outline=(255, 255, 255, 22),
        width=2,
    )
    body_draw.rounded_rectangle(
        (169, 57, 251, 65),
        4,
        fill=(86, 98, 103, 255),
    )
    body_draw.ellipse((274, 54, 286, 66), fill=(11, 15, 17, 255))
    canvas.alpha_composite(body)

    canvas.alpha_composite(screen, dest=(SCREEN_BOUNDS[0], SCREEN_BOUNDS[1]))

    glass = Image.new("RGBA", SCREEN_SIZE, (0, 0, 0, 0))
    glass_draw = ImageDraw.Draw(glass)
    glass_draw.polygon(
        [(0, 0), (SCREEN_SIZE[0] * 0.62, 0), (0, SCREEN_SIZE[1] * 0.42)],
        fill=(255, 255, 255, 12),
    )
    glass.putalpha(ImageChops.multiply(glass.getchannel("A"), rounded_mask(SCREEN_SIZE, 20)))
    canvas.alpha_composite(glass, dest=(SCREEN_BOUNDS[0], SCREEN_BOUNDS[1]))

    finish = ImageDraw.Draw(canvas)
    finish.rounded_rectangle(
        SCREEN_BOUNDS,
        20,
        outline=(4, 7, 8, 255),
        width=3,
    )
    finish.rounded_rectangle(
        (156, 687, 264, 694),
        4,
        fill=(91, 101, 105, 160),
    )

    canvas.save(ASSET_DIR / output_name, optimize=True)


def fill_swarm_notch(image):
    top_bar_color = image.getpixel((550, 105))
    ImageDraw.Draw(image).rectangle((160, 46, 503, 102), fill=top_bar_color)


def add_low_fidelity_chrome(image):
    screen_left, screen_top, screen_right, screen_bottom = (54, 46, 610, 1266)
    nav_top = 1215
    app_content = image.crop(
        (screen_left, screen_top, screen_right, screen_bottom)
    ).resize(
        (screen_right - screen_left, nav_top - screen_top),
        Image.Resampling.LANCZOS,
    )
    image.paste(app_content, (screen_left, screen_top))

    draw = ImageDraw.Draw(image)
    chrome_color = (255, 255, 255, 235)
    nav_color = (122, 132, 138, 230)
    font_path = Path("/System/Library/Fonts/SFNS.ttf")
    font = (
        ImageFont.truetype(font_path, 19)
        if font_path.exists()
        else ImageFont.load_default(size=19)
    )

    draw.text((70, 59), "9:41", fill=chrome_color, font=font)

    for index, height in enumerate((6, 10, 14, 18)):
        x = 521 + index * 8
        draw.rectangle((x, 78 - height, x + 5, 78), fill=chrome_color)

    draw.rounded_rectangle(
        (568, 58, 603, 77),
        radius=3,
        outline=chrome_color,
        width=3,
    )
    draw.rectangle((604, 64, 608, 71), fill=chrome_color)

    draw.rectangle(
        (screen_left, nav_top, screen_right, screen_bottom),
        fill=(250, 250, 250, 245),
    )
    draw.polygon(
        ((265, 1231), (265, 1254), (245, 1242)),
        outline=nav_color,
    )
    draw.ellipse((340, 1231, 363, 1254), outline=nav_color, width=3)
    draw.rectangle((435, 1232, 457, 1254), outline=nav_color, width=3)


def extract_transparent_asset(
    source_name,
    output_name,
    crop_box,
    fill_notch=False,
    add_chrome=False,
):
    source = Image.open(ASSET_DIR / source_name).convert("RGBA")
    asset = source.crop(crop_box)
    if fill_notch:
        fill_swarm_notch(asset)
    if add_chrome:
        add_low_fidelity_chrome(asset)
    asset.save(ASSET_DIR / output_name, optimize=True)


def main():
    render_device(
        "foursquare-android-2012.jpg",
        "foursquare-device-2012.png",
        (4, 4, 284, 475),
    )
    render_device(
        "foursquare-adventures-promo-extract.png",
        "foursquare-device-adventures.png",
    )
    render_device(
        "foursquare-city-guide-promo-extract.png",
        "foursquare-device-city-guide.png",
    )
    extract_transparent_asset(
        "swarm-case-study-phones.webp",
        "swarm-device-checkin.png",
        (120, 160, 830, 1555),
        fill_notch=True,
        add_chrome=True,
    )
    extract_transparent_asset(
        "swarm-case-study-phones.webp",
        "swarm-device-nearby.png",
        (850, 160, 1560, 1555),
        fill_notch=True,
        add_chrome=True,
    )
    extract_transparent_asset(
        "swarm-case-study-phones.webp",
        "swarm-device-activity.png",
        (1585, 160, 2295, 1555),
        fill_notch=True,
        add_chrome=True,
    )


if __name__ == "__main__":
    main()
