import AppKit

struct DeviceSpec {
    let source: String
    let output: String
    let screenColor: NSColor
    let topBacking: CGFloat
    let bottomMask: CGFloat
    let systemNavigationHeight: CGFloat
    let drawsSyntheticStatusBar: Bool
    let usesDarkSystemNavigation: Bool
    let sourceCropBottomPixels: Int
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

    let croppedHeight = source.height - spec.sourceCropBottomPixels
    guard
        croppedHeight > 0,
        let renderSource = source.cropping(
            to: CGRect(
                x: 0,
                y: 0,
                width: source.width,
                height: croppedHeight
            )
        )
    else {
        throw NSError(
            domain: "ComposeOutlookDevices",
            code: 4,
            userInfo: [NSLocalizedDescriptionKey: "Invalid crop for \(spec.source)"]
        )
    }
    let renderImage = NSImage(
        cgImage: renderSource,
        size: NSSize(
            width: renderSource.width,
            height: renderSource.height
        )
    )

    let screenWidth: CGFloat = 668
    let imageHeight =
        screenWidth * CGFloat(renderSource.height) / CGFloat(renderSource.width)
    let screenHeight =
        imageHeight + spec.topBacking + spec.systemNavigationHeight
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
        y: screenRect.minY + spec.systemNavigationHeight,
        width: screenRect.width + 8,
        height: imageHeight
    )
    let screenRadius: CGFloat = spec.topBacking > 0 ? 16 : 38
    let sourceRadius: CGFloat =
        spec.systemNavigationHeight > 0
            ? 16
            : (spec.topBacking > 0 ? 64 : screenRadius)

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
    renderImage.draw(
        in: imageRect,
        from: NSRect(
            x: 0,
            y: 0,
            width: CGFloat(renderSource.width),
            height: CGFloat(renderSource.height)
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
            y: imageRect.minY,
            width: screenRect.width,
            height: spec.bottomMask
        ).fill()
    }
    if spec.drawsSyntheticStatusBar {
        let statusBar = NSRect(
            x: screenRect.minX,
            y: screenRect.maxY - 52,
            width: screenRect.width,
            height: 52
        )
        spec.screenColor.setFill()
        statusBar.fill()

        let statusAttributes: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: 20, weight: .medium),
            .foregroundColor: NSColor.white,
        ]
        NSAttributedString(
            string: "8:28 AM",
            attributes: statusAttributes
        ).draw(
            at: NSPoint(
                x: statusBar.minX + 26,
                y: statusBar.minY + 15
            )
        )

        NSColor.white.setFill()
        for index in 0..<4 {
            let bar = NSRect(
                x: statusBar.maxX - 174 + CGFloat(index * 8),
                y: statusBar.minY + 16,
                width: 5,
                height: CGFloat(5 + index * 4)
            )
            NSBezierPath(
                roundedRect: bar,
                xRadius: 2,
                yRadius: 2
            ).fill()
        }

        NSAttributedString(
            string: "100%",
            attributes: statusAttributes
        ).draw(
            at: NSPoint(
                x: statusBar.maxX - 132,
                y: statusBar.minY + 15
            )
        )

        let batteryBody = NSRect(
            x: statusBar.maxX - 43,
            y: statusBar.minY + 18,
            width: 22,
            height: 13
        )
        let batteryPath = NSBezierPath(
            roundedRect: batteryBody,
            xRadius: 3,
            yRadius: 3
        )
        batteryPath.lineWidth = 2
        NSColor.white.setStroke()
        batteryPath.stroke()
        NSRect(
            x: batteryBody.maxX + 2,
            y: batteryBody.minY + 4,
            width: 3,
            height: 5
        ).fill()
    }
    if spec.systemNavigationHeight > 0 {
        let navigationBackground =
            spec.usesDarkSystemNavigation ? NSColor.black : NSColor.white
        let gestureColor =
            spec.usesDarkSystemNavigation
                ? NSColor.white.withAlphaComponent(0.82)
                : NSColor(calibratedWhite: 0.16, alpha: 0.82)
        navigationBackground.setFill()
        NSRect(
            x: screenRect.minX,
            y: screenRect.minY,
            width: screenRect.width,
            height: spec.systemNavigationHeight
        ).fill()

        let gestureBar = NSRect(
            x: screenRect.midX - 94,
            y: screenRect.minY + 17,
            width: 188,
            height: 7
        )
        gestureColor.setFill()
        NSBezierPath(
            roundedRect: gestureBar,
            xRadius: 4,
            yRadius: 4
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
        source: "\(projectImages)/outlook-dark-inbox-complete.png",
        output: "\(projectImages)/outlook-device-dark-inbox.png",
        screenColor: NSColor(
            srgbRed: 32 / 255,
            green: 32 / 255,
            blue: 32 / 255,
            alpha: 1
        ),
        topBacking: 10,
        bottomMask: 0,
        systemNavigationHeight: 28,
        drawsSyntheticStatusBar: true,
        usesDarkSystemNavigation: true,
        sourceCropBottomPixels: 96
    ),
    DeviceSpec(
        source: "\(projectImages)/outlook-inbox.png",
        output: "\(projectImages)/outlook-device-inbox.png",
        screenColor: NSColor(srgbRed: 15 / 255, green: 108 / 255, blue: 189 / 255, alpha: 1),
        topBacking: 10,
        bottomMask: 0,
        systemNavigationHeight: 28,
        drawsSyntheticStatusBar: true,
        usesDarkSystemNavigation: false,
        sourceCropBottomPixels: 60
    ),
    DeviceSpec(
        source: "\(projectImages)/outlook-calendar.png",
        output: "\(projectImages)/outlook-device-calendar.png",
        screenColor: NSColor(srgbRed: 15 / 255, green: 108 / 255, blue: 189 / 255, alpha: 1),
        topBacking: 14,
        bottomMask: 0,
        systemNavigationHeight: 0,
        drawsSyntheticStatusBar: false,
        usesDarkSystemNavigation: false,
        sourceCropBottomPixels: 0
    ),
]

for spec in specs {
    try compose(spec)
}
