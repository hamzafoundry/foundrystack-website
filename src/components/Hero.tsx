import React, { useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { AgentDef, AgentField } from './AgentField';

interface HeroProps {
  onDiscussProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDiscussProject }) => {
  const { t, isRtl } = useLanguage();

  // One agent per service; automation is the hub the others hand work to.
  const agents = useMemo<AgentDef[]>(
    () => [
      { id: 'automation', shape: 'orbit', title: t.services.items.aiAutomation.title, description: t.services.items.aiAutomation.description },
      { id: 'web', shape: 'window', title: t.services.items.webApps.title, description: t.services.items.webApps.description },
      { id: 'systems', shape: 'hex', title: t.services.items.customSystems.title, description: t.services.items.customSystems.description },
      { id: 'cloud', shape: 'diamond', title: t.services.items.cloudIntegrations.title, description: t.services.items.cloudIntegrations.description },
    ],
    [t],
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden text-white lg:min-h-[780px]"
      style={{
        backgroundColor: '#0A1424',
        backgroundImage:
          'radial-gradient(900px 520px at 74% 52%, rgba(29,78,160,0.38) 0%, rgba(10,20,36,0) 70%), radial-gradient(700px 400px at 10% 110%, rgba(110,92,255,0.14) 0%, rgba(10,20,36,0) 70%)',
      }}
    >
      {/* Text sits above the agents; only the text block itself takes pointer input */}
      <div className="relative z-10 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 lg:pt-44 pb-4 lg:pb-0">
        <div className="pointer-events-auto max-w-[38rem]">
          <h1 className="type-display text-white text-[clamp(2.5rem,5.4vw,4.6rem)] text-balance">
            {t.hero.headlinePrefix}
            {t.hero.headlineHighlight}
          </h1>
          <p className="mt-7 text-lg sm:text-xl text-white/75 leading-relaxed max-w-[34rem]">{t.hero.copy}</p>
          <button
            type="button"
            onClick={onDiscussProject}
            className="mt-10 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-[3px] bg-brand text-white font-semibold hover:bg-[#1F7BFF] shadow-[0_0_32px_-6px_rgba(0,102,255,0.8)] transition-colors cursor-pointer focus-visible:outline-white"
          >
            {t.hero.ctaDiscuss}
          </button>
        </div>
      </div>

      <AgentField agents={agents} rtl={isRtl} className="relative h-[340px] sm:h-[420px] lg:absolute lg:inset-0 lg:h-auto" />
    </section>
  );
};
