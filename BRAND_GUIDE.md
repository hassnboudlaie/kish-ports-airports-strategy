# Visual Identity & Editing Guide

This repository hosts the standalone **Kish Ports & Airports Strategy Execution** web app.

## Official visual identity references

The interface is aligned with the public portal of **شرکت توسعه و مدیریت بنادر و فرودگاه‌های منطقه آزاد کیش**:

- Official portal: https://kishports.com/
- Official logo asset: https://kishports.com/wp-content/uploads/2023/02/kishports_main.svg
- Port icon asset: https://kishports.com/wp-content/uploads/2023/02/ships.svg
- Airport operations icon asset: https://kishports.com/wp-content/uploads/2023/02/airport_opration.svg

### Brand colors used

- Primary navy: `#1e3d6c`
- Accent / logo blue: `#24578a`
- White: `#ffffff`
- Supporting light grays and blue tints are derived for UI readability.

## Files

- `index.html` — live production version.
- `editable-source.html` — editable working copy with an editing note at the top.
- `BRAND_GUIDE.md` — this file.

## How to edit

The app is deliberately kept as a **single-file static web app**. Most visual changes can be made by editing the CSS variables under `:root` near the top of the HTML file.

Content and strategy data are also inside the same HTML file, so the source can be edited directly in GitHub without a build tool.

## Publishing workflow

1. Edit `editable-source.html`.
2. Review changes.
3. Copy the approved version to `index.html`.
4. Commit to the `main` branch.
5. GitHub Pages deploys the new version automatically.
