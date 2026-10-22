export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  subCategories: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-round-neck',
    slug: 'round-neck',
    name: 'Round Neck Tees',
    tagline: 'Classic comfort reimagined',
    description: 'Everyday elevated essentials in matty, 2-way stretch, imported tencil, and waffle textures.',
    image: '/products/500/pastel-green.jpg',
    subCategories: [
      { id: 'sub-matty', slug: 'matty', name: 'Matty Round Neck', description: 'Ultra soft matty fabric for all-day comfort.' },
      { id: 'sub-2-way', slug: '2-way', name: '2-Way Round Neck', description: 'Engineered 2-way stretch with breathable recovery.' },
      { id: 'sub-tencil', slug: 'tencil', name: 'Tencil Round Neck', description: 'Silky smooth imported tencil fabric.' },
      { id: 'sub-waffle', slug: 'waffle', name: 'Waffle Round Neck', description: 'Textured honeycomb waffle weave with a modern drape.' },
    ],
  },
  {
    id: 'cat-polo-collar',
    slug: 'polo-collar',
    name: 'Polo & Collar Tees',
    tagline: 'Effortless smart-casual vibes',
    description: 'Refined collars with premium knits including matty, jacquard, waffle, and artistic printed accents.',
    image: '/products/1400/white.jpg',
    subCategories: [
      { id: 'sub-matty-polo', slug: 'matty-polo', name: 'Matty Polo', description: 'Crisp collar polo in our signature matty knit.' },
      { id: 'sub-jacquard-polo', slug: 'jacquard-polo', name: 'Jacquard Polo', description: 'Geometric textured knit with a structured collar.' },
      { id: 'sub-waffle-polo', slug: 'waffle-polo', name: 'Waffle Polo', description: 'Honeycomb knit collar tee (Coming Soon).' },
      { id: 'sub-printed-collar', slug: 'printed-collar', name: 'Printed Collar Polo', description: 'Gradient stripes and abstract motifs on premium collar knits.' },
    ],
  },
  {
    id: 'cat-jacquard',
    slug: 'jacquard',
    name: 'Jacquard Tees',
    tagline: 'Dimensional knit craftsmanship',
    description: 'Intricately woven textures and royal patterns in both half and full sleeve silhouettes.',
    image: '/products/1007/green.jpg',
    subCategories: [
      { id: 'sub-jacquard-half', slug: 'half-sleeve', name: 'Jacquard Half Sleeve', description: 'Breathable textured weave designed for Indian summers.' },
      { id: 'sub-jacquard-full', slug: 'full-sleeve', name: 'Jacquard Full Sleeve', description: 'Structured full-sleeve jacquard for cooler days and evening vibes.' },
      { id: 'sub-royal-half', slug: 'royal-print-half-sleeve', name: 'Royal Print Half Sleeve', description: 'China jacquard knit with regal abstract texture.' },
      { id: 'sub-royal-full', slug: 'royal-print-full-sleeve', name: 'Royal Print Full Sleeve', description: 'Flagship China jacquard full sleeve tee with modern contour fit.' },
    ],
  },
  {
    id: 'cat-printed',
    slug: 'printed',
    name: 'Printed Tees',
    tagline: 'Same print, different vibes',
    description: 'Vibrant, bright and long-lasting tie-dye, brushstrokes, and contemporary printed designs.',
    image: '/products/102/r-gold.jpg',
    subCategories: [
      { id: 'sub-tai-dai-half', slug: 'tai-dai-half-sleeve', name: 'Tai Dai Print Half Sleeve', description: 'Soft moisture-friendly tie-dye in half sleeve.' },
      { id: 'sub-tai-dai-full', slug: 'tai-dai-full-sleeve', name: 'Tai Dai Print Full Sleeve', description: 'Dynamic tie-dye prints on stretch full-sleeve knit.' },
      { id: 'sub-premium-printed', slug: 'premium-printed-round-neck', name: 'Premium Printed Round Neck', description: 'Bold brushstrokes and modern graphic textures.' },
    ],
  },
];

export const QUICK_COLLECTIONS = [
  {
    slug: 'full-sleeve',
    name: 'Full Sleeve Collection',
    tagline: 'Year-round layering & structured fits',
    description: 'Explore our full-sleeve lineup in China jacquard, tai-dai prints, and textured knits.',
    filterTag: 'full-sleeve',
  },
  {
    slug: 'new-arrivals',
    name: 'New Arrivals',
    tagline: 'Fresh drops straight from the atelier',
    description: 'Discover the latest additions to the Ateevibes rotation.',
    filterTag: 'new-arrival',
  },
  {
    slug: 'best-sellers',
    name: 'Best Sellers',
    tagline: 'Community favourites that set the vibe',
    description: 'Our most-wanted t-shirts, trusted for comfort and lasting quality.',
    filterTag: 'best-seller',
  },
];
