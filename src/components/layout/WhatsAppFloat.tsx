import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const WhatsAppFloat: React.FC = () => {
  const cleanPhone = siteConfig.contact.whatsapp.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(siteConfig.contact.whatsappMessage);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 sm:bottom-24 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide">
        Chat with us
      </span>
    </a>
  );
};
