'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Briefcase, RefreshCw, Heart, CheckCircle2 } from 'lucide-react';

import { SiteContent } from '@/lib/types';

export const WhoCanApplySection: React.FC<{ content?: SiteContent }> = ({ content }) => {
  const defaultCategories = [
    { title: 'School Passouts', desc: '10th or 12th completed students ready for a creative career.' },
    { title: 'Career Switchers', desc: 'Professionals moving into fashion or interior design.' },
    { title: 'Working Professionals', desc: 'Upskilling in digital marketing and space visualization.' },
    { title: 'Creative Enthusiasts', desc: 'Homemakers and entrepreneurs launching their studio.' },
  ];

  const catIcons = [GraduationCap, RefreshCw, Briefcase, Heart];
  const categories = (content?.eligibilityCategories && content.eligibilityCategories.length > 0)
    ? content.eligibilityCategories
    : defaultCategories;

  const defaultHighlights = [
    'No Prior Portfolio Required',
    'Flexible Morning & Afternoon Batches',
    'Free Personal Brand Counseling',
  ];

  const highlights = (content?.eligibilityHighlights && content.eligibilityHighlights.length > 0)
    ? content.eligibilityHighlights
    : defaultHighlights;

  const highlightColors = ['#F20D63', '#FFB800', '#1749C6'];

  return (
    <section className="relative py-20 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      {/* Background Decorative Graphic */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#F20D63]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        <div className="bg-white border-2 border-neutral-200 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-3 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{content?.eligibilityTitle || 'STUDIO ELIGIBILITY & ENROLMENT'}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none text-[#0B0B0D]">
              {content?.eligibilityHeadline || 'WHO CAN'}{' '}
              {content?.eligibilityHighlightWord ? (
                <span className="text-[#F20D63]">{content.eligibilityHighlightWord}</span>
              ) : (
                <span className="text-[#F20D63]">ENQUIRE & JOIN?</span>
              )}
            </h2>
            <div className="mt-4 inline-block px-6 py-2.5 rounded-full bg-[#0B0B0D] text-white font-black text-xs uppercase tracking-widest shadow-lg">
              {content?.eligibilityBadge || 'ANYONE WHO HAS PASSED 10TH OR 12TH — NO MATTER YOUR AGE!'}
            </div>
          </div>

          {/* 4 Demographics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = catIcons[idx % catIcons.length] || GraduationCap;
              return (
                <motion.div
                  key={cat.title + idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-[#F8F7F3] border border-neutral-200 hover:border-[#F20D63] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F20D63]/10 text-[#F20D63] flex items-center justify-center mb-4 group-hover:bg-[#F20D63] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-[#0B0B0D] mb-1">{cat.title}</h3>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-neutral-700">
            {highlights.map((h, i) => (
              <div key={h + i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: highlightColors[i % highlightColors.length] }} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
