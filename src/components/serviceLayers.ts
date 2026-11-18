import type { Translations } from '../i18n/translations/en';
import type { AgentShape } from './AgentGlyph';

export type ServiceId = 'web-apps' | 'custom-systems' | 'ai-automation' | 'cloud-integrations';
type ServiceKey = keyof Translations['services']['items'];

export interface ServiceLayer {
  id: ServiceId;
  key: ServiceKey;
  /** Same shape as this service's agent in the hero */
  shape: AgentShape;
  /** Index into t.contact.fields.projectTypeOptions (AI automation is option 0) */
  projectTypeIndex: number;
  /**
   * Tools shown in the "See how it works" layer. Product names are the same in every language,
   * so they live here rather than in the translation files.
   * Entries wrapped in ⟦ ⟧ are unconfirmed placeholders: the owner must confirm or replace them before launch.
   */
  tools: string[];
}

/** Display order: the flagship first. */
export const SERVICE_LAYERS: ServiceLayer[] = [
  {
    id: 'ai-automation',
    key: 'aiAutomation',
    shape: 'orbit',
    projectTypeIndex: 0,
    tools: ['n8n', 'Claude', 'OpenAI', 'Webhooks', 'Scheduled jobs'],
  },
  {
    id: 'web-apps',
    key: 'webApps',
    shape: 'window',
    projectTypeIndex: 1,
    tools: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Global CDN', 'Analytics'],
  },
  {
    id: 'custom-systems',
    key: 'customSystems',
    shape: 'hex',
    projectTypeIndex: 2,
    tools: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Firestore', 'Role-based access'],
  },
  {
    id: 'cloud-integrations',
    key: 'cloudIntegrations',
    shape: 'diamond',
    projectTypeIndex: 3,
    // The apps this card connects ("Tools we connect") are translated, so they live in the translation files.
    tools: ['REST APIs', 'GraphQL', 'Webhooks', 'Queues & retries', 'Google Cloud Run'],
  },
];

/** The flagship offer, shown first and largest. */
export const FEATURED_SERVICE: ServiceId = 'ai-automation';

/** Placeholder strings are marked ⟦…⟧ so they stand out in review and can be found with one search. */
export const isPlaceholder = (s: string) => s.includes('⟦');
