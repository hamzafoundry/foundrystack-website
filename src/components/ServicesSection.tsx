import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCalmMotion } from '../lib/useHydrated';
import { SectionHeader } from './SectionHeader';
import { AgentGlyph } from './AgentGlyph';
import { FEATURED_SERVICE, SERVICE_LAYERS, ServiceId, ServiceLayer, isPlaceholder } from './serviceLayers';

interface ServicesSectionProps {
  onSelectService: (serviceId: ServiceId) => void;
}

/** Text that is still an unconfirmed placeholder gets a dashed amber outline so nobody ships it by accident. */
const MaybePlaceholder: React.FC<{ text: string }> = ({ text }) => {
  if (!isPlaceholder(text)) return <>{text}</>;
  const [before, rest] = text.split('⟦');
  const [mark, after = ''] = rest.split('⟧');
  return (
    <>
      {before}
      <mark className="svc-placeholder">⟦{mark}⟧</mark>
      {after}
    </>
  );
};

interface ServiceCardProps {
  layer: ServiceLayer;
  featured: boolean;
  onSelect: () => void;
}

/** One anatomy for all four services; the flagship is the same card, larger and highlighted. */
const ServiceCard: React.FC<ServiceCardProps> = ({ layer, featured, onSelect }) => {
  const { t } = useLanguage();
  const calm = useCalmMotion();
  const s = t.services;
  const item = s.items[layer.key];
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const head = (
    <>
      {featured && (
        <p className="svc-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" aria-hidden="true" />
          {s.featuredBadge}
        </p>
      )}
      <div className="flex items-center gap-4">
        <span className="svc-glyph" aria-hidden="true">
          <AgentGlyph shape={layer.shape} active={featured} spin={!calm} />
        </span>
        <h3 className={`type-heading text-ink min-w-0 ${featured ? 'text-[clamp(1.7rem,3vw,2.4rem)]' : 'text-2xl'}`}>{item.title}</h3>
      </div>
      <p className={`mt-6 text-ink-2 leading-relaxed ${featured ? 'text-lg' : ''}`}>{item.problem}</p>
      <p className={`mt-3 text-ink leading-relaxed font-medium ${featured ? 'text-xl' : 'text-lg'}`}>{item.whatWeDo}</p>
      <div className="mt-5 border-s-2 border-brand ps-4">
        <p className="text-sm font-semibold text-brand-deep">{s.youGet}</p>
        <p className="mt-1 text-ink leading-relaxed">{item.result}</p>
      </div>
    </>
  );

  const body = (
    <>
      <ul className="grid grid-cols-1 gap-y-3">
        {item.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-[15px] text-ink-2 leading-snug">
            <span className="mt-[7px] w-1.5 h-1.5 bg-brand flex-shrink-0" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* The hero's story in miniature: one piece of work, before and after */}
      <div className="svc-work" aria-hidden="true">
        <span className="svc-work-before">{item.work.before}</span>
        <ArrowRight className="svc-work-arrow" />
        <span className="svc-work-after">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
          {item.work.after}
        </span>
      </div>
    </>
  );

  return (
    <article id={layer.id === FEATURED_SERVICE ? 'ai-automation' : undefined} className={`svc-card ${featured ? 'svc-card-featured lg:col-span-3' : ''}`}>
      <div className={`flex-1 ${featured ? 'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14' : 'flex flex-col gap-7'}`}>
        <div>{head}</div>
        <div className="flex flex-col gap-7">{body}</div>
      </div>

      <div className="svc-footer">
        <button type="button" onClick={onSelect} className={featured ? 'svc-cta-primary' : 'svc-cta-secondary'}>
          {featured ? t.hero.ctaDiscuss : s.ctaOther}
        </button>
        <button type="button" className="svc-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
          {open ? s.hideHow : s.showHow}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={calm ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={calm ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="svc-how">
              <ul className={`grid grid-cols-1 gap-3 ${featured ? 'lg:grid-cols-2 lg:gap-x-10' : ''}`}>
                {item.how.map((line) => (
                  <li key={line} className="flex gap-3 text-[15px] text-ink-2 leading-relaxed">
                    <span className="mt-[9px] w-3 h-px bg-ink-3 flex-shrink-0" aria-hidden="true" />
                    <span>
                      <MaybePlaceholder text={line} />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-semibold text-ink">{s.toolsLabel}</p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {layer.tools.map((tool) => (
                  <li key={tool} className={isPlaceholder(tool) ? 'svc-tool svc-tool-placeholder' : 'svc-tool'}>
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.services.title} description={t.services.intro} />
        <div className="svc-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SERVICE_LAYERS.map((layer) => (
            <ServiceCard
              key={layer.id}
              layer={layer}
              featured={layer.id === FEATURED_SERVICE}
              onSelect={() => onSelectService(layer.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
