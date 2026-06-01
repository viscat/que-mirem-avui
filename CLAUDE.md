# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**¿Qué Vemos Hoy?** ("What Do We Watch Today?") is a printable card game for two players. The repository contains static HTML pages that render game components for printing, with card data stored in JSON files.

## Running the Project

Requires a local HTTP server because the HTML pages use `fetch()` to load JSON and images:

```bash
# Simple Python server (serves on http://localhost:8000)
python -m http.server

# Or via Docker (serves on http://localhost:8081)
docker compose up
```

There is no build step, no package manager, and no test suite. All pages are plain HTML + vanilla JavaScript.

## Architecture

All files live in `www/`. The entry point is `index.html`, which links to the other pages.

### Data files (JSON)

Card content is split into language-specific files:

- `proposals.es.json` — 40 movie/TV proposal cards with fields: `title`, `type` (`"Movie"` or `"TV"`), `genre`, `duration` (`"Short"`, `"Medium"`, `"Long"`), `stars` (1–5), `original_language`
- `objectives.es.json` — Objective cards with `description` and `points`
- `specials.es.json` — Special action cards with `title`, `effect`, `cost`, and optional `fixed: true` for the two always-available actions

Translation/label files (`es.json`, `en.json`, `ca.json`) map UI string keys to their localized values (e.g. `"proposta"`, `"objectiu"`, `"punt"`).

### HTML pages

| File | Purpose |
|---|---|
| `index.html` | Navigation hub |
| `cards.html` | Renders all cards (proposals, objectives, specials) with fronts and backs for duplex printing |
| `rules.html` | Full rulebook |
| `popcorn.html` | Popcorn token sheets (in-game currency) |
| `likes.html` | Like/Dislike voting token sheets (values −3 to +3) |
| `likes_no_number.html` | Like/Dislike tokens without printed values |

### Rendering pattern in `cards.html`

`cards.html` follows a consistent pattern:

1. Load translations via `loadTranslations(language)`, then load the three data JSONs in parallel with `Promise.all`.
2. Call `renderSectionWithBacks(data, tipo, renderFunc, containerId)` for each card type, which:
   - Maps each item through a `create*Card()` function to produce a DOM element
   - Splits cards into pages of N (8 for proposals/specials, 9 for objectives)
   - Alternates front pages and back pages so the sheet can be printed duplex
3. Back pages are mirrored (right-justified via `.back-page`) so they align correctly when flipped.

The language is hardcoded to `"es"` at the top of `init()` in `cards.html`. Filenames follow the pattern `proposals.es.json`, `objectives.es.json`, `specials.es.json`.

### Card dimensions (for CSS)

- Proposal cards: 90mm × 60mm (landscape)
- Objective cards: 60mm × 90mm (portrait)
- Special cards: 90mm × 60mm (landscape)

## Key Conventions

- **Adding new cards**: Add entries to the appropriate `*.es.json` file following the existing field structure. Cards appear automatically on the next page load.
- **New languages**: Create `proposals.XX.json`, `objectives.XX.json`, `specials.XX.json`, and a translation file `XX.json`, then change the `language` constant in `cards.html`.
- **Fixed special cards**: Set `"fixed": true` in `specials.es.json`. Fixed cards use a distinct purple cost badge and are always available during play regardless of which 8 cards are dealt.
- **Printing**: Pages use `@media print` rules to hide navigation headers. Users should enable "Background graphics" in browser print settings and select portrait layout.
