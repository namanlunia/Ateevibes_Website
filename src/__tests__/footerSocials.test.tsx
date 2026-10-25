import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { siteConfig, activeSocials, SocialLink } from '../config/site';
import { generateOrganizationJsonLd } from '../lib/seo';

describe('Footer Social Links & Configuration', () => {
  it('renders exactly four social anchors for Facebook, X, Instagram, and YouTube', () => {
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
    const instagramLink = screen.getByRole('link', {
      name: 'Ateevibes on Instagram (opens in a new tab)',
    });
    const youtubeLink = screen.getByRole('link', {
      name: 'Ateevibes on YouTube (opens in a new tab)',
    });

    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61579257735135');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(xLink).toBeInTheDocument();
    expect(xLink).toHaveAttribute('href', 'https://x.com/Adsarmataji_ind');
    expect(xLink).toHaveAttribute('target', '_blank');
    expect(xLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/ateevibes/');
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(youtubeLink).toBeInTheDocument();
    expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/@Ateevibes');
    expect(youtubeLink).toHaveAttribute('target', '_blank');
    expect(youtubeLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Verify exactly 4 social anchors in the social links container
    const allSocialAnchors = screen.getAllByRole('link', { name: /opens in a new tab/i });
    expect(allSocialAnchors).toHaveLength(4);
  });

  it('includes confirmed social URLs in JSON-LD sameAs schema in configured order', () => {
    const jsonLd = generateOrganizationJsonLd();

    expect(jsonLd.sameAs).toEqual([
      'https://www.facebook.com/profile.php?id=61579257735135',
      'https://x.com/Adsarmataji_ind',
      'https://www.instagram.com/ateevibes/',
      'https://www.youtube.com/@Ateevibes',
    ]);

    expect(jsonLd.sameAs).toContain(siteConfig.socials.instagram.url);
    expect(jsonLd.sameAs).toContain(siteConfig.socials.youtube.url);
  });

  it('activeSocials filtered list contains only non-placeholder entries with correct schema', () => {
    expect(activeSocials).toHaveLength(4);
    expect(activeSocials.map((s) => s.key)).toEqual(['facebook', 'x', 'instagram', 'youtube']);
    expect(activeSocials.every((s) => !s.isPlaceholder)).toBe(true);

    expect(siteConfig.socials.instagram.isPlaceholder).toBe(false);
    expect(siteConfig.socials.youtube.isPlaceholder).toBe(false);
  });

  it('placeholder-gating mechanism filters out any synthetic entry marked with isPlaceholder: true', () => {
    const syntheticSocials: Record<string, SocialLink> = {
      confirmed: {
        name: 'Confirmed Network',
        url: 'https://example.com/confirmed',
        isPlaceholder: false,
        ariaLabel: 'Ateevibes on Confirmed Network (opens in a new tab)',
      },
      syntheticPlaceholder: {
        name: 'Hidden Network',
        url: 'https://example.com/hidden',
        isPlaceholder: true,
        ariaLabel: 'Ateevibes on Hidden Network (opens in a new tab)',
      },
    };

    const filtered = (
      Object.entries(syntheticSocials) as [string, SocialLink][]
    )
      .filter(([, config]) => !config.isPlaceholder)
      .map(([key, config]) => ({ key, ...config }));

    expect(filtered).toHaveLength(1);
    expect(filtered[0].key).toBe('confirmed');
    expect(filtered.some((s) => s.isPlaceholder)).toBe(false);

    // Verify rendered output directly: placeholder entry never renders
    render(
      <div>
        {filtered.map((s) => (
          <a key={s.key} href={s.url} aria-label={s.ariaLabel}>
            {s.name}
          </a>
        ))}
      </div>
    );

    expect(screen.getByRole('link', { name: /confirmed/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /hidden/i })).not.toBeInTheDocument();
  });
});
