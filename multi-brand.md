# Cuarzos Studio — Multi-Brand System

> One studio, many brands. Switch the kit, everything adapts.
> This is how Claudia serves multiple clients from one tool.

## The Problem

Claudia manages branding for multiple clients. Each client has different colors,
fonts, logos, and rules. Without multi-brand support, she'd need a separate
tool instance for each client, or manually swap assets every time.

## The Solution

The brand kit is a **slot** in the project. Change the slot, everything 
downstream re-resolves:

```
Template + Brand Kit A → Design for Client A
Template + Brand Kit B → Design for Client B
Same template, different output. Zero manual work.
```

## Architecture

```
┌──────────────────────────────────────┐
│           Brand Kit Selector         │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ JCA  │ │Cuarz │ │Client│ [+ New] │
│  │  ✓   │ │      │ │  C   │         │
│  └──────┘ └──────┘ └──────┘         │
└──────────────────────────────────────┘
         │
         ▼  kit.json loaded
┌──────────────────────────────────────┐
│          Template Resolver           │
│  "{{kit.palette.accent}}" → "#e94560"│
│  "{{kit.fonts.heading}}"  → "Inter"  │
│  "{{kit.logos[0]}}"       → *.svg    │
└──────────────────────────────────────┘
         │
         ▼  layers resolved
┌──────────────────────────────────────┐
│          Constraint Engine           │
│  enforces THIS kit's rules           │
│  (different kit = different rules)   │
└──────────────────────────────────────┘
         │
         ▼  validated
┌──────────────────────────────────────┐
│        Generation Pipeline           │
│  enrichPrompt() uses THIS kit's      │
│  palette, mood, avoid terms          │
└──────────────────────────────────────┘
```

## Kit Switching UX

When Claudia switches brand kits mid-project:

1. **Colors update** — all text colors, accents re-resolve from new palette
2. **Fonts update** — typography swaps to new kit's font stack
3. **Logo swaps** — the asset node loads new kit's logo SVG
4. **Rules change** — if new kit has `colorMode: "strict"`, that enforcement starts
5. **Generated images stay** — AI backgrounds aren't regenerated automatically
   (they might clash with new colors → Claudia gets a warning + "Regenerate?" prompt)

### What changes automatically:
- Palette colors in text layers
- Font families in text layers
- Logo asset references
- Constraint rules
- Prompt enrichment context

### What stays (user decides):
- Generated background images (may need re-gen for new palette)
- Layer positions and sizes
- Custom text content
- Z-ordering

## Data Flow: Kit Storage

```
Brand kits live in two places:

1. Local (dev/preview):
   cuarzos-runtime/public/brand-kits/{kit-id}/kit.json

2. Production (SurrealDB):
   brand_kits table → { id, kit_json, logos: [blob refs] }
   
   SurrealDB is already in the stack:
   - SurrealDB Factory (port 8001) ← this one
   - SurrealDB Notebook (port 8000) ← Open Notebook's
```

## Multi-Brand in the Zustand Store

```typescript
// Addition to the studio store
interface StudioStore {
  // ... existing state ...
  
  // Brand kit management
  availableKits: BrandKitSummary[]    // list of all kits
  activeKit: BrandKit | null          // currently loaded kit
  
  // Kit actions
  loadKitList: () => Promise<void>    // fetch from SurrealDB
  switchKit: (kitId: string) => void  // load kit + re-resolve template
  createKit: (kit: BrandKit) => void  // save new kit
  updateKit: (kit: BrandKit) => void  // edit existing kit
  duplicateKit: (kitId: string) => void // clone for new client
}

type BrandKitSummary = {
  id: string
  name: string
  thumbnail: string            // auto-generated from palette colors
  logoCount: number
  lastUsed: string
}
```

## The Claudia Workflow (Multi-Client Day)

```
9:00 AM — Client A needs LinkedIn content
  → Open Studio
  → Switch to "Client A" brand kit
  → Pick "LinkedIn Banner" template
  → Generate background, add copy
  → Export → send to client

9:30 AM — Client B needs Instagram stories
  → Switch to "Client B" brand kit (one click)
  → All colors, fonts, logos swap
  → Pick "Instagram Story" template
  → Generate 3 story variations
  → Export all → send to client

10:00 AM — J. Charles Assets needs a new flyer
  → Switch to "JCA" brand kit
  → Pick "Flyer" template
  → Build the flyer with JCA branding
  → Export → send to print

Same tool. Same templates. Different brands.
Three clients served in 90 minutes. No design degree needed.
```

## Future: Brand Kit Marketplace

Once the template + kit system is solid:
- Claudia creates high-quality templates
- Other users import them
- Templates work with ANY brand kit
- Potential revenue stream: sell premium templates

But that's phase 2. Phase 1 is getting Claudia productive.
