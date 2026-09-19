import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, LANGUAGES, LanguageInfo } from './languages';
import { en, Translations } from './translations/en';
import { es } from './translations/es';
import { ar } from './translations/ar';
import { zh } from './translations/zh';
import { fr } from './translations/fr';
import { pt } from './translations/pt';
import { ja } from './translations/ja';
import { de } from './translations/de';

const translationMap: Record<LanguageCode, Translations> = {
  en,
  es,
  ar,
  zh,
  fr,
  pt,
  ja,
  de,
};

interface LanguageContextType {
  language: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'foundry_lang';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as LanguageCode;
      if (saved && translationMap[saved]) {
        return saved;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for language setting:', e);
    }
    return 'en';
  });

  const languageInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const t = translationMap[language] || en;
  const isRtl = languageInfo.dir === 'rtl';

  const setLanguage = (code: LanguageCode) => {
    if (translationMap[code]) {
      setLanguageState(code);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, code);
      } catch (e) {
        console.warn('Failed to save language to localStorage:', e);
      }
    }
  };

  useEffect(() => {
    // Update HTML attributes for layout & RTL support
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Update document title and meta description
    if (t.meta?.title) {
      document.title = t.meta.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t.meta?.description) {
      metaDesc.setAttribute('content', t.meta.description);
    }
  }, [language, isRtl, t]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageInfo,
        setLanguage,
        t,
        isRtl,
      }}
    >
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
