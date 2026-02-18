"use client"

import React from 'react'
import { useStudioStore } from '@/lib/studio/store'
import { Layers, Eye, EyeOff, Lock, Unlock } from 'lucide-react'

export function LayerPanel() {
    const { project, selectedLayerIds, setSelectedLayers } = useStudioStore()

    return (
        <div className="w-56 border-r bg-background flex flex-col shrink-0 overflow-hidden">
            <div className="p-4 border-b flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Layers</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {project?.layers.map((layer) => (
                    <div 
                        key={layer.id}
                        onClick={() => setSelectedLayers([layer.id])}
                        className={`
                            flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors
                            ${selectedLayerIds.includes(layer.id) 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'hover:bg-muted/50 border border-transparent'}
                        `}
                    >
                        <div className="w-8 h-8 rounded bg-muted flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate capitalize">{layer.type}</p>
                        </div>
                        {layer.locked ? <Lock className="w-3 h-3 text-muted-foreground" /> : null}
                    </div>
                ))}
                
                {(!project?.layers || project.layers.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground text-[10px] italic">
                        No layers on canvas
                    </div>
                )}
            </div>
        </div>
    )
}
