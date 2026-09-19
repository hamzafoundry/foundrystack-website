import React from 'react';

interface FoundryLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FoundryLogo: React.FC<FoundryLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  // Dimension scales
  const sizeMap = {
    sm: { markSize: 32, textScale: 'text-sm', stackScale: 'text-xs', gap: 'gap-2.5' },
    md: { markSize: 42, textScale: 'text-lg', stackScale: 'text-sm', gap: 'gap-3' },
    lg: { markSize: 56, textScale: 'text-2xl', stackScale: 'text-base', gap: 'gap-4' },
    hero: { markSize: 84, textScale: 'text-4xl', stackScale: 'text-xl', gap: 'gap-6' },
  };

  const current = sizeMap[size];

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center ${current.gap} cursor-pointer group select-none ${className}`}
      id="foundry-stack-brand-logo"
    >
      {/* SVG Monogram Mark */}
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        {/* Soft background ambient glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/20 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
        
        <svg
          width={current.markSize}
          height={current.markSize * 1.15}
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_4px_12px_rgba(0,102,255,0.4)]"
        >
          <defs>
            <linearGradient id="fsBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A3FF" />
              <stop offset="50%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#0040C0" />
            </linearGradient>
            <linearGradient id="fsWhiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <filter id="fsGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* TOP ELEMENT: 'F' in Crisp White */}
          {/* Main F vertical stem and top arm */}
          <path
            d="M18 12 H76 L68 26 H34 V48 H62 L55 60 H34 V92 H18 V12 Z"
            fill="url(#fsWhiteGradient)"
          />

          {/* Integrated Cloud Outline on Top Right of F */}
          <path
            d="M62 18 C62 14 66 10 72 10 C77 10 81 13 82 17 C85 17 88 19 88 23 C88 27 84 29 80 29 H64 C60 29 58 26 58 23 C58 20 60 18 62 18 Z"
            fill="none"
            stroke="#00A3FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Code Symbol </ > inside notch */}
          <g filter="url(#fsGlow)">
            <text
              x="44"
              y="44"
              fill="#00E0FF"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="-1"
            >
              &lt;/&gt;
            </text>
          </g>

          {/* BOTTOM ELEMENT: 'S' in Electric Blue */}
          {/* S Ribbon shape */}
          <path
            d="M34 56 C34 56 65 52 78 62 C90 71 85 86 70 92 C55 98 32 94 32 94 L30 106 C30 106 60 110 82 101 C100 93 100 70 82 58 C68 49 46 51 46 51 L34 56 Z"
            fill="url(#fsBlueGradient)"
          />

          {/* Integrated Circuit/Network Node on Bottom Left of S */}
          <g transform="translate(10, 80)">
            <circle cx="8" cy="12" r="3" fill="#00E0FF" />
            <circle cx="2" cy="2" r="2.5" fill="#00A3FF" />
            <circle cx="2" cy="22" r="2.5" fill="#00A3FF" />
            <line x1="8" y1="12" x2="2" y2="2" stroke="#00A3FF" strokeWidth="2" />
            <line x1="8" y1="12" x2="2" y2="22" stroke="#00A3FF" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Brand Text Block */}
      <div className="flex flex-col tracking-wider">
        <div className="flex items-center gap-1.5 font-heading">
          <span className={`font-extrabold text-white tracking-[0.2em] ${current.textScale} drop-shadow-md`}>
            FOUNDRY
          </span>
        </div>
        
        {/* Stack Line with Accent Bars */}
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-3 bg-gradient-to-r from-blue-600 to-transparent opacity-80" />
          <span className={`font-bold text-blue-400 tracking-[0.3em] uppercase ${current.stackScale}`}>
            STACK
          </span>
          <span className="h-[1px] w-6 bg-gradient-to-l from-blue-600 to-transparent opacity-80" />
        </div>

        {/* Brand Tagline */}
        {showTagline && (
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-[0.25em] uppercase mt-1">
            Software. Systems. Solutions.
          </span>
        )}
      </div>
    </div>
  );
};
