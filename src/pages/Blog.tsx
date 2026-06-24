import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Clock, ArrowRight, Tag } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, MagneticButton } from '../components/fx';

const FEATURED = {
  tag: 'Engineering',
  read: '8 min read',
  title: 'How Coderat heals a broken selector in under 400ms',
  excerpt: 'A deep dive into the semantic DOM matching pipeline that lets our agent rewrite Playwright locators faster than a CI runner can boot.',
  date: 'June 2026',
};

const POSTS = [
  { tag: 'Product', read: '5 min', title: 'Introducing autonomous flow discovery', excerpt: 'Point Coderat at any URL and watch it map your critical user journeys into a complete Playwright suite.' },
  { tag: 'Engineering', read: '6 min', title: 'Visual regression without the false positives', excerpt: 'Why pixel diffing fails and how an AI vision model ignores harmless shifts while catching real layout breaks.' },
  { tag: 'Culture', read: '4 min', title: 'We dogfood Coderat on Coderat', excerpt: 'Our own pipeline self-heals. Here is what we learned shipping an agent that tests the product that built it.' },
  { tag: 'Guides', read: '7 min', title: 'From Cypress to self-healing in an afternoon', excerpt: 'A migration guide for teams who want to keep their assertions but lose the maintenance burden.' },
  { tag: 'Product', read: '3 min', title: 'PR comments your reviewers will actually read', excerpt: 'Visual diffs, healed selectors, and run results — all inline on the pull request.' },
  { tag: 'Security', read: '5 min', title: 'How we keep your source code private', excerpt: 'Context windows, ephemeral runners, and zero retention. A look at the Coderat security model.' },
];

const TAG_COLORS: Record<string, string> = {
  Engineering: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
  Product: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  Culture: 'text-pink-300 bg-pink-500/10 border-pink-500/20',
  Guides: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  Security: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
};

export default function Blog() {
  return (
    <PageShell
      eyebrow="The Coderat blog"
      eyebrowIcon={<Newspaper className="w-4 h-4" />}
      title={<>Notes from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 cr-grad-text">agents</span></>}
      subtitle="Engineering deep dives, product launches, and lessons from teaching machines to test software."
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Featured */}
        <TiltCard max={5} glow className="relative overflow-hidden bg-[#111111] border border-white/10 rounded-3xl p-8 md:p-12 mb-16" data-reveal>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${TAG_COLORS[FEATURED.tag]}`}>{FEATURED.tag}</span>
              <span className="text-white/40 text-xs flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {FEATURED.read}</span>
              <span className="text-white/40 text-xs">{FEATURED.date}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 max-w-3xl">{FEATURED.title}</h2>
            <p className="text-white/55 text-lg max-w-2xl mb-6">{FEATURED.excerpt}</p>
            <span className="inline-flex items-center gap-2 text-indigo-300 font-bold text-sm">Read article <ArrowRight className="w-4 h-4" /></span>
          </div>
        </TiltCard>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {POSTS.map((p) => (
            <TiltCard key={p.title} max={8} className="group h-full bg-[#111111] border border-white/10 rounded-2xl p-7 flex flex-col" data-reveal>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${TAG_COLORS[p.tag]}`}>{p.tag}</span>
                <span className="text-white/35 text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" /> {p.read}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">{p.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed flex-1">{p.excerpt}</p>
              <span className="inline-flex items-center gap-2 text-white/60 group-hover:text-white font-bold text-sm mt-5 transition-colors">Read more <ArrowRight className="w-4 h-4" /></span>
            </TiltCard>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-10 md:p-14 text-center cr-shine" data-reveal>
          <Tag className="w-9 h-9 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold mb-3">Never miss a heal</h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">Monthly engineering notes and product updates. No spam, unsubscribe anytime.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input type="email" placeholder="you@company.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500" />
            <MagneticButton as="div">
              <button type="submit" className="whitespace-nowrap bg-white text-black px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">Subscribe</button>
            </MagneticButton>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
