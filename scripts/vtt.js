// Shared by build.js and clean-vtt.js.
const timing = /^(\d+):(\d{2}):(\d{2})\.(\d{3}) --> (\d+):(\d{2}):(\d{2})\.(\d{3})/;
const seconds = (h, m, s, ms) => +h * 3600 + +m * 60 + +s + +ms / 1000;

// "00:00:04.421 --> 00:00:05.339 ..." -> { start, end } in seconds, or null if not a timing line.
function parseTiming(line) {
  const match = line.match(timing);
  if (!match) return null;
  const [, h1, m1, s1, ms1, h2, m2, s2, ms2] = match;
  return { start: seconds(h1, m1, s1, ms1), end: seconds(h2, m2, s2, ms2) };
}

const entities = { '&gt;': '>', '&lt;': '<', '&amp;': '&', '&quot;': '"', '&#39;': "'" };

// Cleans leftovers of auto-generated captions: entities, speaker marks, [Music], stray spaces,
// and a sentence repeated straight after itself.
function tidyText(text) {
  return text
    .replace(/&(?:gt|lt|amp|quot|#39);/g, (entity) => entities[entity])
    .replace(/>>/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.?!;:])/g, '$1')
    .replace(/\b((?:[\w'’]+ ){0,5}[\w'’]+[.?!]) \1/gi, '$1')
    .trim();
}

const abbreviation = /(?:\b[A-Z]|\b(?:Mr|Mrs|Dr|St))\.$/;

// Capitalises each sentence, since auto-captions often start them in lower case.
function capitalise(text) {
  return text
    .replace(/^\S/, (letter) => letter.toUpperCase())
    .replace(/([.?!]["”]?\s+)([a-z])/g, (_, before, letter) => before + letter.toUpperCase());
}

const PAUSE = '\u0001';

// Joins timed cues into readable paragraphs of whole sentences. A paragraph ends once it is long
// enough, preferably where the speaker paused (a gap between cues), and never later than a cap.
function toParagraphs(cues) {
  const text = cues
    .map((cue, index) => {
      const gap = index + 1 < cues.length ? cues[index + 1].start - cue.end : 0;
      return gap >= 0.5 ? `${cue.text}${PAUSE}` : cue.text;
    })
    .join(' ');

  const sentences = [];
  for (const sentence of tidyText(text).split(new RegExp(`(?<=[.?!]["”]?${PAUSE}?)\\s+`))) {
    const last = sentences.at(-1);
    if (last && abbreviation.test(last.replace(PAUSE, ''))) sentences[sentences.length - 1] = `${last} ${sentence}`;
    else sentences.push(sentence);
  }

  const paragraphs = [];
  let current = '';
  sentences.forEach((sentence, index) => {
    current = `${current} ${sentence}`.trim();
    const paused = sentence.endsWith(PAUSE);
    if ((current.length >= 350 && paused) || current.length >= 600 || index === sentences.length - 1) {
      paragraphs.push(capitalise(current.replaceAll(PAUSE, '')));
      current = '';
    }
  });
  return paragraphs;
}

module.exports = { parseTiming, tidyText, toParagraphs };
