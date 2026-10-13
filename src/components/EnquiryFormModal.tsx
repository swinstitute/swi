'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageSquare, Sparkles, User, Phone, Mail, HelpCircle, ShieldCheck, Compass, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addEnquiry } from '@/lib/cms-store';
import { Enquiry } from '@/lib/types';

interface EnquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export const EnquiryFormModal: React.FC<EnquiryFormModalProps> = ({
  isOpen,
  onClose,
  defaultCourse = 'Fashion Design',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    course: defaultCourse as 'Fashion Design' | 'Interior Design' | 'Both / Not Sure',
    enquiryTopic: 'Fashion Designing Program',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastCreated, setLastCreated] = useState<Enquiry | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const record = addEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      age: formData.age || 'N/A',
      course: formData.course,
      message: `[Topic: ${formData.enquiryTopic}] ${formData.message}`,
    });
    setLastCreated(record);
    setSubmitted(true);

    // Trigger Confetti Celebration
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#F20D63', '#1749C6', '#FFB800', '#0B0B0D'],
    });
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      age: '',
      course: 'Fashion Design',
      enquiryTopic: 'Fashion Designing Program',
      message: '',
    });
    onClose();
  };

  const getWhatsAppUrl = () => {
    const text = `Hello SW Institute! I submitted a quick studio enquiry:\n*Name*: ${formData.name}\n*Phone*: ${formData.phone}\n*Topic*: ${formData.enquiryTopic}\n*Question*: ${formData.message || 'General Information'}`;
    return `https://wa.me/917772992592?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9950] bg-[#0B0B0D]/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overflow-y-auto selection:bg-[#F20D63] selection:text-white pb-24 sm:pb-6"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white text-[#0B0B0D] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#0B0B0D] p-5 sm:p-9 my-auto"
          >
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0B0B0D] text-white flex items-center justify-center hover:bg-[#F20D63] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <div>
                {/* Form Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-2 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>QUICK STUDIO ENQUIRY</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B0B0D]">
                    HAVE A <span className="text-[#F20D63]">QUESTION?</span>
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 font-medium leading-relaxed">
                    Ask about course syllabus, fee structure, batch schedules, or book a campus tour.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                  {/* Topic Selection */}
                  <div>
                    <label className="block text-[#0B0B0D] uppercase mb-2 font-black text-xs">
                      WHAT WOULD YOU LIKE TO ENQUIRE ABOUT? *
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Fashion Designing Program', color: '#F20D63', val: 'Fashion Design' },
                        { label: 'Interior Designing Program', color: '#1749C6', val: 'Interior Design' },
                        { label: 'Digital Marketing Module', color: '#FFB800', val: 'Both / Not Sure' },
                        { label: 'Fees & Batch Schedules', color: '#0B0B0D', val: 'Both / Not Sure' },
                      ].map((item) => {
                        const isSelected = formData.enquiryTopic === item.label;
                        return (
                          <div
                            key={item.label}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                enquiryTopic: item.label,
                                course: item.val as 'Fashion Design' | 'Interior Design' | 'Both / Not Sure',
                              })
                            }
                            className={`cursor-pointer p-3 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#0B0B0D] text-white border-[#0B0B0D] shadow-md'
                                : 'bg-[#F8F7F3] text-[#0B0B0D] border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            <span className="font-bold text-[11px] truncate">{item.label}</span>
                            <span
                              className="w-2 h-2 rounded-full shrink-0 ml-1"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#F20D63]" />
                        YOUR FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Deshmukh"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F7F3] border-2 border-neutral-200 focus:border-[#F20D63] focus:outline-none text-[#0B0B0D] text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1749C6]" />
                        PHONE / WHATSAPP NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 99939 97767"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F7F3] border-2 border-neutral-200 focus:border-[#1749C6] focus:outline-none text-[#0B0B0D] text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      EMAIL ADDRESS (OPTIONAL)
                    </label>
                    <input
                      type="email"
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F7F3] border-2 border-neutral-200 focus:border-[#0B0B0D] focus:outline-none text-[#0B0B0D] text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#FFB800]" />
                      YOUR QUESTION / MESSAGE (OPTIONAL)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Can I schedule a campus visit for this Saturday? What are the fee payment options?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F7F3] border-2 border-neutral-200 focus:border-[#F20D63] focus:outline-none text-[#0B0B0D] text-sm font-medium"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      data-cursor="ENQUIRE"
                      className="w-full py-4 rounded-full bg-[#0B0B0D] text-white font-black text-xs uppercase tracking-widest hover:bg-[#F20D63] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>SUBMIT ENQUIRY</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#F20D63]" /> Quick Callback
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#1749C6]" /> Bhilai Campus Team
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              /* SUBMISSION CONFIRMATION SCREEN */
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#F20D63] text-white flex items-center justify-center mx-auto shadow-xl shadow-pink-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-3xl font-black uppercase text-[#0B0B0D]">
                    ENQUIRY RECEIVED!
                  </h3>
                  <p className="text-sm text-neutral-700 max-w-md mx-auto mt-2 font-medium leading-relaxed">
                    Thank you, <span className="text-[#0B0B0D] font-bold">{formData.name}</span>! Our studio team will get back to you shortly on{' '}
                    <span className="text-[#F20D63] font-mono font-bold">{formData.phone}</span>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F7F3] border-2 border-neutral-200 max-w-md mx-auto text-left text-xs space-y-2.5 font-medium">
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500 font-mono">ENQUIRY TOPIC:</span>
                    <span className="font-bold text-[#F20D63]">{formData.enquiryTopic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-mono">REFERENCE ID:</span>
                    <span className="font-mono text-[#1749C6] font-bold">{lastCreated?.id}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-[#0B0B0D] transition-colors shadow-lg shadow-emerald-500/25 whitespace-nowrap active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>CHAT ON WHATSAPP</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>

                  <button
                    onClick={resetAndClose}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0B0B0D] text-white font-bold text-xs uppercase hover:bg-[#F20D63] transition-colors cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
