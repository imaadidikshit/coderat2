import React, { useRef } from 'react';
import { prefersReducedMotion, isCoarsePointer, lerp } from './motion';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  glow?: boolean;
};

/**
 * 3D tilt-on-hover card driven by mouse position with a smooth lerp settle.
 * Adds an optional cursor-following glow. Additive: wraps content only.
 */
export const TiltCard: React.FC<Props> = ({
  children,
  className = '',
  max = 10,
  glow = true,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);
  const target = useRef({ rx: 0, ry: 0 });
  const current = useRef({ rx: 0, ry: 0 });

  const animate = () => {
    const el = ref.current;
    if (!el) return;
    current.current.rx = lerp(current.current.rx, target.current.rx, 0.12);
    current.current.ry = lerp(current.current.ry, target.current.ry, 0.12);
    el.style.transform = `perspective(1000px) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg)`;
    frame.current = requestAnimationFrame(animate);
  };

  const handleEnter = () => {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    const el = ref.current;
    if (el) el.style.willChange = 'transform';
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(animate);
  };

  const handleMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    target.current.ry = (px - 0.5) * max * 2;
    target.current.rx = -(py - 0.5) * max * 2;
    if (glow) {
      el.style.setProperty('--cr-mx', `${px * 100}%`);
      el.style.setProperty('--cr-my', `${py * 100}%`);
    }
  };

  const handleLeave = () => {
    target.current.rx = 0;
    target.current.ry = 0;
    window.setTimeout(() => {
      cancelAnimationFrame(frame.current);
      const el = ref.current;
      if (el) {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        el.style.willChange = 'auto';
      }
    }, 500);
  };

  return (
    <div
      ref={ref}
      className={`cr-tilt ${className}`}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {glow && <span className="cr-tilt-glow" aria-hidden="true" />}
      {children}
    </div>
  );
};

export default TiltCard;
