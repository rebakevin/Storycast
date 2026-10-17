# StoryCast

StoryCast retells classic stories (starting with *Romeo & Juliet*) as chapters, film and audio. Every story can be
watched, listened to or read, with captions and transcripts so everyone can follow along.

## Run the app

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
└── docs/        site map and content structure
```

## Accessibility checklist

- [x] **WCAG 2.1 AA** as the target
- [x] **Screen readers**
    - [x] Semantic HTML with `lang="en"` and landmarks (`header`, `nav`, `main`, `footer`)
    - [x] Real buttons and links, so the control and its name are read out
    - [x] Labelled navigation regions (site menu, chapter menus) and a titled video frame
    - [x] Tabs expose their role and selected state (`role="tab"`, `aria-selected`)
    - [x] Page changes announced when navigating
    - [x] "Skip to content" link
- [x] **Keyboard**
    - [x] Everything reachable and usable by keyboard
    - [x] Watch/Listen/Read tabs operable with arrow keys
    - [x] Visible focus styles
- [x] **Ways to follow the story** (no one format is required)
    - [x] Listen: audio-only version with native, labelled player controls, for people who can't see the video
    - [x] Watch: captioned video, for people who can't hear
    - [x] Read: written summary and full text transcripts, for people who prefer or need text
    - [x] Transcript synced with the audio and video
- [x] **Responsiveness**
    - [x] Mobile: single-column, mobile-first layout
    - [x] Larger screens: wider layout from 40rem (tablet and desktop)
- [x] **Motion**
    - [x] Reduced motion respected (`prefers-reduced-motion`)
- [x] **Design**
    - [x] Colours and spacing from shared design tokens
