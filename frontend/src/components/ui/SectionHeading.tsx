import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function SectionHeading({
  title,
  highlight,
  subtitle,
  children,
}: SectionHeadingProps) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {title} {highlight && <span className="text-[#804dee]">{highlight}</span>}
      </h2>
      {subtitle && <p className="text-secondary text-lg max-w-2xl mx-auto">{subtitle}</p>}
      {children}
    </div>
  );
}
