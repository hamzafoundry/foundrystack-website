import React from 'react';
import { ProcessStep } from '../types';
import { Compass, FileText, Code, Rocket, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const ApproachSection: React.FC = () => {
  const { t } = useLanguage();

  const steps: ProcessStep[] = [
    {
      number: '01',
      title: t.approach.steps.step1.title,
      subtitle: t.approach.steps.step1.subtitle,
      description: t.approach.steps.step1.description,
      deliverables: t.approach.steps.step1.deliverables,
    },
    {
      number: '02',
      title: t.approach.steps.step2.title,
      subtitle: t.approach.steps.step2.subtitle,
      description: t.approach.steps.step2.description,
      deliverables: t.approach.steps.step2.deliverables,
    },
    {
      number: '03',
      title: t.approach.steps.step3.title,
      subtitle: t.approach.steps.step3.subtitle,
      description: t.approach.steps.step3.description,
      deliverables: t.approach.steps.step3.deliverables,
    },
    {
      number: '04',
      title: t.approach.steps.step4.title,
      subtitle: t.approach.steps.step4.subtitle,
      description: t.approach.steps.step4.description,
      deliverables: t.approach.steps.step4.deliverables,
    },
  ];

  const getStepIcon = (num: string) => {
    switch (num) {
      case '01': return <Compass className="w-5 h-5 text-cyan-400" />;
      case '02': return <FileText className="w-5 h-5 text-blue-400" />;
      case '03': return <Code className="w-5 h-5 text-cyan-400" />;
      case '04': return <Rocket className="w-5 h-5 text-blue-400" />;
      default: return <Compass className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section id="process" className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-mono font-semibold uppercase tracking-widest">
            <span>{t.approach.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            {t.approach.title}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.approach.description}
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Subtle Connecting Process Line (Desktop) */}
          <div className="hidden lg:block absolute top-28 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-400/50 to-blue-600/20 z-0 pointer-events-none" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative z-10 glass-panel glass-panel-hover rounded-2xl p-6 border border-blue-900/40 flex flex-col justify-between group"
            >
              <div>
                {/* Step Badge & Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-slate-900 border border-blue-800/60 shadow-md group-hover:border-cyan-400/60 transition-colors">
                    {getStepIcon(step.number)}
                  </div>
                  <span className="font-mono text-3xl font-extrabold text-slate-700 group-hover:text-blue-400 transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Step Title & Subtitle */}
                <h3 className="text-2xl font-bold text-white font-heading mb-1">
                  {step.title}
                </h3>

                <p className="text-xs font-semibold font-mono text-cyan-400 mb-4">
                  {step.subtitle}
                </p>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Step Deliverables */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {t.approach.milestoneDeliverables}
                </span>
                {step.deliverables.map((del, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
