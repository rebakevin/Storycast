# StoryCast

StoryCast retells classic stories (starting with *Romeo & Juliet*) as chapters, film and audio, with captions and
transcripts so every reader and listener can follow along.

Plain HTML and Sass, no framework. Design reference: `design/`, site map: `docs/ia.md`.

## Run the app

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
  pages/              home, story, about
  components/         each component: name.html + _name.scss side by side
    layout/           site-header, site-footer
    ui/               text-link
    home/             hero, featured-stories, story-card, story-card-soon, access-callout
  styles-config/      shared Sass: tokens/, base/, main.scss
scripts/
  build.js            bundles src/ into index.html (no libraries)
  router.js           runs in the browser, shows one page at a time via the URL hash
```

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

## Conventions

- Class names follow BEM (`story-card__title`, `story-card--available`).
- Use tokens from `styles-config/tokens/` instead of hardcoded colors or spacing.
- Meet WCAG 2.1 AA: visible focus, keyboard support, captions and transcripts for any audio/video.
