import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, LanguageCode } from '../i18n/languages';

export const LanguageSwitcher: React.FC<{ onDark?: boolean }> = ({ onDark = false }) => {
  const { language, setLanguage, languageInfo, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const select = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={`press inline-flex items-center gap-1.5 px-2.5 py-2 rounded-[3px] text-sm font-medium cursor-pointer ${
          onDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-ink-2 hover:text-ink hover:bg-surface/70'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${t.nav.selectLanguage}: ${languageInfo.name}`}
      >
        <span className="uppercase tracking-wide">{languageInfo.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="menu-pop absolute end-0 mt-2 w-52 bg-surface border border-line rounded-[3px] shadow-[0_12px_32px_-12px_rgba(15,27,45,0.35)] py-1 z-50">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  lang={lang.code}
                  onClick={() => select(lang.code)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-start text-sm cursor-pointer transition-colors ${
                    isSelected ? 'text-brand-deep font-semibold bg-ground/60' : 'text-ink hover:bg-ground/60'
                  }`}
                >
                  <span>
                    {lang.nativeName}
                    {lang.nativeName !== lang.name && <span className="ms-2 text-ink-3 font-normal">{lang.name}</span>}
                  </span>
                  {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
