import React, { useRef, useState, useEffect } from 'react';

import { 
  ArrowRight, Code, Zap, Shield, Play, Globe, CheckCircle, 
  Search, Bug, RefreshCw, Activity, Layers, Database, Cpu, Lock, Cloud, Eye,
  ChevronDown, Terminal, AlertCircle, Bot, Github, Target, Workflow, Server, ZapOff, CheckCircle2, Loader2, GitMerge
} from 'lucide-react';
import { Link } from 'react-router-dom';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import brandLogo from '../components/model_logos/App_assets/wordmark_D_white.svg';

gsap.registerPlugin(ScrollTrigger);

// --- NAVBAR ---
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CustomCursor, MagneticButton, TiltCard, CountUp } from '../components/fx';

const StatsBand = () => (
  <section className="py-24 px-6 bg-[#0A0A0B] border-y border-white/5">
    <div className="max-w-[1200px] mx-auto text-center mb-14">
      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Trusted by shipping teams</h2>
      <p className="text-white/50 text-lg">Numbers from teams who let Coderat own their QA.</p>
    </div>
    <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
      {[
        { end: 2.4, suffix: 'M+', label: 'Tests healed', decimals: 1 },
        { end: 92, suffix: '%', label: 'Less flakiness', decimals: 0 },
        { end: 14000, suffix: '+', label: 'Repos connected', decimals: 0 },
        { end: 3, suffix: 'x', label: 'Faster releases', decimals: 0 },
      ].map((s) => (
        <TiltCard key={s.label} max={7} className="bg-[#111111] border border-white/10 rounded-2xl py-10">
          <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
            <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
          </div>
          <div className="text-white/40 text-sm font-bold mt-3 uppercase tracking-wide">{s.label}</div>
        </TiltCard>
      ))}
    </div>
  </section>
);

const TESTIMONIALS = [
  { name: 'Alex Chen', role: 'Frontend Lead', text: 'Coderat caught a checkout bug before it hit production. Absolute lifesaver.' },
  { name: 'Sarah Jenkins', role: 'QA Engineer', text: 'Self-healing scripts save us hours of maintenance every single week.' },
  { name: 'Michael Rodriguez', role: 'CTO', text: 'We went from 40% flakiness to near zero in under a month.' },
  { name: 'Emily Watson', role: 'Full Stack Dev', text: 'It tells me exactly which DOM element broke the test. Spot on.' },
  { name: 'David Kim', role: 'Eng Manager', text: 'Finally a tool that understands React component drift.' },
  { name: 'Lisa Thompson', role: 'PM', text: 'We release twice as fast now. The PR integration is magic.' },
];

const TestimonialsMarquee = () => (
  <section className="py-28 bg-[#0A0A0B] overflow-hidden">
    <div className="text-center mb-16 px-6">
      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Loved by developers</h2>
      <p className="text-white/50 text-lg">Don’t take our word for it.</p>
    </div>
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
      <div className="cr-marquee gap-6">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div key={i} className="w-[340px] shrink-0 bg-[#111111] border border-white/10 rounded-2xl p-6">
            <p className="text-white/80 leading-relaxed mb-5">“{t.text}”</p>
            <div className="text-indigo-400 font-bold text-sm">{t.name}</div>
            <div className="text-white/40 text-xs">{t.role}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HeroSequence = () => {
    const container = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const graphicContainerRef = useRef<HTMLDivElement>(null);
    
    const centerPanel = useRef<HTMLDivElement>(null);
    const leftPanel1 = useRef<HTMLDivElement>(null);
    const rightPanel1 = useRef<HTMLDivElement>(null);

    const step1Text = useRef<HTMLDivElement>(null);
    const step2Text = useRef<HTMLDivElement>(null);
    const step3Text = useRef<HTMLDivElement>(null);

    const codeLinesRef = useRef<HTMLDivElement>(null);
    const loopingCodeRef = useRef<HTMLDivElement>(null);
    const scanLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loopingCodeRef.current) return;
        const lines = Array.from(loopingCodeRef.current.children) as HTMLElement[];
        const loopTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        
        gsap.set(lines, { opacity: 0, x: -10 });
        
        loopTl.to(lines, {
            opacity: 1,
            x: 0,
            duration: 0.1,
            stagger: 0.1,
            ease: "none"
        })
        .to(lines[4], { color: '#ef4444', duration: 0.2 }, "+=0.5") 
        .to(lines[6], { opacity: 1, x: 0, duration: 0.1, color: '#10b981' }, "+=1")
        .to(lines, { opacity: 0, y: -20, duration: 0.5, stagger: 0.05, ease: "power2.in" }, "+=2");
        
        return () => {
            loopTl.kill();
        };
    }, []);

    useGSAP(() => {
        if (!container.current || !heroTextRef.current || !graphicContainerRef.current) return;

        // Auto-floating animations
        if (leftPanel1.current) gsap.to(leftPanel1.current, { y: "-=15", duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
        if (centerPanel.current) gsap.to(centerPanel.current, { y: "+=15", duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
        if (rightPanel1.current) gsap.to(rightPanel1.current, { y: "-=15", duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
        if (scanLineRef.current) {
            gsap.to(scanLineRef.current, {
                top: "100%",
                duration: 2,
                repeat: -1,
                ease: "linear",
                yoyo: true
            });
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // Match media for responsive animations
        const isMobile = window.innerWidth < 1024;

        // Initial positions for elements inside the graphic container
        gsap.set(leftPanel1.current, { scale: 1, x: 0, y: 0, zIndex: 30, opacity: 1 });
        gsap.set(rightPanel1.current, { scale: 0.8, x: 50, zIndex: 10, opacity: 0 });
        gsap.set(centerPanel.current, { scale: 1, x: 0, opacity: 1, zIndex: 20 });
        
        const lines = Array.from(codeLinesRef.current?.children || []) as HTMLElement[];
        gsap.set(lines, { opacity: 0, x: -10 });

        // Phase 1: Move graphic to center, hide hero text
        tl.to(heroTextRef.current, { opacity: 0, y: -50, duration: 1 }, 0);
        
        if (isMobile) {
            tl.to(graphicContainerRef.current, { top: "25%", scale: 0.85, duration: 1, ease: "power2.inOut" }, 0);
        } else {
            tl.to(graphicContainerRef.current, { right: "0%", scale: 0.9, duration: 1, ease: "power2.inOut" }, 0);
        }

        if (loopingCodeRef.current) {
            tl.to(loopingCodeRef.current, { opacity: 0, duration: 0.5 }, 0);
        }

        // --- STEP 1: Detect DOM Drift ---
        tl.to(step1Text.current, { opacity: 1, y: 0, duration: 0.5 }, 1);
        
        // Emphasize leftPanel1 (DOM Analyzer), de-emphasize centerPanel
        tl.to(leftPanel1.current, { scale: 1.2, x: isMobile ? 50 : 100, rotateY: 0, zIndex: 40, duration: 1, ease: "power2.out" }, 1);
        tl.to(centerPanel.current, { opacity: 0.3, scale: 0.8, x: isMobile ? 0 : 50, duration: 1, ease: "power2.out" }, 1);
        
        tl.to({}, { duration: 1 }); // hold
        tl.to(step1Text.current, { opacity: 0, y: -50, duration: 0.5 });
        tl.to(leftPanel1.current, { opacity: 0, scale: 0.8, x: isMobile ? -50 : -100, duration: 0.5 }, "<"); // hide

        // --- STEP 2: Analyze Code ---
        tl.to(step2Text.current, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2");
        tl.to(centerPanel.current, { opacity: 1, scale: 1.1, x: isMobile ? 0 : -50, rotateY: 0, rotateX: 0, zIndex: 40, duration: 1, ease: "power2.out" }, "<");
        
        // Type code lines
        lines.forEach((line, i) => {
            tl.to(line, { opacity: 1, x: 0, duration: 0.2 }, `+=${0.05}`);
            if (i === 4) { // Error line
                tl.to(line, { color: '#ef4444', textShadow: "0 0 10px rgba(239,68,68,0.5)", duration: 0.2 }, "+=0.2");
            }
        });
        tl.to({}, { duration: 1 }); // hold
        tl.to(step2Text.current, { opacity: 0, y: -50, duration: 0.5 });

        // --- STEP 3: Auto-Heal ---
        tl.to(step3Text.current, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2");
        
        if (lines[6]) {
            tl.to(lines[6], { opacity: 1, x: 0, color: '#10b981', textShadow: "0 0 10px rgba(16,185,129,0.5)", duration: 0.5 }, "<");
        }
        if (lines[7]) tl.to(lines[7], { opacity: 1, x: 0, duration: 0.2 });
        if (lines[8]) tl.to(lines[8], { opacity: 1, x: 0, duration: 0.2 });
        if (lines[9]) tl.to(lines[9], { opacity: 1, x: 0, duration: 0.2 });
        
        tl.to(centerPanel.current, { x: isMobile ? -50 : -150, scale: 0.8, opacity: 0.4, rotateY: 15, duration: 1, ease: "power2.out" }, "<");
        tl.to(rightPanel1.current, { opacity: 1, x: isMobile ? -50 : -100, scale: 1.2, rotateY: 0, zIndex: 50, duration: 1, ease: "power2.out" }, "<");
        
        tl.to({}, { duration: 1 }); // hold

    }, { scope: container });

    return (
        <section ref={container} className="relative h-[500vh] w-full bg-[#0A0A0B]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                
                {/* Background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none" />

                {/* Hero Text */}
                <div ref={heroTextRef} className="absolute left-6 lg:left-[10%] top-[15%] lg:top-[30%] w-[calc(100%-3rem)] lg:w-[40%] z-20">
                    <h1 className="text-5xl md:text-[80px] font-display font-bold text-white tracking-tight leading-[1.05] mb-6">
                        Ship broken code. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">We'll fix it.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed font-medium max-w-lg">
                        Autonomous QA testing software considered "not bad" by millions of developers. Catch DOM drift and heal Playwright scripts on the fly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 font-bold uppercase text-[13px] tracking-wide">
                        <MagneticButton className="w-full sm:w-auto">
                            <Link to="/signup" className="bg-white text-black px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                                Get Started <ArrowRight className="w-4 h-4" />
                            </Link>
                        </MagneticButton>
                        <MagneticButton className="w-full sm:w-auto">
                            <Link to="/sandbox" className="bg-[#1A1A1A] text-white border border-white/10 px-8 py-4 rounded-xl hover:bg-[#222222] transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2">
                                See Sandbox
                            </Link>
                        </MagneticButton>
                    </div>
                </div>

                {/* Scrollytelling Texts */}
                <div className="absolute left-6 lg:left-[10%] top-[65%] lg:top-[50%] lg:-translate-y-1/2 w-[calc(100%-3rem)] lg:w-[35%] z-30 pointer-events-none">
                    <div ref={step1Text} className="opacity-0 translate-y-12 absolute top-0 left-0 w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <Bug className="w-5 h-5 text-red-400" />
                            </div>
                            <span className="text-red-400 font-mono text-xs md:text-sm uppercase tracking-widest font-bold">1. Drift Detected</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Your UI changed. <br/>Tests didn't.</h2>
                        <p className="text-base md:text-lg text-white/60">Our agents continuously monitor your staging environment. When a button class changes or an element moves, we catch the DOM drift instantly.</p>
                    </div>

                    <div ref={step2Text} className="opacity-0 translate-y-12 absolute top-0 left-0 w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-indigo-400 font-mono text-xs md:text-sm uppercase tracking-widest font-bold">2. AI Analysis</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Context-Aware <br/>Execution.</h2>
                        <p className="text-base md:text-lg text-white/60">We don't just fail the pipeline. The agent steps into the execution context, analyzes the code, and understands the intent behind the broken selector.</p>
                    </div>

                    <div ref={step3Text} className="opacity-0 translate-y-12 absolute top-0 left-0 w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-emerald-400 font-mono text-xs md:text-sm uppercase tracking-widest font-bold">3. Auto-Healed</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Zero-Touch <br/>Resolution.</h2>
                        <p className="text-base md:text-lg text-white/60">The selector is rewritten to be more resilient using data attributes. A Pull Request is automatically generated for your review.</p>
                    </div>
                </div>

                {/* Graphic Container */}
                <div ref={graphicContainerRef} className="absolute left-0 lg:left-auto lg:right-[5%] top-[50%] -translate-y-1/2 lg:top-[50%] lg:-translate-y-1/2 w-[100%] lg:w-[45%] h-[40vh] lg:h-[600px] perspective-[1200px] flex items-center justify-center pointer-events-none">
                    
                    {/* Left Floating Panel (DOM Analyzer) */}
                    <div ref={leftPanel1} className="absolute left-[5%] lg:-left-[10%] top-1/2 -translate-y-1/2 mt-[-40px] w-[250px] md:w-[320px] bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] transform rotate-y-[15deg] z-30">
                        <div className="h-10 bg-[#222222] border-b border-white/5 flex items-center px-4 gap-2">
                            <Search className="w-4 h-4 text-white/40" />
                            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">DOM Analyzer</span>
                        </div>
                        <div className="p-5 md:p-6 relative">
                            <div className="space-y-4 font-mono text-xs md:text-sm">
                                <div className="flex gap-3 items-center">
                                    <div className="text-white/30">div</div>
                                    <div className="h-2 w-20 bg-white/10 rounded-sm"></div>
                                </div>
                                <div className="flex gap-3 items-center pl-6 border-l border-white/10">
                                    <div className="text-white/30">span</div>
                                    <div className="h-2 w-16 bg-white/10 rounded-sm"></div>
                                </div>
                                <div className="flex gap-3 items-center pl-6 border-l border-white/10">
                                    <div className="text-red-400 font-bold">button</div>
                                    <div className="h-2 w-24 bg-red-500/20 rounded-sm"></div>
                                </div>
                            </div>
                            <div ref={scanLineRef} className="absolute top-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] z-10"></div>
                        </div>
                        <div className="p-4 bg-red-500/10 border-t border-red-500/20 flex items-center justify-between">
                            <span className="text-xs text-red-400 font-mono">Class mutated: .btn-primary</span>
                        </div>
                    </div>

                    {/* Center "Engine" Panel */}
                    <div ref={centerPanel} className="absolute right-[5%] lg:right-[10%] top-1/2 -translate-y-1/2 w-[340px] md:w-[500px] h-[340px] md:h-[400px] bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col transform rotate-y-[-10deg] rotate-x-[5deg] z-20">
                        <div className="h-12 bg-[#1A1A1A] border-b border-white/5 flex items-center px-4 md:px-6 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <div className="ml-4 text-[10px] md:text-sm text-white/40 font-mono flex items-center gap-2">
                                <Code className="w-4 h-4" />
                                core-engine/auto-healer.ts
                            </div>
                        </div>
                        <div className="flex-1 p-5 md:p-8 font-mono text-[10px] md:text-sm bg-[#0A0A0B]/50 relative">
                            {/* Looping Code for Hero phase */}
                            <div className="absolute inset-0 p-5 md:p-8 space-y-3" ref={loopingCodeRef}>
                                <div className="text-white/70"><span className="text-pink-400">async function</span> execute() {'{'}</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.goto(<span className="text-emerald-400">'/checkout'</span>);</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.fill(<span className="text-emerald-400">'#email'</span>, <span className="text-emerald-400">'user@abc.com'</span>);</div>
                                <div className="text-white/70 pl-4 md:pl-8 mt-2">{'// Locating button...'}</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.click(<span className="text-emerald-400">'.btn-primary'</span>);</div>
                                <div className="text-indigo-400 pl-4 md:pl-8 mt-2">{'/* Timeout. Analyzing DOM drift... */'}</div>
                                <div className="text-emerald-400 pl-4 md:pl-8 font-bold mt-2">{'// AI Healed: Using resilient selector'}</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.click(<span className="text-emerald-400">'[data-testid="submit"]'</span>);</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> expect(page).toHaveURL(<span className="text-emerald-400">'/success'</span>);</div>
                                <div className="text-white/70">{'}'}</div>
                            </div>

                            {/* Scrollytelling Code */}
                            <div className="absolute inset-0 p-5 md:p-8 space-y-3" ref={codeLinesRef}>
                                <div className="text-white/70"><span className="text-pink-400">async function</span> execute() {'{'}</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.goto(<span className="text-emerald-400">'/checkout'</span>);</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.fill(<span className="text-emerald-400">'#email'</span>, <span className="text-emerald-400">'user@abc.com'</span>);</div>
                                <div className="text-white/70 pl-4 md:pl-8 mt-2">{'// Locating button...'}</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.click(<span className="text-emerald-400">'.btn-primary'</span>);</div>
                                <div className="text-indigo-400 pl-4 md:pl-8 mt-2">{'/* Timeout. Analyzing DOM drift... */'}</div>
                                <div className="text-emerald-400 pl-4 md:pl-8 font-bold mt-2">{'// AI Healed: Using resilient selector'}</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> page.click(<span className="text-emerald-400">'[data-testid="submit"]'</span>);</div>
                                <div className="text-white/70 pl-4 md:pl-8"><span className="text-pink-400">await</span> expect(page).toHaveURL(<span className="text-emerald-400">'/success'</span>);</div>
                                <div className="text-white/70">{'}'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Floating Panel (Pull Request) */}
                    <div ref={rightPanel1} className="absolute right-[5%] lg:-right-[10%] top-1/2 -translate-y-1/2 mt-[40px] w-[250px] md:w-[320px] bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] transform rotate-y-[-15deg] z-10 opacity-0">
                        <div className="p-4 md:p-5 border-b border-white/5 flex items-start gap-3 bg-emerald-500/5">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <Github className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-bold">Auto-Heal: checkout.spec.ts</h4>
                                <p className="text-[10px] md:text-xs text-white/50 mt-1">#42 opened by QACopilot</p>
                            </div>
                        </div>
                        <div className="p-4 md:p-5 bg-[#111111] font-mono text-[10px] md:text-xs space-y-2">
                            <div className="text-red-400 bg-red-500/10 px-3 py-2 rounded border border-red-500/20">- await page.click('.btn-primary');</div>
                            <div className="text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20">+ await page.click('[data-testid="submit"]');</div>
                        </div>
                        <div className="p-4 border-t border-white/5 flex justify-end gap-2 bg-[#1A1A1A]">
                            <div className="px-4 py-2 rounded bg-emerald-500 text-black text-xs font-bold cursor-pointer hover:bg-emerald-400 transition-colors">Merge PR</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

const HalfSplitScrollytelling = () => {
    const container = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const visualsRef = useRef<HTMLDivElement>(null);

    const [typedCode, setTypedCode] = useState("");
    const codeString = `await page.getByRole('button', { name: "Submit" }).click();`;
    
    useEffect(() => {
        let i = 0;
        let isDeleting = false;
        let timeoutId: any;
        
        const type = () => {
            const currentString = codeString.substring(0, i);
            setTypedCode(currentString);
            
            if (!isDeleting && i === codeString.length) {
                timeoutId = setTimeout(() => {
                    isDeleting = true;
                    type();
                }, 2000);
            } else if (isDeleting && i === 0) {
                isDeleting = false;
                timeoutId = setTimeout(() => {
                    type();
                }, 500);
            } else {
                i += isDeleting ? -1 : 1;
                const speed = isDeleting ? 30 : 50;
                timeoutId = setTimeout(type, speed + Math.random() * 50);
            }
        };
        type();
        return () => clearTimeout(timeoutId);
    }, [codeString]);

    useGSAP(() => {
        if (!container.current || !textRef.current || !visualsRef.current) return;
        
        const isMobile = window.innerWidth < 1024;
        const textElements = Array.from(textRef.current.children) as HTMLElement[];
        const visualElements = Array.from(visualsRef.current.children) as HTMLElement[];

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });

        // Initialize state so first element is visible immediately
        gsap.set(textElements[0], { opacity: 1, y: 0 });
        gsap.set(textElements.slice(1), { opacity: 0, y: 50 });
        
        gsap.set(visualElements[0], { opacity: 1, scale: 1, rotateY: 0, y: 0, z: 0 });
        gsap.set(visualElements.slice(1), { opacity: 0, scale: isMobile ? 1 : 1.2, rotateY: isMobile ? 15 : 25, y: isMobile ? 20 : 50, z: 100 });

        // Loop through each slide
        textElements.forEach((el, index) => {
            const visual = visualElements[index];
            
            // Fade in if not the first one
            if (index > 0) {
                tl.to(el, { opacity: 1, y: 0, duration: 1 }, index * 2)
                  .to(visual, { opacity: 1, scale: 1, rotateY: 0, y: 0, z: 0, duration: 1, ease: "power2.out" }, index * 2);
            }
            
            // Hold
            tl.to({}, { duration: 1 });
            
            // Fade out (if not the last one)
            if (index < textElements.length - 1) {
                tl.to(el, { opacity: 0, y: -50, duration: 1 })
                  .to(visual, { opacity: 0, scale: isMobile ? 0.9 : 0.8, rotateY: isMobile ? -15 : -25, y: isMobile ? -20 : -50, z: -100, filter: "blur(10px)", duration: 1, ease: "power2.in" }, "<");
            }
        });

    }, { scope: container });

    return (
        <section ref={container} className="relative h-[300vh] w-full bg-[#0A0A0B]">
            <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row overflow-hidden">
                {/* Left Side: Creative Animated Text */}
                <div className="w-full lg:w-1/2 h-[50%] lg:h-full flex flex-col justify-center px-6 lg:px-20 relative z-20">
                    <div ref={textRef} className="relative w-full h-full">
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-0 pointer-events-none">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 lg:mb-6 tracking-tight">Detect UI Bugs <br/> <span className="text-emerald-400">Instantly</span></h2>
                            <p className="text-base md:text-xl text-white/50 leading-relaxed max-w-lg">Our autonomous agents crawl your application to find visual regressions and DOM drifts before your users do.</p>
                        </div>
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-0 pointer-events-none">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 lg:mb-6 tracking-tight">Self-Healing <br/> <span className="text-indigo-400">Playwright Scripts</span></h2>
                            <p className="text-base md:text-xl text-white/50 leading-relaxed max-w-lg">Broken selectors? We automatically rewrite them using context-aware AI, keeping your pipelines green.</p>
                        </div>
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-0 pointer-events-none">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 lg:mb-6 tracking-tight">Seamless <br/> <span className="text-pink-400">GitHub Connect</span></h2>
                            <p className="text-base md:text-xl text-white/50 leading-relaxed max-w-lg">Fixes are deployed directly as Pull Requests. Review the code, approve, and merge without leaving your workflow.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: 3D Visuals */}
                <div className="w-full lg:w-1/2 h-[50%] lg:h-full flex items-center justify-center relative perspective-[1500px]">
                    <div ref={visualsRef} className="relative w-full h-full flex items-center justify-center transform scale-75 md:scale-100 origin-center">
                        {/* Visual 1: Bug Finder */}
                        <div className="absolute w-72 md:w-96 h-72 md:h-96 bg-[#111111] border border-emerald-500/30 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.1)] flex flex-col p-6 md:p-8 opacity-0">
                             <div className="flex items-center gap-4 mb-4 md:mb-8">
                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                    <Bug className="w-5 h-5 md:w-8 md:h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-xl font-bold text-white leading-tight">Visual Regression</h3>
                                    <div className="text-emerald-400 text-xs md:text-sm">Issue detected</div>
                                </div>
                             </div>
                             <div className="flex-1 border border-white/5 rounded-xl bg-[#0A0A0B] relative overflow-hidden group">
                                 {/* Grid background */}
                                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                                 
                                 {/* UI Elements */}
                                 <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 h-8 md:h-10 border border-white/10 rounded flex items-center px-4 bg-white/5">
                                    <div className="w-4 h-4 rounded-full bg-red-500/50 mr-2" />
                                    <div className="w-16 h-2 bg-white/20 rounded" />
                                 </div>

                                 <div className="absolute top-16 md:top-20 left-4 md:left-6 w-3/4 h-24 md:h-32 border border-white/10 rounded bg-white/5 flex flex-col p-4 gap-2">
                                     <div className="w-1/2 h-4 bg-white/20 rounded" />
                                     <div className="w-3/4 h-3 bg-white/10 rounded mt-2" />
                                     <div className="w-2/3 h-3 bg-white/10 rounded" />
                                     
                                     {/* This element has a bug */}
                                     <div className="mt-auto w-24 md:w-32 h-8 border-2 border-red-500/80 rounded bg-red-500/20 animate-pulse relative">
                                        <div className="absolute -top-6 -right-6 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg shadow-red-500/20 whitespace-nowrap z-10">Class Mutated</div>
                                     </div>
                                 </div>

                                 {/* Scanning Line */}
                                 <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] z-10 animate-[scan_3s_ease-in-out_infinite]" />
                             </div>
                        </div>

                        {/* Visual 2: Playwright */}
                        <div className="absolute w-72 md:w-96 h-72 md:h-96 bg-[#111111] border border-indigo-500/30 rounded-3xl shadow-[0_0_80px_rgba(99,102,241,0.1)] flex flex-col p-6 md:p-8 opacity-0">
                             <div className="flex items-center gap-4 mb-4 md:mb-8">
                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 md:w-8 md:h-8 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-xl font-bold text-white leading-tight">Self-Healing</h3>
                                    <div className="text-indigo-400 text-xs md:text-sm">Playwright Agent</div>
                                </div>
                             </div>
                             <div className="flex-1 font-mono text-[10px] md:text-xs text-white/50 space-y-2 p-2 mt-4 md:mt-0">
                                <div className="text-red-400 line-through">await page.locator('.btn-old').click();</div>
                                <div className="text-indigo-400">{'// AI generated fix'}</div>
                                <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20 break-all min-h-[40px] md:min-h-[48px]">
                                    {typedCode}<span className="animate-pulse">|</span>
                                </div>
                             </div>
                        </div>

                        {/* Visual 3: GitHub Connect */}
                        <div className="absolute w-72 md:w-96 h-72 md:h-96 bg-[#111111] border border-pink-500/30 rounded-3xl shadow-[0_0_80px_rgba(236,72,153,0.1)] flex flex-col p-6 md:p-8 opacity-0">
                             <div className="flex items-center gap-4 mb-4 md:mb-8">
                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                                    <Github className="w-5 h-5 md:w-8 md:h-8 text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-xl font-bold text-white leading-tight">Pull Request</h3>
                                    <div className="text-pink-400 text-xs md:text-sm">Ready to merge</div>
                                </div>
                             </div>
                             <div className="flex-1 border border-white/5 rounded-xl bg-[#0A0A0B] p-4 flex flex-col justify-center relative overflow-hidden group">
                                 {/* Animated Commits Background */}
                                 <div className="absolute top-0 right-4 bottom-0 w-[2px] bg-white/10" />
                                 <div className="absolute right-2.5 top-[20%] w-3.5 h-3.5 rounded-full bg-white/20 animate-ping" />
                                 <div className="absolute right-2.5 top-[50%] w-3.5 h-3.5 rounded-full bg-pink-500/50" />
                                 <div className="absolute right-2.5 top-[80%] w-3.5 h-3.5 rounded-full bg-emerald-500/50" />

                                 <div className="flex items-center gap-3 mb-6 relative z-10">
                                     <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                                         <GitMerge className="w-4 h-4 text-emerald-400" />
                                     </div>
                                     <div className="flex-1">
                                        <div className="text-white text-sm md:text-base font-bold">fix: robust checkout button selector</div>
                                        <div className="text-white/40 text-xs flex gap-2 mt-1">
                                            <span className="text-emerald-400">+12</span>
                                            <span className="text-red-400">-4</span>
                                        </div>
                                     </div>
                                 </div>

                                 <div className="w-full h-10 md:h-12 bg-[#238636] rounded text-white font-bold flex items-center justify-center text-sm md:text-base cursor-pointer hover:bg-[#2ea043] transition-colors gap-2 relative z-10 shadow-[0_0_20px_rgba(35,134,54,0.4)] group-hover:scale-[1.02]">
                                    <GitMerge className="w-4 h-4" /> Merge pull request
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const CodeParallax = () => {
    const container = useRef<HTMLDivElement>(null);
    const codeRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!container.current || !codeRef.current || !cursorRef.current || !overlayRef.current) return;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // Rotate the code block in 3D
        tl.fromTo(codeRef.current, 
            { rotateX: 45, rotateY: -10, rotateZ: 5, scale: 0.8 },
            { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, duration: 1, ease: "power2.inOut" },
            0
        );

        // Move the cursor across the screen to "fix" the bug
        tl.fromTo(cursorRef.current,
            { x: "-20vw", y: "10vh", opacity: 0 },
            { x: "30vw", y: "30vh", opacity: 1, duration: 0.3, ease: "power1.inOut" },
            0.3
        );
        tl.to(cursorRef.current, { x: "40vw", y: "25vh", duration: 0.2, ease: "power1.inOut" }, 0.6);

        // Highlight the fix overlay
        tl.fromTo(overlayRef.current,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, transformOrigin: "left center", duration: 0.2, ease: "power1.out" },
            0.8
        );

    }, { scope: container });

    return (
        <section ref={container} className="relative h-[250vh] w-full bg-[#0A0A0B]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1500px]">
                
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* The Code Block */}
                <div ref={codeRef} className="relative z-10 w-[90%] md:w-full max-w-4xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl p-4 md:p-8 font-mono text-[10px] md:text-sm leading-loose text-white/50 transform-gpu mx-auto">
                    <div className="flex gap-2 mb-4 md:mb-6 border-b border-white/5 pb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="overflow-x-hidden whitespace-pre-wrap">
                        <div className="text-indigo-400">async function <span className="text-emerald-400">checkout</span>() {'{'}</div>
                        <div className="pl-8">
                            <span className="text-pink-400">const</span> cart = <span className="text-blue-400">await</span> api.getCart();
                            <br/>
                            <span className="text-pink-400">if</span> (!cart) <span className="text-pink-400">throw new</span> <span className="text-yellow-400">Error</span>('Cart empty');
                            <br/><br/>
                            <div className="relative">
                                {/* The Broken Line */}
                                <div className="text-red-400 line-through opacity-50">
                                    <span className="text-pink-400">const</span> button = document.querySelector('.btn-primary');
                                </div>
                                {/* The Fixed Line */}
                                <div ref={overlayRef} className="absolute top-0 left-0 w-full bg-emerald-500/20 text-emerald-300 px-2 rounded border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <span className="text-pink-400">const</span> button = document.querySelector('[data-testid="checkout-btn"]');
                                </div>
                            </div>
                            <br/>
                            <span className="text-blue-400">await</span> button.click();
                        </div>
                        <div className="text-indigo-400">{'}'}</div>
                    </div>
                </div>

                {/* The Robotic Cursor */}
                <div ref={cursorRef} className="absolute z-20 flex flex-col items-center pointer-events-none transform-gpu">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)] border-2 border-white">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="mt-2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                        Agent healing...
                    </div>
                </div>

                <div className="absolute bottom-20 text-center w-full px-6 z-0">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Fixes written before you even wake up.</h2>
                    <p className="text-white/50 text-xl max-w-2xl mx-auto">We don't just alert you to flaky selectors. We rewrite them to be resilient.</p>
                </div>
            </div>
        </section>
    );
}

const PinnedSequence = () => {
    const container = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const mockupRef = useRef<HTMLDivElement>(null);
    const pill1 = useRef<HTMLDivElement>(null);
    const pill2 = useRef<HTMLDivElement>(null);
    const pill3 = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!container.current || !pinRef.current || !textRef.current || !mockupRef.current || !pill1.current || !pill2.current || !pill3.current) return;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // 0% to 50%: Scale mockup, move text
        tl.to(textRef.current, { x: "-200vw", duration: 0.5, ease: "none" }, 0);
        tl.fromTo(mockupRef.current, { scale: 0.6, rotateX: 20 }, { scale: 1.0, rotateX: 0, duration: 0.5, ease: "none" }, 0);

        // 50% to 100%: Rotate mockup, fade in pills
        tl.to(mockupRef.current, { rotateY: 25, rotateX: 5, duration: 0.5, ease: "none" }, 0.5);
        
        gsap.set([pill1.current, pill2.current, pill3.current], {
            x: "20vw", y: "20vh", opacity: 0
        });

        tl.to(pill1.current, { x: 0, y: 0, opacity: 1, duration: 0.1, ease: "power1.out" }, 0.6);
        tl.to(pill2.current, { x: 0, y: 0, opacity: 1, duration: 0.1, ease: "power1.out" }, 0.7);
        tl.to(pill3.current, { x: 0, y: 0, opacity: 1, duration: 0.1, ease: "power1.out" }, 0.8);

    }, { scope: container });

    return (
        <section ref={container} className="relative h-[150vh] w-full bg-[#0A0A0B]">
            {/* Pinned sequence */}
            <div ref={pinRef} style={{ perspective: '1200px' }} className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 bg-[#0A0A0B]">
                {/* Title */}
                <div ref={textRef} className="absolute z-10 w-full text-center px-6 pointer-events-none">
                    <h2 className="text-[54px] md:text-[80px] font-display font-bold text-white leading-tight">
                        See the whole <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">picture.</span>
                    </h2>
                    <p className="text-xl text-white/50 mt-4 max-w-2xl mx-auto">
                        Track every error, log, and metric back to the exact line of code.
                    </p>
                </div>

                {/* Mockup */}
                <div ref={mockupRef} style={{ transformStyle: 'preserve-3d' }} className="relative z-0 w-full max-w-4xl bg-[#111111] rounded-2xl border border-white/10 shadow-2xl p-6 mx-6">
                    <div className="flex gap-2 mb-4 border-b border-white/5 pb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-6 font-mono text-sm text-white/50 space-y-4">
                        <div className="flex justify-between text-white">
                            <span>Uncaught TypeError: window.qacopilot is not a function</span>
                            <span className="text-red-400">Critical</span>
                        </div>
                        <div className="pl-4 border-l-2 border-white/10">
                            <div>at trackError (app.js:42)</div>
                            <div>at onSubmit (checkout.js:108)</div>
                        </div>
                        <div className="mt-8 bg-indigo-500/10 p-4 rounded border border-indigo-500/20 text-white flex gap-3">
                            <Bot className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>AI Analysis: React strict mode re-rendered the checkout button before the script loaded.</span>
                        </div>
                    </div>

                    {/* Floating Pills */}
                    <div className="absolute -bottom-10 -right-4 md:-right-10 flex flex-col gap-4" style={{ transformStyle: 'preserve-3d' }}>
                        <div ref={pill1} style={{ transform: 'translateZ(50px)' }} className="bg-[#111111] border border-red-500 rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <Activity className="text-red-500 w-5 h-5" />
                            <span className="text-white font-bold text-sm whitespace-nowrap">Error Detected</span>
                        </div>
                        <div ref={pill2} style={{ transform: 'translateZ(100px) translateX(16px)' }} className="bg-[#111111] border border-yellow-500 rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                            <Layers className="text-yellow-500 w-5 h-5" />
                            <span className="text-white font-bold text-sm whitespace-nowrap">Logs Captured</span>
                        </div>
                        <div ref={pill3} style={{ transform: 'translateZ(150px) translateX(32px)' }} className="bg-[#111111] border border-emerald-500 rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <Zap className="text-emerald-500 w-5 h-5" />
                            <span className="text-white font-bold text-sm whitespace-nowrap">AI Fix Applied</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const StackingCards = () => {
    return (
        <section className="py-32 px-6 max-w-5xl mx-auto space-y-24 mb-32 relative perspective-[1200px]">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Designed for speed.</h2>
                <p className="text-xl text-white/50">A workflow that fits right into your stack.</p>
            </div>

            <div className="relative">
                {/* Card 1 */}
                <div className="sticky top-24 w-full min-h-[40vh] bg-[#111111] border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl flex flex-col justify-center items-center text-center origin-top transform-gpu transition-all hover:scale-[1.02]">
                    <Github className="w-16 h-16 text-white mb-8" />
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">1. Connect Repo</h3>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed">Link your GitHub repository in seconds. We analyze your codebase context securely without ever storing your proprietary code.</p>
                </div>

                {/* Card 2 */}
                <div className="sticky top-32 w-full min-h-[40vh] bg-[#151515] border border-indigo-500/20 rounded-3xl p-10 md:p-16 shadow-2xl flex flex-col justify-center items-center text-center origin-top mt-16 transform-gpu transition-all hover:scale-[1.02]">
                    <Terminal className="w-16 h-16 text-indigo-400 mb-8" />
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">2. Install SDK</h3>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed">Add our lightweight SDK to your application. It catches errors, logs, and network requests seamlessly with zero configuration required.</p>
                </div>

                {/* Card 3 */}
                <div className="sticky top-40 w-full min-h-[40vh] bg-[#1A1A1A] border border-emerald-500/30 rounded-3xl p-10 md:p-16 shadow-[0_-20px_50px_rgba(16,185,129,0.1)] flex flex-col justify-center items-center text-center origin-top mt-16 relative overflow-hidden transform-gpu transition-all hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-8" />
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">3. Auto-Heal</h3>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed">When a critical error hits production, our AI generates a fix and opens a Pull Request automatically. You just review and merge.</p>
                </div>
            </div>
        </section>
    );
}

// Removed Footer
export default function LandingPage() {
    useEffect(() => {
        let lenis: any;
        try {
            lenis = new Lenis()
            lenis.on('scroll', ScrollTrigger.update)
            gsap.ticker.add((time)=>{
                lenis.raf(time * 1000)
            })
            gsap.ticker.lagSmoothing(0)
        } catch (e) {
            console.error("Lenis init error:", e);
        }
        return () => {
           if (lenis) {
               try {
                   lenis.destroy()
                   gsap.ticker.remove((time) => lenis.raf(time * 1000));
               } catch (e) {}
           }
        }
    }, [])

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
            <CustomCursor />
            <Navbar />
            <HeroSequence />
            <HalfSplitScrollytelling />
            <CodeParallax />
            <PinnedSequence />
            <StackingCards />
            <StatsBand />
            <TestimonialsMarquee />
            <Footer />
        </div>
    )
}
