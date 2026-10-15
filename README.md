# StoryCast

StoryCast retells classic stories (starting with *Romeo & Juliet*) as chapters, film and audio, with captions and
transcripts so every reader and listener can follow along.

Plain HTML and Sass, no framework. Design reference: `design/`, site map: `docs/ia.md`.

## Run the app

Live site: https://rebakevin.github.io/Storycast/

Or run it locally:

`index.html` and `css/main.css` are generated and committed, so no build is needed to view the site.

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

## Develop

Requires Node 18+.

```sh
npm install          # once
npm run build        # Sass -> css/main.css, components -> index.html
npm run watch        # recompile Sass on save
```

### Auto-generated files (do not edit by hand)

| File           | Generated from                                   |
|----------------|--------------------------------------------------|
| `index.html`   | `src/main.html`, `src/pages/`, `src/components/` |
| `css/main.css` | `src/styles-config/`                             |

Changes to these files are overwritten on the next build. Edit the sources in `src/`, run `npm run build`, and commit
the output.

## Structure

```
src/
  main.html           template: head, header, pages, footer
  pages/              one folder per page, each with an index.html
    home/  about/
    story/            the-story/  the-journey/  the-tragedy/  (chapters)
  components/         flat: one folder per page or area, no nesting
    layout/  ui/      shared: header, footer, text-link, lovers, transcript
    home/  about/  story/  the-story/  the-journey/  the-tragedy/
  styles-config/      shared Sass: tokens/, base/, main.scss
media/                video, audio and caption files
scripts/
  build.js            bundles src/ into index.html (no libraries)
  router.js           runs in the browser, shows one page at a time via the URL hash
```

Routes: `#/home`, `#/story` (opens `#/story/the-story`), `#/story/the-journey`, `#/story/the-tragedy`, `#/about`.

## Components

Every component is a pair of files in the same folder: `hero.html` and `_hero.scss`.

Include a component with an `<include>` tag. Paths are relative to `src/`:

```html

<include src="components/ui/text-link.html" href="#/story" label="Read the story"></include>
```

Attributes fill `{{ href }}`-style placeholders inside the component. Pages and components can include other components.

To add a component: create `name.html` and `_name.scss` in a components folder, include the HTML where it is used, and
`@use` the SCSS in `src/styles-config/main.scss`.

To add a page: create `src/pages/foo.html` with a `<div data-page="foo" hidden>`, include it in `src/main.html`, and
link to `#/foo`. Pages only compose components, so they have no SCSS of their own.

Use tokens from `styles-config/tokens` in component styles: `@use 'styles-config/tokens' as *;`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

One-time setup: in the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.

## Media

The story page expects `media/verona.mp4` and `media/finale.mp3`, which are not in the repo yet. Captions live in `media/verona.vtt`; transcripts are in the page content.

## Conventions

- Class names follow BEM (`story-card__title`, `story-card--available`).
- Use tokens from `styles-config/tokens/` instead of hardcoded colors or spacing.
- Meet WCAG 2.1 AA: visible focus, keyboard support, captions and transcripts for any audio/video.
