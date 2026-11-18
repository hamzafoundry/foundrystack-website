import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const PILLAR_KEYS = [
  'productionExperience',
  'architecturalDiscipline',
  'typeSafetyTesting',
  'cloudInfrastructure',
  'dataIntegritySecurity',
  'pragmaticProblemSolving',
] as const;

const QUALITY_KEYS = ['versionControl', 'security', 'selfContained'] as const;

export const EngineeringSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="capabilities" className="py-24 md:py-32 bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="type-heading text-[clamp(2rem,3.8vw,3.1rem)] text-white max-w-[22ch] text-balance">
          {t.engineering.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          <p className="md:col-span-8 text-[clamp(1.25rem,2.1vw,1.6rem)] leading-snug text-white/90 max-w-[48ch]">
            {t.engineering.bannerText}
          </p>
          <p className="md:col-span-4 text-white/65 leading-relaxed self-end">{t.engineering.bannerSubtext}</p>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {PILLAR_KEYS.map((key) => {
            const pillar = t.engineering.pillars[key];
            return (
              <div key={key} className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                <p className="mt-3 text-white/70 leading-relaxed">{pillar.description}</p>
                <p className="mt-4 text-sm text-[#8DB8FF] leading-relaxed">{pillar.detail}</p>
              </div>
            );
          })}
        </div>

        <dl className="mt-20 pt-10 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {QUALITY_KEYS.map((key) => (
            <div key={key}>
              <dt className="font-semibold text-white">{t.engineering.qualityStrip[key].title}</dt>
              <dd className="mt-1 text-sm text-white/65">{t.engineering.qualityStrip[key].desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
