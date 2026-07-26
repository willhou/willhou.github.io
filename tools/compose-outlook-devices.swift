import AppKit

struct DeviceSpec {
    let source: String
    let output: String
    let screenColor: NSColor
    let topBacking: CGFloat
    let bottomMask: CGFloat
}

func compose(_ spec: DeviceSpec) throws {
    guard
        let sourceImage = NSImage(contentsOfFile: spec.source),
        let source = sourceImage.cgImage(
            forProposedRect: nil,
            context: nil,
            hints: nil
        )
    else {
        throw NSError(
            domain: "ComposeOutlookDevices",
            code: 1,
            userInfo: [NSLocalizedDescriptionKey: "Could not read \(spec.source)"]
        )
    }

    let screenWidth: CGFloat = 668
    let imageHeight =
        screenWidth * CGFloat(source.height) / CGFloat(source.width)
    let screenHeight = imageHeight + spec.topBacking
    let shellWidth: CGFloat = 724
    let shellHeight = screenHeight + 78
    let canvasWidth: CGFloat = 840
    let canvasHeight = shellHeight + 116
    let shellRect = NSRect(
        x: (canvasWidth - shellWidth) / 2,
        y: 58,
        width: shellWidth,
        height: shellHeight
    )
    let screenRect = NSRect(
        x: (canvasWidth - screenWidth) / 2,
        y: 82,
        width: screenWidth,
        height: screenHeight
    )
    let imageRect = NSRect(
        x: screenRect.minX - 4,
        y: screenRect.minY,
        width: screenRect.width + 8,
        height: imageHeight
    )
    let screenRadius: CGFloat = spec.topBacking > 0 ? 16 : 38
    let sourceRadius: CGFloat = spec.topBacking > 0 ? 64 : screenRadius

    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: Int(canvasWidth.rounded()),
        pixelsHigh: Int(canvasHeight.rounded()),
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ) else {
        throw NSError(
            domain: "ComposeOutlookDevices",
            code: 2,
            userInfo: [NSLocalizedDescriptionKey: "Could not create bitmap"]
        )
    }

    NSGraphicsContext.saveGraphicsState()
    defer { NSGraphicsContext.restoreGraphicsState() }

    let graphics = NSGraphicsContext(bitmapImageRep: bitmap)
    graphics?.imageInterpolation = .high
    graphics?.shouldAntialias = true
    NSGraphicsContext.current = graphics

    NSColor.clear.setFill()
    NSRect(x: 0, y: 0, width: canvasWidth, height: canvasHeight).fill()

    NSGraphicsContext.saveGraphicsState()
    let shadow = NSShadow()
    shadow.shadowColor = NSColor.black.withAlphaComponent(0.22)
    shadow.shadowBlurRadius = 28
    shadow.shadowOffset = NSSize(width: 0, height: -16)
    shadow.set()
    NSColor.white.setFill()
    NSBezierPath(roundedRect: shellRect, xRadius: 58, yRadius: 58).fill()
    NSGraphicsContext.restoreGraphicsState()

    let shellBorder = NSBezierPath(
        roundedRect: shellRect,
        xRadius: 58,
        yRadius: 58
    )
    shellBorder.lineWidth = 2
    NSColor(calibratedWhite: 0.77, alpha: 0.55).setStroke()
    shellBorder.stroke()

    NSGraphicsContext.saveGraphicsState()
    let screenPath = NSBezierPath(
        roundedRect: screenRect,
        xRadius: screenRadius,
        yRadius: screenRadius
    )
    screenPath.addClip()
    (spec.topBacking > 0 ? NSColor.white : spec.screenColor).setFill()
    screenRect.fill()
    if spec.topBacking > 0 {
        spec.screenColor.setFill()
        NSRect(
            x: screenRect.minX,
            y: screenRect.maxY - 96,
            width: screenRect.width,
            height: 96
        ).fill()
    }
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(
        roundedRect: NSRect(
            x: screenRect.minX,
            y: screenRect.minY,
            width: screenRect.width,
            height: imageHeight
        ),
        xRadius: sourceRadius,
        yRadius: sourceRadius
    ).addClip()
    sourceImage.draw(
        in: imageRect,
        from: NSRect(
            x: 0,
            y: 0,
            width: CGFloat(source.width),
            height: CGFloat(source.height)
        ),
        operation: .sourceOver,
        fraction: 1,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )
    NSGraphicsContext.restoreGraphicsState()
    if spec.topBacking > 0 {
        spec.screenColor.setFill()
        NSRect(
            x: screenRect.minX,
            y: imageRect.maxY - 3,
            width: screenRect.width,
            height: spec.topBacking + 3
        ).fill()
    }
    if spec.bottomMask > 0 {
        NSColor.white.setFill()
        NSRect(
            x: screenRect.minX,
            y: screenRect.minY,
            width: screenRect.width,
            height: spec.bottomMask
        ).fill()
    }
    NSGraphicsContext.restoreGraphicsState()

    if spec.topBacking == 0 {
        let screenBorder = NSBezierPath(
            roundedRect: screenRect,
            xRadius: screenRadius,
            yRadius: screenRadius
        )
        screenBorder.lineWidth = 1
        NSColor(calibratedWhite: 0.70, alpha: 0.32).setStroke()
        screenBorder.stroke()
    }

    let speakerRect = NSRect(
        x: (canvasWidth - 112) / 2,
        y: shellRect.maxY - 26,
        width: 112,
        height: 7
    )
    NSColor(calibratedWhite: 0.68, alpha: 0.75).setFill()
    NSBezierPath(roundedRect: speakerRect, xRadius: 4, yRadius: 4).fill()

    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        throw NSError(
            domain: "ComposeOutlookDevices",
            code: 3,
            userInfo: [NSLocalizedDescriptionKey: "Could not encode PNG"]
        )
    }
    try data.write(to: URL(fileURLWithPath: spec.output))
}

let root = FileManager.default.currentDirectoryPath
let projectImages = "\(root)/public/images/projects"
let specs = [
    DeviceSpec(
        source: "\(projectImages)/outlook-dark-inbox.png",
        output: "\(projectImages)/outlook-device-dark-inbox.png",
        screenColor: .black,
        topBacking: 0,
        bottomMask: 0
    ),
    DeviceSpec(
        source: "\(projectImages)/outlook-inbox.png",
        output: "\(projectImages)/outlook-device-inbox.png",
        screenColor: NSColor(srgbRed: 15 / 255, green: 108 / 255, blue: 189 / 255, alpha: 1),
        topBacking: 14,
        bottomMask: 18
    ),
    DeviceSpec(
        source: "\(projectImages)/outlook-calendar.png",
        output: "\(projectImages)/outlook-device-calendar.png",
        screenColor: NSColor(srgbRed: 15 / 255, green: 108 / 255, blue: 189 / 255, alpha: 1),
        topBacking: 14,
        bottomMask: 0
    ),
]

for spec in specs {
    try compose(spec)
}
