import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import brandLogo from './model_logos/App_assets/wordmark_D_white.svg';
import { MagneticButton } from './fx';

const NAV_LINKS: { label: string; to: string; external?: boolean }[] = [
  { label: 'FEATURES', to: '/features' },
  { label: 'SANDBOX', to: '/sandbox' },
  { label: 'INTEGRATIONS', to: '/integrations' },
  { label: 'DOCS', to: '/docs' },
  { label: 'PRICING', to: '/pricing' },
];

export const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      data-animate="nav"
      className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? 'bg-[#0A0A0B]/90 backdrop-blur-2xl border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)]'
          : 'bg-[#0A0A0B]/60 backdrop-blur-xl border-white/5'
      }`}
    >
      <div
        className={`max-w-[1400px] mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        <Link to="/" className="flex items-center shrink-0" data-animate="logo">
          <img
            src={brandLogo}
            alt="Coderat"
            className={`w-auto transition-all duration-500 ${scrolled ? 'h-9' : 'h-12'}`}
          />
        </Link>

        <div className="hidden md:flex items-center gap-7 text-[13px] font-bold text-white tracking-wide">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              data-animate="nav-link"
              className="relative hover:text-indigo-300 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-emerald-400 hover:after:w-full after:transition-all after:duration-300"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[13px] font-bold tracking-wide">
          <Link to="/login" className="text-white hover:text-indigo-300 hidden md:block transition-colors">
            SIGN IN
          </Link>
          <MagneticButton>
            <Link
              to="/signup"
              className="inline-block bg-white text-black px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              GET STARTED
            </Link>
          </MagneticButton>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden text-white p-2 -mr-2"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu (new — previously nav links were simply hidden on mobile) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-white/5 ${
          open ? 'max-h-96 py-4' : 'max-h-0 py-0'
        }`}
      >
        <div className="px-6 flex flex-col gap-1 text-sm font-bold tracking-wide">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-3 text-white/80 hover:text-white border-b border-white/5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="py-3 text-white/80 hover:text-white transition-colors"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    </nav>
  );
};
