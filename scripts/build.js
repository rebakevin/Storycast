const fs = require('fs');
const path = require('path');
const { parseTiming } = require('./vtt');

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

const transcriptTag = /<transcript\s+src="([^"]+)"\s*><\/transcript>/g;

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function formatTime(total) {
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(Math.floor(total % 60)).padStart(2, '0')}`;
}

// <transcript src="media/x.vtt"> becomes a list of timed cues, so the text is in the page
// without any script. scripts/story-media.js highlights the cue that is playing.
function renderTranscript(file) {
  const cues = fs
    .readFileSync(path.join(__dirname, '..', file), 'utf8')
    .split(/\n\n+/)
    .flatMap((block) => {
      const [timing, ...text] = block.split('\n');
      const times = parseTiming(timing);
      return times ? [{ ...times, text: escapeHtml(text.join(' ').replace(/\s+/g, ' ').trim()) }] : [];
    });

  const items = cues.map(
    ({ start, end, text }) =>
      `<li class="cues__item" data-start="${start}" data-end="${end}">` +
      `<button class="cues__cue" type="button"><span class="cues__time">${formatTime(start)}</span> ${text}</button></li>`
  );
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
    .replace(transcriptTag, (_, file) => renderTranscript(file));
}

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), render('main.html'));
console.log('Built index.html');
