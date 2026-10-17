// Turns a YouTube auto-caption .vtt (rolling, word-timed, duplicated lines)
// into a clean .vtt with one readable cue per few seconds.
// Usage: node scripts/clean-vtt.js assets/in.en.vtt assets/out.vtt
const fs = require('fs');
const { parseTiming } = require('./vtt');

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: node scripts/clean-vtt.js <input.vtt> <output.vtt>');
  process.exit(1);
}

// Each real caption block repeats the previous line, then adds a new one.
// The 35 ms blocks are pure repeats, so keep only the last line of longer blocks.
const lines = [];
// Blocks end at a truly empty line; the " " filler lines inside a block are not blank.
for (const block of fs.readFileSync(input, 'utf8').split(/\n(?=\n)/)) {
  const rows = block.replace(/^\n/, '').split('\n');
  const at = rows.findIndex((row) => parseTiming(row));
  if (at === -1) continue;

  const { start, end } = parseTiming(rows[at]);
  const text = rows
    .slice(at + 1)
    .map((row) => row.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)
    .pop();

  if (end - start > 0.1 && text) lines.push({ start, end, text });
}

// Auto-captions sometimes repeat the end of the previous line at the start of the next.
function withoutOverlap(previous, next) {
  const before = previous.split(/\s+/);
  const after = next.split(/\s+/);
  for (let k = Math.min(before.length, after.length); k >= 2; k--) {
    const same = before.slice(-k).join(' ').toLowerCase() === after.slice(0, k).join(' ').toLowerCase();
    if (same) return after.slice(k).join(' ');
  }
  return next;
}

// Merge lines into cues of roughly 3-8 seconds, breaking at sentence ends.
const cues = [];
let current = null;
let spoken = '';
for (const line of lines) {
  const text = withoutOverlap(spoken, line.text);
  spoken = `${spoken} ${text}`.trim().split(/\s+/).slice(-30).join(' ');
  if (!text) continue;

  if (!current) current = { start: line.start, end: line.end, text };
  else {
    current.end = line.end;
    current.text += ` ${text}`;
  }
  const length = current.end - current.start;
  if (length >= 8 || (length >= 3 && /[.?!]$/.test(text))) {
    cues.push(current);
    current = null;
  }
}
if (current) cues.push(current);

const stamp = (t) => {
  const ms = Math.round((t % 1) * 1000);
  const total = Math.floor(t);
  const pad = (n, size = 2) => String(n).padStart(size, '0');
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}.${pad(ms, 3)}`;
};

const body = cues.map((cue) => `${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue.text}`).join('\n\n');
fs.writeFileSync(output, `WEBVTT\n\n${body}\n`);
console.log(`Wrote ${cues.length} cues to ${output}`);
