import AppKit

struct PhoneDeviceSpec {
    let source: String
    let output: String
}

func loadSource(at path: String) throws -> (NSImage, CGImage) {
    guard
        let image = NSImage(contentsOfFile: path),
        let cgImage = image.cgImage(
            forProposedRect: nil,
            context: nil,
            hints: nil
        )
    else {
        throw NSError(
            domain: "ComposePrismDevices",
            code: 1,
            userInfo: [NSLocalizedDescriptionKey: "Could not read \(path)"]
        )
    }

    return (image, cgImage)
}

func makeBitmap(width: CGFloat, height: CGFloat) throws -> NSBitmapImageRep {
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: Int(width.rounded()),
        pixelsHigh: Int(height.rounded()),
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ) else {
        throw NSError(
            domain: "ComposePrismDevices",
            code: 2,
            userInfo: [NSLocalizedDescriptionKey: "Could not create bitmap"]
        )
    }

    return bitmap
}

func prepare(_ bitmap: NSBitmapImageRep) {
    let graphics = NSGraphicsContext(bitmapImageRep: bitmap)
    graphics?.imageInterpolation = .high
    graphics?.shouldAntialias = true
    NSGraphicsContext.current = graphics
    NSColor.clear.setFill()
    NSRect(
        x: 0,
        y: 0,
        width: CGFloat(bitmap.pixelsWide),
        height: CGFloat(bitmap.pixelsHigh)
    ).fill()
}

func drawShell(_ rect: NSRect, radius: CGFloat, shadowBlur: CGFloat) {
    NSGraphicsContext.saveGraphicsState()
    let shadow = NSShadow()
    shadow.shadowColor = NSColor.black.withAlphaComponent(0.2)
    shadow.shadowBlurRadius = shadowBlur
    shadow.shadowOffset = NSSize(width: 0, height: -14)
    shadow.set()
    NSColor.white.setFill()
    NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius).fill()
    NSGraphicsContext.restoreGraphicsState()

    let border = NSBezierPath(
        roundedRect: rect,
        xRadius: radius,
        yRadius: radius
    )
    border.lineWidth = 2
    NSColor(
        srgbRed: 202 / 255,
        green: 209 / 255,
        blue: 212 / 255,
        alpha: 0.78
    ).setStroke()
    border.stroke()
}

func write(_ bitmap: NSBitmapImageRep, to path: String) throws {
    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        throw NSError(
            domain: "ComposePrismDevices",
            code: 3,
            userInfo: [NSLocalizedDescriptionKey: "Could not encode \(path)"]
        )
    }

    try data.write(to: URL(fileURLWithPath: path))
}

func composeDesktop(source: String, output: String) throws {
    let (sourceImage, sourceCGImage) = try loadSource(at: source)
    let screenWidth: CGFloat = 1500
    let screenHeight =
        screenWidth * CGFloat(sourceCGImage.height) / CGFloat(sourceCGImage.width)
    let chromeHeight: CGFloat = 54
    let shellWidth: CGFloat = 1540
    let shellHeight = screenHeight + chromeHeight + 36
    let canvasWidth: CGFloat = 1680
    let canvasHeight = shellHeight + 124
    let shellRect = NSRect(
        x: (canvasWidth - shellWidth) / 2,
        y: 62,
        width: shellWidth,
        height: shellHeight
    )
    let screenRect = NSRect(
        x: (canvasWidth - screenWidth) / 2,
        y: shellRect.minY + 18,
        width: screenWidth,
        height: screenHeight
    )
    let toolbarRect = NSRect(
        x: screenRect.minX,
        y: screenRect.maxY,
        width: screenRect.width,
        height: chromeHeight
    )
    let outputBitmap = try makeBitmap(width: canvasWidth, height: canvasHeight)

    NSGraphicsContext.saveGraphicsState()
    defer { NSGraphicsContext.restoreGraphicsState() }
    prepare(outputBitmap)

    drawShell(shellRect, radius: 28, shadowBlur: 30)

    NSColor(
        srgbRed: 248 / 255,
        green: 249 / 255,
        blue: 249 / 255,
        alpha: 1
    ).setFill()
    toolbarRect.fill()

    NSColor(
        srgbRed: 218 / 255,
        green: 224 / 255,
        blue: 226 / 255,
        alpha: 1
    ).setFill()
    NSRect(
        x: toolbarRect.minX,
        y: toolbarRect.minY,
        width: toolbarRect.width,
        height: 2
    ).fill()

    let dotColors = [
        NSColor(srgbRed: 251 / 255, green: 96 / 255, blue: 92 / 255, alpha: 1),
        NSColor(srgbRed: 245 / 255, green: 190 / 255, blue: 73 / 255, alpha: 1),
        NSColor(srgbRed: 68 / 255, green: 199 / 255, blue: 92 / 255, alpha: 1),
    ]
    for (index, color) in dotColors.enumerated() {
        color.setFill()
        NSBezierPath(
            ovalIn: NSRect(
                x: toolbarRect.minX + 24 + CGFloat(index) * 24,
                y: toolbarRect.midY - 7,
                width: 14,
                height: 14
            )
        ).fill()
    }

    NSGraphicsContext.saveGraphicsState()
    let screenPath = NSBezierPath(
        roundedRect: screenRect,
        xRadius: 6,
        yRadius: 6
    )
    screenPath.addClip()
    NSColor.white.setFill()
    screenRect.fill()
    sourceImage.draw(
        in: screenRect,
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
    NSGraphicsContext.restoreGraphicsState()

    let screenBorder = NSBezierPath(
        roundedRect: screenRect,
        xRadius: 6,
        yRadius: 6
    )
    screenBorder.lineWidth = 1
    NSColor(calibratedWhite: 0.73, alpha: 0.42).setStroke()
    screenBorder.stroke()

    try write(outputBitmap, to: output)
}

func composePhone(_ spec: PhoneDeviceSpec) throws {
    let (sourceImage, sourceCGImage) = try loadSource(at: spec.source)
    let screenWidth: CGFloat = 600
    let screenHeight =
        screenWidth * CGFloat(sourceCGImage.height) / CGFloat(sourceCGImage.width)
    let shellWidth: CGFloat = 640
    let shellHeight = screenHeight + 80
    let canvasWidth: CGFloat = 760
    let canvasHeight = shellHeight + 100
    let shellRect = NSRect(
        x: (canvasWidth - shellWidth) / 2,
        y: 50,
        width: shellWidth,
        height: shellHeight
    )
    let screenRect = NSRect(
        x: (canvasWidth - screenWidth) / 2,
        y: shellRect.minY + 30,
        width: screenWidth,
        height: screenHeight
    )
    let outputBitmap = try makeBitmap(width: canvasWidth, height: canvasHeight)

    NSGraphicsContext.saveGraphicsState()
    defer { NSGraphicsContext.restoreGraphicsState() }
    prepare(outputBitmap)

    drawShell(shellRect, radius: 42, shadowBlur: 26)

    NSGraphicsContext.saveGraphicsState()
    let screenPath = NSBezierPath(
        roundedRect: screenRect,
        xRadius: 24,
        yRadius: 24
    )
    screenPath.addClip()
    NSColor.white.setFill()
    screenRect.fill()
    sourceImage.draw(
        in: screenRect,
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
    NSGraphicsContext.restoreGraphicsState()

    let screenBorder = NSBezierPath(
        roundedRect: screenRect,
        xRadius: 24,
        yRadius: 24
    )
    screenBorder.lineWidth = 1
    NSColor(calibratedWhite: 0.69, alpha: 0.38).setStroke()
    screenBorder.stroke()

    let speakerRect = NSRect(
        x: shellRect.midX - 42,
        y: shellRect.maxY - 24,
        width: 84,
        height: 6
    )
    NSColor(
        srgbRed: 194 / 255,
        green: 201 / 255,
        blue: 204 / 255,
        alpha: 0.9
    ).setFill()
    NSBezierPath(roundedRect: speakerRect, xRadius: 3, yRadius: 3).fill()

    try write(outputBitmap, to: spec.output)
}

let root = FileManager.default.currentDirectoryPath
let projectImages = "\(root)/public/images/projects"

try composeDesktop(
    source: "\(projectImages)/doordash-prism-desktop.png",
    output: "\(projectImages)/doordash-prism-device-desktop.png"
)

let phoneSpecs = [
    PhoneDeviceSpec(
        source: "\(projectImages)/caviar-prism-mobile.png",
        output: "\(projectImages)/caviar-prism-device-mobile.png"
    ),
    PhoneDeviceSpec(
        source: "\(projectImages)/doordash-prism-mobile.png",
        output: "\(projectImages)/doordash-prism-device-mobile.png"
    ),
]

for spec in phoneSpecs {
    try composePhone(spec)
}
