'use client';

import React, { useEffect } from 'react';

export const CustomCursor: React.FC = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-cursor-style', 'normal');
    }
  }, []);

  return null;
};

