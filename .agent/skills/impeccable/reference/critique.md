# Critique reference

Resolve one stable target, run two independent assessments, synthesize a design critique, persist a snapshot, and ask the user what to improve next. The chat response is the primary deliverable; the snapshot is an archive/backlog for future commands.

## Setup

1. **Resolve the target** to a concrete file path or URL.
2. **Compute the slug** using the critique-storage script if available.
3. Read ignore lists if any exist.

## Assessment Orchestration

Perform two separate assessments:

### Assessment A: Design Review
Evaluate:
- **AI slop**: Check all DON'T guidance from the parent Impeccable skill.
- **Holistic design**: hierarchy, emotional fit, composition, typography, color, accessibility.
- **Cognitive load**: Assess decision points and options.
- **Emotional journey**: reassurance at high-stakes moments.
- **Nielsen heuristics**: Score all 10 heuristics 0-4.

### Assessment B: Detector + Browser Evidence
Run the CLI detector or browser visualization if available.
- Pass markup files/directories as targets.

## Generate Combined Critique Report

Synthesize both assessments into a single report. Do NOT simply concatenate.

### Report Structure:

#### Design Health Score
Present the Nielsen's 10 heuristics scores as a table:

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | ? | [specific finding or "n/a" if solid] |
| 2 | Match System / Real World | ? | |
| 3 | User Control and Freedom | ? | |
| 4 | Consistency and Standards | ? | |
| 5 | Error Prevention | ? | |
| 6 | Recognition Rather Than Recall | ? | |
| 7 | Flexibility and Efficiency | ? | |
| 8 | Aesthetic and Minimalist Design | ? | |
| 9 | Error Recovery | ? | |
| 10 | Help and Documentation | ? | |
| **Total** | | **??/40** | **[Rating band]** |

#### Anti-Patterns Verdict
Does this look AI-generated?
- **LLM assessment**: Your own evaluation of AI slop tells.
- **Deterministic scan**: Summarize what the automated detector found.

#### Overall Impression
A brief gut reaction: what works, what doesn't, and the single biggest opportunity.

#### What's Working
Highlight 2-3 things done well.

#### Priority Issues
The 3-5 most impactful design problems, ordered by importance. Tag with **P0-P3 severity**.

#### Persona Red Flags
Test against typical personas (Alex, Jordan, etc.) and write specific red flags found.

#### Minor Observations
Quick notes on smaller issues worth addressing.

#### Questions to Consider
Provocative questions that might unlock better solutions.
