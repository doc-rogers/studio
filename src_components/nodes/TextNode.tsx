"use client"

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Layer } from '@/lib/studio/types'

export const TextNode = memo(({ data }: NodeProps<Layer>) => {
    const style = data.style || { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#000', align: 'center' }
    
    return (
        <div className="relative group">
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <div 
                style={{
                    fontFamily: style.fontFamily,
                    fontSize: `${style.fontSize}px`,
                    fontWeight: style.fontWeight,
                    color: style.color,
                    textAlign: style.align,
                    lineHeight: 1.2
                }}
                className="p-2 min-w-[100px] outline-none group-hover:ring-1 group-hover:ring-primary/30 rounded-sm"
                contentEditable
                suppressContentEditableWarning
            >
                {data.text || 'Enter text...'}
            </div>
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    )
})

TextNode.displayName = 'TextNode'
