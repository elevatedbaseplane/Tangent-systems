# Tangent Systems — Build 04

Static geometry tool for tangent shapes and independent line systems. Edit the application in `src/`. LibreDWG lives in `vendor/` and is only used to decode DWG files in the browser. `dist/` is the generated copy that gets deployed.

## Current scope

- Separate Shape Interpreter and System Line Organizer tools.
- Built-in Fold, Notch, and Triangle polygons.
- SVG import for closed `<polygon>`, closed `<polyline>`, unrounded `<rect>`, and closed straight `M/L/H/V/Z` paths. Each supported closed element is collected, and the largest polygon is used.
- DXF import for closed `POLYLINE` and `LWPOLYLINE` entities.
- DWG import decoded locally in the browser with LibreDWG.
- SVG and DXF export in original source coordinates. DWG export stays unavailable because it needs a licensed DWG writer.
- Convex, concave, selected-anchor, wrap, lock, seeded variation, and batch iteration controls.
- Independent tangent-line and center-line fields, with layer visibility and routing bias.
- Boards, saved iterations, comparison, selection sets, and generation presets stored in this browser.
- Selected iterations can be exported as an SVG package or sent to Overlap Editor.
- Undo and redo for geometry, source, line-system, and visibility controls.
- Light, dark, and neo display modes.

Imported model coordinates stay unchanged. A separate fit transform centers the model in the 820 × 720 display workspace. Radius limits and increments adapt to the source span and remain in source coordinate units.

## SVG boundaries

Build 04 accepts straight closed linework. Curved path commands, open paths, rounded rectangles, `<use>`, and non-polygon primitives are reported or ignored. SVG coordinates are preserved. This build does not infer physical units such as millimeters from page metadata.

## Where to edit

| Path | Role |
|---|---|
| `src/` | Application HTML, CSS, and modules. This is the source to edit. |
| `vendor/` | LibreDWG web bindings, WASM, and GPL license. Do not edit these files. |
| `dist/` | Generated site. Recreate it with `npm run build`. Do not edit it by hand. |
| `tests/` | Node tests. They import `src/`. |

Module imports inside `src/` are unchanged. `app.mjs` still loads `./vendor/dist/libredwg-web.js`, and that file still loads the WASM beside it. Those paths resolve in `dist/` after a build, and in local development through `npm run dev`.

## Local development

From this directory:

```powershell
npm test
npm run dev
```

`npm run dev` serves `src/` at `/` and `vendor/` at `/vendor/` on `http://127.0.0.1:8080/`. Open that URL. Opening `src/index.html` as a file, or serving only the `src/` folder, will not load the DWG decoder.

There are no application dependencies to install.

## Build and deployment

```powershell
npm run build
npm run check
```

`npm run build` clears `dist/`, copies `src/` into it, and copies `vendor/` to `dist/vendor/`. The published file layout stays the same as before this split. `npm run check` rebuilds into a temporary folder and fails if the committed `dist/` differs.

GitHub Pages uses `.github/workflows/static.yml`. On each push to `main` it checks out the repo, runs `node scripts/build.mjs`, and uploads `./dist`. The static host configured in `.openai/hosting.json` also serves `dist/`, and that directory stays in git because the host does not run a build. After changing `src/` or `vendor/`, run `npm run build` and commit the updated `dist/` with the source change.

## Validation

`npm test` runs:

- `node tests/geometry.test.mjs`
- `node tests/network.test.mjs`
- `node tests/svg-io.test.mjs`
- `node tests/dxf-io.test.mjs`
- `node tests/app.test.mjs`

The checks cover analytic tangent conditions, repeatability, connection limits, interior preference, straight SVG parsing, DXF parsing, transforms, large coordinates, fitting, exports, tool tabs, and undo/redo. They do not open a browser.
