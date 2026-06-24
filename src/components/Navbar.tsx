import React from 'react';
import { Link } from 'react-router-dom';
import brandLogo from './model_logos/App_assets/wordmark_D_white.svg';

export const Navbar = () => (
  <nav className="fixed top-0 inset-x-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5">
    <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <img src={brandLogo} alt="QA Copilot" className="h-12 w-auto" />
      </Link>
      <div className="hidden md:flex items-center gap-6 text-[13px] font-bold text-white tracking-wide">
        <Link to="/features" className="hover:text-indigo-300 transition-colors">FEATURES</Link>
        <Link to="/sandbox" className="hover:text-indigo-300 transition-colors">SANDBOX</Link>
        <Link to="/integrations" className="hover:text-indigo-300 transition-colors">INTEGRATIONS</Link>
        <a href="#" className="hover:text-indigo-300 transition-colors">DOCS</a>
        <a href="#" className="hover:text-indigo-300 transition-colors">PRICING</a>
      </div>
      <div className="flex items-center gap-4 text-[13px] font-bold tracking-wide">
        <Link to="/login" className="text-white hover:text-indigo-300 hidden md:block transition-colors">SIGN IN</Link>
        <Link to="/signup" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors">GET STARTED</Link>
      </div>
    </div>
  </nav>
);
