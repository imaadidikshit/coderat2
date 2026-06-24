import React, { useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Bot, Bug, Eye, Zap, Search, CheckCircle2, GitBranch, Workflow, ArrowRight,
  Layers, ShieldCheck, Gauge, Network, FlaskConical, Boxes,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { CountUp, TiltCard, MagneticButton, GradientMesh, prefersReducedMotion } from '../components/fx';
import { ExpandableCard } from '../components/marketing/ExpandableCard';

gsap.registerPlugin(ScrollTrigger);

/* A pinned scrollytelling feature block: the visual is pinned while the copy
 * scrolls, with a scrub-driven 3D entrance. Mirrors the landing-page feel. */
const FeatureScene: React.FC<{
  index: number;
  reverse?: boolean;
  icon: React.ReactNode;
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: React.ReactNode;
}> = ({ index, reverse, icon, accent, eyebrow, title, body, bullets, visual }) => {
  const scene = useRef<HTMLDivElement>(null);
  const visualWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scene.current || !visualWrap.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        visualWrap.current,
        { scale: 0.85, rotateY: reverse ? 12 : -12, opacity: 0.4 },
        {
          scale: 1, rotateY: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: scene.current, start: 'top 80%', end: 'center center', scrub: 1 },
        }
      );
      gsap.from(scene.current!.querySelectorAll('[data-copy]'), {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: scene.current, start: 'top 72%', once: true },
      });
    }, scene);
    return () => ctx.revert();
  }, [reverse]);

  return (
    <div ref={scene} className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-40 perspective-[1400px]">
      <div className={reverse ? 'md:order-2' : ''}>
        <div data-copy className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${accent}`}>{icon}</div>
        <div data-copy className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Capability {index}</div>
        <h2 data-copy className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{title}</h2>
        <p data-copy className="text-lg text-white/50 leading-relaxed mb-8">{body}</p>
        <ul className="space-y-4">
          {bullets.map((b) => (
            <li key={b} data-copy className="flex items-center gap-3 text-white/80 font-bold">
              <Zap className="w-5 h-5 text-indigo-400" /> {b}
            </li>
          ))}
        </ul>
      </div>
      <div ref={visualWrap} className={reverse ? 'md:order-1' : ''} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {visual}
      </div>
    </div>
  );
};

export default function Features() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const onFrame = (t: number) => lenis.raf(t * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(onFrame);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(onFrame); lenis.destroy(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-32 pb-24 overflow-hidden">
        <section className="relative text-center max-w-4xl mx-auto px-6 mb-20">
          <GradientMesh />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 cr-float">
              <Bot className="w-4 h-4" /> Autonomous QA engineer
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8">
              The future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 cr-grad-text">testing</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
              Coderat isn't just a test runner. It's an autonomous AI agent that discovers your flows, understands your UI, heals flaky locators, and catches visual regressions before your users do.
            </p>
          </div>
        </section>

        {/* Stats band */}
        <section className="max-w-[1100px] mx-auto px-6 mb-36 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {[
            { end: 92, suffix: '%', label: 'Less flakiness' },
            { end: 2.4, suffix: 'M+', label: 'Tests healed', decimals: 1 },
            { end: 3, suffix: 'x', label: 'Faster releases' },
            { end: 5, suffix: ' min', label: 'To first test' },
          ].map((s) => (
            <TiltCard key={s.label} max={6} className="bg-[#111111] border border-white/10 rounded-2xl py-8">
              <div className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                <CountUp end={s.end} suffix={s.suffix} decimals={(s as any).decimals || 0} />
              </div>
              <div className="text-white/40 text-sm font-bold mt-2 uppercase tracking-wide">{s.label}</div>
            </TiltCard>
          ))}
        </section>

        {/* Scene 1: Self-healing */}
        <FeatureScene
          index={1}
          icon={<Bot className="w-8 h-8 text-indigo-400" />}
          accent="bg-indigo-500/20 border-indigo-500/30"
          eyebrow="Self-healing"
          title="Self-healing locators"
          body="CSS classes change. DOM structures evolve. Coderat detects broken selectors and uses semantic AI to find the correct element, then updates the test automatically via pull request."
          bullets={['Zero maintenance', 'Semantic DOM understanding', 'Auto-generated PRs']}
          visual={
            <TiltCard max={9} className="relative aspect-square w-full max-w-lg mx-auto bg-[#111111] rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 font-mono text-sm space-y-4">
                <div className="text-red-400 line-through opacity-50">await page.click('.btn-primary-old')</div>
                <div className="text-white/30 italic">// AI agent identified DOM change…</div>
                <div className="text-white/30 italic">// Found element with text "Checkout"</div>
                <div className="bg-indigo-500/20 border border-indigo-500/30 p-4 rounded text-indigo-300">await page.getByRole('button', &#123; name: 'Checkout' &#125;).click();</div>
                <div className="text-emerald-400 font-bold mt-8 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Test passed</div>
              </div>
            </TiltCard>
          }
        />

        {/* Scene 2: Visual regression */}
        <FeatureScene
          index={2}
          reverse
          icon={<Eye className="w-8 h-8 text-emerald-400" />}
          accent="bg-emerald-500/20 border-emerald-500/30"
          eyebrow="Vision"
          title="Smart visual regression"
          body="Pixel-matching is brittle. Our AI vision model understands context, ignoring harmless shifts like dynamic timestamps or anti-aliasing while catching real layout breaks."
          bullets={['AI vision model', 'Ignores dynamic content', 'Pixel-perfect baselines']}
          visual={
            <TiltCard max={9} className="relative aspect-square w-full max-w-lg mx-auto bg-[#111111] rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
              <div className="relative z-10 w-full h-full border border-white/10 rounded-xl bg-black/50 p-6 flex flex-col justify-center gap-4">
                <div className="h-12 border-2 border-dashed border-red-500/50 bg-red-500/10 rounded flex items-center px-4 animate-pulse"><span className="text-red-400 text-xs font-bold">Padding reduced by 8px</span></div>
                <div className="h-12 border-2 border-emerald-500/50 bg-emerald-500/10 rounded flex items-center px-4"><span className="text-emerald-400 text-xs font-bold">Original baseline</span></div>
              </div>
            </TiltCard>
          }
        />

        {/* Scene 3: Flow discovery */}
        <FeatureScene
          index={3}
          icon={<Search className="w-8 h-8 text-cyan-400" />}
          accent="bg-cyan-500/20 border-cyan-500/30"
          eyebrow="Discovery"
          title="Autonomous flow discovery"
          body="Point Coderat at your app and its agents explore it like a real user — mapping critical journeys, generating a full Playwright suite, and keeping it in sync as your product evolves."
          bullets={['Zero test writing', 'Critical-path detection', 'Always up to date']}
          visual={
            <TiltCard max={9} className="relative aspect-square w-full max-w-lg mx-auto bg-[#111111] rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4"><Workflow className="w-5 h-5 text-cyan-400" /> <span className="text-sm font-mono text-white/60">flows.discovered</span></div>
              <div className="flex-1 space-y-3 font-mono text-sm">
                {['/ → /products', '/products → /cart', '/cart → /checkout', '/checkout → /success'].map((f) => (
                  <div key={f} className="flex items-center gap-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-4 py-3 text-cyan-200/80"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> {f}</div>
                ))}
              </div>
            </TiltCard>
          }
        />

        {/* Scene 4: CI/CD & PRs */}
        <FeatureScene
          index={4}
          reverse
          icon={<GitBranch className="w-8 h-8 text-pink-400" />}
          accent="bg-pink-500/20 border-pink-500/30"
          eyebrow="Ship"
          title="Fixes that ship themselves"
          body="Coderat runs on every pull request, comments with visual diffs and results, and pushes auto-heal commits directly — so your pipeline stays green while you sleep."
          bullets={['Runs on every PR', 'Visual diff comments', 'Auto-heal commits']}
          visual={
            <TiltCard max={9} className="relative aspect-square w-full max-w-lg mx-auto bg-[#111111] rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4"><GitBranch className="w-5 h-5 text-pink-400" /> <span className="text-sm font-mono text-white/60">pull/42 · auto-heal</span></div>
              <div className="flex-1 font-mono text-sm space-y-2">
                <div className="text-red-400 bg-red-500/10 px-3 py-2 rounded border border-red-500/20">- await page.click('.btn-primary');</div>
                <div className="text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20">+ await page.getByRole('button').click();</div>
                <div className="pt-4"><div className="w-full h-11 bg-[#238636] rounded-lg text-white font-bold flex items-center justify-center text-sm gap-2"><GitBranch className="w-4 h-4" /> Merge pull request</div></div>
              </div>
            </TiltCard>
          }
        />

        {/* Expandable capability grid */}
        <section className="max-w-[1400px] mx-auto px-6 mb-32">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Everything in the box</h2>
            <p className="text-white/50">Tap any capability to see exactly how it works.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExpandableCard accent="indigo" icon={<Network className="w-7 h-7 text-indigo-400" />} title="Parallel cloud runners"
              summary="Run hundreds of specs concurrently on isolated, ephemeral browsers."
              details={<p>Coderat shards your suite across single-tenant containers and tears them down after each run — fast, clean, and reproducible.</p>} />
            <ExpandableCard accent="emerald" icon={<Gauge className="w-7 h-7 text-emerald-400" />} title="Flakiness scoring"
              summary="Every test gets a live stability score so you know what to trust."
              details={<p>We track historical pass/fail variance and surface the flakiest specs, then auto-heal or quarantine them before they block a deploy.</p>} />
            <ExpandableCard accent="pink" icon={<FlaskConical className="w-7 h-7 text-pink-400" />} title="Custom prompt tests"
              summary="Describe a scenario in plain English and the agent writes the spec."
              details={<p>“Test checkout with an expired card” becomes a real Playwright test, generated, run, and added to your suite automatically.</p>} />
            <ExpandableCard accent="cyan" icon={<Layers className="w-7 h-7 text-cyan-400" />} title="Site topology map"
              summary="A live graph of every route and flow the agent has discovered."
              details={<p>Visualize how pages connect, which flows are covered, and where untested gaps remain — updated on every crawl.</p>} />
            <ExpandableCard accent="amber" icon={<ShieldCheck className="w-7 h-7 text-amber-400" />} title="Privacy-first execution"
              summary="Your source code is never stored. Runs are ephemeral by design."
              details={<p>Coderat reads only the context it needs during a run. Nothing persists afterward. See the security page for the full model.</p>} />
            <ExpandableCard accent="indigo" icon={<Boxes className="w-7 h-7 text-indigo-400" />} title="Model-agnostic engine"
              summary="Bring Claude, OpenAI, Gemini, or any OpenRouter model."
              details={<p>Pick the right model per project for cost, speed, or privacy. Swap providers any time without rewriting a single test.</p>} />
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1100px] mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-12 md:p-16 text-center cr-shine">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">See it on your own app</h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">Connect a repo and watch Coderat discover, test, and heal your flows automatically.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton as="div">
                <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
              <Link to="/sandbox" className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#222] transition-colors">
                Try the Sandbox
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
