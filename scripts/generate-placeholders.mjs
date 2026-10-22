import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const brandDir = path.join(publicDir, 'brand');
const catalogDir = path.join(publicDir, 'catalog');

fs.mkdirSync(brandDir, { recursive: true });
fs.mkdirSync(catalogDir, { recursive: true });

// 1. Generate Logo
const logoSvg = `
<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cdf0a7" />
      <stop offset="100%" stop-color="#8fbf5a" />
    </linearGradient>
  </defs>
  <!-- Vibe Symbol -->
  <g transform="translate(10, 18)">
    <rect width="64" height="64" rx="16" fill="#1c241a" />
    <circle cx="32" cy="32" r="20" fill="url(#logoGrad)" />
    <path d="M22 42 L32 20 L42 42 L35.5 42 L32 33 L28.5 42 Z" fill="#1c241a" />
  </g>
  <!-- Wordmark -->
  <text x="88" y="58" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="700" letter-spacing="0.08em" fill="#1c241a">
    ATEEVIBES
  </text>
  <text x="90" y="78" font-family="'DM Sans', sans-serif" font-size="11" font-weight="500" letter-spacing="0.22em" fill="#556150">
    FEEL THE VIBES
  </text>
</svg>
`;

await sharp(Buffer.from(logoSvg))
  .png()
  .toFile(path.join(brandDir, 'logo.png'));

console.log('✓ Created /public/brand/logo.png');

// 2. Poster Definitions
const posters = [
  { file: 'pno-500.jpg', pno: '500', name: 'Premium Matty T-Shirt', fabric: 'Ultra Soft Matty', colors: ['#111111', '#FFFFFF', '#9BD39B', '#B9A5E8', '#B3202A', '#9A5B2D', '#1FB8A5', '#1B2A4A', '#4C79C6'] },
  { file: 'pno-107.jpg', pno: '107', name: '2-Way Round Neck', fabric: '2-Way Stretch', colors: ['#111111', '#0E5A6B', '#5A1F2E', '#9C3B1E', '#F4EFE6', '#6F6BA6'] },
  { file: 'pno-600.jpg', pno: '600', name: 'Imported Tencil Round Neck', fabric: 'Imported Tencil Weave', colors: ['#111111', '#0E5A6B', '#9C3B1E', '#F4EFE6', '#6F6BA6'] },
  { file: 'pno-501.jpg', pno: '501', name: 'Premium Waffle Round Neck', fabric: 'Waffle Honeycomb Texture', colors: ['#111111', '#D9C7A5', '#4A2C1F', '#6FB5BE', '#FFFFFF'] },
  { file: 'pno-1400.jpg', pno: '1400', name: 'Premium Matty Polo', fabric: 'Matty Collar Weave', colors: ['#FFFFFF', '#1B2A4A', '#B3202A', '#9A5B2D', '#111111'] },
  { file: 'pno-105.jpg', pno: '105', name: 'Jacquard Half Sleeve Polo', fabric: 'Jacquard Knit', colors: ['#111111', '#8FD1B0', '#9C3B1E', '#2F3338', '#D9A62A', '#FFFFFF'] },
  { file: 'pno-1401.jpg', pno: '1401', name: 'Waffle Polo T-Shirt', fabric: 'Premium Waffle Knit (Coming Soon)', colors: ['#D9C7A5', '#6FB5BE', '#2F3338'] },
  { file: 'pno-1700-stripes.jpg', pno: '1700-A', name: 'Printed Collar Stripe Gradient', fabric: 'Stripe Gradient Knit', colors: ['#D890A8', '#7DB6E3', '#9A96B8', '#D2B48C', '#A8C4A2'] },
  { file: 'pno-1700-abstract.jpg', pno: '1700-B', name: 'Printed Collar Abstract', fabric: 'Geometric Abstract Knit', colors: ['#A8C4A2', '#7DB6E3', '#D890A8', '#D2B48C', '#8FD1B0'] },
  { file: 'pno-711.jpg', pno: '711', name: 'Jacquard Half Sleeve', fabric: 'Pure Jacquard Structure', colors: ['#111111', '#8FD1B0', '#9C3B1E', '#2F3338', '#D9A62A', '#FFFFFF'] },
  { file: 'pno-1005.jpg', pno: '1005', name: 'Jacquard Full Sleeve', fabric: 'Full Sleeve Jacquard', colors: ['#9C3B1E', '#8FD1B0', '#111111', '#2F3338', '#D9A62A', '#FFFFFF'] },
  { file: 'pno-701.jpg', pno: '701', name: 'Royal Print Jacquard Half Sleeve', fabric: 'China Jacquard Knit', colors: ['#1F4D3A', '#111111', '#B9A5E8', '#8D8D92', '#8A5A3C'] },
  { file: 'pno-1007.jpg', pno: '1007', name: 'Royal Print Jacquard Full Sleeve', fabric: 'China Jacquard Full Sleeve', colors: ['#1F4D3A', '#111111', '#B9A5E8', '#8D8D92', '#8A5A3C'] },
  { file: 'pno-102.jpg', pno: '102', name: 'Tai Dai Print T-Shirt', fabric: 'Tai Dai Soft Texture', colors: ['#E3B88A', '#B9A5E8', '#8D8D92', '#A9D6C0', '#8C5A4A'] },
  { file: 'pno-1002.jpg', pno: '1002', name: 'Tai Dai Print Full Sleeve', fabric: 'Tai Dai Full Sleeve Stretch', colors: ['#E3B88A', '#B9A5E8', '#8D8D92', '#A9D6C0', '#8C5A4A'] },
  { file: 'pno-800.jpg', pno: '800', name: 'Premium Printed Round Neck', fabric: 'Artisan Printed Knit', colors: ['#1B2A4A', '#1F4D3A', '#4C79C6', '#8D8D92', '#2F3338'] }
];

for (const p of posters) {
  const swatchCircles = p.colors
    .map((c, i) => `<circle cx="${100 + i * 55}" cy="1080" r="20" fill="${c}" stroke="#ffffff" stroke-width="3" />`)
    .join('');

  const posterSvg = `
  <svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fdfcf6" />
        <stop offset="50%" stop-color="#faf3d0" />
        <stop offset="100%" stop-color="#eaf5df" />
      </linearGradient>
      <radialGradient id="blob1" cx="30%" cy="25%" r="40%">
        <stop offset="0%" stop-color="#cdf0a7" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#cdf0a7" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="blob2" cx="75%" cy="70%" r="50%">
        <stop offset="0%" stop-color="#8fbf5a" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#8fbf5a" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Canvas Background -->
    <rect width="800" height="1200" fill="url(#bgGrad)" />
    <circle cx="200" cy="250" r="300" fill="url(#blob1)" />
    <circle cx="650" cy="850" r="400" fill="url(#blob2)" />

    <!-- Poster Frame -->
    <rect x="30" y="30" width="740" height="1140" rx="20" fill="none" stroke="#1c241a" stroke-width="2" stroke-opacity="0.15" />

    <!-- Brand Header -->
    <text x="60" y="90" font-family="'Playfair Display', Georgia, serif" font-size="32" font-weight="700" fill="#1c241a" letter-spacing="0.08em">ATEEVIBES</text>
    <text x="60" y="115" font-family="'DM Sans', sans-serif" font-size="12" font-weight="500" fill="#556150" letter-spacing="0.2em">FEEL THE VIBES • CATALOG POSTER</text>

    <!-- Style Code Tag -->
    <g transform="translate(560, 60)">
      <rect width="180" height="48" rx="24" fill="#1c241a" />
      <text x="90" y="30" font-family="'DM Sans', sans-serif" font-size="16" font-weight="700" fill="#faf3d0" text-anchor="middle">STYLE ${p.pno}</text>
    </g>

    <!-- Center Art: Illustrated Model Silhouette / Product Focus -->
    <g transform="translate(160, 200)">
      <!-- T-Shirt Silhouette Base -->
      <path d="M 120 40 L 190 85 L 290 85 L 360 40 L 460 120 L 400 240 L 330 200 L 330 650 L 150 650 L 150 200 L 80 240 L 20 120 Z" fill="#1c241a" opacity="0.08" />
      <!-- Center Graphic Card -->
      <rect x="30" y="50" width="420" height="600" rx="28" fill="#ffffff" stroke="#e4e8d6" stroke-width="2" />
      <circle cx="240" cy="300" r="150" fill="${p.colors[0]}" opacity="0.9" />
      <!-- Stylized folds / lines -->
      <path d="M 140 220 Q 240 320 340 220" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.4" />
      <path d="M 170 330 Q 240 400 310 330" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.4" />
      <!-- Fabric Badge Inside Card -->
      <rect x="70" y="550" width="340" height="60" rx="30" fill="#faf3d0" />
      <text x="240" y="588" font-family="'DM Sans', sans-serif" font-size="16" font-weight="700" fill="#1c241a" text-anchor="middle">${p.fabric}</text>
    </g>

    <!-- Bottom Info -->
    <text x="60" y="930" font-family="'Playfair Display', Georgia, serif" font-size="38" font-weight="700" fill="#1c241a">${p.name}</text>
    <text x="60" y="970" font-family="'DM Sans', sans-serif" font-size="16" font-weight="500" fill="#4d7a2a">Same Print, Different Vibes • Premium Edition</text>

    <!-- Swatches Row -->
    <text x="60" y="1030" font-family="'DM Sans', sans-serif" font-size="13" font-weight="700" fill="#556150" letter-spacing="0.1em">AVAILABLE COLORWAYS</text>
    <g>
      ${swatchCircles}
    </g>

    <text x="60" y="1135" font-family="'DM Sans', sans-serif" font-size="11" font-weight="500" fill="#556150">Sizes: S M L XL • All-day comfort • Shape retention • Breathable knit</text>
  </svg>
  `;

  await sharp(Buffer.from(posterSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(catalogDir, p.file));
}

console.log(`✓ Created ${posters.length} catalog posters in /public/catalog`);
