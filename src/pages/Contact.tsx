import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Twitter, Github, Send, LifeBuoy, Briefcase } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, MagneticButton } from '../components/fx';

const CHANNELS = [
  { icon: MessageSquare, c: 'text-indigo-400', t: 'Sales & demos', d: 'See Coderat run on your own repository.', a: 'hello@coderat.dev' },
  { icon: LifeBuoy, c: 'text-emerald-400', t: 'Support', d: 'Already using Coderat? We respond within hours.', a: 'support@coderat.dev' },
  { icon: Briefcase, c: 'text-pink-400', t: 'Partnerships', d: 'Integrations, resellers, and platform deals.', a: 'partners@coderat.dev' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <PageShell
      eyebrow="Contact us"
      eyebrowIcon={<Mail className="w-4 h-4" />}
      title={<>Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 cr-grad-text">talk</span></>}
      subtitle="Questions about Coderat, a demo on your stack, or just want to say hi? We read every message."
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Channels */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            return (
              <TiltCard key={c.t} max={8} className="bg-[#111111] border border-white/10 rounded-2xl p-7" data-reveal>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className={`w-6 h-6 ${c.c}`} />
                </div>
                <h3 className="text-lg font-bold mb-1">{c.t}</h3>
                <p className="text-white/50 text-sm mb-3">{c.d}</p>
                <a href={`mailto:${c.a}`} className="text-indigo-300 text-sm font-bold hover:text-indigo-200 transition-colors">{c.a}</a>
              </TiltCard>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Form */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8" data-reveal>
            <h2 className="text-2xl font-display font-bold mb-6">Send us a message</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message sent</h3>
                <p className="text-white/50">Thanks for reaching out — we'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required placeholder="Name" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500" />
                  <input required type="email" placeholder="Work email" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500" />
                </div>
                <input placeholder="Company" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500" />
                <textarea required rows={5} placeholder="How can we help?" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none" />
                <MagneticButton as="div">
                  <button type="submit" className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
                    Send message <Send className="w-4 h-4" />
                  </button>
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Side info */}
          <div className="space-y-6" data-reveal>
            <TiltCard max={6} className="bg-[#111111] border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold">Where we are</h3>
              </div>
              <p className="text-white/55 leading-relaxed">
                Coderat is a remote-first company with teammates across San Francisco, Bengaluru, Berlin, and beyond. Our agents run 24/7, and so do we.
              </p>
            </TiltCard>
            <TiltCard max={6} className="bg-[#111111] border border-white/10 rounded-3xl p-8">
              <h3 className="text-lg font-bold mb-4">Find us online</h3>
              <div className="flex items-center gap-3">
                {[Github, Twitter].map((Icon, i) => (
                  <a key={i} href="https://github.com" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                Avg. first response under 4 hours
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
