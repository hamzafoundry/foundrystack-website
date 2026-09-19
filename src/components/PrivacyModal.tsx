import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#060b19] border border-blue-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#060b19] z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white font-heading">
              {t.privacy.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          <p>
            <strong>Foundry Stack</strong> {t.privacy.p1}
          </p>

          <h4 className="text-sm font-bold text-white font-heading pt-2">{t.privacy.s1Title}</h4>
          <p>{t.privacy.s1Text}</p>

          <h4 className="text-sm font-bold text-white font-heading pt-2">{t.privacy.s2Title}</h4>
          <p>{t.privacy.s2Text}</p>

          <h4 className="text-sm font-bold text-white font-heading pt-2">{t.privacy.s3Title}</h4>
          <p>{t.privacy.s3Text}</p>

          <h4 className="text-sm font-bold text-white font-heading pt-2">{t.privacy.s4Title}</h4>
          <p>
            {t.privacy.s4Text} <span className="font-mono text-cyan-400">hamza@foundrystack.net</span>.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
          >
            {t.privacy.close}
          </button>
        </div>

      </div>
    </div>
  );
};
