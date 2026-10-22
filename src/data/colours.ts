export interface ColourDefinition {
  name: string;
  slug: string;
  hex: string;
  family: 'black' | 'white' | 'blue' | 'green' | 'red' | 'brown' | 'purple' | 'grey' | 'yellow' | 'pattern';
}

export const COLOUR_PALETTE: Record<string, ColourDefinition> = {
  black: { name: 'Black', slug: 'black', hex: '#111111', family: 'black' },
  white: { name: 'White', slug: 'white', hex: '#FFFFFF', family: 'white' },
  'off-white': { name: 'Off-White', slug: 'off-white', hex: '#F4EFE6', family: 'white' },
  'pastel-green': { name: 'Pastel Green', slug: 'pastel-green', hex: '#9BD39B', family: 'green' },
  lavender: { name: 'Lavender', slug: 'lavender', hex: '#B9A5E8', family: 'purple' },
  'jalapeno-red': { name: 'Jalapeno Red', slug: 'jalapeno-red', hex: '#B3202A', family: 'red' },
  'leather-brown': { name: 'Leather Brown', slug: 'leather-brown', hex: '#9A5B2D', family: 'brown' },
  turquoise: { name: 'Turquoise', slug: 'turquoise', hex: '#1FB8A5', family: 'blue' },
  navy: { name: 'Navy', slug: 'navy', hex: '#1B2A4A', family: 'blue' },
  blue: { name: 'Blue', slug: 'blue', hex: '#4C79C6', family: 'blue' },
  'bottle-green': { name: 'Bottle Green', slug: 'bottle-green', hex: '#0E5A6B', family: 'green' },
  wine: { name: 'Wine', slug: 'wine', hex: '#5A1F2E', family: 'red' },
  rust: { name: 'Rust', slug: 'rust', hex: '#9C3B1E', family: 'red' },
  grey: { name: 'Grey', slug: 'grey', hex: '#6F6BA6', family: 'grey' },
  beige: { name: 'Beige', slug: 'beige', hex: '#D9C7A5', family: 'brown' },
  brown: { name: 'Brown', slug: 'brown', hex: '#4A2C1F', family: 'brown' },
  aqua: { name: 'Aqua', slug: 'aqua', hex: '#6FB5BE', family: 'blue' },
  'mint-green': { name: 'Mint Green', slug: 'mint-green', hex: '#8FD1B0', family: 'green' },
  charcoal: { name: 'Charcoal', slug: 'charcoal', hex: '#2F3338', family: 'grey' },
  lemon: { name: 'Lemon', slug: 'lemon', hex: '#D9A62A', family: 'yellow' },
  chocolate: { name: 'Chocolate', slug: 'chocolate', hex: '#8A5A3C', family: 'brown' },
  green: { name: 'Green', slug: 'green', hex: '#1F4D3A', family: 'green' },
  'r-gold': { name: 'R.Gold', slug: 'r-gold', hex: '#E3B88A', family: 'brown' },
  'd-grey': { name: 'D.Grey', slug: 'd-grey', hex: '#8D8D92', family: 'grey' },
  pista: { name: 'Pista', slug: 'pista', hex: '#A9D6C0', family: 'green' },
  choco: { name: 'Choco', slug: 'choco', hex: '#8C5A4A', family: 'brown' },
  'rose-pink': { name: 'Rose Pink', slug: 'rose-pink', hex: '#D890A8', family: 'red' },
  'sky-blue': { name: 'Sky Blue', slug: 'sky-blue', hex: '#7DB6E3', family: 'blue' },
  'lilac-grey': { name: 'Lilac Grey', slug: 'lilac-grey', hex: '#9A96B8', family: 'purple' },
  'sand-beige': { name: 'Sand Beige', slug: 'sand-beige', hex: '#D2B48C', family: 'brown' },
  'sage-green': { name: 'Sage Green', slug: 'sage-green', hex: '#A8C4A2', family: 'green' },
  // Pattern designs
  'design-01': { name: 'Design 01', slug: 'design-01', hex: '#1B2A4A', family: 'pattern' },
  'design-02': { name: 'Design 02', slug: 'design-02', hex: '#1F4D3A', family: 'pattern' },
  'design-03': { name: 'Design 03', slug: 'design-03', hex: '#4C79C6', family: 'pattern' },
  'design-04': { name: 'Design 04', slug: 'design-04', hex: '#8D8D92', family: 'pattern' },
  'design-05': { name: 'Design 05', slug: 'design-05', hex: '#D9A62A', family: 'pattern' },
};
