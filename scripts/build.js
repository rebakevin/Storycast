const fs = require('fs');
const path = require('path');
const { parseTiming, tidyText, toParagraphs } = require('./vtt');

const srcDir = path.join(__dirname, '..', 'src');
const includeTag = /<include\s+([^>]*?)\/?>(?:\s*<\/include>)?/g;
const attribute = /([\w-]+)="([^"]*)"/g;

function readAttributes(text) {
  const attributes = {};
  for (const [, name, value] of text.matchAll(attribute)) {
    attributes[name] = value;
  }
  return attributes;
}

const transcriptTag = /<transcript\s+src="([^"]+)"(?:\s+mode="(\w+)")?\s*><\/transcript>/g;

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function formatTime(total) {
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(Math.floor(total % 60)).padStart(2, '0')}`;
}

// <transcript src="assets/x.vtt"> (or with mode="text") becomes a list of timed cues,
// so the text is in the page without any script. scripts/story-media.js highlights the cue that is playing.
function renderTranscript(file, mode) {
  const cues = fs
    .readFileSync(path.join(__dirname, '..', file), 'utf8')
    .split(/\n\n+/)
    .flatMap((block) => {
      const [timing, ...text] = block.split('\n');
      const times = parseTiming(timing);
      return times ? [{ ...times, text: tidyText(text.join(' ')) }] : [];
    });

  const items = cues.map(
    ({ start, end, text }) =>
      `<li class="cues__item" data-start="${start}" data-end="${end}">` +
      `<button class="cues__cue" type="button"><span class="cues__time">${formatTime(start)}</span> ${escapeHtml(text)}</button></li>`
  );
  // mode="text" is the plain paragraphs, for the transcript's own page.
  if (mode === 'text') {
    const paragraphs = toParagraphs(cues).map((text) => `<p>${escapeHtml(text)}</p>`);
    return `<div class="reading">${paragraphs.join('')}</div>`;
  }

  return `<ol class="cues">${items.join('')}</ol>`;
}

function fillPlaceholders(html, props) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => props[name] ?? '');
}

function render(file, props = {}) {
  const html = fillPlaceholders(fs.readFileSync(path.join(srcDir, file), 'utf8'), props);

  return html
    .replace(includeTag, (_, attributeText) => {
      const { src, ...componentProps } = readAttributes(attributeText);
      return render(src, componentProps);
    })
    .replace(transcriptTag, (_, file, mode) => renderTranscript(file, mode));
}

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), render('main.html'));
console.log('Built index.html');
