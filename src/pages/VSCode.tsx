import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Wand2, ListChecks, PlayCircle, Lightbulb, ArrowRight, Keyboard } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, MagneticButton, CountUp } from '../components/fx';
import { VSCodeMark } from '../components/brand/BrandLogos';
import { Accordion } from '../components/marketing/Accordion';

const FEATURES = [
  { icon: Wand2, c: 'text-indigo-400', t: 'Inline selector healing', d: 'When a locator goes stale, a lightbulb appears right in the gutter. Accept the AI fix without leaving your file.' },
  { icon: ListChecks, c: 'text-emerald-400', t: 'Live test linting', d: 'Brittle selectors, missing awaits, and flaky patterns are flagged as you type — before they ever reach CI.' },
  { icon: PlayCircle, c: 'text-pink-400', t: 'One-click runner', d: 'Run any spec or a single test from a CodeLens above the function and watch the agent terminal stream results.' },
  { icon: Lightbulb, c: 'text-cyan-400', t: 'Smart suggestions', d: 'Hover any element reference to see resilient `getByRole` and `data-testid` alternatives ranked by stability.' },
];

const FAQ = [
  { q: 'Which editors are supported?', a: 'VS Code, Cursor, and any VS Code-compatible editor that supports the OpenVSX marketplace.' },
  { q: 'Does it work offline?', a: 'Linting and the test runner work fully offline. AI healing requires a connection to your configured model provider.' },
  { q: 'Can I bring my own model key?', a: 'Yes. Point the extension at Claude, OpenAI, Gemini, or any OpenRouter model from the settings panel.' },
];

export default function VSCode() {
  return (
    <PageShell
      eyebrow="VS Code extension"
      eyebrowIcon={<VSCodeMark className="w-4 h-4" />}
      title={<>Heal tests without leaving your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0098FF] to-indigo-400 cr-grad-text">editor</span></>}
      subtitle="The Coderat extension brings autonomous QA into VS Code: inline healing, live linting, and a one-click runner that streams the agent's reasoning as it works."
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Install bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" data-reveal>
          <MagneticButton as="div">
            <a href="#" className="inline-flex items-center gap-3 bg-white text-black px-7 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
              <Download className="w-5 h-5" /> Add to VS Code
            </a>
          </MagneticButton>
          <div className="font-mono text-sm text-white/60 bg-black/40 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-3">
            <Keyboard className="w-4 h-4 text-white/40" /> ext install coderat.coderat-qa
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 max-w-2xl mx-auto gap-4 mb-24 text-center" data-reveal>
          {[
            { end: 120000, suffix: '+', label: 'Installs' },
            { end: 4.9, suffix: '★', label: 'Marketplace rating', decimals: 1 },
            { end: 0, suffix: ' config', label: 'Setup required' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111111] border border-white/10 rounded-2xl py-6">
              <div className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0098FF] to-indigo-400">
                <CountUp end={s.end} suffix={s.suffix} decimals={(s as any).decimals || 0} />
              </div>
              <div className="text-white/40 text-[11px] font-bold mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mock editor */}
        <TiltCard max={6} className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden mb-28" data-reveal>
          <div className="bg-black/50 border-b border-white/10 px-4 py-3 flex items-center gap-2">
            <VSCodeMark className="w-4 h-4" />
            <span className="text-sm font-mono text-white/60">checkout.spec.ts</span>
          </div>
          <div className="p-6 font-mono text-[13px] leading-relaxed space-y-1">
            <div className="text-white/40">// Coderat detected a stale locator</div>
            <div className="text-red-400 bg-red-500/10 -mx-2 px-2 rounded">await page.click(<span className="text-emerald-400">'.btn-buy-old'</span>);</div>
            <div className="flex items-center gap-2 text-indigo-300 bg-indigo-500/10 -mx-2 px-2 py-1 rounded">
              <Lightbulb className="w-4 h-4" /> Quick Fix: use resilient role selector
            </div>
            <div className="text-emerald-400 bg-emerald-500/10 -mx-2 px-2 rounded">await page.getByRole(<span className="text-emerald-300">'button'</span>, {'{'} name: <span className="text-emerald-300">'Buy now'</span> {'}'}).click();</div>
          </div>
        </TiltCard>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-6 mb-28">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <TiltCard key={f.t} max={8} className="bg-[#111111] border border-white/10 rounded-2xl p-8" data-reveal>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className={`w-6 h-6 ${f.c}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.t}</h3>
                <p className="text-white/50 leading-relaxed">{f.d}</p>
              </TiltCard>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-24" data-reveal>
          <h2 className="text-3xl font-display font-bold text-center mb-10">Extension FAQ</h2>
          <Accordion items={FAQ} />
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-12 text-center cr-shine" data-reveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Install it in 30 seconds</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Free for every plan, including the free tier. Your QA copilot lives in your editor now.</p>
          <MagneticButton as="div">
            <Link to="/docs" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
              Read the setup guide <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </PageShell>
  );
}
