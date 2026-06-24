import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, Search, Rocket, Plug, ShieldCheck, CreditCard, Bot, BookOpen, ArrowRight } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, MagneticButton } from '../components/fx';
import { Accordion } from '../components/marketing/Accordion';

const CATEGORIES = [
  { icon: Rocket, c: 'text-indigo-400', t: 'Getting started', n: 12 },
  { icon: Plug, c: 'text-emerald-400', t: 'Integrations', n: 18 },
  { icon: Bot, c: 'text-pink-400', t: 'Agents & healing', n: 22 },
  { icon: ShieldCheck, c: 'text-cyan-400', t: 'Security & privacy', n: 9 },
  { icon: CreditCard, c: 'text-amber-400', t: 'Billing & plans', n: 14 },
  { icon: BookOpen, c: 'text-violet-400', t: 'API & CLI', n: 16 },
];

const FAQ = [
  { q: 'How does Coderat connect to my repository?', a: 'Install the GitHub app, pick the repos you want to test, and Coderat begins discovering flows automatically. It only requests permission to read those repos and to open pull requests.' },
  { q: 'What happens when the agent cannot heal a test?', a: 'It posts a detailed comment on the pull request explaining what changed and why it could not safely auto-fix, then optionally files an issue in Linear or your tracker so a human can decide.' },
  { q: 'Can I control which flows get tested?', a: 'Yes. You can pin critical paths, exclude routes, and mark elements as untestable directly from the dashboard. The agent respects those rules on every run.' },
  { q: 'How do I upgrade or change my plan?', a: 'Head to Settings → Billing in your dashboard. Plan changes apply instantly and are prorated. See the Pricing page for a full comparison.' },
  { q: 'Do you offer a free tier?', a: 'Yes — the free tier includes flow discovery and a generous monthly run allowance, perfect for solo projects and evaluation.' },
];

export default function HelpCenter() {
  const [q, setQ] = useState('');
  return (
    <PageShell
      eyebrow="Help center"
      eyebrowIcon={<LifeBuoy className="w-4 h-4" />}
      accent="from-emerald-400 to-indigo-400"
      title={<>How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 cr-grad-text">help?</span></>}
      subtitle="Search the knowledge base, browse by topic, or reach a human. Most answers are one click away."
    >
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-20" data-reveal>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, e.g. 'connect GitHub'"
            className="w-full bg-[#111111] border border-white/10 rounded-2xl pl-14 pr-5 py-5 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <TiltCard key={cat.t} max={8} className="group bg-[#111111] border border-white/10 rounded-2xl p-7 cursor-pointer" data-reveal>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${cat.c}`} />
                  </div>
                  <span className="text-xs font-bold text-white/30">{cat.n} articles</span>
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-300 transition-colors">{cat.t}</h3>
                <span className="inline-flex items-center gap-1 text-sm text-white/50 group-hover:text-white transition-colors">Browse <ArrowRight className="w-3.5 h-3.5" /></span>
              </TiltCard>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-24" data-reveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10">Popular questions</h2>
          <Accordion items={FAQ} />
        </div>

        {/* Still need help */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-12 text-center cr-shine" data-reveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Still stuck?</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Our team responds within hours. Reach out and we'll get you unblocked.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton as="div">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
                Contact support <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <Link to="/community" className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#222] transition-colors">
              Ask the community
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
