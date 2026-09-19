import React, { useState } from 'react';
import { FoundryLogo } from './FoundryLogo';
import { PrivacyModal } from './PrivacyModal';
import { Terminal, Shield, ArrowUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#020617] text-slate-400 py-16 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <FoundryLogo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed pt-2 font-sans">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-semibold">
              {t.footer.navHeader}
            </span>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => handleNavClick('#home')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#services')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#capabilities')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.capabilities}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#solutions')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.solutions}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#about')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Legal / Action */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-semibold">
              {t.footer.legalHeader}
            </span>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.footer.privacyLink}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#contact')} className="hover:text-white transition-colors cursor-pointer">
                  {t.footer.contactLink}
                </button>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                <span>{t.footer.backToTop}</span>
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-500" />
            <span>&copy; {new Date().getFullYear()} {t.footer.copyright}</span>
          </div>

          <div className="text-[11px] text-slate-500">
            {t.footer.tagline}
          </div>
        </div>

      </div>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
};
