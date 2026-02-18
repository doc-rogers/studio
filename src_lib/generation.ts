/**
 * Cuarzos Studio — Image Generation Pipeline
 * 
 * Connects to Nano Banana Pro (gemini-3-pro-image-preview) for
 * background generation. Enriches prompts with brand context.
 * 
 * This is the ONLY place AI touches the design.
 * Everything else is deterministic layer assembly.
 */

import type { BrandKit, Layer } from './types'
import { enrichPrompt } from './constraints'

// ── CONFIG ───────────────────────────────────────────────

export type GenerationConfig = {
    model: string       // 'gemini-3-pro-image-preview' (Nano Banana Pro)
    width: number       // output width
    height: number      // output height
    style?: string      // optional style modifier
}

const DEFAULT_CONFIG: GenerationConfig = {
    model: 'gemini-3-pro-image-preview',
    width: 1080,
    height: 1080,
}

// ── GENERATION PIPELINE ──────────────────────────────────

/**
 * Full pipeline: prompt → enrich → generate → update layer
 * 
 * Flow:
 *   1. User types prompt: "tropical sunset beach"
 *   2. enrichPrompt() adds brand context: colors, logo clear space
 *   3. Nano Banana Pro generates the image
 *   4. Result is placed at z:0 (always behind brand assets)
 */
export async function generateBackground(
    prompt: string,
    brandKit: BrandKit,
    config: GenerationConfig = DEFAULT_CONFIG
): Promise<GenerationResult> {
    // Step 1: Enrich prompt with brand context
    const enrichedPrompt = enrichPrompt(prompt, brandKit)

    // Step 2: Call Nano Banana Pro
    const imageData = await callImageModel(enrichedPrompt, config)

    // Step 3: Return result for layer insertion
    return {
        originalPrompt: prompt,
        enrichedPrompt,
        imageUrl: imageData.url,
        model: config.model,
        timestamp: new Date().toISOString(),
    }
}

export type GenerationResult = {
    originalPrompt: string
    enrichedPrompt: string
    imageUrl: string
    model: string
    timestamp: string
}

// ── MODEL CALL ───────────────────────────────────────────

async function callImageModel(
    prompt: string,
    config: GenerationConfig
): Promise<{ url: string }> {
    //
    // Uses @google/generative-ai (already in cuarzos-runtime)
    //
    // const genAI = new GoogleGenerativeAI(apiKey)
    // const model = genAI.getGenerativeModel({ model: config.model })
    //
    // The actual implementation will use the Gemini image generation API.
    // For now, this is the interface contract.
    //

    const response = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            model: config.model,
            width: config.width,
            height: config.height,
        }),
    })

    if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`)
    }

    return response.json()
}

// ── STYLE PRESETS ────────────────────────────────────────
// Common style modifiers that can be composed with user prompts

export const STYLE_PRESETS: Record<string, string> = {
    'minimal': 'clean, minimal, lots of white space, modern',
    'bold': 'vibrant, high contrast, bold colors, energetic',
    'elegant': 'refined, subtle gradients, sophisticated, muted tones',
    'organic': 'natural textures, earthy tones, handcrafted feel',
    'tech': 'futuristic, dark mode, neon accents, digital',
    'retro': 'vintage, film grain, warm tones, nostalgic',
    'abstract': 'geometric shapes, fluid forms, artistic, non-representational',
    'photography': 'photorealistic, natural lighting, editorial quality',
}

// ── VARIATION GENERATION ─────────────────────────────────
// Generate multiple options from the same prompt

export async function generateVariations(
    prompt: string,
    brandKit: BrandKit,
    count: number = 4,
    config: GenerationConfig = DEFAULT_CONFIG
): Promise<GenerationResult[]> {
    const styles = Object.keys(STYLE_PRESETS).slice(0, count)

    return Promise.all(
        styles.map(style =>
            generateBackground(
                `${prompt}. Style: ${STYLE_PRESETS[style]}`,
                brandKit,
                { ...config, style }
            )
        )
    )
}
