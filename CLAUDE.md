# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing site for **PLM Gestión Inmobiliaria**, a Chilean real estate agency (property brokerage, appraisals, and remodeling). Spanish-language, no backend, no build step, no framework — plain HTML/CSS/JS served as-is. This directory is not a git repository.

## Running it

There is no build/test/lint tooling (no `package.json`). To preview changes, serve the directory statically and open `index.html`, e.g.:

```
python3 -m http.server 8000
```

Opening `index.html` directly via `file://` also works since there are no ES modules — all scripts are classic `<script>` tags.

## File map

- `index.html` — the live page. All sections (hero, properties, services, contact form, footer) live here.
- `j.html` — an older/simplified draft of `index.html` (no filter bar, less markup). Not linked from anywhere; treat as legacy reference, not a page to edit in parallel with `index.html`.
- `style.css` — single stylesheet for the whole site, organized in banner-commented sections in this order: theme variables → base/reset → glassmorphism helpers → top bar → navbar → hamburger menu → hero → carousel dots → shared section styles → filters → property grid/cards → services → "why us" → footer → floating WhatsApp button → tooltip → property modal → animations/media queries → contact form → floating AI agent widget. Grep for the `/* ... */` banner comments to jump to a section rather than scanning line by line.
- `script.js` — main site behavior, wrapped in a single `DOMContentLoaded` listener, numbered by section comment (`// 1. ...` through `// 11. ...`): UF/Dollar indicator fetch, mobile menu, hero carousel, hero CTA buttons, service-card WhatsApp deep links, the in-file `propiedades` array (property listings data), grid rendering, filter/search/sort logic, and the property detail modal.
- `agent.js` — floating chat widget ("Bruno"), IIFE-wrapped, DOM built via template string and injected on load.
- `algarobo/` — property photo assets (note the folder name drops the second "r" vs. "algarrobo" used in some `<img>` paths/filenames elsewhere — this inconsistency is intentional-looking but easy to typo when adding a new property).
- Root-level `.jpg`/`.png` files are additional property/brand images referenced directly by path from `index.html`/`script.js`.

## Architecture notes

- **No modules, no bundler.** Cross-file communication happens purely through the DOM and global `window`/`document` state. `script.js` and `agent.js` are independent IIFEs/listeners that both query the same DOM (e.g. both read `#uf-value`/`#dolar-value`).
- **Two separate property datasets.** The property listings shown in the grid (`propiedades` in `script.js`, 11 entries with images/links/long descriptions) and the ones the chat agent knows about (`propiedadesDB` in `agent.js`, 11 entries, shorter fields) are hand-duplicated, not shared. When adding/editing a property, update both arrays or the chat agent will describe stale listings.
- **`agent.js` is currently broken.** `getBotResponse` calls reference `KB`, `DEFAULT_RESPONSE`, and iterate `for (const entry of KB)` (around [agent.js:38-48](agent.js#L38-L48)), but none of `KB`, `getBotResponse`, or `DEFAULT_RESPONSE` are defined anywhere in the file or elsewhere in the repo. Sending a chat message will throw a `ReferenceError` at runtime. Any work on the chat widget needs to (re)build this knowledge-base/response layer.
- **Economic indicators (UF/Dólar)** are fetched client-side from the public `mindicador.cl` API on every load (`script.js`, section 1) and cached to `localStorage` (`lastUf`/`lastDol`); `index.html` has an inline `<script>` before the navbar that reads that cache synchronously so the top bar doesn't flash "Cargando..." on repeat visits.
- **WhatsApp is the primary conversion channel.** Property cards, service cards, the footer CTA, and the floating WhatsApp button all construct `https://api.whatsapp.com/send?phone=...&text=...` deep links with pre-filled, context-specific messages rather than using a contact form or backend.
- **The contact form** (`#consulta-form` in `index.html`) does not submit anywhere — its inline `<script>` at the bottom of `index.html` builds a `mailto:` link from the form fields and redirects to it.
- **Supabase JS client is loaded via CDN** (`index.html`, right after `script.js`/`agent.js`) but is not currently referenced by any code — no `createClient` call exists yet. Treat it as scaffolding for a not-yet-implemented feature, not dead code to remove without checking with the user first.
