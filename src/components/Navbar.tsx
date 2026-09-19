import React, { useState, useEffect } from 'react';
import { FoundryLogo } from './FoundryLogo';
import { Menu, X, ArrowUpRight, Code, Terminal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section
      const sections = ['home', 'services', 'solutions', 'capabilities', 'process', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#home', id: 'home' },
    { name: t.nav.services, href: '#services', id: 'services' },
    { name: t.nav.capabilities, href: '#capabilities', id: 'capabilities' },
    { name: t.nav.solutions, href: '#solutions', id: 'solutions' },
    { name: t.nav.about, href: '#about', id: 'about' },
    { name: t.nav.contact, href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#020617]/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="Foundry Stack Home"
          >
            <FoundryLogo size="sm" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-slate-900/60 p-1 border border-blue-900/30 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-blue-600/80 shadow-[0_0_12px_rgba(0,102,255,0.4)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button & Language Switcher & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Primary CTA */}
            <button
              onClick={onOpenContact}
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-400/30 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:shadow-[0_0_28px_rgba(0,102,255,0.5)] transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>{t.nav.discussProject}</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900/80 border border-blue-800/40 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-blue-400" /> : <Menu className="w-6 h-6 text-blue-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#030712]/95 border-b border-blue-900/50 backdrop-blur-xl py-6 px-6 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                {t.nav.mobileTitle}
              </span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-mono">
                {t.nav.version}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-blue-950/60 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <Code className="w-4 h-4 text-slate-500" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.nav.discussProject}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
