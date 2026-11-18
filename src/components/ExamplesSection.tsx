import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useReveal } from '../lib/useReveal';
import { SectionHeader } from './SectionHeader';

const KEYS = ['enquiries', 'invoices', 'report'] as const;

/**
 * Before/after strips: the manual steps get crossed off one by one, then the single
 * automatic result appears. Honest examples of the kind of work, not client case studies.
 */
const ExampleStrip: React.FC<{ k: (typeof KEYS)[number] }> = ({ k }) => {
  const { t } = useLanguage();
  const e = t.examples;
  const item = e.items[k];
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="ex-strip">
      <h3 className="type-heading text-2xl text-ink">{item.name}</h3>
      <div className="ex-grid">
        <div className="ex-side">
          <p className="ex-label">{e.before}</p>
          <p className="mt-2 text-ink-2 leading-relaxed">{item.before}</p>
          <ol className="ex-steps">
            {item.steps.map((step, i) => (
              <li key={step} className="ex-step" style={{ ['--i' as string]: i }}>
                <span className="ex-step-text">{step}</span>
                <span className="ex-strike" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>

        <ArrowRight className="ex-arrow" aria-hidden="true" />

        <div className="ex-side ex-side-after">
          <p className="ex-label text-brand-deep">{e.after}</p>
          <p className="mt-2 text-ink leading-relaxed font-medium">{item.after}</p>
          <p className="ex-result">
            <Check className="w-4 h-4 flex-none" strokeWidth={3} aria-hidden="true" />
            {item.result}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ExamplesSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="examples" className="py-24 md:py-32 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.examples.title} description={t.examples.intro}>
          <p className="mt-4 text-sm text-ink-3">{t.examples.label}</p>
        </SectionHeader>
        <div className="space-y-6">
          {KEYS.map((k) => (
            <ExampleStrip key={k} k={k} />
          ))}
        </div>
      </div>
    </section>
  );
};
