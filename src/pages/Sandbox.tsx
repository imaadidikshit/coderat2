import React, { useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Play, Code, Box, Cpu } from 'lucide-react';
import { gsap } from 'gsap';

export default function Sandbox() {
  const codeRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeRef.current || !terminalRef.current) return;
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to('.typing-cursor', { opacity: 0, duration: 0.5, yoyo: true, repeat: -1 });

    const terminalSteps = gsap.utils.toArray('.term-step') as HTMLElement[];
    const tl2 = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    
    tl2.set(terminalSteps, { opacity: 0, y: 10, display: 'none' })
       .set('.term-waiting', { display: 'block' })
       .to('.term-waiting', { opacity: 0, duration: 0.5, delay: 1, display: 'none' })
       .to(terminalSteps[0], { opacity: 1, y: 0, display: 'block', duration: 0.2 })
       .to(terminalSteps[1], { opacity: 1, y: 0, display: 'block', duration: 0.2 }, "+=0.5")
       .to(terminalSteps[2], { opacity: 1, y: 0, display: 'block', duration: 0.5 }, "+=1")
       .to(terminalSteps[3], { opacity: 1, y: 0, display: 'block', duration: 0.2 }, "+=1.5")
       .to(terminalSteps[4], { opacity: 1, y: 0, display: 'block', duration: 0.2 }, "+=0.5");

  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 max-w-[1400px] mx-auto w-full flex flex-col">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Sandbox</span>
          </h1>
          <p className="text-xl text-white/50 leading-relaxed">
            Write a Playwright test and watch our AI agent execute, debug, and heal it in real-time. No setup required.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
          {/* Editor */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-black/50 border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-white/40" />
                <span className="text-sm font-mono text-white/60">example.spec.ts</span>
              </div>
              <button className="bg-emerald-500 text-black px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-400 transition-colors">
                <Play className="w-3 h-3 fill-black" /> Run Test
              </button>
            </div>
            <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto" ref={codeRef}>
              <div className="text-pink-400">import</div> <div className="inline text-white">&#123; test, expect &#125;</div> <div className="inline text-pink-400">from</div> <div className="inline text-emerald-400">'@playwright/test'</div>;<br/><br/>
              <div className="text-indigo-400 inline">test</div><div className="inline text-white">('should complete checkout flow', </div><div className="inline text-pink-400">async</div> <div className="inline text-white">(&#123; page &#125;) =&gt; &#123;</div><br/>
              &nbsp;&nbsp;<div className="text-pink-400 inline">await</div> <div className="inline text-white">page.goto(</div><div className="inline text-emerald-400">'https://demo.app'</div><div className="inline text-white">);</div><br/><br/>
              &nbsp;&nbsp;<div className="text-white/40 inline">// AI will heal this broken locator automatically</div><br/>
              &nbsp;&nbsp;<div className="text-pink-400 inline">await</div> <div className="inline text-white">page.locator(</div><div className="inline text-red-400">'.btn-buy-now-old'</div><div className="inline text-white">).click();</div><br/>
              <div className="inline text-white">&#125;);</div><span className="typing-cursor inline-block w-2 h-4 bg-white/80 ml-1 translate-y-1" />
            </div>
          </div>

          {/* Execution Environment */}
          <div className="bg-[#050505] border border-indigo-500/20 rounded-2xl overflow-hidden flex flex-col relative">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_100%)] pointer-events-none" />
             <div className="bg-black/50 border-b border-white/10 px-4 py-3 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-mono text-white/60">Agent Terminal</span>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-xs leading-relaxed overflow-y-auto relative z-10 space-y-4" ref={terminalRef}>
               <div className="text-white/40 term-waiting">Waiting for execution...</div>
               <div className="text-indigo-400 term-step hidden opacity-0">&gt; Starting trace...</div>
               <div className="text-red-400 term-step hidden opacity-0">Error: Locator not found: .btn-buy-now-old</div>
               <div className="text-emerald-400 border-l-2 border-emerald-500 pl-4 my-2 py-2 bg-emerald-500/10 term-step hidden opacity-0">
                  Agent Action: Analyzing DOM tree...<br/>
                  Found semantic match: "Buy Now" button<br/>
                  Applying fix: page.getByRole('button', &#123; name: 'Buy Now' &#125;)
               </div>
               <div className="text-indigo-400 term-step hidden opacity-0">&gt; Resuming execution...</div>
               <div className="text-emerald-400 font-bold flex items-center gap-2 mt-2 term-step hidden opacity-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Test Passed Successfully
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
