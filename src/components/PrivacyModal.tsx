import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sections = [
    [t.privacy.s1Title, t.privacy.s1Text],
    [t.privacy.s2Title, t.privacy.s2Text],
    [t.privacy.s3Title, t.privacy.s3Text],
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-ink/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-surface text-ink rounded-[3px] max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[0_24px_64px_-16px_rgba(15,27,45,0.5)]"
      >
        <div className="sticky top-0 bg-surface flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-line">
          <h2 id="privacy-title" className="type-heading text-xl">
            {t.privacy.title}
          </h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t.privacy.close} className="p-1.5 -me-1.5 text-ink-2 hover:text-ink cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-5 text-ink-2 leading-relaxed">
          <p>
            <strong className="text-ink">Foundry Stack</strong> {t.privacy.p1}
          </p>
          {sections.map(([title, text]) => (
            <div key={title}>
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-1">{text}</p>
            </div>
          ))}
          <div>
            <h3 className="font-semibold text-ink">{t.privacy.s4Title}</h3>
            <p className="mt-1">
              {t.privacy.s4Text}{' '}
              <a href="mailto:hamza@foundrystack.net" className="text-brand-deep underline underline-offset-2">
                hamza@foundrystack.net
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
