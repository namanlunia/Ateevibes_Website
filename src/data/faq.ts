export interface FAQItem {
  id: string;
  category: 'orders' | 'shipping' | 'returns' | 'products' | 'payments';
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  // Orders
  {
    id: 'faq-ord-1',
    category: 'orders',
    question: 'How do I track my order status?',
    answer: 'You can easily track your order using our "Track Order" page by entering your Order ID (format ATV-YYMMDD-####) and your registered email or mobile number.',
  },
  {
    id: 'faq-ord-2',
    category: 'orders',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'Orders can be cancelled or modified before they transition to the "Packed" stage. Please contact our support team via WhatsApp or email with your Order ID as soon as possible.',
  },

  // Shipping
  {
    id: 'faq-ship-1',
    category: 'shipping',
    question: 'What are the delivery charges and free shipping eligibility?',
    answer: 'Standard shipping is completely FREE on all orders of ₹1,499 and above. For orders below ₹1,499, a flat shipping fee of ₹79 is applied at checkout.',
  },
  {
    id: 'faq-ship-2',
    category: 'shipping',
    question: 'How long does delivery take?',
    answer: 'Standard orders are delivered across India in 3 to 7 business days depending on your location. Metro cities typically arrive in 3 to 4 business days.',
  },

  // Returns
  {
    id: 'faq-ret-1',
    category: 'returns',
    question: 'What is your return and exchange policy?',
    answer: 'We offer a hassle-free 7-day return and exchange window from the date of delivery. Items must be unworn, unwashed, and retained with original tags and packaging.',
  },
  {
    id: 'faq-ret-2',
    category: 'returns',
    question: 'How do refunds work for returned items?',
    answer: 'Once your return parcel arrives and passes inspection, prepaid orders are refunded to the original payment source within 3 to 5 working days. Cash on Delivery orders are refunded via direct bank transfer or UPI transfer.',
  },

  // Products & Care
  {
    id: 'faq-prod-1',
    category: 'products',
    question: 'What are the recommended wash and care instructions?',
    answer: 'To preserve vibrant colors and knit texture: machine wash cold on a delicate cycle with like colors. Do not bleach. Dry in shade, and iron inside out on low heat. Do not iron directly over prints.',
  },
  {
    id: 'faq-prod-2',
    category: 'products',
    question: 'Where can I find fabric composition details?',
    answer: 'Exact fabric composition percentages are pending final laboratory verification and currently marked as "Composition: to be confirmed" across our product catalog.',
  },

  // Payments
  {
    id: 'faq-pay-1',
    category: 'payments',
    question: 'What payment options do you support?',
    answer: 'We support all major payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit and Debit cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD fee ₹49 applies).',
  },
  {
    id: 'faq-pay-2',
    category: 'payments',
    question: 'Are product prices inclusive of taxes?',
    answer: 'Yes! All prices listed on Ateevibes are MRPs and inclusive of all applicable taxes. No additional GST is added at checkout.',
  },
];
