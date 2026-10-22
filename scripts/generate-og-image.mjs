import sharp from 'sharp';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cdf0a7" />
      <stop offset="50%" stop-color="#faf3d0" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#flow)" />
  <circle cx="200" cy="150" r="140" fill="#8fbf5a" fill-opacity="0.25" />
  <circle cx="1050" cy="500" r="160" fill="#cdf0a7" fill-opacity="0.35" />
  <rect x="60" y="60" width="1080" height="510" rx="36" fill="rgba(255, 255, 255, 0.75)" stroke="#e4e8d6" stroke-width="2" />
  <g transform="translate(600, 240)">
    <circle cx="0" cy="0" r="54" fill="#1c241a" />
    <path d="M-18 18 L0 -20 L18 18 L6 18 L0 2 L-6 18 Z" fill="#faf3d0" />
  </g>
  <text x="600" y="360" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="900" fill="#1c241a" letter-spacing="6">ATEEVIBES</text>
  <text x="600" y="410" text-anchor="middle" font-family="'DM Sans', system-ui, sans-serif" font-size="18" font-weight="700" fill="#4d7a2a" letter-spacing="4">FEEL THE VIBES • STYLE. COMFORT. QUALITY.</text>
  <text x="600" y="460" text-anchor="middle" font-family="'DM Sans', system-ui, sans-serif" font-size="16" fill="#556150">Premium Men's T-Shirts • China Jacquards • Textured Knits • Graphic Drops</text>
</svg>
`;

await sharp(Buffer.from(svg))
  .png({ quality: 90 })
  .toFile('public/brand/og-image.png');

console.log('Successfully generated public/brand/og-image.png');
