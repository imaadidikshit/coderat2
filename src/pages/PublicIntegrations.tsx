import React, { useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Globe, Box, Code, GitMerge, Hexagon, Command, Cpu, Layers } from 'lucide-react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const INTEGRATIONS = [
  {
    name: "GitHub",
    icon: <Github className="w-12 h-12 text-white" />,
    color: "bg-[#2ea043]",
    description: "Deep integration with GitHub Actions and Pull Requests. AutoQA creates PRs directly with visual diffs and test results.",
    features: ["PR Comments", "Check Runs", "Auto-healing Commits"]
  },
  {
    name: "Vercel",
    icon: <span className="text-4xl font-bold font-sans tracking-tighter text-white">▲</span>,
    color: "bg-white text-black",
    description: "Automatically trigger visual regression tests against preview deployments the moment Vercel finishes building.",
    features: ["Preview URLs", "Deployment Hooks", "Branch Matching"]
  },
  {
    name: "Netlify",
    icon: <Hexagon className="w-12 h-12 text-[#00C7B7]" />,
    color: "bg-[#00C7B7]",
    description: "Listen to Netlify build webhooks and run headless Playwright scripts in the background before merging.",
    features: ["Deploy Previews", "Build Plugins", "Contextual Testing"]
  },
  {
    name: "VS Code",
    icon: <Code className="w-12 h-12 text-[#007ACC]" />,
    color: "bg-[#007ACC]",
    description: "Our VS Code extension brings AI-powered UI healing directly into your editor. Fix flaky selectors as you type.",
    features: ["Inline Linting", "Selector Suggestions", "Test Runner"]
  },
  {
    name: "Claude Code",
    icon: <Command className="w-12 h-12 text-[#D97757]" />,
    color: "bg-[#D97757]",
    description: "Seamlessly interact with Claude Code CLI to debug complex UI state failures directly from your terminal.",
    features: ["Terminal Integration", "Context Sharing", "Root Cause Analysis"]
  },
  {
    name: "OpenAI Codex",
    icon: <Cpu className="w-12 h-12 text-[#10A37F]" />,
    color: "bg-[#10A37F]",
    description: "Powered by advanced language models to interpret DOM changes and write robust fallback locators instantly.",
    features: ["Self-Healing Locators", "Semantic Matching", "AST Parsing"]
  },
  {
    name: "Antigravity",
    icon: <Layers className="w-12 h-12 text-[#6366F1]" />,
    color: "bg-[#6366F1]",
    description: "Connect with the Antigravity agentic engine to automatically refactor entire test suites when design systems update.",
    features: ["Agentic Refactoring", "Design System Sync", "Mass Updates"]
  }
];

export default function PublicIntegrations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const cards = gsap.utils.toArray('.integration-card');
    
    cards.forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100, rotateX: -15 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
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
      
      <main className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Works with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Stack</span>
          </h1>
          <p className="text-xl text-white/50 leading-relaxed">
            QA Copilot fits right into your existing workflow. Connect your favorite tools in seconds and let the AI do the heavy lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {INTEGRATIONS.map((int, idx) => (
            <div key={idx} className="integration-card relative group perspective-[1000px]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="relative h-full bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-colors">
                
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${int.name === 'Vercel' ? 'bg-black border border-white/20' : 'bg-black/50 border border-white/5'} shadow-2xl`}>
                  {int.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{int.name}</h3>
                <p className="text-white/60 leading-relaxed mb-8 flex-1">{int.description}</p>
                
                <div className="space-y-3 mt-auto">
                  {int.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <GitMerge className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-sm font-bold text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
