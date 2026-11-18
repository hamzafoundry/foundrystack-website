import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/*
  FoundryStack agents: small glowing cores that drift on slow looping paths and
  periodically hand work to each other along a glowing line.

  Rendering note: positions are written straight to the DOM inside one
  requestAnimationFrame loop, so React never re-renders per frame.
*/

export type AgentShape = 'window' | 'hex' | 'orbit' | 'diamond';

export interface AgentDef {
  id: 'automation' | 'web' | 'systems' | 'cloud';
  title: string;
  description: string;
  shape: AgentShape;
}

interface Path {
  ax: number; // anchor, as a fraction of the field
  ay: number;
  rx: number; // drift radius, fraction of the field
  ry: number;
  wx: number; // angular speed, rad/s
  wy: number;
  px: number; // phase
  py: number;
}

type PathSet = Record<AgentDef['id'], Path>;

// Desktop: agents keep to the right half and the lower band, clear of the headline.
const DESKTOP: PathSet = {
  automation: { ax: 0.72, ay: 0.47, rx: 0.045, ry: 0.07, wx: 0.34, wy: 0.43, px: 0, py: 1.2 },
  web: { ax: 0.57, ay: 0.83, rx: 0.06, ry: 0.045, wx: 0.29, wy: 0.37, px: 2, py: 0.4 },
  systems: { ax: 0.88, ay: 0.25, rx: 0.035, ry: 0.08, wx: 0.31, wy: 0.24, px: 4, py: 2.2 },
  cloud: { ax: 0.9, ay: 0.77, rx: 0.045, ry: 0.06, wx: 0.23, wy: 0.33, px: 1, py: 3 },
};

// Phones: only the hub and one agent travel; the other two hover in place.
const MOBILE: PathSet = {
  automation: { ax: 0.5, ay: 0.5, rx: 0.07, ry: 0.07, wx: 0.36, wy: 0.45, px: 0, py: 1.2 },
  web: { ax: 0.2, ay: 0.24, rx: 0.07, ry: 0.06, wx: 0.3, wy: 0.4, px: 2, py: 0.4 },
  systems: { ax: 0.81, ay: 0.24, rx: 0, ry: 0.018, wx: 0, wy: 0.9, px: 0, py: 2 },
  cloud: { ax: 0.78, ay: 0.8, rx: 0, ry: 0.018, wx: 0, wy: 0.8, px: 0, py: 0.5 },
};

// Handoffs follow how the work flows, always through the automation hub.
const LINKS: [AgentDef['id'], AgentDef['id']][] = [
  ['web', 'automation'],
  ['automation', 'systems'],
  ['systems', 'automation'],
  ['automation', 'cloud'],
  ['cloud', 'automation'],
  ['automation', 'web'],
];

const LINK_LIFE = 2.6; // seconds
const AGENT = 46; // px, agent size and hit area (glyphs are drawn on a 36-unit grid and scaled)

export const AgentGlyph: React.FC<{ shape: AgentShape; active: boolean; spin: boolean; size?: number }> = ({ shape, active, spin, size = AGENT }) => {
  const fill = active ? '#3D8BFF' : 'rgba(61,139,255,0.16)';
  const stroke = active ? '#FFFFFF' : '#7DB2FF';
  const common = { fill, stroke, strokeWidth: 1.6, strokeLinejoin: 'round' as const, style: { transition: 'fill 200ms, stroke 200ms' } };
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" className="overflow-visible">
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

interface AgentFieldProps {
  agents: AgentDef[];
  rtl: boolean;
  className?: string;
}

export const AgentField: React.FC<AgentFieldProps> = ({ agents, rtl, className = '' }) => {
  const reduceMotion = !!useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const agentRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const eyeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linkRefs = useRef<{ glow: SVGLineElement | null; core: SVGLineElement | null; pulse: SVGCircleElement | null }[]>([
    { glow: null, core: null, pulse: null },
    { glow: null, core: null, pulse: null },
  ]);
  const labelRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<AgentDef['id'] | null>(null);
  const [pinned, setPinned] = useState(false);
  const [mobile, setMobile] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  // Re-runs layout once, used by the static (reduced-motion) version when a label opens
  const relayoutRef = useRef<() => void>(() => {});

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Tap outside or Escape closes a pinned label
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      if (!agentRefs.current.some((el) => el && el.contains(e.target as Node))) {
        setActive(null);
        setPinned(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(null);
        setPinned(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [active]);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const paths = mobile ? MOBILE : DESKTOP;
    const size = { w: field.clientWidth, h: field.clientHeight };
    const clocks = agents.map(() => 0);
    const pos = agents.map(() => ({ x: 0, y: 0, angle: 0 }));
    const index = Object.fromEntries(agents.map((a, i) => [a.id, i])) as Record<AgentDef['id'], number>;
    const slots: ({ a: number; b: number; start: number } | null)[] = [null, null];
    let seq = 0;
    let nextLinkAt = 0.8;
    let elapsed = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const place = (dtByAgent: (i: number) => number) => {
      agents.forEach((agent, i) => {
        clocks[i] += dtByAgent(i);
        const p = paths[agent.id];
        const t = clocks[i];
        const ax = rtl ? 1 - p.ax : p.ax;
        const x = (ax + p.rx * Math.sin(p.wx * t + p.px)) * size.w;
        const y = (p.ay + p.ry * Math.sin(p.wy * t + p.py)) * size.h;
        const vx = p.rx * p.wx * Math.cos(p.wx * t + p.px) * size.w;
        const vy = p.ry * p.wy * Math.cos(p.wy * t + p.py) * size.h;
        pos[i].x = x;
        pos[i].y = y;
        if (Math.abs(vx) + Math.abs(vy) > 0.5) pos[i].angle = Math.atan2(vy, vx);
        const el = agentRefs.current[i];
        if (el) el.style.transform = `translate3d(${x - AGENT / 2}px, ${y - AGENT / 2}px, 0)`;
        const eye = eyeRefs.current[i];
        if (eye) eye.style.transform = `rotate(${pos[i].angle}rad) translateX(4px)`;
      });
    };

    const placeLabel = () => {
      const label = labelRef.current;
      const id = activeRef.current;
      if (!label || !id) return;
      const p = pos[index[id]];
      const lw = label.offsetWidth;
      const lh = label.offsetHeight;
      const roomRight = size.w - p.x;
      let x = roomRight > lw + 40 ? p.x + 30 : p.x - 30 - lw;
      x = Math.max(8, Math.min(size.w - lw - 8, x));
      let y = p.y - lh / 2;
      y = Math.max(8, Math.min(size.h - lh - 8, y));
      label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const drawLinks = () => {
      slots.forEach((slot, s) => {
        const r = linkRefs.current[s];
        if (!r.core || !r.glow || !r.pulse) return;
        if (!slot) {
          r.core.style.opacity = r.glow.style.opacity = r.pulse.style.opacity = '0';
          return;
        }
        const k = (elapsed - slot.start) / LINK_LIFE;
        if (k >= 1) {
          slots[s] = null;
          r.core.style.opacity = r.glow.style.opacity = r.pulse.style.opacity = '0';
          return;
        }
        const A = pos[slot.a];
        const B = pos[slot.b];
        const env = Math.sin(Math.PI * k);
        for (const line of [r.core, r.glow]) {
          line.setAttribute('x1', String(A.x));
          line.setAttribute('y1', String(A.y));
          line.setAttribute('x2', String(B.x));
          line.setAttribute('y2', String(B.y));
        }
        r.core.style.opacity = String(env * 0.75);
        r.glow.style.opacity = String(env * 0.3);
        const travel = Math.min(1, Math.max(0, (k - 0.15) / 0.65));
        r.pulse.setAttribute('cx', String(A.x + (B.x - A.x) * travel));
        r.pulse.setAttribute('cy', String(A.y + (B.y - A.y) * travel));
        r.pulse.style.opacity = String(travel > 0 && travel < 1 ? env : 0);
      });
    };

    const ro = new ResizeObserver(() => {
      size.w = field.clientWidth;
      size.h = field.clientHeight;
      if (reduceMotion) {
        place(() => 0);
        placeLabel();
      }
    });
    ro.observe(field);

    if (reduceMotion) {
      // Calm version: agents rest at their anchors; the hub's connections stay faintly visible.
      relayoutRef.current = () => {
        place(() => 0);
        placeLabel();
      };
      relayoutRef.current();
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(field);

    function frame(now: number) {
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      const held = activeRef.current;
      place((i) => (agents[i].id === held ? 0 : dt));

      if (elapsed >= nextLinkAt) {
        const free = mobile ? (slots[0] ? -1 : 0) : slots.findIndex((s) => !s);
        if (free !== -1) {
          const [a, b] = LINKS[seq % LINKS.length];
          slots[free] = { a: index[a], b: index[b], start: elapsed };
          seq += 1;
        }
        nextLinkAt = elapsed + (mobile ? LINK_LIFE + 0.8 : 1.5);
      }
      drawLinks();
      placeLabel();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [agents, mobile, reduceMotion, rtl]);

  // In the static version nothing runs per frame, so position the label when it opens
  useLayoutEffect(() => {
    if (reduceMotion && active) relayoutRef.current();
  }, [active, reduceMotion]);

  const current = agents.find((a) => a.id === active);
  const hubIndex = agents.findIndex((a) => a.id === 'automation');
  const staticPositions = (() => {
    if (!reduceMotion) return null;
    const paths = mobile ? MOBILE : DESKTOP;
    return agents.map((a) => ({ x: (rtl ? 1 - paths[a.id].ax : paths[a.id].ax) * 100, y: paths[a.id].ay * 100 }));
  })();

  return (
    <div ref={fieldRef} className={`${className}`} dir="ltr">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {staticPositions &&
          staticPositions.map((p, i) =>
            i === hubIndex ? null : (
              <line
                key={i}
                x1={`${staticPositions[hubIndex].x}%`}
                y1={`${staticPositions[hubIndex].y}%`}
                x2={`${p.x}%`}
                y2={`${p.y}%`}
                stroke="#8B7CFF"
                strokeWidth="1.2"
                opacity="0.28"
              />
            ),
          )}
        {!reduceMotion &&
          linkRefs.current.map((_, s) => (
            <g key={s}>
              <line ref={(el) => { linkRefs.current[s].glow = el; }} stroke="#8B7CFF" strokeWidth="7" strokeLinecap="round" style={{ opacity: 0 }} />
              <line ref={(el) => { linkRefs.current[s].core = el; }} stroke="#A99FFF" strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0 }} />
              <circle ref={(el) => { linkRefs.current[s].pulse = el; }} r="3.2" fill="#E4E0FF" style={{ opacity: 0, filter: 'drop-shadow(0 0 6px #8B7CFF)' }} />
            </g>
          ))}
      </svg>

      {agents.map((agent, i) => {
        const isActive = active === agent.id;
        return (
          <button
            key={agent.id}
            ref={(el) => { agentRefs.current[i] = el; }}
            type="button"
            aria-label={agent.title}
            aria-describedby={isActive ? 'agent-label' : undefined}
            aria-expanded={isActive}
            onMouseEnter={() => !pinned && setActive(agent.id)}
            onMouseLeave={() => !pinned && setActive(null)}
            onFocus={() => setActive(agent.id)}
            onBlur={() => !pinned && setActive(null)}
            onClick={() => {
              if (pinned && isActive) {
                setPinned(false);
                setActive(null);
              } else {
                setPinned(true);
                setActive(agent.id);
              }
            }}
            className="absolute top-0 left-0 rounded-full cursor-pointer will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7DB2FF]"
            style={{ width: AGENT, height: AGENT, transform: 'translate3d(-100px,-100px,0)' }}
          >
            {/* halo */}
            <span
              className="absolute pointer-events-none rounded-full"
              style={{
                inset: mobile ? -16 : -30,
                background: `radial-gradient(circle, rgba(61,139,255,${isActive ? 0.5 : 0.28}) 0%, rgba(61,139,255,0) 70%)`,
                transition: 'background 200ms',
              }}
            />
            <span
              className="relative block transition-transform duration-200"
              style={{ transform: isActive ? 'scale(1.25)' : 'scale(1)' }}
            >
              <AgentGlyph shape={agent.shape} active={isActive} spin={!reduceMotion} />
              {/* the eye: a small light slit that looks where the agent is heading */}
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span ref={(el) => { eyeRefs.current[i] = el; }} className="block" style={{ transform: 'translateX(4px)' }}>
                  <span className="block w-[9px] h-[3px] rounded-full bg-white shadow-[0_0_6px_#BFD8FF]" />
                </span>
              </span>
            </span>
          </button>
        );
      })}

      <div
        ref={labelRef}
        id="agent-label"
        role="tooltip"
        dir={rtl ? 'rtl' : 'ltr'}
        className={`absolute top-0 left-0 w-[min(270px,calc(100%-16px))] p-4 rounded-[4px] bg-[#0F1F38]/95 border border-[#3D8BFF]/45 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm pointer-events-none transition-opacity duration-150 text-start ${
          current ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'translate3d(-400px,-400px,0)' }}
      >
        {current && (
          <>
            <p className="font-semibold text-white leading-snug">{current.title}</p>
            <p className="mt-1.5 text-sm text-white/75 leading-relaxed">{current.description}</p>
          </>
        )}
      </div>
    </div>
  );
};
