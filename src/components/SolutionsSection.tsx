import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SectionHeader } from './SectionHeader';

interface SolutionsSectionProps {
  /** Receives the solution's category key, used to preselect the project type */
  onRequestSolution: (categoryKey: string) => void;
}

type CategoryKey = 'Web Experience' | 'Operations & Dashboards' | 'Cloud & Systems' | 'Automation';

// Automation solutions lead: they are the flagship offer
const SOLUTIONS: { id: string; key: string; category: CategoryKey; stack: string[] }[] = [
  { id: 'workflow-tools', key: 'workflowTools', category: 'Automation', stack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'] },
  { id: 'business-automation', key: 'businessAutomation', category: 'Automation', stack: ['Node.js', 'Cron Tasks', 'Background Workers', 'Message Queues'] },
  { id: 'company-websites', key: 'companyWebsites', category: 'Web Experience', stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Edge CDN'] },
  { id: 'customer-portals', key: 'customerPortals', category: 'Operations & Dashboards', stack: ['TypeScript', 'Express/Node', 'OAuth / Auth Tokens', 'PostgreSQL / Firestore'] },
  { id: 'booking-systems', key: 'bookingSystems', category: 'Web Experience', stack: ['React', 'Node.js', 'Calendar API Sync', 'Stripe / Payment API'] },
  { id: 'internal-dashboards', key: 'internalDashboards', category: 'Operations & Dashboards', stack: ['React', 'Recharts / D3', 'REST / WebSockets', 'Tailwind CSS'] },
  { id: 'inventory-operations', key: 'inventoryOperations', category: 'Operations & Dashboards', stack: ['Node.js', 'PostgreSQL', 'Express', 'React Mobile-First UI'] },
  { id: 'admin-platforms', key: 'adminPlatforms', category: 'Operations & Dashboards', stack: ['TypeScript', 'Express', 'Role-Based Access Control', 'Tailwind UI'] },
  { id: 'api-integrations', key: 'apiIntegrations', category: 'Cloud & Systems', stack: ['Node.js', 'Express', 'Webhooks', 'REST / GraphQL', 'Redis Queue'] },
  { id: 'cloud-apps', key: 'cloudApps', category: 'Cloud & Systems', stack: ['Cloud Run / GCP', 'Docker', 'Express', 'React', 'Firestore / Cloud SQL'] },
];

const FILTERS: ('All' | CategoryKey)[] = ['All', 'Automation', 'Web Experience', 'Operations & Dashboards', 'Cloud & Systems'];

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ onRequestSolution }) => {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const categoryLabel: Record<(typeof FILTERS)[number], string> = {
    All: t.solutions.categories.all,
    'Web Experience': t.solutions.categories.webExperience,
    'Operations & Dashboards': t.solutions.categories.operationsDashboards,
    'Cloud & Systems': t.solutions.categories.cloudSystems,
    Automation: t.solutions.categories.automation,
  };

  const items = t.solutions.items as Record<string, { title: string; description: string; architectureSummary: string; useCase: string }>;
  const visible = SOLUTIONS.filter((s) => filter === 'All' || s.category === filter);

  return (
    <section id="solutions" className="py-24 md:py-32 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.solutions.title} description={t.solutions.description} />

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8" role="group" aria-label={t.solutions.badge}>
          {FILTERS.map((key) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(key)}
                className={`py-2 text-[15px] font-medium border-b-2 transition-colors cursor-pointer ${
                  isActive ? 'text-ink border-brand' : 'text-ink-3 border-transparent hover:text-ink'
                }`}
              >
                {categoryLabel[key]}
              </button>
            );
          })}
        </div>

        <ul className="border-t border-ink">
          {visible.map((sol) => {
            const copy = items[sol.key];
            const isOpen = openId === sol.id;
            const panelId = `solution-${sol.id}`;
            return (
              <li key={sol.id} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : sol.id)}
                  className="w-full grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] gap-x-8 gap-y-2 py-6 text-start items-baseline group cursor-pointer"
                >
                  <span className="type-heading text-xl sm:text-2xl text-ink group-hover:text-brand-deep transition-colors">
                    {copy.title}
                  </span>
                  <span className="hidden md:block text-ink-2 leading-relaxed">{copy.description}</span>
                  <Plus
                    aria-hidden="true"
                    className={`w-6 h-6 text-ink self-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  />
                  <span className="md:hidden col-span-2 text-ink-2 leading-relaxed">{copy.description}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] gap-x-8 gap-y-6 pb-10">
                        <div className="text-sm text-ink-3">{categoryLabel[sol.category]}</div>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-semibold text-ink">{t.solutions.modal.patternHeader}</h4>
                            <p className="mt-1.5 text-ink-2 leading-relaxed">{copy.architectureSummary}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-ink">{t.solutions.modal.useCaseHeader}</h4>
                            <p className="mt-1.5 text-ink-2 leading-relaxed">{copy.useCase}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-ink">{t.solutions.modal.techStackHeader}</h4>
                            <ul className="mt-2.5 flex flex-wrap gap-2">
                              {sol.stack.map((tech) => (
                                <li key={tech} className="px-2.5 py-1 text-sm text-ink border border-line bg-ground/50 rounded-[3px]">
                                  {tech}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRequestSolution(sol.category)}
                            className="inline-flex px-6 py-3 rounded-[3px] bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors cursor-pointer"
                          >
                            {t.solutions.modal.requestCustomBuild}
                          </button>
                        </div>
                        {/* matches the icon column of the row above so both columns line up */}
                        <span className="hidden md:block w-6" aria-hidden="true" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
