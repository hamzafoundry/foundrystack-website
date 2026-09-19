import React from 'react';
import { CapabilityHighlight } from '../types';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Code2,
  Lock,
  GitBranch,
  CheckCircle2,
  Server
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const EngineeringSection: React.FC = () => {
  const { t } = useLanguage();

  const engineeringPillars: CapabilityHighlight[] = [
    {
      title: t.engineering.pillars.productionExperience.title,
      description: t.engineering.pillars.productionExperience.description,
      detail: t.engineering.pillars.productionExperience.detail,
      icon: 'ShieldCheck',
    },
    {
      title: t.engineering.pillars.architecturalDiscipline.title,
      description: t.engineering.pillars.architecturalDiscipline.description,
      detail: t.engineering.pillars.architecturalDiscipline.detail,
      icon: 'Layers',
    },
    {
      title: t.engineering.pillars.typeSafetyTesting.title,
      description: t.engineering.pillars.typeSafetyTesting.description,
      detail: t.engineering.pillars.typeSafetyTesting.detail,
      icon: 'Code2',
    },
    {
      title: t.engineering.pillars.cloudInfrastructure.title,
      description: t.engineering.pillars.cloudInfrastructure.description,
      detail: t.engineering.pillars.cloudInfrastructure.detail,
      icon: 'Server',
    },
    {
      title: t.engineering.pillars.dataIntegritySecurity.title,
      description: t.engineering.pillars.dataIntegritySecurity.description,
      detail: t.engineering.pillars.dataIntegritySecurity.detail,
      icon: 'Lock',
    },
    {
      title: t.engineering.pillars.pragmaticProblemSolving.title,
      description: t.engineering.pillars.pragmaticProblemSolving.description,
      detail: t.engineering.pillars.pragmaticProblemSolving.detail,
      icon: 'Terminal',
    },
  ];

  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
      case 'Layers': return <Layers className="w-6 h-6 text-blue-400" />;
      case 'Code2': return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Server': return <Server className="w-6 h-6 text-blue-400" />;
      case 'Lock': return <Lock className="w-6 h-6 text-cyan-400" />;
      default: return <Terminal className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <section id="capabilities" className="py-24 bg-[#020617] relative border-y border-slate-800/80">
      {/* Background Tech Visuals */}
      <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Banner */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/90 border border-blue-800 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.engineering.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight">
            {t.engineering.title}
          </h2>

          <div className="p-6 rounded-2xl glass-panel border border-blue-500/30 text-left sm:text-center mt-6">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              {t.engineering.bannerText}
            </p>
            <p className="text-sm text-slate-400 mt-3 font-mono">
              {t.engineering.bannerSubtext}
            </p>
          </div>
        </div>

        {/* Engineering Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {engineeringPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-2xl p-7 border border-blue-900/40 flex flex-col justify-between group"
            >
              <div>
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-800/50 w-fit mb-6 group-hover:border-blue-500/60 transition-colors">
                  {getPillarIcon(pillar.icon)}
                </div>

                <h3 className="text-xl font-bold text-white font-heading group-hover:text-cyan-300 transition-colors mb-3">
                  {pillar.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-cyan-400">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{pillar.detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Code Quality & Reliability Blueprint Strip */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-blue-900/50 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-950 text-cyan-400 border border-blue-800">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">{t.engineering.qualityStrip.versionControl.title}</h4>
              <p className="text-xs text-slate-400 font-mono">{t.engineering.qualityStrip.versionControl.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">{t.engineering.qualityStrip.security.title}</h4>
              <p className="text-xs text-slate-400 font-mono">{t.engineering.qualityStrip.security.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-950 text-cyan-400 border border-blue-800">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">{t.engineering.qualityStrip.selfContained.title}</h4>
              <p className="text-xs text-slate-400 font-mono">{t.engineering.qualityStrip.selfContained.desc}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
