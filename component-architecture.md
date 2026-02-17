# Cuarzos Studio — Component Architecture

> How the React components map to the design surface.

## Component Tree

```
<StudioLayout>
├── <Toolbar>                          ← shadcn: ToggleGroup, Button, Select
│   ├── <CanvasSizeSelector>           ← preset picker (Instagram, LinkedIn, etc.)
│   ├── <ZoomControls>                 ← +/- and fit-to-screen
│   ├── <UndoRedoButtons>             ← history navigation
│   └── <ExportButton>                ← triggers flatten → download
│
├── <LayerPanel>                       ← shadcn: Sidebar, Scroll Area
│   ├── <LayerList>                    ← sortable (drag to reorder z)
│   │   └── <LayerItem>               ← thumbnail, name, visibility toggle, lock
│   ├── <AddLayerMenu>                ← dropdown: Image, Text, Brand Asset
│   └── <BrandKitBrowser>             ← logos, colors, fonts from active kit
│
├── <Canvas>                           ← @xyflow/react
│   ├── <ImageNode>                    ← custom node: generated backgrounds
│   ├── <AssetNode>                    ← custom node: logos/vectors (locked)
│   └── <TextNode>                     ← custom node: editable text blocks
│
├── <PropertiesPanel>                  ← shadcn: Sheet (slide-out)
│   ├── <PositionInputs>              ← x, y, w, h, rotation
│   ├── <OpacitySlider>               ← shadcn: Slider
│   ├── <TextStyleEditor>             ← font, size, weight, color, align
│   └── <GenerateSection>             ← prompt input + style preset picker
│       ├── <PromptInput>              ← shadcn: Textarea
│       ├── <StylePresetGrid>          ← grid of style modifier chips
│       └── <GenerateButton>           ← "🍌 Generate" → Nano Banana Pro
│
└── <GenerationPreview>                ← shadcn: Dialog
    ├── <VariationGrid>                ← 4 options from generateVariations()
    └── <UseThisButton>               ← replaces ImageNode.src on canvas
```

## shadcn Components Used

| Component | Where | Purpose |
|-----------|-------|---------|
| `Sidebar` | LayerPanel | Collapsible tool panel |
| `Scroll Area` | LayerList, BrandKitBrowser | Smooth scrolling |
| `Sheet` | PropertiesPanel | Slide-out editor |
| `Dialog` | GenerationPreview | Modal for AI variations |
| `Slider` | OpacitySlider, scale, rotation | Continuous value controls |
| `Select` | CanvasSizeSelector, font picker | Dropdown selection |
| `Toggle Group` | Alignment tools, text styles | Multi-option toggles |
| `Button` | Export, Generate, Undo/Redo | Actions |
| `Textarea` | PromptInput | Generation prompt |
| `Tooltip` | Throughout | Control hints |
| `Context Menu` | Canvas right-click | Bring to front, lock, delete |
| `Dropdown Menu` | AddLayerMenu | New layer type picker |
| `Card` | VariationGrid, BrandKitBrowser | Content containers |
| `Sonner` | Notifications | "Exported!", "Generated!" toasts |
| `Spinner` | GenerateButton loading | While Nano Banana Pro works |
| `Skeleton` | VariationGrid loading | Placeholder while generating |
| `Tabs` | PropertiesPanel sections | Switch between Layout/Style/AI |
| `Accordion` | BrandKitBrowser | Expand fonts/colors/logos sections |
| `Resizable` | Panel layout | Drag to resize sidebar/properties |

## React Flow Configuration

```typescript
// @xyflow/react setup for design canvas
const flowConfig = {
  // Disable default edges — this is a spatial canvas, not a node graph
  defaultEdgeOptions: { hidden: true },
  
  // Custom node types
  nodeTypes: {
    imageNode: ImageNode,
    assetNode: AssetNode,
    textNode: TextNode,
  },

  // Canvas behavior
  panOnDrag: true,
  zoomOnScroll: true,
  selectionMode: 'partial',
  snapToGrid: true,
  snapGrid: [10, 10],
  
  // Selection
  multiSelectionKeyCode: 'Shift',
  deleteKeyCode: 'Delete',
}
```

## State Management

```
Zustand store: useStudioStore

├── project: Project          ← current design
├── selectedLayerIds: string[]
├── isGenerating: boolean
├── zoom: number
│
├── actions
│   ├── addLayer(layer)       → validates → pushes to layers[]
│   ├── removeLayer(id)       → validates → splices from layers[]
│   ├── reorderLayer(id, z)   → validates → updates z values
│   ├── transformLayer(id, Δ) → validates → merges changes
│   ├── generate(prompt)      → calls pipeline → updates ImageNode
│   ├── undo()                → history.pop()
│   ├── redo()                → history.forward()
│   └── export(format)        → calls export engine → downloads blob
│
└── derived
    ├── sortedLayers           → layers sorted by z
    ├── selectedLayer          → first selected layer's data
    └── canUndo / canRedo      → history state
```

## File Structure (when implemented)

```
cuarzos-runtime/app/src/
├── app/studio/
│   ├── page.tsx               ← main studio page
│   └── layout.tsx             ← studio-specific layout
├── components/studio/
│   ├── StudioLayout.tsx
│   ├── Toolbar.tsx
│   ├── LayerPanel.tsx
│   ├── Canvas.tsx
│   ├── PropertiesPanel.tsx
│   ├── GenerationPreview.tsx
│   └── nodes/
│       ├── ImageNode.tsx
│       ├── AssetNode.tsx
│       └── TextNode.tsx
├── lib/studio/
│   ├── types.ts               ← Layer, BrandKit, Project
│   ├── constraints.ts         ← brand validation engine
│   ├── export.ts              ← flatten/composite
│   ├── generate.ts            ← Nano Banana Pro pipeline
│   └── store.ts               ← Zustand store
└── api/studio/
    └── generate/route.ts      ← Next.js API route → Gemini
```
