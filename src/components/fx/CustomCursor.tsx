import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion, isCoarsePointer, lerp } from './motion';

/**
 * Ambient custom cursor: a 6px dot that tracks the pointer exactly and a
 * follower ring that lags behind via lerp. Hidden on touch devices and when
 * the user prefers reduced motion. Purely visual — does not capture events.
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, .cr-magnetic, .cr-tilt')) {
        ring.classList.add('cr-cursor-hover');
      } else {
        ring.classList.remove('cr-cursor-hover');
      }
    };

    const render = () => {
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cr-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cr-cursor-ring" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
