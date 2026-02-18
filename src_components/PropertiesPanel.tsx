import { GenerateSection } from './GenerateSection'
"use client"

import React from 'react'
import { useStudioStore } from '@/lib/studio/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PropertiesPanel() {
    const { project, selectedLayerIds } = useStudioStore()
    const selectedLayer = project?.layers.find(l => l.id === selectedLayerIds[0])

    if (!selectedLayer) {
        return (
            <div className="w-64 border-l bg-muted/10 p-4 flex items-center justify-center text-muted-foreground text-xs italic">
                Select a layer to edit properties
            </div>
        )
    }

    return (
        <div className="w-64 border-l bg-background flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b">
                <h3 className="text-sm font-semibold capitalize">{selectedLayer.type} Properties</h3>
            </div>
            
            <Tabs defaultValue="transform" className="flex-1">
                <div className="px-4 pt-2">
                    <TabsList className="w-full">
                        <TabsTrigger value="transform" className="flex-1 text-xs">Layout</TabsTrigger>
                        <TabsTrigger value="style" className="flex-1 text-xs">Style</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="transform" className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground">X</Label>
                            <Input type="number" value={selectedLayer.position.x} bs-size="sm" className="h-8" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground">Y</Label>
                            <Input type="number" value={selectedLayer.position.y} bs-size="sm" className="h-8" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase text-muted-foreground">Opacity</Label>
                        <Slider value={[selectedLayer.opacity * 100]} max={100} step={1} />
                    </div>
                </TabsContent>

                <TabsContent value="style" className="p-4">
                    <GenerateSection />
                    {/* Style controls will go here */}
                    <div className="text-xs text-muted-foreground italic">
                        Advanced styles coming soon...
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
