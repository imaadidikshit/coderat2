import React from 'react';

type Props = {
  particles?: boolean;
  className?: string;
};

/**
 * Ambient animated gradient-mesh background built entirely from CSS
 * (no external assets). Sits behind content at z-0; pointer-events none.
 */
export const GradientMesh: React.FC<Props> = ({ particles = true, className = '' }) => (
  <div className={`cr-mesh ${className}`} aria-hidden="true">
    <div className="cr-mesh-blob cr-mesh-blob--1" />
    <div className="cr-mesh-blob cr-mesh-blob--2" />
    <div className="cr-mesh-blob cr-mesh-blob--3" />
    {particles && <div className="cr-particles" />}
  </div>
);

export default GradientMesh;
