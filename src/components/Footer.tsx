import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, ArrowRight, Activity } from 'lucide-react';
import brandLogo from './model_logos/App_assets/wordmark_D_white.svg';
import { MagneticButton } from './fx';

export const Footer = () => {
  return (
    <footer className="relative bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* CTA band */}
      <div className="relative max-w-[1400px] mx-auto px-6 pt-20">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0B] p-10 md:p-16 text-center overflow-hidden cr-shine">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Ship with confidence.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            Let autonomous agents discover, test, and heal your flows on every pull request.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#222] transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center mb-6">
              <img src={brandLogo} alt="Coderat" className="h-12 w-auto" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              The autonomous AI QA engineer. Coderat discovers flows, generates Playwright
              tests, heals broken selectors, and ships fixes as pull requests — automatically.
            </p>
            <div className="flex items-center gap-2 mt-6 text-xs font-bold text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              ALL SYSTEMS OPERATIONAL
            </div>
            <div className="flex items-center gap-4 mt-6">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">PRODUCT</h4>
            <ul className="space-y-3 text-white/50 text-[13px] font-bold">
              <li><Link to="/features" className="hover:text-white transition-colors">FEATURES</Link></li>
              <li><Link to="/integrations" className="hover:text-white transition-colors">INTEGRATIONS</Link></li>
              <li><Link to="/sandbox" className="hover:text-white transition-colors">SANDBOX</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">PRICING</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">DEVELOPERS</h4>
            <ul className="space-y-3 text-white/50 text-[13px] font-bold">
              <li><Link to="/docs" className="hover:text-white transition-colors">DOCS</Link></li>
              <li><Link to="/integrations" className="hover:text-white transition-colors">VS CODE</Link></li>
              <li><Link to="/integrations" className="hover:text-white transition-colors">CLI &amp; SKILLS</Link></li>
              <li><Link to="/sandbox" className="hover:text-white transition-colors">PLAYGROUND</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">COMPANY</h4>
            <ul className="space-y-3 text-white/50 text-[13px] font-bold">
              <li><a href="#" className="hover:text-white transition-colors">ABOUT</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BLOG</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CAREERS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CONTACT</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">LEGAL</h4>
            <ul className="space-y-3 text-white/50 text-[13px] font-bold">
              <li><Link to="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">TERMS OF SERVICE</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-[12px] font-bold tracking-wide">
          <div className="flex gap-6 mb-4 md:mb-0">
            <Link to="/terms" className="hover:text-white transition-colors">TERMS</Link>
            <a href="#" className="hover:text-white transition-colors">SECURITY &amp; COMPLIANCE</a>
            <Link to="/privacy" className="hover:text-white transition-colors">PRIVACY</Link>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" /> © 2026 • Coderat Inc.
          </div>
        </div>
      </div>
    </footer>
  );
};
