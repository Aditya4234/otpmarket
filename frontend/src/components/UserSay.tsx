'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { TESTIMONIALS } from '@/constants';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function UserSay() {
  return (
    <section className="relative w-full py-16 px-6 sm:px-16 bg-gradient-to-b from-[#050816] to-[#0a0f2e]">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="What Our"
          highlight="Users Say"
          subtitle="Trusted by thousands of users worldwide"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              variants={item}
              className="p-7 bg-white/10 backdrop-blur-sm shadow-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="text-white text-center">
                <p className="text-5xl font-bold mb-2 text-[#804dee]">{testimonial.metric}</p>
                <p className="text-lg opacity-80 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-4 font-semibold text-[#804dee]">- {testimonial.author}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
