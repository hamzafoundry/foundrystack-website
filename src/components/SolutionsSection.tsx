import React, { useState } from 'react';
import { SolutionExample } from '../types';
import {
  Globe,
  UserCheck,
  CalendarCheck,
  BarChart3,
  Boxes,
  ShieldCheck,
  Webhook,
  CloudLightning,
  Workflow,
  Cpu,
  ArrowRight,
  Layers,
  X,
  Code,
  CheckCircle,
  Terminal
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SolutionsSectionProps {
  onRequestSolution: (solutionTitle: string) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ onRequestSolution }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalSolution, setActiveModalSolution] = useState<SolutionExample | null>(null);

  const categoryMap: Record<string, string> = {
    'All': t.solutions.categories.all,
    'Web Experience': t.solutions.categories.webExperience,
    'Operations & Dashboards': t.solutions.categories.operationsDashboards,
    'Cloud & Systems': t.solutions.categories.cloudSystems,
    'Automation': t.solutions.categories.automation,
  };

  const solutions: SolutionExample[] = [
    {
      id: 'company-websites',
      category: t.solutions.categories.webExperience,
      categoryKey: 'Web Experience',
      title: t.solutions.items.companyWebsites.title,
      description: t.solutions.items.companyWebsites.description,
      architectureSummary: t.solutions.items.companyWebsites.architectureSummary,
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Edge CDN'],
      useCase: t.solutions.items.companyWebsites.useCase,
      iconName: 'Globe',
    },
    {
      id: 'customer-portals',
      category: t.solutions.categories.operationsDashboards,
      categoryKey: 'Operations & Dashboards',
      title: t.solutions.items.customerPortals.title,
      description: t.solutions.items.customerPortals.description,
      architectureSummary: t.solutions.items.customerPortals.architectureSummary,
      techStack: ['TypeScript', 'Express/Node', 'OAuth / Auth Tokens', 'PostgreSQL / Firestore'],
      useCase: t.solutions.items.customerPortals.useCase,
      iconName: 'UserCheck',
    },
    {
      id: 'booking-systems',
      category: t.solutions.categories.webExperience,
      categoryKey: 'Web Experience',
      title: t.solutions.items.bookingSystems.title,
      description: t.solutions.items.bookingSystems.description,
      architectureSummary: t.solutions.items.bookingSystems.architectureSummary,
      techStack: ['React', 'Node.js', 'Calendar API Sync', 'Stripe / Payment API'],
      useCase: t.solutions.items.bookingSystems.useCase,
      iconName: 'CalendarCheck',
    },
    {
      id: 'internal-dashboards',
      category: t.solutions.categories.operationsDashboards,
      categoryKey: 'Operations & Dashboards',
      title: t.solutions.items.internalDashboards.title,
      description: t.solutions.items.internalDashboards.description,
      architectureSummary: t.solutions.items.internalDashboards.architectureSummary,
      techStack: ['React', 'Recharts / D3', 'REST / WebSockets', 'Tailwind CSS'],
      useCase: t.solutions.items.internalDashboards.useCase,
      iconName: 'BarChart3',
    },
    {
      id: 'inventory-operations',
      category: t.solutions.categories.operationsDashboards,
      categoryKey: 'Operations & Dashboards',
      title: t.solutions.items.inventoryOperations.title,
      description: t.solutions.items.inventoryOperations.description,
      architectureSummary: t.solutions.items.inventoryOperations.architectureSummary,
      techStack: ['Node.js', 'PostgreSQL', 'Express', 'React Mobile-First UI'],
      useCase: t.solutions.items.inventoryOperations.useCase,
      iconName: 'Boxes',
    },
    {
      id: 'admin-platforms',
      category: t.solutions.categories.operationsDashboards,
      categoryKey: 'Operations & Dashboards',
      title: t.solutions.items.adminPlatforms.title,
      description: t.solutions.items.adminPlatforms.description,
      architectureSummary: t.solutions.items.adminPlatforms.architectureSummary,
      techStack: ['TypeScript', 'Express', 'Role-Based Access Control', 'Tailwind UI'],
      useCase: t.solutions.items.adminPlatforms.useCase,
      iconName: 'ShieldCheck',
    },
    {
      id: 'api-integrations',
      category: t.solutions.categories.cloudSystems,
      categoryKey: 'Cloud & Systems',
      title: t.solutions.items.apiIntegrations.title,
      description: t.solutions.items.apiIntegrations.description,
      architectureSummary: t.solutions.items.apiIntegrations.architectureSummary,
      techStack: ['Node.js', 'Express', 'Webhooks', 'REST / GraphQL', 'Redis Queue'],
      useCase: t.solutions.items.apiIntegrations.useCase,
      iconName: 'Webhook',
    },
    {
      id: 'cloud-apps',
      category: t.solutions.categories.cloudSystems,
      categoryKey: 'Cloud & Systems',
      title: t.solutions.items.cloudApps.title,
      description: t.solutions.items.cloudApps.description,
      architectureSummary: t.solutions.items.cloudApps.architectureSummary,
      techStack: ['Cloud Run / GCP', 'Docker', 'Express', 'React', 'Firestore / Cloud SQL'],
      useCase: t.solutions.items.cloudApps.useCase,
      iconName: 'CloudLightning',
    },
    {
      id: 'workflow-tools',
      category: t.solutions.categories.automation,
      categoryKey: 'Automation',
      title: t.solutions.items.workflowTools.title,
      description: t.solutions.items.workflowTools.description,
      architectureSummary: t.solutions.items.workflowTools.architectureSummary,
      techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      useCase: t.solutions.items.workflowTools.useCase,
      iconName: 'Workflow',
    },
    {
      id: 'business-automation',
      category: t.solutions.categories.automation,
      categoryKey: 'Automation',
      title: t.solutions.items.businessAutomation.title,
      description: t.solutions.items.businessAutomation.description,
      architectureSummary: t.solutions.items.businessAutomation.architectureSummary,
      techStack: ['Node.js', 'Cron Tasks', 'Background Workers', 'Message Queues'],
      useCase: t.solutions.items.businessAutomation.useCase,
      iconName: 'Cpu',
    },
  ];

  const categoryKeys = ['All', 'Web Experience', 'Operations & Dashboards', 'Cloud & Systems', 'Automation'];

  const filteredSolutions = selectedCategory === 'All'
    ? solutions
    : solutions.filter((s) => s.categoryKey === selectedCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-cyan-400" />;
      case 'CalendarCheck': return <CalendarCheck className="w-5 h-5 text-blue-400" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-cyan-400" />;
      case 'Boxes': return <Boxes className="w-5 h-5 text-blue-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case 'Webhook': return <Webhook className="w-5 h-5 text-blue-400" />;
      case 'CloudLightning': return <CloudLightning className="w-5 h-5 text-cyan-400" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-blue-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      default: return <Code className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section id="solutions" className="py-24 bg-[#020617] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.solutions.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
              {t.solutions.title}
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mt-2">
              {t.solutions.description}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            {categoryKeys.map((catKey) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === catKey
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {categoryMap[catKey] || catKey}
              </button>
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((sol) => (
            <div
              key={sol.id}
              className="glass-panel glass-panel-hover rounded-xl p-6 border border-blue-900/30 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-blue-800/40 group-hover:border-blue-500/50 transition-colors">
                    {getIcon(sol.iconName)}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    {sol.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-heading group-hover:text-blue-300 transition-colors mb-2">
                  {sol.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {sol.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalSolution(sol)}
                  className="text-xs font-mono text-blue-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{t.solutions.inspectArch}</span>
                </button>

                <button
                  onClick={() => onRequestSolution(sol.title)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={`${t.solutions.requestButton} ${sol.title}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Interactive Architecture Modal */}
      {activeModalSolution && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#060b19] border border-blue-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-950 border border-blue-800">
                  {getIcon(activeModalSolution.iconName)}
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                    {t.solutions.modal.overview}
                  </span>
                  <h3 className="text-2xl font-bold text-white font-heading">
                    {activeModalSolution.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalSolution(null)}
                className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-6">
              
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  {t.solutions.modal.systemDesc}
                </h4>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {activeModalSolution.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-blue-900/50">
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  {t.solutions.modal.patternHeader}
                </h4>
                <p className="text-slate-300 text-xs font-mono leading-relaxed">
                  {activeModalSolution.architectureSummary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  {t.solutions.modal.useCaseHeader}
                </h4>
                <p className="text-slate-300 text-sm">
                  {activeModalSolution.useCase}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
                  {t.solutions.modal.techStackHeader}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalSolution.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-md bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-mono font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={() => setActiveModalSolution(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                {t.solutions.modal.closeBlueprint}
              </button>

              <button
                onClick={() => {
                  const title = activeModalSolution.title;
                  setActiveModalSolution(null);
                  onRequestSolution(title);
                }}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50 flex items-center gap-2 cursor-pointer"
              >
                <span>{t.solutions.modal.requestCustomBuild}</span>
                <CheckCircle className="w-4 h-4 text-cyan-300" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
