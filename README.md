# Inhouse Interiors

[Open the live website](https://alesoldato.github.io/inhousedesign/)

[Open the `site-pages` live preview](https://alesoldato.github.io/inhousedesign-preview/)

The desktop site is in [`docs/`](docs/) and mirrored in [`dist/`](dist/). The original GitHub Pages site publishes `docs/` from `main`. The separate [preview repository](https://github.com/alesoldato/inhousedesign-preview) mirrors this branch and publishes its `docs/` folder, keeping the original live site unchanged.

Open `docs/index.html` through a local static server to review the branch. Example: `python3 -m http.server 4175 -d docs`.

Pages use query routes so direct links and browser history work on GitHub Pages without server rewrites:

- `?page=portfolio` with optional `&category=residential` or `&category=commercial`
- `?page=project&slug=morrow-house` (five illustrative project stories)
- `?page=services`
- `?page=service&type=residential` or `&type=commercial`
- `?page=about`
- `?page=contact`

Project names, locations, dates, text, and the new interior photographs are illustrative content for this design preview.
