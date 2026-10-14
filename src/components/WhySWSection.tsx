'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Layers, Users, Briefcase, Rocket, Award } from 'lucide-react';
import { SiteContent } from '@/lib/types';

export const WhySWSection: React.FC<{ content?: SiteContent }> = ({ content }) => {
  const defaultReasons = [
    {
      num: '01',
      title: 'PRACTICAL LEARNING',
      tagline: 'Real projects. Live studio skills.',
      description:
        'Ditch abstract theory. You work on live architectural blueprints, fabric draping, client briefs, and real construction materials from week one.',
      color: '#F20D63',
    },
    {
      num: '02',
      title: 'INDUSTRY EXPOSURE',
      tagline: 'Learn beyond the classroom.',
      description:
        'Site visits to luxury interior spaces, fashion runway shows, textile mill walkthroughs, and commercial photography studios.',
      color: '#1749C6',
    },
    {
      num: '03',
      title: 'EXPERT MENTORSHIP',
      tagline: 'Guidance from active professionals.',
      description:
        'Our faculty members are practicing interior architects, celebrity fashion stylists, and digital marketing agency strategists.',
      color: '#FFB800',
    },
    {
      num: '04',
      title: 'ENTREPRENEURSHIP MINDSET',
      tagline: 'Launch your own studio or brand.',
      description:
        'We don’t just train employees; we train founders. Learn pricing, client contract drafting, personal branding, and studio setup.',
      color: '#F20D63',
    },
    {
      num: '05',
      title: 'CAREER & PLACEMENT SUPPORT',
      tagline: 'Internships and professional portfolio.',
      description:
        'Graduate with an Awwwards-worthy physical and digital portfolio. Direct internship placements with top design firms in CG and nationwide.',
      color: '#1749C6',
    },
  ];

  const reasonIcons = [Layers, Briefcase, Users, Rocket, Award];
  const reasons = (content?.whySWReasons && content.whySWReasons.length > 0) ? content.whySWReasons : defaultReasons;

  return (
    <section id="whysw" className="relative py-24 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-300 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{content?.whySWTitle || 'THE SW ADVANTAGE'}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95]">
              {content?.whySWHeadline || 'WHY CHOOSE'}{' '}
              {content?.whySWHighlightWord ? (
                <span className="text-[#1749C6]">{content.whySWHighlightWord}</span>
              ) : (
                <span className="text-[#1749C6]">SW INSTITUTE?</span>
              )}
            </h2>
          </div>
          <p className="text-sm text-neutral-600 max-w-md font-medium">
            {content?.whySWSubtitle || 'Designed for ambitious creators who demand more than a traditional degree. We combine artistry, technology, and business acumen.'}
          </p>
        </div>

        {/* Horizontal Scrolling / Dynamic Card Layout */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-400">
          {reasons.map((reason, idx) => {
            const Icon = reasonIcons[idx % reasonIcons.length] || Layers;
            return (
              <motion.div
                key={reason.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="snap-center shrink-0 w-[300px] sm:w-[360px] p-8 rounded-3xl bg-white border-2 border-neutral-200 hover:border-[#0B0B0D] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="text-xs font-mono font-black px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: reason.color }}
                    >
                      REASON {reason.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#0B0B0D] group-hover:bg-[#0B0B0D] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-[#F20D63] transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-xs font-bold text-[#1749C6] uppercase tracking-wider mt-1">
                    {reason.tagline}
                  </p>

                  <p className="text-xs text-neutral-600 leading-relaxed mt-4 font-medium">
                    {reason.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-black uppercase text-neutral-400 group-hover:text-[#0B0B0D]">
                  <span>DISCOVER MORE</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2 text-[#F20D63]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
