'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionDividerProps {
  label?: string;
  variant?: 'line' | 'brush' | 'badge';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  label = 'SOUTH WEST INSTITUTE OF DESIGN & INNOVATION',
}) => {
  return (
    <div className="relative w-full py-8 bg-[#F8F7F3] flex items-center justify-center overflow-hidden select-none">
      {/* Background Thin Architectural Line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#0B0B0D]/15" />

      {/* Center Gradient Flare */}
      <div className="absolute inset-x-1/4 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#F20D63]/40 to-transparent" />

      {/* Center Studio Emblem Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative z-10 px-5 py-1.5 rounded-full bg-[#F8F7F3] border border-[#0B0B0D]/20 shadow-sm flex items-center gap-3 text-[10px] font-mono font-bold tracking-widest text-[#0B0B0D] uppercase"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F20D63] animate-pulse" />
        <span>{label}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#1749C6]" />
      </motion.div>
    </div>
  );
};
