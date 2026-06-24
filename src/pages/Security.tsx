import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, Server, FileCheck, KeyRound, RefreshCw, ArrowRight } from 'lucide-react';
import PageShell from '../components/marketing/PageShell';
import { TiltCard, MagneticButton } from '../components/fx';
import { Accordion } from '../components/marketing/Accordion';

const PILLARS = [
  { icon: EyeOff, c: 'text-emerald-400', t: 'Zero code retention', d: 'Coderat reads your DOM and test context inside ephemeral runners. We never persist your proprietary source code after a run completes.' },
  { icon: Lock, c: 'text-indigo-400', t: 'Encrypted everywhere', d: 'All data is encrypted in transit with TLS 1.3 and at rest with AES-256. Secrets are stored in an isolated, access-controlled vault.' },
  { icon: KeyRound, c: 'text-pink-400', t: 'Scoped access', d: 'We request the minimum GitHub permissions needed to open pull requests — nothing more. Revoke access in one click, anytime.' },
  { icon: Server, c: 'text-cyan-400', t: 'Isolated execution', d: 'Every test run executes in a sandboxed, single-tenant container that is destroyed the moment your job finishes.' },
  { icon: FileCheck, c: 'text-amber-400', t: 'Audit-ready logs', d: 'Immutable, exportable logs record every action the agent took and every fix it shipped, for full SOC 2 traceability.' },
  { icon: RefreshCw, c: 'text-violet-400', t: 'Continuous monitoring', d: 'Automated dependency scanning and 24/7 intrusion detection keep the platform hardened against emerging threats.' },
];

const COMPLIANCE = ['SOC 2 Type II', 'GDPR', 'CCPA', 'ISO 27001', 'HIPAA-ready', 'SSO / SAML'];

const FAQ = [
  { q: 'Do you store my source code?', a: 'No. Coderat only reads the context required to heal a test during an active run, inside an ephemeral container. Nothing is retained afterward.' },
  { q: 'What permissions does the GitHub app need?', a: 'Read access to the repositories you connect and write access scoped to opening pull requests. You can review and revoke these permissions at any time from your GitHub settings.' },
  { q: 'Where is my data processed?', a: 'In single-tenant, region-isolated runners. Enterprise customers can pin processing to a specific region and bring their own model keys.' },
  { q: 'Can I get a copy of your compliance reports?', a: 'Yes. Customers on the Enterprise plan can request our SOC 2 Type II report and security questionnaire responses under NDA.' },
];

export default function Security() {
  return (
    <PageShell
      eyebrow="Security & compliance"
      eyebrowIcon={<ShieldCheck className="w-4 h-4" />}
      accent="from-emerald-400 to-cyan-400"
      title={<>Security you can <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 cr-grad-text">audit</span></>}
      subtitle="Coderat is built for teams that take security seriously. Your code stays yours, every action is reviewable, and the platform is hardened by default."
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Compliance badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-20" data-reveal>
          {COMPLIANCE.map((b) => (
            <span key={b} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-white/10 text-sm font-bold text-white/70">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> {b}
            </span>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <TiltCard key={p.t} max={8} className="bg-[#111111] border border-white/10 rounded-2xl p-7" data-reveal>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className={`w-6 h-6 ${p.c}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{p.t}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.d}</p>
              </TiltCard>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-24" data-reveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10">Security FAQ</h2>
          <Accordion items={FAQ} />
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-12 text-center cr-shine" data-reveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Need our compliance docs?</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Request our SOC 2 report and security questionnaire — our team will share them under NDA.</p>
          <MagneticButton as="div">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors">
              Talk to security <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </PageShell>
  );
}
