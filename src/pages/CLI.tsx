import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Copy, Check, Command, Cpu, Layers, ArrowRight, Boxes } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, MagneticButton } from '../components/fx';
import { RepoLogos } from '../components/brand/BrandLogos';

const CommandLine: React.FC<{ cmd: string }> = ({ cmd }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 bg-black/50 border border-white/10 rounded-xl px-5 py-4 font-mono text-sm">
      <span className="text-emerald-400"><span className="text-white/30">$ </span>{cmd}</span>
      <button
        onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="text-white/40 hover:text-white transition-colors shrink-0"
        aria-label="Copy command"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const SKILLS = [
  { logo: RepoLogos.claude, t: 'Claude Code skill', d: 'Drop the Coderat skill into Claude Code and heal failing flows straight from your terminal session with full repo context.' },
  { logo: RepoLogos.openai, t: 'Codex skill', d: 'Wire Coderat into the Codex CLI so the agent can interpret DOM drift and write resilient fallback locators inline.' },
  { logo: RepoLogos.gemini, t: 'Gemini runner', d: 'Use Gemini as the reasoning model behind discovery and healing for blazing-fast, low-cost runs.' },
  { logo: RepoLogos.openrouter, t: 'OpenRouter / BYO key', d: 'Point the CLI at any model on OpenRouter or bring your own provider key for full control over cost and privacy.' },
];

export default function CLI() {
  return (
    <PageShell
      eyebrow="CLI & Agent Skills"
      eyebrowIcon={<Terminal className="w-4 h-4" />}
      accent="from-pink-400 to-indigo-400"
      title={<>Coderat, right in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 cr-grad-text">terminal</span></>}
      subtitle="Install the CLI, plug Coderat into Claude Code, Codex, and other agentic tools, and run autonomous QA from anywhere your shell lives."
    >
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Quickstart */}
        <div className="space-y-3 mb-24" data-reveal>
          <h2 className="text-2xl font-display font-bold mb-4">Get started in three commands</h2>
          <CommandLine cmd="npm i -g @coderat/cli" />
          <CommandLine cmd="coderat login" />
          <CommandLine cmd="coderat heal ./tests --open-pr" />
        </div>

        {/* Terminal demo */}
        <TiltCard max={5} className="bg-[#0A0A0B] border border-white/10 rounded-3xl overflow-hidden mb-28" data-reveal>
          <div className="bg-black/50 border-b border-white/10 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-3 text-xs font-mono text-white/40">zsh — coderat</span>
          </div>
          <div className="p-6 font-mono text-[13px] leading-relaxed space-y-1.5">
            <div><span className="text-white/30">$ </span><span className="text-emerald-400">coderat heal ./tests --open-pr</span></div>
            <div className="text-white/50">✓ Discovered 24 specs · running headless…</div>
            <div className="text-red-400">✗ checkout.spec.ts — locator '.btn-buy-old' not found</div>
            <div className="text-indigo-300">→ analyzing DOM · semantic match: "Buy now" button</div>
            <div className="text-emerald-400">✓ healed · getByRole('button', {'{'} name: 'Buy now' {'}'})</div>
            <div className="text-white/50">✓ opened PR <span className="text-pink-400">#128</span> · 1 file changed</div>
            <div className="text-emerald-400 font-bold">All 24 tests passing · done in 11.3s</div>
          </div>
        </TiltCard>

        {/* Skills */}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-3" data-reveal>Agent skills & model providers</h2>
        <p className="text-white/50 text-center max-w-2xl mx-auto mb-12" data-reveal>Coderat is model-agnostic. Plug it into the agentic tools you already use.</p>
        <div className="grid sm:grid-cols-2 gap-6 mb-28">
          {SKILLS.map((s) => (
            <TiltCard key={s.t} max={8} className="bg-[#111111] border border-white/10 rounded-2xl p-8 flex items-start gap-5" data-reveal>
              <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 p-3">
                <img src={s.logo} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{s.t}</h3>
                <p className="text-white/50 leading-relaxed">{s.d}</p>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Command reference */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 mb-24" data-reveal>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Command className="w-5 h-5 text-indigo-400" /> Command reference</h3>
          <div className="divide-y divide-white/5 font-mono text-sm">
            {[
              ['coderat discover <url>', 'Crawl an app and generate a Playwright suite'],
              ['coderat run', 'Execute the suite in the agent runner'],
              ['coderat heal', 'Detect and rewrite broken selectors'],
              ['coderat watch', 'Continuously monitor a deploy for drift'],
              ['coderat skill add claude', 'Register Coderat as a Claude Code skill'],
            ].map(([c, d]) => (
              <div key={c} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 py-3">
                <span className="text-emerald-400 sm:w-72 shrink-0">{c}</span>
                <span className="text-white/50 font-sans">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-12 text-center cr-shine" data-reveal>
          <Boxes className="w-10 h-10 text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Bring QA to your shell</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Free and open. Install the CLI and run your first heal in under a minute.</p>
          <MagneticButton as="div">
            <Link to="/docs" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
              Read the CLI docs <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </PageShell>
  );
}
