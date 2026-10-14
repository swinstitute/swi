'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, BookOpen, Palette, Cpu, Rocket, Trophy } from 'lucide-react';

import { SiteContent } from '@/lib/types';

export const ExperienceTimeline: React.FC<{ content?: SiteContent }> = ({ content }) => {
  const [activeStep, setActiveStep] = useState(0);

  const defaultSteps = [
    {
      stage: '01. DISCOVER',
      title: 'CREATIVE ORIENTATION',
      subtitle: 'Unlocking Design Thinking & Vision',
      description:
        'Begin your journey with immersive creative workshops. Explore color theory, moodboards, architectural fundamentals, and fashion silhouettes.',
      image: '/images/hero_fashion_model.jpg',
      color: '#F20D63',
    },
    {
      stage: '02. LEARN',
      title: 'FOUNDATIONAL MASTERY',
      subtitle: 'Technical Sketching & CAD Visualization',
      description:
        'Master the tools of the trade. Learn garment pattern drafting, 2D/3D interior CAD rendering, fabric science, and spatial lighting composition.',
      image: '/images/hero_interior_render.jpg',
      color: '#1749C6',
    },
    {
      stage: '03. CREATE',
      title: 'HANDS-ON STUDIO PRODUCTION',
      subtitle: 'Material Draping & 3D Spatial Models',
      description:
        'Step into our live design lab. Bring your concepts to life through garment stitching, upholstery selection, and prototype construction.',
      image: '/images/digital_marketing_laptop.jpg',
      color: '#FFB800',
    },
    {
      stage: '04. PRACTICE',
      title: 'LIVE SITE & INDUSTRY EXPOSURE',
      subtitle: 'Real Client Briefs & Photoshoots',
      description:
        'Work on active residential interior sites and direct fashion runway shoots. Get real feedback from industry leaders and client mentors.',
      image: '/images/hero_interior_render.jpg',
      color: '#F20D63',
    },
    {
      stage: '05. BUILD',
      title: 'DIGITAL MARKETING INTEGRATION',
      subtitle: 'Social Strategy & Personal Branding',
      description:
        'Learn social media content creation, Instagram marketing, targeted ad campaigns, and brand identity so your work reaches paying clients.',
      image: '/images/digital_marketing_laptop.jpg',
      color: '#1749C6',
    },
    {
      stage: '06. LAUNCH',
      title: 'GRADUATION & STUDIO LAUNCH',
      subtitle: 'Portfolio Showcase & Placement',
      description:
        'Showcase your final collection at the annual SW Institute Design Exhibition. Graduate ready to open your studio or join top design firms.',
      image: '/images/hero_fashion_model.jpg',
      color: '#FFB800',
    },
  ];

  const steps = (content?.experienceStages && content.experienceStages.length > 0)
    ? content.experienceStages
    : defaultSteps;

  const currentStep = steps[activeStep] || steps[0];

  return (
    <section id="experience" className="relative py-24 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-300 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{content?.experienceTitle || 'THE STUDENT JOURNEY'}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95]">
              {content?.experienceHeadline || 'THE'}{' '}
              {content?.experienceHighlightWord ? (
                <span className="text-[#F20D63]">{content.experienceHighlightWord}</span>
              ) : (
                <span className="text-[#F20D63]">SW EXPERIENCE</span>
              )}
            </h2>
          </div>
          <p className="text-sm text-neutral-600 max-w-md font-medium">
            {content?.experienceSubtitle || 'From your very first sketch to launching your brand online—experience a structured, 6-stage transformation.'}
          </p>
        </div>

        {/* Timeline Horizontal Stage Selector Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 mb-12 border-b border-neutral-200 snap-x">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.stage}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                className={`snap-center shrink-0 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0B0B0D] text-white shadow-xl scale-105'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: step.color }}
                />
                <span>{step.stage}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Editorial Feature View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <span
                  className="inline-block px-3.5 py-1 rounded-full text-white text-xs font-mono font-bold tracking-widest uppercase"
                  style={{ backgroundColor: currentStep.color }}
                >
                  STAGE {activeStep + 1} OF {steps.length}
                </span>
                <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none text-[#0B0B0D]">
                  {currentStep.title}
                </h3>
                <h4 className="text-sm font-bold text-[#1749C6] uppercase tracking-wider">
                  {currentStep.subtitle}
                </h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium pt-2">
                  {currentStep.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-6 relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.stage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={currentStep.image}
                  alt={currentStep.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent p-8 flex flex-col justify-end text-white">
                  <span className="text-xs font-mono text-[#FFB800] tracking-widest uppercase">
                    PRACTICAL MILESTONE
                  </span>
                  <h4 className="text-2xl font-black uppercase">{currentStep.title}</h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
