import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, BarChart3, CalendarDays, Check, FileText, Mail, Package, UserRound } from 'lucide-react';
import { AgentGlyph, AgentShape } from './AgentGlyph';
import { useCalmMotion, useHydrated } from '../lib/useHydrated';
import { isLowPowerDevice, whenIdleAfterLoad } from '../lib/device';

/*
  "Off your plate": work cards wait in a pile, an agent takes the front card,
  pulls it across, and drops it on the done pile, crossed off.

  Performance rules this file follows:
  - Every element keeps a fixed CSS home position (left/top in %). Movement is only
    ever a transform on top of that home, so nothing changes layout (no layout shift).
  - Movement runs on the browser's animation engine (element.animate), not a per-frame
    JavaScript loop. JavaScript only wakes up a few times per job to start the next move.
  - Nothing moves until the page has loaded and the browser is idle.
*/

export type AgentId = 'web' | 'automation' | 'systems' | 'cloud';

export interface FlowAgent {
  id: AgentId;
  shape: AgentShape;
  name: string;
  line: string;
}

export interface FlowJob {
  key: string;
  label: string;
  agent: AgentId;
  icon: 'mail' | 'file' | 'package' | 'chart' | 'user' | 'calendar';
}

type Pt = [number, number]; // percent of the scene box, left-to-right coordinates

interface Layout {
  agents: Record<AgentId, Pt>;
  inbox: Pt[]; // front, middle, back
  done: Pt[]; // newest, middle, oldest
  entry: Pt; // where a recycled card re-enters from
  /** Where the agent stands relative to the card it carries */
  carry: (cardWidth: number) => [number, number];
  interval: number; // ms between jobs
}

// Wide scenes (640px and up): a row of agents between the two piles.
const WIDE: Layout = {
  agents: { web: [50, 20], automation: [50, 40], systems: [50, 60], cloud: [50, 80] },
  inbox: [[18, 54], [16, 45], [19, 36]],
  done: [[82, 54], [84, 63], [81, 72]],
  entry: [19, 24], // new work drops in from just above the pile, never from beside the text
  carry: (w) => [w / 2 + 34, 0],
  interval: 3300,
};

// Narrow scenes (phones): piles side by side, the crew in a row underneath.
const NARROW: Layout = {
  agents: { web: [14, 87], automation: [38, 87], systems: [62, 87], cloud: [86, 87] },
  inbox: [[25, 50], [23, 35], [27, 20]],
  done: [[75, 50], [77, 35], [73, 20]],
  entry: [27, 6],
  carry: () => [0, 50],
  interval: 4600,
};

const ROT_INBOX = [-3, 2, -2];
const ROT_DONE = [2, -2, 1];
const Z_SLOT = [3, 2, 1];

const ICONS = { mail: Mail, file: FileText, package: Package, chart: BarChart3, user: UserRound, calendar: CalendarDays };

// Cards 0-2 start in the inbox (front to back), cards 3-5 on the done pile (newest to oldest).
const initialSlot = (i: number) => (i < 3 ? { pile: 'inbox' as const, idx: i } : { pile: 'done' as const, idx: i - 3 });

function slotVars(i: number): React.CSSProperties {
  const s = initialSlot(i);
  const wide = (s.pile === 'inbox' ? WIDE.inbox : WIDE.done)[s.idx];
  const narrow = (s.pile === 'inbox' ? NARROW.inbox : NARROW.done)[s.idx];
  const r = (s.pile === 'inbox' ? ROT_INBOX : ROT_DONE)[s.idx];
  return {
    ['--xw' as string]: `${wide[0]}%`,
    ['--yw' as string]: `${wide[1]}%`,
    ['--xn' as string]: `${narrow[0]}%`,
    ['--yn' as string]: `${narrow[1]}%`,
    ['--r' as string]: `${r}deg`,
    zIndex: Z_SLOT[s.idx],
  };
}

function agentVars(id: AgentId, i: number): React.CSSProperties {
  return {
    ['--xw' as string]: `${WIDE.agents[id][0]}%`,
    ['--yw' as string]: `${WIDE.agents[id][1]}%`,
    ['--xn' as string]: `${NARROW.agents[id][0]}%`,
    ['--yn' as string]: `${NARROW.agents[id][1]}%`,
    ['--r' as string]: '0deg',
    ['--d' as string]: `${-i * 0.85}s`, // offsets each agent's idle bob and blink
    zIndex: 20,
  };
}

interface FrameState {
  x: number;
  y: number;
  r: number;
  s: number;
  o: number;
}

interface Piece {
  el: HTMLElement;
  home: { x: number; y: number };
  cur: FrameState;
}

const tf = (p: Piece, f: FrameState) =>
  `translate(-50%, -50%) translate(${f.x - p.home.x}px, ${f.y - p.home.y}px) rotate(${f.r}deg) scale(${f.s})`;

interface WorkFlowProps {
  agents: FlowAgent[];
  jobs: FlowJob[]; // exactly 6
  doneLabel: string;
  rtl: boolean;
  className?: string;
}

export const WorkFlow: React.FC<WorkFlowProps> = ({ agents, jobs, doneLabel, rtl, className = '' }) => {
  const hydrated = useHydrated();
  const calm = useCalmMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const agentRefs = useRef<Partial<Record<AgentId, HTMLButtonElement | null>>>({});
  const tipRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef<Set<AgentId>>(new Set());
  const agentEls = () => Object.values(agentRefs.current) as (HTMLButtonElement | null | undefined)[];

  const [open, setOpen] = useState<AgentId | null>(null);
  const [pinned, setPinned] = useState(false);

  // ---- the choreography ----
  useEffect(() => {
    if (!hydrated || calm) return;
    const scene = sceneRef.current;
    if (!scene) return;

    const timers = new Set<number>();
    const anims = new Set<Animation>();
    let stopped = false;
    let running = false;
    let visible = true;
    let nextTick: number | undefined;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!stopped) fn();
      }, ms);
      timers.add(id);
      return id;
    };

    // Everything below is (re)built on start and on resize: reads layout once, then only writes transforms.
    let layout: Layout;
    let px: (p: Pt) => { x: number; y: number };
    let sign = 1;
    let cards: Piece[] = [];
    let crew: Partial<Record<AgentId, Piece>> = {};
    let inbox: number[] = [];
    let done: number[] = [];

    const reset = () => {
      anims.forEach((a) => a.cancel());
      anims.clear();
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = '';
        el.style.opacity = '';
        el.style.zIndex = String(Z_SLOT[initialSlot(i).idx]);
        el.dataset.done = i >= 3 ? '1' : '0';
      });
      agentEls().forEach((el) => {
        if (!el) return;
        el.style.transform = '';
        el.dataset.look = '';
      });
    };

    const build = () => {
      const narrow = window.matchMedia('(max-width: 639px)').matches;
      layout = narrow ? NARROW : WIDE;
      const W = scene.clientWidth;
      const H = scene.clientHeight;
      sign = rtl ? -1 : 1;
      px = ([x, y]) => ({ x: ((rtl ? 100 - x : x) / 100) * W, y: (y / 100) * H });
      cards = cardRefs.current.map((el, i) => {
        const s = initialSlot(i);
        const pt = (s.pile === 'inbox' ? layout.inbox : layout.done)[s.idx];
        const r = (s.pile === 'inbox' ? ROT_INBOX : ROT_DONE)[s.idx] * sign;
        const home = px(pt);
        return { el: el!, home, cur: { ...home, r, s: 1, o: 1 } };
      });
      crew = {};
      agents.forEach((a) => {
        const el = agentRefs.current[a.id];
        if (!el) return;
        const home = px(layout.agents[a.id]);
        crew[a.id] = { el, home, cur: { ...home, r: 0, s: 1, o: 1 } };
      });
      inbox = [0, 1, 2];
      done = [3, 4, 5];
    };

    const move = (p: Piece, frames: Partial<FrameState & { offset: number }>[], duration: number, easing: string) => {
      // Each frame inherits position/rotation/scale/opacity from the one before; timing offsets are not inherited.
      let prev: FrameState = p.cur;
      const keyframes: Keyframe[] = [{ transform: tf(p, p.cur), opacity: p.cur.o }];
      for (const { offset, ...f } of frames) {
        prev = { ...prev, ...f };
        keyframes.push({ transform: tf(p, prev), opacity: prev.o, ...(offset !== undefined ? { offset } : {}) });
      }
      p.cur = prev;
      const a = p.el.animate(keyframes, { duration, easing, fill: 'forwards' });
      anims.add(a);
      a.finished
        .then(() => {
          p.el.style.transform = tf(p, p.cur);
          p.el.style.opacity = String(p.cur.o);
          a.cancel();
          anims.delete(a);
        })
        .catch(() => anims.delete(a));
    };

    const look = (id: AgentId, toX: number | null) => {
      const ag = crew[id];
      if (!ag) return;
      ag.el.dataset.look = toX === null ? '' : (toX < ag.cur.x ? 'l' : 'r');
    };

    const squash = (id: AgentId) => {
      const body = crew[id]?.el.querySelector<HTMLElement>('.wf-tilt');
      if (!body) return;
      const a = body.animate(
        [{ transform: 'scale(1,1)' }, { transform: 'scale(1.12,0.86)' }, { transform: 'scale(0.96,1.05)' }, { transform: 'scale(1,1)' }],
        { duration: 420, easing: 'ease-out' },
      );
      anims.add(a);
      a.finished.then(() => anims.delete(a)).catch(() => anims.delete(a));
    };

    const job = () => {
      const front = inbox[0];
      const agentId = jobs[front].agent;
      const ag = crew[agentId];
      const card = cards[front];
      if (!ag || !card) return;

      const [cdx, cdy] = layout.carry(card.el.offsetWidth);
      const pick = { x: card.cur.x + cdx * sign, y: card.cur.y + cdy };
      const dropCard = px(layout.done[0]);
      const drop = { x: dropCard.x + cdx * sign, y: dropCard.y + cdy };

      // 1. The agent steps over to the pile: a small wind-up, then a springy arrival.
      look(agentId, pick.x);
      const away = { x: ag.cur.x - (pick.x - ag.cur.x) * 0.06, y: ag.cur.y - (pick.y - ag.cur.y) * 0.06 };
      move(ag, [{ ...away, offset: 0.16 }, { ...pick }], 780, 'cubic-bezier(.3,1.2,.5,1)');

      // 2. It takes the card and pulls it across to the done pile.
      later(() => {
        card.el.style.zIndex = '15';
        look(agentId, drop.x);
        move(card, [{ s: 1.05, r: 0, offset: 0.12 }, { x: dropCard.x, y: dropCard.y, r: ROT_DONE[0] * sign, s: 1 }], 1050, 'cubic-bezier(.65,0,.3,1)');
        move(ag, [{ ...drop }], 1050, 'cubic-bezier(.65,0,.3,1)');

        // The pile behind closes up, and the oldest finished card comes back round as new work.
        inbox.shift();
        inbox.forEach((ci, slot) => {
          cards[ci].el.style.zIndex = String(Z_SLOT[slot]);
          move(cards[ci], [{ ...px(layout.inbox[slot]), r: ROT_INBOX[slot] * sign }], 480, 'cubic-bezier(.3,1.1,.5,1)');
        });
        const recycled = done.pop()!;
        const rc = cards[recycled];
        move(rc, [{ o: 0, s: 0.96 }], 220, 'ease-in');
        later(() => {
          rc.el.dataset.done = '0';
          const entry = px(layout.entry);
          rc.cur = { ...rc.cur, x: entry.x, y: entry.y, r: ROT_INBOX[2] * sign, s: 1, o: 0 };
          rc.el.style.zIndex = String(Z_SLOT[2]);
          move(rc, [{ ...px(layout.inbox[2]), o: 1 }], 720, 'cubic-bezier(.2,.9,.3,1)');
          inbox.push(recycled);
        }, 260);
      }, 800);

      // 3. Drop: the done pile shifts down, the card lands crossed off, the agent settles.
      later(() => {
        done.forEach((ci, slot) => {
          cards[ci].el.style.zIndex = String(Z_SLOT[slot + 1]);
          move(cards[ci], [{ ...px(layout.done[slot + 1]), r: ROT_DONE[slot + 1] * sign }], 420, 'cubic-bezier(.3,1.1,.5,1)');
        });
      }, 1550);
      later(() => {
        card.el.dataset.done = '1';
        card.el.style.zIndex = String(Z_SLOT[0]);
        done.unshift(front);
        squash(agentId);
      }, 1860);

      // 4. Back home.
      later(() => {
        look(agentId, ag.home.x);
        move(ag, [{ ...ag.home }], 760, 'cubic-bezier(.3,1.25,.5,1)');
        later(() => look(agentId, null), 760);
      }, 2050);
    };

    const tick = () => {
      if (!visible) {
        running = false;
        return;
      }
      running = true;
      const front = inbox[0];
      if (pausedRef.current.has(jobs[front].agent)) {
        nextTick = later(tick, 900); // that agent is being looked at: wait
        return;
      }
      job();
      nextTick = later(tick, layout.interval * (isLowPowerDevice() ? 1.3 : 1));
    };

    let started = false;
    const start = () => {
      if (stopped || started) return;
      started = true;
      build();
      cards.forEach((c) => (c.el.style.transform = tf(c, c.cur)));
      Object.values(crew).forEach((c) => c && (c.el.style.transform = tf(c, c.cur)));
      nextTick = later(tick, 600);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && started && !running) nextTick = later(tick, 400);
    });
    io.observe(scene);

    let resizeTimer: number | undefined;
    const ro = new ResizeObserver(() => {
      if (!started) return;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // Simplest correct response: return to the resting arrangement and start again.
        reset();
        started = false;
        running = false;
        start();
      }, 250);
    });
    ro.observe(scene);

    const cancelStart = whenIdleAfterLoad(start);

    return () => {
      stopped = true;
      cancelStart();
      clearTimeout(resizeTimer);
      if (nextTick) clearTimeout(nextTick);
      io.disconnect();
      ro.disconnect();
      reset();
    };
  }, [hydrated, calm, rtl, agents, jobs]);

  // ---- agent labels: hover, focus or tap ----
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!agentEls().some((el) => el && el.contains(e.target as Node))) {
        setOpen(null);
        setPinned(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setPinned(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    pausedRef.current = new Set(open ? [open] : []);
  }, [open]);

  // Place the label beside the agent (measured once when it opens, not every frame)
  useLayoutEffect(() => {
    const tip = tipRef.current;
    const scene = sceneRef.current;
    const agentEl = open ? agentRefs.current[open] : null;
    if (!tip || !scene || !agentEl) return;
    const s = scene.getBoundingClientRect();
    const a = agentEl.getBoundingClientRect();
    const cx = a.left + a.width / 2 - s.left;
    const cy = a.top + a.height / 2 - s.top;
    const narrow = window.matchMedia('(max-width: 639px)').matches;
    let x: number;
    let y: number;
    if (narrow) {
      // phones: above the crew row
      x = cx - tip.offsetWidth / 2;
      y = cy - a.height / 2 - 14 - tip.offsetHeight;
    } else {
      // beside the agent, towards the done pile
      const toward = rtl ? -1 : 1;
      x = toward > 0 ? cx + a.width / 2 + 18 : cx - a.width / 2 - 18 - tip.offsetWidth;
      y = cy - tip.offsetHeight / 2;
    }
    x = Math.max(4, Math.min(s.width - tip.offsetWidth - 4, x));
    y = Math.max(4, Math.min(s.height - tip.offsetHeight - 4, y));
    tip.style.transform = `translate(${x}px, ${y}px)`;
  }, [open, rtl]);

  const current = agents.find((a) => a.id === open);

  return (
    <div ref={sceneRef} className={`wf-scene ${className}`}>
      {/* Direction of the work: pile -> crew -> done. Quiet, and the backbone of the still version. */}
      {/* placed in the clear gaps: pile edge -> crew -> done pile edge */}
      <span className="wf-item wf-arrow" style={{ ['--xw' as string]: '40.5%', ['--yw' as string]: '54%', ['--xn' as string]: '50%', ['--yn' as string]: '35%' }} aria-hidden="true">
        <ArrowRight className="w-5 h-5" />
      </span>
      <span className="wf-item wf-arrow wf-arrow-wide" style={{ ['--xw' as string]: '59.5%', ['--yw' as string]: '54%' }} aria-hidden="true">
        <ArrowRight className="w-5 h-5" />
      </span>

      {jobs.map((job, i) => {
        const Icon = ICONS[job.icon];
        return (
          <div
            key={job.key}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="wf-item wf-card"
            data-done={i >= 3 ? '1' : '0'}
            style={slotVars(i)}
            aria-hidden="true"
          >
            <Icon className="wf-card-icon" />
            <span className="wf-card-label">{job.label}</span>
            <span className="wf-card-done">
              <Check className="w-3 h-3" strokeWidth={3} />
              {doneLabel}
            </span>
          </div>
        );
      })}

      {agents.map((agent, i) => {
        const isOpen = open === agent.id;
        return (
          <button
            key={agent.id}
            ref={(el) => {
              agentRefs.current[agent.id] = el;
            }}
            type="button"
            className={`wf-item wf-agent ${agent.id === 'automation' ? 'wf-agent-flagship' : ''}`}
            style={agentVars(agent.id, i)}
            data-open={isOpen ? '1' : '0'}
            aria-label={agent.name}
            aria-expanded={isOpen}
            aria-describedby={isOpen ? 'wf-tip' : undefined}
            onMouseEnter={() => !pinned && setOpen(agent.id)}
            onMouseLeave={() => !pinned && setOpen(null)}
            onFocus={() => setOpen(agent.id)}
            onBlur={() => !pinned && setOpen(null)}
            onClick={() => {
              if (pinned && isOpen) {
                setPinned(false);
                setOpen(null);
              } else {
                setPinned(true);
                setOpen(agent.id);
              }
            }}
          >
            <span className="wf-shadow" aria-hidden="true" />
            <span className="wf-tilt">
              <span className="wf-lift">
                <span className="wf-bob">
                  <span className="wf-halo" aria-hidden="true" />
                  <AgentGlyph shape={agent.shape} active={isOpen} spin={!calm} />
                  {/* the eye: looks where the agent is heading, blinks now and then */}
                  <span className="wf-eye-pos" aria-hidden="true">
                    <span className="wf-eye" />
                  </span>
                </span>
              </span>
            </span>
          </button>
        );
      })}

      <div
        ref={tipRef}
        id="wf-tip"
        role={current ? 'tooltip' : undefined}
        aria-hidden={current ? undefined : true}
        className={`wf-tip ${current ? 'is-open' : ''}`}
      >
        {current && (
          <>
            <p className="font-semibold text-white leading-snug">{current.name}</p>
            <p className="mt-1.5 text-sm text-white/75 leading-relaxed">{current.line}</p>
          </>
        )}
      </div>
    </div>
  );
};
