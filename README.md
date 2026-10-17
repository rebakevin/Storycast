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
  story-media.js      Watch/Listen/Read tabs and the synced transcript
  clean-vtt.js        cleans a YouTube auto-caption .vtt
  yt-transcript.sh    downloads YouTube captions with yt-dlp
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

The story page has three ways in (Watch, Listen, Read), built in `src/components/the-story/story-media.html`:

- **Watch** embeds the YouTube video (`dRrvQ1vZxcg`).
- **Listen** plays `media/romeo-and-juliet.mp3`.
- **Read** is a written summary.

Watch and Listen share the transcript `media/romeo-and-juliet.vtt`. It is written into `index.html` at build time and
`scripts/story-media.js` highlights the line being played. The YouTube embed needs the site served over http (see
`npx serve .` above), not opened as a file. The Tragedy chapter still expects `media/finale.mp3`, which is not in the repo
yet.

### Download captions from YouTube

Requires [yt-dlp](https://github.com/yt-dlp/yt-dlp) (`brew install yt-dlp`). Run from the project root:

```sh
scripts/yt-transcript.sh "<youtube-url>" [output-name] [lang]

scripts/yt-transcript.sh "https://www.youtube.com/watch?v=VIDEO_ID" verona
```

It saves `media/<output-name>.<lang>.vtt` (language defaults to `en`). Manual captions are preferred, with
auto-generated ones as a fallback. Auto-generated files repeat lines, so clean the result and review it before publishing:

```sh
node scripts/clean-vtt.js media/romeo-and-juliet.en.vtt media/romeo-and-juliet.vtt
```

## Conventions

- Class names follow BEM (`story-card__title`, `story-card--available`).
- Use tokens from `styles-config/tokens/` instead of hardcoded colors or spacing.
- Meet WCAG 2.1 AA: visible focus, keyboard support, captions and transcripts for any audio/video.
