import SectionHeading from '@/components/ui/SectionHeading';
import { HOW_IT_WORKS_STEPS } from '@/constants';

export default function HowToWork() {
  return (
    <section className="py-20 px-6 bg-tertiary">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="How It"
          highlight="Works"
          subtitle="Get your virtual number in 3 simple steps"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-primary rounded-2xl p-6 sm:p-8 border border-[#804dee]/20 hover:border-[#804dee]/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-16 h-16 bg-[#804dee] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
