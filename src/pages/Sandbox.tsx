import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  Play, Code, Cpu, Search, Bot, GitBranch, ArrowRight, CheckCircle2, XCircle,
  Loader2, Sparkles, Activity, Plus, RefreshCw, Terminal, Eye, Globe, Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TiltCard, MagneticButton, GradientMesh } from '../components/fx';

/* ------------------------------------------------------------------ *
 * Interactive Sandbox — a temporary, in-browser simulator that mimics the
 * real Coderat dashboard. 100% local state, no API calls, no persistence.
 * Lets visitors "run" tests and watch the agent discover, fail, and heal.
 * ------------------------------------------------------------------ */

type Status = 'idle' | 'running' | 'passed' | 'failed' | 'healing';
type Test = {
  id: number;
  name: string;
  flow: string;
  status: Status;
  duration: number;
  willHeal?: boolean;
};

const INITIAL_TESTS: Test[] = [
  { id: 1, name: 'Visitor can sign up', flow: '/ → /signup → /onboarding', status: 'idle', duration: 1.2 },
  { id: 2, name: 'Add product to cart', flow: '/products → /cart', status: 'idle', duration: 0.9 },
  { id: 3, name: 'Complete checkout flow', flow: '/cart → /checkout → /success', status: 'idle', duration: 1.8, willHeal: true },
  { id: 4, name: 'Search returns results', flow: '/ → /search?q=shoes', status: 'idle', duration: 0.7 },
  { id: 5, name: 'User can log out', flow: '/dashboard → /', status: 'idle', duration: 0.5 },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  idle: { label: 'Idle', cls: 'text-white/40 bg-white/5 border-white/10' },
  running: { label: 'Running', cls: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' },
  healing: { label: 'Healing', cls: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
  passed: { label: 'Passed', cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
  failed: { label: 'Failed', cls: 'text-rose-300 bg-rose-500/10 border-rose-500/20' },
};

export default function Sandbox() {
  const [tests, setTests] = useState<Test[]>(INITIAL_TESTS);
  const [logs, setLogs] = useState<{ t: string; c: string }[]>([
    { t: 'Agent runner ready. Press “Run all tests” to begin.', c: 'text-white/40' },
  ]);
  const [running, setRunning] = useState(false);
  const [prompt, setPrompt] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(100);

  const log = useCallback((t: string, c = 'text-white/60') => {
    setLogs((prev) => [...prev, { t, c }]);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const setStatus = (id: number, status: Status) =>
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const runTest = async (test: Test) => {
    setStatus(test.id, 'running');
    log(`▶ ${test.name}`, 'text-indigo-300');
    log(`  navigating ${test.flow}`, 'text-white/40');
    await sleep(700);
    if (test.willHeal) {
      setStatus(test.id, 'failed');
      log(`  ✗ locator '.btn-buy-old' not found`, 'text-rose-400');
      await sleep(600);
      setStatus(test.id, 'healing');
      log(`  → analyzing DOM · semantic match: “Buy now” button`, 'text-amber-300');
      await sleep(900);
      log(`  ✓ healed · getByRole('button', { name: 'Buy now' })`, 'text-emerald-400');
      await sleep(400);
    }
    setStatus(test.id, 'passed');
    log(`  ✓ passed in ${test.duration.toFixed(1)}s`, 'text-emerald-400');
  };

  const runAll = async () => {
    if (running) return;
    setRunning(true);
    setLogs([{ t: '$ coderat run --all', c: 'text-emerald-400' }]);
    setTests((prev) => prev.map((t) => ({ ...t, status: 'idle' })));
    for (const test of tests) {
      // eslint-disable-next-line no-await-in-loop
      await runTest(test);
    }
    log('', 'text-white/40');
    log('✓ Suite complete · 1 selector auto-healed · PR #128 opened', 'text-emerald-400 font-bold');
    setRunning(false);
  };

  const runSingle = async (test: Test) => {
    if (running) return;
    setRunning(true);
    await runTest(test);
    setRunning(false);
  };

  const addCustomTest = async () => {
    if (!prompt.trim() || running) return;
    const id = idRef.current++;
    const newTest: Test = { id, name: prompt.trim().slice(0, 48), flow: 'AI-generated flow', status: 'running', duration: 1.1 };
    setTests((prev) => [newTest, ...prev]);
    setRunning(true);
    log(`✨ Generating test: “${newTest.name}”`, 'text-pink-300');
    await sleep(900);
    log(`  ✓ spec written · ${newTest.flow}`, 'text-white/40');
    setStatus(id, 'passed');
    log(`  ✓ passed in 1.1s`, 'text-emerald-400');
    setPrompt('');
    setRunning(false);
  };

  const removeTest = (id: number) => setTests((prev) => prev.filter((t) => t.id !== id));

  const passed = tests.filter((t) => t.status === 'passed').length;
  const total = tests.length;
  const passRate = total ? Math.round((passed / total) * 100) : 0;
  const healed = tests.filter((t) => t.willHeal && t.status === 'passed').length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-[1400px] mx-auto w-full flex flex-col relative">
        <GradientMesh />
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-widest mb-6 cr-float">
            <Play className="w-4 h-4" /> Live simulator · no signup
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            The Coderat <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 cr-grad-text">Sandbox</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed">
            A fully interactive preview of the real dashboard. Run the suite, watch the agent heal a broken selector, and generate your own test — all in your browser, nothing saved.
          </p>
        </div>

        {/* ---------- Simulator window ---------- */}
        <TiltCard max={3} glow={false} className="relative z-10 bg-[#0B0B0D] border border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          {/* window chrome */}
          <div className="h-11 bg-black/50 border-b border-white/10 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="mx-auto flex items-center gap-2 text-[11px] font-mono text-white/40">
              <Globe className="w-3.5 h-3.5" /> app.coderat.dev/sandbox
            </div>
          </div>

          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">Demo Shop (Staging)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <MagneticButton as="div">
              <button
                onClick={runAll}
                disabled={running}
                className="px-5 py-2 bg-white text-black rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {running ? 'Running…' : 'Run all tests'}
              </button>
            </MagneticButton>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {[
              { label: 'Total tests', value: total, c: 'text-white' },
              { label: 'Pass rate', value: `${passRate}%`, c: 'text-emerald-400' },
              { label: 'Auto-healed', value: healed, c: 'text-amber-400' },
              { label: 'Runs today', value: passed * 3, c: 'text-indigo-400' },
            ].map((s) => (
              <div key={s.label} className="bg-[#0B0B0D] p-5">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{s.label}</div>
                <div className={`text-2xl font-mono font-bold ${s.c}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-px bg-white/5">
            {/* Test list */}
            <div className="bg-[#0B0B0D] p-5">
              {/* custom prompt */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomTest()}
                    placeholder="Describe a test, e.g. 'Apply an invalid coupon'"
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/60"
                  />
                </div>
                <button
                  onClick={addCustomTest}
                  disabled={running || !prompt.trim()}
                  className="px-4 py-2.5 bg-pink-500/90 hover:bg-pink-500 disabled:opacity-40 text-white rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Generate
                </button>
              </div>

              <div className="space-y-2">
                {tests.map((t) => {
                  const meta = STATUS_META[t.status];
                  return (
                    <div key={t.id} className="group flex items-center justify-between gap-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl px-4 py-3 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                          {t.status === 'passed' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            : t.status === 'failed' ? <XCircle className="w-4 h-4 text-rose-400" />
                            : t.status === 'running' || t.status === 'healing' ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                            : <Activity className="w-4 h-4 text-white/30" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-white/90 truncate">{t.name}</div>
                          <div className="font-mono text-[11px] text-white/35 truncate">{t.flow}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${meta.cls}`}>{meta.label}</span>
                        <button onClick={() => runSingle(t)} disabled={running} title="Run test" className="p-1.5 rounded-md text-white/40 hover:text-indigo-300 hover:bg-indigo-500/10 disabled:opacity-30 transition-colors">
                          <Play className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeTest(t.id)} disabled={running} title="Remove" className="p-1.5 rounded-md text-white/40 hover:text-rose-300 hover:bg-rose-500/10 disabled:opacity-30 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent terminal */}
            <div className="bg-[#050505] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-mono text-white/60">
                  <Cpu className="w-4 h-4 text-indigo-400" /> Agent terminal
                </div>
                <button onClick={() => setLogs([{ t: 'Cleared.', c: 'text-white/40' }])} className="text-white/30 hover:text-white/70 transition-colors" title="Clear">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div ref={logRef} className="flex-1 min-h-[280px] max-h-[360px] overflow-y-auto font-mono text-[12px] leading-relaxed space-y-1 pr-2 custom-scrollbar">
                {logs.map((l, i) => (
                  <div key={i} className={l.c}>{l.t || '\u00a0'}</div>
                ))}
              </div>
            </div>
          </div>
        </TiltCard>

        <p className="relative z-10 text-center text-white/30 text-xs mt-4">
          This is a simulated preview. Nothing here is saved or sent anywhere.
        </p>

        {/* How it works */}
        <section className="relative z-10 mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">From broken to merged in 3 steps</h2>
            <p className="text-white/50">The same loop runs automatically on every pull request.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Search, c: 'text-emerald-400', t: 'Discover & Run', d: 'Agents explore your app, generate Playwright specs, and run them on every change.' },
              { icon: Bot, c: 'text-indigo-400', t: 'Detect & Heal', d: 'When a selector breaks, the agent reads the new DOM and rewrites a resilient locator.' },
              { icon: GitBranch, c: 'text-pink-400', t: 'Open a PR', d: 'The fix ships as a reviewable pull request with diffs and results attached.' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <TiltCard key={i} max={8} className="bg-[#111111] border border-white/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                    <Icon className={`w-6 h-6 ${s.c}`} />
                  </div>
                  <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Step {i + 1}</div>
                  <h3 className="text-xl font-bold mb-2">{s.t}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.d}</p>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-10 md:p-14 text-center cr-shine">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Run this on your real repo</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Connect GitHub and let Coderat heal your suite automatically.</p>
          <MagneticButton as="div">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </section>
      </main>

      <Footer />
    </div>
  );
}
