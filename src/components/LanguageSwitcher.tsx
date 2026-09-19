import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, LanguageCode } from '../i18n/languages';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { language, setLanguage, languageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
          compact
            ? 'px-2.5 py-1.5 bg-slate-900/90 text-slate-200 border border-slate-800 hover:border-blue-500/60 hover:text-white'
            : 'px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-500/50 shadow-sm'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{languageInfo.flag}</span>
          <span>{compact ? languageInfo.code.toUpperCase() : languageInfo.nativeName}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#090d1f] border border-blue-500/40 shadow-2xl shadow-blue-950/80 py-1.5 text-xs font-mono animate-in fade-in zoom-in-95 z-50">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-cyan-400 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Select Language</span>
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/80 text-cyan-300 font-bold border-l-2 border-cyan-400'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
