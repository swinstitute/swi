'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles, Compass, ShieldCheck, Flame, Star } from 'lucide-react';
import { SiteContent } from '@/lib/types';

interface HeroProps {
  content: SiteContent;
  onOpenEnquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onOpenEnquiry }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 120]);
  const opacityFade = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 35;
      const y = (e.clientY / innerHeight - 0.5) * 35;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingTags = [
    { label: content.heroTag1 || '★ DIGITAL MARKETING INCLUDED', color: '#FFB800', textColor: '#0B0B0D', pos: '-top-6 -right-4 sm:-right-8' },
    { label: content.heroTag2 || 'FASHION & STYLING LAB', color: '#F20D63', textColor: '#FFFFFF', pos: 'bottom-12 -left-6 sm:-left-12' },
    { label: content.heroTag3 || '3D SPATIAL VISUALIZATION', color: '#1749C6', textColor: '#FFFFFF', pos: 'top-1/3 -right-6 sm:-right-12' },
  ];

  return (
    <section className="relative min-h-screen bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden pt-20 sm:pt-28 pb-24 sm:pb-16 px-6 sm:px-8 md:px-10 lg:px-12 flex flex-col justify-between selection:bg-[#F20D63] selection:text-white">
      {/* Dynamic Animated Background Gradients & Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Architectural Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B0B0D_1px,transparent_1px)] [background-size:36px_36px] opacity-10" />

        {/* Ambient Floating Pink Light Gradient Orb */}
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-[32rem] h-[32rem] bg-[#F20D63]/12 blur-[130px] rounded-full"
        />

        {/* Ambient Floating Electric Blue Orb */}
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-20 w-[36rem] h-[36rem] bg-[#1749C6]/12 blur-[140px] rounded-full"
        />

        {/* Subtle Accent Yellow Glow */}
        <motion.div
          animate={{
            x: [0, 30, -40, 0],
            y: [0, 30, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/3 w-[26rem] h-[26rem] bg-[#FFB800]/15 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left Column: Editorial Headline & Copy */}
        <motion.div
          style={{ y: yParallax, opacity: opacityFade }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          {/* Top Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-[#0B0B0D] text-xs font-mono font-bold tracking-widest uppercase mb-6 self-start border border-[#0B0B0D]/15 shadow-lg shadow-black/5"
          >
            <span className="w-2 h-2 rounded-full bg-[#F20D63] animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-[#F20D63]" />
            <span>{content.announcement}</span>
          </motion.div>

          {/* Main Huge Magazine Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-black tracking-tighter uppercase leading-[0.86] text-5xl sm:text-7xl md:text-8xl xl:text-[5.8rem]"
          >
            {content.heroHeading ? (
              <span className="block text-[#0B0B0D] leading-tight">
                {content.heroHighlightWord && content.heroHeading.includes(content.heroHighlightWord) ? (
                  <>
                    <span>{content.heroHeading.split(content.heroHighlightWord)[0]}</span>
                    <div className="relative inline-block my-1.5 mx-1">
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="absolute left-0 bottom-1 top-2 bg-[#F20D63] -rotate-1 rounded-sm transform -z-10 shadow-md"
                      />
                      <span className="text-white px-2">{content.heroHighlightWord}</span>
                    </div>
                    <span>{content.heroHeading.split(content.heroHighlightWord)[1]}</span>
                  </>
                ) : (
                  content.heroHeading
                )}
              </span>
            ) : (
              <>
                <span className="block text-[#0B0B0D]">DESIGN</span>
                <div className="relative inline-block my-1.5">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute left-0 bottom-1 top-2 bg-[#F20D63] -rotate-1 rounded-sm transform -z-10 shadow-md"
                  />
                  <span className="text-white px-2">YOUR FUTURE.</span>
                </div>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0B0B0D] via-[#1749C6] to-[#0B0B0D]">
                  BUILD YOUR BRAND.
                </span>
              </>
            )}
          </motion.div>

          {/* Institute Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 space-y-2"
          >
            <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0D] tracking-wide uppercase flex items-center gap-2">
              <span>{content.heroSubheading}</span>
              <span className="w-2 h-2 rounded-full bg-[#1749C6]" />
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 max-w-xl font-medium leading-relaxed">
              {content.tagline || 'Fashion Designing • Interior Designing • Digital Marketing Included in All Programs.'}
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#programs"
              data-cursor="EXPLORE"
              className="group relative flex items-center gap-3 px-8 py-4 rounded-full bg-[#0B0B0D] text-white font-black text-xs uppercase tracking-widest hover:bg-[#F20D63] transition-all duration-300 shadow-xl shadow-black/15 hover:shadow-pink-500/25 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">{content.heroCtaExplore || 'EXPLORE PROGRAMS'}</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <button
              onClick={onOpenEnquiry}
              data-cursor="ENQUIRE"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0B0B0D] border-2 border-[#0B0B0D] font-black text-xs uppercase tracking-widest hover:bg-[#1749C6] hover:text-white hover:border-[#1749C6] transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
            >
              <span>{content.heroCtaEnquire || 'ENQUIRE NOW'}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>

          {/* Quick Value Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 pt-6 border-t border-neutral-300 flex flex-wrap items-center gap-6 text-xs font-bold text-neutral-800"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F20D63]" />
              <span>{content.stat1Val || '100%'} {content.stat1Label || 'Practical Exposure'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FFB800]" />
              <span>Digital Marketing {content.stat2Val || 'Included'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1749C6]" />
              <span>Bhilai Campus</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Layered Editorial Image Composition with Parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 relative h-[500px] sm:h-[600px] w-full flex items-center justify-center"
        >
          {/* Layer 1: Interior Architecture Card */}
          <motion.div
            animate={{
              x: mousePos.x * -0.5,
              y: mousePos.y * -0.5,
              rotate: -4,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="absolute left-0 top-4 w-[72%] h-[76%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group"
          >
            <img
              src={content.heroImage1 || '/images/hero_interior_render.jpg'}
              alt="Interior Architectural Design Studio SW"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/85 via-transparent to-transparent p-5 flex flex-col justify-end text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#FFB800] uppercase">
                INTERIOR ARCHITECTURE
              </span>
              <span className="text-lg font-bold">3D Visualization & Space Planning</span>
            </div>
          </motion.div>

          {/* Layer 2: Main Fashion Model Card */}
          <motion.div
            animate={{
              x: mousePos.x * 0.7,
              y: mousePos.y * 0.7,
              rotate: 3,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="absolute right-0 bottom-4 w-[76%] h-[84%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group z-20"
          >
            <img
              src={content.heroImage2 || '/images/hero_fashion_model.jpg'}
              alt="Fashion Designing Studio SW"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#F20D63] uppercase">
                HAUTE COUTURE FASHION
              </span>
              <span className="text-xl font-black">Garment Construction & Styling</span>
            </div>
          </motion.div>

          {/* Floating Badges */}
          {floatingTags.map((tag, idx) => (
            <motion.div
              key={tag.label}
              animate={{
                x: mousePos.x * (1 + idx * 0.2),
                y: [mousePos.y * (1 + idx * 0.2) - 4, mousePos.y * (1 + idx * 0.2) + 4, mousePos.y * (1 + idx * 0.2) - 4],
              }}
              transition={{
                x: { type: 'spring', stiffness: 140, damping: 18 },
                y: { duration: 3 + idx, repeat: Infinity, ease: 'easeInOut' },
              }}
              className={`absolute ${tag.pos} z-30 px-5 py-2.5 rounded-full shadow-2xl border-2 border-[#0B0B0D] font-black text-[11px] uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform`}
              style={{ backgroundColor: tag.color, color: tag.textColor }}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{tag.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Ticker Line Stream Banner */}
      <div className="relative z-10 mt-12 py-3 border-y border-[#0B0B0D]/10 bg-white/60 backdrop-blur-md overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="inline-flex items-center gap-8 text-xs font-mono font-bold tracking-widest text-[#0B0B0D] uppercase"
        >
          <span>FASHION DESIGNING</span>
          <span className="text-[#F20D63]">★</span>
          <span>INTERIOR DESIGNING</span>
          <span className="text-[#1749C6]">★</span>
          <span>DIGITAL MARKETING INCLUDED</span>
          <span className="text-[#FFB800]">★</span>
          <span>ADMISSIONS OPEN 2026</span>
          <span className="text-[#F20D63]">★</span>
          <span>SOUTH WEST INSTITUTE OF DESIGN & INNOVATION</span>
          <span className="text-[#1749C6]">★</span>
          {/* Repeated for continuous loop */}
          <span>FASHION DESIGNING</span>
          <span className="text-[#F20D63]">★</span>
          <span>INTERIOR DESIGNING</span>
          <span className="text-[#1749C6]">★</span>
          <span>DIGITAL MARKETING INCLUDED</span>
          <span className="text-[#FFB800]">★</span>
          <span>ADMISSIONS OPEN 2026</span>
          <span className="text-[#F20D63]">★</span>
          <span>SOUTH WEST INSTITUTE OF DESIGN & INNOVATION</span>
          <span className="text-[#1749C6]">★</span>
        </motion.div>
      </div>
    </section>
  );
};
