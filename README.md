# Inhouse Interiors

[Open the live website](https://alesoldato.github.io/inhousedesign/)

The desktop site is in [`docs/`](docs/) and mirrored in [`dist/`](dist/). GitHub Pages publishes `docs/` from `main`, so the live site stays on the existing version while the new pages are reviewed on the `site-pages` branch.

Open `docs/index.html` through a local static server to review the branch. Example: `python3 -m http.server 4175 -d docs`.

Pages use query routes so direct links and browser history work on GitHub Pages without server rewrites:

- `?page=portfolio` with optional `&category=residential` or `&category=commercial`
- `?page=project&slug=morrow-house` (five illustrative project stories)
- `?page=services`
- `?page=service&type=residential` or `&type=commercial`
- `?page=about`
- `?page=contact`

Project names, locations, dates, text, and the new interior photographs are illustrative content for this design preview.
