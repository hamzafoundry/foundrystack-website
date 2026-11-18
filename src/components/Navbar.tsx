import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { FoundryLogo } from './FoundryLogo';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onOpenContact: () => void;
}

// 'ai-automation' sits inside 'services', so it is checked first and wins while it is on screen
const SECTION_IDS = ['home', 'ai-automation', 'services', 'examples', 'capabilities', 'process', 'about', 'contact'];

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
      const probe = window.scrollY + 120;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && probe >= el.offsetTop && probe < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: t.nav.aiAutomation, id: 'ai-automation', flagship: true },
    { name: t.nav.services, id: 'services' },
    { name: t.nav.examples, id: 'examples' },
    { name: t.nav.capabilities, id: 'capabilities' },
    { name: t.nav.howWeWork, id: 'process' },
    { name: t.nav.about, id: 'about' },
    // The main button already leads to the contact form, so Contact only appears in the phone menu
    { name: t.nav.contact, id: 'contact', mobileOnly: true },
  ];

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const solid = isScrolled || mobileMenuOpen;
  // At the very top the bar floats over the dark hero, so it uses light text
  const onDark = !solid;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        solid ? 'bg-ground/95 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-6">
        <a href="#home" onClick={(e) => go(e, 'home')} aria-label="Foundry Stack" className="flex-shrink-0">
          <FoundryLogo size="sm" tone={onDark ? 'dark' : 'light'} />
        </a>

        <nav className="hidden xl:flex items-center gap-6" aria-label="Main">
          {navLinks.filter((l) => !l.mobileOnly).map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => go(e, link.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative py-2 text-[15px] whitespace-nowrap transition-colors inline-flex items-center gap-2 ${
                  link.flagship ? 'font-semibold' : 'font-medium'
                } ${
                  onDark
                    ? isActive || link.flagship ? 'text-white' : 'text-white/75 hover:text-white'
                    : isActive || link.flagship ? 'text-ink' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {link.flagship && <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_#3D8BFF]" aria-hidden="true" />}
                {link.name}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] bg-brand origin-left transition-transform duration-200 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher onDark={onDark} />
          <button
            type="button"
            onClick={onOpenContact}
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-[3px] bg-brand text-white text-sm font-semibold whitespace-nowrap hover:bg-brand-deep transition-colors cursor-pointer"
          >
            {t.nav.discussProject}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className={`xl:hidden p-2 -me-2 cursor-pointer ${onDark ? 'text-white' : 'text-ink'}`}
            aria-label={t.nav.mobileTitle}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-nav" className="xl:hidden border-t border-line bg-ground px-4 sm:px-6 pb-6" aria-label="Main">
          <ul>
            {navLinks.map((link) => (
              <li key={link.id} className="border-b border-line">
                <a
                  href={`#${link.id}`}
                  onClick={(e) => go(e, link.id)}
                  className={`flex items-center gap-2.5 py-4 text-lg ${link.flagship ? 'font-semibold' : 'font-medium'} ${
                    activeSection === link.id ? 'text-brand-deep' : 'text-ink'
                  }`}
                >
                  {link.flagship && <span className="w-2 h-2 rounded-full bg-brand" aria-hidden="true" />}
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContact();
            }}
            className="mt-6 w-full py-4 rounded-[3px] bg-brand text-white font-semibold cursor-pointer"
          >
            {t.nav.discussProject}
          </button>
        </nav>
      )}
    </header>
  );
};
