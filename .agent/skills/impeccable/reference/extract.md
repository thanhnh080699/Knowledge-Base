# Extract Flow

Identify reusable patterns, components, and design tokens, then extract and consolidate them into the design system for systematic reuse.

## Step 1: Discover the Design System

Find the design system, component library, or shared UI directory. Understand its structure: component organization, naming conventions, design token structure, import/export conventions.

**CRITICAL**: If no design system exists, ask the user before creating one. Understand the preferred location and structure first.

## Step 2: Identify Patterns

Look for extraction opportunities in the target area:

- **Repeated components**: Similar UI patterns used 3+ times (buttons, cards, inputs)
- **Hard-coded values**: Colors, spacing, typography, shadows that should be tokens
- **Inconsistent variations**: Multiple implementations of the same concept
- **Composition patterns**: Layout or interaction patterns that repeat (form rows, toolbar groups, empty states)
- **Type styles**: Repeated font-size + weight + line-height combinations
- **Animation patterns**: Repeated easing, duration, or keyframe combinations

Assess value: only extract things used 3+ times with the same intent. Premature abstraction is worse than duplication.

## Step 3: Plan Extraction

Create a systematic plan:

- **Components to extract**: Which UI elements become reusable components?
- **Tokens to create**: Which hard-coded values become design tokens?
- **Variants to support**: What variations does each component need to support? (e.g. primary, secondary, sizes, disabled states).
