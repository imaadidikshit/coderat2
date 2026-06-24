import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TiltCard } from '../fx';

type Props = {
  icon: React.ReactNode;
  title: string;
  summary: string;
  /** Rich content revealed when the user clicks "Learn more". */
  details: React.ReactNode;
  accent?: string; // e.g. 'indigo' | 'emerald'
  className?: string;
};

const ACCENTS: Record<string, { text: string; ring: string; glow: string }> = {
  indigo: { text: 'text-indigo-300', ring: 'border-indigo-500/30', glow: 'shadow-[0_0_40px_rgba(99,102,241,0.12)]' },
  emerald: { text: 'text-emerald-300', ring: 'border-emerald-500/30', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]' },
  pink: { text: 'text-pink-300', ring: 'border-pink-500/30', glow: 'shadow-[0_0_40px_rgba(236,72,153,0.12)]' },
  cyan: { text: 'text-cyan-300', ring: 'border-cyan-500/30', glow: 'shadow-[0_0_40px_rgba(34,211,238,0.12)]' },
  amber: { text: 'text-amber-300', ring: 'border-amber-500/30', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.12)]' },
};

/**
 * A feature/integration card the user can expand to "learn more". The summary
 * stays compact; clicking reveals rich detail with a smooth grid animation.
 * Purely presentational — local UI state only.
 */
export const ExpandableCard: React.FC<Props> = ({
  icon,
  title,
  summary,
  details,
  accent = 'indigo',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const a = ACCENTS[accent] || ACCENTS.indigo;

  return (
    <TiltCard
      max={open ? 0 : 8}
      className={`h-full bg-[#111111] border ${open ? a.ring : 'border-white/10'} ${open ? a.glow : ''} rounded-3xl p-7 flex flex-col transition-colors duration-300 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Show less' : 'Learn more'}
          className={`shrink-0 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all ${open ? 'rotate-90' : ''}`}
        >
          {open ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed flex-1">{summary}</p>

      <div
        className="grid transition-all duration-400 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pt-5 mt-5 border-t border-white/10 text-sm text-white/60 leading-relaxed space-y-3">
            {details}
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${a.text} hover:opacity-80 transition-opacity self-start`}
      >
        {open ? 'Show less' : 'Learn more'}
      </button>
    </TiltCard>
  );
};

export default ExpandableCard;
