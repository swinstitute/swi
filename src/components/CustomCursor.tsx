'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getStoredContent } from '@/lib/cms-store';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'cta' | 'input'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorStyle, setCursorStyle] = useState<'radial' | 'normal'>('radial');

  useEffect(() => {
    const updateCursorConfig = () => {
      const content = getStoredContent();
      const style = content.cursorStyle || 'radial';
      setCursorStyle(style);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-cursor-style', style);
      }
    };

    updateCursorConfig();
    window.addEventListener('sw_cms_updated', updateCursorConfig);

    // Disable custom cursor on touch screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr) {
        setCursorText(cursorAttr);
        setCursorVariant('cta');
        return;
      }

      if (target.closest('input, textarea, select')) {
        setCursorText('');
        setCursorVariant('input');
      } else if (target.closest('a, button, [role="button"], .cursor-pointer')) {
        setCursorText('');
        setCursorVariant('hover');
      } else {
        setCursorText('');
        setCursorVariant('default');
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('sw_cms_updated', updateCursorConfig);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (cursorStyle === 'normal' || !isVisible) return null;

  const isHovered = cursorVariant !== 'default';
  const haloSize = cursorText ? 84 : isHovered ? 44 : 28;

  return (
    <>
      {/* 1. Precision Pointed Studio Arrowhead Tip */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99999]"
        animate={{
          x: position.x,
          y: position.y,
          scale: isMouseDown ? 0.8 : isHovered ? 1.25 : 1,
          rotate: isHovered ? -12 : 0,
        }}
        transition={{ type: 'spring', stiffness: 1200, damping: 45, mass: 0.08 }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="drop-shadow-lg">
          <defs>
            <linearGradient id="swPointedCursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F20D63" />
              <stop offset="50%" stopColor="#1749C6" />
              <stop offset="100%" stopColor="#FFB800" />
            </linearGradient>
          </defs>
          <path
            d="M3 3L11 23L15 15L23 11L3 3Z"
            fill="url(#swPointedCursorGradient)"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* 2. Smooth Trailing Halo Ring / Dynamic Label Badge */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99998] flex items-center justify-center"
        animate={{
          x: position.x - haloSize / 2,
          y: position.y - haloSize / 2,
          scale: isMouseDown ? 0.75 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.18 }}
      >
        <div
          style={{ width: `${haloSize}px`, height: `${haloSize}px` }}
          className={`rounded-full transition-all duration-200 flex items-center justify-center ${
            cursorText
              ? 'bg-[#F20D63] text-white shadow-2xl border border-white/40 backdrop-blur-md px-3 font-mono text-[10px] font-black tracking-widest'
              : cursorVariant === 'input'
              ? 'border-2 border-[#F20D63] bg-[#F20D63]/15 backdrop-blur-xs shadow-md'
              : cursorVariant === 'hover'
              ? 'border-2 border-[#1749C6] bg-[#1749C6]/20 backdrop-blur-xs shadow-md'
              : 'border border-[#F20D63]/40 bg-[#F20D63]/5 backdrop-blur-xs'
          }`}
        >
          {cursorText && <span className="uppercase text-center leading-none">{cursorText}</span>}
        </div>
      </motion.div>
    </>
  );
};
