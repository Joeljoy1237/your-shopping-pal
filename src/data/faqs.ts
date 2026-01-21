export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'shipping' | 'returns' | 'payment' | 'products' | 'account';
}

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How long does shipping take?',
    answer: '**Standard Delivery**: 5-7 business days (Free over $50)\n**Express Delivery**: 2-3 business days ($9.99)\n**Next Day**: Order by 2 PM for next-day delivery ($19.99)',
    category: 'shipping',
  },
  {
    id: '2',
    question: 'What is your return policy?',
    answer: 'We offer a **30-day return policy**. Items must be in original packaging with all accessories. Free returns on defective items. Refunds are processed within 24 hours of receiving the return.',
    category: 'returns',
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption.',
    category: 'payment',
  },
  {
    id: '4',
    question: 'Do products come with a warranty?',
    answer: 'Yes! All electronics come with a **1-year manufacturer warranty**. Premium products include a **2-year warranty**. Warranty covers manufacturing defects and hardware malfunctions.',
    category: 'products',
  },
  {
    id: '5',
    question: 'How do I track my order?',
    answer: 'You can track your order by clicking "Track Order" in the menu and entering your Order ID (e.g., ORD-12345). You\'ll receive tracking updates via email as well.',
    category: 'shipping',
  },
  {
    id: '6',
    question: 'Can I cancel or modify my order?',
    answer: 'Orders can be cancelled or modified within **1 hour** of placement. After that, the order enters processing. Contact our support team immediately for urgent changes.',
    category: 'shipping',
  },
  {
    id: '7',
    question: 'Do you offer international shipping?',
    answer: 'Yes! We ship to over 50 countries. International shipping rates and delivery times vary by destination. Customs fees may apply depending on your country.',
    category: 'shipping',
  },
  {
    id: '8',
    question: 'How do I create an account?',
    answer: 'Click the **Sign In** button in the navigation bar, then select "Sign Up". Enter your email and create a password. Your account lets you track orders and save your cart.',
    category: 'account',
  },
];
