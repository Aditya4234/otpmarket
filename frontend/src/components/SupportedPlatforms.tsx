import {
  FaWhatsapp,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaGoogle,
  FaEllipsisH,
} from 'react-icons/fa';
import { SiTinder } from 'react-icons/si';
import SectionHeading from '@/components/ui/SectionHeading';
import { PLATFORMS } from '@/constants';

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  WhatsApp: FaWhatsapp,
  Telegram: FaTelegram,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Gmail: FaGoogle,
  Tinder: SiTinder,
  'And More': FaEllipsisH,
};

const FEATURES = [
  {
    title: 'Auto Refund',
    description: 'Automatic refund if no OTP within 10 minutes',
    gradient: 'from-[#FFE5E5] to-[#FFF0E5]',
    borderColor: 'border-[#FF6B6B]/30',
    icon: (
      <svg
        className="w-8 h-8 text-white animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    ),
  },
  {
    title: 'Countdown Timer',
    description: 'Visible timer shown with every active number',
    gradient: 'from-[#E5F4FF] to-[#E5FFFF]',
    borderColor: 'border-[#4FACFE]/30',
    icon: (
      <svg
        className="w-8 h-8 text-white animate-spin-slow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Auto-Refresh',
    description: 'Automatically refreshes for received OTP messages',
    gradient: 'from-[#E5FFF0] to-[#E5FFFA]',
    borderColor: 'border-[#43E97B]/30',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    title: 'Multiple Payment',
    description: 'Razorpay, PayPal, USDT support',
    gradient: 'from-[#FFE5F0] to-[#FFFAE5]',
    borderColor: 'border-[#FA709A]/30',
    icon: (
      <svg
        className="w-8 h-8 text-white animate-bounce-slow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  {
    title: 'Secure Hosting',
    description: 'Hosted securely on VPS with aaPanel',
    gradient: 'from-[#F0F9FF] to-[#FFE5F5]',
    borderColor: 'border-[#A8EDEA]/30',
    icon: (
      <svg
        className="w-8 h-8 text-gray-700 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: 'Smart Admin System',
    description: 'With auto provider switching capability',
    gradient: 'from-[#EDE5FF] to-[#F5E5FF]',
    borderColor: 'border-[#667EEA]/30',
    icon: (
      <svg
        className="w-8 h-8 text-white animate-spin-slow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function SupportedPlatforms() {
  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Supported Platforms"
            subtitle="Get OTP verification for all major platforms"
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {PLATFORMS.map((platform) => {
              const Icon = ICON_MAP[platform.name];
              return (
                <div
                  key={platform.name}
                  className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-4 sm:p-6 border border-[#804dee]/20 hover:border-[#804dee] transition-all hover:scale-105 flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer group"
                >
                  {Icon && (
                    <Icon
                      className="text-4xl sm:text-5xl transition-all group-hover:scale-110"
                      style={{ color: platform.color }}
                    />
                  )}
                  <h3 className="text-gray-800 font-semibold text-center">{platform.name}</h3>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <p className="text-secondary text-sm">+ Many more platforms supported</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Why Choose OTP MART"
            subtitle="We offer premium features to ensure the best service"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`bg-gradient-to-br ${feature.gradient} shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-6 sm:p-8 border ${feature.borderColor} hover:border-opacity-60 transition-all hover:scale-105 group`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
