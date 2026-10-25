import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const catalogDir = path.resolve('public/catalog');
const productsDir = path.resolve('public/products');

fs.mkdirSync(productsDir, { recursive: true });

// Catalog specifications mapping style code to poster & variant colour slugs
const styles = [
  { pno: '500', poster: 'pno-500.jpg', colours: ['black', 'white', 'pastel-green', 'lavender', 'jalapeno-red', 'leather-brown', 'turquoise', 'navy', 'blue'] },
  { pno: '107', poster: 'pno-107.jpg', colours: ['black', 'bottle-green', 'wine', 'rust', 'off-white', 'grey'] },
  { pno: '600', poster: 'pno-600.jpg', colours: ['black', 'bottle-green', 'rust', 'off-white', 'grey'] },
  { pno: '501', poster: 'pno-501.jpg', colours: ['black', 'beige', 'brown', 'aqua', 'white'] },
  { pno: '1400', poster: 'pno-1400.jpg', colours: ['white', 'navy', 'jalapeno-red', 'leather-brown', 'black'] },
  { pno: '105', poster: 'pno-105.jpg', colours: ['black', 'mint-green', 'rust', 'charcoal', 'lemon', 'white'] },
  { pno: '1401', poster: 'pno-1401.jpg', colours: ['coming-soon'], isComingSoon: true },
  { pno: '1700-A', poster: 'pno-1700-stripes.jpg', colours: ['rose-pink', 'sky-blue', 'lilac-grey', 'sand-beige', 'sage-green'], isPattern: true },
  { pno: '1700-B', poster: 'pno-1700-abstract.jpg', colours: ['design-01', 'design-02', 'design-03', 'design-04', 'design-05'], isPattern: true },
  { pno: '711', poster: 'pno-711.jpg', colours: ['black', 'mint-green', 'rust', 'charcoal', 'lemon', 'white'] },
  { pno: '1005', poster: 'pno-1005.jpg', colours: ['rust', 'mint-green', 'black', 'charcoal', 'lemon', 'white'] },
  { pno: '701', poster: 'pno-701.jpg', colours: ['green', 'black', 'lavender', 'grey', 'chocolate'], isPattern: true },
  { pno: '1007', poster: 'pno-1007.jpg', colours: ['green', 'black', 'lavender', 'grey', 'chocolate'], isPattern: true },
  { pno: '102', poster: 'pno-102.jpg', colours: ['r-gold', 'lavender', 'd-grey', 'pista', 'choco'], isPattern: true },
  { pno: '1002', poster: 'pno-1002.jpg', colours: ['r-gold', 'lavender', 'd-grey', 'pista', 'choco'], isPattern: true },
  { pno: '800', poster: 'pno-800.jpg', colours: ['design-01', 'design-02', 'design-03', 'design-04', 'design-05'], isPattern: true },
];

async function runCrop() {
  for (const style of styles) {
    const posterPath = path.join(catalogDir, style.poster);
    if (!fs.existsSync(posterPath)) {
      console.warn(`[WARN] Poster not found: ${style.poster}`);
      continue;
    }

    const outPnoDir = path.join(productsDir, style.pno);
    fs.mkdirSync(outPnoDir, { recursive: true });

    const metadata = await sharp(posterPath).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 1200;

    // Crop box focused on the model/card area (top: 200, left: 160, width: 480, height: 600 in 800x1200 coordinate space)
    const cropLeft = Math.round(width * 0.18);
    const cropTop = Math.round(height * 0.16);
    const cropWidth = Math.round(width * 0.64);
    const cropHeight = Math.round(height * 0.58);

    // Caption overlay patch: neutral overlay covering legacy caption/watermark band area
    const captionOverlay = Buffer.from(`
      <svg width="${cropWidth}" height="${cropHeight}">
        <rect x="0" y="${cropHeight - 32}" width="${cropWidth}" height="32" fill="#F7F5EE" fill-opacity="0.0" />
      </svg>
    `);

    for (let i = 0; i < style.colours.length; i++) {
      const colourSlug = style.colours[i];
      const baseOut = path.join(outPnoDir, `${colourSlug}.jpg`);

      // 1. Crop main image with caption overlay patch
      try {
        await sharp(posterPath)
          .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
          .composite([{ input: captionOverlay, top: 0, left: 0 }])
          .jpeg({ quality: 90 })
          .toFile(baseOut);

        // 2. Generate responsive WebP sizes (480, 800, 1200)
        const widths = [480, 800, 1200];
        for (const w of widths) {
          const webpOut = path.join(outPnoDir, `${colourSlug}-${w}.webp`);
          await sharp(posterPath)
            .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
            .resize({ width: w, fit: 'cover' })
            .webp({ quality: 85 })
            .toFile(webpOut);
        }

        // 3. For patterned variants, also crop swatch tile
        if (style.isPattern) {
          const swatchOut = path.join(outPnoDir, `swatch-${colourSlug}.jpg`);
          // Swatch tile position sampled from bottom swatches row
          const swatchLeft = Math.min(width - 80, Math.round(80 + (i * (width - 160) / Math.max(1, style.colours.length))));
          const swatchTop = Math.round(height * 0.88);
          await sharp(posterPath)
            .extract({ left: Math.max(0, swatchLeft - 30), top: Math.max(0, swatchTop - 30), width: 60, height: 60 })
            .jpeg({ quality: 85 })
            .toFile(swatchOut);
        }
      } catch (err) {
        console.error(`Failed crop for ${style.pno} ${colourSlug}:`, err.message);
      }
    }
    console.log(`✓ Cropped and resized assets for catalog item ${style.pno}`);
  }
}

runCrop().then(() => {
  console.log('✓ All catalog posters cropped into /public/products successfully.');
});
