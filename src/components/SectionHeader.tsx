import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  tone?: 'light' | 'dark';
  children?: React.ReactNode;
}

/** Heading on the left, supporting copy on the right — an editorial split, not a centred stack. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, tone = 'light', children }) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end mb-14 md:mb-16">
    <h2
      className={`md:col-span-7 type-heading text-[clamp(2rem,3.8vw,3.1rem)] text-balance ${
        tone === 'dark' ? 'text-white' : 'text-ink'
      }`}
    >
      {title}
    </h2>
    {(description || children) && (
      <div className="md:col-span-5">
        {description && (
          <p className={`text-base sm:text-lg leading-relaxed ${tone === 'dark' ? 'text-white/75' : 'text-ink-2'}`}>
            {description}
          </p>
        )}
        {children}
      </div>
    )}
  </div>
);
