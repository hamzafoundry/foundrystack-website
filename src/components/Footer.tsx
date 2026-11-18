import React, { useState } from 'react';
import { FoundryLogo } from './FoundryLogo';
import { PrivacyModal } from './PrivacyModal';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { id: 'ai-automation', name: t.nav.aiAutomation },
    { id: 'services', name: t.nav.services },
    { id: 'examples', name: t.nav.examples },
    { id: 'process', name: t.nav.howWeWork },
    { id: 'about', name: t.nav.about },
  ];

  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/15">
          <div className="md:col-span-6">
            <FoundryLogo size="md" tone="dark" />
            <p className="mt-6 max-w-[40ch] leading-relaxed">{t.footer.brandDesc}</p>
          </div>

          <nav className="md:col-span-3" aria-label={t.footer.navHeader}>
            <h2 className="text-sm font-semibold text-white">{t.footer.navHeader}</h2>
            <ul className="mt-4 space-y-2.5">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} className="link-grow">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-white">{t.footer.legalHeader}</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button type="button" onClick={() => setPrivacyOpen(true)} className="link-grow cursor-pointer text-start">
                  {t.footer.privacyLink}
                </button>
              </li>
              <li>
                <a href="#contact" onClick={(e) => go(e, 'contact')} className="link-grow">
                  {t.footer.contactLink}
                </a>
              </li>
              <li>
                <a href="#home" onClick={(e) => go(e, 'home')} className="link-grow">
                  {t.footer.backToTop}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-sm text-white/50">
          {/* The year is baked in at build time; the browser may disagree on New Year's Day */}
          <p suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
};
