# Cuarzos Studio — Design Assembly Layer

> AI-powered brand design tool. Generate backgrounds, overlay brand assets, export composites.
> "The AI generates. The engine assembles. The brand kit constrains."

## Status: `DESIGN PHASE`

## Architecture

```
┌──────────────────────────────────────────┐
│  TOOLBAR (shadcn: ToggleGroup, Select)   │
├────────┬─────────────────────────────────┤
│ LAYERS │       CANVAS (@xyflow/react)    │
│ PANEL  │                                 │
│        │   ┌─────────────────────┐       │
│ z:0 🖼 │   │ Background (Nano 🍌)│ z:0   │
│ z:1 📝 │   │  ┌──────────┐      │       │
│ z:2 🔲 │   │  │ Text Node│ z:1  │       │
│        │   │  └──────────┘      │       │
│ (drag  │   │     ┌────┐         │       │
│  to    │   │     │Logo│ z:2     │       │
│ reorder│   │     └────┘         │       │
│        │   └─────────────────────┘       │
├────────┴─────────────────────────────────┤
│  PROPERTIES (shadcn: Slider, Select)     │
└──────────────────────────────────────────┘
```

## Stack (already in cuarzos-runtime)

| Dependency | Version | Role |
|-----------|---------|------|
| `@xyflow/react` | 12.10.0 | Canvas engine — pan, zoom, drag, node graph |
| `shadcn/ui` | new-york | UI chrome — toolbars, panels, controls |
| `@google/generative-ai` | 0.24.1 | Direct Gemini API (Nano Banana Pro) |
| `next` | 16.1.1 | Framework |
| `react` | 19.2.3 | UI |
| `recharts` | 3.6.0 | Data viz |
| `@supabase/supabase-js` | 2.90.1 | Backend |
| `redis` | 5.10.0 | State/memory |
| `sonner` | 2.0.7 | Toasts |
| `lucide-react` | 0.562.0 | Icons |

## Compute Allocation

| Task | Model | Provider |
|------|-------|----------|
| Background generation | `gemini-3-pro-image-preview` (Nano Banana Pro) | AI Studio / Antigravity |
| Style-aware prompting | `gemini-2.5-flash` | Swarm node (dedicated OAuth) |
| Complex layouts | `gemini-2.5-pro` | Swarm node (dedicated OAuth) |
| Embeddings (style matching) | `gemini-embedding-001` | AI Studio Key |
