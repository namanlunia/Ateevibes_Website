import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { WhatsAppFloat } from '../components/layout/WhatsAppFloat';
import { generateOrganizationJsonLd } from '../lib/seo';
import { ContactPage } from '../pages/ContactPage';

describe('Placeholder Business Details Protection', () => {
  it('has placeholder flags enabled for unconfirmed business details', () => {
    expect(siteConfig.contact.phoneIsPlaceholder).toBe(true);
    expect(siteConfig.contact.whatsappIsPlaceholder).toBe(true);
    expect(siteConfig.contact.addressIsPlaceholder).toBe(true);
    expect(siteConfig.legal.cinOrGstinIsPlaceholder).toBe(true);
    expect(siteConfig.legal.companyNameIsPlaceholder).toBe(true);
  });

  it('hides WhatsAppFloat component when whatsappIsPlaceholder is true', () => {
    const { container } = render(
      <MemoryRouter>
        <WhatsAppFloat />
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('omits telephone from organization SEO schema when phoneIsPlaceholder is true', () => {
    const schema = generateOrganizationJsonLd();
    expect(schema.contactPoint).toBeDefined();
    expect((schema.contactPoint as any).telephone).toBeUndefined();
  });

  it('hides WhatsApp concierge card on ContactPage when whatsappIsPlaceholder is true', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Instant WhatsApp Concierge/i)).toBeNull();
    // Confirmed email concierge is visible
    expect(screen.getByText(/Email Concierge/i)).toBeInTheDocument();
  });
});
