/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared, additive UI motion primitives for the public marketing pages.
 * IMPORTANT: These components ONLY enhance presentation. They never touch
 * application state, data flow, API calls, routing or auth. Every effect
 * respects prefers-reduced-motion and disables itself on touch devices.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 * Environment helpers
 * ------------------------------------------------------------------ */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/* ------------------------------------------------------------------ *
 * useLenis — smooth scroll wired to GSAP ticker + ScrollTrigger.
 * Safe to mount on every public page (one instance per page).
 * ------------------------------------------------------------------ */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let lenis: any;
    const onFrame = (time: number) => lenis && lenis.raf(time * 1000);
    try {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(onFrame);
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      // no-op: smooth scroll is purely cosmetic
    }
    return () => {
      try {
        gsap.ticker.remove(onFrame);
        if (lenis) lenis.destroy();
      } catch (e) {}
    };
  }, []);
}

/* ------------------------------------------------------------------ *
 * MeshBackground — ambient animated gradient mesh (pure CSS, no assets).
 * ------------------------------------------------------------------ */
export const MeshBackground: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`cr-mesh pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
    <div className="cr-mesh-blob cr-mesh-blob--indigo" />
    <div className="cr-mesh-blob cr-mesh-blob--emerald" />
    <div className="cr-mesh-blob cr-mesh-blob--pink" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
  </div>
);

/* ------------------------------------------------------------------ *
 * Magnetic — element subtly follows the cursor (max ~8px), smooth lerp.
 * ------------------------------------------------------------------ */
export const Magnetic: React.FC<{
  children: React.ReactElement;
  strength?: number;
}> = ({ children, strength = 8 }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice() || prefersReducedMotion()) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;

    const xTo = gsap.quickTo(target, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(target, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      const max = strength;
      xTo(gsap.utils.clamp(-max, max, relX * 0.4));
      yTo(gsap.utils.clamp(-max, max, relY * 0.4));
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ *
 * TiltCard — 3D tilt that follows the mouse (max ~10deg), smooth.
 * ------------------------------------------------------------------ */
export const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  max?: number;
  glow?: boolean;
}> = ({ children, className = '', max = 10, glow = true }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice() || prefersReducedMotion()) return;
    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * max * 2);
      rotX(-py * max * 2);
      if (glow) {
        el.style.setProperty('--cr-mx', `${(px + 0.5) * 100}%`);
        el.style.setProperty('--cr-my', `${(py + 0.5) * 100}%`);
      }
    };
    const onLeave = () => { rotX(0); rotY(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [max, glow]);

  return (
    <div
      ref={ref}
      className={`cr-tilt ${glow ? 'cr-tilt--glow' : ''} ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * CountUp — animates a number when it scrolls into view (no early trigger).
 * ------------------------------------------------------------------ */
export const CountUp: React.FC<{
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}> = ({ to, duration = 1.8, suffix = '', prefix = '', decimals = 0, className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${to.toLocaleString()}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: to,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            const val = decimals
              ? obj.v.toFixed(decimals)
              : Math.round(obj.v).toLocaleString();
            el.textContent = `${prefix}${val}${suffix}`;
          },
        });
      },
    });
    return () => st.kill();
  }, [to, duration, suffix, prefix, decimals]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
};

/* ------------------------------------------------------------------ *
 * Reveal — fade + slide up on scroll into view. Cleans up will-change.
 * ------------------------------------------------------------------ */
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}> = ({ children, className = '', y = 40, delay = 0, as = 'div' }) => {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as any;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { opacity: 0, y, willChange: 'transform, opacity' });
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onComplete: () => gsap.set(el, { willChange: 'auto' }),
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [y, delay]);

  return <Tag ref={ref} className={className}>{children}</Tag>;
};

/* ------------------------------------------------------------------ *
 * useEntrance — staggered page-load timeline for elements tagged with
 * the given selector inside a scope ref. Slides up 40px + fades in.
 * ------------------------------------------------------------------ */
export function useEntrance(scope: React.RefObject<HTMLElement>, selector = '.cr-enter') {
  useEffect(() => {
    if (!scope.current || prefersReducedMotion()) return;
    const els = scope.current.querySelectorAll(selector);
    if (!els.length) return;
    const tl = gsap.fromTo(
      els,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
    );
    return () => tl.kill();
  }, [scope, selector]);
}

/* ------------------------------------------------------------------ *
 * Accordion — interactive "learn more" expanding card content.
 * ------------------------------------------------------------------ */
export const Accordion: React.FC<{
  items: { q: string; a: React.ReactNode }[];
  className?: string;
}> = ({ items, className = '' }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={`divide-y divide-white/10 ${className}`}>
      {items.map((it, i) => (
        <div key={i} className="py-2">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-4 text-left group"
          >
            <span className="text-base md:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{it.q}</span>
            <span className={`shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/60 transition-transform duration-300 ${open === i ? 'rotate-45 bg-white/10' : ''}`}>+</span>
          </button>
          <div
            className="grid transition-all duration-300 ease-out"
            style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="text-white/55 leading-relaxed pb-5 pr-10 text-sm md:text-base">{it.a}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
