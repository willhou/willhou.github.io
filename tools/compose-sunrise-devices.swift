import AppKit

struct SunriseDeviceSpec {
    let source: String
    let output: String
}

func compose(_ spec: SunriseDeviceSpec) throws {
    guard
        let sourceImage = NSImage(contentsOfFile: spec.source),
        let source = sourceImage.cgImage(
            forProposedRect: nil,
            context: nil,
            hints: nil
        )
    else {
        throw NSError(
            domain: "ComposeSunriseDevices",
            code: 1,
            userInfo: [NSLocalizedDescriptionKey: "Could not read \(spec.source)"]
        )
    }

    let screenWidth: CGFloat = 668
    let statusBarHeight: CGFloat = 42
    let navigationBarHeight: CGFloat = 54
    let contentHeight =
        screenWidth * CGFloat(source.height) / CGFloat(source.width)
    let screenHeight = contentHeight + statusBarHeight + navigationBarHeight
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
    let navigationBarRect = NSRect(
        x: screenRect.minX,
        y: screenRect.minY,
        width: screenRect.width,
        height: navigationBarHeight
    )
    let contentRect = NSRect(
        x: screenRect.minX,
        y: navigationBarRect.maxY,
        width: screenRect.width,
        height: contentHeight
    )
    let statusBarRect = NSRect(
        x: screenRect.minX,
        y: contentRect.maxY,
        width: screenRect.width,
        height: statusBarHeight
    )
    let systemBarBackground = NSColor(
        srgbRed: 247 / 255,
        green: 247 / 255,
        blue: 247 / 255,
        alpha: 1
    )
    let systemBarInk = NSColor(
        srgbRed: 113 / 255,
        green: 122 / 255,
        blue: 128 / 255,
        alpha: 1
    )

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
            domain: "ComposeSunriseDevices",
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
        xRadius: 16,
        yRadius: 16
    )
    screenPath.addClip()
    NSColor.white.setFill()
    screenRect.fill()
    sourceImage.draw(
        in: contentRect,
        from: NSRect(
            x: 0,
            y: 0,
            width: sourceImage.size.width,
            height: sourceImage.size.height
        ),
        operation: .sourceOver,
        fraction: 1,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )

    let chromeOverlap: CGFloat = 5
    systemBarBackground.setFill()
    NSRect(
        x: statusBarRect.minX,
        y: statusBarRect.minY - chromeOverlap,
        width: statusBarRect.width,
        height: statusBarRect.height + chromeOverlap
    ).fill()
    NSColor.white.setFill()
    NSRect(
        x: navigationBarRect.minX,
        y: navigationBarRect.minY,
        width: navigationBarRect.width,
        height: navigationBarRect.height + chromeOverlap
    ).fill()

    let statusAttributes: [NSAttributedString.Key: Any] = [
        .font: NSFont.systemFont(ofSize: 18, weight: .medium),
        .foregroundColor: systemBarInk,
    ]
    NSString(string: "9:41").draw(
        at: NSPoint(x: statusBarRect.minX + 18, y: statusBarRect.minY + 10),
        withAttributes: statusAttributes
    )

    systemBarInk.setFill()
    let signalX = statusBarRect.maxX - 100
    for index in 0..<4 {
        NSRect(
            x: signalX + CGFloat(index * 10),
            y: statusBarRect.minY + 10,
            width: 6,
            height: CGFloat(6 + index * 5)
        ).fill()
    }
    let batteryRect = NSRect(
        x: statusBarRect.maxX - 48,
        y: statusBarRect.minY + 10,
        width: 26,
        height: 18
    )
    let battery = NSBezierPath(roundedRect: batteryRect, xRadius: 3, yRadius: 3)
    battery.lineWidth = 2
    systemBarInk.setStroke()
    battery.stroke()
    NSRect(
        x: batteryRect.maxX + 2,
        y: batteryRect.minY + 5,
        width: 3,
        height: 8
    ).fill()

    systemBarInk.withAlphaComponent(0.84).setStroke()
    let triangle = NSBezierPath()
    triangle.move(
        to: NSPoint(
            x: navigationBarRect.midX - 132,
            y: navigationBarRect.midY
        )
    )
    triangle.line(
        to: NSPoint(
            x: navigationBarRect.midX - 112,
            y: navigationBarRect.midY + 12
        )
    )
    triangle.line(
        to: NSPoint(
            x: navigationBarRect.midX - 112,
            y: navigationBarRect.midY - 12
        )
    )
    triangle.close()
    triangle.lineWidth = 3
    triangle.stroke()

    let circle = NSBezierPath(
        ovalIn: NSRect(
            x: navigationBarRect.midX - 12,
            y: navigationBarRect.midY - 12,
            width: 24,
            height: 24
        )
    )
    circle.lineWidth = 3
    circle.stroke()

    let square = NSBezierPath(
        rect: NSRect(
            x: navigationBarRect.midX + 112,
            y: navigationBarRect.midY - 11,
            width: 22,
            height: 22
        )
    )
    square.lineWidth = 3
    square.stroke()
    NSGraphicsContext.restoreGraphicsState()

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
            domain: "ComposeSunriseDevices",
            code: 3,
            userInfo: [NSLocalizedDescriptionKey: "Could not encode PNG"]
        )
    }
    try data.write(to: URL(fileURLWithPath: spec.output))
}

let root = FileManager.default.currentDirectoryPath
let projectImages = "\(root)/public/images/projects"
let specs = [
    SunriseDeviceSpec(
        source: "\(projectImages)/sunrise-agenda.jpg",
        output: "\(projectImages)/sunrise-device-agenda.png"
    ),
    SunriseDeviceSpec(
        source: "\(projectImages)/sunrise-event-detail.jpg",
        output: "\(projectImages)/sunrise-device-event-detail.png"
    ),
]

for spec in specs {
    try compose(spec)
}
