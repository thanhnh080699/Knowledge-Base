---
name: impeccable
description: "Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens."
when_to_use: "When designing, polishing, auditing, or refactoring web interfaces, components, color systems, typography, spacing, or motion."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Impeccable Design Framework & Skill

Designs and iterates production-grade frontend interfaces. Real working code, committed design choices, exceptional craft.

## Setup

You MUST do these steps before proceeding:

1. Run `npx impeccable install` once in the project workspace to set up the CLI tools if they are not already installed.
2. Read the appropriate reference file depending on the task:
   - For auditing UI: `reference/audit.md`
   - For polishing designs: `reference/polish.md`
   - For UI critique: `reference/critique.md`
   - For extracting components: `reference/extract.md`
3. Identify the product register:
   - If it is marketing, a landing page, a campaign, long-form content, or a portfolio, read `reference/brand.md`.
   - If it is app UI, admin panel, a dashboard, or a tool, read `reference/product.md`.
4. Familiarize yourself with the existing design system, design tokens, and components in the codebase. Do not reinvent the wheel unless the UX wins.

## Design Guidance

### 1. Color
- **Verify contrast:** Body text must hit ≥4.5:1 against its background; large text (≥18px or bold ≥14px) needs ≥3:1. Placeholder text needs the same 4.5:1, not the muted-gray default. Bump the body color toward the ink end of the ramp if needed; light gray text is hard to read.
- **Color harmony:** Gray text on a colored background looks washed out. Use a darker shade of the background's own hue, or a transparency of the text color.
- **Use OKLCH:** Prefer OKLCH for predictable color manipulation and consistent lightness.

### 2. Typography
- **Line length:** Cap body line length at 65–75ch for readability.
- **Font pairing:** Don't pair fonts that are similar but not identical. Pair on a contrast axis (serif + sans, geometric + humanist) or use one family in multiple weights.
- **Heading ceilings:** Hero/display heading size should clamp max ≤ 6rem (~96px).
- **Letter spacing:** Display heading letter-spacing floor is ≥ -0.04em. Anything tighter reads as cramped.
- **Text wrap:** Use `text-wrap: balance` on headings (h1–h3) for even line lengths; use `text-wrap: pretty` on long prose to reduce orphans.

### 3. Layout
- **Vary spacing:** Vary spacing for rhythm. Tight grouping for related elements (8–12px) and generous separation between distinct sections (48–96px).
- **Cards are lazy:** Cards are the lazy answer. Use them only when they're truly the best affordance. Nested cards are always wrong.
- **Flex vs Grid:** Flexbox for 1D, Grid for 2D. Don't default to Grid when `flex-wrap` on flex would be simpler.
- **Responsive grids:** For responsive grids without breakpoints, use `repeat(auto-fit, minmax(280px, 1fr))`.
- **z-index scale:** Build a semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip). Never arbitrary values like 999 or 9999.

### 4. Motion
- **Intentional motion:** Motion should be intentional and considered part of the build, not an afterthought.
- **Performance:** Don't animate CSS layout properties unless truly needed.
- **Easing:** Ease out with exponential curves (ease-out-quart / quint / expo). No bounce, no elastic by default.
- **Reduced motion:** Reduced motion is not optional. Every animation needs a `@media (prefers-reduced-motion: reduce)` alternative (crossfade or instant transition).
- **No image zoom on hover:** Never animate `<img>` elements on hover (e.g. `scale` or `rotate`). This is a generic AI motion tell. Animate the card's background, border, or shadow instead.
- **Reveal safety:** Reveal animations must enhance an already-visible default. Don't gate content visibility on a class-triggered transition.

### 5. Interaction & Forms
- **Dropdown clipping:** Dropdowns rendered with `position: absolute` inside an `overflow: hidden` container will be clipped. Use the native `<dialog>` / popover API, `position: fixed`, or a portal.
