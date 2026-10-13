'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SWLogo } from './SWLogo';
import {
  ArrowUpRight,
  Home,
  BookOpen,
  Sparkles,
  MapPin,
  Send,
  Sun,
  Moon,
  Award,
  Menu,
  X,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { getStoredContent, saveStoredContent, applySiteTheme } from '@/lib/cms-store';

interface NavbarProps {
  onOpenEnquiry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [content, setContent] = useState(getStoredContent());
  const logoClicksRef = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // ScrollSpy: Detect active section
      const sections = ['hero', 'about', 'programs', 'digital-marketing', 'whysw', 'gallery', 'experience', 'contact'];
      const scrollPos = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const handleUpdate = () => setContent(getStoredContent());

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('sw_cms_updated', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('sw_cms_updated', handleUpdate);
    };
  }, []);

  const handleLogoTripleTap = () => {
    logoClicksRef.current += 1;
    if (logoClicksRef.current >= 3) {
      window.dispatchEvent(new Event('sw_open_studio_secret'));
      logoClicksRef.current = 0;
      return;
    }
    setTimeout(() => {
      logoClicksRef.current = 0;
    }, 1000);
  };

  const toggleThemeMode = () => {
    const currentMode = content.themeMode || 'light';
    const nextMode: 'light' | 'dark' = currentMode === 'dark' ? 'light' : 'dark';
    const updated = { ...content, themeMode: nextMode };
    saveStoredContent(updated);
    applySiteTheme(updated);
  };

  const desktopNavLinks = [
    { id: 'about', label: 'ABOUT', href: '#about' },
    { id: 'programs', label: 'PROGRAMS', href: '#programs' },
    { id: 'whysw', label: 'WHY SW', href: '#whysw' },
    { id: 'gallery', label: 'WORK', href: '#gallery' },
    { id: 'experience', label: 'JOURNEY', href: '#experience' },
    { id: 'contact', label: 'CONTACT', href: '#contact' },
  ];

  const mobilePillItems = [
    { id: 'hero', label: 'HOME', href: '#hero', icon: Home },
    { id: 'programs', label: 'COURSES', href: '#programs', icon: BookOpen },
    { id: 'whysw', label: 'WHY SW', href: '#whysw', icon: Award },
    { id: 'gallery', label: 'WORK', href: '#gallery', icon: Sparkles },
    { id: 'contact', label: 'LOCATION', href: '#contact', icon: MapPin },
  ];

  const fullMobileMenuLinks = [
    { label: '01. Home Banner', href: '#hero', tag: 'Top' },
    { label: '02. About & Story', href: '#about', tag: 'Philosophy' },
    { label: '03. Diploma Programs', href: '#programs', tag: 'Fashion & Interior' },
    { label: '04. Digital Marketing Included', href: '#digital-marketing', tag: 'Exclusive' },
    { label: '05. Why Choose SW', href: '#whysw', tag: 'Advantages' },
    { label: '06. Student Portfolio', href: '#gallery', tag: 'Showcase' },
    { label: '07. Student Journey', href: '#experience', tag: 'Timeline' },
    { label: '08. Campus Location & Contact', href: '#contact', tag: 'Bhilai' },
  ];

  const isDarkMode = content.themeMode === 'dark';

  return (
    <>
      {/* ======================================================== */}
      {/* 📱 MOBILE LIGHT FROSTED LIQUID GLASS TOP HEADER          */}
      {/* ======================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 lg:hidden px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-2xl border-b border-neutral-200/80 shadow-xs flex items-center justify-between transition-colors h-14 sm:h-16">
        <button onClick={handleLogoTripleTap} className="flex items-center gap-2 text-left shrink-0">
          <SWLogo
            layout="horizontal"
            variant="dark"
            size="sm"
            customLogoUrl={content.logos?.mobileHeaderLogo || content.logos?.headerLogo}
          />
        </button>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Admissions Open</span>
          </span>

          {/* Theme Switcher */}
          <button
            onClick={toggleThemeMode}
            title="Toggle Theme"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-neutral-200 text-neutral-800 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all shadow-xs cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#FFB800]" /> : <Moon className="w-3.5 h-3.5 text-[#1749C6]" />}
          </button>

          {/* Enquire CTA */}
          <button
            onClick={onOpenEnquiry}
            className="px-3.5 py-1.5 rounded-full bg-[#F20D63] text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-500/25 active:scale-95 transition-transform whitespace-nowrap cursor-pointer"
          >
            <span>ENQUIRE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Drawer Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B0B0D] text-white flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 💻 DESKTOP LIGHT VERSION LIQUID GLASS 3D NAVBAR          */}
      {/* ======================================================== */}
      <header className="hidden lg:flex fixed top-5 left-0 right-0 z-40 px-8 justify-center pointer-events-none">
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-6 py-2.5 rounded-full transition-all duration-500 bg-white/90 backdrop-blur-3xl border border-neutral-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.06),inset_0_1.5px_2px_rgba(255,255,255,1)] ${
            scrolled ? 'scale-[0.99] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-neutral-300' : ''
          } text-[#0B0B0D]`}
        >
          {/* Left Brand Logo (Triple Tap Secret Trigger) */}
          <button onClick={handleLogoTripleTap} className="flex items-center gap-3 group pl-2 text-left cursor-pointer">
            <SWLogo
              layout="horizontal"
              variant="dark"
              size="sm"
              customLogoUrl={content.logos?.headerLogo}
            />
          </button>

          {/* Middle Liquid Glass Track & Section Buttons */}
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 backdrop-blur-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
            {desktopNavLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-[11px] font-mono font-extrabold tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white font-black'
                      : 'text-neutral-700 hover:text-black hover:bg-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="liquidActiveSectionPillLight"
                      className="absolute inset-0 bg-[#0B0B0D] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {isActive && (
                    <span className="relative z-10 w-2 h-2 rounded-full bg-[#F20D63] shadow-[0_0_8px_#F20D63] animate-pulse" />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 pr-1">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleThemeMode}
              title="Toggle Light / Dark Mode"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 backdrop-blur-md flex items-center justify-center text-neutral-800 hover:bg-neutral-100 hover:scale-105 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] transition-all cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#FFB800]" /> : <Moon className="w-4 h-4 text-[#1749C6]" />}
            </button>

            {/* Light Version Vibrant Magenta ENQUIRE NOW Button */}
            <button
              onClick={onOpenEnquiry}
              data-cursor="ENQUIRE"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-[#F20D63] via-[#E00B5B] to-[#F20D63] text-white shadow-[0_8px_25px_rgba(242,13,99,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_32px_rgba(242,13,99,0.55)] hover:scale-[1.03] active:scale-95 border border-white/30 cursor-pointer whitespace-nowrap"
            >
              <span>ENQUIRE NOW</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.nav>
      </header>

      {/* ======================================================== */}
      {/* 📱 MOBILE LIGHT FROSTED BOTTOM FLOATING PILL BAR         */}
      {/* ======================================================== */}
      <div className="fixed bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-40 lg:hidden flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm bg-white/95 backdrop-blur-3xl text-[#0B0B0D] border border-neutral-300/80 shadow-[0_15px_45px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,1)] rounded-full px-2 py-1.5 flex items-center justify-around gap-0.5">
          {mobilePillItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveSection(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-colors ${
                  isActive ? 'text-[#F20D63] font-bold' : 'text-neutral-500 hover:text-black'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveSectionPillLightLiquid"
                    className="absolute inset-0 bg-neutral-100 border border-neutral-200 rounded-full"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 mb-0.5 relative z-10" />
                <span className="text-[9px] font-mono tracking-wider relative z-10 whitespace-nowrap">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 📜 MOBILE LIGHT FULL-SCREEN MENU DRAWER OVERLAY          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-3xl text-[#0B0B0D] flex flex-col justify-between p-6 sm:p-10 lg:hidden overflow-y-auto"
          >
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
              <button onClick={handleLogoTripleTap} className="flex items-center gap-2 text-left">
                <SWLogo
                  layout="horizontal"
                  variant="dark"
                  size="sm"
                  customLogoUrl={content.logos?.mobileHeaderLogo || content.logos?.headerLogo}
                />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 text-[#0B0B0D] border border-neutral-200 flex items-center justify-center hover:bg-neutral-200 active:scale-90 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="py-8 space-y-3">
              <p className="text-[10px] font-mono text-[#F20D63] uppercase tracking-widest font-black mb-4">
                NAVIGATION MAP • SW INSTITUTE
              </p>

              {fullMobileMenuLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100/80 border border-neutral-200/80 hover:bg-neutral-200/80 transition-all group"
                >
                  <span className="text-base font-black uppercase tracking-tight text-[#0B0B0D] group-hover:text-[#F20D63]">
                    {link.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{link.tag}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-black transition-all" />
                  </div>
                </a>
              ))}
            </div>

            {/* Bottom Contact & Actions */}
            <div className="pt-6 border-t border-neutral-200 space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry();
                }}
                className="w-full py-4 rounded-2xl bg-[#F20D63] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 active:scale-98 transition-transform"
              >
                <span>APPLY / ENQUIRE NOW</span>
                <Send className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-600 font-mono pt-2">
                <a href="tel:+919111333966" className="flex items-center gap-1.5 hover:text-black font-medium">
                  <Phone className="w-3.5 h-3.5 text-[#1749C6]" />
                  <span>+91 91113 33966</span>
                </a>
                <span onClick={handleLogoTripleTap} className="text-neutral-400 text-[10px] uppercase font-mono cursor-pointer">
                  BHILAI CAMPUS
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
