import React, { useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitMerge, ArrowRight, Layers, Slack as SlackIcon, Bell, Database, ShieldCheck, MonitorSmartphone, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { TiltCard, MagneticButton, CountUp, GradientMesh, prefersReducedMotion } from '../components/fx';
import { ExpandableCard } from '../components/marketing/ExpandableCard';
import {
  GitHubMark, VercelMark, NetlifyMark, VSCodeMark, SlackMark, LinearMark,
  DatadogMark, PagerDutyMark, CypressMark, RepoLogos,
} from '../components/brand/BrandLogos';

gsap.registerPlugin(ScrollTrigger);

type Item = {
  name: string;
  logo: React.ReactNode;
  accent: string;
  summary: string;
  details: React.ReactNode;
};

const bullets = (arr: string[]) => (
  <ul className="space-y-2">
    {arr.map((b) => (
      <li key={b} className="flex items-start gap-2">
        <GitMerge className="w-3.5 h-3.5 text-emerald-400 mt-1 shrink-0" />
        <span>{b}</span>
      </li>
    ))}
  </ul>
);

const SECTIONS: { id: string; title: string; blurb: string; items: Item[] }[] = [
  {
    id: 'source',
    title: 'Source control & CI',
    blurb: 'Coderat lives where your code does — reviewing, commenting, and shipping fixes as pull requests.',
    items: [
      {
        name: 'GitHub', logo: <GitHubMark className="w-10 h-10 text-white" />, accent: 'emerald',
        summary: 'Deep GitHub Actions & Pull Request integration with inline visual diffs and results.',
        details: (<>
          <p>Coderat installs as a GitHub App with least-privilege scopes and runs on every pull request.</p>
          {bullets(['Check runs with pass/fail gating', 'Inline PR comments with visual diffs', 'Auto-heal commits pushed to the branch', 'Status badges for your README'])}
        </>),
      },
    ],
  },
  {
    id: 'deploy',
    title: 'Deploy & preview',
    blurb: 'Trigger contextual tests the instant a preview build is ready.',
    items: [
      {
        name: 'Vercel', logo: <VercelMark className="w-9 h-9 text-white" />, accent: 'indigo',
        summary: 'Run visual regression against preview deployments the moment Vercel finishes building.',
        details: (<>
          <p>Listen to Vercel deployment hooks and match each preview URL to the originating branch.</p>
          {bullets(['Per-preview test runs', 'Deployment webhooks', 'Automatic branch matching'])}
        </>),
      },
      {
        name: 'Netlify', logo: <NetlifyMark className="w-10 h-10" />, accent: 'cyan',
        summary: 'Hook into Netlify build events and run headless Playwright before you merge.',
        details: (<>
          <p>A Netlify build plugin streams deploy-preview URLs straight into the Coderat runner.</p>
          {bullets(['Deploy preview testing', 'Build plugin install', 'Contextual, per-branch suites'])}
        </>),
      },
    ],
  },
  {
    id: 'editors',
    title: 'Editors & AI agents',
    blurb: 'Bring autonomous healing into your editor, terminal, and favorite agentic tools.',
    items: [
      {
        name: 'VS Code', logo: <VSCodeMark className="w-10 h-10" />, accent: 'indigo',
        summary: 'Inline selector healing, live linting, and a one-click test runner inside your editor.',
        details: (<>
          <p>The extension surfaces resilient-selector quick fixes right in the gutter.</p>
          {bullets(['Inline linting as you type', 'Selector suggestions', 'CodeLens test runner'])}
          <Link to="/vscode" className="inline-flex items-center gap-1 text-indigo-300 font-bold">Explore the extension <ArrowRight className="w-3.5 h-3.5" /></Link>
        </>),
      },
      {
        name: 'Claude Code', logo: <img src={RepoLogos.claude} alt="" className="w-9 h-9 object-contain" />, accent: 'amber',
        summary: 'A Claude Code skill that debugs UI state failures from your terminal with repo context.',
        details: (<>
          <p>Register Coderat as a skill and let Claude reason over DOM drift and heal flows.</p>
          {bullets(['Terminal integration', 'Full context sharing', 'Root-cause analysis'])}
          <Link to="/cli" className="inline-flex items-center gap-1 text-amber-300 font-bold">View CLI & skills <ArrowRight className="w-3.5 h-3.5" /></Link>
        </>),
      },
      {
        name: 'OpenAI Codex', logo: <img src={RepoLogos.openai} alt="" className="w-9 h-9 object-contain" />, accent: 'emerald',
        summary: 'Wire Coderat into Codex to interpret DOM changes and write robust fallback locators.',
        details: (<>
          <p>Codex powers semantic matching and AST-aware rewrites of brittle selectors.</p>
          {bullets(['Self-healing locators', 'Semantic matching', 'AST parsing'])}
        </>),
      },
      {
        name: 'Antigravity', logo: <Layers className="w-9 h-9 text-[#6366F1]" />, accent: 'indigo',
        summary: 'Refactor entire suites automatically when your design system changes.',
        details: (<>
          <p>Connect the Antigravity agentic engine for mass, design-system-aware updates.</p>
          {bullets(['Agentic refactoring', 'Design system sync', 'Bulk suite updates'])}
        </>),
      },
      {
        name: 'Gemini', logo: <img src={RepoLogos.gemini} alt="" className="w-9 h-9 object-contain" />, accent: 'cyan',
        summary: 'Use Gemini as the reasoning model behind discovery and healing for fast, low-cost runs.',
        details: (<>
          <p>Swap in Gemini per project for blazing throughput on large suites.</p>
          {bullets(['Discovery model', 'Low-cost runs', 'BYO key support'])}
        </>),
      },
      {
        name: 'OpenRouter', logo: <img src={RepoLogos.openrouter} alt="" className="w-9 h-9 object-contain" />, accent: 'pink',
        summary: 'Route to any model on OpenRouter or bring your own provider key.',
        details: (<>
          <p>Coderat is model-agnostic — pick the right model for cost, speed, or privacy.</p>
          {bullets(['Any OpenRouter model', 'Bring your own key', 'Per-project overrides'])}
        </>),
      },
    ],
  },
  {
    id: 'ops',
    title: 'Team & operations',
    blurb: 'Push QA signal everywhere your team already works.',
    items: [
      {
        name: 'Slack', logo: <SlackMark className="w-9 h-9" />, accent: 'pink',
        summary: 'Instant heal & failure notifications in the channels your team lives in.',
        details: (<>{bullets(['Per-channel routing', 'Threaded run summaries', 'Slash-command reruns'])}</>),
      },
      {
        name: 'Linear', logo: <LinearMark className="w-9 h-9" />, accent: 'indigo',
        summary: 'Auto-file issues for regressions the agent cannot safely heal.',
        details: (<>{bullets(['Auto-created issues', 'Two-way status sync', 'Cycle assignment'])}</>),
      },
      {
        name: 'Datadog', logo: <DatadogMark className="w-9 h-9" />, accent: 'indigo',
        summary: 'Stream QA metrics straight into your observability stack.',
        details: (<>{bullets(['Custom QA metrics', 'Dashboards & monitors', 'Flakiness trends'])}</>),
      },
      {
        name: 'PagerDuty', logo: <PagerDutyMark className="w-9 h-9" />, accent: 'emerald',
        summary: 'Escalate critical flow breakages to on-call instantly.',
        details: (<>{bullets(['Severity routing', 'On-call escalation', 'Auto-resolve on heal'])}</>),
      },
      {
        name: 'Cypress Import', logo: <CypressMark className="w-9 h-9" />, accent: 'cyan',
        summary: 'Migrate existing Cypress suites and let Coderat heal them going forward.',
        details: (<>{bullets(['One-shot importer', 'Assertion preservation', 'Gradual migration'])}</>),
      },
      {
        name: 'SOC 2 Vault', logo: <ShieldCheck className="w-9 h-9 text-emerald-400" />, accent: 'amber',
        summary: 'Audit-ready logs of every automated test and fix.',
        details: (<>{bullets(['Immutable audit trail', 'Exportable reports', 'Access controls'])}
          <Link to="/security" className="inline-flex items-center gap-1 text-amber-300 font-bold">See our security <ArrowRight className="w-3.5 h-3.5" /></Link></>),
      },
    ],
  },
];

export default function PublicIntegrations() {
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

    const triggers: ScrollTrigger[] = [];
    if (root.current && !prefersReducedMotion()) {
      // Section headers slide + fade
      root.current.querySelectorAll('[data-sec]').forEach((sec) => {
        const tw = gsap.from(sec, {
          opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sec, start: 'top 85%', once: true },
        });
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });
      // Cards stagger per row, 3D entrance
      root.current.querySelectorAll('[data-row]').forEach((row) => {
        const cards = row.querySelectorAll('[data-card]');
        const tw = gsap.from(cards, {
          opacity: 0, y: 80, rotateX: -12, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 82%', once: true },
        });
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });
    }

    return () => {
      triggers.forEach((t) => t.kill());
      try { gsap.ticker.remove(onFrame); if (lenis) lenis.destroy(); } catch (e) {}
    };
  }, []);

  return (
    <div ref={root} className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto relative overflow-hidden">
        <GradientMesh />
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 cr-float">
            <Layers className="w-4 h-4" /> 15+ native integrations
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Works with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 cr-grad-text">stack</span>
          </h1>
          <p className="text-xl text-white/50 leading-relaxed">
            Coderat slots into your existing workflow. Tap any integration to learn exactly what it does.
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 grid grid-cols-3 max-w-2xl mx-auto gap-4 mb-24 text-center">
          {[
            { end: 15, suffix: '+', label: 'Integrations' },
            { end: 30, suffix: 's', label: 'Avg. setup' },
            { end: 100, suffix: '%', label: 'Two-way sync' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111111] border border-white/10 rounded-2xl py-5">
              <div className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                <CountUp end={s.end} suffix={s.suffix} />
              </div>
              <div className="text-white/40 text-[11px] font-bold mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="relative z-10 space-y-24">
          {SECTIONS.map((sec) => (
            <section key={sec.id} className="perspective-[1200px]">
              <div data-sec className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-8 bg-gradient-to-r from-indigo-400 to-transparent" />
                  <h2 className="text-2xl md:text-3xl font-display font-bold">{sec.title}</h2>
                </div>
                <p className="text-white/50 max-w-2xl">{sec.blurb}</p>
              </div>
              <div data-row className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sec.items.map((it) => (
                  <div data-card key={it.name}>
                    <ExpandableCard
                      icon={it.logo}
                      title={it.name}
                      summary={it.summary}
                      details={it.details}
                      accent={it.accent}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="relative z-10 mt-28 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-10 md:p-14 text-center cr-shine">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Connect your stack in seconds</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">No glue code. No maintenance. Just plug Coderat in and let the agents work.</p>
          <MagneticButton as="div">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>
      </main>

      <Footer />
    </div>
  );
}
