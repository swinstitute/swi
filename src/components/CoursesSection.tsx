'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, CheckCircle2, Clock, GraduationCap, X, Send } from 'lucide-react';
import { Course } from '@/lib/types';
import { SewingTailorIllustration, InteriorFurnitureIllustration } from './FashionInteriorIllustrations';

interface CoursesSectionProps {
  courses: Course[];
  onOpenEnquiry: () => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onOpenEnquiry }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <section id="programs" className="relative py-24 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      {/* Explicit Fashion Tailor Scissors & Interior Designer Furniture Vector Illustrations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {/* Fashion Tailor Scissors & Thread Spool Vector */}
        <SewingTailorIllustration className="absolute top-10 -left-8 w-88 h-88" color="#F20D63" />

        {/* Interior Designer Furniture & Pendant Lighting Vector */}
        <InteriorFurnitureIllustration className="absolute bottom-10 -right-12 w-96 h-96" color="#1749C6" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-300 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-3 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>THE CREATIVE PATH</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-[#0B0B0D]">
              EXPLORE OUR <span className="text-[#F20D63]">DIPLOMA PROGRAMS</span>
            </h2>
          </div>
          <div className="max-w-md">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFB800] text-[#0B0B0D] text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
              ★ DIGITAL MARKETING INCLUDED IN ALL COURSES
            </span>
            <p className="text-neutral-600 text-xs sm:text-sm font-medium">
              Industry-aligned hands-on programs designed to take you from foundational sketching to full brand launch.
            </p>
          </div>
        </div>

        {/* Huge Interactive Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {courses.map((course) => {
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => setSelectedCourse(course)}
                className="group relative cursor-pointer rounded-3xl overflow-hidden bg-white border-2 border-neutral-200 hover:border-[#0B0B0D] shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image Showcase Container with 1.04x zoom hover */}
                <div className="relative h-[360px] sm:h-[440px] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-black/20 to-transparent p-6 sm:p-8 flex flex-col justify-between">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span
                        className="px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-md"
                        style={{ backgroundColor: course.accentColor }}
                      >
                        DIPLOMA • {course.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/90 text-[#0B0B0D] text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 shadow-md">
                        DIGITAL MARKETING INCLUDED
                      </span>
                    </div>

                    {/* Bottom Headline Over Image */}
                    <div>
                      <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none group-hover:translate-x-2 transition-transform duration-300">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 mt-2 font-medium">
                        {course.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body Footer Details */}
                <div className="p-6 sm:p-8 bg-white flex flex-col justify-between gap-6 group-hover:bg-[#0B0B0D] group-hover:text-white transition-colors duration-500">
                  <p className="text-xs sm:text-sm text-neutral-600 group-hover:text-neutral-300 leading-relaxed font-medium">
                    {course.description}
                  </p>

                  {/* Highlights checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                    {course.highlights.slice(0, 4).map((hl, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 transition-colors"
                          style={{ color: course.accentColor }}
                        />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA Bar */}
                  <div className="pt-4 border-t border-neutral-200 group-hover:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-mono font-bold">
                      <span className="flex items-center gap-1.5 text-neutral-500 group-hover:text-neutral-300">
                        <Clock className="w-3.5 h-3.5 text-[#F20D63]" />
                        {course.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider group-hover:text-[#F20D63]">
                      <span>VIEW FULL SYLLABUS</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center overflow-y-auto"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white text-[#0B0B0D] rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-200 my-auto"
            >
              {/* Header Cover */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-900">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/50 to-transparent p-6 sm:p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span
                      className="px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-md"
                      style={{ backgroundColor: selectedCourse.accentColor }}
                    >
                      {selectedCourse.category} DIPLOMA
                    </span>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#F20D63] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      {selectedCourse.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Syllabus Content Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-mono text-[#F20D63] uppercase tracking-widest mb-2 font-bold">
                    PROGRAM OVERVIEW
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    {selectedCourse.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 text-xs font-medium">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8F7F3] border border-neutral-200">
                    <Clock className="w-5 h-5 text-[#FFB800]" />
                    <div>
                      <span className="block font-bold text-[#0B0B0D] uppercase">DURATION</span>
                      <span className="text-neutral-600">{selectedCourse.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8F7F3] border border-neutral-200">
                    <GraduationCap className="w-5 h-5 text-[#1749C6]" />
                    <div>
                      <span className="block font-bold text-[#0B0B0D] uppercase">ELIGIBILITY</span>
                      <span className="text-neutral-600">{selectedCourse.eligibility}</span>
                    </div>
                  </div>
                </div>

                {/* Full Modules Highlights */}
                <div>
                  <h4 className="text-xs font-mono text-[#1749C6] uppercase tracking-widest mb-4 font-bold">
                    CURRICULUM HIGHLIGHTS & PRACTICAL MODULES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCourse.highlights.map((hl, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8F7F3] border border-neutral-200"
                      >
                        <CheckCircle2
                          className="w-4 h-4 mt-0.5 shrink-0 text-[#F20D63]"
                        />
                        <span className="text-xs text-neutral-800 font-semibold">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="p-6 bg-[#F8F7F3] border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold text-[#0B0B0D] uppercase">
                    ★ DIGITAL MARKETING INCLUDED
                  </span>
                  <span className="text-[11px] text-neutral-600 font-medium">
                    Learn to brand, market, and monetize your designs.
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    onOpenEnquiry();
                  }}
                  className="px-8 py-3.5 rounded-full bg-[#F20D63] text-white font-black text-xs uppercase tracking-widest hover:bg-[#0B0B0D] transition-colors flex items-center gap-2 shadow-lg shadow-pink-500/25"
                >
                  <Send className="w-4 h-4" />
                  <span>ENQUIRE ABOUT THIS COURSE</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
