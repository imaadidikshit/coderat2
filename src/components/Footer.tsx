import React from 'react';
import { Link } from 'react-router-dom';
import brandLogo from './model_logos/App_assets/wordmark_D_white.svg';

export const Footer = () => {
    return (
        <footer className="bg-[#050505] pt-20 pb-10 px-6 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
                <div className="col-span-2">
                    <div className="flex items-center mb-6">
                        <img src={brandLogo} alt="QA Copilot" className="h-12 w-auto" />
                    </div>
                    <p className="text-white/40 text-sm">Autonomous QA testing software considered "not bad" by millions of developers.</p>
                </div>
                <div>
                    <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">PRODUCT</h4>
                    <ul className="space-y-3 text-white/50 text-[13px] font-bold">
                        <li><Link to="/features" className="hover:text-white transition-colors">FEATURES</Link></li>
                        <li><Link to="/integrations" className="hover:text-white transition-colors">INTEGRATIONS</Link></li>
                        <li><Link to="/sandbox" className="hover:text-white transition-colors">SANDBOX</Link></li>
                        <li><a href="#" className="hover:text-white transition-colors">PRICING</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">COMPANY</h4>
                    <ul className="space-y-3 text-white/50 text-[13px] font-bold">
                        <li><a href="#" className="hover:text-white transition-colors">ABOUT</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">BLOG</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">CAREERS</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">CONTACT US</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">LEGAL</h4>
                    <ul className="space-y-3 text-white/50 text-[13px] font-bold">
                        <li><Link to="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link></li>
                        <li><Link to="/terms" className="hover:text-white transition-colors">TERMS OF SERVICE</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold text-[13px] tracking-wide mb-4">GET HELP</h4>
                    <ul className="space-y-3 text-white/50 text-[13px] font-bold">
                        <li><a href="#" className="hover:text-white transition-colors">DOCS</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">HELP CENTER</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">COMMUNITY</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-[12px] font-bold tracking-wide">
                <div className="flex gap-6 mb-4 md:mb-0">
                    <Link to="/terms" className="hover:text-white transition-colors">TERMS</Link>
                    <a href="#" className="hover:text-white transition-colors">SECURITY & COMPLIANCE</a>
                    <Link to="/privacy" className="hover:text-white transition-colors">PRIVACY</Link>
                </div>
                <div>© 2026 • QA Copilot Inc.</div>
            </div>
        </footer>
    )
}
