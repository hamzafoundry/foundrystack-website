import React from 'react';

export type AgentShape = 'window' | 'hex' | 'orbit' | 'diamond';

interface AgentGlyphProps {
  shape: AgentShape;
  active: boolean;
  /** Turn the automation agent's orbit ring (off for reduced motion) */
  spin: boolean;
  /** Pixel size; omit to fill the parent box */
  size?: number;
}

/**
 * The shared icon family for FoundryStack's four agents, drawn on a 36-unit grid:
 * window = websites, hex = business tools, orbit = AI & automation, diamond = connected tools.
 */
export const AgentGlyph: React.FC<AgentGlyphProps> = ({ shape, active, spin, size }) => {
  const fill = active ? '#3D8BFF' : 'rgba(61,139,255,0.16)';
  const stroke = active ? '#FFFFFF' : '#7DB2FF';
  const common = { fill, stroke, strokeWidth: 1.6, strokeLinejoin: 'round' as const, style: { transition: 'fill 200ms, stroke 200ms' } };
  return (
    <svg
      width={size ?? '100%'}
      height={size ?? '100%'}
      viewBox="0 0 36 36"
      aria-hidden="true"
      className="block overflow-visible"
    >
      {shape === 'window' && (
        <>
          <rect x="8" y="10" width="20" height="16" rx="4" {...common} />
          <line x1="8" y1="15" x2="28" y2="15" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
        </>
      )}
      {shape === 'hex' && <polygon points="18,7 27.5,12.5 27.5,23.5 18,29 8.5,23.5 8.5,12.5" {...common} />}
      {shape === 'diamond' && (
        <>
          <polygon points="18,7 29,18 18,29 7,18" {...common} />
          <circle cx="3.5" cy="18" r="1.8" fill="#7DB2FF" />
          <circle cx="32.5" cy="18" r="1.8" fill="#7DB2FF" />
        </>
      )}
      {shape === 'orbit' && (
        <>
          <g className={spin ? 'agent-orbit' : undefined} style={{ transformOrigin: '18px 18px' }}>
            <ellipse cx="18" cy="18" rx="17" ry="6.5" fill="none" stroke="#9E92FF" strokeWidth="1.1" opacity="0.8" transform="rotate(-24 18 18)" />
            <circle cx="33.5" cy="11" r="1.9" fill="#C2B9FF" />
          </g>
          <circle cx="18" cy="18" r="9" {...common} />
        </>
      )}
    </svg>
  );
};
