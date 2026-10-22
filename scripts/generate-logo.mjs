import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const brandDir = path.resolve('public/brand');
fs.mkdirSync(brandDir, { recursive: true });

// Official Logo: Black and Gold Bolt-"A" with ATEEVIBES Wordmark
const logoSvg = `
<svg width="480" height="120" viewBox="0 0 480 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gold metallic gradient for bolt -->
    <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5E084" />
      <stop offset="35%" stop-color="#D4AF37" />
      <stop offset="70%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#F3E5AB" />
    </linearGradient>

    <!-- Deep black badge gradient -->
    <linearGradient id="badgeBlack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#242B22" />
      <stop offset="100%" stop-color="#121611" />
    </linearGradient>

    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#AA7C11" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Left: Black & Gold Bolt-"A" Emblem (84x84) -->
  <g transform="translate(14, 18)">
    <!-- Rounded Emblem Base -->
    <rect width="84" height="84" rx="22" fill="url(#badgeBlack)" stroke="url(#goldMetallic)" stroke-width="2" />
    
    <!-- Outer accent ring inside emblem -->
    <rect x="5" y="5" width="74" height="74" rx="17" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.2" />

    <!-- Stylized "A" + Gold Lightning Bolt Mark -->
    <!-- Left leg of A -->
    <path d="M 42 16 L 22 68 L 31 68 L 37.5 50 L 46.5 50 Z" fill="#FFFFFF" />
    
    <!-- Right leg of A -->
    <path d="M 42 16 L 62 68 L 53 68 L 47.5 53 Z" fill="#FFFFFF" opacity="0.85" />
    
    <!-- Gold Lightning Bolt as the dynamic crossbar of A -->
    <polygon
      points="48,34 30,51 41,51 35,66 54,47 43,47"
      fill="url(#goldMetallic)"
      filter="url(#goldGlow)"
    />
  </g>

  <!-- Right: Typography Wordmark & Tagline -->
  <g transform="translate(118, 22)">
    <!-- ATEEVIBES Title -->
    <text
      x="0"
      y="44"
      font-family="'Playfair Display', Georgia, serif"
      font-size="40"
      font-weight="900"
      letter-spacing="0.1em"
      fill="#1C241A"
    >
      ATEEVIBES
    </text>

    <!-- FEEL THE VIBES Tagline -->
    <text
      x="2"
      y="66"
      font-family="'DM Sans', system-ui, sans-serif"
      font-size="12"
      font-weight="700"
      letter-spacing="0.28em"
      fill="#AA7C11"
    >
      FEEL THE VIBES
    </text>
  </g>
</svg>
`;

// Also generate a compact square emblem for favicon / avatars
const emblemSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldMetallic2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5E084" />
      <stop offset="35%" stop-color="#D4AF37" />
      <stop offset="70%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#F3E5AB" />
    </linearGradient>
    <linearGradient id="badgeBlack2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#242B22" />
      <stop offset="100%" stop-color="#121611" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="64" fill="url(#badgeBlack2)" stroke="url(#goldMetallic2)" stroke-width="6" />
  <rect x="16" y="16" width="224" height="224" rx="48" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
  
  <g transform="translate(28, 28) scale(2.38)">
    <path d="M 42 16 L 22 68 L 31 68 L 37.5 50 L 46.5 50 Z" fill="#FFFFFF" />
    <path d="M 42 16 L 62 68 L 53 68 L 47.5 53 Z" fill="#FFFFFF" opacity="0.85" />
    <polygon points="48,34 30,51 41,51 35,66 54,47 43,47" fill="url(#goldMetallic2)" />
  </g>
</svg>
`;

async function main() {
  await sharp(Buffer.from(logoSvg))
    .png({ quality: 95 })
    .toFile(path.join(brandDir, 'logo.png'));

  fs.writeFileSync(path.join(brandDir, 'logo.svg'), logoSvg.trim());
  fs.writeFileSync(path.join(brandDir, 'emblem.svg'), emblemSvg.trim());

  await sharp(Buffer.from(emblemSvg))
    .png({ quality: 95 })
    .toFile(path.join(brandDir, 'emblem.png'));

  console.log('✓ Generated official black and gold bolt-A logo: /public/brand/logo.png');
}

main().catch(console.error);
