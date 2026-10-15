# StoryCast

StoryCast retells classic stories (starting with *Romeo & Juliet*) as chapters, film and audio, with captions and transcripts so every reader and listener can follow along.

Plain HTML and Sass, no framework. Design reference: `design/`, site map: `docs/ia.md`.

## Run the app

`css/main.css` is committed, so no build is needed to view the site.

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

## Develop

Requires Node 18+.

```sh
npm install        # once
npm run watch      # recompile Sass on save
npm run build      # one-off compile to css/main.css
```

Never edit `css/main.css` by hand; commit the rebuilt file with your Sass changes.

## Structure

```
index.html
css/main.css          compiled output
src/styles/
  main.scss           entry point, only @use lines
  tokens/             colors, typography, spacing
  base/               reset, accessibility
  layout/             header, footer
  components/         reusable pieces (text-link, story-card, ...)
  sections/           page sections (hero, featured stories, ...)
```

To add a style, create a partial in the right folder (e.g. `components/_foo.scss`), then `@use` it in `main.scss`.

## Conventions

- Class names follow BEM (`story-card__title`, `story-card--available`).
- Use tokens from `tokens/` instead of hardcoded colors or spacing.
- Meet WCAG 2.1 AA: visible focus, keyboard support, captions and transcripts for any audio/video.
