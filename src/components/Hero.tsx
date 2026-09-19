import React from 'react';
import { FoundryLogo } from './FoundryLogo';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Server,
  Zap,
  Activity,
  Terminal
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroProps {
  onDiscussProject: () => void;
  onExploreCapabilities: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDiscussProject, onExploreCapabilities }) => {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden flex items-center justify-center bg-[#020617]"
    >
      {/* Background Ambient Glows & Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Network Detail Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-72 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <div className="absolute top-60 right-20 w-96 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="absolute bottom-40 left-1/3 w-64 h-[1px] bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Engineering Discipline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-mono">{t.hero.badge}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{t.hero.tag}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-[1.1]">
              {t.hero.headlinePrefix}
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,102,255,0.4)]">
                {t.hero.headlineHighlight}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              {t.hero.copy}
            </p>

            {/* Quick Technical Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{t.hero.highlights.customArchitecture}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{t.hero.highlights.cloudApiSync}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{t.hero.highlights.reliableOperations}</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={onDiscussProject}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-400/40 shadow-[0_0_30px_rgba(0,102,255,0.4)] hover:shadow-[0_0_40px_rgba(0,102,255,0.6)] transition-all duration-300 cursor-pointer active:scale-95 group"
              >
                <span>{t.hero.ctaDiscuss}</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCapabilities}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-blue-800/40 hover:border-blue-500/60 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <span>{t.hero.ctaExplore}</span>
              </button>
            </div>
          </div>

          {/* Right Visual Dashboard Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Outer Glow Ring */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent rounded-3xl blur-2xl opacity-75" />

            {/* High-Tech System Architecture Panel */}
            <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
              
              {/* Top Panel Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-blue-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-300 font-semibold">
                    {t.hero.panel.coreEngine}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800/60">
                  <Activity className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span>{t.hero.panel.systemOnline}</span>
                </div>
              </div>

              {/* Central Logo Graphic Stage */}
              <div className="relative py-8 my-2 rounded-xl bg-slate-950/80 border border-blue-900/30 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-tech-grid opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-blue-950/40" />

                {/* Brand Emblem */}
                <FoundryLogo size="hero" showTagline={true} className="relative z-10 my-2" />

                {/* Light reflection scanbar */}
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-0 animate-scanline opacity-60" />
              </div>

              {/* System Architecture Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
                
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono mb-1">
                    <Server className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.hero.panel.archLabel}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-100">{t.hero.panel.archVal}</span>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono mb-1">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.hero.panel.intLabel}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-100">{t.hero.panel.intVal}</span>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono mb-1">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.hero.panel.wfLabel}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-100">{t.hero.panel.wfVal}</span>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono mb-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.hero.panel.autoLabel}</span>
                  </div>
                  <span className="text-xs font-bold text-cyan-300">{t.hero.panel.autoVal}</span>
                </div>

              </div>

              {/* Bottom Status Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.hero.panel.footerTitle}</span>
                </span>
                <span className="text-blue-400 font-semibold">{t.hero.panel.footerVal}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
