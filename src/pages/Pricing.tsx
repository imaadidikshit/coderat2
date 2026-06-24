import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Check, Sparkles, Zap, Building2, Rocket, ArrowRight, HelpCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { TiltCard, MagneticButton, CountUp, GradientMesh, prefersReducedMotion } from '../components/fx';

gsap.registerPlugin(ScrollTrigger);

const TIERS = [
  {
    name: 'Hobby',
    icon: Zap,
    price: { monthly: 0, yearly: 0 },
    tagline: 'For solo devs and side projects.',
    cta: 'Start Free',
    highlight: false,
    features: [
      '1 connected repository',
      '50 auto-healed tests / mo',
      'AI flow discovery',
      'GitHub PR integration',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    icon: Rocket,
    price: { monthly: 29, yearly: 24 },
    tagline: 'For fast-moving product teams.',
    cta: 'Start 14-day Trial',
    highlight: true,
    features: [
      'Unlimited repositories',
      '2,000 auto-healed tests / mo',
      'Visual regression AI',
      'Vercel + Netlify previews',
      'VS Code extension',
      'Claude Code & Codex skills',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: null, yearly: null },
    tagline: 'For orgs with serious scale.',
    cta: 'Talk to Sales',
    highlight: false,
    features: [
      'Everything in Pro',
      'Unlimited test runs',
      'Antigravity agentic refactors',
      'SSO / SAML & RBAC',
      'On-prem / VPC deploy',
      'Dedicated success engineer',
      '99.99% uptime SLA',
    ],
  },
];

const COMPARISON = [
  ['AI flow discovery', true, true, true],
  ['Self-healing locators', true, true, true],
  ['Visual regression AI', false, true, true],
  ['Vercel & Netlify previews', false, true, true],
  ['VS Code extension', false, true, true],
  ['Claude Code / Codex skills', false, true, true],
  ['Antigravity refactors', false, false, true],
  ['SSO / SAML', false, false, true],
  ['On-prem deploy', false, false, true],
];

const FAQ = [
  { q: 'How does usage-based test healing work?', a: 'Every time Coderat detects DOM drift and rewrites a selector, it counts as one healed test. Unused allowance does not roll over, but you can upgrade anytime.' },
  { q: 'Do you store my source code?', a: 'No. We only process DOM snapshots and test assertions needed to heal locators and detect regressions. Your proprietary code never leaves your repo.' },
  { q: 'Can I switch plans later?', a: 'Yes — upgrade or downgrade at any time. Changes are prorated automatically on your next invoice.' },
  { q: 'Is there a free trial for Pro?', a: 'Every Pro plan starts with a 14-day free trial. No credit card required to begin.' },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const mainRef = useRef<HTMLElement>(null);

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
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
              onComplete: () => { el.style.willChange = 'auto'; },
            }
          );
        });
      }, mainRef);

      return () => {
        ctx.revert();
        gsap.ticker.remove(raf);
        lenis?.destroy();
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main ref={mainRef} className="pt-32 pb-24 overflow-hidden">
        {/* Hero */}
        <section className="relative px-6 max-w-5xl mx-auto text-center mb-16">
          <GradientMesh />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 cr-float">
              <Sparkles className="w-4 h-4" /> Simple, scaling pricing
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              Pricing that grows <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 cr-grad-text">with your team</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Start free. Upgrade when your test suite does. Every plan includes autonomous
              flow discovery and self-healing Playwright tests.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 mt-10 bg-[#111111] border border-white/10 rounded-full p-1.5">
              <button
                onClick={() => setYearly(false)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${!yearly ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${yearly ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                Yearly <span className="text-emerald-400 text-xs">-20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="px-6 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-32 perspective-[1500px]">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const price = yearly ? tier.price.yearly : tier.price.monthly;
            return (
              <div key={tier.name} data-animate="reveal">
                <TiltCard
                  max={tier.highlight ? 8 : 6}
                  className={`relative h-full rounded-3xl p-8 flex flex-col ${
                    tier.highlight
                      ? 'bg-gradient-to-b from-indigo-500/15 to-[#111111] border-2 border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.2)]'
                      : 'bg-[#111111] border border-white/10'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <Icon className={`w-7 h-7 ${tier.highlight ? 'text-indigo-400' : 'text-white/70'}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-white/50 text-sm mb-6">{tier.tagline}</p>
                  <div className="mb-8 min-h-[60px]">
                    {price === null ? (
                      <div className="text-4xl font-display font-bold">Custom</div>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-display font-bold">
                          $<CountUp end={price} duration={1000} />
                        </span>
                        <span className="text-white/40 text-sm mb-2">/ mo</span>
                      </div>
                    )}
                    {yearly && price !== null && price > 0 && (
                      <div className="text-emerald-400 text-xs font-bold mt-1">billed annually</div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <MagneticButton as="div">
                    <Link
                      to={tier.name === 'Enterprise' ? '/signup' : '/signup'}
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors ${
                        tier.highlight
                          ? 'bg-white text-black hover:bg-gray-100'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {tier.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </MagneticButton>
                </TiltCard>
              </div>
            );
          })}
        </section>

        {/* Stats band */}
        <section data-animate="reveal" className="px-6 max-w-[1200px] mx-auto mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { end: 2.4, suffix: 'M+', label: 'Tests healed', decimals: 1 },
              { end: 99.99, suffix: '%', label: 'Uptime SLA', decimals: 2 },
              { end: 14000, suffix: '+', label: 'Repos connected', decimals: 0 },
              { end: 92, suffix: '%', label: 'Less flakiness', decimals: 0 },
            ].map((s) => (
              <div key={s.label} className="bg-[#111111] border border-white/10 rounded-2xl py-8">
                <div className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                  <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="text-white/40 text-sm font-bold mt-2 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section data-animate="reveal" className="px-6 max-w-[1000px] mx-auto mb-32">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Compare every plan</h2>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm">
                  <th className="p-5 font-bold text-white/60">Feature</th>
                  <th className="p-5 font-bold text-center">Hobby</th>
                  <th className="p-5 font-bold text-center text-indigo-400">Pro</th>
                  <th className="p-5 font-bold text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 text-sm">
                    <td className="p-5 text-white/70">{row[0] as string}</td>
                    {row.slice(1).map((cell, j) => (
                      <td key={j} className="p-5 text-center">
                        {cell ? (
                          <Check className="w-5 h-5 text-emerald-400 inline" />
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section data-animate="reveal" className="px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Questions, answered</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span className="font-bold flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" /> {item.q}
                  </span>
                  <span className={`text-2xl text-white/40 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                  <p className="text-white/50 leading-relaxed pl-8">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
