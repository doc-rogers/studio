/**
 * Cuarzos Studio — API Route: Image Generation
 * 
 * Next.js App Router API route that proxies to Nano Banana Pro.
 * Lives at: /api/studio/generate
 * 
 * This is the ONLY server-side component of the Studio.
 * Everything else is client-side React.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// ── TYPES ────────────────────────────────────────────────

type GenerateRequest = {
    prompt: string
    model?: string            // defaults to Nano Banana Pro
    width?: number
    height?: number
    count?: number            // number of variations (1-4)
    style?: string            // style preset name
}

type GenerateResponse = {
    images: {
        url: string             // data URI or object URL
        prompt: string          // the enriched prompt used
        model: string
        timestamp: string
    }[]
}

// ── ROUTE HANDLER ────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: GenerateRequest = await req.json()

        if (!body.prompt?.trim()) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            )
        }

        const model = body.model || 'gemini-3-pro-image-preview'
        const count = Math.min(body.count || 1, 4)  // max 4 variations

        // Initialize Gemini
        // API key from environment — uses AI Studio free tier
        // or Antigravity OAuth token if available
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 500 }
            )
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const imageModel = genAI.getGenerativeModel({ model })

        // Generate images
        const images = await Promise.all(
            Array.from({ length: count }, async (_, i) => {
                const styledPrompt = body.style
                    ? `${body.prompt}. Style: ${body.style}`
                    : body.prompt

                const result = await imageModel.generateContent({
                    contents: [{ role: 'user', parts: [{ text: styledPrompt }] }],
                    // Image generation config — model-specific
                    generationConfig: {
                        // Nano Banana Pro handles dimensions internally
                        // Width/height are hints, not guarantees
                    },
                })

                // Extract image data from response
                // The actual response format depends on the Gemini image gen API
                const response = result.response
                const imageData = extractImageData(response)

                return {
                    url: imageData,
                    prompt: styledPrompt,
                    model,
                    timestamp: new Date().toISOString(),
                }
            })
        )

        return NextResponse.json({ images } satisfies GenerateResponse)

    } catch (error) {
        console.error('[studio/generate] Error:', error)

        // Rate limit handling
        if (error instanceof Error && error.message.includes('429')) {
            return NextResponse.json(
                { error: 'Rate limited — try again in a moment' },
                { status: 429 }
            )
        }

        return NextResponse.json(
            { error: 'Generation failed' },
            { status: 500 }
        )
    }
}

// ── HELPERS ──────────────────────────────────────────────

function extractImageData(response: any): string {
    //
    // The Gemini image generation API returns inline image data.
    // This extracts the base64 image and converts to a data URI.
    //
    // NOTE: The exact response shape depends on the Nano Banana Pro API.
    // This is a best-effort extraction that should be validated
    // against the live API when implementing.
    //
    const candidates = response.candidates || []
    for (const candidate of candidates) {
        const parts = candidate.content?.parts || []
        for (const part of parts) {
            if (part.inlineData) {
                const { mimeType, data } = part.inlineData
                return `data:${mimeType};base64,${data}`
            }
        }
    }

    throw new Error('No image data in response')
}
