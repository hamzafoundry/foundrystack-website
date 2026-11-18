import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import { en } from './i18n/translations/en';

/** Used only at build time (scripts/prerender.mjs) to write the English page into index.html. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <LanguageProvider initialLanguage="en" initialTranslations={en}>
        <App />
      </LanguageProvider>
    </StrictMode>,
  );
}
