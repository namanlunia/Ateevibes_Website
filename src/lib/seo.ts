import { siteConfig, activeSocials } from '../config/site';
import { Product } from '../types';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'product' | 'article';
  product?: Product;
}

export function generateProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.variants[0]?.images[0] ? `${siteConfig.url}${product.variants[0].images[0]}` : undefined,
    description: product.description,
    sku: `ATV-${product.pno}`,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.mrp,
      availability: product.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/logo.png`,
    sameAs: activeSocials.map((s) => s.url),
    contactPoint: {
      '@type': 'ContactPoint',
      ...(siteConfig.contact.phoneIsPlaceholder ? {} : { telephone: siteConfig.contact.phone }),
      ...(siteConfig.contact.emailIsPlaceholder ? {} : { email: siteConfig.contact.email }),
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };
}
