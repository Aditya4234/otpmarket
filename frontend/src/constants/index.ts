import type { NavLink, FooterColumn, Platform, FAQ, Testimonial, FeatureCard } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Feature', href: '#Feature' },
  { name: 'Pricing', href: '#Pricing' },
  { name: 'Support', href: '#Support' },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '#faq' },
      { name: 'API Documentation', href: '/api-docs' },
    ],
  },
  {
    title: 'Popular Services',
    links: [
      { name: 'WhatsApp', href: '/services/whatsapp' },
      { name: 'Telegram', href: '/services/telegram' },
      { name: 'Facebook', href: '/services/facebook' },
      { name: 'Instagram', href: '/services/instagram' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

export const PLATFORMS: Platform[] = [
  { name: 'WhatsApp', color: '#25D366' },
  { name: 'Telegram', color: '#0088cc' },
  { name: 'Facebook', color: '#1877f2' },
  { name: 'Instagram', color: '#E4405F' },
  { name: 'Gmail', color: '#EA4335' },
  { name: 'Tinder', color: '#FF6B6B' },
  { name: 'And More', color: '#804dee' },
];

export const FAQS: FAQ[] = [
  {
    question: 'What is OTP is delayed?',
    answer:
      "If OTP is not received in 10 minutes, refund is automatic, and the number is deleted. Our system handles this process automatically so you don't have to worry about lost funds",
  },
  {
    question: 'Is this service secure?',
    answer:
      'Yes – your account is protected with session tokens, firewalls, and HTTPS. We take security seriously and implement industry-standard practices to keep your data safe',
  },
  {
    question: 'What payment do you support?',
    answer:
      'We support Razorpay, PayPal, and USDT (ERC20 / TRC20). This gives you flexibility to choose your preferred payment method for adding funds to your account.',
  },
  {
    question: 'How long can I use the virtual number?',
    answer:
      'Virtual numbers are temporary and typically available for receiving the OTP only. Once the OTP is received or the 10-minute window passes, the number is released back to our system.',
  },
  {
    question: 'Can I get numbers for multiple countries?',
    answer:
      'Yes, we provide virtual numbers from multiple countries. You can select your preferred country when purchasing a number for OTP verification.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    metric: '500+',
    quote: "I've been using OTP MART for 6 months and never had any issues. Highly recommend!",
    author: 'Michael Chen',
  },
  {
    metric: '100K+',
    quote: 'OTP arrived in just 3 seconds! This service is absolutely amazing and reliable.',
    author: 'John Smith',
  },
  {
    metric: '99.9%',
    quote: "Refund was instant when OTP didn't come. Great customer service and transparency!",
    author: 'Emma Johnson',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Sign Up & Recharge',
    description: 'Create an account and add funds using your preferred payment method.',
  },
  {
    step: 2,
    title: 'Choose platform & Country',
    description: 'Select your desired service and country for verification',
  },
  {
    step: 3,
    title: 'Receive OTP',
    description: 'Get your OTP instantly or receive automatic refund in 10 minutes',
  },
];

export const FEATURES: Omit<FeatureCard, 'icon'>[] = [
  {
    title: 'Auto Refund',
    description: 'Automatic refund if no OTP within 10 minutes',
    gradient: 'from-[#FFE5E5] to-[#FFF0E5]',
    borderColor: 'border-[#FF6B6B]/30',
  },
  {
    title: 'Countdown Timer',
    description: 'Visible timer shown with every active number',
    gradient: 'from-[#E5F4FF] to-[#E5FFFF]',
    borderColor: 'border-[#4FACFE]/30',
  },
  {
    title: 'Auto-Refresh',
    description: 'Automatically refreshes for received OTP messages',
    gradient: 'from-[#E5FFF0] to-[#E5FFFA]',
    borderColor: 'border-[#43E97B]/30',
  },
  {
    title: 'Multiple Payment',
    description: 'Razorpay, PayPal, USDT support',
    gradient: 'from-[#FFE5F0] to-[#FFFAE5]',
    borderColor: 'border-[#FA709A]/30',
  },
  {
    title: 'Secure Hosting',
    description: 'Hosted securely on VPS with aaPanel',
    gradient: 'from-[#F0F9FF] to-[#FFE5F5]',
    borderColor: 'border-[#A8EDEA]/30',
  },
  {
    title: 'Smart Admin System',
    description: 'With auto provider switching capability',
    gradient: 'from-[#EDE5FF] to-[#F5E5FF]',
    borderColor: 'border-[#667EEA]/30',
  },
];
