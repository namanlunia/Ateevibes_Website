import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { WhatsAppFloat } from '../components/layout/WhatsAppFloat';
import { generateOrganizationJsonLd } from '../lib/seo';
import { ContactPage } from '../pages/ContactPage';

describe('Placeholder Business Details Protection', () => {
  it('publishes confirmed contact details while keeping unconfirmed ones placeholder', () => {
    expect(siteConfig.contact.email).toBe('ateevibes@gmail.com');
    expect(siteConfig.contact.emailIsPlaceholder).toBe(false);
    expect(siteConfig.contact.phone).toBe('+91 7378475666');
    expect(siteConfig.contact.phoneIsPlaceholder).toBe(false);
    expect(siteConfig.contact.whatsapp).toBe('+91 7378475666');
    expect(siteConfig.contact.whatsappIsPlaceholder).toBe(false);
    expect(siteConfig.contact.addressIsPlaceholder).toBe(true);
    expect(siteConfig.legal.cinOrGstinIsPlaceholder).toBe(true);
    expect(siteConfig.legal.companyNameIsPlaceholder).toBe(true);
  });

  it('renders WhatsAppFloat with the confirmed company number', () => {
    const { container } = render(
      <MemoryRouter>
        <WhatsAppFloat />
      </MemoryRouter>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toContain('wa.me/917378475666');
  });

  it('includes telephone and email in organization SEO schema when confirmed', () => {
    const schema = generateOrganizationJsonLd();
    expect(schema.contactPoint).toBeDefined();
    expect((schema.contactPoint as any).telephone).toBe('+91 7378475666');
    expect((schema.contactPoint as any).email).toBe('ateevibes@gmail.com');
  });

  it('shows the WhatsApp concierge card and confirmed email on ContactPage', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Instant WhatsApp Concierge/i)).toBeInTheDocument();
    expect(screen.getByText(/Email Concierge/i)).toBeInTheDocument();
    expect(screen.getByText('ateevibes@gmail.com')).toBeInTheDocument();
  });
});
