import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessagesSquare, Github, Calendar, Star, GitPullRequest, ArrowRight, Heart } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, MagneticButton, CountUp } from '../components/fx';

const CHANNELS = [
  { icon: MessagesSquare, c: 'text-indigo-400', t: 'Discord', d: 'Chat with the team and thousands of engineers shipping self-healing tests. Get help in minutes.', cta: 'Join the server' },
  { icon: Github, c: 'text-white', t: 'GitHub Discussions', d: 'Propose features, share recipes, and follow the public roadmap out in the open.', cta: 'Open discussions' },
  { icon: Calendar, c: 'text-emerald-400', t: 'Office hours', d: 'Weekly live sessions where we debug real flaky suites and demo new agent capabilities.', cta: 'See the schedule' },
];

const CONTRIB = [
  { icon: GitPullRequest, t: 'Open-source CLI', d: 'The Coderat CLI and agent skills are open source. PRs welcome.' },
  { icon: Star, t: 'Recipe library', d: 'Community-maintained healing patterns for popular frameworks.' },
  { icon: Heart, t: 'Ambassadors', d: 'Run a meetup or write a guide and we will sponsor it.' },
];

export default function Community() {
  return (
    <PageShell
      eyebrow="Community"
      eyebrowIcon={<Users className="w-4 h-4" />}
      title={<>Built with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 cr-grad-text">community</span></>}
      subtitle="Coderat is shaped by the engineers who use it. Join the conversation, share what you build, and help define the future of autonomous QA."
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-24" data-reveal>
          {[
            { end: 18000, suffix: '+', label: 'Discord members' },
            { end: 6200, suffix: '+', label: 'GitHub stars' },
            { end: 340, suffix: '+', label: 'Contributors' },
            { end: 52, suffix: '', label: 'Office hours held' },
          ].map((s) => (
            <TiltCard key={s.label} max={6} className="bg-[#111111] border border-white/10 rounded-2xl py-8 text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                <CountUp end={s.end} suffix={s.suffix} />
              </div>
              <div className="text-white/40 text-sm font-bold mt-2 uppercase tracking-wide">{s.label}</div>
            </TiltCard>
          ))}
        </div>

        {/* Channels */}
        <div className="grid md:grid-cols-3 gap-6 mb-28">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            return (
              <TiltCard key={c.t} max={8} className="group h-full bg-[#111111] border border-white/10 rounded-3xl p-8 flex flex-col" data-reveal>
                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-6">
                  <Icon className={`w-7 h-7 ${c.c}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{c.t}</h3>
                <p className="text-white/50 leading-relaxed flex-1">{c.d}</p>
                <a href="#" className="inline-flex items-center gap-2 text-indigo-300 font-bold text-sm mt-6 group-hover:gap-3 transition-all">{c.cta} <ArrowRight className="w-4 h-4" /></a>
              </TiltCard>
            );
          })}
        </div>

        {/* Contribute */}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12" data-reveal>Ways to contribute</h2>
        <div className="grid sm:grid-cols-3 gap-6 mb-24">
          {CONTRIB.map((c) => {
            const Icon = c.icon;
            return (
              <TiltCard key={c.t} max={7} className="bg-[#111111] border border-white/10 rounded-2xl p-7" data-reveal>
                <Icon className="w-7 h-7 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{c.t}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{c.d}</p>
              </TiltCard>
            );
          })}
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-12 text-center cr-shine" data-reveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Come say hi</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Thousands of engineers are already healing their suites together. Pull up a chair.</p>
          <MagneticButton as="div">
            <a href="#" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
              Join Discord <ArrowRight className="w-4 h-4" />
            </a>
          </MagneticButton>
        </div>
      </div>
    </PageShell>
  );
}
