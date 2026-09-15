# Tangent Systems — Build 02

Static, dependency-free geometry tool. Serve `dist` with an HTTP server supporting JavaScript modules.

## Current scope

- Separate Shape Interpreter and System Line Organizer tools.
- Built-in polygons and SVG import for closed `<polygon>`, closed `<polyline>`, unrounded `<rect>`, and closed straight `M/L/H/V/Z` paths.
- Each supported closed element becomes a separately selectable source polygon.
- Consecutive duplicate points and a repeated closing point are removed before classification.
- Imported model coordinates remain unchanged. A separate fit transform centers the model inside the 820 × 720 display workspace.
- Radius limits and increments adapt to the source span and remain in source coordinate units.
- Convex, concave, selected-anchor, wrap, lock, deterministic variation, and construction controls.
- Interior-biased connection network, circle tangents, dashed center lines, layer toggles, and seeded arrangements.
- Undo and redo for geometry, source, line-system, and visibility controls.
- Active-tool SVG export in original source coordinates. Shape export contains the interpreted outline. Line-system export follows its visible layer settings.

## SVG boundaries

Build 02 accepts straight closed linework. Curved path commands, open paths, rounded rectangles, `<use>`, and non-polygon primitives are reported or ignored. SVG coordinates are preserved, but this build does not infer physical units such as millimeters from page metadata. DXF/DWG import, durable projects, named iterations, AI scoring, and composition handoff remain future milestones.

## Validation

Run:

- `node tests/geometry.test.mjs`
- `node tests/network.test.mjs`
- `node tests/svg-io.test.mjs`
- `node tests/app.test.mjs`

The checks cover analytic tangent conditions, repeatability, connection limits, interior preference, straight SVG parsing, transforms, large coordinates, fitting, exports, tool tabs, and undo/redo. Live browser validation is not included.
