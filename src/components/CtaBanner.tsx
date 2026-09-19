import React from 'react';
import { ArrowRight, MessageSquareCode } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface CtaBannerProps {
  onDiscussProject: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onDiscussProject }) => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#020617] relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-blue-500/40 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,102,255,0.15)]">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-widest mb-6">
            <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.cta.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight max-w-2xl mx-auto leading-tight mb-4">
            {t.cta.title}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            {t.cta.description}
          </p>

          <div className="flex justify-center">
            <button
              onClick={onDiscussProject}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-400/40 shadow-[0_0_30px_rgba(0,102,255,0.4)] hover:shadow-[0_0_40px_rgba(0,102,255,0.6)] transition-all duration-300 cursor-pointer active:scale-95 group"
            >
              <span>{t.cta.button}</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
