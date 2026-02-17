<div align="center">

# 🎨 Cuarzos Studio

**AI-powered brand design tool.**
Generate backgrounds. Overlay brand assets. Export composites.

*The AI generates. The engine assembles. The brand kit constrains.*

[![Status](https://img.shields.io/badge/status-design_phase-blue?style=for-the-badge)](.)
[![Stack](https://img.shields.io/badge/stack-Next.js_16_+_React_19-black?style=for-the-badge&logo=nextdotjs)](.)
[![AI](https://img.shields.io/badge/AI-Nano_Banana_Pro-yellow?style=for-the-badge&logo=google)](.)
[![Canvas](https://img.shields.io/badge/canvas-React_Flow-ff6f00?style=for-the-badge)](.)
[![UI](https://img.shields.io/badge/UI-shadcn/ui-000?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](.)

</div>

---

## 💡 What Is This?

Cuarzos Studio is a **brand-aware design tool** that combines AI image generation with a layer-based compositor. Think Canva meets Figma, powered by Google's Nano Banana Pro model — with a constraint engine that ensures every output respects your brand.

<div align="center">
<img src="assets/studio-mockup.png" alt="Cuarzos Studio UI" width="720" />
</div>

> **You type a prompt.** The AI generates the background. Your logo overlays on top. Brand fonts and colors auto-apply. Export a pixel-perfect branded image in one click. No design skills needed.

---

## 🏗 Architecture

```mermaid
graph TB
    subgraph UI["🖥️ Studio Interface"]
        TB[Toolbar] --> CV[Canvas]
        LP[Layer Panel] --> CV
        PP[Properties Panel] --> CV
    end

    subgraph Engine["⚙️ Logic Layer"]
        CE[Constraint Engine]
        EX[Export Engine]
        TM[Template Resolver]
    end

    subgraph AI["🧠 AI Layer"]
        NB["🍌 Nano Banana Pro<br/>Image Generation"]
        TA["Trend Analyzer<br/>(Premium)"]
    end

    subgraph Data["💾 Data Layer"]
        BK[Brand Kits]
        TP[Templates]
        SR[(SurrealDB)]
    end

    CV -->|operations| CE
    CE -->|validated| EX
    TM -->|resolved layers| CV
    NB -->|generated image| CV
    TA -->|suggestions| CV
    BK --> TM
    BK --> CE
    TP --> TM
    SR --> BK
    SR --> TP

    style NB fill:#f9e44c,stroke:#333,color:#000
    style CE fill:#e94560,stroke:#333,color:#fff
    style CV fill:#16213e,stroke:#333,color:#fff
    style SR fill:#1a1a2e,stroke:#333,color:#fff
```

---

## 🧱 Layer Stack

The design surface is a z-ordered stack of three node types:

<div align="center">
<img src="assets/layer-stack.png" alt="Layer Stack" width="480" />
</div>

| Node Type | Source | AI-Generated? | Constrained? |
|-----------|--------|:-------------:|:------------:|
| **ImageNode** | Nano Banana Pro | ✅ Yes | Palette-aware prompts |
| **AssetNode** | Brand kit SVG/PNG | ❌ Never | Min size, z-order locked |
| **TextNode** | User input | ❌ No | Fonts, colors from kit |

---

## 🎨 Brand Kit System

Brand kits are **machine-readable constraint files** — not style guide PDFs.

```json
{
  "name": "J. Charles Assets",
  "palette": {
    "primary": "#1a1a2e",
    "accent":  "#e94560",
    "text":    "#eaeaea"
  },
  "fonts": {
    "heading": { "family": "Inter", "weights": [600, 700] },
    "body":    { "family": "Inter", "weights": [400, 500] }
  },
  "logos": [
    { "id": "primary", "file": "logos/primary.svg", "minSize": 80 }
  ],
  "rules": {
    "logoAlwaysOnTop": true,
    "colorMode": "suggest",
    "clearSpaceRatio": 0.25
  }
}
```

**One template × many brand kits = infinite branded content.**

```mermaid
graph LR
    T["📄 Template:<br/>Instagram Story"] --> A["🎨 Kit A → Design A"]
    T --> B["🎨 Kit B → Design B"]
    T --> C["🎨 Kit C → Design C"]
    
    style T fill:#16213e,stroke:#333,color:#fff
    style A fill:#e94560,stroke:#333,color:#fff
    style B fill:#f9e44c,stroke:#333,color:#000
    style C fill:#2ecc71,stroke:#333,color:#fff
```

---

## ⚙️ Constraint Engine

Every operation validates against the brand kit in real time:

```mermaid
flowchart LR
    OP[User Operation] --> V{Validate}
    V -->|✅ Pass| APPLY[Apply to Canvas]
    V -->|⚠️ Warning| WARN[Show Warning + Apply]
    V -->|❌ Block| BLOCK[Block + Suggest Fix]
    
    style OP fill:#16213e,stroke:#333,color:#fff
    style APPLY fill:#2ecc71,stroke:#333,color:#fff
    style WARN fill:#f9e44c,stroke:#333,color:#000
    style BLOCK fill:#e94560,stroke:#333,color:#fff
```

| Rule | What It Catches | Severity |
|------|----------------|----------|
| `logo-always-on-top` | Logo dragged behind AI image | 🔴 Error |
| `logo-min-size` | Logo shrunk below 80px | 🔴 Error |
| `strict-palette` | Off-brand color picked | 🔴 Error |
| `brand-fonts` | Non-kit font selected | 🟡 Warning |
| `generated-behind-brand` | AI image z-index too high | 🟡 Warning |
| `locked-layer` | Locked layer deletion attempted | 🔴 Error |

---

## 🔥 Premium: Trend Intelligence

> **Free tier:** you tell the AI what to make.
> **Premium tier:** the AI tells YOU what to make — based on what's working.

<div align="center">
<img src="assets/trend-intelligence.png" alt="Trend Intelligence" width="640" />
</div>

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FC as 🔥 Firecrawl
    participant BR as 👁️ Browser CLI
    participant AI as 🧠 Gemini (Free)
    participant NB as 🍌 Nano Banana Pro

    U->>FC: "What's viral in luxury real estate?"
    FC-->>AI: 50 crawled pages (captions, hashtags, engagement)
    U->>BR: Screenshots of top 10 posts
    BR-->>AI: Visual analysis (colors, layouts, fonts)
    AI-->>U: TrendReport + design suggestions
    U->>NB: "Generate like this, but on-brand"
    NB-->>U: Brand-aware image based on trends
```

| Tier | Price | What You Get |
|------|-------|-------------|
| **Free** | $0/mo | Studio + templates + AI generation (unlimited) |
| **Pro** | $29/mo | + 10 trend scans/month + smart suggestions |
| **Agency** | $99/mo | + unlimited scans + Meta Pixel + conversion loop |

---

## 🛠 Tech Stack

Already integrated in the Cuarzos runtime:

| Dependency | Version | Role |
|-----------|---------|------|
| [`@xyflow/react`](https://reactflow.dev) | 12.10.0 | Canvas — pan, zoom, drag, z-order |
| [`shadcn/ui`](https://ui.shadcn.com) | new-york | UI chrome — 20+ components mapped |
| [`@google/generative-ai`](https://ai.google.dev) | 0.24.1 | Nano Banana Pro image gen |
| [`next`](https://nextjs.org) | 16.1.1 | Framework |
| [`react`](https://react.dev) | 19.2.3 | UI |
| [`@supabase/supabase-js`](https://supabase.com) | 2.90.1 | Backend |
| [`recharts`](https://recharts.org) | 3.6.0 | Analytics/data viz |

**AI Compute:** All free. Nano Banana Pro via Antigravity OAuth + AI Studio free tier. Trend analysis on dedicated Gemini swarm nodes. Zero API costs for core features.

---

## 📂 Documentation

| File | What It Covers |
|------|---------------|
| [`README.md`](README.md) | This file — architecture overview |
| [`data-model.ts`](data-model.ts) | Layer, BrandKit, Project TypeScript types |
| [`constraint-engine.ts`](constraint-engine.ts) | Brand validation rules + prompt enrichment |
| [`export-engine.ts`](export-engine.ts) | Layer compositor / flatten to image |
| [`generation-pipeline.ts`](generation-pipeline.ts) | Nano Banana Pro integration + style presets |
| [`api-route.ts`](api-route.ts) | Next.js API route for image generation |
| [`component-architecture.md`](component-architecture.md) | React component tree + shadcn mapping |
| [`brand-kit-format.md`](brand-kit-format.md) | kit.json spec + file structure |
| [`template-system.md`](template-system.md) | Template format + resolution + categories |
| [`multi-brand.md`](multi-brand.md) | Kit switching + multi-client workflows |
| [`trend-intelligence.md`](trend-intelligence.md) | Premium feature + pricing model |

---

## 🎯 Design Principles

1. **AI generates, engine assembles** — AI creates raw materials, deterministic code composites them
2. **Brand kit constrains** — every operation validates against machine-readable brand rules
3. **Sacred assets stay sacred** — logos are overlaid, never regenerated by AI
4. **Right tool for the right job** — image gen models for images, constraint logic for rules
5. **Free compute for brains, paid only for data** — premium tier charges for crawling, not reasoning

---

## 🗺 Roadmap

- [x] Architecture specification
- [x] Data model + type system
- [x] Constraint engine design
- [x] Export/flatten pipeline
- [x] Generation pipeline (Nano Banana Pro)
- [x] Component architecture (shadcn + React Flow)
- [x] Brand kit format + multi-brand
- [x] Template system
- [x] Trend intelligence (premium feature)
- [ ] Implementation: Studio page + components
- [ ] Implementation: Brand kit CRUD
- [ ] Implementation: Template library
- [ ] Implementation: Nano Banana Pro API integration
- [ ] Implementation: Firecrawl + Browser CLI integration
- [ ] Launch: Beta with J. Charles Assets brand kit

---

<div align="center">

**Part of the Lensmen Stack** · Built with 🎸 punk rock engineering

*€20/mo Hetzner VPS. Free AI compute. Embarrassing abundance of riches.*

</div>
