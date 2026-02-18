"use client"

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Layer } from '@/lib/studio/types'

export const AssetNode = memo(({ data }: NodeProps<Layer>) => {
    return (
        <div className="relative border-2 border-transparent hover:border-primary/50 transition-all">
            <Handle type="target" position={Position.Top} className="opacity-0" />
            {data.src && (
                <img 
                    src={data.src} 
                    alt="Brand Asset" 
                    className="w-full h-full" 
                    style={{ objectFit: 'contain' }}
                />
            )}
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    )
})

AssetNode.displayName = 'AssetNode'
