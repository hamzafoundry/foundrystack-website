import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface CtaBannerProps {
  onDiscussProject: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onDiscussProject }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-brand text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
        <h2 className="lg:col-span-7 type-display text-[clamp(2.2rem,4.6vw,3.9rem)] text-white text-balance">
          {t.cta.title}
        </h2>
        <div className="lg:col-span-5">
          <p className="text-lg text-white/90 leading-relaxed max-w-[44ch]">{t.cta.description}</p>
          <button
            type="button"
            onClick={onDiscussProject}
            className="mt-7 inline-flex px-7 py-4 rounded-[3px] bg-white text-brand-ink font-semibold hover:bg-ground transition-colors cursor-pointer focus-visible:outline-white"
          >
            {t.cta.button}
          </button>
        </div>
      </div>
    </section>
  );
};
