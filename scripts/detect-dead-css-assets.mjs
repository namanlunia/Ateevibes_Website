import fs from 'fs';
import path from 'path';

// Collect all text from source code, public files, index.html, configs
function getAllFiles(dir, exts = ['.ts', '.tsx', '.html', '.css', '.js', '.mjs', '.json']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    if (file === 'node_modules' || file === 'dist' || file === '.cleanup-baseline' || file === '.git') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      const ext = path.extname(file);
      if (exts.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const allFiles = getAllFiles(process.cwd());
const allContents = allFiles.map((f) => ({
  file: f,
  content: fs.readFileSync(f, 'utf8'),
}));

const combinedContent = allContents.map((c) => c.content).join('\n');

// 1. Check custom classes defined in globals.css
const globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
const classRegex = /\.([a-zA-Z0-9_-]+)(?:\s*\{|\s*[,:])/g;
let match;
const definedClasses = new Set();
while ((match = classRegex.exec(globalsCss)) !== null) {
  const cls = match[1];
  // skip standard pseudo/tailwind
  if (['cursor-active', 'cursor-view'].includes(cls) || (!cls.startsWith('font-') && !cls.startsWith('tabular-'))) {
    definedClasses.add(cls);
  }
}

const unusedClasses = [];
for (const cls of definedClasses) {
  // count occurrences outside globals.css
  let count = 0;
  for (const item of allContents) {
    if (item.file.endsWith('globals.css')) continue;
    if (item.content.includes(cls)) {
      count++;
    }
  }
  if (count === 0) {
    unusedClasses.push(cls);
  }
}

// 2. Check CSS variables in tokens.css
const tokensCss = fs.readFileSync('src/styles/tokens.css', 'utf8');
const varRegex = /(--[a-zA-Z0-9_-]+):/g;
const definedVars = new Set();
while ((match = varRegex.exec(tokensCss)) !== null) {
  definedVars.add(match[1]);
}

const unusedVars = [];
for (const v of definedVars) {
  // Search for `var(${v})` or `${v}` across all files outside tokens.css
  // Keep required tokens: --gold, --tab-active-bg, --tab-active-text
  if (['--gold', '--tab-active-bg', '--tab-active-text'].includes(v)) continue;
  let count = 0;
  for (const item of allContents) {
    if (item.file.endsWith('tokens.css')) continue;
    if (item.content.includes(v)) {
      count++;
    }
  }
  if (count === 0) {
    unusedVars.push(v);
  }
}

// 3. Check public assets
function getPublicFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getPublicFiles(fullPath));
    } else {
      results.push(path.relative('public', fullPath));
    }
  });
  return results;
}

const publicFiles = getPublicFiles('public');
const unusedAssets = [];
for (const asset of publicFiles) {
  // Check if filename or relative path is mentioned in any file outside public
  const baseName = path.basename(asset);
  const relWebPath = '/' + asset.replace(/\\/g, '/');
  // standard browser files
  if (['favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.json'].includes(asset)) continue;
  let count = 0;
  for (const item of allContents) {
    if (item.file.startsWith(path.join(process.cwd(), 'public'))) continue;
    if (item.content.includes(asset) || item.content.includes(baseName) || item.content.includes(relWebPath)) {
      count++;
    }
  }
  if (count === 0) {
    unusedAssets.push(asset);
  }
}

console.log('--- CUSTOM CSS CLASSES AUDIT ---');
console.log('Defined custom classes in globals.css:', Array.from(definedClasses).sort());
console.log('Unused custom classes:', unusedClasses);

console.log('\n--- CSS VARIABLES AUDIT ---');
console.log('Unused CSS variables in tokens.css:', unusedVars);

console.log('\n--- PUBLIC ASSETS AUDIT ---');
console.log('Total public assets:', publicFiles.length);
console.log('Unused public assets:', unusedAssets);

fs.writeFileSync('.cleanup-baseline/css-assets-raw.json', JSON.stringify({
  unusedClasses,
  unusedVars,
  unusedAssets
}, null, 2));
