import AppKit
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct AssetPaths {
    let root: URL
    let output: URL
    let home: NSImage
    let inspector: NSImage
    let icon: NSImage
    let ring: NSImage
}

func requireImage(_ path: String) -> NSImage {
    guard let image = NSImage(contentsOfFile: path) else {
        fatalError("Unable to load image: \(path)")
    }
    return image
}

func rgb(_ hex: UInt32, alpha: CGFloat = 1) -> NSColor {
    NSColor(
        calibratedRed: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: alpha
    )
}

func topRect(_ x: CGFloat, _ y: CGFloat, _ width: CGFloat, _ height: CGFloat, canvasHeight: CGFloat) -> NSRect {
    NSRect(x: x, y: canvasHeight - y - height, width: width, height: height)
}

func font(_ size: CGFloat, weight: NSFont.Weight = .regular) -> NSFont {
    if weight == .bold || weight == .heavy || weight == .semibold {
        return NSFont.systemFont(ofSize: size, weight: weight)
    }
    return NSFont(name: "Avenir Next", size: size) ?? NSFont.systemFont(ofSize: size, weight: weight)
}

func roundedPath(_ rect: NSRect, radius: CGFloat) -> NSBezierPath {
    NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
}

func fill(_ color: NSColor, rect: NSRect) {
    color.setFill()
    rect.fill()
}

func fillRounded(_ color: NSColor, rect: NSRect, radius: CGFloat) {
    color.setFill()
    roundedPath(rect, radius: radius).fill()
}

func strokeRounded(_ color: NSColor, rect: NSRect, radius: CGFloat, width: CGFloat) {
    color.setStroke()
    let path = roundedPath(rect, radius: radius)
    path.lineWidth = width
    path.stroke()
}

func drawGradient(_ colors: [NSColor], rect: NSRect, angle: CGFloat, radius: CGFloat = 0) {
    guard let gradient = NSGradient(colors: colors) else { return }
    if radius > 0 {
        let path = roundedPath(rect, radius: radius)
        gradient.draw(in: path, angle: angle)
    } else {
        gradient.draw(in: rect, angle: angle)
    }
}

func drawGlow(_ color: NSColor, rect: NSRect) {
    guard let gradient = NSGradient(colors: [color, color.withAlphaComponent(0)]) else { return }
    gradient.draw(in: NSBezierPath(ovalIn: rect), relativeCenterPosition: .zero)
}

func drawText(
    _ text: String,
    rect: NSRect,
    size: CGFloat,
    weight: NSFont.Weight = .regular,
    color: NSColor,
    alignment: NSTextAlignment = .left,
    lineHeight: CGFloat? = nil,
    tracking: CGFloat = 0
) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = alignment
    paragraph.lineBreakMode = .byWordWrapping
    if let lineHeight {
        paragraph.minimumLineHeight = lineHeight
        paragraph.maximumLineHeight = lineHeight
    }
    let attributes: [NSAttributedString.Key: Any] = [
        .font: font(size, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: paragraph,
        .kern: tracking
    ]
    (text as NSString).draw(
        with: rect,
        options: [.usesLineFragmentOrigin, .usesFontLeading],
        attributes: attributes
    )
}

func drawImage(_ image: NSImage, in rect: NSRect, fraction: CGFloat = 1) {
    image.draw(in: rect, from: .zero, operation: .sourceOver, fraction: fraction, respectFlipped: true, hints: [.interpolation: NSImageInterpolation.high])
}

func drawCroppedImage(_ image: NSImage, in rect: NSRect, topCropHeight: CGFloat) {
    let source = NSRect(x: 0, y: image.size.height - topCropHeight, width: image.size.width, height: topCropHeight)
    image.draw(in: rect, from: source, operation: .sourceOver, fraction: 1, respectFlipped: true, hints: [.interpolation: NSImageInterpolation.high])
}

func drawCardImage(
    _ image: NSImage,
    in rect: NSRect,
    radius: CGFloat = 28,
    sourceTopCrop: CGFloat? = nil,
    border: NSColor = rgb(0xFFFFFF, alpha: 0.72)
) {
    NSGraphicsContext.saveGraphicsState()
    let shadow = NSShadow()
    shadow.shadowColor = rgb(0x07142E, alpha: 0.20)
    shadow.shadowBlurRadius = 30
    shadow.shadowOffset = NSSize(width: 0, height: -12)
    shadow.set()
    fillRounded(.white, rect: rect, radius: radius)
    NSGraphicsContext.restoreGraphicsState()

    NSGraphicsContext.saveGraphicsState()
    roundedPath(rect, radius: radius).addClip()
    if let sourceTopCrop {
        drawCroppedImage(image, in: rect, topCropHeight: sourceTopCrop)
    } else {
        drawImage(image, in: rect)
    }
    NSGraphicsContext.restoreGraphicsState()
    strokeRounded(border, rect: rect.insetBy(dx: 0.75, dy: 0.75), radius: radius, width: 1.5)
}

func drawInspectorLocalized(_ image: NSImage, in rect: NSRect, canvasHeight: CGFloat) {
    drawCardImage(image, in: rect)

    let scaleX = rect.width / image.size.width
    let scaleY = rect.height / image.size.height
    let patch = topRect(
        rect.minX,
        canvasHeight - rect.maxY + 770 * scaleY,
        rect.width,
        66 * scaleY,
        canvasHeight: canvasHeight
    )
    fill(.white, rect: patch)
    drawText(
        "Saved",
        rect: topRect(rect.minX + 44 * scaleX, canvasHeight - rect.maxY + 785 * scaleY, 250 * scaleX, 42 * scaleY, canvasHeight: canvasHeight),
        size: 27 * scaleY,
        weight: .bold,
        color: rgb(0x07142E)
    )
    drawText(
        "☆",
        rect: topRect(rect.maxX - 91 * scaleX, canvasHeight - rect.maxY + 776 * scaleY, 62 * scaleX, 54 * scaleY, canvasHeight: canvasHeight),
        size: 35 * scaleY,
        weight: .regular,
        color: rgb(0x687386),
        alignment: .center
    )
}

func drawEyebrow(_ text: String, x: CGFloat, y: CGFloat, width: CGFloat, canvasHeight: CGFloat, light: Bool = false) {
    drawText(
        text,
        rect: topRect(x, y, width, 26, canvasHeight: canvasHeight),
        size: 15,
        weight: .bold,
        color: light ? rgb(0xB9C5E5) : rgb(0x66738F),
        tracking: 1.6
    )
}

func drawFormatPill(_ label: String, value: String, x: CGFloat, y: CGFloat, width: CGFloat, canvasHeight: CGFloat, dark: Bool = false) {
    let rect = topRect(x, y, width, 58, canvasHeight: canvasHeight)
    fillRounded(dark ? rgb(0xFFFFFF, alpha: 0.08) : .white, rect: rect, radius: 18)
    strokeRounded(dark ? rgb(0xFFFFFF, alpha: 0.15) : rgb(0xDCE4F3), rect: rect, radius: 18, width: 1.2)
    drawText(label, rect: topRect(x + 18, y + 17, 64, 28, canvasHeight: canvasHeight), size: 15, weight: .bold, color: dark ? rgb(0xAEBBDB) : rgb(0x71809E))
    drawText(value, rect: topRect(x + 84, y + 15, width - 102, 30, canvasHeight: canvasHeight), size: 18, weight: .semibold, color: dark ? .white : rgb(0x07142E), alignment: .right)
}

func drawSpectrumBar(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, canvasHeight: CGFloat, radius: CGFloat) {
    let rect = topRect(x, y, width, height, canvasHeight: canvasHeight)
    drawGradient(
        [rgb(0xFF9158), rgb(0xFF4D8B), rgb(0xC456E8), rgb(0x6D5DFB), rgb(0x36C8F4)],
        rect: rect,
        angle: 0,
        radius: radius
    )
}

func makeCanvas(width: Int, height: Int, draw: (CGFloat, CGFloat) -> Void) -> NSBitmapImageRep {
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: width,
        pixelsHigh: height,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ), let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
        fatalError("Unable to create \(width) × \(height) RGB canvas")
    }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    fill(.white, rect: NSRect(x: 0, y: 0, width: width, height: height))
    draw(CGFloat(width), CGFloat(height))
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()
    return bitmap
}

func writePNG(_ bitmap: NSBitmapImageRep, to url: URL) {
    guard let source = bitmap.cgImage else {
        fatalError("Unable to read canvas pixels for \(url.lastPathComponent)")
    }
    let width = source.width
    let height = source.height
    let bytesPerRow = width * 4
    var pixels = [UInt8](repeating: 255, count: bytesPerRow * height)
    let bitmapInfo = CGBitmapInfo.byteOrder32Big.rawValue | CGImageAlphaInfo.noneSkipLast.rawValue
    guard let context = CGContext(
        data: &pixels,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: bytesPerRow,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: bitmapInfo
    ), let destination = CGImageDestinationCreateWithURL(
        url as CFURL,
        UTType.png.identifier as CFString,
        1,
        nil
    ) else {
        fatalError("Unable to create opaque PNG context for \(url.lastPathComponent)")
    }
    context.setFillColor(NSColor.white.cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.draw(source, in: CGRect(x: 0, y: 0, width: width, height: height))
    guard let opaque = context.makeImage() else {
        fatalError("Unable to flatten \(url.lastPathComponent)")
    }
    try! FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
    CGImageDestinationAddImage(destination, opaque, nil)
    guard CGImageDestinationFinalize(destination) else {
        fatalError("Unable to encode \(url.lastPathComponent)")
    }
}

func drawLocalizedPick(paths: AssetPaths) {
    let width = 1280
    let height = 800
    let bitmap = makeCanvas(width: width, height: height) { w, h in
        drawGradient([rgb(0xF8FAFF), rgb(0xEEF3FF), rgb(0xFFF8F2)], rect: NSRect(x: 0, y: 0, width: w, height: h), angle: -18)
        drawGlow(rgb(0xFF6DA6, alpha: 0.22), rect: topRect(-150, -170, 620, 620, canvasHeight: h))
        drawGlow(rgb(0x4DD8FF, alpha: 0.22), rect: topRect(835, 310, 620, 620, canvasHeight: h))
        drawImage(paths.ring, in: topRect(855, 85, 520, 520, canvasHeight: h), fraction: 0.22)

        drawEyebrow("COLOR PICKER · ULTIMATE EDITION", x: 72, y: 106, width: 520, canvasHeight: h)
        drawText("Pick any color\non screen", rect: topRect(72, 150, 550, 160, canvasHeight: h), size: 58, weight: .heavy, color: rgb(0x07142E), lineHeight: 66)
        drawText("Click the eyedropper and sample any pixel in seconds.", rect: topRect(74, 330, 500, 76, canvasHeight: h), size: 24, weight: .regular, color: rgb(0x5D6981), lineHeight: 34)

        let featureRect = topRect(72, 448, 418, 78, canvasHeight: h)
        fillRounded(.white, rect: featureRect, radius: 22)
        strokeRounded(rgb(0xDDE5F4), rect: featureRect, radius: 22, width: 1.2)
        fillRounded(rgb(0x28C840), rect: topRect(96, 474, 24, 24, canvasHeight: h), radius: 7)
        drawText("Fast · private · stored locally", rect: topRect(138, 466, 322, 34, canvasHeight: h), size: 19, weight: .semibold, color: rgb(0x07142E))

        drawSpectrumBar(x: 72, y: 664, width: 360, height: 10, canvasHeight: h, radius: 5)
        drawText("One click. Any pixel. Instant color.", rect: topRect(72, 695, 510, 40, canvasHeight: h), size: 19, weight: .medium, color: rgb(0x68758E))

        drawCardImage(paths.home, in: topRect(716, 52, 472, 652, canvasHeight: h), radius: 30)
    }
    writePNG(bitmap, to: paths.output.appendingPathComponent("01-en-pick-any-color-1280x800.png"))
}

func drawLocalizedCopy(paths: AssetPaths) {
    let width = 1280
    let height = 800
    let bitmap = makeCanvas(width: width, height: height) { w, h in
        drawGradient([rgb(0x07142E), rgb(0x101A3E), rgb(0x161043)], rect: NSRect(x: 0, y: 0, width: w, height: h), angle: -24)
        drawGlow(rgb(0xFF4D8B, alpha: 0.26), rect: topRect(850, -180, 650, 650, canvasHeight: h))
        drawGlow(rgb(0x32C8FF, alpha: 0.18), rect: topRect(-230, 420, 620, 620, canvasHeight: h))
        drawImage(paths.ring, in: topRect(-250, 470, 620, 620, canvasHeight: h), fraction: 0.22)

        drawCardImage(paths.inspector, in: topRect(70, 44, 514, 690, canvasHeight: h), radius: 32, sourceTopCrop: 770)

        drawEyebrow("COPY-READY FORMATS", x: 660, y: 118, width: 500, canvasHeight: h, light: true)
        drawText("Copy HEX, RGB\nand HSL values", rect: topRect(660, 160, 548, 154, canvasHeight: h), size: 52, weight: .heavy, color: .white, lineHeight: 61)
        drawText("Every format is ready to paste into your design or code.", rect: topRect(662, 332, 485, 82, canvasHeight: h), size: 23, weight: .regular, color: rgb(0xB9C5E5), lineHeight: 32)

        drawFormatPill("HEX", value: "#F96B00", x: 660, y: 454, width: 440, canvasHeight: h, dark: true)
        drawFormatPill("RGB", value: "249, 107, 0", x: 660, y: 528, width: 440, canvasHeight: h, dark: true)
        drawFormatPill("HSL", value: "26°, 100%, 49%", x: 660, y: 602, width: 440, canvasHeight: h, dark: true)
        drawSpectrumBar(x: 660, y: 706, width: 440, height: 10, canvasHeight: h, radius: 5)
    }
    writePNG(bitmap, to: paths.output.appendingPathComponent("02-en-copy-color-values-1280x800.png"))
}

func drawLocalizedHistory(paths: AssetPaths) {
    let width = 1280
    let height = 800
    let bitmap = makeCanvas(width: width, height: height) { w, h in
        drawGradient([rgb(0xFFF9F5), rgb(0xF7F3FF), rgb(0xEDF8FF)], rect: NSRect(x: 0, y: 0, width: w, height: h), angle: 8)
        drawGlow(rgb(0x7C3AED, alpha: 0.18), rect: topRect(-180, 360, 600, 600, canvasHeight: h))
        drawGlow(rgb(0xFF805C, alpha: 0.19), rect: topRect(840, -220, 640, 640, canvasHeight: h))

        drawEyebrow("YOUR COLOR LIBRARY", x: 72, y: 108, width: 480, canvasHeight: h)
        drawText("Keep your colors\nin history and\nfavorites", rect: topRect(72, 150, 540, 214, canvasHeight: h), size: 50, weight: .heavy, color: rgb(0x07142E), lineHeight: 58)
        drawText("Build a reusable palette as you browse — everything stays on your device.", rect: topRect(74, 390, 500, 104, canvasHeight: h), size: 23, weight: .regular, color: rgb(0x5D6981), lineHeight: 33)

        let colors: [UInt32] = [0xF96B00, 0x2F853D, 0x08274D, 0x7C3AED, 0xFF3B5F, 0x06B6D4]
        for (index, value) in colors.enumerated() {
            let x = 74 + CGFloat(index) * 74
            let swatch = topRect(x, 555, 54, 54, canvasHeight: h)
            NSGraphicsContext.saveGraphicsState()
            let shadow = NSShadow()
            shadow.shadowColor = rgb(0x07142E, alpha: 0.18)
            shadow.shadowBlurRadius = 12
            shadow.shadowOffset = NSSize(width: 0, height: -4)
            shadow.set()
            rgb(value).setFill()
            NSBezierPath(ovalIn: swatch).fill()
            NSGraphicsContext.restoreGraphicsState()
        }
        drawText("★", rect: topRect(74, 644, 42, 42, canvasHeight: h), size: 31, weight: .bold, color: rgb(0xFF9F0A), alignment: .center)
        drawText("Favorite the colors you want to keep", rect: topRect(128, 651, 430, 34, canvasHeight: h), size: 19, weight: .semibold, color: rgb(0x07142E))

        drawInspectorLocalized(paths.inspector, in: topRect(716, 55, 472, 652, canvasHeight: h), canvasHeight: h)
        drawImage(paths.ring, in: topRect(1024, 578, 230, 230, canvasHeight: h), fraction: 0.22)
    }
    writePNG(bitmap, to: paths.output.appendingPathComponent("03-en-history-favorites-1280x800.png"))
}

func drawBrowserMock(canvasHeight h: CGFloat) {
    let browser = topRect(54, 78, 850, 642, canvasHeight: h)
    NSGraphicsContext.saveGraphicsState()
    let shadow = NSShadow()
    shadow.shadowColor = rgb(0x000000, alpha: 0.28)
    shadow.shadowBlurRadius = 34
    shadow.shadowOffset = NSSize(width: 0, height: -16)
    shadow.set()
    fillRounded(rgb(0xF9FBFF), rect: browser, radius: 32)
    NSGraphicsContext.restoreGraphicsState()
    strokeRounded(rgb(0xFFFFFF, alpha: 0.22), rect: browser, radius: 32, width: 1)

    let toolbar = topRect(54, 78, 850, 68, canvasHeight: h)
    fillRounded(rgb(0xE9EEF8), rect: toolbar, radius: 32)
    fill(rgb(0xE9EEF8), rect: topRect(54, 112, 850, 34, canvasHeight: h))
    for (index, value) in [0xFF5F57, 0xFFBD2E, 0x28C840].enumerated() {
        rgb(UInt32(value)).setFill()
        NSBezierPath(ovalIn: topRect(82 + CGFloat(index) * 28, 102, 14, 14, canvasHeight: h)).fill()
    }
    fillRounded(.white, rect: topRect(210, 96, 430, 30, canvasHeight: h), radius: 15)

    drawGradient([rgb(0xFF8A5C), rgb(0xFF4D8B), rgb(0x8257F5)], rect: topRect(90, 180, 310, 220, canvasHeight: h), angle: -25, radius: 24)
    drawGradient([rgb(0x33D2E8), rgb(0x4A7DF5)], rect: topRect(424, 180, 442, 102, canvasHeight: h), angle: 0, radius: 24)
    drawGradient([rgb(0xFFE28A), rgb(0xF96B00)], rect: topRect(424, 304, 212, 202, canvasHeight: h), angle: -35, radius: 24)
    drawGradient([rgb(0x7C3AED), rgb(0xE8A9C4)], rect: topRect(654, 304, 212, 202, canvasHeight: h), angle: 30, radius: 24)
    fillRounded(rgb(0xDFE6F4), rect: topRect(90, 430, 310, 18, canvasHeight: h), radius: 9)
    fillRounded(rgb(0xE9EEF8), rect: topRect(90, 466, 252, 18, canvasHeight: h), radius: 9)

    for (index, value) in [0x08274D, 0x2F853D, 0xF96B00, 0x7C3AED, 0xFF3B5F, 0x06B6D4].enumerated() {
        let x = 100 + CGFloat(index) * 116
        rgb(UInt32(value)).setFill()
        NSBezierPath(ovalIn: topRect(x, 570, 70, 70, canvasHeight: h)).fill()
    }
}

func drawInternational(paths: AssetPaths) {
    let width = 1280
    let height = 800
    let bitmap = makeCanvas(width: width, height: height) { w, h in
        drawGradient([rgb(0x07142E), rgb(0x0E2045), rgb(0x241342)], rect: NSRect(x: 0, y: 0, width: w, height: h), angle: -18)
        drawGlow(rgb(0xFF4D8B, alpha: 0.28), rect: topRect(820, -130, 600, 600, canvasHeight: h))
        drawGlow(rgb(0x28D7F5, alpha: 0.20), rect: topRect(870, 390, 560, 560, canvasHeight: h))
        drawBrowserMock(canvasHeight: h)

        drawImage(paths.ring, in: topRect(828, 184, 420, 420, canvasHeight: h), fraction: 0.95)
        let center = topRect(950, 306, 176, 176, canvasHeight: h)
        NSGraphicsContext.saveGraphicsState()
        let shadow = NSShadow()
        shadow.shadowColor = rgb(0x000000, alpha: 0.36)
        shadow.shadowBlurRadius = 28
        shadow.shadowOffset = NSSize(width: 0, height: -12)
        shadow.set()
        drawImage(paths.icon, in: center)
        NSGraphicsContext.restoreGraphicsState()

        NSGraphicsContext.saveGraphicsState()
        let path = NSBezierPath()
        path.move(to: NSPoint(x: 820, y: h - 372))
        path.curve(to: NSPoint(x: 690, y: h - 356), controlPoint1: NSPoint(x: 770, y: h - 342), controlPoint2: NSPoint(x: 730, y: h - 352))
        path.lineWidth = 5
        path.lineCapStyle = .round
        rgb(0xFFFFFF, alpha: 0.65).setStroke()
        path.stroke()
        NSGraphicsContext.restoreGraphicsState()

        let sample = topRect(666, 329, 52, 52, canvasHeight: h)
        rgb(0xF96B00).setFill()
        NSBezierPath(ovalIn: sample).fill()
        rgb(0xFFFFFF).setStroke()
        let sampleStroke = NSBezierPath(ovalIn: sample.insetBy(dx: -6, dy: -6))
        sampleStroke.lineWidth = 5
        sampleStroke.stroke()
    }
    writePNG(bitmap, to: paths.output.appendingPathComponent("04-international-no-text-1280x800.png"))
}

func drawSmallPromo(paths: AssetPaths) {
    let width = 440
    let height = 280
    let bitmap = makeCanvas(width: width, height: height) { w, h in
        drawGradient([rgb(0x050A16), rgb(0x111B39), rgb(0x1C0E34)], rect: NSRect(x: 0, y: 0, width: w, height: h), angle: -18)
        drawGlow(rgb(0xFF4D8B, alpha: 0.32), rect: topRect(-90, -120, 360, 360, canvasHeight: h))
        drawGlow(rgb(0x2BD9FF, alpha: 0.25), rect: topRect(230, 70, 320, 320, canvasHeight: h))
        drawImage(paths.ring, in: topRect(82, -18, 316, 316, canvasHeight: h), fraction: 0.98)
        let iconRect = topRect(168, 68, 144, 144, canvasHeight: h)
        NSGraphicsContext.saveGraphicsState()
        let shadow = NSShadow()
        shadow.shadowColor = rgb(0x000000, alpha: 0.52)
        shadow.shadowBlurRadius = 26
        shadow.shadowOffset = NSSize(width: 0, height: -12)
        shadow.set()
        drawImage(paths.icon, in: iconRect)
        NSGraphicsContext.restoreGraphicsState()
    }
    writePNG(bitmap, to: paths.output.appendingPathComponent("05-small-promo-440x280.png"))
}

func drawMarquee(paths: AssetPaths) {
    let width = 1400
    let height = 560
    let bitmap = makeCanvas(width: width, height: height) { w, h in
        drawGradient([rgb(0x050A16), rgb(0x0D1834), rgb(0x24103F)], rect: NSRect(x: 0, y: 0, width: w, height: h), angle: -18)
        drawGlow(rgb(0xFF4D8B, alpha: 0.30), rect: topRect(-110, -180, 640, 640, canvasHeight: h))
        drawGlow(rgb(0x2AD4FF, alpha: 0.23), rect: topRect(270, 180, 560, 560, canvasHeight: h))
        drawGlow(rgb(0x7C3AED, alpha: 0.22), rect: topRect(980, -230, 600, 600, canvasHeight: h))

        drawImage(paths.ring, in: topRect(48, 26, 508, 508, canvasHeight: h), fraction: 0.98)
        let iconRect = topRect(192, 170, 220, 220, canvasHeight: h)
        NSGraphicsContext.saveGraphicsState()
        let shadow = NSShadow()
        shadow.shadowColor = rgb(0x000000, alpha: 0.58)
        shadow.shadowBlurRadius = 34
        shadow.shadowOffset = NSSize(width: 0, height: -14)
        shadow.set()
        drawImage(paths.icon, in: iconRect)
        NSGraphicsContext.restoreGraphicsState()

        drawEyebrow("ULTIMATE EDITION", x: 650, y: 118, width: 520, canvasHeight: h, light: true)
        drawText("Color Picker", rect: topRect(646, 155, 650, 94, canvasHeight: h), size: 76, weight: .heavy, color: .white)
        drawText("Pick any color on screen.", rect: topRect(651, 275, 590, 58, canvasHeight: h), size: 31, weight: .medium, color: rgb(0xC7D2EF))
        drawSpectrumBar(x: 651, y: 369, width: 480, height: 12, canvasHeight: h, radius: 6)

        let formats = ["HEX", "RGB", "HSL"]
        for (index, label) in formats.enumerated() {
            let x = 651 + CGFloat(index) * 166
            let rect = topRect(x, 421, 146, 58, canvasHeight: h)
            fillRounded(rgb(0xFFFFFF, alpha: 0.08), rect: rect, radius: 18)
            strokeRounded(rgb(0xFFFFFF, alpha: 0.15), rect: rect, radius: 18, width: 1.2)
            drawText(label, rect: topRect(x, 438, 146, 26, canvasHeight: h), size: 17, weight: .bold, color: rgb(0xD7E0F6), alignment: .center)
        }
    }
    writePNG(bitmap, to: paths.output.appendingPathComponent("06-marquee-1400x560.png"))
}

let scriptURL = URL(fileURLWithPath: #filePath)
let sourceDirectory = scriptURL.deletingLastPathComponent()
let packDirectory = sourceDirectory.deletingLastPathComponent()
let extensionDirectory = packDirectory.deletingLastPathComponent()
let outputDirectory = packDirectory.appendingPathComponent("exports")

let paths = AssetPaths(
    root: packDirectory,
    output: outputDirectory,
    home: requireImage(sourceDirectory.appendingPathComponent("ui/home-en.png").path),
    inspector: requireImage(sourceDirectory.appendingPathComponent("ui/inspector-en.png").path),
    icon: requireImage(extensionDirectory.appendingPathComponent("icons/icon128.png").path),
    ring: requireImage(extensionDirectory.appendingPathComponent("assets/intelligence-ring-wide-edge-reflections-v3.png").path)
)

drawLocalizedPick(paths: paths)
drawLocalizedCopy(paths: paths)
drawLocalizedHistory(paths: paths)
drawInternational(paths: paths)
drawSmallPromo(paths: paths)
drawMarquee(paths: paths)

print("Rendered 6 Chrome Web Store assets in \(outputDirectory.path)")
