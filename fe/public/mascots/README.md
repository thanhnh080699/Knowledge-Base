# Scout / page-mascot

## Current: Cat

The homepage uses the original cat-directions.webp and cat-reactions.webp from https://koboyo.com/page-mascot/mascots/. Desktop retains the original 3×3 sheets without cropping. Mobile uses 780×780 WebP derivatives (quality 78, alpha quality 85), preserving all nine cells. Only the direction atlas loads initially; the reaction atlas loads and decodes on the first interaction. The local adapter supports cursor tracking, click reactions, page pause and reduced motion. MIT license retained alongside these assets. Linh and Scout notes below are historical.

Original sprite sheets: https://koboyo.com/page-mascot/mascots/scout-directions.webp and scout-reactions.webp.
Project: https://github.com/nilbuild/page-mascot
Copyright (c) 2026 Kamran Ahmed. MIT license retained in LICENSE.page-mascot.txt.

The local controller adapts the original nine-direction cursor tracking and click reactions to share behavior between Next.js and the static preview, and adds page-wide pause, reduced-motion, tab visibility and viewport handling.

Scout is a preview character, not an original commissioned site mascot.

## Linh (current homepage preview)

The homepage now uses an original ImageGen illustration of a clearly adult woman in an emerald bikini, in a polished 3D illustration style. The nine-cell atlas supplies head directions; click returns to the smiling center cell with a brief squash animation. It does not claim nine distinct reaction expressions.

Current display: CSS frames each original atlas cell from the neck up, retaining the same face/hair and cursor tracking. The body is outside the visible frame. The desktop mascot returns to a 230px square, stays anchored at the right edge of the hero, and has no platform underneath.

Generated with the built-in ImageGen tool. Final optimized asset: `linh-directions.webp`. The Scout files and upstream MIT license are retained for provenance of the earlier preview and adapted controller.

Generation brief: transparent 3×3 sprite atlas of the same mature adult woman, emerald bikini, dark wavy hair, front-facing body from head to mid-thigh. Nine head/gaze directions, same size and position in each cell, relaxed standing pose, no background or text. A cleanup pass requests empty alpha, no stray colored fragments and precise equal-cell alignment.
