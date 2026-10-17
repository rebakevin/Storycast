# StoryCast

StoryCast retells classic stories (starting with *Romeo & Juliet*) as chapters, film and audio, with captions and
transcripts so every reader and listener can follow along.

Plain HTML and Sass, no framework. Design reference: `design/`, site map: `docs/sitemap.md`, content structure: `docs/ia.md`.

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
| `css/main.css` | `sass/`, `src/components/**/_*.scss`            |

Changes to these files are overwritten on the next build. Edit the sources in `src/`, run `npm run build`, and commit
the output.

## Structure

```
index.html            built site (generated)
css/                  compiled styles (generated)
sass/                 Sass source: tokens/, base/, main.scss
assets/               audio (.mp3) and transcripts (.vtt)
src/
  main.html           template: head, header, pages, footer
  pages/              one folder per page, each with an index.html
    home/  stories/  about/
    story/            one folder per story, each with its chapters:
      romeo-and-juliet/  the-story/  the-journey/  the-tragedy/
      the-odyssey/       the-story/  wrong-turns/  circe-and-the-dead/  deadly-waters/  the-return/
      the-great-gatsby/  the-story/  the-summer/  the-reckoning/
  components/         flat: one folder per page or area, no nesting
    layout/  ui/      shared: header, footer, text-link, lovers, transcripts
    home/  stories/   welcome page, story library and cards
    story/            shared by every story: story-hero, story-media, world, characters,
                      chapter-hero, moment, chapter-header styles, chapter-next
    romeo-and-juliet/  the-odyssey/  the-great-gatsby/   content that belongs to one story
scripts/
  build.js            bundles src/ into index.html (no libraries)
  router.js           runs in the browser, shows one page at a time via the URL hash
  story-media.js      Watch/Listen/Read tabs and the synced transcript
  clean-vtt.js        cleans a YouTube auto-caption .vtt
  yt-transcript.sh    downloads YouTube captions with yt-dlp
```

Routes: `#/home`, `#/stories`, `#/about`, and for each story `#/story/<story>` (opens its `the-story` page) and
`#/story/<story>/<chapter>`. Each story also has `#/story/<story>/text-transcripts`, its full transcript as plain
paragraphs on its own page (linked from the transcript box, not listed in the chapter menu).

## Components

Every component is a pair of files in the same folder: `hero.html` and `_hero.scss`.

Include a component with an `<include>` tag. Paths are relative to `src/`:

```html

<include src="components/ui/text-link.html" href="#/story" label="Read the story"></include>
```

Attributes fill `{{ href }}`-style placeholders inside the component. Pages and components can include other components.

To add a component: create `name.html` and `_name.scss` in a components folder, include the HTML where it is used, and
`@use` the SCSS in `sass/main.scss`.

To add a page: create `src/pages/foo/index.html` with a `<div data-page="foo" hidden>`, include it in `src/main.html`, and
link to `#/foo`. Pages only compose components, so they have no SCSS of their own.

### Add a story

1. Put the audio in `assets/<story>.mp3` and the captions in `assets/<story>.vtt` (see *Media* below).
2. Create `src/pages/story/<story>/index.html` (a `data-page="story/<story>"` wrapper that includes the header and each
   chapter) and one `index.html` per chapter folder, named `story/<story>/<chapter>`. Copy an existing story. The first
   chapter must be `the-story`: it is what opens when the story is chosen.
3. Create `src/components/<story>/` with the story's `chapter-header.html`, `characters.html` and one component per chapter,
   reusing the shared pieces in `components/story/`.
4. Include the story page in `src/main.html`, add a card to `components/stories/library.html`, and `@use` any new SCSS
   in `sass/main.scss`.

The chapter header lists every chapter. With more than three, put the extras inside the `<details class="chapter-menu">`
(see `components/the-odyssey/chapter-header.html`) and they appear under a "More chapters" dropdown.

Use tokens from `sass/tokens` in component styles: `@use 'sass/tokens' as *;`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

One-time setup: in the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.

## Media

Each story's page offers three ways in (Watch, Listen, Read), built by `src/components/story/story-media.html`:

- **Watch** embeds the YouTube video.
- **Listen** plays `assets/<story>.mp3`.
- **Read** is a written summary.

Watch and Listen share the transcript `assets/<story>.vtt`. It is written into `index.html` at build time, as timed lines
(and as plain paragraphs on the `text-transcripts` page), and `scripts/story-media.js` highlights
the line being played. The YouTube embed needs the site served over http (see
`npx serve .` above), not opened as a file. The Tragedy chapter of Romeo & Juliet still expects `assets/finale.mp3`, which
is not in the repo yet.

### Download captions from YouTube

Requires [yt-dlp](https://github.com/yt-dlp/yt-dlp) (`brew install yt-dlp`). Run from the project root:

```sh
scripts/yt-transcript.sh "<youtube-url>" [output-name] [lang]

scripts/yt-transcript.sh "https://www.youtube.com/watch?v=VIDEO_ID" the-odyssey
```

It saves `assets/<output-name>.<lang>.vtt` (language defaults to `en`). Manual captions are preferred, with
auto-generated ones as a fallback. Auto-generated files repeat lines, so clean the result and review it before publishing:

```sh
node scripts/clean-vtt.js assets/the-odyssey.en.vtt assets/the-odyssey.vtt
```

## Conventions

- Class names follow BEM (`story-card__title`, `story-card--available`).
- Use tokens from `sass/tokens/` instead of hardcoded colors or spacing.
- Meet WCAG 2.1 AA: visible focus, keyboard support, captions and transcripts for any audio/video.
