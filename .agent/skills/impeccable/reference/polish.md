# Polish Flow

Perform a meticulous final pass to catch all the small details that separate good work from great work. The difference between shipped and polished.

## Design System Discovery

Aligning the feature to the design system is **not optional**. Polish without alignment is decoration on top of drift.

1. **Find the design system**: Search for design system documentation, component libraries, style guides, or token definitions.
2. **Note the conventions**: How are shared components imported? What spacing scale is used? Which colors come from tokens vs hard-coded values?
3. **Identify drift, then name the root cause**: For every deviation, classify it as a **missing token**, a **one-off implementation**, or a **conceptual misalignment**.

## Pre-Polish Assessment

Understand the current state and goals before touching anything:

1. **Review completeness**: Functional completeness, known issues, quality bar, and timeline.
2. **Think experience-first**: Who actually uses this? Walk the path from their perspective.
3. **Identify polish areas**: Spacing, alignment, interaction states, edge cases, error states, and transitions.

## Polish Systematically

Work through these dimensions methodically:

### Visual Alignment & Spacing

- **Pixel-perfect alignment**: Everything lines up to the grid.
- **Consistent spacing**: All gaps use a spacing scale (no random values).
- **Optical alignment**: Adjust for visual weight (e.g., icons may need offset for optical centering).
- **Responsive consistency**: Spacing and alignment work at all breakpoints.

### Information Architecture & Flow

Visual polish on a misshapen flow is wasted work. Match the *shape* of the experience to the system, not just the surface.

- **Progressive disclosure**: Match how much is revealed compared to neighboring features.
- **Established user flows**: Multi-step actions follow the same shape as comparable flows elsewhere.
- **Hierarchy & complexity**: The same conceptual weight gets the same visual weight throughout.
- **Transitions**: How does the UI transit between empty, loading, and populated states? Ensure smooth state changes.
