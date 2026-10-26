import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const brandDir = path.join(publicDir, 'brand');
const catalogDir = path.join(publicDir, 'catalog');
const productsDir = path.join(publicDir, 'products');

fs.mkdirSync(brandDir, { recursive: true });
fs.mkdirSync(catalogDir, { recursive: true });
fs.mkdirSync(productsDir, { recursive: true });

// Function to generate a premium vector T-shirt SVG
function generateTShirtSvg(options) {
  const {
    width = 800,
    height = 1000,
    color = '#1c241a',
    neck = 'round', // 'round' or 'polo'
    sleeve = 'half', // 'half' or 'full'
    fabricName = 'China Jacquard Knit',
    pno = '1007',
    isPattern = false,
    patternType = 'jacquard', // 'jacquard', 'tai-dai', 'stripes', 'abstract'
  } = options;

  // Pattern overlays for textured weaves
  let patternDef = '';
  let patternFill = '';

  if (isPattern) {
    if (patternType === 'jacquard') {
      patternDef = `
        <pattern id="jacquardPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="${color}" />
          <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="#ffffff" fill-opacity="0.12" />
          <circle cx="10" cy="10" r="2.5" fill="#ffffff" fill-opacity="0.18" />
        </pattern>
      `;
      patternFill = 'url(#jacquardPattern)';
    } else if (patternType === 'tai-dai') {
      patternDef = `
        <radialGradient id="taiDaiRadial" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
          <stop offset="40%" stop-color="${color}" stop-opacity="0.9" />
          <stop offset="70%" stop-color="#ffffff" stop-opacity="0.25" />
          <stop offset="100%" stop-color="${color}" stop-opacity="1" />
        </radialGradient>
      `;
      patternFill = 'url(#taiDaiRadial)';
    } else if (patternType === 'stripes') {
      patternDef = `
        <pattern id="stripesPattern" width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="${color}" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#ffffff" stroke-width="8" stroke-opacity="0.18" />
        </pattern>
      `;
      patternFill = 'url(#stripesPattern)';
    } else {
      patternDef = `
        <pattern id="abstractPattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="${color}" />
          <circle cx="30" cy="30" r="14" fill="#ffffff" fill-opacity="0.14" />
          <path d="M10 10 L50 50 M50 10 L10 50" stroke="#ffffff" stroke-width="3" stroke-opacity="0.1" />
        </pattern>
      `;
      patternFill = 'url(#abstractPattern)';
    }
  }

  // T-Shirt Outline Paths (Realistic drape & proportions)
  // Half sleeve vs Full sleeve
  const leftSleevePath = sleeve === 'full'
    ? 'M 285 240 L 150 330 L 195 560 L 265 540 L 290 390 Z'
    : 'M 285 240 L 175 320 L 225 405 L 295 365 Z';

  const rightSleevePath = sleeve === 'full'
    ? 'M 515 240 L 650 330 L 605 560 L 535 540 L 510 390 Z'
    : 'M 515 240 L 625 320 L 575 405 L 505 365 Z';

  const bodyPath = `
    M 285 240
    C 335 250, 465 250, 515 240
    L 505 365
    C 495 440, 500 680, 510 780
    C 440 790, 360 790, 290 780
    C 300 680, 305 440, 295 365
    Z
  `;

  // Collar: Round neck vs Polo Collar
  const collarSvg = neck === 'polo' ? `
    <!-- Polo Collar & Placket -->
    <path d="M 345 235 L 400 310 L 455 235 L 425 220 L 400 242 L 375 220 Z" fill="#ffffff" fill-opacity="0.25" stroke="#1c241a" stroke-width="2" stroke-opacity="0.3" />
    <path d="M 382 242 L 400 315 L 418 242 Z" fill="${color}" stroke="#1c241a" stroke-width="1.5" stroke-opacity="0.3" />
    <!-- Placket Buttons -->
    <rect x="393" y="310" width="14" height="75" rx="3" fill="#ffffff" fill-opacity="0.3" stroke="#1c241a" stroke-width="1" stroke-opacity="0.2" />
    <circle cx="400" cy="330" r="3" fill="#1c241a" fill-opacity="0.5" />
    <circle cx="400" cy="355" r="3" fill="#1c241a" fill-opacity="0.5" />
    <circle cx="400" cy="375" r="3" fill="#1c241a" fill-opacity="0.5" />
  ` : `
    <!-- Round Neck Ribbed Collar -->
    <path d="M 345 235 C 370 270, 430 270, 455 235 C 440 252, 360 252, 345 235 Z" fill="#ffffff" fill-opacity="0.2" stroke="#1c241a" stroke-width="2" stroke-opacity="0.25" />
    <path d="M 352 232 C 375 262, 425 262, 448 232" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.4" />
  `;

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background studio gradient -->
      <linearGradient id="studioBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCFCFA" />
        <stop offset="50%" stop-color="#F7F5EE" />
        <stop offset="100%" stop-color="#EFECE1" />
      </linearGradient>

      <!-- Pedestal Glow -->
      <radialGradient id="pedestal" cx="50%" cy="85%" r="40%">
        <stop offset="0%" stop-color="#1C241A" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#1C241A" stop-opacity="0" />
      </radialGradient>

      <!-- Garment Shadow -->
      <filter id="garmentShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#1C241A" flood-opacity="0.14" />
      </filter>

      <!-- Gold emblem gradient -->
      <linearGradient id="goldMini" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F5E084" />
        <stop offset="50%" stop-color="#D4AF37" />
        <stop offset="100%" stop-color="#AA7C11" />
      </linearGradient>

      ${patternDef}
    </defs>

    <!-- Studio Backing -->
    <rect width="800" height="1000" fill="url(#studioBg)" />

    <!-- Soft Studio Ground Shadow -->
    <ellipse cx="400" cy="820" rx="220" ry="40" fill="url(#pedestal)" />

    <!-- Upper Brand Badge / Style Watermark -->
    <g transform="translate(60, 60)" opacity="0.6">
      <text font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="900" fill="#1C241A" letter-spacing="3">ATEEVIBES</text>
      <text y="22" font-family="'DM Sans', system-ui, sans-serif" font-size="10" font-weight="700" fill="#AA7C11" letter-spacing="2">${fabricName.toUpperCase()}</text>
    </g>

    <!-- MAIN GARMENT SILHOUETTE -->
    <g filter="url(#garmentShadow)">
      <!-- Left Sleeve -->
      <path d="${leftSleevePath}" fill="${color}" stroke="#1C241A" stroke-width="1.5" stroke-opacity="0.25" />
      ${isPattern ? `<path d="${leftSleevePath}" fill="${patternFill}" opacity="0.85" />` : ''}

      <!-- Right Sleeve -->
      <path d="${rightSleevePath}" fill="${color}" stroke="#1C241A" stroke-width="1.5" stroke-opacity="0.25" />
      ${isPattern ? `<path d="${rightSleevePath}" fill="${patternFill}" opacity="0.85" />` : ''}

      <!-- Torso Body -->
      <path d="${bodyPath}" fill="${color}" stroke="#1C241A" stroke-width="1.5" stroke-opacity="0.25" />
      ${isPattern ? `<path d="${bodyPath}" fill="${patternFill}" opacity="0.85" />` : ''}

      <!-- Subtle Realistic Fabric Folds & Shading Lines -->
      <!-- Shoulder Seam Left -->
      <line x1="285" y1="240" x2="350" y2="235" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3" />
      <!-- Shoulder Seam Right -->
      <line x1="515" y1="240" x2="450" y2="235" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3" />

      <!-- Side contour shadow left -->
      <path d="M 295 365 Q 305 520 292 770" stroke="#1c241a" stroke-width="4" stroke-opacity="0.12" fill="none" />
      <!-- Side contour shadow right -->
      <path d="M 505 365 Q 495 520 508 770" stroke="#1c241a" stroke-width="4" stroke-opacity="0.12" fill="none" />

      <!-- Chest Center Drape Curve -->
      <path d="M 370 420 Q 400 460 430 420" stroke="#ffffff" stroke-width="3" stroke-opacity="0.2" fill="none" />
      <path d="M 360 520 Q 400 570 440 520" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.18" fill="none" />
      <path d="M 375 620 Q 400 660 425 620" stroke="#ffffff" stroke-width="2" stroke-opacity="0.15" fill="none" />

      <!-- Hem Stitching at Bottom -->
      <path d="M 292 768 C 360 778, 440 778, 508 768" stroke="#1c241a" stroke-width="2.5" stroke-opacity="0.2" fill="none" stroke-dasharray="4 2" />

      <!-- Sleeve Stitching -->
      <line x1="175" y1="320" x2="225" y2="405" stroke="#1c241a" stroke-width="2" stroke-opacity="0.2" stroke-dasharray="3 2" />
      <line x1="625" y1="320" x2="575" y2="405" stroke="#1c241a" stroke-width="2" stroke-opacity="0.2" stroke-dasharray="3 2" />

      <!-- Chest Ateevibes Embroidered Gold Bolt-A Mark -->
      <g transform="translate(450, 340) scale(0.38)">
        <rect width="50" height="50" rx="12" fill="#1C241A" fill-opacity="0.8" />
        <path d="M 25 10 L 13 40 L 19 40 L 22.5 30 L 27.5 30 Z" fill="#FFFFFF" />
        <path d="M 25 10 L 37 40 L 31 40 L 28.5 31 Z" fill="#FFFFFF" opacity="0.8" />
        <polygon points="28,21 18,31 24,31 21,39 32,28 26,28" fill="url(#goldMini)" />
      </g>

      <!-- Collar Structure -->
      ${collarSvg}
    </g>

    <!-- Bottom Tag: Fabric Spec -->
    <g transform="translate(400, 920)" text-anchor="middle">
      <rect x="-140" y="-20" width="280" height="36" rx="18" fill="#1C241A" fill-opacity="0.06" stroke="#1C241A" stroke-opacity="0.1" />
      <text y="3" font-family="'DM Sans', system-ui, sans-serif" font-size="11" font-weight="700" fill="#1C241A" letter-spacing="1.5">
        ${fabricName.toUpperCase()}
      </text>
    </g>
  </svg>
  `;
}

// Helper to load and parse COLOUR_PALETTE from src/data/colours.ts at runtime
function loadPalette() {
  const coloursTsPath = path.resolve('src/data/colours.ts');
  if (!fs.existsSync(coloursTsPath)) {
    throw new Error(`COLOUR_PALETTE source file not found at: ${coloursTsPath}`);
  }
  const fileContent = fs.readFileSync(coloursTsPath, 'utf8');
  const palette = {};
  const regex = /['"]?([a-z0-9-]+)['"]?\s*:\s*\{[^}]*?hex:\s*['"]([#A-Fa-f0-9]{7})['"][^}]*?\}/g;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    palette[match[1]] = match[2];
  }
  if (Object.keys(palette).length === 0) {
    throw new Error('Failed to parse any colours from COLOUR_PALETTE');
  }
  return palette;
}

// Catalog definitions matching the 16 spec styles
const catalogStyles = [
  {
    pno: '500',
    poster: 'pno-500.jpg',
    name: 'Premium Matty T-Shirt',
    fabric: 'Ultra Soft Matty',
    neck: 'round',
    sleeve: 'half',
    colourSlugs: [
      'black',
      'white',
      'pastel-green',
      'lavender',
      'jalapeno-red',
      'leather-brown',
      'turquoise',
      'navy',
      'blue',
    ],
  },
  {
    pno: '107',
    poster: 'pno-107.jpg',
    name: '2-Way Round Neck',
    fabric: '2-Way Stretch',
    neck: 'round',
    sleeve: 'half',
    colourSlugs: ['black', 'bottle-green', 'wine', 'rust', 'off-white', 'grey'],
  },
  {
    pno: '600',
    poster: 'pno-600.jpg',
    name: 'Imported Tencil Round Neck',
    fabric: 'Imported Tencil Weave',
    neck: 'round',
    sleeve: 'half',
    colourSlugs: ['black', 'bottle-green', 'rust', 'off-white', 'grey'],
  },
  {
    pno: '501',
    poster: 'pno-501.jpg',
    name: 'Premium Waffle Round Neck',
    fabric: 'Waffle Honeycomb Texture',
    neck: 'round',
    sleeve: 'half',
    colourSlugs: ['black', 'beige', 'brown', 'aqua', 'white'],
  },
  {
    pno: '1400',
    poster: 'pno-1400.jpg',
    name: 'Premium Matty Polo',
    fabric: 'Matty Collar Weave',
    neck: 'polo',
    sleeve: 'half',
    colourSlugs: ['white', 'navy', 'jalapeno-red', 'leather-brown', 'black'],
  },
  {
    pno: '105',
    poster: 'pno-105.jpg',
    name: 'Jacquard Half Sleeve Polo',
    fabric: 'Jacquard Knit',
    neck: 'polo',
    sleeve: 'half',
    isPattern: true,
    patternType: 'jacquard',
    colourSlugs: ['black', 'mint-green', 'rust', 'charcoal', 'lemon', 'white'],
  },
  {
    pno: '1401',
    poster: 'pno-1401.jpg',
    name: 'Waffle Polo T-Shirt',
    fabric: 'Premium Waffle Knit (Coming Soon)',
    neck: 'polo',
    sleeve: 'half',
    isComingSoon: true,
    colourSlugs: ['coming-soon'],
  },
  {
    pno: '1700-A',
    poster: 'pno-1700-stripes.jpg',
    name: 'Printed Collar Stripe Gradient',
    fabric: 'Stripe Gradient Knit',
    neck: 'polo',
    sleeve: 'half',
    isPattern: true,
    patternType: 'stripes',
    colourSlugs: ['rose-pink', 'sky-blue', 'lilac-grey', 'sand-beige', 'sage-green'],
  },
  {
    pno: '1700-B',
    poster: 'pno-1700-abstract.jpg',
    name: 'Printed Collar Abstract',
    fabric: 'Geometric Abstract Knit',
    neck: 'polo',
    sleeve: 'half',
    isPattern: true,
    patternType: 'abstract',
    colourSlugs: ['design-01', 'design-02', 'design-03', 'design-04', 'design-05'],
  },
  {
    pno: '711',
    poster: 'pno-711.jpg',
    name: 'Jacquard Half Sleeve',
    fabric: 'Pure Jacquard Structure',
    neck: 'round',
    sleeve: 'half',
    isPattern: true,
    patternType: 'jacquard',
    colourSlugs: ['black', 'mint-green', 'rust', 'charcoal', 'lemon', 'white'],
  },
  {
    pno: '1005',
    poster: 'pno-1005.jpg',
    name: 'Jacquard Full Sleeve',
    fabric: 'Full Sleeve Jacquard',
    neck: 'round',
    sleeve: 'full',
    isPattern: true,
    patternType: 'jacquard',
    colourSlugs: ['rust', 'mint-green', 'black', 'charcoal', 'lemon', 'white'],
  },
  {
    pno: '701',
    poster: 'pno-701.jpg',
    name: 'Royal Print Jacquard Half Sleeve',
    fabric: 'China Jacquard Knit',
    neck: 'round',
    sleeve: 'half',
    isPattern: true,
    patternType: 'jacquard',
    colourSlugs: ['green', 'black', 'lavender', 'grey', 'chocolate'],
  },
  {
    pno: '1007',
    poster: 'pno-1007.jpg',
    name: 'Royal Print Jacquard Full Sleeve',
    fabric: 'China Jacquard Full Sleeve',
    neck: 'round',
    sleeve: 'full',
    isPattern: true,
    patternType: 'jacquard',
    colourSlugs: ['green', 'black', 'lavender', 'grey', 'chocolate'],
  },
  {
    pno: '102',
    poster: 'pno-102.jpg',
    name: 'Tai Dai Print T-Shirt',
    fabric: 'Tai Dai Soft Texture',
    neck: 'round',
    sleeve: 'half',
    isPattern: true,
    patternType: 'tai-dai',
    colourSlugs: ['r-gold', 'lavender', 'd-grey', 'pista', 'choco'],
  },
  {
    pno: '1002',
    poster: 'pno-1002.jpg',
    name: 'Tai Dai Print Full Sleeve',
    fabric: 'Tai Dai Full Sleeve Stretch',
    neck: 'round',
    sleeve: 'full',
    isPattern: true,
    patternType: 'tai-dai',
    colourSlugs: ['r-gold', 'lavender', 'd-grey', 'pista', 'choco'],
  },
  {
    pno: '800',
    poster: 'pno-800.jpg',
    name: 'Premium Printed Round Neck',
    fabric: 'Artisan Printed Knit',
    neck: 'round',
    sleeve: 'half',
    isPattern: true,
    patternType: 'abstract',
    colourSlugs: ['design-01', 'design-02', 'design-03', 'design-04', 'design-05'],
  },
];

async function run() {
  console.log('Generating branded T-Shirt silhouette and product assets...');

  // 1. Create generic brand silhouette SVG
  const genericSvg = generateTShirtSvg({
    color: '#8fbf5a',
    neck: 'round',
    sleeve: 'half',
    fabricName: 'Architectural Knitwear',
  });
  fs.writeFileSync(path.join(brandDir, 'tshirt-silhouette.svg'), genericSvg);
  fs.writeFileSync(path.join(brandDir, 'placeholder.svg'), genericSvg);

  const palette = loadPalette();

  // 2. Generate each poster and cropped variant packs
  for (const style of catalogStyles) {
    if (!Array.isArray(style.colourSlugs) || style.colourSlugs.length === 0) {
      throw new Error(`Style ${style.pno} must define a non-empty colourSlugs array.`);
    }

    const colours = style.colourSlugs.map((slug) => {
      const hex = palette[slug];
      if (!hex) {
        throw new Error(
          `Unknown or missing colour slug: "${slug}" for style ${style.pno} in COLOUR_PALETTE.`
        );
      }
      return { slug, hex };
    });

    const posterSvg = generateTShirtSvg({
      width: 800,
      height: 1200,
      color: colours[0].hex,
      neck: style.neck,
      sleeve: style.sleeve,
      fabricName: style.fabric,
      pno: style.pno,
      isPattern: style.isPattern,
      patternType: style.patternType,
    });

    const posterOut = path.join(catalogDir, style.poster);
    await sharp(Buffer.from(posterSvg))
      .jpeg({ quality: 92 })
      .toFile(posterOut);

    const outPnoDir = path.join(productsDir, style.pno);
    fs.mkdirSync(outPnoDir, { recursive: true });

    for (const c of colours) {
      const variantSvg = generateTShirtSvg({
        width: 800,
        height: 1000,
        color: c.hex,
        neck: style.neck,
        sleeve: style.sleeve,
        fabricName: style.fabric,
        pno: style.pno,
        isPattern: style.isPattern,
        patternType: style.patternType,
      });

      const buffer = Buffer.from(variantSvg);

      // Save JPEG
      await sharp(buffer)
        .jpeg({ quality: 90 })
        .toFile(path.join(outPnoDir, `${c.slug}.jpg`));

      // Save WebP at 480, 800, 1200 px as specified in Section 5
      await sharp(buffer)
        .resize(480)
        .webp({ quality: 85 })
        .toFile(path.join(outPnoDir, `${c.slug}-480.webp`));

      await sharp(buffer)
        .resize(800)
        .webp({ quality: 85 })
        .toFile(path.join(outPnoDir, `${c.slug}-800.webp`));

      await sharp(buffer)
        .resize(1200)
        .webp({ quality: 85 })
        .toFile(path.join(outPnoDir, `${c.slug}-1200.webp`));

      // If pattern, save swatch image
      if (style.isPattern) {
        await sharp(buffer)
          .extract({ left: 360, top: 400, width: 80, height: 80 })
          .jpeg({ quality: 90 })
          .toFile(path.join(outPnoDir, `swatch-${c.slug}.jpg`));
      }
    }
  }

  // 3. Generate About page craft photo & Category Tile 5 photo
  const aboutSvg = generateTShirtSvg({
    width: 800,
    height: 1000,
    color: '#1F4D3A',
    neck: 'round',
    sleeve: 'full',
    fabricName: 'Architectural Craftsmanship',
    pno: '1007',
    isPattern: true,
    patternType: 'jacquard',
  });
  await sharp(Buffer.from(aboutSvg))
    .webp({ quality: 88 })
    .toFile(path.join(catalogDir, '1007-main.webp'));

  await sharp(Buffer.from(aboutSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(catalogDir, 'about-craft.jpg'));

  // Tile 5 & Fabric stories
  const tile5Svg = generateTShirtSvg({
    width: 800,
    height: 600,
    color: '#8C5A4A',
    neck: 'round',
    sleeve: 'full',
    fabricName: 'Full Sleeve Layering',
    pno: '1002',
    isPattern: true,
    patternType: 'tai-dai',
  });
  await sharp(Buffer.from(tile5Svg))
    .webp({ quality: 88 })
    .toFile(path.join(catalogDir, '1001-main.webp'));

  const taiDaiSvg = generateTShirtSvg({
    width: 800,
    height: 1000,
    color: '#E3B88A',
    neck: 'round',
    sleeve: 'half',
    fabricName: 'Artisan Tai Dai',
    pno: '102',
    isPattern: true,
    patternType: 'tai-dai',
  });
  await sharp(Buffer.from(taiDaiSvg))
    .webp({ quality: 88 })
    .toFile(path.join(catalogDir, '102-main.webp'));

  console.log('✓ Successfully generated all high-resolution silhouette product assets, posters, and category tiles!');
}

run().catch(console.error);
