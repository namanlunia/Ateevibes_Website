#!/usr/bin/env node

/**
 * Build guard: scans src/** to guarantee forbidden patterns never re-enter the codebase.
 * Forbidden:
 * - cursor: none
 * - cursor-none
 * - CustomCursor
 * - custom-cursor
 * - data-cursor
 * - PageCurtain
 */

import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

const FORBIDDEN_PATTERNS = [
  { name: 'cursor: none', regex: /cursor\s*:\s*none\b/i },
  { name: 'cursor-none', regex: /\bcursor-none\b/i },
  { name: 'CustomCursor', regex: /\bCustomCursor\b/ },
  { name: 'custom-cursor', regex: /\bcustom-cursor\b/i },
  { name: 'data-cursor', regex: /data-cursor\b/i },
  { name: 'PageCurtain', regex: /\bPageCurtain\b/ },
  { name: 'dynamic tailwind colour: bg-[${', regex: /bg-\[\$\{/ },
  { name: 'silent black fallback (?? or || to #111/#000)', regex: /(\?\?|\|\|)\s*['"]#(?:111|000|111111|000000)['"]/i },
];

const ALLOWED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.svg', '.json']);

function scanDirectory(dir) {
  let violations = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      violations = violations.concat(scanDirectory(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.regex.test(line)) {
            const relPath = path.relative(process.cwd(), fullPath);
            violations.push({
              file: relPath,
              line: i + 1,
              matchedPattern: pattern.name,
              snippet: line.trim(),
            });
          }
        }
      }
    }
  }

  return violations;
}

const violations = scanDirectory(SRC_DIR);

if (violations.length > 0) {
  console.error('\n❌ FORBIDDEN PATTERN VIOLATIONS FOUND IN src/:');
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} matches "${v.matchedPattern}": ${v.snippet}`);
  }
  console.error(`Total violations: ${violations.length}\n`);
  process.exit(1);
} else {
  console.log('✓ No forbidden patterns (custom cursor, PageCurtain) found in src/.');
  process.exit(0);
}
