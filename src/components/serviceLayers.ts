import type { Translations } from '../i18n/translations/en';

export type ServiceId = 'web-apps' | 'custom-systems' | 'ai-automation' | 'cloud-integrations';
type ServiceKey = keyof Translations['services']['items'];

export interface ServiceLayer {
  id: ServiceId;
  key: ServiceKey;
  /** Index into t.contact.fields.projectTypeOptions (AI automation is option 0) */
  projectTypeIndex: number;
}

/**
 * The Foundry Stack, top to bottom: what people see, the logic behind it,
 * the automation running on that logic, and the cloud everything sits on.
 * This order drives the small stack icons; display order is set by FEATURED_SERVICE.
 */
export const SERVICE_LAYERS: ServiceLayer[] = [
  { id: 'web-apps', key: 'webApps', projectTypeIndex: 1 },
  { id: 'custom-systems', key: 'customSystems', projectTypeIndex: 2 },
  { id: 'ai-automation', key: 'aiAutomation', projectTypeIndex: 0 },
  { id: 'cloud-integrations', key: 'cloudIntegrations', projectTypeIndex: 3 },
];

/** The flagship offer, shown first and largest. */
export const FEATURED_SERVICE: ServiceId = 'ai-automation';

/** Solution categories mapped to the closest project type option. */
export const CATEGORY_PROJECT_TYPE_INDEX: Record<string, number> = {
  Automation: 0,
  'Web Experience': 1,
  'Operations & Dashboards': 2,
  'Cloud & Systems': 3,
};
