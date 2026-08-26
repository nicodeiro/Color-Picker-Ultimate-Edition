import AppKit
import Foundation

private struct RGB {
    let r: Double
    let g: Double
    let b: Double

    static func mix(_ a: RGB, _ b: RGB, amount: Double) -> RGB {
        let t = min(1, max(0, amount))
        return RGB(
            r: a.r + (b.r - a.r) * t,
            g: a.g + (b.g - a.g) * t,
            b: a.b + (b.b - a.b) * t
        )
    }

    func scaled(_ amount: Double) -> RGB {
        RGB(
            r: min(1, max(0, r * amount)),
            g: min(1, max(0, g * amount)),
            b: min(1, max(0, b * amount))
        )
    }
}

private struct ColorStop {
    let position: Double
    let color: RGB
}

private func smoothstep(_ edge0: Double, _ edge1: Double, _ value: Double) -> Double {
    let t = min(1, max(0, (value - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
}

private func periodicDistance(_ a: Double, _ b: Double) -> Double {
    let direct = abs(a - b)
    return min(direct, 1 - direct)
}

private func gaussian(angle: Double, center: Double, sigma: Double) -> Double {
    let distance = periodicDistance(angle, center)
    return exp(-0.5 * pow(distance / sigma, 2))
}

private func spectrumColor(at angle: Double, stops: [ColorStop]) -> RGB {
    let wrapped = angle - floor(angle)
    for index in 0..<(stops.count - 1) {
        let start = stops[index]
        let end = stops[index + 1]
        guard wrapped >= start.position && wrapped <= end.position else { continue }
        let amount = (wrapped - start.position) / (end.position - start.position)
        let eased = amount * amount * (3 - 2 * amount)
        return RGB.mix(start.color, end.color, amount: eased)
    }
    return stops[0].color
}

let outputPath = CommandLine.arguments.dropFirst().first
    ?? "assets/intelligence-ring-home-reflections-v1.png"
let size = 862
let center = Double(size - 1) / 2
let outerRadius = center - 9
let ringThickness = 18.5
let innerRadius = outerRadius - ringThickness

private let stops: [ColorStop] = [
    .init(position: 0.00, color: .init(r: 0.91, g: 0.39, b: 0.92)),
    .init(position: 0.07, color: .init(r: 0.74, g: 0.48, b: 1.00)),
    .init(position: 0.13, color: .init(r: 0.55, g: 0.76, b: 1.00)),
    .init(position: 0.18, color: .init(r: 0.34, g: 0.87, b: 1.00)),
    .init(position: 0.26, color: .init(r: 0.31, g: 0.57, b: 1.00)),
    .init(position: 0.37, color: .init(r: 0.47, g: 0.40, b: 0.98)),
    .init(position: 0.48, color: .init(r: 0.32, g: 0.76, b: 1.00)),
    .init(position: 0.58, color: .init(r: 0.39, g: 0.62, b: 1.00)),
    .init(position: 0.68, color: .init(r: 0.70, g: 0.36, b: 0.98)),
    .init(position: 0.76, color: .init(r: 0.98, g: 0.33, b: 0.82)),
    .init(position: 0.84, color: .init(r: 1.00, g: 0.45, b: 0.49)),
    .init(position: 0.91, color: .init(r: 1.00, g: 0.67, b: 0.31)),
    .init(position: 0.96, color: .init(r: 1.00, g: 0.46, b: 0.57)),
    .init(position: 1.00, color: .init(r: 0.91, g: 0.39, b: 0.92))
]

guard let bitmap = NSBitmapImageRep(
    bitmapDataPlanes: nil,
    pixelsWide: size,
    pixelsHigh: size,
    bitsPerSample: 8,
    samplesPerPixel: 4,
    hasAlpha: true,
    isPlanar: false,
    colorSpaceName: .deviceRGB,
    bytesPerRow: size * 4,
    bitsPerPixel: 32
), let pixels = bitmap.bitmapData else {
    fatalError("Unable to create ring bitmap")
}

for y in 0..<size {
    for x in 0..<size {
        let dx = Double(x) - center
        let dy = Double(y) - center
        let radius = hypot(dx, dy)
        let innerCoverage = smoothstep(innerRadius - 1.1, innerRadius + 1.1, radius)
        let outerCoverage = 1 - smoothstep(outerRadius - 1.1, outerRadius + 1.1, radius)
        let alpha = innerCoverage * outerCoverage
        let byteIndex = (y * size + x) * 4

        guard alpha > 0.001 else {
            pixels[byteIndex] = 0
            pixels[byteIndex + 1] = 0
            pixels[byteIndex + 2] = 0
            pixels[byteIndex + 3] = 0
            continue
        }

        var angle = atan2(dx, -dy) / (2 * Double.pi)
        if angle < 0 { angle += 1 }

        let mainReflection = gaussian(angle: angle, center: 0.145, sigma: 0.058)
        let lavenderEcho = gaussian(angle: angle, center: 0.515, sigma: 0.027)
        let pinkEcho = gaussian(angle: angle, center: 0.785, sigma: 0.023)

        var color = spectrumColor(at: angle, stops: stops)
        color = RGB.mix(
            color,
            RGB(r: 0.42, g: 0.78, b: 1.00),
            amount: 0.10 * mainReflection
        )
        color = RGB.mix(
            color,
            RGB(r: 0.75, g: 0.66, b: 1.00),
            amount: 0.045 * lavenderEcho
        )
        color = RGB.mix(
            color,
            RGB(r: 1.00, g: 0.66, b: 0.84),
            amount: 0.034 * pinkEcho
        )

        let radialPosition = (radius - innerRadius) / ringThickness
        let outerSheen = exp(-0.5 * pow((radialPosition - 0.23) / 0.18, 2))
        let innerSheen = exp(-0.5 * pow((radialPosition - 0.77) / 0.24, 2))
        let radialLight = 0.89 + 0.085 * outerSheen + 0.045 * innerSheen
        let causticLift =
            0.014 * mainReflection +
            0.007 * lavenderEcho +
            0.005 * pinkEcho
        color = color.scaled(radialLight + causticLift)

        pixels[byteIndex] = UInt8(round(color.r * 255))
        pixels[byteIndex + 1] = UInt8(round(color.g * 255))
        pixels[byteIndex + 2] = UInt8(round(color.b * 255))
        pixels[byteIndex + 3] = UInt8(round(alpha * 255))
    }
}

guard let png = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("Unable to encode ring PNG")
}

try png.write(to: URL(fileURLWithPath: outputPath))
