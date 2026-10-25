import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { siteConfig, activeSocials } from '../config/site';
import { generateOrganizationJsonLd } from '../lib/seo';

describe('Footer Social Links & Configuration', () => {
  it('renders exactly two social anchors for Facebook and X', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const facebookLink = screen.getByRole('link', {
      name: 'Ateevibes on Facebook (opens in a new tab)',
    });
    const xLink = screen.getByRole('link', {
      name: 'Ateevibes on X (opens in a new tab)',
    });

    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61579257735135');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(xLink).toBeInTheDocument();
    expect(xLink).toHaveAttribute('href', 'https://x.com/Adsarmataji_ind');
    expect(xLink).toHaveAttribute('target', '_blank');
    expect(xLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Instagram and YouTube must NOT be rendered
    expect(screen.queryByRole('link', { name: /instagram/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /youtube/i })).not.toBeInTheDocument();

    // Verify exactly 2 social anchors in the social links container
    const allSocialAnchors = screen.getAllByRole('link', { name: /opens in a new tab/i });
    expect(allSocialAnchors).toHaveLength(2);
  });

  it('only includes active non-placeholder social URLs in JSON-LD sameAs schema', () => {
    const jsonLd = generateOrganizationJsonLd();

    expect(jsonLd.sameAs).toEqual([
      'https://www.facebook.com/profile.php?id=61579257735135',
      'https://x.com/Adsarmataji_ind',
    ]);

    expect(jsonLd.sameAs).not.toContain(siteConfig.socials.instagram.url);
    expect(jsonLd.sameAs).not.toContain(siteConfig.socials.youtube.url);
  });

  it('activeSocials filtered list contains only non-placeholder entries with correct schema', () => {
    expect(activeSocials).toHaveLength(2);
    expect(activeSocials.map((s) => s.key)).toEqual(['facebook', 'x']);
    expect(activeSocials.every((s) => !s.isPlaceholder)).toBe(true);

    expect(siteConfig.socials.instagram.isPlaceholder).toBe(true);
    expect(siteConfig.socials.youtube.isPlaceholder).toBe(true);
  });
});
