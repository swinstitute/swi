'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SWLogo } from './SWLogo';

export const SecretAdminModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 1. Desktop Keyboard Shortcut (Ctrl+Shift+S / Cmd+Shift+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    // 2. Typing 'swstudio' secret sequence
    let secretBuffer = '';
    const handleKeyBuffer = (e: KeyboardEvent) => {
      if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      secretBuffer += e.key.toLowerCase();
      if (secretBuffer.length > 20) {
        secretBuffer = secretBuffer.slice(-20);
      }
      if (secretBuffer.includes('swstudio')) {
        secretBuffer = '';
        setIsOpen(true);
      }
    };

    // 3. Listen for custom event triggered by Secret Triple-Tap gesture on Mobile or PC
    const handleOpenSecret = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keypress', handleKeyBuffer);
    window.addEventListener('sw_open_studio_secret', handleOpenSecret);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keypress', handleKeyBuffer);
      window.removeEventListener('sw_open_studio_secret', handleOpenSecret);
    };
  }, []);

  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsOpen(false);
        setPasscode('');
        router.push('/sw-studio');
      } else {
        setError(data?.error || 'Invalid Admin Passcode. Access Denied.');
      }
    } catch {
      setError('Authentication failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#0B0B0D] text-white border-2 border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#F20D63]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#1749C6]/20 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-5 pb-4 border-b border-white/10">
            <SWLogo layout="horizontal" variant="light" size="sm" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#F20D63]/20 border border-[#F20D63]/40 text-[#F20D63] flex items-center justify-center shadow-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-black text-[#F20D63] tracking-widest uppercase">RESTRICTED PORTAL</p>
              <h3 className="text-lg font-black tracking-tight uppercase text-white">SW STUDIO CMS</h3>
            </div>
          </div>

          <p className="text-xs text-neutral-400 font-medium mb-6 leading-relaxed">
            Authorized admin portal access. Enter studio passcode to continue.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" />
              <input
                type="password"
                autoFocus
                placeholder="Enter Passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/20 text-white font-mono text-sm focus:border-[#F20D63] focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F20D63] to-[#1749C6] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'VERIFYING...' : 'ACCESS STUDIO CMS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              SHORTCUT: CTRL + SHIFT + S OR TRIPLE-TAP LOGO
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
