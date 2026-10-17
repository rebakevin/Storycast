# Developer guide

See the [README](README.md) for an overview of the app.

## Setup

Requires Node 18+.

```sh
npm install      # once
npm run build    # Sass -> css/main.css, components -> index.html
npm run watch    # recompile Sass on save
```

`index.html` and `css/main.css` are generated and committed. Edit the sources in `src/` and `sass/`, run
`npm run build`, and commit the output.

## Structure

```
.
├── index.html                  built site (generated)
├── css/                        compiled styles (generated)
├── sass/                       Sass source: tokens/, base/, main.scss
├── assets/                     audio (.mp3) and transcripts (.vtt)
├── src/
│   ├── main.html               template: head, header, pages, footer
│   ├── pages/                  one folder per page, each with an index.html
│   │   ├── home/
│   │   ├── stories/
│   │   ├── about/
│   │   └── story/              one folder per story, each with its chapters
│   │       ├── romeo-and-juliet/
│   │       ├── the-odyssey/
│   │       └── the-great-gatsby/
│   └── components/             flat: one folder per page or area, no nesting
│       ├── layout/             shared: header, footer
│       ├── ui/                 shared: text-link, lovers, transcripts
│       ├── home/               welcome page
│       ├── stories/            story library and cards
│       ├── story/              shared by every story: story-hero, story-media, world,
│       │                       characters, chapter-hero, moment, chapter-next
│       ├── romeo-and-juliet/   content that belongs to one story
│       ├── the-odyssey/
│       └── the-great-gatsby/
└── scripts/
    ├── build.js                bundles src/ into index.html (no libraries)
    ├── router.js               shows one page at a time via the URL hash
    ├── story-media.js          Watch/Listen/Read tabs and the synced transcript
    ├── clean-vtt.js            cleans a YouTube auto-caption .vtt
    └── yt-transcript.sh        downloads YouTube captions with yt-dlp
```

Routes: `#/home`, `#/stories`, `#/about`, `#/story/<story>` and `#/story/<story>/<chapter>`.

## Components

Each component is a pair of files: `name.html` and `_name.scss`. Include one with:

```html
<include src="components/ui/text-link.html" href="#/story" label="Read the story"></include>
```

- **Add a component:** create both files, include the HTML, and `@use` the SCSS in `sass/main.scss`.
- **Add a page:** create `src/pages/foo/index.html` with `<div data-page="foo" hidden>` and include it in
  `src/main.html`.
- **Add a story:** copy an existing story in `src/pages/story/` and `src/components/`, add its `.mp3` and `.vtt` to
  `assets/`, and add a card to `components/stories/library.html`. The first chapter must be `the-story`.

## Captions

Requires [yt-dlp](https://github.com/yt-dlp/yt-dlp).

```sh
scripts/yt-transcript.sh "<youtube-url>" <story>
node scripts/clean-vtt.js assets/<story>.en.vtt assets/<story>.vtt
```

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). One-time:
set **Settings → Pages → Source** to **GitHub Actions**.

## Conventions

- BEM class names (`story-card__title`).
- Use tokens from `sass/tokens/` instead of hardcoded colours or spacing.
- Meet WCAG 2.1 AA.
