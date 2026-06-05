import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'OTP MART - Get Instant Virtual Numbers for OTP Verification',
    template: '%s | OTP MART',
  },
  description:
    'Buy temporary virtual numbers for WhatsApp, Telegram, Facebook, & more. Fast, reliable OTP verification service with instant delivery.',
  keywords: [
    'virtual number',
    'OTP verification',
    'temporary phone number',
    'WhatsApp verification',
    'Telegram OTP',
    'SMS verification',
  ],
  openGraph: {
    title: 'OTP MART - Virtual Numbers for OTP Verification',
    description:
      'Get instant virtual numbers for secure OTP verification. Fast & reliable service.',
    type: 'website',
    locale: 'en_US',
    siteName: 'OTP MART',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTP MART - Virtual Numbers for OTP Verification',
    description:
      'Get instant virtual numbers for secure OTP verification. Fast & reliable service.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050816',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#363636', color: '#fff' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
