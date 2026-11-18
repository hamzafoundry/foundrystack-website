import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LanguageCode, LANGUAGES, LanguageInfo } from './languages';
import { en, Translations } from './translations/en';

/*
  Only English ships in the main bundle (it is also what the pre-built HTML contains).
  Every other language is a separate file, downloaded only when a visitor needs it.
*/
const loaders: Record<LanguageCode, () => Promise<Translations>> = {
  en: async () => en,
  es: () => import('./translations/es').then((m) => m.es),
  ar: () => import('./translations/ar').then((m) => m.ar),
  zh: () => import('./translations/zh').then((m) => m.zh),
  fr: () => import('./translations/fr').then((m) => m.fr),
  pt: () => import('./translations/pt').then((m) => m.pt),
  ja: () => import('./translations/ja').then((m) => m.ja),
  de: () => import('./translations/de').then((m) => m.de),
};

const cache: Partial<Record<LanguageCode, Translations>> = { en };

export function loadTranslations(code: LanguageCode): Promise<Translations> {
  const cached = cache[code];
  if (cached) return Promise.resolve(cached);
  return loaders[code]().then((t) => (cache[code] = t));
}

export const LOCAL_STORAGE_KEY = 'foundry_lang';

export function readSavedLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as LanguageCode | null;
    if (saved && saved in loaders) return saved;
  } catch {
    // storage blocked: fall back to English
  }
  return 'en';
}

interface LanguageContextType {
  language: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
  initialTranslations?: Translations;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage = 'en',
  initialTranslations = en,
}) => {
  const [state, setState] = useState<{ language: LanguageCode; t: Translations }>({
    language: initialLanguage,
    t: initialTranslations,
  });

  const languageInfo = LANGUAGES.find((l) => l.code === state.language) || LANGUAGES[0];
  const isRtl = languageInfo.dir === 'rtl';

  const setLanguage = useCallback((code: LanguageCode) => {
    loadTranslations(code)
      .then((t) => {
        setState({ language: code, t });
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, code);
        } catch {
          // storage blocked: the choice simply isn't remembered
        }
      })
      .catch((e) => console.warn(`Could not load the ${code} translation:`, e));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dir = isRtl ? 'rtl' : 'ltr';
    root.lang = state.language;
    // Set by the inline script in index.html while a non-English language loads
    root.classList.remove('lang-pending');
    if (state.t.meta?.title) document.title = state.t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', state.t.meta.description);
  }, [state, isRtl]);

  return (
    <LanguageContext.Provider value={{ language: state.language, languageInfo, setLanguage, t: state.t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
