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


def straighten_city_guide_perspective(source):
    """Level the promo artwork's sloped bottom navigation without cropping it."""
    width, height = source.size
    scale_y = height / 1672
    anchor_y = round(1200 * scale_y)
    left_divider_y = round(1561 * scale_y)
    right_divider_y = round(1527 * scale_y)
    level_divider_y = round((left_divider_y + right_divider_y) / 2)

    mesh = [
        (
            (0, 0, width, anchor_y),
            (0, 0, 0, anchor_y, width, anchor_y, width, 0),
        ),
        (
            (0, anchor_y, width, level_divider_y),
            (
                0,
                anchor_y,
                0,
                left_divider_y,
                width,
                right_divider_y,
                width,
                anchor_y,
            ),
        ),
        (
            (0, level_divider_y, width, height),
            (
                0,
                left_divider_y,
                0,
                height,
                width,
                height,
                width,
                right_divider_y,
            ),
        ),
    ]
    return source.transform(
        source.size,
        Image.Transform.MESH,
        mesh,
        resample=Image.Resampling.BICUBIC,
    )


def prepare_city_guide_screen(source):
    """Replace the archival iOS chrome and add breathing room below the tabs."""
    source = straighten_city_guide_perspective(source)
    width, height = source.size
    bottom_inset = round(height * 0.019)
    content_height = height - bottom_inset

    canvas = Image.new("RGB", source.size, (251, 251, 251))
    canvas.paste(
        source.resize((width, content_height), Image.Resampling.LANCZOS),
        (0, 0),
    )

    draw = ImageDraw.Draw(canvas)
    status_height = round(height * 0.042)
    draw.rectangle((0, 0, width, status_height), fill=(27, 33, 36))

    font_path = Path("/System/Library/Fonts/SFNS.ttf")
    status_font = (
        ImageFont.truetype(font_path, 28)
        if font_path.exists()
        else ImageFont.load_default(size=28)
    )
    chrome_color = (248, 249, 249)
    draw.text((34, 18), "4:16", fill=chrome_color, font=status_font)

    signal_left = width - 190
    for index, bar_height in enumerate((8, 14, 20, 27)):
        x = signal_left + index * 14
        draw.rounded_rectangle(
            (x, status_height - 17 - bar_height, x + 8, status_height - 17),
            radius=2,
            fill=chrome_color,
        )

    wifi_center_x = width - 101
    wifi_center_y = status_height - 28
    for inset in (0, 8, 16):
        draw.arc(
            (
                wifi_center_x - 26 + inset,
                wifi_center_y - 18 + inset,
                wifi_center_x + 26 - inset,
                wifi_center_y + 18 - inset,
            ),
            205,
            335,
            fill=chrome_color,
            width=4,
        )
    draw.ellipse(
        (wifi_center_x - 3, wifi_center_y + 12, wifi_center_x + 3, wifi_center_y + 18),
        fill=chrome_color,
    )

    battery_left = width - 66
    battery_top = 18
    draw.rounded_rectangle(
        (battery_left, battery_top, width - 18, battery_top + 30),
        radius=5,
        outline=chrome_color,
        width=4,
    )
    draw.rectangle(
        (width - 17, battery_top + 9, width - 11, battery_top + 21),
        fill=chrome_color,
    )
    draw.rounded_rectangle(
        (battery_left + 6, battery_top + 6, width - 27, battery_top + 24),
        radius=2,
        fill=chrome_color,
    )

    return canvas


def render_device(
    source_name,
    output_name,
    crop_box=None,
    preprocess=None,
    fit_mode="cover",
):
    source = Image.open(ASSET_DIR / source_name).convert("RGB")
    if crop_box is not None:
        source = source.crop(crop_box)
    if preprocess is not None:
        source = preprocess(source)

    if fit_mode == "full-width":
        screen = source.resize(SCREEN_SIZE, Image.Resampling.LANCZOS).convert("RGBA")
    else:
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
    draw = ImageDraw.Draw(image)
    draw.rectangle((160, 46, 503, 102), fill=top_bar_color)
    draw.line((160, 46, 503, 46), fill=(218, 218, 214, 220), width=2)


def add_swarm_status_bar(image):
    draw = ImageDraw.Draw(image)
    chrome_color = (255, 255, 255, 235)
    font_path = Path("/System/Library/Fonts/SFNS.ttf")
    font = (
        ImageFont.truetype(font_path, 19)
        if font_path.exists()
        else ImageFont.load_default(size=19)
    )

    draw.text((82, 61), "9:41", fill=chrome_color, font=font)

    for index, height in enumerate((6, 10, 14, 18)):
        x = 507 + index * 8
        draw.rectangle((x, 84 - height, x + 5, 84), fill=chrome_color)

    draw.rounded_rectangle(
        (550, 64, 585, 83),
        radius=3,
        outline=chrome_color,
        width=3,
    )
    draw.rectangle((586, 70, 590, 77), fill=chrome_color)


def extract_transparent_asset(
    source_name,
    output_name,
    crop_box,
    fill_notch=False,
    add_status_bar=False,
):
    source = Image.open(ASSET_DIR / source_name).convert("RGBA")
    asset = source.crop(crop_box)
    if fill_notch:
        fill_swarm_notch(asset)
    if add_status_bar:
        add_swarm_status_bar(asset)
    asset.save(ASSET_DIR / output_name, optimize=True)


def main():
    render_device(
        "foursquare-android-2012.jpg",
        "foursquare-device-2012.png",
        (4, 4, 285, 475),
        fit_mode="full-width",
    )
    render_device(
        "foursquare-adventures-promo-extract.png",
        "foursquare-device-adventures.png",
    )
    render_device(
        "foursquare-city-guide-promo-extract.png",
        "foursquare-device-city-guide.png",
        preprocess=prepare_city_guide_screen,
    )
    extract_transparent_asset(
        "swarm-case-study-phones.webp",
        "swarm-device-checkin.png",
        (120, 160, 830, 1555),
        fill_notch=True,
        add_status_bar=True,
    )
    extract_transparent_asset(
        "swarm-case-study-phones.webp",
        "swarm-device-nearby.png",
        (850, 160, 1560, 1555),
        fill_notch=True,
        add_status_bar=True,
    )
    extract_transparent_asset(
        "swarm-case-study-phones.webp",
        "swarm-device-activity.png",
        (1585, 160, 2295, 1555),
        fill_notch=True,
        add_status_bar=True,
    )


if __name__ == "__main__":
    main()
