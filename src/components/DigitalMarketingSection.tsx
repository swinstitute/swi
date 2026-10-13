'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Share2, TrendingUp, Award, Rocket } from 'lucide-react';
import { SiteContent } from '@/lib/types';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const DigitalMarketingSection: React.FC<{ content?: SiteContent }> = () => {
  const tags = [
    { label: 'Instagram Growth', color: '#F20D63', textColor: '#FFFFFF', icon: InstagramIcon, pos: 'top-4 left-4 sm:-left-8' },
    { label: 'Facebook Ads', color: '#1749C6', textColor: '#FFFFFF', icon: FacebookIcon, pos: 'top-12 right-2 sm:-right-8' },
    { label: 'Personal Branding', color: '#FFB800', textColor: '#0B0B0D', icon: Award, pos: 'bottom-20 left-2 sm:-left-12' },
    { label: 'Social Media Strategy', color: '#0B0B0D', textColor: '#FFFFFF', icon: Share2, pos: 'bottom-8 right-4 sm:-right-10' },
    { label: 'Content Creation', color: '#F20D63', textColor: '#FFFFFF', icon: TrendingUp, pos: 'top-1/2 -left-6 sm:-left-16' },
    { label: 'Client Acquisition', color: '#1749C6', textColor: '#FFFFFF', icon: Rocket, pos: 'bottom-1/3 -right-6 sm:-right-14' },
  ];

  return (
    <section className="relative py-24 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      {/* Animated Background Vector Illustration: Social Megaphone & Growth Chart */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        {/* Animated Megaphone Vector SVG */}
        <motion.svg
          animate={{
            rotate: [-5, 5, -5],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-8 w-72 h-72 text-[#F20D63]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M40 90 L90 60 L160 30 L160 150 L90 120 L40 90 Z" />
          <path d="M40 90 L20 90 L20 120 L40 120 Z" />
          <path d="M70 120 L85 170 L110 170 L95 120 Z" />
          {/* Sound Waves */}
          <path d="M175 60 C190 75 190 105 175 120" strokeDasharray="4 4" />
          <path d="M185 45 C205 70 205 110 185 135" strokeDasharray="4 4" />
        </motion.svg>

        {/* Animated Social Analytics Growth Chart SVG */}
        <motion.svg
          animate={{
            y: [0, -12, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 right-8 w-80 h-80 text-[#1749C6]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {/* Axes */}
          <line x1="20" y1="180" x2="180" y2="180" />
          <line x1="20" y1="20" x2="20" y2="180" />
          {/* Bar Chart Bars */}
          <rect x="35" y="120" width="20" height="60" rx="3" fill="currentColor" opacity="0.3" />
          <rect x="65" y="90" width="20" height="90" rx="3" fill="currentColor" opacity="0.5" />
          <rect x="95" y="60" width="20" height="120" rx="3" fill="currentColor" opacity="0.7" />
          <rect x="125" y="30" width="20" height="150" rx="3" fill="currentColor" opacity="0.9" />
          {/* Exponential Growth Trend Line */}
          <path d="M35 130 Q95 80 150 20" stroke="#F20D63" strokeWidth="3" />
          <circle cx="150" cy="20" r="6" fill="#F20D63" />
        </motion.svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10 text-center">
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1749C6] text-white text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-xl shadow-blue-600/20"
        >
          <Sparkles className="w-4 h-4 text-[#FFB800]" />
          <span>EXCLUSIVE DIFFERENTIATOR • INCLUDED IN ALL DIPLOMAS</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.92] max-w-4xl mx-auto text-[#0B0B0D]"
        >
          DON&apos;T JUST DESIGN.{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F20D63] via-[#1749C6] to-[#0B0B0D]">
            LEARN TO MARKET IT.
          </span>
        </motion.h2>

        <p className="text-sm sm:text-base text-neutral-700 max-w-2xl mx-auto mt-6 font-medium leading-relaxed">
          Most design institutes stop at teaching creation. At SW Institute, we equip every student with full-stack digital marketing—so you can launch your label, attract premium clients, and build an online empire.
        </p>

        {/* Floating Tags Around Workspace Composition */}
        <div className="relative max-w-4xl mx-auto mt-16 px-6 sm:px-8 md:px-10 lg:px-12">
          <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white group">
            <img
              src="/images/digital_marketing_laptop.jpg"
              alt="Digital Marketing Workspace SW Institute"
              className="w-full h-[340px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 via-transparent to-transparent p-6 sm:p-10 flex flex-col justify-end text-left">
              <span className="text-xs font-mono text-[#FFB800] tracking-widest uppercase font-bold">
                DIGITAL PROMOTION & BRANDING STUDIO
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase text-white mt-1">
                Market Your Vision. Build Your Empire.
              </h3>
            </div>
          </div>

          {/* Floating Orbiting Skill Tags */}
          {tags.map((tag, idx) => {
            const Icon = tag.icon;
            return (
              <motion.div
                key={tag.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  y: {
                    duration: 3 + idx * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  duration: 0.5,
                  delay: idx * 0.1,
                }}
                className={`absolute ${tag.pos} z-20 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-2xl border-2 border-[#0B0B0D] cursor-pointer hover:scale-110 transition-transform`}
                style={{ backgroundColor: tag.color, color: tag.textColor }}
              >
                <Icon className="w-4 h-4 fill-current" />
                <span>{tag.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 text-left">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-[#F20D63] shadow-lg transition-colors">
            <span className="text-2xl font-black text-[#F20D63] block mb-2">01</span>
            <h4 className="font-black text-sm uppercase text-[#0B0B0D]">Social Media Launchpad</h4>
            <p className="text-xs text-neutral-600 mt-1 font-medium">
              Create viral reels, aesthetic grid layouts, and targeted campaign funnels for your studio.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-[#1749C6] shadow-lg transition-colors">
            <span className="text-2xl font-black text-[#1749C6] block mb-2">02</span>
            <h4 className="font-black text-sm uppercase text-[#0B0B0D]">Personal Branding</h4>
            <p className="text-xs text-neutral-600 mt-1 font-medium">
              Position yourself as an authority fashion designer or interior consultant in your region.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-[#FFB800] shadow-lg transition-colors">
            <span className="text-2xl font-black text-[#FFB800] block mb-2">03</span>
            <h4 className="font-black text-sm uppercase text-[#0B0B0D]">Client Acquisition</h4>
            <p className="text-xs text-neutral-600 mt-1 font-medium">
              Learn how to quote design fees, win commercial projects, and close high-value clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
