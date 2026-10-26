import fs from "node:fs";
import path from "node:path";

const NO_PNO_REGEX = /P\.?\s*NO\b/i;
const NO_STYLE_CODE_REGEX = /style\s*(code)?\s*[:#-]?\s*\d{3,4}/i;

// Scans generated SVGs and asset generator source files
const filesToScan = [
  "scripts/generate-catalog-assets.mjs",
];

// Add all .svg files from public/
function findSvgFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let svgs = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      svgs.push(...findSvgFiles(full));
    } else if (entry.name.endsWith(".svg")) {
      svgs.push(full);
    }
  }
  return svgs;
}

filesToScan.push(...findSvgFiles("public"));

let hasError = false;

for (const file of filesToScan) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, "utf8");

  // Sanitize internal code identifiers and owner poster filenames (e.g. pno-500.jpg, pno: "500", style.pno)
  // while strictly keeping all user-facing text, SVG text nodes, and caption strings
  const sanitized = content
    .replace(/pno-[\w.-]+\.jpg/gi, "")
    .replace(/\/products\/[\w.-]+/gi, "")
    .replace(/\bpno\b\s*[:=]/gi, "")
    .replace(/\.pno\b/gi, "");

  const lines = sanitized.split("\n");
  lines.forEach((line, idx) => {
    if (NO_PNO_REGEX.test(line)) {
      console.error(`[ERROR] P.NO violation in ${file}:${idx + 1}: ${line.trim()}`);
      hasError = true;
    }
    if (NO_STYLE_CODE_REGEX.test(line)) {
      console.error(`[ERROR] Style code violation in ${file}:${idx + 1}: ${line.trim()}`);
      hasError = true;
    }
  });
}

if (hasError) {
  console.error("\n❌ Style code leakage check FAILED. Fix style number captions in images or SVGs.");
  process.exit(1);
} else {
  console.log("✓ No style codes or P.NO references found in generated SVGs or crop pipeline.");
}
