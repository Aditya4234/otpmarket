'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function GetStarted() {
  return (
    <section className="relative w-full py-20 px-6 sm:px-16 bg-gradient-to-b from-[#050816] to-[#0a0f2e] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full violet-gradient opacity-30 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full green-pink-gradient opacity-30 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 sm:p-12 md:p-16 shadow-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Get <span className="text-[#804dee]">Started?</span>
            </h2>
            <p className="text-secondary text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied users using OTP MART for secure verifications
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button href="/register" size="lg">
                Create Account Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
