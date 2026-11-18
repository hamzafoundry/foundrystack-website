import React from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import { SectionHeader } from './SectionHeader';
import { StackGraphic } from './StackGraphic';
import { AgentGlyph } from './AgentField';
import { FEATURED_SERVICE, SERVICE_LAYERS, ServiceId } from './serviceLayers';

interface ServicesSectionProps {
  onSelectService: (serviceId: ServiceId) => void;
}

const Bullet: React.FC<{ light?: boolean }> = ({ light }) => (
  <span className={`mt-[7px] w-1.5 h-1.5 flex-shrink-0 ${light ? 'bg-[#7DB2FF]' : 'bg-brand'}`} aria-hidden="true" />
);

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { t } = useLanguage();
  const reduceMotion = !!useReducedMotion();
  const labels = SERVICE_LAYERS.map((l) => t.services.items[l.key].title);
  const featured = SERVICE_LAYERS.find((l) => l.id === FEATURED_SERVICE)!;
  const f = t.services.items[featured.key];
  const others = SERVICE_LAYERS.filter((l) => l.id !== FEATURED_SERVICE);

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.services.title} description={t.services.description} />

        {/* Flagship offer: the only dark panel in a light section */}
        <article
          id="ai-automation"
          className="relative scroll-mt-24 overflow-hidden rounded-[4px] text-white p-7 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12"
          style={{
            backgroundColor: '#0A1424',
            backgroundImage:
              'radial-gradient(640px 360px at 85% 20%, rgba(29,78,160,0.45) 0%, rgba(10,20,36,0) 70%), radial-gradient(520px 300px at 0% 100%, rgba(110,92,255,0.16) 0%, rgba(10,20,36,0) 70%)',
            boxShadow: '0 0 0 1px rgba(61,139,255,0.45), 0 40px 90px -40px rgba(0,102,255,0.75)',
          }}
        >
          <div className="lg:col-span-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#BFD7FF] bg-[#3D8BFF]/15 border border-[#3D8BFF]/40 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DB2FF]" aria-hidden="true" />
              {t.services.featuredBadge}
            </p>
            <div className="mt-8 flex items-center gap-5">
              <span className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center">
                <span
                  className="absolute -inset-4 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(61,139,255,0.35) 0%, rgba(61,139,255,0) 70%)' }}
                  aria-hidden="true"
                />
                <AgentGlyph shape="orbit" active spin={!reduceMotion} size={60} />
              </span>
              <h3 className="type-heading text-[clamp(1.9rem,3.4vw,2.75rem)] text-white min-w-0">{f.title}</h3>
            </div>
            <p className="mt-5 text-lg text-white/70">{f.tagline}</p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-xl leading-relaxed text-white/90 max-w-[52ch]">{f.description}</p>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {f.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-white/85 leading-snug">
                  <Bullet light />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelectService(featured.id)}
              className="mt-10 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-[3px] bg-brand text-white font-semibold hover:bg-[#1F7BFF] shadow-[0_0_32px_-6px_rgba(0,102,255,0.8)] transition-colors cursor-pointer focus-visible:outline-white"
            >
              {t.hero.ctaDiscuss}
            </button>
          </div>
        </article>

        <div className="mt-14">
          {others.map((layer) => {
            const item = t.services.items[layer.key];
            const stackIndex = SERVICE_LAYERS.findIndex((l) => l.id === layer.id);
            return (
              <article
                key={layer.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-12 border-t border-line last:border-b"
              >
                <div className="md:col-span-5 flex gap-5 items-start">
                  {/* Shows where this service sits in the stack */}
                  <StackGraphic labels={labels} active={stackIndex} mini className="w-14 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <h3 className="type-heading text-2xl sm:text-[1.75rem] text-ink">{item.title}</h3>
                    <p className="mt-2 text-ink-2">{item.tagline}</p>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <p className="text-lg leading-relaxed text-ink max-w-[60ch]">{item.description}</p>
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-[15px] text-ink-2 leading-snug">
                        <Bullet />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => onSelectService(layer.id)}
                    className="mt-8 text-sm font-semibold text-brand-deep underline underline-offset-4 decoration-2 decoration-brand/40 hover:decoration-brand cursor-pointer text-start"
                  >
                    {t.services.inquireButton} {item.title}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
