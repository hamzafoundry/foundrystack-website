import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCalmMotion, useHydrated } from '../lib/useHydrated';
import { SectionHeader } from './SectionHeader';

/**
 * How we work: one piece of work travels down the rail beside the four steps.
 * The travelling is native `position: sticky` (no JavaScript per scroll frame).
 * JavaScript only notices which step is level with the card and updates its status.
 *
 * `active === null` is the finished picture: all steps lit, status "Live".
 * That is what the pre-built HTML and reduced-motion visitors see.
 */
export const ApproachSection: React.FC = () => {
  const { t } = useLanguage();
  const a = t.approach;
  const hydrated = useHydrated();
  const calm = useCalmMotion();
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated || calm) {
      setActive(null);
      return;
    }
    setActive(0);
    // A thin band at the card's sticky height: whichever step crosses it is the current one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = stepRefs.current.indexOf(entry.target as HTMLLIElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: '-42% 0px -52% 0px' },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [hydrated, calm]);

  const reached = active ?? a.steps.length - 1;
  const live = reached === a.steps.length - 1;

  return (
    <section id="process" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={a.title} description={a.intro} />

        <div className="ap-layout">
          {/* The rail: a progress line and the travelling work card */}
          <div className="ap-rail" aria-hidden="true">
            <span className="ap-line" />
            <span className="ap-fill" style={{ transform: `scaleY(${(reached + 1) / a.steps.length})` }} />
            <div className="ap-sticky">
              <span className="ap-dot" data-live={live ? '1' : '0'} />
              <div className="ap-card">
                <span className="flex items-center gap-2 text-white/90 text-sm">
                  <BarChart3 className="w-4 h-4 text-[#7db2ff] flex-none" />
                  {t.hero.work.report}
                </span>
                <span className="ap-status" data-live={live ? '1' : '0'}>
                  {live ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <span className="ap-status-dot" />}
                  {a.status[reached]}
                </span>
              </div>
            </div>
          </div>

          {/* A real sequence, so it is numbered */}
          <ol className="ap-steps">
            {a.steps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="ap-step"
                data-reached={i <= reached ? '1' : '0'}
              >
                <span className="type-display block text-[3rem] leading-none text-brand" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="type-heading text-2xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-lg text-ink-2 leading-relaxed max-w-[52ch]">{step.happens}</p>
                  <div className="mt-4 border-s-2 border-brand ps-4">
                    <p className="text-sm font-semibold text-brand-deep">{a.youGet}</p>
                    <p className="mt-1 text-ink">{step.get}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
