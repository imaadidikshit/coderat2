import React, { useRef } from 'react';
import { prefersReducedMotion, isCoarsePointer } from './motion';

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Max pixel shift toward the cursor. */
  strength?: number;
  as?: 'div' | 'span';
};

/**
 * Wraps children in a span that gently follows the cursor (max `strength`px).
 * Purely presentational — the wrapped element keeps all its own handlers.
 */
export const MagneticButton: React.FC<Props> = ({
  children,
  className = '',
  strength = 8,
  as = 'span',
}) => {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const max = strength;
    const x = Math.max(-max, Math.min(max, (relX / rect.width) * max * 2));
    const y = Math.max(-max, Math.min(max, (relY / rect.height) * max * 2));
    el.style.willChange = 'transform';
    el.style.transition = 'transform 0.15s ease-out';
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.4s cubic-bezier(0.19,1,0.22,1)';
    el.style.transform = 'translate(0px, 0px)';
    // remove will-change after the settle animation completes
    window.setTimeout(() => {
      if (el) el.style.willChange = 'auto';
    }, 420);
  };

  const Tag: any = as;
  return (
    <Tag
      ref={ref}
      className={`cr-magnetic ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </Tag>
  );
};

export default MagneticButton;
