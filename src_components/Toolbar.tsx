"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Download, Plus, Search, ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { useStudioStore } from '@/lib/studio/store'
import { CANVAS_PRESETS } from '@/lib/studio/types'

export function Toolbar() {
    const { setZoom, zoom } = useStudioStore()

    return (
        <div className="h-12 border-b bg-muted/20 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Layer</span>
                </Button>
                <div className="h-4 w-px bg-border mx-2" />
                <div className="flex items-center gap-1 bg-background rounded-md border p-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(zoom - 0.1)}>
                        <ZoomOut className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-[10px] w-8 text-center font-medium">
                        {Math.round(zoom * 100)}%
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(zoom + 0.1)}>
                        <ZoomIn className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Button variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </Button>
            </div>
        </div>
    )
}
