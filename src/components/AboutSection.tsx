import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-32 bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="type-heading text-[clamp(2rem,3.8vw,3.1rem)] text-ink text-balance">{t.about.title}</h2>
          <div className="mt-8 space-y-5 text-lg text-ink-2 leading-relaxed max-w-[62ch]">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p>{t.about.p3}</p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-3">
          <figure className="border-s-4 border-brand ps-6">
            <blockquote className="type-heading text-[clamp(1.5rem,2.4vw,2rem)] text-ink leading-snug">
              {t.about.quote}
            </blockquote>
            <figcaption className="mt-4 text-sm text-ink-3">{t.about.quoteTitle}</figcaption>
          </figure>

          <dl className="mt-14 space-y-6">
            {(['reliableImplementation', 'pragmaticDesign'] as const).map((key) => (
              <div key={key} className="border-t border-line pt-5">
                <dt className="font-semibold text-ink">{t.about.values[key].title}</dt>
                <dd className="mt-1 text-ink-2">{t.about.values[key].desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
