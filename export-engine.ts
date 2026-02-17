/**
 * Cuarzos Studio — Export / Flatten Engine
 * 
 * Takes the layer stack and composites it into a single output image.
 * Renders each layer in z-order onto an offscreen canvas.
 */

import type { Project, Layer } from './data-model'

export type ExportFormat = 'png' | 'jpeg' | 'webp'
export type ExportQuality = 'draft' | 'standard' | 'high'

const QUALITY_MAP: Record<ExportQuality, number> = {
    draft: 0.6,
    standard: 0.85,
    high: 1.0,
}

/**
 * Flatten all visible layers into a single image blob.
 * Layers are rendered in z-order (lowest z = painted first = behind).
 */
export async function exportDesign(
    project: Project,
    format: ExportFormat = 'png',
    quality: ExportQuality = 'high'
): Promise<Blob> {
    const { w, h } = project.canvas
    const canvas = new OffscreenCanvas(w, h)
    const ctx = canvas.getContext('2d')!

    // Sort layers by z (ascending = back to front)
    const sortedLayers = [...project.layers]
        .filter(l => l.visible)
        .sort((a, b) => a.z - b.z)

    for (const layer of sortedLayers) {
        ctx.save()
        ctx.globalAlpha = layer.opacity

        // Apply rotation around layer center
        if (layer.rotation) {
            const cx = layer.position.x + layer.size.w / 2
            const cy = layer.position.y + layer.size.h / 2
            ctx.translate(cx, cy)
            ctx.rotate((layer.rotation * Math.PI) / 180)
            ctx.translate(-cx, -cy)
        }

        switch (layer.type) {
            case 'image':
            case 'asset':
                await drawImageLayer(ctx, layer)
                break
            case 'text':
                drawTextLayer(ctx, layer)
                break
        }

        ctx.restore()
    }

    return canvas.convertToBlob({
        type: `image/${format}`,
        quality: format === 'png' ? undefined : QUALITY_MAP[quality],
    })
}

async function drawImageLayer(
    ctx: OffscreenCanvasRenderingContext2D,
    layer: Layer
): Promise<void> {
    if (!layer.src) return

    const img = await loadImage(layer.src)
    ctx.drawImage(
        img,
        layer.position.x,
        layer.position.y,
        layer.size.w,
        layer.size.h
    )
}

function drawTextLayer(
    ctx: OffscreenCanvasRenderingContext2D,
    layer: Layer
): void {
    if (!layer.text || !layer.style) return

    const { fontFamily, fontSize, fontWeight, color, align } = layer.style
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = 'top'

    // Simple text wrapping
    const maxWidth = layer.size.w
    const lines = wrapText(ctx, layer.text, maxWidth)
    const lineHeight = fontSize * 1.3

    lines.forEach((line, i) => {
        const x = align === 'center'
            ? layer.position.x + maxWidth / 2
            : align === 'right'
                ? layer.position.x + maxWidth
                : layer.position.x

        ctx.fillText(line, x, layer.position.y + i * lineHeight)
    })
}

function wrapText(
    ctx: OffscreenCanvasRenderingContext2D,
    text: string,
    maxWidth: number
): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
        } else {
            currentLine = testLine
        }
    }
    if (currentLine) lines.push(currentLine)
    return lines
}

async function loadImage(src: string): Promise<ImageBitmap> {
    const response = await fetch(src)
    const blob = await response.blob()
    return createImageBitmap(blob)
}
