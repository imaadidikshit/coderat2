import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { GradientMesh, prefersReducedMotion } from '../fx';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  /** Eyebrow badge text above the title. */
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: string; // tailwind gradient classes for the title accent
};

/**
 * Branded marketing page scaffold: Navbar + animated mesh hero + Footer,
 * with reveal-on-scroll for any [data-reveal] descendant and Lenis smooth
 * scroll. Purely presentational; never touches app state.
 */
export const PageShell: React.FC<Props> = ({
  children,
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  accent = 'from-indigo-400 to-emerald-400',
}) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis: any;
    const onFrame = (t: number) => lenis && lenis.raf(t * 1000);
    if (!prefersReducedMotion()) {
      try {
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(onFrame);
        gsap.ticker.lagSmoothing(0);
      } catch (e) {}
    }

    let triggers: ScrollTrigger[] = [];
    if (root.current && !prefersReducedMotion()) {
      const els = root.current.querySelectorAll('[data-reveal]');
      els.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 40, willChange: 'transform, opacity' });
        const tw = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onComplete: () => gsap.set(el, { willChange: 'auto' }),
        });
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });
    }

    return () => {
      triggers.forEach((t) => t.kill());
      try {
        gsap.ticker.remove(onFrame);
        if (lenis) lenis.destroy();
      } catch (e) {}
    };
  }, []);

  return (
    <div ref={root} className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-32 pb-24 overflow-hidden">
        <section className="relative text-center max-w-4xl mx-auto px-6 mb-20">
          <GradientMesh />
          <div className="relative z-10">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 cr-float">
                {eyebrowIcon}
                {eyebrow}
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-2xl text-white/50 leading-relaxed font-light max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageShell;
