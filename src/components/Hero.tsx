import React, { useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { FlowAgent, FlowJob, WorkFlow } from './WorkFlow';

interface HeroProps {
  onDiscussProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDiscussProject }) => {
  const { t, isRtl } = useLanguage();
  const h = t.hero;

  // The crew, top to bottom. Automation is the flagship and is drawn slightly larger.
  const agents = useMemo<FlowAgent[]>(
    () => [
      { id: 'web', shape: 'window', name: h.agents.web.name, line: h.agents.web.line },
      { id: 'automation', shape: 'orbit', name: h.agents.automation.name, line: h.agents.automation.line },
      { id: 'systems', shape: 'hex', name: h.agents.systems.name, line: h.agents.systems.line },
      { id: 'cloud', shape: 'diamond', name: h.agents.cloud.name, line: h.agents.cloud.line },
    ],
    [h],
  );

  // Cards 0-2 start waiting, 3-5 start done. Each job is handled by the agent whose work it is.
  const jobs = useMemo<FlowJob[]>(
    () => [
      { key: 'enquiry', label: h.work.enquiry, agent: 'web', icon: 'mail' },
      { key: 'invoice', label: h.work.invoice, agent: 'automation', icon: 'file' },
      { key: 'stock', label: h.work.stock, agent: 'cloud', icon: 'package' },
      { key: 'report', label: h.work.report, agent: 'automation', icon: 'chart' },
      { key: 'followUp', label: h.work.followUp, agent: 'automation', icon: 'user' },
      { key: 'booking', label: h.work.booking, agent: 'systems', icon: 'calendar' },
    ],
    [h],
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden text-white lg:min-h-[780px]"
      style={{
        backgroundColor: '#0A1424',
        backgroundImage:
          'radial-gradient(900px 520px at 76% 50%, rgba(29,78,160,0.36) 0%, rgba(10,20,36,0) 70%), radial-gradient(700px 400px at 8% 110%, rgba(110,92,255,0.13) 0%, rgba(10,20,36,0) 70%)',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 lg:pt-44 pb-8 lg:pb-32">
        {/* The message never shares space with anything that moves */}
        <div className="max-w-[38rem] lg:max-w-[min(38rem,calc(50vw-5rem))]">
          <h1 className="type-display text-white text-[clamp(2.5rem,5.2vw,4.5rem)] text-balance">{h.headlinePrefix}</h1>
          <p className="mt-7 text-lg sm:text-xl text-white/80 leading-relaxed max-w-[34rem]">{h.copy}</p>
          <p className="mt-4 text-base text-white/60 leading-relaxed max-w-[34rem]">{h.alsoLine}</p>
          <button
            type="button"
            onClick={onDiscussProject}
            className="mt-10 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-[3px] bg-brand text-white font-semibold shadow-[0_0_32px_-6px_rgba(0,102,255,0.8)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#1F7BFF] hover:shadow-[0_0_44px_-4px_rgba(0,102,255,0.95)] active:scale-[0.98] cursor-pointer focus-visible:outline-white"
          >
            {h.ctaDiscuss}
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:static lg:max-w-none lg:p-0">
        <WorkFlow
          agents={agents}
          jobs={jobs}
          doneLabel={h.work.done}
          rtl={isRtl}
          className="relative h-[440px] sm:h-[460px] mb-10 lg:mb-0 lg:absolute lg:end-[3%] lg:top-28 lg:bottom-14 lg:h-auto lg:w-[44%]"
        />
      </div>
    </section>
  );
};
