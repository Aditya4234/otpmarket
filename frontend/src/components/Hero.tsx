'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FADE_UP_ANIMATION = {
  initial: 'hidden',
  animate: 'show',
  variants: fadeUp,
};

const BADGES = ['99.9% Uptime', 'Fast OTP Delivery', 'SSL Secured'] as const;

const SERVICES = [
  { icon: 'whatsapp', label: 'WhatsApp' },
  { icon: 'telegram', label: 'Telegram' },
  { icon: 'facebook', label: 'Facebook' },
  { icon: 'instagram', label: 'Instagram' },
] as const;

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen md:h-screen mx-auto flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full violet-gradient opacity-20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full green-pink-gradient opacity-20 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-16 flex flex-col md:flex-row items-center relative z-10 w-full gap-8 md:gap-12">
        <motion.div
          {...FADE_UP_ANIMATION}
          className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Get Instant Virtual
            <br className="hidden md:block" />
            Number for OTP-Safe
            <br />
            <span className="text-[#804dee]">Fast & Reliable</span>
          </h1>

          <p className="mt-4 text-secondary text-[15px] sm:text-[17px] max-w-3xl leading-[30px] mb-8">
            Buy temporary virtual numbers for WhatsApp, Telegram, Facebook, & more
          </p>

          <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button href="/register" size="lg">
                Get Started
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button href="#Feature" variant="outline" size="lg">
                Explore Pricing
              </Button>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            {BADGES.map((item) => (
              <motion.span
                key={item}
                whileHover={{ scale: 1.08 }}
                className="border border-[#804dee] text-white py-2 px-4 sm:px-6 rounded-full text-xs sm:text-sm font-semibold shadow-md"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ rotate: 2, scale: 1.02 }}
          className="flex-1 flex items-center justify-center mt-6 md:mt-0 w-full"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex justify-center items-center w-full max-w-[300px] sm:max-w-[330px]"
          >
            <div className="w-full max-w-[280px] sm:max-w-[330px] aspect-[9/19] bg-black rounded-[32px] sm:rounded-[45px] border-[4px] sm:border-[6px] border-gray-700 shadow-[0_0_40px_rgba(128,77,238,0.4)] p-2 sm:p-3 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-40 h-6 sm:h-8 bg-black rounded-b-3xl z-20" />

              <div className="w-full h-full bg-[#0d0d0d] rounded-[25px] sm:rounded-[35px] p-3 sm:p-5 flex flex-col gap-2 sm:gap-4 overflow-y-auto">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="text-center"
                >
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    OTP<span className="text-[#804dee]">MART</span>
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm">Services</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full border p-2 sm:p-4 rounded-xl bg-blue-500 text-white shadow-md"
                >
                  <div className="flex justify-between text-sm sm:text-lg font-semibold">
                    <span>Balance</span>
                    <span>₹250</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 sm:mt-3">
                    <i className="fas fa-plus-circle text-lg sm:text-xl" />
                    <button className="bg-[#804dee] px-3 sm:px-4 py-1 rounded-full text-white font-semibold text-xs sm:text-sm hover:bg-[#6b3dc9]">
                      Add Funds
                    </button>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
                  {SERVICES.map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ scale: 1.06 }}
                      className="flex items-center gap-1 sm:gap-3 p-2 sm:p-4 bg-blue-500 text-white rounded-xl hover:bg-white hover:text-[#804dee] border hover:border-[#804dee] transition-all cursor-pointer"
                    >
                      <i className={`fab fa-${item.icon} text-xl sm:text-3xl`} />
                      <span className="font-medium text-xs sm:text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full border mt-1 sm:mt-2 p-2 sm:p-4 rounded-xl bg-blue-500 text-white hover:bg-white hover:text-[#804dee] hover:border-[#804dee] transition-all"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-xs sm:text-sm">Active Number</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
