'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUpRight, X, User, Tag } from 'lucide-react';
import { GalleryItem } from '@/lib/types';

interface MadeAtSWGalleryProps {
  galleryItems: GalleryItem[];
}

export const MadeAtSWGallery: React.FC<MadeAtSWGalleryProps> = ({ galleryItems }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Fashion', 'Interior', 'Sketches', 'Workshops', 'Events'];

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="relative py-24 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      {/* Animated Background Vector Illustration: Camera Viewfinder Corner Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <motion.svg
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-10 w-96 h-96 text-[#F20D63]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {/* Viewfinder Corners */}
          <path d="M20 50 L20 20 L50 20" />
          <path d="M150 20 L180 20 L180 50" />
          <path d="M180 150 L180 180 L150 180" />
          <path d="M50 180 L20 180 L20 150" />
          {/* Focus Ring Circles */}
          <circle cx="100" cy="100" r="40" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="4" fill="currentColor" />
          {/* Rule of Thirds Lines */}
          <line x1="70" y1="20" x2="70" y2="180" strokeDasharray="2 4" opacity="0.5" />
          <line x1="130" y1="20" x2="130" y2="180" strokeDasharray="2 4" opacity="0.5" />
        </motion.svg>

        {/* Floating Sketch Canvas Palette SVG */}
        <motion.svg
          animate={{
            y: [0, -15, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-10 w-80 h-80 text-[#1749C6]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M100 20 C140 20 180 60 170 110 C160 160 120 180 80 170 C40 160 20 120 30 70 C40 30 70 20 100 20 Z" />
          <circle cx="60" cy="70" r="8" fill="#F20D63" opacity="0.6" />
          <circle cx="90" cy="50" r="8" fill="#FFB800" opacity="0.6" />
          <circle cx="130" cy="65" r="8" fill="#1749C6" opacity="0.6" />
          <circle cx="145" cy="105" r="8" fill="#0B0B0D" opacity="0.6" />
        </motion.svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#0B0B0D]/15 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-3 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>STUDENT SHOWCASE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-[#0B0B0D]">
              MADE AT <span className="text-[#F20D63]">SW INSTITUTE</span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#0B0B0D] text-white shadow-lg shadow-black/20'
                    : 'bg-white text-neutral-600 border border-neutral-300 hover:border-neutral-500 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightboxItem(item)}
              className="group relative cursor-pointer rounded-3xl overflow-hidden bg-white border-2 border-neutral-200 hover:border-[#0B0B0D] shadow-xl transition-all duration-500"
            >
              <div
                className={`w-full overflow-hidden ${
                  item.aspectRatio === 'tall'
                    ? 'h-[460px]'
                    : item.aspectRatio === 'wide'
                    ? 'h-[300px]'
                    : 'h-[380px]'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 via-black/20 to-transparent p-6 flex flex-col justify-between">
                  <div className="self-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#0B0B0D] text-[10px] font-mono tracking-widest uppercase font-bold shadow-md">
                      <Tag className="w-3 h-3 text-[#F20D63]" />
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-xs text-neutral-200 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#FFB800]" />
                        {item.studentName || 'SW Student'}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[#F20D63] font-bold">
                        <span>VIEW PROJECT</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white text-[#0B0B0D] rounded-3xl overflow-hidden border-2 border-neutral-200 shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#F20D63] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-2/3 h-80 md:h-[520px] overflow-hidden bg-neutral-900">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F20D63] text-white text-xs font-mono font-bold uppercase mb-4">
                    {lightboxItem.category} PORTFOLIO
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-[#0B0B0D]">
                    {lightboxItem.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed font-medium">
                    Created during the SW Institute practical studio module. Includes initial sketch ideation, material sourcing, and portfolio photography.
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-200 space-y-3 text-xs text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-mono">STUDENT CREATOR</span>
                    <span className="font-bold text-[#0B0B0D]">{lightboxItem.studentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-mono">ACADEMIC YEAR</span>
                    <span className="font-mono text-[#F20D63] font-bold">{lightboxItem.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-mono">INSTITUTE</span>
                    <span className="font-bold text-[#0B0B0D]">SW Institute Bhilai</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
