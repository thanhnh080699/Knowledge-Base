Space is the most underused design tool. Find the layout's actual problem (monotone spacing, weak hierarchy, identical card grids) and fix the structure, not the surface.

---

## Register

Brand: asymmetric compositions, fluid spacing with `clamp()`, intentional grid-breaking for emphasis. Rhythm through contrast: tight groupings paired with generous separations.

Product: predictable grids, consistent densities, familiar navigation patterns. Responsive behavior is structural (collapse sidebar, responsive table), not fluid typography. Consistency IS an affordance.

---

## Assess Current Layout

Analyze what's weak about the current spatial design:

1. **Spacing**:
   - Is spacing consistent or arbitrary? (Random padding/margin values)
   - Is all spacing the same? (Equal padding everywhere = no rhythm)
   - Are related elements grouped tightly, with generous space between groups?

2. **Visual hierarchy**:
   - Apply the squint test: blur your (metaphorical) eyes. Can you still identify the most important element, second most important, and clear groupings?
   - Is hierarchy achieved effectively? (Space and weight alone can be enough; is the current approach working?)
   - Does whitespace guide the eye to what matters?

3. **Grid & structure**:
   - Is there a clear underlying structure, or does the layout feel random?
   - Are identical card grids used everywhere? (Icon + heading + text, repeated endlessly)

4. **Rhythm & variety**:
   - Does the layout have visual rhythm? (Alternating tight/generous spacing)
   - Is every section structured the same way? (Monotonous repetition)
   - Are there intentional moments of surprise or emphasis?

5. **Density**:
   - Is the layout too cramped? (Not enough breathing room)
   - Is the layout too sparse? (Excessive whitespace without purpose)
   - Does density match the content type? (Data-dense UIs need tighter spacing; marketing pages need more air)

**CRITICAL**: Layout problems are often the root cause of interfaces feeling "off" even when colors and fonts are fine. Space is a design material; use it with intention.

## Plan Layout Improvements

Create a systematic plan:

- **Spacing system**: Use a consistent scale (a framework's built-in scale like Tailwind's, rem-based tokens, or a custom system). The specific values matter less than consistency.
- **Hierarchy strategy**: How will space communicate importance?
- **Layout approach**: What structure fits the content? Flex for 1D, Grid for 2D, named areas for complex page layouts.
- **Rhythm**: Where should spacing be tight vs generous?

## Improve Layout Systematically

### Establish a Spacing System

- Use a consistent spacing scale (framework scales like Tailwind, rem-based tokens, or a custom scale all work). What matters is that values come from a defined set, not arbitrary numbers.
- Prefer a 4pt base scale (4, 8, 12, 16, 24, 32, 48, 64, 96px) over 8pt; 8pt is too coarse and you'll frequently need 12px between 8 and 16.
- Name tokens semantically if using custom properties: `--space-xs` through `--space-xl`, not `--spacing-8`
- Use `gap` for sibling spacing instead of margins; eliminates margin collapse hacks
- Apply `clamp()` for fluid spacing that breathes on larger screens

### Create Visual Rhythm

- **Tight grouping** for related elements (8-12px between siblings)
- **Generous separation** between distinct sections (48-96px)
- **Varied spacing** within sections (not every row needs the same gap)
- **Asymmetric compositions**: a deliberate choice when the content invites it (not a default to chase).

### Choose the Right Layout Tool

- **Use Flexbox for 1D layouts**: Rows of items, nav bars, button groups, card contents, most component internals.
- **Use Grid for 2D layouts**: Page-level structure, dashboards, data-dense interfaces, anything where rows AND columns need coordinated control.
- Use named grid areas (`grid-template-areas`) for complex page layouts; redefine at breakpoints.
- Use **container queries** (`@container`) instead of media queries for reusable components so they adapt to their parent container rather than the screen width.
