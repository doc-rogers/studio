/**
 * Cuarzos Studio — Data Model
 * 
 * Three core types: Layer, BrandKit, Project
 * Five operations: ADD, REMOVE, REORDER, TRANSFORM, GENERATE
 * One rule: AI generates, engine assembles, brand kit constrains.
 */

// ── LAYER ────────────────────────────────────────────────

export type LayerType = 'image' | 'asset' | 'text'

export type TextStyle = {
    fontFamily: string          // must come from BrandKit.fonts
    fontSize: number
    fontWeight: number
    color: string               // must come from BrandKit.palette (if strict)
    align: 'left' | 'center' | 'right'
}

export type Layer = {
    id: string
    type: LayerType
    z: number                    // stack order (0 = back, higher = front)
    position: { x: number; y: number }
    size: { w: number; h: number }
    rotation: number             // degrees
    opacity: number              // 0-1
    locked: boolean              // brand assets can be locked by kit rules
    visible: boolean

    // image layers
    src?: string                 // image URL or data URI
    prompt?: string              // generation prompt (for re-gen)
    generationModel?: string     // e.g. 'gemini-3-pro-image-preview'

    // asset layers (logos, vectors — never AI-generated)
    assetId?: string             // reference to BrandKit.logos[]
    preserveAspect?: boolean     // always true for logos

    // text layers
    text?: string
    style?: TextStyle
}

// ── BRAND KIT (the constraint system) ────────────────────

export type BrandAsset = {
    id: string
    name: string                 // "Primary Logo", "Monochrome Badge"
    src: string                  // path to SVG/PNG
    type: 'logo' | 'icon' | 'watermark' | 'pattern'
    minSize?: number             // never render smaller than this (px)
}

export type BrandKit = {
    id: string
    name: string                 // "Cuarzos", "J. Charles Assets"
    palette: string[]            // hex colors, ordered by priority
    fonts: {
        heading: string            // Google Font name
        body: string
        accent: string
    }
    logos: BrandAsset[]

    rules: {
        logoMinSize: number        // px — logo never smaller than this
        logoZone: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom'
        colorMode: 'strict' | 'suggest'   // strict = only palette colors allowed
        logoAlwaysOnTop: boolean   // logo z-index always >= all generated layers
        clearSpaceRatio: number    // min clear space around logo as % of logo size
    }
}

// ── PROJECT ──────────────────────────────────────────────

export type CanvasSize = {
    w: number
    h: number
    label?: string               // "Instagram Story", "LinkedIn Banner", etc.
}

export type Project = {
    id: string
    name: string
    canvas: CanvasSize
    brandKit: BrandKit
    layers: Layer[]
    history: Layer[][]           // undo stack (full snapshots)
    historyIndex: number         // current position in undo stack
    createdAt: string
    updatedAt: string
}

// ── OPERATIONS ───────────────────────────────────────────

export type Operation =
    | { type: 'ADD'; layer: Omit<Layer, 'id'> }
    | { type: 'REMOVE'; layerId: string }
    | { type: 'REORDER'; layerId: string; newZ: number }
    | { type: 'TRANSFORM'; layerId: string; changes: Partial<Layer> }
    | { type: 'GENERATE'; layerId: string; prompt: string; model: string }

// ── CANVAS PRESETS ───────────────────────────────────────

export const CANVAS_PRESETS: Record<string, CanvasSize> = {
    'instagram-post': { w: 1080, h: 1080, label: 'Instagram Post' },
    'instagram-story': { w: 1080, h: 1920, label: 'Instagram Story' },
    'facebook-cover': { w: 1640, h: 856, label: 'Facebook Cover' },
    'linkedin-banner': { w: 1584, h: 396, label: 'LinkedIn Banner' },
    'twitter-header': { w: 1500, h: 500, label: 'Twitter/X Header' },
    'youtube-thumbnail': { w: 1280, h: 720, label: 'YouTube Thumbnail' },
    'a4-landscape': { w: 3508, h: 2480, label: 'A4 Landscape (300dpi)' },
    'a4-portrait': { w: 2480, h: 3508, label: 'A4 Portrait (300dpi)' },
    'business-card': { w: 1050, h: 600, label: 'Business Card' },
    'flyer-half-letter': { w: 1650, h: 2550, label: 'Flyer (Half Letter)' },
}
