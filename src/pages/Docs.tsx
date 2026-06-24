import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  BookOpen, Rocket, Plug, Terminal, GitBranch, Bot, Search, ArrowRight, Copy, Check,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { TiltCard, MagneticButton, GradientMesh, prefersReducedMotion } from '../components/fx';

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { id: 'getting-started', label: 'Getting Started', icon: Rocket },
  { id: 'flow-discovery', label: 'Flow Discovery', icon: Search },
  { id: 'self-healing', label: 'Self-Healing', icon: Bot },
  { id: 'ci-cd', label: 'CI/CD & PRs', icon: GitBranch },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'cli', label: 'CLI & Skills', icon: Terminal },
];

const CodeBlock: React.FC<{ code: string; lang?: string }> = ({ code, lang = 'bash' }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0B] overflow-hidden my-6">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#111111]">
        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{lang}</span>
        <button onClick={copy} className="text-white/40 hover:text-white transition-colors">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-5 font-mono text-sm text-white/80 overflow-x-auto leading-relaxed"><code>{code}</code></pre>
    </div>
  );
};

export default function Docs() {
  const [active, setActive] = useState('getting-started');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis: Lenis | undefined;
    if (!prefersReducedMotion()) {
      lenis = new Lenis();
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-animate="reveal"]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
              onComplete: () => { el.style.willChange = 'auto'; },
            }
          );
        });
      }, mainRef);
      return () => { ctx.revert(); gsap.ticker.remove(raf); lenis?.destroy(); };
    }
  }, []);

  // Scroll-spy for sidebar highlight
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <GradientMesh />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 cr-float">
            <BookOpen className="w-4 h-4" /> Documentation
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Build with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 cr-grad-text">Coderat</span>
          </h1>
          <p className="text-xl text-white/50 leading-relaxed">
            Everything you need to connect your repo, discover flows, and ship self-healing
            Playwright tests on every pull request.
          </p>
        </div>
      </section>

      <div ref={mainRef} className="max-w-[1300px] mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3 px-3">On this page</div>
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    active === n.id
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {n.label}
                </a>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <div className="max-w-3xl">
          <section id="getting-started" data-animate="reveal" className="scroll-mt-28 mb-20">
            <h2 className="text-3xl font-display font-bold mb-4 flex items-center gap-3"><Rocket className="w-7 h-7 text-indigo-400" /> Getting Started</h2>
            <p className="text-white/60 leading-relaxed mb-2">Get from zero to your first auto-healed test in under five minutes.</p>
            <CodeBlock lang="bash" code={`# 1. Install the Coderat CLI\nnpm i -g @coderat/cli\n\n# 2. Authenticate\ncoderat login\n\n# 3. Connect your repo & let agents discover flows\ncoderat init && coderat discover`} />
            <p className="text-white/60 leading-relaxed">That’s it. Coderat crawls your app, maps critical user journeys, and generates a Playwright suite committed to a new branch.</p>
          </section>

          <section id="flow-discovery" data-animate="reveal" className="scroll-mt-28 mb-20">
            <h2 className="text-3xl font-display font-bold mb-4 flex items-center gap-3"><Search className="w-7 h-7 text-emerald-400" /> Flow Discovery</h2>
            <p className="text-white/60 leading-relaxed mb-4">The discovery agent explores your application like a real user — clicking, typing, and navigating — to map every meaningful flow. Each discovered journey becomes a maintainable spec.</p>
            <CodeBlock lang="ts" code={`// auto-generated by Coderat\ntest('checkout flow', async ({ page }) => {\n  await page.goto('/');\n  await page.getByRole('button', { name: 'Add to cart' }).click();\n  await page.getByRole('link', { name: 'Checkout' }).click();\n  await expect(page).toHaveURL(/\\/success/);\n});`} />
          </section>

          <section id="self-healing" data-animate="reveal" className="scroll-mt-28 mb-20">
            <h2 className="text-3xl font-display font-bold mb-4 flex items-center gap-3"><Bot className="w-7 h-7 text-indigo-400" /> Self-Healing</h2>
            <p className="text-white/60 leading-relaxed mb-4">When a selector breaks because your UI changed, Coderat analyzes the new DOM, finds the semantically correct element, and rewrites the locator to be resilient — then opens a PR.</p>
            <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5 font-mono text-sm space-y-2">
              <div className="text-red-400">- await page.click('.btn-primary');</div>
              <div className="text-emerald-400">+ await page.getByRole('button', {'{'} name: 'Checkout' {'}'}).click();</div>
            </div>
          </section>

          <section id="ci-cd" data-animate="reveal" className="scroll-mt-28 mb-20">
            <h2 className="text-3xl font-display font-bold mb-4 flex items-center gap-3"><GitBranch className="w-7 h-7 text-pink-400" /> CI/CD & Pull Requests</h2>
            <p className="text-white/60 leading-relaxed mb-4">Drop Coderat into any pipeline. It runs on every PR, comments with visual diffs and test results, and pushes auto-heal commits directly.</p>
            <CodeBlock lang="yaml" code={`# .github/workflows/coderat.yml\nname: Coderat QA\non: [pull_request]\njobs:\n  qa:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: coderat/action@v1\n        with:\n          token: \${{ secrets.CODERAT_TOKEN }}`} />
          </section>

          <section id="integrations" data-animate="reveal" className="scroll-mt-28 mb-20">
            <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3"><Plug className="w-7 h-7 text-emerald-400" /> Integrations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { t: 'Vercel', d: 'Test preview deployments the moment they build.' },
                { t: 'Netlify', d: 'Run headless checks on deploy previews.' },
                { t: 'VS Code', d: 'Heal flaky selectors right inside your editor.' },
                { t: 'Claude Code', d: 'Debug UI failures from your terminal.' },
                { t: 'OpenAI Codex', d: 'Generate robust fallback locators instantly.' },
                { t: 'Antigravity', d: 'Mass-refactor suites when design systems shift.' },
              ].map((i) => (
                <TiltCard key={i.t} max={6} className="rounded-2xl border border-white/10 bg-[#111111] p-5">
                  <h4 className="font-bold mb-1">{i.t}</h4>
                  <p className="text-white/50 text-sm">{i.d}</p>
                </TiltCard>
              ))}
            </div>
            <Link to="/integrations" className="inline-flex items-center gap-2 text-indigo-400 font-bold text-sm mt-6 hover:gap-3 transition-all">
              See all integrations <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section id="cli" data-animate="reveal" className="scroll-mt-28 mb-12">
            <h2 className="text-3xl font-display font-bold mb-4 flex items-center gap-3"><Terminal className="w-7 h-7 text-indigo-400" /> CLI & Skills</h2>
            <p className="text-white/60 leading-relaxed mb-4">Use Coderat as a Claude Code skill or a Codex tool to drive QA straight from your agentic workflow.</p>
            <CodeBlock lang="bash" code={`coderat run --spec checkout.spec.ts --heal\ncoderat skill install claude-code\ncoderat skill install codex`} />
          </section>

          <div data-animate="reveal" className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent p-8 text-center cr-shine">
            <h3 className="text-2xl font-bold mb-3">Ready to ship greener pipelines?</h3>
            <p className="text-white/50 mb-6">Connect your first repo in minutes.</p>
            <MagneticButton as="div">
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
