'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SiteContent } from '@/lib/types';
import { FashionMannequinIllustration, FloorPlanBlueprintIllustration } from './FashionInteriorIllustrations';

interface AboutSectionProps {
  content: SiteContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      id: '01',
      title: 'DESIGN THINKING',
      subtitle: 'Nurturing Originality & Creative Problem Solving',
      description:
        'We teach you how to conceptualize from raw inspiration to finished masterpiece. Develop your distinct creative voice through sketch ideation, material experimentation, and spatial aesthetics.',
      image: '/images/hero_fashion_model.jpg',
      badge: 'FASHION & CONCEPT',
      color: '#F20D63',
    },
    {
      id: '02',
      title: 'PRACTICAL LEARNING',
      subtitle: 'Real Projects, Live Studios & Industry Exposure',
      description:
        'Say goodbye to purely theoretical education. Work on real residential space planning, haute couture draping, site visits, materials workshops, and live photoshoots from day one.',
      image: '/images/hero_interior_render.jpg',
      badge: 'SPATIAL & LIVE SITES',
      color: '#1749C6',
    },
    {
      id: '03',
      title: 'DIGITAL EXCELLENCE',
      subtitle: 'Integrated Marketing & Personal Brand Building',
      description:
        'Great design deserves to be seen. Every student learns social media promotion, portfolio presentation, Instagram brand strategy, and client acquisition alongside core design skills.',
      image: '/images/digital_marketing_laptop.jpg',
      badge: 'BRANDING & MARKETING',
      color: '#FFB800',
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      {/* Explicit Fashion & Interior Background Vector Illustrations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {/* Haute Couture Fashion Mannequin Vector */}
        <FashionMannequinIllustration className="absolute -top-10 left-6 w-96 h-[32rem]" color="#F20D63" />

        {/* Architectural Floor Plan Blueprint Vector */}
        <FloorPlanBlueprintIllustration className="absolute -bottom-16 -right-16 w-[36rem] h-[36rem]" color="#1749C6" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#0B0B0D]/15 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-3 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{content.aboutTitle}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight max-w-3xl leading-[0.95] text-[#0B0B0D]">
              WE DON&apos;T JUST TEACH DESIGN.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F20D63] via-[#1749C6] to-[#0B0B0D]">
                WE SHAPE CREATORS.
              </span>
            </h2>
          </div>

          <div className="max-w-md text-neutral-700 text-sm leading-relaxed font-medium">
            <p>{content.aboutStory}</p>
          </div>
        </div>

        {/* Interactive Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Pillars List */}
          <div className="lg:col-span-6 space-y-4">
            {pillars.map((pillar, idx) => {
              const isActive = activeTab === idx;
              return (
                <motion.div
                  key={pillar.id}
                  onClick={() => setActiveTab(idx)}
                  onMouseEnter={() => setActiveTab(idx)}
                  data-cursor="VIEW"
                  className={`cursor-pointer p-6 sm:p-8 rounded-3xl transition-all duration-500 border ${
                    isActive
                      ? 'bg-white border-[#0B0B0D] shadow-2xl scale-[1.02]'
                      : 'bg-white/60 border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: pillar.color }}
                      >
                        {pillar.id}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-[#0B0B0D]">
                        {pillar.title}
                      </h3>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? 'rotate-0 text-[#F20D63]' : '-rotate-45 text-neutral-400'
                      }`}
                    />
                  </div>

                  <p className="text-xs font-bold text-[#1749C6] uppercase tracking-wider mb-2">
                    {pillar.subtitle}
                  </p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-3 pt-3 border-t border-neutral-200 font-medium"
                      >
                        {pillar.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Image Visual Switcher */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[520px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white group">
            <AnimatePresence mode="wait">
              <motion.div
                key={pillars[activeTab].id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={pillars[activeTab].image}
                  alt={pillars[activeTab].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 via-transparent to-transparent p-8 flex flex-col justify-end">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-[#0B0B0D] text-xs font-mono font-bold tracking-widest uppercase mb-2 self-start shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F20D63]" />
                    <span>{pillars[activeTab].badge}</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black uppercase text-white">
                    {pillars[activeTab].title}
                  </h4>
                  <p className="text-xs text-neutral-200 mt-1 max-w-lg">
                    {pillars[activeTab].subtitle}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
