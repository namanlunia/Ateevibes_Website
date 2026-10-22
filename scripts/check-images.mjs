import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');

// Helper to check case-sensitive existence
function fileExistsCaseSensitive(relativePath) {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const fullPath = path.join(publicDir, cleanPath);

  if (!fs.existsSync(fullPath)) {
    return false;
  }

  // Verify each path segment matches exact case on Linux/Unix
  const segments = cleanPath.split(path.sep);
  let currentDir = publicDir;

  for (const segment of segments) {
    const entries = fs.readdirSync(currentDir);
    if (!entries.includes(segment)) {
      return false; // Case mismatch!
    }
    currentDir = path.join(currentDir, segment);
  }

  return true;
}

// Extract image paths from a source file using regex
function extractImagePathsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match strings ending in .jpg, .jpeg, .png, .webp, .svg starting with /
  const matches = content.match(/\/[\w\-./]+\.(jpg|jpeg|png|webp|svg)/gi) || [];
  return [...new Set(matches)];
}

const filesToCheck = [
  'src/data/products.ts',
  'src/data/categories.ts',
  'src/pages/HomePage.tsx',
  'src/pages/AboutPage.tsx',
  'src/config/site.ts',
];

let hasError = false;
let totalChecked = 0;

for (const file of filesToCheck) {
  const fullPath = path.resolve(file);
  if (!fs.existsSync(fullPath)) continue;

  const imagePaths = extractImagePathsFromFile(fullPath);
  for (const img of imagePaths) {
    // Ignore external or non-public paths
    if (img.startsWith('/brand') || img.startsWith('/catalog') || img.startsWith('/products')) {
      totalChecked++;
      if (!fileExistsCaseSensitive(img)) {
        console.error(`[ERROR] Missing or case-mismatched image in ${file}: "${img}"`);
        hasError = true;
      }
    }
  }
}

if (hasError) {
  console.error(`\n❌ Image existence validation FAILED. Some referenced images are missing or case-mismatched.`);
  process.exit(1);
} else {
  console.log(`✓ All ${totalChecked} referenced images exist in /public with exact case sensitivity.`);
}
