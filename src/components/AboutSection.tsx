import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCalmMotion } from '../lib/useHydrated';
import { AgentGlyph } from './AgentGlyph';
import { SERVICE_LAYERS } from './serviceLayers';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const a = t.about;
  const calm = useCalmMotion();

  return (
    <section id="about" className="py-24 md:py-32 bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
        <div className="lg:col-span-7">
          <h2 className="type-heading text-[clamp(2rem,3.8vw,3.1rem)] text-ink text-balance">{a.title}</h2>
          <p className="mt-8 text-xl text-ink leading-relaxed font-medium max-w-[52ch]">{a.lead}</p>
          <div className="mt-5 space-y-4 text-lg text-ink-2 leading-relaxed max-w-[58ch]">
            <p>{a.p2}</p>
            <p>{a.p3}</p>
          </div>
        </div>

        <div className="lg:col-span-5">
          {/* The person behind the crew: no photo yet, so a monogram rather than a stock image */}
          <figure className="about-card">
            <div className="flex items-center gap-5">
              <span className="about-monogram" aria-hidden="true">
                HJ
              </span>
              <figcaption className="min-w-0">
                <p className="text-xl font-semibold text-white">Hamza Jamal</p>
                <p className="mt-1 text-sm text-[#9cc3ff]">{a.role}</p>
              </figcaption>
            </div>
            <p className="mt-6 text-white/75 leading-relaxed">{a.roleLine}</p>
            <div className="mt-7 pt-6 border-t border-white/10 flex items-center gap-4" aria-hidden="true">
              {SERVICE_LAYERS.map((layer) => (
                <span key={layer.id} className="w-9 h-9">
                  <AgentGlyph shape={layer.shape} active={layer.id === 'ai-automation'} spin={!calm} />
                </span>
              ))}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
};
