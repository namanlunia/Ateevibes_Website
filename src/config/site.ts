export interface SocialLink {
  name: string;
  url: string;
  isPlaceholder: boolean;
  ariaLabel: string;
}

// PLACEHOLDER: Business details to be confirmed before launch (tracked in /TODO.md)
export const siteConfig = {
  name: 'Ateevibes',
  tagline: 'Feel the Vibes',
  supportingLines: [
    'Same Print, Different Vibes',
    'Style. Comfort. Quality.',
  ],
  description: "Ateevibes - Feel the Vibes. India's premium men's T-shirt brand bringing contemporary fits, unmatched comfort, and vibrant styles.",
  url: import.meta.env.VITE_SITE_URL || 'https://ateevibes.com',
  ogImage: '/brand/logo.png',
  contact: {
    email: 'support@ateevibes.com',
    emailIsPlaceholder: false, // Confirmed support email
    phone: '+91 98765 43210',
    phoneIsPlaceholder: true, // Hidden from customer UI until confirmed
    whatsapp: '+91 98765 43210',
    whatsappIsPlaceholder: true, // Floating button and contact cards hidden until confirmed
    whatsappMessage: 'Hi Ateevibes team! I would like to know more about your collection.',
    address: 'Mumbai, Maharashtra 400001, India',
    addressIsPlaceholder: true, // Specific address hidden from customers until verified
    businessHours: 'Mon - Sat: 10:00 AM - 7:00 PM IST',
    businessHoursIsPlaceholder: false,
  },
  legal: {
    companyName: 'Ateevibes Apparels LLP',
    companyNameIsPlaceholder: true,
    cinOrGstin: '24AAACA0000A1Z5',
    cinOrGstinIsPlaceholder: true, // Omitted from customer UI, invoices & legal pages until verified (state code 27 for Maharashtra)
  },
  socials: {
    facebook: {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61579257735135',
      isPlaceholder: false,
      ariaLabel: 'Ateevibes on Facebook (opens in a new tab)',
    },
    x: {
      name: 'X',
      url: 'https://x.com/Adsarmataji_ind',
      isPlaceholder: false,
      ariaLabel: 'Ateevibes on X (opens in a new tab)',
    },
    instagram: {
      name: 'Instagram',
      url: 'https://www.instagram.com/ateevibes/',
      isPlaceholder: false,
      ariaLabel: 'Ateevibes on Instagram (opens in a new tab)',
    },
    youtube: {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Ateevibes',
      isPlaceholder: false,
      ariaLabel: 'Ateevibes on YouTube (opens in a new tab)',
    },
  },
  announcements: [
    'Free shipping on all orders over ₹1,499',
    'New drops weekly — Feel the Vibes',
    'Style. Comfort. Quality. Same Print, Different Vibes',
  ],
};

export type SocialKey = keyof typeof siteConfig.socials;

export const activeSocials: Array<{ key: SocialKey } & SocialLink> = (
  Object.entries(siteConfig.socials) as [SocialKey, SocialLink][]
)
  .filter(([, config]) => !config.isPlaceholder)
  .map(([key, config]) => ({ key, ...config }));
