import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider, loadTranslations, readSavedLanguage } from './i18n/LanguageContext.tsx';
import { en, Translations } from './i18n/translations/en';
import type { LanguageCode } from './i18n/languages';
import './index.css';

const container = document.getElementById('root')!;

const tree = (language: LanguageCode, t: Translations) => (
  <StrictMode>
    <LanguageProvider initialLanguage={language} initialTranslations={t}>
      <App />
    </LanguageProvider>
  </StrictMode>
);

const language = readSavedLanguage();

if (language === 'en' && container.firstElementChild) {
  // The pre-built English HTML is already on screen: attach to it without re-drawing.
  hydrateRoot(container, tree('en', en));
} else {
  // Another language (or the dev server, which has no pre-built HTML): fetch it, then draw.
  loadTranslations(language)
    .catch(() => en)
    .then((t) => {
      const chosen = t === en ? 'en' : language;
      container.textContent = '';
      createRoot(container).render(tree(chosen, t));
    });
}
