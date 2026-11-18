import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/*
  Isometric exploded stack. Each slab is drawn from three faces:
  top (rhombus), left side and right side. Slab 0 is the top of the stack.
*/

const CX = 200;
const HALF_W = 150; // half the rhombus width
const QUARTER = 75; // half the rhombus height (isometric 2:1)
const THICK = 40; // slab thickness
const GAP = 92; // vertical distance between slabs
const TOP = 26;
const LABEL_MAX = 124; // usable length on the right face, in user units

const COLORS = {
  idle: { top: 'var(--color-steel-top)', left: 'var(--color-steel-left)', right: 'var(--color-steel-right)', text: '#0F1B2D', edge: '#9AA6B4' },
  active: { top: '#0066FF', left: '#002B70', right: '#0047B8', text: '#FFFFFF', edge: '#002B70' },
};

function faces(i: number) {
  const y = TOP + i * GAP;
  const top = `${CX},${y} ${CX + HALF_W},${y + QUARTER} ${CX},${y + 2 * QUARTER} ${CX - HALF_W},${y + QUARTER}`;
  const left = `${CX - HALF_W},${y + QUARTER} ${CX},${y + 2 * QUARTER} ${CX},${y + 2 * QUARTER + THICK} ${CX - HALF_W},${y + QUARTER + THICK}`;
  const right = `${CX},${y + 2 * QUARTER} ${CX + HALF_W},${y + QUARTER} ${CX + HALF_W},${y + QUARTER + THICK} ${CX},${y + 2 * QUARTER + THICK}`;
  return { y, top, left, right };
}

const FaceLabel: React.FC<{ text: string; x: number; y: number; color: string }> = ({ text, x, y, color }) => {
  const ref = useRef<SVGTextElement>(null);
  const [fit, setFit] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    setFit(undefined);
    const raf = requestAnimationFrame(() => {
      const el = ref.current;
      if (el && el.getComputedTextLength() > LABEL_MAX) setFit(LABEL_MAX);
    });
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <text
      ref={ref}
      // skewY(-26.57deg): follows the right face, whose top edge rises 1 unit for every 2 across
      transform={`matrix(1 -0.5 0 1 ${x} ${y})`}
      fill={color}
      fontSize="15"
      fontWeight="650"
      style={{ fontVariationSettings: '"wdth" 78', transition: 'fill 250ms' }}
      textLength={fit}
      lengthAdjust={fit ? 'spacingAndGlyphs' : undefined}
    >
      {text}
    </text>
  );
};

interface StackGraphicProps {
  labels: string[];
  active: number;
  onSelect?: (index: number) => void;
  /** Static, label-free miniature used next to service rows */
  mini?: boolean;
  className?: string;
}

export const StackGraphic: React.FC<StackGraphicProps> = ({ labels, active, onSelect, mini = false, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const count = labels.length;
  const height = TOP + (count - 1) * GAP + 2 * QUARTER + THICK + 8;
  const interactive = !!onSelect && !mini;

  // Paint bottom slab first so upper slabs overlap the ones beneath.
  const order = Array.from({ length: count }, (_, i) => count - 1 - i);

  return (
    <svg
      viewBox={`0 -14 400 ${height + 14}`}
      // Geometry is direction-independent: labels must grow rightward along the slab face.
      // Arabic still shapes and orders correctly under an ltr base direction.
      style={{ direction: 'ltr' }}
      className={className}
      role={interactive ? 'group' : undefined}
      aria-hidden={mini ? true : undefined}
    >
      {order.map((i) => {
        const f = faces(i);
        const isActive = i === active;
        const c = isActive ? COLORS.active : COLORS.idle;
        const lift = isActive ? -14 : interactive && hovered === i ? -7 : 0;

        const slab = (
          <g
            style={{
              transform: `translateY(${lift}px)`,
              transition: reduceMotion ? undefined : 'transform 320ms cubic-bezier(.2,.8,.2,1)',
              cursor: interactive ? 'pointer' : undefined,
              outline: 'none',
            }}
            {...(interactive
              ? {
                  role: 'button',
                  tabIndex: 0,
                  'aria-pressed': isActive,
                  'aria-label': labels[i],
                  onClick: () => onSelect!(i),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect!(i);
                    }
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      const next = (i + (e.key === 'ArrowDown' ? 1 : count - 1)) % count;
                      onSelect!(next);
                      const nodes = (e.currentTarget.ownerSVGElement?.querySelectorAll('[role="button"]') ?? []) as NodeListOf<SVGGElement>;
                      // nodes are painted bottom-up, so reverse the index
                      nodes[count - 1 - next]?.focus();
                    }
                  },
                  onMouseEnter: () => setHovered(i),
                  onMouseLeave: () => setHovered(null),
                  onFocus: () => setFocused(i),
                  onBlur: () => setFocused(null),
                }
              : {})}
          >
            <polygon points={f.left} fill={c.left} stroke={c.edge} strokeWidth="1" strokeLinejoin="round" style={{ transition: 'fill 250ms' }} />
            <polygon points={f.right} fill={c.right} stroke={c.edge} strokeWidth="1" strokeLinejoin="round" style={{ transition: 'fill 250ms' }} />
            <polygon points={f.top} fill={c.top} stroke={c.edge} strokeWidth="1" strokeLinejoin="round" style={{ transition: 'fill 250ms' }} />
            {interactive && focused === i && (
              <polygon points={f.top} fill="none" stroke="#0066FF" strokeWidth="3" strokeDasharray="6 5" transform="translate(0 -6)" />
            )}
            {!mini && (
              <FaceLabel text={labels[i]} x={CX + 14} y={f.y + 2 * QUARTER + THICK * 0.66} color={c.text} />
            )}
          </g>
        );

        if (mini || reduceMotion) return <g key={i}>{slab}</g>;

        // The one orchestrated moment on the page: slabs are cast into place, bottom first.
        return (
          <motion.g
            key={i}
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + (count - 1 - i) * 0.13, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {slab}
          </motion.g>
        );
      })}
    </svg>
  );
};
