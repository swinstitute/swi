'use client';

import React, { useState, useEffect } from 'react';
import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { CoursesSection } from '@/components/CoursesSection';
import { DigitalMarketingSection } from '@/components/DigitalMarketingSection';
import { WhySWSection } from '@/components/WhySWSection';
import { MadeAtSWGallery } from '@/components/MadeAtSWGallery';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { WhoCanApplySection } from '@/components/WhoCanApplySection';
import { AdmissionsSection } from '@/components/AdmissionsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { SectionDivider } from '@/components/SectionDivider';
import { EnquiryFormModal } from '@/components/EnquiryFormModal';
import { SecretAdminModal } from '@/components/SecretAdminModal';
import {
  getStoredContent,
  getStoredCourses,
  getStoredGallery,
  applySiteTheme,
  saveStoredContent,
  saveStoredCourses,
  saveStoredGallery,
} from '@/lib/cms-store';
import { subscribeToFirebaseContent } from '@/lib/firebase';

export default function Home() {
  const [content, setContent] = useState(getStoredContent());
  const [courses, setCourses] = useState(getStoredCourses());
  const [gallery, setGallery] = useState(getStoredGallery());
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    const refreshStore = () => {
      const updatedContent = getStoredContent();
      setContent(updatedContent);
      setCourses(getStoredCourses());
      setGallery(getStoredGallery());
      applySiteTheme(updatedContent);
    };

    refreshStore();

    // Subscribe to Firebase Firestore live updates if Firebase config exists
    const unsubscribeFirebase = subscribeToFirebaseContent((remoteContent) => {
      if (remoteContent) {
        saveStoredContent(remoteContent);
        setContent(remoteContent);
        if (remoteContent.courses && Array.isArray(remoteContent.courses)) {
          saveStoredCourses(remoteContent.courses);
          setCourses(remoteContent.courses);
        }
        if (remoteContent.gallery && Array.isArray(remoteContent.gallery)) {
          saveStoredGallery(remoteContent.gallery);
          setGallery(remoteContent.gallery);
        }
        applySiteTheme(remoteContent);
      }
    }, content.firebaseConfig);

    window.addEventListener('sw_cms_updated', refreshStore);

    return () => {
      window.removeEventListener('sw_cms_updated', refreshStore);
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }, []);

  const renderSectionComponent = (secId: string) => {
    switch (secId) {
      case 'hero':
        return <Hero content={content} onOpenEnquiry={() => setIsEnquiryOpen(true)} />;
      case 'about':
        return <AboutSection content={content} />;
      case 'programs':
        return <CoursesSection courses={courses} onOpenEnquiry={() => setIsEnquiryOpen(true)} />;
      case 'digital-marketing':
        return <DigitalMarketingSection content={content} />;
      case 'why-sw':
        return <WhySWSection content={content} />;
      case 'gallery':
        return <MadeAtSWGallery galleryItems={gallery} />;
      case 'experience':
        return <ExperienceTimeline content={content} />;
      case 'eligibility':
        return <WhoCanApplySection content={content} />;
      case 'admissions':
        return <AdmissionsSection content={content} onOpenEnquiry={() => setIsEnquiryOpen(true)} />;
      case 'contact':
        return <ContactSection content={content} onOpenEnquiry={() => setIsEnquiryOpen(true)} />;
      default:
        return null;
    }
  };

  const visibleSections = (content.sectionOrder || []).filter((sec) => sec.visible);

  return (
    <main className="min-h-screen bg-site-bg text-site-fg relative overflow-x-hidden selection:bg-[#F20D63] selection:text-white transition-colors duration-300">
      {/* Custom Pointed Cursor Active All Over Website */}
      <CustomCursor />

      {/* Discrete Passcode Modal for Secret Admin Access */}
      <SecretAdminModal />

      {/* Clean Navigation Bar - Zero Visible Studio CMS Traces */}
      <Navbar onOpenEnquiry={() => setIsEnquiryOpen(true)} />

      {/* Dynamic Section Renderer */}
      {visibleSections.map((sec, idx) => (
        <React.Fragment key={sec.id}>
          {renderSectionComponent(sec.id)}
          {idx < visibleSections.length - 1 && sec.dividerLabel && (
            <SectionDivider label={sec.dividerLabel} />
          )}
        </React.Fragment>
      ))}

      {/* Clean Footer */}
      <Footer />

      {/* Enquiry Form Modal */}
      <EnquiryFormModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </main>
  );
}
