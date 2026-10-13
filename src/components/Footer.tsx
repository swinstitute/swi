import React, { useEffect, useState } from 'react';
import { SWLogo } from './SWLogo';
import { ArrowUpRight } from 'lucide-react';
import { getStoredContent } from '@/lib/cms-store';

export const Footer: React.FC = () => {
  const [content, setContent] = useState(getStoredContent());
  const clickCountRef = React.useRef(0);

  useEffect(() => {
    const handleUpdate = () => setContent(getStoredContent());
    window.addEventListener('sw_cms_updated', handleUpdate);
    return () => window.removeEventListener('sw_cms_updated', handleUpdate);
  }, []);

  const handleSecretTripleClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      window.dispatchEvent(new Event('sw_open_studio_secret'));
      clickCountRef.current = 0;
      return;
    }
    setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);
  };

  return (
    <footer className="bg-[#F8F7F3] text-[#0B0B0D] pt-16 pb-12 border-t border-[#0B0B0D]/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#0B0B0D]/15">
          {/* Brand & Slogan Column */}
          <div className="md:col-span-6 space-y-4">
            <div onClick={handleSecretTripleClick} className="cursor-pointer inline-block">
              <SWLogo layout="horizontal" variant="dark" size="md" customLogoUrl={content.logos?.footerLogo || content.logos?.headerLogo} />
            </div>
            <p className="text-[#F20D63] font-mono text-sm font-black tracking-widest uppercase pt-2">
              LEARN. CREATE. GROW. LEAD YOUR WORLD.
            </p>
            <p className="text-xs text-neutral-700 max-w-md font-medium leading-relaxed">
              South West Institute of Design and Innovation is Bhilai&apos;s premier creative studio institute specializing in Fashion Designing, Interior Designing, and integrated Digital Marketing.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="block font-mono text-neutral-500 font-bold uppercase tracking-widest mb-2">
              NAVIGATION
            </span>
            <ul className="space-y-2 font-bold text-neutral-800">
              <li>
                <a href="#about" className="hover:text-[#F20D63] transition-colors">
                  ABOUT SW
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#F20D63] transition-colors">
                  DIPLOMA PROGRAMS
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#F20D63] transition-colors">
                  STUDENT EXPERIENCE
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#F20D63] transition-colors">
                  MADE AT SW GALLERY
                </a>
              </li>
              <li>
                <a href="#admissions" className="hover:text-[#F20D63] transition-colors">
                  ADMISSIONS 2026
                </a>
              </li>
            </ul>
          </div>

          {/* Social Connect Column */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="block font-mono text-neutral-500 font-bold uppercase tracking-widest mb-2">
              CONNECT
            </span>
            <ul className="space-y-2 font-bold text-neutral-800">
              <li>
                <a
                  href="https://instagram.com/SWInstitute"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F20D63] transition-colors flex items-center gap-1"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F20D63]" />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/SWInstitute"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#1749C6] transition-colors flex items-center gap-1"
                >
                  <span>FACEBOOK</span>
                  <ArrowUpRight className="w-3 h-3 text-[#1749C6]" />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917772992592"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#25D366] transition-colors flex items-center gap-1"
                >
                  <span>WHATSAPP SUPPORT</span>
                  <ArrowUpRight className="w-3 h-3 text-[#25D366]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-4 font-mono font-medium">
          <span onClick={handleSecretTripleClick} className="cursor-pointer">
            © 2026 SW Institute of Design and Innovation. All rights reserved.
          </span>
          <span>Bhilai, Chhattisgarh • India</span>
        </div>
      </div>
    </footer>
  );
};
