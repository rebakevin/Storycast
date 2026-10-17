# StoryCast

StoryCast retells classic stories as chapters, film and audio. It currently features *Romeo & Juliet*, *The Odyssey*
and *The Great Gatsby*, with more to come. Every story can be watched, listened to or read, with captions and
transcripts so everyone can follow along.

## How to run the app

- **Live site:** https://rebakevin.github.io/Storycast/
- **Locally:** open `index.html` at the root in a browser. No build is needed.
- **Developers:** serve the folder (the YouTube embed needs http, not a file):

  ```sh
  npx serve .
  ```

  More in [DEVELOPER.md](DEVELOPER.md).

## Tech stack

| Area      | Used                              |
|-----------|-----------------------------------|
| Markup    | HTML                              |
| Styles    | Sass (compiled to `css/main.css`) |
| Behaviour | Vanilla JavaScript                |
| Build     | Node script (`scripts/build.js`)  |
| Hosting   | GitHub Pages (GitHub Actions)     |

## Project structure

```
.
├── index.html   built site (generated)
├── css/         compiled styles (generated)
├── sass/        Sass source and design tokens
├── assets/      audio (.mp3) and transcripts (.vtt)
├── src/         page and component source
├── scripts/     build, router and media scripts
├── design/      design reference
└── Storycast – Technical Documentation.pdf   site map, IA and mockups
```

## Accessibility checklist

- [x] Meets WCAG 2.1 AA as the target
- [x] Semantic HTML with `lang="en"` and a "Skip to content" link
- [x] Full keyboard support, including the Watch/Listen/Read tabs
- [x] Visible focus styles on all interactive elements
- [x] Page changes are announced to assistive technologies
- [x] Captions and transcripts for all audio and video
- [x] Responsive layout that works on mobile, tablet and desktop
- [x] Reduced motion respected (`prefers-reduced-motion`)
- [x] Colours and spacing come from shared design tokens
