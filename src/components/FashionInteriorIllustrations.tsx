'use client';

import React from 'react';
import { motion } from 'framer-motion';

// FASHION: Haute Couture Mannequin with Tape Measure
export const FashionMannequinIllustration: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#F20D63',
}) => (
  <motion.svg
    animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    className={`pointer-events-none ${className}`}
    viewBox="0 0 200 400"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
  >
    {/* Head & Neck */}
    <ellipse cx="100" cy="40" rx="14" ry="18" />
    <line x1="100" y1="58" x2="100" y2="78" />
    {/* Neck Base */}
    <path d="M85 78 L115 78" />
    {/* Shoulders & Torso Form */}
    <path d="M60 95 C60 95 80 90 100 90 C120 90 140 95 140 95 L128 175 C120 190 115 200 115 220 L125 290 L75 290 L85 220 C85 200 80 190 72 175 Z" />
    {/* Corset & Seam Guidelines */}
    <path d="M100 90 L100 290" strokeDasharray="3 3" />
    <path d="M72 135 C85 140 115 140 128 135" />
    <path d="M78 175 C90 180 110 180 122 175" />
    {/* Tape Measure Wrapping */}
    <path d="M65 125 C80 135 120 135 135 120 C145 110 130 145 110 160" stroke="#FFB800" strokeWidth="2" />
    {/* Tripod Base */}
    <line x1="100" y1="290" x2="100" y2="360" strokeWidth="2.5" />
    <path d="M100 360 L60 395" strokeWidth="2" />
    <path d="M100 360 L140 395" strokeWidth="2" />
    <path d="M100 360 L100 398" strokeWidth="2" />
  </motion.svg>
);

// FASHION: Tailor Scissors & Thread Spool
export const SewingTailorIllustration: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#F20D63',
}) => (
  <motion.svg
    animate={{ rotate: [-5, 5, -5] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    className={`pointer-events-none ${className}`}
    viewBox="0 0 200 200"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
  >
    {/* Tailor Scissors */}
    <circle cx="50" cy="150" r="18" />
    <circle cx="85" cy="165" r="15" />
    <line x1="62" y1="137" x2="140" y2="40" strokeWidth="2" />
    <line x1="93" y1="152" x2="155" y2="60" strokeWidth="2" />
    <circle cx="110" cy="98" r="3" fill={color} />
    {/* Thread Spool */}
    <rect x="130" y="120" width="40" height="50" rx="4" />
    <line x1="125" y1="120" x2="175" y2="120" strokeWidth="3" />
    <line x1="125" y1="170" x2="175" y2="170" strokeWidth="3" />
    <line x1="135" y1="130" x2="165" y2="130" strokeDasharray="2 2" />
    <line x1="135" y1="140" x2="165" y2="140" strokeDasharray="2 2" />
    <line x1="135" y1="150" x2="165" y2="150" strokeDasharray="2 2" />
    <line x1="135" y1="160" x2="165" y2="160" strokeDasharray="2 2" />
  </motion.svg>
);

// INTERIOR: Architectural Floor Plan Blueprint
export const FloorPlanBlueprintIllustration: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#1749C6',
}) => (
  <motion.svg
    animate={{ scale: [1, 1.04, 1], rotate: [0, 1.5, 0] }}
    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    className={`pointer-events-none ${className}`}
    viewBox="0 0 300 300"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
  >
    {/* Outer Wall Boundary */}
    <rect x="20" y="20" width="260" height="260" strokeWidth="3" />
    {/* Interior Room Partition Walls */}
    <line x1="120" y1="20" x2="120" y2="160" strokeWidth="2" />
    <line x1="120" y1="160" x2="280" y2="160" strokeWidth="2" />
    <line x1="20" y1="180" x2="120" y2="180" strokeWidth="2" />
    <line x1="200" y1="160" x2="200" y2="280" strokeWidth="2" />
    {/* Door Swing Arc */}
    <path d="M120 70 A 40 40 0 0 1 160 110" strokeDasharray="3 3" />
    <line x1="120" y1="70" x2="120" y2="110" />
    {/* Window Dimensions & Furniture Outlines */}
    <rect x="140" y="40" width="60" height="30" rx="3" strokeDasharray="2 2" />
    <circle cx="65" cy="80" r="25" strokeDasharray="2 2" />
    <rect x="40" y="210" width="60" height="40" rx="4" />
    <text x="30" y="15" fill={color} fontSize="8" fontFamily="monospace" stroke="none">
      LIVING ROOM // 24&apos; x 18&apos;
    </text>
    <text x="130" y="15" fill={color} fontSize="8" fontFamily="monospace" stroke="none">
      MASTER SUITE // 16&apos; x 14&apos;
    </text>
  </motion.svg>
);

// INTERIOR: Designer Lounge Chair & Pendant Light Wireframe
export const InteriorFurnitureIllustration: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#1749C6',
}) => (
  <motion.svg
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
    className={`pointer-events-none ${className}`}
    viewBox="0 0 200 250"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
  >
    {/* Pendant Light Fixture */}
    <line x1="100" y1="0" x2="100" y2="40" strokeWidth="2" />
    <path d="M70 65 C70 40 130 40 130 65 Z" fill="none" strokeWidth="2" />
    <ellipse cx="100" cy="65" rx="30" ry="8" />
    <circle cx="100" cy="72" r="5" fill="#FFB800" stroke="none" />
    {/* Designer Modern Chair */}
    <path d="M50 140 C50 100 150 100 150 140 C150 160 140 180 130 185 L70 185 C60 180 50 160 50 140 Z" strokeWidth="2" />
    <path d="M40 145 C40 145 50 180 70 190 L130 190 C150 180 160 145 160 145" />
    {/* Chair Legs */}
    <line x1="65" y1="190" x2="50" y2="240" strokeWidth="2" />
    <line x1="135" y1="190" x2="150" y2="240" strokeWidth="2" />
    <line x1="85" y1="190" x2="80" y2="235" strokeWidth="1.5" />
    <line x1="115" y1="190" x2="120" y2="235" strokeWidth="1.5" />
  </motion.svg>
);
