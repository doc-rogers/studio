# Cuarzos Studio — Template System

> Templates are pre-built layer stacks with brand kit slots.
> Pick a template → plug in a brand kit → generate → export.

## What a Template Is

A template is a **saved Project** with placeholder layers. When a brand kit is applied,
the placeholders resolve to actual brand assets, colors, and fonts.

Think of it like a mail merge — the template is the letter, the brand kit is the data source.

## Template Format

```json
{
  "id": "instagram-story-promo",
  "name": "Instagram Story — Promo",
  "category": "social",
  "canvas": { "w": 1080, "h": 1920, "label": "Instagram Story" },
  "thumbnail": "templates/instagram-story-promo/thumb.png",

  "layers": [
    {
      "id": "bg",
      "type": "image",
      "z": 0,
      "position": { "x": 0, "y": 0 },
      "size": { "w": 1080, "h": 1920 },
      "opacity": 1.0,
      "placeholder": true,
      "placeholderType": "generate",
      "defaultPrompt": "abstract gradient background"
    },
    {
      "id": "overlay",
      "type": "image",
      "z": 1,
      "position": { "x": 0, "y": 0 },
      "size": { "w": 1080, "h": 1920 },
      "opacity": 0.4,
      "src": "templates/shared/dark-gradient-overlay.png",
      "locked": true
    },
    {
      "id": "headline",
      "type": "text",
      "z": 2,
      "position": { "x": 80, "y": 800 },
      "size": { "w": 920, "h": 200 },
      "text": "YOUR HEADLINE",
      "style": {
        "fontFamily": "{{kit.fonts.heading.family}}",
        "fontSize": 72,
        "fontWeight": 700,
        "color": "{{kit.palette.text}}",
        "align": "left"
      }
    },
    {
      "id": "subtext",
      "type": "text",
      "z": 3,
      "position": { "x": 80, "y": 1020 },
      "size": { "w": 920, "h": 100 },
      "text": "Supporting copy goes here",
      "style": {
        "fontFamily": "{{kit.fonts.body.family}}",
        "fontSize": 28,
        "fontWeight": 400,
        "color": "{{kit.palette.muted}}",
        "align": "left"
      }
    },
    {
      "id": "logo",
      "type": "asset",
      "z": 4,
      "position": { "x": 860, "y": 80 },
      "size": { "w": 140, "h": 140 },
      "assetId": "{{kit.logos[0].id}}",
      "preserveAspect": true,
      "locked": true
    },
    {
      "id": "cta",
      "type": "text",
      "z": 5,
      "position": { "x": 80, "y": 1700 },
      "size": { "w": 920, "h": 80 },
      "text": "LEARN MORE →",
      "style": {
        "fontFamily": "{{kit.fonts.heading.family}}",
        "fontSize": 24,
        "fontWeight": 600,
        "color": "{{kit.palette.accent}}",
        "align": "center"
      }
    }
  ]
}
```

## Template Resolution

When a user selects this template + a brand kit, the `{{ }}` placeholders resolve:

```
"{{kit.fonts.heading.family}}"  → "Inter"
"{{kit.palette.text}}"          → "#eaeaea"
"{{kit.palette.muted}}"         → "#8888aa"
"{{kit.palette.accent}}"        → "#e94560"
"{{kit.logos[0].id}}"           → "primary" → loads logos/primary.svg
```

The background layer (`placeholderType: "generate"`) prompts the user to type a prompt
or use the `defaultPrompt` to auto-generate with Nano Banana Pro.

## Template Categories

| Category | Templates | Use Case |
|----------|-----------|----------|
| `social` | Instagram Story, Instagram Post, Facebook Cover, Twitter Header | Social media content |
| `print` | Business Card, Flyer, A4 Brochure | Physical materials |
| `video` | YouTube Thumbnail, Stream Overlay | Video platforms |
| `web` | LinkedIn Banner, Email Header, Blog Hero | Web presence |
| `presentation` | Slide 16:9, Slide Title, Slide Content | Decks & pitches |

## Template Library Structure

```
templates/
├── social/
│   ├── instagram-story-promo/
│   │   ├── template.json
│   │   └── thumb.png
│   ├── instagram-post-quote/
│   │   ├── template.json
│   │   └── thumb.png
│   └── facebook-cover-brand/
│       ├── template.json
│       └── thumb.png
├── print/
│   ├── business-card-minimal/
│   └── flyer-event/
├── shared/
│   ├── dark-gradient-overlay.png
│   ├── light-gradient-overlay.png
│   └── noise-texture.png
└── _custom/                    ← user-saved templates
```

## From Template to Final Asset

```
1. User picks template: "Instagram Story — Promo"
2. User picks brand kit: "J. Charles Assets"
   → Template resolves all {{ }} placeholders
   → Logo placed at z:4, locked
   → Fonts and colors applied
3. User types prompt: "luxury apartment rooftop sunset"
   → enrichPrompt() adds brand context
   → Nano Banana Pro generates image
   → Image placed at z:0 (background)
4. User edits headline: "NOW LEASING"
5. User adjusts subtext, CTA
6. Export → 1080×1920 PNG → ready to post
```

## Custom Templates

Users can save any design as a custom template:
- "Save as Template" → strips content, preserves structure
- Text becomes placeholders ("YOUR HEADLINE")
- Images become generation prompts
- Brand kit references become `{{ }}` variables
- Saved to `templates/_custom/`

This means Claudia builds one great design, saves it as a template,
and reuses it across every client by swapping the brand kit.
One template × many brands = infinite branded content.
