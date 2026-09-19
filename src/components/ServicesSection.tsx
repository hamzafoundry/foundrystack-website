import React from 'react';
import { ServiceItem } from '../types';
import { Layout, Database, Cloud, Bot, ArrowRight, Sparkles, Check, Code2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { t } = useLanguage();

  const services: ServiceItem[] = [
    {
      id: 'web-apps',
      title: t.services.items.webApps.title,
      tagline: t.services.items.webApps.tagline,
      description: t.services.items.webApps.description,
      keyFeatures: t.services.items.webApps.features,
      iconName: 'Layout',
    },
    {
      id: 'custom-systems',
      title: t.services.items.customSystems.title,
      tagline: t.services.items.customSystems.tagline,
      description: t.services.items.customSystems.description,
      keyFeatures: t.services.items.customSystems.features,
      iconName: 'Database',
    },
    {
      id: 'cloud-integrations',
      title: t.services.items.cloudIntegrations.title,
      tagline: t.services.items.cloudIntegrations.tagline,
      description: t.services.items.cloudIntegrations.description,
      keyFeatures: t.services.items.cloudIntegrations.features,
      iconName: 'Cloud',
    },
    {
      id: 'ai-automation',
      title: t.services.items.aiAutomation.title,
      badge: t.services.statusBuilding,
      badgeType: 'building',
      tagline: t.services.items.aiAutomation.tagline,
      description: t.services.items.aiAutomation.description,
      keyFeatures: t.services.items.aiAutomation.features,
      iconName: 'Bot',
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-6 h-6 text-blue-400" />;
      case 'Database':
        return <Database className="w-6 h-6 text-cyan-400" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-blue-400" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-cyan-400" />;
      default:
        return <Code2 className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-[#020617] relative overflow-hidden">
      {/* Background Accent Grids */}
      <div className="absolute inset-0 bg-line-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.services.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            {t.services.title}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.services.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const isBuilding = service.badgeType === 'building';

            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl p-8 glass-panel glass-panel-hover flex flex-col justify-between border transition-all duration-300 ${
                  isBuilding
                    ? 'border-cyan-500/30 bg-gradient-to-b from-[#0a152e]/80 to-[#030b1e]/90'
                    : 'border-blue-900/40 hover:border-blue-500/50'
                }`}
              >
                {/* Top Service Badge Header */}
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-800/50 shadow-inner group-hover:border-blue-500/60 transition-colors">
                      {getIcon(service.iconName)}
                    </div>

                    {service.badge ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>{service.badge}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
                        {t.services.statusEstablished}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-bold text-white font-heading group-hover:text-cyan-300 transition-colors mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm font-semibold text-blue-400 mb-4 font-mono">
                    {service.tagline}
                  </p>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Key Capabilities List */}
                  <div className="space-y-2.5 mb-8 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                      {t.services.scopeHeader}
                    </span>
                    {service.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  {isBuilding ? (
                    <span className="text-xs font-mono text-slate-400 italic flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {t.services.rdTag}
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-blue-400 group-hover:text-cyan-300 font-semibold transition-colors">
                      {t.services.customEngineering}
                    </span>
                  )}

                  <button
                    onClick={() => onSelectService(service.id)}
                    className="p-2 rounded-lg bg-blue-950/80 hover:bg-blue-600 border border-blue-800 hover:border-blue-400 text-slate-200 hover:text-white transition-all duration-200 cursor-pointer group-hover:translate-x-1"
                    title={`${t.services.inquireButton} ${service.title}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
