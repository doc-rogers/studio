# Cuarzos Studio — Brand Kit Format

> The brand kit is the constraint system. It defines what's sacred.
> Everything the AI generates must harmonize with it.
> Everything the user builds must conform to it.

## What a Brand Kit Is

A brand kit is a JSON file + a folder of assets. It contains:
- **Palette** — the exact colors that represent the brand
- **Typography** — the fonts (heading, body, accent)
- **Logos** — SVG/PNG files that are NEVER AI-generated
- **Rules** — constraints like "logo always on top" or "only palette colors"

The brand kit is NOT a style guide document. It's a **machine-readable constraint file**
that the Studio's constraint engine enforces in real time.

## File Structure

```
brand-kits/
├── jcharles-assets/
│   ├── kit.json                ← the constraint definition
│   ├── logos/
│   │   ├── primary.svg         ← full color logo
│   │   ├── monochrome.svg      ← single color version
│   │   └── icon-only.svg       ← favicon / small usage
│   ├── fonts/                  ← self-hosted if needed
│   └── patterns/               ← optional background patterns
│
├── cuarzos/
│   ├── kit.json
│   ├── logos/
│   │   ├── cuarzos-full.svg
│   │   └── cuarzos-mark.svg
│   └── fonts/
│
└── client-template/
    ├── kit.json                ← empty template for new clients
    └── logos/
```

## kit.json Format

```json
{
  "id": "jcharles-assets",
  "name": "J. Charles Assets",
  "version": "1.0.0",
  "createdAt": "2026-02-17T04:50:00Z",

  "palette": {
    "primary":    "#1a1a2e",
    "secondary":  "#16213e",
    "accent":     "#e94560",
    "background": "#0f0f23",
    "text":       "#eaeaea",
    "muted":      "#8888aa"
  },

  "fonts": {
    "heading": {
      "family": "Inter",
      "source": "google",
      "weights": [600, 700, 800]
    },
    "body": {
      "family": "Inter",
      "source": "google",
      "weights": [400, 500]
    },
    "accent": {
      "family": "Playfair Display",
      "source": "google",
      "weights": [400, 700]
    }
  },

  "logos": [
    {
      "id": "primary",
      "name": "Primary Logo",
      "file": "logos/primary.svg",
      "type": "logo",
      "minSize": 80,
      "usage": "Main brand mark — use on light or dark backgrounds"
    },
    {
      "id": "monochrome",
      "name": "Monochrome Logo",
      "file": "logos/monochrome.svg",
      "type": "logo",
      "minSize": 60,
      "usage": "Single-color contexts, watermarks, subtle branding"
    },
    {
      "id": "icon",
      "name": "Icon Mark",
      "file": "logos/icon-only.svg",
      "type": "icon",
      "minSize": 32,
      "usage": "Small spaces — favicons, social avatars, app icons"
    }
  ],

  "rules": {
    "colorMode": "suggest",
    "logoAlwaysOnTop": true,
    "logoMinSize": 80,
    "logoZone": "top-right",
    "clearSpaceRatio": 0.25,
    "allowCustomFonts": false,
    "backgroundStyle": "dark-preferred"
  },

  "promptContext": {
    "mood": "professional, sophisticated, modern",
    "avoid": "childish, cartoonish, clip-art, stock photo feel",
    "industry": "real estate, asset management, luxury"
  }
}
```

## How It's Used

### By the Constraint Engine
```
User drags logo behind AI background → constraint-engine checks logoAlwaysOnTop → BLOCKED
User picks Comic Sans → constraint-engine checks fonts → WARNING: not in kit
User picks #ff0000 red → constraint-engine checks palette + colorMode → SUGGEST alternative
```

### By the Generation Pipeline
```
User prompt: "luxury penthouse rooftop view"
enrichPrompt() reads kit.json:
  → adds palette: "#1a1a2e #16213e #e94560"
  → adds mood: "professional, sophisticated, modern"
  → adds avoid: "childish, cartoonish"
  → adds clear space: "leave top-right clear for logo"
  → sends enriched prompt to Nano Banana Pro
```

### By the Template System
```
Template "Instagram Story" loads kit.json:
  → places primary logo at logoZone (top-right)
  → sets text color to palette.text
  → sets heading font to fonts.heading.family
  → background ready for AI generation
```

## Claudia's Workflow

1. Client says "I need Instagram content for my launch"
2. Claudia opens Studio, selects the client's brand kit
3. Picks "Instagram Story" template — logo auto-placed, fonts loaded
4. Types "modern luxury apartment interior, warm lighting"
5. Nano Banana Pro generates 4 variations (brand-aware prompts)
6. Picks the best one → it slots in at z:0 behind the logo
7. Adds text: "NOW LEASING" — auto-styled with kit fonts/colors
8. Export → download → post

No design skills needed. The brand kit does the heavy lifting.
