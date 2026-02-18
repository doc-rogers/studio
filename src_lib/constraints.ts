/**
 * Cuarzos Studio — Brand Kit Constraint Engine
 * 
 * Validates every operation against the brand kit rules.
 * The AI generates freely — this engine ensures the result
 * respects the brand.
 */

import type { Project, Operation, Layer, BrandKit } from './types'

// ── VALIDATION RESULT ────────────────────────────────────

export type ValidationResult = {
    valid: boolean
    violations: Violation[]
}

export type Violation = {
    rule: string
    message: string
    severity: 'error' | 'warning'  // error = blocked, warning = allowed with notice
    fix?: () => Operation           // suggested auto-fix
}

// ── CONSTRAINT ENGINE ────────────────────────────────────

export function validateOperation(
    project: Project,
    op: Operation
): ValidationResult {
    const violations: Violation[] = []
    const kit = project.brandKit

    switch (op.type) {
        case 'REORDER':
            violations.push(...checkLogoZOrder(project, op.layerId, op.newZ, kit))
            break

        case 'TRANSFORM':
            if (op.changes.style?.color) {
                violations.push(...checkColorPalette(op.changes.style.color, kit))
            }
            if (op.changes.style?.fontFamily) {
                violations.push(...checkBrandFont(op.changes.style.fontFamily, kit))
            }
            if (op.changes.size) {
                violations.push(...checkLogoMinSize(project, op.layerId, op.changes.size, kit))
            }
            break

        case 'GENERATE':
            // Generation itself is unconstrained — the prompt goes to Nano Banana Pro
            // But the resulting image layer must stay behind brand assets
            violations.push(...checkGeneratedLayerPlacement(project, op.layerId, kit))
            break

        case 'REMOVE':
            violations.push(...checkLockedLayer(project, op.layerId))
            break
    }

    return {
        valid: violations.every(v => v.severity !== 'error'),
        violations,
    }
}

// ── INDIVIDUAL RULES ─────────────────────────────────────

function checkLogoZOrder(
    project: Project,
    layerId: string,
    newZ: number,
    kit: BrandKit
): Violation[] {
    const layer = project.layers.find(l => l.id === layerId)
    if (!layer || layer.type !== 'asset') return []
    if (!kit.rules.logoAlwaysOnTop) return []

    const maxGeneratedZ = Math.max(
        ...project.layers
            .filter(l => l.type === 'image' && l.id !== layerId)
            .map(l => l.z),
        -1
    )

    if (newZ <= maxGeneratedZ) {
        return [{
            rule: 'logo-always-on-top',
            message: `Logo "${layer.assetId}" cannot be placed behind generated imagery`,
            severity: 'error',
            fix: () => ({ type: 'REORDER', layerId, newZ: maxGeneratedZ + 1 }),
        }]
    }
    return []
}

function checkColorPalette(color: string, kit: BrandKit): Violation[] {
    if (kit.rules.colorMode !== 'strict') return []
    const normalized = color.toLowerCase()
    if (!kit.palette.map(c => c.toLowerCase()).includes(normalized)) {
        return [{
            rule: 'strict-palette',
            message: `Color ${color} is not in the brand palette`,
            severity: 'error',
        }]
    }
    return []
}

function checkBrandFont(font: string, kit: BrandKit): Violation[] {
    const allowed = [kit.fonts.heading, kit.fonts.body, kit.fonts.accent]
    if (!allowed.includes(font)) {
        return [{
            rule: 'brand-fonts',
            message: `Font "${font}" is not in the brand kit. Use: ${allowed.join(', ')}`,
            severity: 'warning',
        }]
    }
    return []
}

function checkLogoMinSize(
    project: Project,
    layerId: string,
    newSize: { w: number; h: number },
    kit: BrandKit
): Violation[] {
    const layer = project.layers.find(l => l.id === layerId)
    if (!layer || layer.type !== 'asset') return []

    const minDim = Math.min(newSize.w, newSize.h)
    if (minDim < kit.rules.logoMinSize) {
        return [{
            rule: 'logo-min-size',
            message: `Logo cannot be smaller than ${kit.rules.logoMinSize}px`,
            severity: 'error',
        }]
    }
    return []
}

function checkGeneratedLayerPlacement(
    project: Project,
    layerId: string,
    kit: BrandKit
): Violation[] {
    if (!kit.rules.logoAlwaysOnTop) return []
    const layer = project.layers.find(l => l.id === layerId)
    if (!layer) return []

    const logoLayers = project.layers.filter(l => l.type === 'asset')
    const violations: Violation[] = []

    for (const logo of logoLayers) {
        if (layer.z >= logo.z) {
            violations.push({
                rule: 'generated-behind-brand',
                message: `Generated image must stay behind brand asset "${logo.assetId}"`,
                severity: 'warning',
                fix: () => ({ type: 'REORDER', layerId, newZ: logo.z - 1 }),
            })
        }
    }
    return violations
}

function checkLockedLayer(project: Project, layerId: string): Violation[] {
    const layer = project.layers.find(l => l.id === layerId)
    if (layer?.locked) {
        return [{
            rule: 'locked-layer',
            message: `Layer "${layerId}" is locked and cannot be removed`,
            severity: 'error',
        }]
    }
    return []
}

// ── PROMPT ENRICHMENT ────────────────────────────────────
// Adds brand context to AI generation prompts

export function enrichPrompt(prompt: string, kit: BrandKit): string {
    const paletteHex = kit.palette.slice(0, 4).join(', ')
    const logoZone = kit.rules.logoZone

    return [
        prompt,
        `Color palette to harmonize with: ${paletteHex}`,
        logoZone !== 'custom'
            ? `Leave clear space at ${logoZone.replace('-', ' ')} for logo placement`
            : '',
        `Style: professional, brand-consistent`,
    ].filter(Boolean).join('. ')
}
