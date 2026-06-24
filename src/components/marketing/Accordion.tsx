import React, { useState } from 'react';

/**
 * Interactive accordion using a CSS grid-rows trick for smooth height
 * animation (no JS measuring). Purely presentational.
 */
export const Accordion: React.FC<{
  items: { q: string; a: React.ReactNode }[];
  className?: string;
  defaultOpen?: number | null;
}> = ({ items, className = '', defaultOpen = 0 }) => {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className={`divide-y divide-white/10 border-y border-white/10 ${className}`}>
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left group"
            aria-expanded={open === i}
          >
            <span className="text-base md:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              {it.q}
            </span>
            <span
              className={`shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/60 transition-all duration-300 ${
                open === i ? 'rotate-45 bg-white/10 text-white' : ''
              }`}
            >
              +
            </span>
          </button>
          <div
            className="grid transition-all duration-300 ease-out"
            style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="text-white/55 leading-relaxed pb-6 pr-8 text-sm md:text-base">{it.a}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
