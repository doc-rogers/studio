"use client"

import React from 'react'
import { Canvas } from './Canvas'
import { Toolbar } from './Toolbar'
import { LayerPanel } from './LayerPanel'
import { PropertiesPanel } from './PropertiesPanel'

export function StudioLayout() {
    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <Toolbar />
            <div className="flex flex-1 overflow-hidden">
                <LayerPanel />
                <div className="flex-1 relative overflow-hidden">
                    <Canvas />
                </div>
                <PropertiesPanel />
            </div>
        </div>
    )
}
