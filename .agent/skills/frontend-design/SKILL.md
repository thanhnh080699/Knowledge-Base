---
name: frontend-design
description: Design thinking and decision-making for web UI. Use when designing components, layouts, color schemes, typography, or creating aesthetic interfaces. Teaches principles, not fixed values.
when_to_use: "When designing web UI components, choosing color schemes, typography, layouts, or creating aesthetic interfaces. NOT for mobile apps."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Frontend Design System

> **Philosophy:** Every pixel has purpose. Restraint is luxury. User psychology drives decisions.
> **Core Principle:** THINK, don't memorize. ASK, don't assume.

---

## 🎯 Selective Reading Rule (MANDATORY)

**Read REQUIRED files always, OPTIONAL only when needed:**

| File | Status | When to Read |
|------|--------|--------------|
| [ux-psychology.md](ux-psychology.md) | 🔴 **REQUIRED** | Always read first! |
| [color-system.md](color-system.md) | ⚪ Optional | Color/palette decisions |
| [typography-system.md](typography-system.md) | ⚪ Optional | Font selection/pairing |
| [visual-effects.md](visual-effects.md) | ⚪ Optional | Glassmorphism, shadows, gradients |
| [animation-guide.md](animation-guide.md) | ⚪ Optional | Animation needed |
| [motion-graphics.md](motion-graphics.md) | ⚪ Optional | Lottie, GSAP, 3D |
| [decision-trees.md](decision-trees.md) | ⚪ Optional | Context templates |

> 🔴 **ux-psychology.md = ALWAYS READ. Others = only if relevant.**

---

## 🔧 Runtime Scripts

**Execute these for audits (don't read, just run):**

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/ux_audit.py` | UX Psychology & Accessibility Audit | `python scripts/ux_audit.py <project_path>` |
| `scripts/accessibility_checker.py` | Focused accessibility checks (contrast, ARIA, focus) | `python scripts/accessibility_checker.py <project_path>` |

---

## ⚠️ CRITICAL: ASK BEFORE ASSUMING (MANDATORY)

> **STOP! If the user's request is open-ended, DO NOT default to your favorites.**

### When User Prompt is Vague, ASK:

**Color not specified?** Ask:
> "What color palette do you prefer? (blue/green/orange/neutral/other?)"

**Style not specified?** Ask: 
> "What style are you going for? (minimal/bold/retro/futuristic/organic?)"

**Layout not specified?** Ask:
> "Do you have a layout preference? (single column/grid/asymmetric/full-width?)"

### ⛔ DEFAULT TENDENCIES TO AVOID (ANTI-SAFE HARBOR):

| AI Default Tendency | Why It's Bad | Think Instead |
|---------------------|--------------|---------------|
| **Bento Grids (Modern Cliché)** | Used in every AI design | Why does this content NEED a grid? |
| **Hero Split (Left/Right)** | Predictable & Boring | How about Massive Typography or Vertical Narrative? |
| **Mesh/Aurora Gradients** | The "new" lazy background | What's a radical color pairing? |
| **Glassmorphism** | AI's idea of "premium" | How about solid, high-contrast flat? |
| **Deep Cyan / Fintech Blue** | Safe harbor from purple ban | Why not Red, Black, or Neon Green? |
| **"Orchestrate / Empower"** | AI-generated copywriting | How would a human say this? |
| Dark background + neon glow | Overused, "AI look" | What does the BRAND actually need? |
| **Rounded everything** | Generic/Safe | Where can I use sharp, brutalist edges? |

> 🔴 **"Every 'safe' structure you choose brings you one step closer to a generic template. TAKE RISKS."**

---

## 1. Constraint Analysis (ALWAYS FIRST)

Before any design work, ANSWER THESE or ASK USER:

| Constraint | Question | Why It Matters |
|------------|----------|----------------|
| **Timeline** | How much time? | Determines complexity |
| **Content** | Ready or placeholder? | Affects layout flexibility |
| **Brand** | Existing guidelines? | May dictate colors/fonts |
| **Tech** | What stack? | Affects capabilities |
| **Audience** | Who exactly? | Drives all visual decisions |

### Audience → Design Approach

| Audience | Think About |
|----------|-------------|
| **Gen Z** | Bold, fast, mobile-first, authentic |
| **Millennials** | Clean, minimal, value-driven |
| **Gen X** | Familiar, trustworthy, clear |
| **Boomers** | Readable, high contrast, simple |
| **B2B** | Professional, data-focused, trust |
| **Luxury** | Restrained elegance, whitespace |

---

## 2. UX Psychology Principles

### Core Laws (Internalize These)

| Law | Principle | Application |
|-----|-----------|-------------|
| **Hick's Law** | More choices = slower decisions | Limit options, use progressive disclosure |
| **Fitts' Law** | Bigger + closer = easier to click | Size CTAs appropriately |
| **Miller's Law** | ~7 items in working memory | Chunk content into groups |
| **Von Restorff** | Different = memorable | Make CTAs visually distinct |
| **Serial Position** | First/last remembered most | Key info at start/end |

### Emotional Design Levels

```
VISCERAL (instant)  → First impression: colors, imagery, overall feel
BEHAVIORAL (use)    → Using it: speed, feedback, efficiency
REFLECTIVE (memory) → After: "I like what this says about me"
```

### Trust Building

- Security indicators on sensitive actions
- Social proof where relevant
- Clear contact/support access
- Consistent, professional design
- Transparent policies

---

## 3. Layout Principles

### Golden Ratio (φ = 1.618)

```
Use for proportional harmony:
├── Content : Sidebar = roughly 62% : 38%
├── Each heading size = previous × 1.618 (for dramatic scale)
└── Spacing can follow: sm → md → lg (each × 1.618)
```

### 8-Point Grid Concept

```
All spacing and sizing in multiples of 8:
├── Tight: 4px (half-step for micro)
├── Small: 8px
├── Medium: 16px
├── Large: 24px, 32px
├── XL: 48px, 64px, 80px
└── Adjust based on content density
```
