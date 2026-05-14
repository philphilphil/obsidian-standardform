# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Obsidian community plugin that registers a markdown code-block processor for the `standardform` language and renders the block as an HTML table — used for logical/philosophical argument reconstructions (premises, conclusion dividers, inference principles).

## Commands

- `make dev` (or `npm run dev`) — esbuild watch build, emits `main.js` in the repo root with inline sourcemaps.
- `make build` (or `npm run build`) — typecheck (`tsc -noEmit -skipLibCheck`) then production esbuild (minified, no sourcemaps).
- `make release` — guards on clean tree + unused tag, then pushes HEAD and tags `<manifest.version>`. The push of the tag triggers `.github/workflows/release.yml`, which rebuilds, attests, and publishes a GitHub release with `main.js`, `manifest.json`, `styles.css`. The workflow fails the build if the tag does not exactly match `manifest.json`'s `version`, so bump the manifest before tagging.
- `npm version <patch|minor|major>` runs `version-bump.mjs`, which writes the new version into `manifest.json` and adds an entry to `versions.json` mapping the new version → existing `minAppVersion`.

- `make test` (or `npm test`) — runs the Vitest suite under happy-dom. `npm run test:watch` for watch mode. Tests live in `test/` and import the plugin sources directly; `obsidian` is aliased to a thin mock (`test/__mocks__/obsidian.ts`) and the Obsidian-specific `createEl` / `createDiv` HTMLElement helpers are polyfilled in `test/setup.ts`.

`tabletest.html` is a static HTML sandbox for eyeballing the table styling outside of Obsidian.

## Architecture

Entry point `src/main.ts` registers a single markdown code-block processor (`registerMarkdownCodeBlockProcessor("standardform", …)`). The pipeline is:

1. **`StandardFormParser`** (`src/StandardFormParser.ts`) — line-based parser. Two regexes drive everything:
   - `dividerPattern` (`(--|==)\s*(.*?)\s*(?:--|==)`) matches conclusion dividers, optionally with inline text (e.g. `-- MP (1,2) --`). Bare `--` / `==` are special-cased before the regex runs.
   - `premissePattern` (`(.*?(?<!\\)[.:])?\s*(.*)`) splits a line into an optional label ending in `.` or `:` (negative lookbehind allows `\.` / `\:` escapes inside the body) and the remaining text. If only the label group matches, the parser treats the whole thing as label-less text — this is the branch that lets unlabeled lines like `if p, then q` work.
2. **`StandardFormConstruction`** (`src/StandardFormConstruction.ts`) — flat ordered list of `Element` instances (`Argument` for premise/conclusion rows, `ConclusionDivider` for the horizontal rules). `DividerType` enum distinguishes single/double line, with/without inline text. Class hierarchy is deliberately loose (see comment in file).
3. **`StandardFormElement`** (`src/StandardFormElement.ts`) — `MarkdownRenderChild` that builds a `<table>`. Key behaviors:
   - The label column is only emitted if at least one element has a non-empty label (`anyLabel` check) — keeps unlabeled blocks visually tight.
   - Escape unwrapping (`\.` → `.`, `\:` → `:`) happens here at render time, not in the parser.
   - Divider rendering branches on `DividerType` and emits a div with one of the CSS classes from `styles.css` (`conclusionLong`, `conclusionDouble`, `conclusionText`, `conclusionDoubleText`).

Styling lives in `styles.css` at the repo root (Obsidian loads it automatically alongside `main.js`). Dark-mode compatibility depends on using theme CSS variables for colors — see commit `b56c3a2` for the precedent.

## Syntax notes worth remembering

- Identifier/label must end with `.` or `:` (`P1.`, `C:`, `IC:`). Backslash-escape (`\.`, `\:`) to use these punctuation marks inside premise text.
- `--` / `-- text --` = single horizontal rule (deductive). `==` / `== text ==` = double rule (inductive).
- Unrecognized lines are logged to console and silently dropped.
