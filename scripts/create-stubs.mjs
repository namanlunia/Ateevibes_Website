import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('src/pages');
fs.mkdirSync(pagesDir, { recursive: true });

const pages = [
  { file: 'ShopPage.tsx', name: 'ShopPage', title: 'All T-Shirts', desc: 'Browse our complete catalog with dynamic filters.' },
  { file: 'ProductPage.tsx', name: 'ProductPage', title: 'Product Detail', desc: 'Comprehensive product view with gallery and size selector.' },
  { file: 'CartPage.tsx', name: 'CartPage', title: 'Shopping Bag', desc: 'Review your items, apply promo codes, and check shipping.' },
  { file: 'CheckoutPage.tsx', name: 'CheckoutPage', title: 'Checkout', desc: 'Multi-step demo checkout with UPI, Card, Netbanking, and COD.' },
  { file: 'OrderConfirmationPage.tsx', name: 'OrderConfirmationPage', title: 'Order Confirmed', desc: 'Thank you for your order! Your vibes are on the way.' },
  { file: 'WishlistPage.tsx', name: 'WishlistPage', title: 'My Wishlist', desc: 'Saved products for your next rotation.' },
  { file: 'TrackOrderPage.tsx', name: 'TrackOrderPage', title: 'Track Your Order', desc: 'Check dynamic order progress and estimated delivery.' },
  { file: 'LoginPage.tsx', name: 'LoginPage', title: 'Account Login', desc: 'Sign in to access your orders, saved addresses, and wishlist.' },
  { file: 'SignupPage.tsx', name: 'SignupPage', title: 'Create Account', desc: 'Join the Ateevibes community for exclusive perks.' },
  { file: 'AccountPage.tsx', name: 'AccountPage', title: 'My Account', desc: 'Manage your profile and account settings.' },
  { file: 'AccountOrdersPage.tsx', name: 'AccountOrdersPage', title: 'My Orders', desc: 'View current and past orders with full status tracking.' },
  { file: 'AccountOrderDetailPage.tsx', name: 'AccountOrderDetailPage', title: 'Order Details', desc: 'Itemized invoice and tracking timeline for this order.' },
  { file: 'AccountAddressesPage.tsx', name: 'AccountAddressesPage', title: 'Saved Addresses', desc: 'Manage your shipping and billing addresses.' },
  { file: 'AboutPage.tsx', name: 'AboutPage', title: 'Our Story', desc: 'Style. Comfort. Quality. The philosophy behind Ateevibes.' },
  { file: 'ContactPage.tsx', name: 'ContactPage', title: 'Contact Us', desc: 'Get in touch with our team in Surat, Gujarat.' },
  { file: 'FAQPage.tsx', name: 'FAQPage', title: 'Frequently Asked Questions', desc: 'Everything you need to know about ordering, delivery, and fabric care.' },
  { file: 'ShippingReturnsPage.tsx', name: 'ShippingReturnsPage', title: 'Shipping & Returns', desc: 'Transparent policies on delivery timelines and 7-day returns.' },
  { file: 'SizeGuidePage.tsx', name: 'SizeGuidePage', title: 'Size & Fit Guide', desc: 'Detailed chest, shoulder, and length measurements in inches and cm.' },
  { file: 'PrivacyPage.tsx', name: 'PrivacyPage', title: 'Privacy Policy', desc: 'Standard data protection and privacy guidelines.' },
  { file: 'TermsPage.tsx', name: 'TermsPage', title: 'Terms of Service', desc: 'Standard commercial and website terms.' },
  { file: 'NotFoundPage.tsx', name: 'NotFoundPage', title: 'Page Not Found (404)', desc: 'The page you are looking for has taken a vacation.' },
];

for (const p of pages) {
  const filePath = path.join(pagesDir, p.file);
  if (fs.existsSync(filePath)) continue;

  const content = `import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ${p.name}: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 hover:text-ink-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
      <div className="bg-surface-tint rounded-3xl p-8 sm:p-12 border border-border">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 mb-3">${p.title}</h1>
        <p className="text-sm sm:text-base text-ink-600 max-w-xl">${p.desc}</p>
      </div>
    </div>
  );
};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Created stub ${p.file}`);
}
