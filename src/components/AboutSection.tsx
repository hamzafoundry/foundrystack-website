import React from 'react';
import { FoundryLogo } from './FoundryLogo';
import { Target, Shield, Terminal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-[#020617] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Emblem & Visual Statement */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative w-full max-w-md glass-panel rounded-2xl p-8 border border-blue-500/30 text-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl" />

              <div className="relative z-10 py-6">
                <FoundryLogo size="lg" showTagline={true} className="justify-center mb-6" />

                <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-900/60 text-left space-y-2 mt-4">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                    {t.about.quoteTitle}
                  </span>
                  <p className="text-xs text-slate-200 font-mono italic leading-relaxed">
                    {t.about.quote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-mono font-semibold uppercase tracking-widest">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.about.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading leading-tight">
              {t.about.title}
            </h2>

            <div className="space-y-4 text-slate-300 text-base leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>

            {/* Core Values / Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">{t.about.values.reliableImplementation.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t.about.values.reliableImplementation.desc}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <Terminal className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">{t.about.values.pragmaticDesign.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t.about.values.pragmaticDesign.desc}</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
