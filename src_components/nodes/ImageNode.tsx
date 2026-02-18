"use client"

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Layer } from '@/lib/studio/types'

export const ImageNode = memo(({ data }: NodeProps<Layer>) => {
    return (
        <div className="relative border-2 border-transparent hover:border-primary/50 transition-all rounded-sm overflow-hidden bg-muted/20">
            <Handle type="target" position={Position.Top} className="opacity-0" />
            {data.src ? (
                <img src={data.src} alt={data.prompt} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-xs p-4">
                    AI generated background...
                </div>
            )}
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    )
})

ImageNode.displayName = 'ImageNode'
