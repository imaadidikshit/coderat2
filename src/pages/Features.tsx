import React, { useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Bug, Eye, Zap, Shield, Search, CheckCircle2 } from 'lucide-react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const sections = gsap.utils.toArray('.feature-section');
    sections.forEach((sec: any) => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: {
            trigger: sec,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      <main ref={containerRef} className="pt-32 pb-24 overflow-hidden">
        <div className="text-center max-w-4xl mx-auto px-6 mb-32">
          <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8">
            The Future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Testing</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
            QA Copilot isn't just a test runner. It's an autonomous AI agent that understands your UI, heals flaky locators, and catches visual regressions before your users do.
          </p>
        </div>

        {/* Feature 1: Self-Healing */}
        <div className="feature-section max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-40">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-8 border border-indigo-500/30">
              <Bot className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Self-Healing Locators</h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              CSS classes change. DOM structures evolve. QA Copilot automatically detects broken selectors and uses semantic AI to find the correct element, updating the test code automatically via PR.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/80 font-bold"><Zap className="text-indigo-400 w-5 h-5"/> Zero Maintenance</li>
              <li className="flex items-center gap-3 text-white/80 font-bold"><Zap className="text-indigo-400 w-5 h-5"/> Semantic DOM Understanding</li>
              <li className="flex items-center gap-3 text-white/80 font-bold"><Zap className="text-indigo-400 w-5 h-5"/> Auto-generated PRs</li>
            </ul>
          </div>
          <div className="relative aspect-square w-full max-w-lg mx-auto bg-[#111111] rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 font-mono text-sm space-y-4">
              <div className="text-red-400 line-through opacity-50">await page.click('.btn-primary-old')</div>
              <div className="text-white/30 italic">// AI Agent identified DOM change...</div>
              <div className="text-white/30 italic">// Found element with text "Checkout"</div>
              <div className="bg-indigo-500/20 border border-indigo-500/30 p-4 rounded text-indigo-300">
                await page.getByRole('button', &#123; name: 'Checkout' &#125;).click();
              </div>
              <div className="text-emerald-400 font-bold mt-8 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Test Passed
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Visual Regression */}
        <div className="feature-section max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-40">
          <div className="order-2 md:order-1 relative aspect-square w-full max-w-lg mx-auto bg-[#111111] rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
             <div className="relative z-10 w-full h-full border border-white/10 rounded-xl bg-black/50 p-6 flex flex-col justify-center gap-4">
               <div className="h-12 border-2 border-dashed border-red-500/50 bg-red-500/10 rounded flex items-center px-4 relative animate-pulse">
                  <span className="text-red-400 text-xs font-bold">Padding reduced by 8px</span>
               </div>
               <div className="h-12 border-2 border-emerald-500/50 bg-emerald-500/10 rounded flex items-center px-4">
                  <span className="text-emerald-400 text-xs font-bold">Original baseline</span>
               </div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30">
              <Eye className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Smart Visual Regression</h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Traditional pixel-matching is brittle. Our AI vision model understands context, ignoring harmless shifts (like dynamic timestamps or anti-aliasing) while catching actual layout breaks.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/80 font-bold"><Zap className="text-emerald-400 w-5 h-5"/> AI Vision Model</li>
              <li className="flex items-center gap-3 text-white/80 font-bold"><Zap className="text-emerald-400 w-5 h-5"/> Ignores Dynamic Content</li>
              <li className="flex items-center gap-3 text-white/80 font-bold"><Zap className="text-emerald-400 w-5 h-5"/> Pixel-perfect Baselines</li>
            </ul>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
