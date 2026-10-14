'use client';

import React from 'react';
import Image from 'next/image';

export interface SWLogoProps {
  layout?: 'horizontal' | 'vertical' | 'mark-only';
  variant?: 'dark' | 'light' | 'pink';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
  showSubtitle?: boolean;
}

export const SWLogo: React.FC<SWLogoProps> = ({
  layout = 'horizontal',
  variant = 'dark',
  className = '',
  size = 'md',
  customLogoUrl,
  showSubtitle = true,
}) => {
  // Determine mark image source
  const getLogoSrc = (): string => {
    if (customLogoUrl && customLogoUrl.trim() !== '') {
      return customLogoUrl;
    }
    switch (variant) {
      case 'light':
        return '/images/sw-logo-mark-light.png';
      case 'pink':
        return '/images/sw-logo-mark-pink.png';
      case 'dark':
      default:
        return '/images/sw-logo-mark-dark.png';
    }
  };

  // Mark height in pixels based on size & layout
  const getDimensions = (): { height: number; width: number } => {
    // Original mark ratio: 753 width / 693 height = 1.0866
    const ratio = 1.0866;
    let h = 40;

    switch (size) {
      case 'sm':
        h = layout === 'vertical' ? 52 : 34;
        break;
      case 'lg':
        h = layout === 'vertical' ? 80 : 54;
        break;
      case 'xl':
        h = layout === 'vertical' ? 110 : 72;
        break;
      case 'md':
      default:
        h = layout === 'vertical' ? 64 : 42;
        break;
    }

    return { height: h, width: Math.round(h * ratio) };
  };

  // Typography styling based on variant
  const getThemeStyles = () => {
    switch (variant) {
      case 'light':
        return {
          titleColor: '#FFFFFF',
          subColor: 'rgba(255, 255, 255, 0.72)',
          dotColor: 'bg-[#F20D63]',
        };
      case 'pink':
        return {
          titleColor: '#F20D63',
          subColor: '#1749C6',
          dotColor: 'bg-[#1749C6]',
        };
      case 'dark':
      default:
        return {
          titleColor: '#0B0B0D',
          subColor: 'rgba(11, 11, 13, 0.75)',
          dotColor: 'bg-[#F20D63]',
        };
    }
  };

  // Typography font size based on size
  const getTypographyStyles = () => {
    switch (size) {
      case 'sm':
        return {
          title: 'text-[14px] sm:text-[15px]',
          sub: 'text-[7px] min-[360px]:text-[7.5px] sm:text-[8.5px]',
          dot: 'w-1.5 h-1.5',
          gap: 'gap-2 sm:gap-2.5',
        };
      case 'lg':
        return {
          title: 'text-2xl sm:text-3xl',
          sub: 'text-[10px] sm:text-[11px]',
          dot: 'w-2.5 h-2.5',
          gap: 'gap-3.5',
        };
      case 'xl':
        return {
          title: 'text-3xl sm:text-4xl',
          sub: 'text-xs sm:text-sm',
          dot: 'w-3 h-3',
          gap: 'gap-4',
        };
      case 'md':
      default:
        return {
          title: 'text-[16px] sm:text-[18px]',
          sub: 'text-[8px] sm:text-[9.5px]',
          dot: 'w-2 h-2',
          gap: 'gap-2.5 sm:gap-3',
        };
    }
  };

  const { height, width } = getDimensions();
  const theme = getThemeStyles();
  const typo = getTypographyStyles();
  const logoSrc = getLogoSrc();

  // 1. Mark-only Layout (Icon only)
  if (layout === 'mark-only') {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <Image
          src={logoSrc}
          alt="SW Institute Logo"
          width={width}
          height={height}
          unoptimized
          priority
          style={{ height: `${height}px`, width: 'auto' }}
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  // 2. Vertical Layout (Mark on top, centered Institute Name below)
  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <div className="relative mb-3 transition-transform duration-300 hover:scale-105">
          <Image
            src={logoSrc}
            alt="SW Institute Logo"
            width={width}
            height={height}
            unoptimized
            priority
            style={{ height: `${height}px`, width: 'auto' }}
            className="object-contain drop-shadow-sm"
          />
        </div>
        <div className="flex flex-col items-center leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black uppercase tracking-tight ${typo.title}`}
              style={{ color: theme.titleColor }}
            >
              SW Institute
            </span>
            <span className={`rounded-full animate-pulse shrink-0 ${typo.dot} ${theme.dotColor}`} />
          </div>
          {showSubtitle && (
            <span
              className={`font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] mt-1 text-center ${typo.sub}`}
              style={{ color: theme.subColor }}
            >
              SOUTH WEST INSTITUTE OF DESIGN AND INNOVATION
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. Horizontal Layout (Default: Mark on left, Institute Name on right)
  return (
    <div className={`flex items-center ${typo.gap} select-none group text-left ${className}`}>
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
        <Image
          src={logoSrc}
          alt="SW Institute Logo"
          width={width}
          height={height}
          unoptimized
          priority
          style={{ height: `${height}px`, width: 'auto' }}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black uppercase tracking-tight ${typo.title}`}
            style={{ color: theme.titleColor }}
          >
            SW Institute
          </span>
          <span className={`rounded-full animate-pulse shrink-0 ${typo.dot} ${theme.dotColor}`} />
        </div>
        {showSubtitle && (
          <span
            className={`font-bold uppercase tracking-[0.11em] sm:tracking-[0.15em] mt-1 ${typo.sub}`}
            style={{ color: theme.subColor }}
          >
            <span className="hidden min-[360px]:inline">
              SOUTH WEST INSTITUTE OF DESIGN AND INNOVATION
            </span>
            <span className="min-[360px]:hidden">
              DESIGN &amp; INNOVATION
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
