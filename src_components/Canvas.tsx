"use client"

import React, { useMemo, useCallback } from 'react'
import { ReactFlow, Background, Controls, BackgroundVariant, Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStudioStore } from '@/lib/studio/store'
import { ImageNode } from './nodes/ImageNode'
import { AssetNode } from './nodes/AssetNode'
import { TextNode } from './nodes/TextNode'
import { Layer } from '@/lib/studio/types'

export function Canvas() {
    const { project, transformLayer, setSelectedLayers } = useStudioStore()
    
    const nodeTypes = useMemo(() => ({
        image: ImageNode,
        asset: AssetNode,
        text: TextNode,
    }), [])

    const nodes = useMemo(() => {
        if (!project) return []
        return project.layers.map(layer => ({
            id: layer.id,
            type: layer.type,
            position: layer.position,
            data: layer,
            dragHandle: '.drag-handle',
        })) as Node[]
    }, [project])

    const onNodeDragStop = useCallback((_: any, node: Node) => {
        transformLayer(node.id, { position: node.position })
    }, [transformLayer])

    const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
        setSelectedLayers(nodes.map(n => n.id))
    }, [setSelectedLayers])

    if (!project) return null

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={[]}
                nodeTypes={nodeTypes}
                onNodeDragStop={onNodeDragStop}
                onSelectionChange={onSelectionChange}
                fitView
                className="bg-muted/5"
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    )
}
