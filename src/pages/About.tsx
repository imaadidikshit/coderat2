import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Rocket, Heart, Globe, Target, Users, ArrowRight, Sparkles } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, CountUp, MagneticButton } from '../components/fx';

const VALUES = [
  { icon: Target, c: 'text-indigo-400', t: 'Autonomy over toil', d: 'Engineers should design products, not babysit flaky selectors. We automate the boring 80% so teams focus on what matters.' },
  { icon: Heart, c: 'text-pink-400', t: 'Trust by default', d: 'We never store proprietary source code. Every action the agent takes is transparent, reviewable, and shipped as a pull request.' },
  { icon: Rocket, c: 'text-emerald-400', t: 'Ship relentlessly', d: 'We dogfood Coderat on Coderat. Our own pipeline self-heals, which is why we can move fast without breaking production.' },
  { icon: Globe, c: 'text-cyan-400', t: 'Built for everyone', d: 'From solo indie hackers to enterprise platform teams, resilient testing should be accessible to every developer on earth.' },
];

const TIMELINE = [
  { year: '2024', t: 'The first heal', d: 'A weekend prototype rewrote a broken Playwright selector on its own. The idea for Coderat was born.' },
  { year: '2025', t: 'Agents go autonomous', d: 'We shipped flow discovery and self-healing across thousands of repositories in private beta.' },
  { year: '2026', t: 'The QA engineer that never sleeps', d: 'Coderat now runs on every pull request, integrating with the entire modern dev stack.' },
];

export default function About() {
  return (
    <PageShell
      eyebrow="Our story"
      eyebrowIcon={<Building2 className="w-4 h-4" />}
      title={<>We're building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 cr-grad-text">autonomous QA engineer</span></>}
      subtitle="Coderat was founded by engineers who were tired of watching green pipelines turn red over a renamed CSS class. So we taught an agent to fix it."
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-32" data-reveal>
          {[
            { end: 2.4, suffix: 'M+', label: 'Tests healed', decimals: 1 },
            { end: 14000, suffix: '+', label: 'Repos connected' },
            { end: 92, suffix: '%', label: 'Less flakiness' },
            { end: 40, suffix: '+', label: 'Teammates worldwide' },
          ].map((s) => (
            <TiltCard key={s.label} max={6} className="bg-[#111111] border border-white/10 rounded-2xl py-8 text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                <CountUp end={s.end} suffix={s.suffix} decimals={(s as any).decimals || 0} />
              </div>
              <div className="text-white/40 text-sm font-bold mt-2 uppercase tracking-wide">{s.label}</div>
            </TiltCard>
          ))}
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div data-reveal>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Our mission</h2>
            <p className="text-white/55 text-lg leading-relaxed mb-4">
              Software testing is broken. Suites rot the moment a designer nudges a button, and engineers burn entire sprints maintaining tests instead of building features.
            </p>
            <p className="text-white/55 text-lg leading-relaxed">
              We believe quality assurance should be a background process — an intelligent teammate that discovers your flows, watches every deploy, and quietly opens a pull request the moment something drifts. That's Coderat.
            </p>
          </div>
          <TiltCard max={8} className="bg-[#111111] border border-white/10 rounded-3xl p-8" data-reveal>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span className="font-mono text-sm text-white/60">why_coderat.md</span>
            </div>
            <div className="space-y-4 text-white/70">
              <p>• 90% of test maintenance is mechanical and repetitive.</p>
              <p>• An agent that reads the DOM can do it faster and never gets tired.</p>
              <p>• Humans review the fix, the machine does the work.</p>
            </div>
          </TiltCard>
        </div>

        {/* Values */}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12" data-reveal>What we value</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-32">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <TiltCard key={v.t} max={7} className="bg-[#111111] border border-white/10 rounded-2xl p-8" data-reveal>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className={`w-6 h-6 ${v.c}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{v.t}</h3>
                <p className="text-white/50 leading-relaxed">{v.d}</p>
              </TiltCard>
            );
          })}
        </div>

        {/* Timeline */}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12" data-reveal>How we got here</h2>
        <div className="relative border-l border-white/10 ml-3 space-y-10 mb-32">
          {TIMELINE.map((m) => (
            <div key={m.year} className="relative pl-8" data-reveal>
              <span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.7)]" />
              <div className="text-indigo-400 font-mono text-sm font-bold mb-1">{m.year}</div>
              <h3 className="text-xl font-bold mb-2">{m.t}</h3>
              <p className="text-white/50 max-w-xl">{m.d}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-12 text-center cr-shine" data-reveal>
          <Users className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Want to build the future of QA?</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">We're a small, senior team shipping agents that real engineers rely on every day.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton as="div">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
                Get in touch <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <Link to="/blog" className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#222] transition-colors">
              Read the blog
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
