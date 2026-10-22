// SAMPLE DATA: replace before launch (tracked in /TODO.md)
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  city: string;
  favouriteStyle: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    quote: 'The China Jacquard tee (Style 1007) is unlike any standard t-shirt in my wardrobe. The texture is rich, structured, and yet completely breathable.',
    author: 'Siddharth M.',
    city: 'Mumbai',
    favouriteStyle: 'Style 1007 • China Jacquard',
    rating: 5,
  },
  {
    id: 't-2',
    quote: 'Same print, different vibes is genuinely true. I bought the Tai Dai in R.Gold and Choco, and both feel like distinct personal statements with unreal softness.',
    author: 'Kabir V.',
    city: 'Bengaluru',
    favouriteStyle: 'Style 102 • Tai Dai',
    rating: 5,
  },
  {
    id: 't-3',
    quote: 'The waffle texture holds its shape through full workdays and travel. Unbeatable all-day comfort and modern drape.',
    author: 'Arjun N.',
    city: 'New Delhi',
    favouriteStyle: 'Style 501 • Waffle Round Neck',
    rating: 5,
  },
  {
    id: 't-4',
    quote: 'Finding polos that do not lose collar rigidity after washing used to be difficult until Ateevibes. Premium matty fabric that stays crisp.',
    author: 'Manish T.',
    city: 'Pune',
    favouriteStyle: 'Style 1400 • Matty Polo',
    rating: 5,
  },
];
