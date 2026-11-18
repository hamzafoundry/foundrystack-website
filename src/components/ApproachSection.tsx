import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SectionHeader } from './SectionHeader';

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const;

export const ApproachSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="process" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.approach.title} description={t.approach.description} />

        {/* A real sequence, so it is numbered */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14 border-t-2 border-ink">
          {STEP_KEYS.map((key, i) => {
            const step = t.approach.steps[key];
            return (
              <li key={key} className="pt-8">
                <span className="type-display block text-[3.5rem] text-brand leading-none" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-6 type-heading text-2xl text-ink">{step.title}</h3>
                <p className="mt-1 font-medium text-ink">{step.subtitle}</p>
                <p className="mt-4 text-[15px] text-ink-2 leading-relaxed">{step.description}</p>
                <h4 className="mt-6 text-sm font-semibold text-ink">{t.approach.milestoneDeliverables}</h4>
                <ul className="mt-2 space-y-1.5">
                  {step.deliverables.map((d) => (
                    <li key={d} className="flex gap-3 text-sm text-ink-2 leading-snug">
                      <span className="mt-[6px] w-1.5 h-1.5 bg-brand flex-shrink-0" aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
