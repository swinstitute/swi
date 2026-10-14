'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Phone, MessageSquare, Mail, Send, CheckCircle2, ArrowUpRight, Copy, Check, Calendar, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteContent, Enquiry } from '@/lib/types';
import { addEnquiry } from '@/lib/cms-store';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface ContactSectionProps {
  content: SiteContent;
  onOpenEnquiry: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ content, onOpenEnquiry }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    course: 'Fashion Design' as 'Fashion Design' | 'Interior Design' | 'Both / Not Sure',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastCreated, setLastCreated] = useState<Enquiry | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const record = addEnquiry(formData);
    setLastCreated(record);
    setSubmitted(true);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#F20D63', '#1749C6', '#FFB800'],
    });
  };

  const handleCopyRef = () => {
    if (!lastCreated?.id) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(lastCreated.id);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCopiedRef(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      age: '',
      course: 'Fashion Design',
      message: '',
    });
  };

  const getWhatsAppUrl = () => {
    const refTag = lastCreated?.id ? `[Ref: #${lastCreated.id}] ` : '';
    const text = `Hello SW Institute! I submitted an admission enquiry ${refTag}\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Age: ${formData.age || 'N/A'}\n• Course: ${formData.course}\n• Query: ${formData.message || 'General Information'}`;
    return `https://wa.me/917772992592?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contact" className="relative py-24 bg-[#F8F7F3] text-[#0B0B0D] overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#0B0B0D_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#0B0B0D]/15 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F20D63] tracking-widest uppercase mb-3 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>VISIT OUR CAMPUS & GET IN TOUCH</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-[#0B0B0D]">
              CONNECT WITH <span className="text-[#1749C6]">SW INSTITUTE</span>
            </h2>
          </div>
          <p className="text-sm text-neutral-600 max-w-md font-medium">
            Located in Vaishali Nagar, Bhilai. Visit our creative studio labs, meet expert mentors, or submit your quick studio enquiry below.
          </p>
        </div>

        {/* 3-Column Layout: Campus Info, Enhanced Inline Contact Form, & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Column 1: Campus Details & Quick Contacts */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            <div className="p-7 rounded-3xl bg-white border-2 border-neutral-200 shadow-xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F20D63]/10 text-[#F20D63] flex items-center justify-center shrink-0 font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#F20D63] uppercase font-bold tracking-widest">
                    BHILAI CAMPUS
                  </span>
                  <h3 className="text-lg font-black uppercase text-[#0B0B0D] mt-1">
                    South West Institute of Design & Innovation
                  </h3>
                  <p className="text-xs text-neutral-700 mt-2 font-medium leading-relaxed">
                    {content.contactAddress}
                  </p>
                </div>
              </div>

              {/* Action Contact Cards */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <a
                  href={`tel:${content.contactPhone.replace(/\s+/g, '')}`}
                  className="p-3.5 rounded-2xl bg-[#F8F7F3] border border-neutral-200 hover:border-[#F20D63] transition-all flex items-center gap-3 group"
                >
                  <Phone className="w-4 h-4 text-[#F20D63] group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500 font-bold">CALL US DIRECTLY</span>
                    <span className="text-xs font-bold text-[#0B0B0D]">{content.contactPhone}</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${content.contactWhatsapp.replace(/[^\d]/g, '')}?text=Hello%20SW%20Institute!%20I%20want%20to%20enquire%20about%20courses.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black transition-all flex items-center gap-3 group"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366] group-hover:text-black transition-colors" />
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-700 font-bold">WHATSAPP SUPPORT</span>
                    <span className="text-xs font-bold text-[#0B0B0D]">
                      {content.contactWhatsapp}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${content.contactEmail}`}
                  className="p-3.5 rounded-2xl bg-[#F8F7F3] border border-neutral-200 hover:border-[#1749C6] transition-all flex items-center gap-3 group"
                >
                  <Mail className="w-4 h-4 text-[#1749C6] group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500 font-bold">OFFICIAL EMAIL</span>
                    <span className="text-xs font-bold text-[#0B0B0D] truncate max-w-[180px]">
                      {content.contactEmail}
                    </span>
                  </div>
                </a>

                <a
                  href="https://instagram.com/SWInstitute"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#F8F7F3] border border-neutral-200 hover:border-[#F20D63] transition-all flex items-center gap-3 group"
                >
                  <InstagramIcon className="w-4 h-4 text-[#F20D63] group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500 font-bold">INSTAGRAM HANDLE</span>
                    <span className="text-xs font-bold text-[#0B0B0D]">@SWInstitute</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Enhanced High-Converting Inline Studio Enquiry Form */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border-2 border-neutral-200 shadow-xl flex flex-col justify-between">
            {!submitted ? (
              <div>
                <div className="mb-4">
                  <span className="text-xs font-mono font-bold text-[#F20D63] uppercase">DIRECT STUDIO ENQUIRY</span>
                  <h3 className="text-xl font-black uppercase text-[#0B0B0D]">
                    QUICK STUDIO ENQUIRY
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                    Fill out the form below to enquire about fee structure, batch timings, syllabus, or book a studio visit.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#F20D63]" />
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F3] border border-neutral-200 focus:border-[#F20D63] focus:outline-none text-[#0B0B0D] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1749C6]" />
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 99939 97767"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F3] border border-neutral-200 focus:border-[#1749C6] focus:outline-none text-[#0B0B0D] font-medium"
                      />
                    </div>
                  </div>

                  {/* Age & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
                        APPLICANT AGE *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 19 or 22"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F3] border border-neutral-200 focus:border-[#FFB800] focus:outline-none text-[#0B0B0D] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-800 uppercase mb-1 font-bold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-500" />
                        EMAIL (OPTIONAL)
                      </label>
                      <input
                        type="email"
                        placeholder="priya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F3] border border-neutral-200 focus:border-[#0B0B0D] focus:outline-none text-[#0B0B0D] font-medium"
                      />
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div>
                    <label className="block text-neutral-800 uppercase mb-1 font-bold">PROGRAM INTEREST</label>
                    <select
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          course: e.target.value as 'Fashion Design' | 'Interior Design' | 'Both / Not Sure',
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F3] border border-neutral-200 focus:border-[#1749C6] focus:outline-none text-[#0B0B0D] font-medium"
                    >
                      <option value="Fashion Design">Diploma in Fashion Designing</option>
                      <option value="Interior Design">Diploma in Interior Designing</option>
                      <option value="Both / Not Sure">Both / Need Career Counseling</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-neutral-800 uppercase mb-1 font-bold">MESSAGE / QUESTION (OPTIONAL)</label>
                    <textarea
                      rows={2}
                      placeholder="Your questions about fees, batches, or eligibility..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F8F7F3] border border-neutral-200 focus:border-[#F20D63] focus:outline-none text-[#0B0B0D] font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#0B0B0D] text-white font-black text-xs uppercase tracking-widest hover:bg-[#F20D63] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SUBMIT ENQUIRY NOW</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Receipt Confirmation Screen */
              <div className="text-center py-4 space-y-3.5 my-auto">
                <div className="w-12 h-12 rounded-full bg-[#F20D63] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#0B0B0D]">ENQUIRY REGISTERED!</h3>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed mt-1">
                    Thank you, <span className="font-bold text-[#0B0B0D]">{formData.name}</span>. Your enquiry has been received in SW Studio.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F7F3] border border-neutral-200 max-w-sm mx-auto text-left text-xs space-y-2 font-medium">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500 font-mono text-[11px]">UNIQUE ENQUIRY NO:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm text-[#1749C6] font-black tracking-wider">
                        {lastCreated?.id}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyRef}
                        className="px-2 py-0.5 rounded-md bg-white border border-neutral-300 hover:bg-neutral-100 text-[#0B0B0D] text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy Unique Enquiry Number"
                      >
                        {copiedRef ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-1.5 text-[11px]">
                    <span className="text-neutral-500 font-mono">APPLICANT AGE:</span>
                    <span className="font-bold text-[#0B0B0D]">{formData.age || 'N/A'} yrs</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-1.5 text-[11px]">
                    <span className="text-neutral-500 font-mono">PROGRAM:</span>
                    <span className="font-bold text-[#F20D63]">{formData.course}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500 font-mono">PHONE:</span>
                    <span className="font-mono text-[#0B0B0D] font-bold">{formData.phone}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-black transition-colors whitespace-nowrap active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>CHAT ON WHATSAPP</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-[#0B0B0D] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    SUBMIT ANOTHER
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Interactive Google Maps Embed Frame */}
          <div className="lg:col-span-3 relative min-h-[380px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-neutral-100 group">
            <iframe
              title="SW Institute Bhilai Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.123456789!2d81.332308!3d21.216391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28cddddddddddd%3A0x0!2sGurunanak+Market%2C+Vaishali+Nagar%2C+Bhilai%2C+Chhattisgarh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[380px]"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200 shadow-md flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0B0B0D] uppercase">BHILAI CAMPUS</span>
              <a
                href="https://maps.google.com/?q=Gurunanak+Market+Vaishali+Nagar+Bhilai"
                target="_blank"
                rel="noreferrer"
                className="text-[#F20D63] font-mono hover:underline font-black"
              >
                MAPS ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
