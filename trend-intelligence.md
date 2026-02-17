# Cuarzos Studio — Trend Intelligence (Premium Feature)

> Free tier: you tell the AI what to make.
> Premium tier: the AI tells YOU what to make — based on what's actually working.
>
> This is the upgrade path. This is where the cost comes in.
> And this is where the value justifies it.

## The Concept

The Studio's free tier generates images from user prompts. But the user has to
know what to ask for. The premium tier flips that:

```
Free:     "Make me a tropical sunset background"     ← user guesses
Premium:  "Here's what's going viral in your niche   ← system knows
           right now. Want me to make something
           like that, but on-brand?"
```

The intelligence comes from two crawlers working together:

1. **Firecrawl** — API-based web scraper. Crawls competitor pages, trending
   hashtags, viral posts. Extracts visual themes, copy patterns, color trends.
   Cost: per-crawl API charges.

2. **Vercel Browser CLI** (`@vercel/browser`) — headless browser that can
   actually SEE pages. Screenshots, visual analysis, pixel-level trend data.
   The "eyeballs" component. Sees what Firecrawl can't parse from HTML alone.

## Why It Costs Money

| Component | Free? | Cost |
|-----------|-------|------|
| Nano Banana Pro (generation) | ✅ Free (Antigravity/AI Studio) | $0 |
| Brand kit + templates | ✅ Free | $0 |
| Firecrawl API | ❌ Paid | Per crawl (~$0.01-0.05/page) |
| Meta Graph API (Pixel data) | ❌ Paid/rate-limited | Meta business tier |
| Social API access (trends) | ❌ Paid | Platform-dependent |
| Vercel Browser CLI | ❌ Compute cost | Per-session |
| Gemini analysis of crawl data | ✅ Free (swarm node) | $0 |

The AI reasoning is free (swarm nodes). The data acquisition is what costs.

## Architecture

```
┌────────────────────────────────────────────────┐
│              TREND INTELLIGENCE                 │
│                 (Premium)                       │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────┐    ┌──────────────────┐      │
│  │  Firecrawl   │    │ Vercel Browser   │      │
│  │  (API crawl) │    │ CLI (eyeballs)   │      │
│  │              │    │                  │      │
│  │  • HTML/text │    │  • Screenshots   │      │
│  │  • Links     │    │  • Visual layout │      │
│  │  • Metadata  │    │  • Color extract │      │
│  │  • Hashtags  │    │  • Font detect   │      │
│  └──────┬───────┘    └────────┬─────────┘      │
│         │                     │                │
│         ▼                     ▼                │
│  ┌──────────────────────────────────────┐      │
│  │        Trend Analyzer                │      │
│  │    (Gemini 2.5 Pro — Swarm Node)     │      │
│  │                                      │      │
│  │  Inputs: crawled pages + screenshots │      │
│  │  Output: TrendReport                 │      │
│  │    • dominant colors                 │      │
│  │    • layout patterns                 │      │
│  │    • copy themes                     │      │
│  │    • visual styles trending          │      │
│  │    • engagement signals              │      │
│  └──────────────┬───────────────────────┘      │
│                 │                               │
│                 ▼                               │
│  ┌──────────────────────────────────────┐      │
│  │        Design Suggestions            │      │
│  │                                      │      │
│  │  "Based on what's viral right now:   │      │
│  │   • Dark gradients with neon text    │      │
│  │   • Short, punchy headlines (3 words)│      │
│  │   • Top performers use warm tones    │      │
│  │                                      │      │
│  │  [Generate Like This] [Customize]"   │      │
│  └──────────────────────────────────────┘      │
│                                                │
└────────────────────────────────────────────────┘
         │
         ▼ feeds into
┌────────────────────────────────────────────────┐
│              STUDIO (Free Tier)                │
│  Template + Brand Kit + AI Generation          │
│  (prompt is now INFORMED, not guessed)         │
└────────────────────────────────────────────────┘
```

## The Trend Report

What the intelligence layer produces after a crawl:

```typescript
type TrendReport = {
  id: string
  crawledAt: string
  sources: CrawlSource[]
  
  // Visual trends
  dominantColors: string[]           // hex colors trending
  layoutPatterns: LayoutPattern[]    // "full-bleed image", "text-overlay-center"
  typographyTrends: string[]        // "bold sans-serif", "handwritten accents"
  
  // Content trends
  topHashtags: string[]
  copyPatterns: string[]            // "question headlines", "emoji-heavy", "minimal"
  ctaStyles: string[]               // "swipe up", "link in bio", "shop now"
  
  // Engagement signals
  topPerformers: {
    url: string
    engagement: number              // likes + comments + shares
    screenshotUrl: string           // from Vercel Browser CLI
    whyItWorks: string              // Gemini analysis
  }[]
  
  // Actionable suggestions
  suggestions: {
    prompt: string                  // ready-to-use generation prompt
    style: string                   // style preset that matches trend
    template: string                // recommended template
    confidence: number              // 0-1 how strong the signal is
  }[]
}

type CrawlSource = {
  platform: 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'web'
  query: string                     // hashtag, competitor URL, or niche keyword
  pagesScraped: number
  cost: number                      // $ spent on this crawl
}

type LayoutPattern = {
  name: string                      // "text-over-image", "split-layout", etc.
  frequency: number                 // how often it appears in top performers
  example: string                   // screenshot URL
}
```

## The Crawl Flow

```
1. Client enables Premium:
   "Show me what's working in [luxury real estate] on [Instagram]"

2. Firecrawl dispatched:
   → Crawls top 50 posts for #luxuryrealestate
   → Extracts captions, hashtags, engagement counts, image URLs
   → Cost: ~$2.50 (50 pages × $0.05)

3. Vercel Browser CLI dispatched:
   → Opens top 10 performing posts
   → Takes screenshots
   → Extracts visual data: colors, fonts, layout patterns
   → Cost: ~$0.50 (10 sessions)

4. Trend Analyzer (Gemini 2.5 Pro on Swarm Node — FREE):
   → Receives: 50 crawled pages + 10 screenshots
   → Analyzes: what visual patterns correlate with high engagement?
   → Produces: TrendReport with actionable suggestions

5. Studio receives TrendReport:
   → Displays: "Here's what's working right now"
   → Offers: "[Generate Like This]" button
   → Prompt is pre-filled with trend-informed language
   → Brand kit still constrains everything (your brand, their trends)

Total cost: ~$3 per trend scan. Value: data-driven design instead of guessing.
```

## Meta Pixel Integration

For clients who have Meta Pixel installed on their sites:

```
Meta Pixel Data → Which designs drove actual conversions?
                → Not just likes — real business outcomes
                → "This style of post led to 12 site visits and 3 form fills"
                → Feed back into trend analysis for next crawl
```

This closes the loop:
- Crawl → what's trending (attention)
- Generate → make on-brand version (creation)
- Post → track with Meta Pixel (measurement)
- Analyze → what actually converted (learning)
- Crawl again → now informed by YOUR data, not just market trends

## Pricing Model

```
┌────────────────────────────────────────────────────┐
│  FREE TIER                                          │
│  • Studio with templates + brand kits               │
│  • AI generation (Nano Banana Pro — unlimited)      │
│  • Manual prompts only                              │
│  • Export up to 10/day                              │
│  Cost to us: $0 (all free compute)                  │
├────────────────────────────────────────────────────┤
│  PRO TIER — $29/mo                                  │
│  • Everything in Free                               │
│  • 10 trend scans/month                             │
│  • Firecrawl + Browser analysis                     │
│  • Smart prompt suggestions                         │
│  • Unlimited exports                                │
│  Cost to us: ~$30/mo (API costs)                    │
│  Margin: breakeven → value is in retention          │
├────────────────────────────────────────────────────┤
│  AGENCY TIER — $99/mo                               │
│  • Everything in Pro                                │
│  • Unlimited trend scans                            │
│  • Meta Pixel integration                           │
│  • Multi-brand (unlimited brand kits)               │
│  • Conversion tracking + learning loop              │
│  • Priority generation queue                        │
│  Cost to us: ~$50-80/mo (heavy crawling)            │
│  Margin: 20-50%                                     │
└────────────────────────────────────────────────────┘
```

## Feature Flag

```typescript
// In the studio store
type SubscriptionTier = 'free' | 'pro' | 'agency'

const FEATURE_FLAGS = {
  trendIntelligence:  (tier: SubscriptionTier) => tier !== 'free',
  metaPixel:          (tier: SubscriptionTier) => tier === 'agency',
  unlimitedExports:   (tier: SubscriptionTier) => tier !== 'free',
  unlimitedBrandKits: (tier: SubscriptionTier) => tier === 'agency',
  trendScansPerMonth: (tier: SubscriptionTier) => ({
    free: 0,
    pro: 10,
    agency: Infinity,
  })[tier],
}
```

## Compute Allocation (Premium)

| Task | Model | Lane | Cost |
|------|-------|------|------|
| Firecrawl dispatch | n/a (API call) | External | $0.01-0.05/page |
| Browser screenshots | Vercel Browser CLI | External | ~$0.05/session |
| Trend analysis | gemini-2.5-pro | Swarm node (B/C/D/E) | $0 (free OAuth) |
| Suggestion generation | gemini-2.5-flash | Swarm node | $0 (free OAuth) |
| Image generation | Nano Banana Pro | AI Studio / Antigravity | $0 (free) |

The beauty: **the expensive part is data acquisition, not AI reasoning.**
All the smart work (analysis, suggestions, generation) runs on free compute.
You're only paying for eyeballs and data, not brains.
