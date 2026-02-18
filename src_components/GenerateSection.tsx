"use client"

import React, { useState } from 'react'
import { useStudioStore } from '@/lib/studio/store'
import { generateBackground } from '@/lib/studio/generation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Loader2 } from 'lucide-react'

export function GenerateSection() {
    const [prompt, setPrompt] = useState('')
    const { project, addLayer, isGenerating, setProject } = useStudioStore()

    const handleGenerate = async () => {
        if (!prompt || !project) return
        
        try {
            // Set generating state
            const result = await generateBackground(prompt, project.brandKit)
            
            // Add image layer
            addLayer({
                type: 'image',
                z: 0,
                position: { x: 0, y: 0 },
                size: { w: project.canvas.w, h: project.canvas.h },
                rotation: 0,
                opacity: 1,
                locked: false,
                visible: true,
                src: result.imageUrl,
                prompt: result.enrichedPrompt,
                generationModel: result.model
            })
        } catch (error) {
            console.error('Generation failed:', error)
        }
    }

    return (
        <div className="p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">AI Background</h4>
            <Textarea 
                placeholder="Describe your background..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] text-sm"
            />
            <Button 
                onClick={handleGenerate} 
                disabled={!prompt || isGenerating}
                className="w-full gap-2"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate
            </Button>
        </div>
    )
}
