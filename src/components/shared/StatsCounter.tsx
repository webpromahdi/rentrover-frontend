"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { animate } from "motion";
import { Sparkles } from "lucide-react";

export interface StatItem {
  label: string;
  target: number;
  sub: string;
}

interface StatsCounterProps {
  items: StatItem[];
}

export function StatsCounter({ items }: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 lg:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-white"
    >
      {items.map((item, index) => (
        <StatCell
          key={item.label}
          item={item}
          index={index}
          triggered={isInView}
          reduceMotion={!!prefersReducedMotion}
        />
      ))}
    </div>
  );
}

// ─── Individual cell ──────────────────────────────────────────────────────────

interface StatCellProps {
  item: StatItem;
  index: number;
  triggered: boolean;
  reduceMotion: boolean;
}

function StatCell({ item, index, triggered, reduceMotion }: StatCellProps) {

  const [count, setCount] = useState(() => (reduceMotion ? item.target : 0));
  const hasRun = useRef(false);

  useEffect(() => {
    // Reduced-motion: correct value already set via the lazy initializer.
    if (reduceMotion) return;

    // Animation path: wait for the IntersectionObserver trigger and run once.
    if (!triggered || hasRun.current) return;
    hasRun.current = true;

    const controls = animate(0, item.target, {
      duration: 1.1,                                                        // marketing tier — longer budget is correct
      delay: index * 0.08,                                                  // 80ms stagger between columns
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],        // --ease-out token
      onUpdate: (v: number) => setCount(Math.round(v)),
      onComplete: () => setCount(item.target),                              // guarantee exact final value
    });

    // Clean up if the component unmounts before the animation completes.
    return () => {
      controls.stop();
    };
  }, [triggered, item.target, index, reduceMotion]);

  return (
    <div className="flex items-center gap-4 px-2">
      <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Sparkles className="size-6 text-primary" />
      </div>
      <div>
        {/* tabular-nums keeps the layout stable while numbers roll */}
        <div className="text-2xl sm:text-3xl font-black tabular-nums">
          {count}+
        </div>
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {item.label}
        </div>
        <div className="text-[11px] text-slate-400">{item.sub}</div>
      </div>
    </div>
  );
}
