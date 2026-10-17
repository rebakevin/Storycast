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

module.exports = { parseTiming };
