const fs = require('fs');
const path = require('path');

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

function fillPlaceholders(html, props) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => props[name] ?? '');
}

function render(file, props = {}) {
  const html = fillPlaceholders(fs.readFileSync(path.join(srcDir, file), 'utf8'), props);

  return html.replace(includeTag, (_, attributeText) => {
    const { src, ...componentProps } = readAttributes(attributeText);
    return render(src, componentProps);
  });
}

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), render('main.html'));
console.log('Built index.html');
