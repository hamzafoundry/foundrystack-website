import React, { useId } from 'react';

interface FoundryLogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** 'light' for use on the aluminium/white ground, 'dark' for ink bands */
  tone?: 'light' | 'dark';
  className?: string;
}

const SIZES = {
  sm: { mark: 30, word: 'text-[15px]', stack: 'text-[11px]', gap: 'gap-2.5' },
  md: { mark: 40, word: 'text-lg', stack: 'text-[13px]', gap: 'gap-3' },
  lg: { mark: 56, word: 'text-2xl', stack: 'text-base', gap: 'gap-4' },
};

export const FoundryLogo: React.FC<FoundryLogoProps> = ({ size = 'md', tone = 'light', className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const s = SIZES[size];
  const onDark = tone === 'dark';
  const fTop = onDark ? '#FFFFFF' : '#1B2A40';
  const fBottom = onDark ? '#DCE3EC' : '#0F1B2D';

  return (
    <span className={`inline-flex items-center ${s.gap} select-none ${className}`} dir="ltr">
      <svg
        width={s.mark}
        height={s.mark * 1.15}
        viewBox="0 0 100 115"
        fill="none"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id={`fsBlue${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A8CFF" />
            <stop offset="55%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0047B8" />
          </linearGradient>
          <linearGradient id={`fsF${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={fTop} />
            <stop offset="100%" stopColor={fBottom} />
          </linearGradient>
        </defs>
        <path d="M18 12 H76 L68 26 H34 V48 H62 L55 60 H34 V92 H18 V12 Z" fill={`url(#fsF${uid})`} />
        <path
          d="M62 18 C62 14 66 10 72 10 C77 10 81 13 82 17 C85 17 88 19 88 23 C88 27 84 29 80 29 H64 C60 29 58 26 58 23 C58 20 60 18 62 18 Z"
          stroke="#0066FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="44" y="44" fill="#0066FF" fontSize="12" fontWeight="bold" fontFamily="monospace" letterSpacing="-1">
          &lt;/&gt;
        </text>
        <path
          d="M34 56 C34 56 65 52 78 62 C90 71 85 86 70 92 C55 98 32 94 32 94 L30 106 C30 106 60 110 82 101 C100 93 100 70 82 58 C68 49 46 51 46 51 L34 56 Z"
          fill={`url(#fsBlue${uid})`}
        />
        <g transform="translate(10, 80)">
          <circle cx="8" cy="12" r="3" fill="#0066FF" />
          <circle cx="2" cy="2" r="2.5" fill="#0066FF" />
          <circle cx="2" cy="22" r="2.5" fill="#0066FF" />
          <line x1="8" y1="12" x2="2" y2="2" stroke="#0066FF" strokeWidth="2" />
          <line x1="8" y1="12" x2="2" y2="22" stroke="#0066FF" strokeWidth="2" />
        </g>
      </svg>

      <span className="flex flex-col leading-none" style={{ fontVariationSettings: '"wdth" 125' }}>
        <span className={`font-extrabold tracking-[0.14em] ${s.word} ${onDark ? 'text-white' : 'text-ink'}`}>
          FOUNDRY
        </span>
        <span className={`mt-1 font-bold tracking-[0.42em] ${s.stack} ${onDark ? 'text-[#7FB0FF]' : 'text-brand'}`}>
          STACK
        </span>
      </span>
    </span>
  );
};
