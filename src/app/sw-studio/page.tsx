'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SWLogo } from '@/components/SWLogo';
import { uploadToImgBB, syncImageToImgBB } from '@/lib/imgbb';
import {
  saveContentToFirebase,
  syncAllDataToFirebase,
  subscribeToFirebaseEnquiries,
  updateEnquiryStatusInFirebase,
  deleteEnquiryFromFirebase,
} from '@/lib/firebase';
import {
  Lock,
  LayoutDashboard,
  FileText,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Database,
  Cloud,
  CloudUpload,
  KeyRound,
  Radio,
  Eye,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  PhoneCall,
  Search,
  Filter,
  Phone,
  Mail,
  Send,
  Sparkles,
  LogOut,
  RefreshCw,
  Palette,
  MousePointer,
  Layers,
  Upload,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  Monitor,
  Check,
  Building2,
  Share2,
  X,
  Copy,
  ExternalLink,
  Clock,
  UserCheck,
  MoreVertical,
  Flame,
  Award,
} from 'lucide-react';
import {
  SiteContent,
  Course,
  GalleryItem,
  Enquiry,
  ColorTheme,
  SiteLogos,
  AboutPillar,
  DMFeature,
  DMTag,
  WhySWReason,
  ExperienceStage,
  EligibilityCategory,
  AdmissionsInclusion,
} from '@/lib/types';
import {
  getStoredContent,
  saveStoredContent,
  getStoredCourses,
  saveStoredCourses,
  getStoredGallery,
  saveStoredGallery,
  getStoredEnquiries,
  saveStoredEnquiries,
  COLOR_THEME_PRESETS,
  INITIAL_SECTIONS,
  INITIAL_SITE_CONTENT,
  applySiteTheme,
} from '@/lib/cms-store';

type StudioTab =
  | 'dashboard'
  | 'enquiries'
  | 'appearance'
  | 'logos'
  | 'section-reorder'
  | 'section-content'
  | 'courses'
  | 'gallery'
  | 'settings';

type SectionEditorTab =
  | 'hero'
  | 'about'
  | 'programs'
  | 'digital-marketing'
  | 'why-sw'
  | 'gallery'
  | 'experience'
  | 'eligibility'
  | 'admissions'
  | 'contact';

export default function SWStudioAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<StudioTab>('dashboard');
  const [sectionEditorTab, setSectionEditorTab] = useState<SectionEditorTab>('hero');
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null);

  const handleImageFieldUpload = async (
    onSuccess: (url: string) => void,
    fieldKey: string,
    file?: File
  ) => {
    if (!file) return;
    setUploadingImageKey(fieldKey);
    try {
      const res = await uploadToImgBB(file);
      if (res.success && res.url) {
        onSuccess(res.url);
        setUploadingImageKey(null);
        return;
      }
    } catch {
      // Fallback
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) onSuccess(dataUrl);
      setUploadingImageKey(null);
    };
    reader.readAsDataURL(file);
  };

  const renderImageUploadField = (
    label: string,
    value: string,
    fieldKey: string,
    onChange: (val: string) => void
  ) => (
    <div className="space-y-1.5">
      <label className="block text-neutral-300 uppercase font-mono text-[11px] tracking-wider font-bold">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 bg-neutral-900 shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-neutral-500" />
          )}
        </div>
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL (CDN, /images/..., or upload file)"
            className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs font-mono"
          />
          <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploadingImageKey === fieldKey ? 'Uploading...' : 'Browse'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFieldUpload(onChange, fieldKey, file);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );

  const [livePreview, setLivePreview] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  // Content States
  const [siteContent, setSiteContent] = useState<SiteContent>(getStoredContent());
  const [courses, setCourses] = useState<Course[]>(getStoredCourses());
  const [gallery, setGallery] = useState<GalleryItem[]>(getStoredGallery());
  const [enquiries, setEnquiries] = useState<Enquiry[]>(getStoredEnquiries());

  // Notification & Realtime Enquiry States
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newEnquiryToast, setNewEnquiryToast] = useState<Enquiry | null>(null);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled' | 'Closed'>('All');
  const seenEnquiryIdsRef = useRef<Set<string>>(new Set());
  const isInitialEnquiryLoadRef = useRef(true);

  const playNotificationChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.3);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser web push notifications are not supported on this browser.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('🔔 SW Studio Notifications Enabled!', {
          body: 'You will now receive instant push alerts on this device whenever a new admission enquiry arrives.',
        });
        playNotificationChime();
      }
    } catch (e) {
      console.warn('Notification permission error:', e);
    }
  };

  const handleTestNotification = () => {
    if (soundEnabled) {
      playNotificationChime();
    }
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('🔔 [TEST] Admission Enquiry Alert!', {
            body: 'Fashion Designing Diploma • Priya Sharma (+91 99939 97767)',
            icon: siteContent.logos?.brandSymbol || '/icon.png',
          });
        } catch (e) {
          console.warn('Notification trigger error:', e);
        }
      } else {
        requestNotificationPermission();
      }
    }
    setNewEnquiryToast({
      id: `SW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: 'Priya Sharma (Sample Live Test)',
      phone: '+91 99939 97767',
      email: 'priya.sharma@example.com',
      age: '19',
      course: 'Fashion Design',
      message: 'Hello, I want to know about the 1-Year Diploma in Fashion Designing and batch timings for 2026.',
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'New',
    });
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLead = (enq: Enquiry) => {
    const text = `SW INSTITUTE LEAD #${enq.id}\nStudent: ${enq.name}\nPhone: ${enq.phone}\nAge: ${enq.age || 'N/A'}\nProgram: ${enq.course}\n${enq.email ? `Email: ${enq.email}\n` : ''}Submitted: ${enq.timestamp}\nQuery: ${enq.message || 'General Enquiry'}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(enq.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const getForwardToAdminWhatsAppUrl = (enq: Enquiry) => {
    const adminPhone = (siteContent.contactWhatsapp || '917772992592').replace(/[^\d]/g, '');
    const text = `🚨 *NEW ADMISSION LEAD — SW INSTITUTE*\n🔖 *Reference*: #${enq.id}\n👤 *Student Name*: ${enq.name}\n📱 *Phone Number*: ${enq.phone}\n🎓 *Program*: ${enq.course}\n${enq.age ? `🎂 *Age*: ${enq.age} yrs\n` : ''}${enq.email ? `✉️ *Email*: ${enq.email}\n` : ''}📅 *Submitted*: ${enq.timestamp}\n💬 *Student Query*: ${enq.message || 'General admission enquiry'}\n\n👉 *Status*: ${enq.status}`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
  };

  const getStudentWhatsAppUrl = (enq: Enquiry) => {
    const cleanPhone = enq.phone.replace(/[^\d]/g, '');
    const text = `Hello ${enq.name}! This is SW Institute regarding your admission enquiry (Ref: #${enq.id}) for ${enq.course}. How can we assist you with syllabus, fee details, and batch timings?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // New Course Draft State
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    category: 'Fashion',
    subtitle: '',
    description: '',
    duration: '1 Year Diploma',
    eligibility: '10th / 12th Passout',
    highlights: ['Sketching & Design', 'Digital Marketing Included'],
    image: '/images/hero_fashion_model.jpg',
    accentColor: '#F20D63',
  });
  const [showAddCourse, setShowAddCourse] = useState(false);

  // New Gallery Item Draft State
  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'Fashion',
    image: '/images/hero_fashion_model.jpg',
    studentName: '',
    year: '2026',
    aspectRatio: 'square',
  });
  const [showAddGallery, setShowAddGallery] = useState(false);

  // Cloud & Database Test States
  const [firebaseTestStatus, setFirebaseTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [firebaseTestMessage, setFirebaseTestMessage] = useState('');
  const [imgbbTestStatus, setImgbbTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [imgbbTestMessage, setImgbbTestMessage] = useState('');

  const handleTestFirebase = async () => {
    setFirebaseTestStatus('testing');
    setFirebaseTestMessage('Testing Firestore Cloud connection...');
    try {
      const res = await saveContentToFirebase(siteContent, siteContent.firebaseConfig);
      if (res) {
        setFirebaseTestStatus('success');
        setFirebaseTestMessage('✓ Cloud Firestore connected & sw_site/content document synchronized!');
      } else {
        setFirebaseTestStatus('error');
        setFirebaseTestMessage('✕ Could not write to Firebase. Check API keys and Firestore security rules.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setFirebaseTestStatus('error');
      setFirebaseTestMessage(`✕ Error: ${message}`);
    }
  };

  const handleTestImgBB = async () => {
    setImgbbTestStatus('testing');
    setImgbbTestMessage('Testing ImgBB CDN API...');
    try {
      const testPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=';
      const res = await uploadToImgBB(testPng);
      if (res.success && res.url) {
        setImgbbTestStatus('success');
        setImgbbTestMessage(`✓ ImgBB CDN upload verified! Image URL: ${res.url}`);
      } else {
        setImgbbTestStatus('error');
        setImgbbTestMessage(`✕ ImgBB Error: ${res.error || 'Failed to upload'}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setImgbbTestStatus('error');
      setImgbbTestMessage(`✕ Error: ${message}`);
    }
  };

  // Full Cloud Sync Engine (ImgBB CDN + Firebase Firestore)
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isFullSyncing, setIsFullSyncing] = useState(false);
  const [fullSyncProgress, setFullSyncProgress] = useState(0);
  const [fullSyncStatusText, setFullSyncStatusText] = useState('');
  const [fullSyncResult, setFullSyncResult] = useState<{
    success: boolean;
    imagesUploaded: number;
    enquiriesSynced: number;
    error?: string;
  } | null>(null);

  const handleFullCloudSync = async () => {
    setShowSyncModal(true);
    setIsFullSyncing(true);
    setFullSyncProgress(10);
    setFullSyncResult(null);
    setFullSyncStatusText('Initializing Cloud Engine & reading local media assets...');

    try {
      let imagesUploaded = 0;

      // 1. Sync Logos
      setFullSyncStatusText('Uploading institute brand logos to ImgBB CDN...');
      setFullSyncProgress(25);
      const updatedLogos = { ...siteContent.logos };
      for (const key of ['headerLogo', 'mobileHeaderLogo', 'footerLogo', 'adminLogo', 'brandSymbol'] as const) {
        if (updatedLogos[key]) {
          const res = await syncImageToImgBB(updatedLogos[key]!);
          if (res.uploaded) {
            updatedLogos[key] = res.url;
            imagesUploaded++;
          }
        }
      }

      // 2. Sync Hero Background Images
      setFullSyncStatusText('Uploading Hero Section 3D renders to ImgBB CDN...');
      setFullSyncProgress(40);
      let newHeroImage1 = siteContent.heroImage1;
      let newHeroImage2 = siteContent.heroImage2;

      if (newHeroImage1) {
        const res = await syncImageToImgBB(newHeroImage1);
        if (res.uploaded) {
          newHeroImage1 = res.url;
          imagesUploaded++;
        }
      }
      if (newHeroImage2) {
        const res = await syncImageToImgBB(newHeroImage2);
        if (res.uploaded) {
          newHeroImage2 = res.url;
          imagesUploaded++;
        }
      }

      // 3. Sync Course Cards Images
      setFullSyncStatusText('Uploading Diploma Courses graphics to ImgBB CDN...');
      setFullSyncProgress(60);
      const updatedCourses = [...courses];
      for (let i = 0; i < updatedCourses.length; i++) {
        if (updatedCourses[i].image) {
          const res = await syncImageToImgBB(updatedCourses[i].image);
          if (res.uploaded) {
            updatedCourses[i] = { ...updatedCourses[i], image: res.url };
            imagesUploaded++;
          }
        }
      }

      // 4. Sync "Made at SW" Gallery Images
      setFullSyncStatusText('Uploading "Made at SW" gallery photos to ImgBB CDN...');
      setFullSyncProgress(80);
      const updatedGallery = [...gallery];
      for (let i = 0; i < updatedGallery.length; i++) {
        if (updatedGallery[i].image) {
          const res = await syncImageToImgBB(updatedGallery[i].image);
          if (res.uploaded) {
            updatedGallery[i] = { ...updatedGallery[i], image: res.url };
            imagesUploaded++;
          }
        }
      }

      // 5. Update local state and localStorage
      const updatedContent: SiteContent = {
        ...siteContent,
        logos: updatedLogos,
        heroImage1: newHeroImage1,
        heroImage2: newHeroImage2,
        courses: updatedCourses,
        gallery: updatedGallery,
        lastCloudSync: new Date().toISOString(),
      };

      setSiteContent(updatedContent);
      setCourses(updatedCourses);
      setGallery(updatedGallery);
      saveStoredContent(updatedContent);
      saveStoredCourses(updatedCourses);
      saveStoredGallery(updatedGallery);
      saveStoredEnquiries(enquiries);

      // 6. Push Full Package to Firebase Firestore
      setFullSyncStatusText('Saving content, courses, gallery, and enquiries to Firebase Firestore...');
      setFullSyncProgress(92);

      const firebaseRes = await syncAllDataToFirebase(
        updatedContent,
        updatedCourses,
        updatedGallery,
        enquiries,
        updatedContent.firebaseConfig
      );

      if (!firebaseRes.success) {
        throw new Error(firebaseRes.error || 'Failed to sync to Firebase');
      }

      setFullSyncProgress(100);
      setFullSyncStatusText('✓ Cloud Synchronization Complete!');
      setFullSyncResult({
        success: true,
        imagesUploaded,
        enquiriesSynced: firebaseRes.enquiriesCount,
      });
      setIsFullSyncing(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during cloud sync';
      console.error('Full cloud sync error:', err);
      setIsFullSyncing(false);
      setFullSyncResult({
        success: false,
        imagesUploaded: 0,
        enquiriesSynced: 0,
        error: message,
      });
    }
  };

  useEffect(() => {
    // 1. Verify server-side admin authentication session
    fetch('/api/admin/auth')
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('sw_admin_auth');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {});

    // Helper to trigger chime, device notification, toast, and immediate list update
    const notifyNewEnquiry = (enq: Enquiry) => {
      if (!enq?.id) return;
      if (seenEnquiryIdsRef.current.has(enq.id)) return;
      seenEnquiryIdsRef.current.add(enq.id);

      if (soundEnabled) {
        playNotificationChime();
      }

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`🔔 New Lead [${enq.id}]: ${enq.name}`, {
            body: `${enq.course} • Age: ${enq.age || 'N/A'} • Phone: ${enq.phone}`,
            icon: siteContent.logos?.brandSymbol || '/icon.png',
          });
        } catch (e) {
          console.warn('Device notification error:', e);
        }
      }

      setNewEnquiryToast(enq);
      setEnquiries((prev) => {
        if (prev.some((item) => item.id === enq.id)) return prev;
        const updated = [enq, ...prev];
        saveStoredEnquiries(updated);
        return updated;
      });
    };

    // 1. Subscribe to Realtime Firestore Enquiries (Cross-device / cloud)
    const unsubscribeEnquiries = subscribeToFirebaseEnquiries((remoteEnquiries) => {
      if (remoteEnquiries) {
        if (isInitialEnquiryLoadRef.current) {
          seenEnquiryIdsRef.current = new Set(remoteEnquiries.map((e) => e.id));
          isInitialEnquiryLoadRef.current = false;
          setEnquiries(remoteEnquiries);
          saveStoredEnquiries(remoteEnquiries);
        } else {
          // Detect brand new enquiries arriving live from cloud
          const newlyArrived = remoteEnquiries.filter((e) => !seenEnquiryIdsRef.current.has(e.id));
          if (newlyArrived.length > 0) {
            newlyArrived.forEach((item) => notifyNewEnquiry(item));
          }
          setEnquiries(remoteEnquiries);
          saveStoredEnquiries(remoteEnquiries);
        }
      }
    }, siteContent.firebaseConfig);

    // 2. Local Same-Window Event (0ms instant response)
    const handleLocalEnquiry = (e: Event) => {
      const customEvent = e as CustomEvent<Enquiry>;
      if (customEvent.detail) {
        notifyNewEnquiry(customEvent.detail);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('sw_new_enquiry', handleLocalEnquiry);
    }

    // 3. Cross-Tab Broadcast Channel (0ms instant response across browser tabs)
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('sw_enquiries_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_ENQUIRY' && event.data.enquiry) {
            notifyNewEnquiry(event.data.enquiry);
          }
        };
      }
    } catch {}

    return () => {
      if (unsubscribeEnquiries) unsubscribeEnquiries();
      if (typeof window !== 'undefined') {
        window.removeEventListener('sw_new_enquiry', handleLocalEnquiry);
      }
      if (channel) channel.close();
    };
  }, [siteContent.firebaseConfig, soundEnabled, siteContent.logos?.brandSymbol]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('sw_admin_auth', 'authenticated');
        setPasscode('');
        setAuthError('');
      } else {
        setAuthError(data?.error || 'Invalid Admin Authorization Passcode.');
      }
    } catch {
      setAuthError('Authentication request failed. Please check network.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {}
    setIsAuthenticated(false);
    localStorage.removeItem('sw_admin_auth');
  };

  const handleSaveAll = () => {
    saveStoredContent(siteContent);
    saveStoredCourses(courses);
    saveStoredGallery(gallery);
    saveStoredEnquiries(enquiries);
    applySiteTheme(siteContent);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    const updated = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
    setEnquiries(updated);
    saveStoredEnquiries(updated);
    updateEnquiryStatusInFirebase(id, status, siteContent.firebaseConfig);
  };

  const handleDeleteEnquiry = (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    saveStoredEnquiries(updated);
    deleteEnquiryFromFirebase(id, siteContent.firebaseConfig);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title) return;
    const courseToAdd: Course = {
      id: `course-${Date.now()}`,
      title: newCourse.title || 'NEW COURSE',
      category: newCourse.category || 'Fashion',
      subtitle: newCourse.subtitle || '',
      description: newCourse.description || '',
      duration: newCourse.duration || '1 Year Diploma',
      eligibility: newCourse.eligibility || '10th / 12th Passout',
      highlights: newCourse.highlights || ['Practical Training'],
      image: newCourse.image || '/images/hero_fashion_model.jpg',
      accentColor: newCourse.accentColor || '#F20D63',
      featured: true,
    };
    const updated = [...courses, courseToAdd];
    setCourses(updated);
    saveStoredCourses(updated);
    setShowAddCourse(false);
  };

  const handleDeleteCourse = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    saveStoredCourses(updated);
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title) return;
    const itemToAdd: GalleryItem = {
      id: `g-${Date.now()}`,
      title: newGalleryItem.title || 'Project Showcase',
      category: newGalleryItem.category || 'Fashion',
      image: newGalleryItem.image || '/images/hero_fashion_model.jpg',
      studentName: newGalleryItem.studentName || 'SW Student',
      year: newGalleryItem.year || '2026',
      aspectRatio: newGalleryItem.aspectRatio || 'square',
    };
    const updated = [...gallery, itemToAdd];
    setGallery(updated);
    saveStoredGallery(updated);
    setShowAddGallery(false);
  };

  const handleDeleteGalleryItem = (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    saveStoredGallery(updated);
  };

  // File Upload Handler for Custom Logos with ImgBB API Integration
  const handleLogoFileUpload = async (
    field: keyof SiteLogos,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Upload to ImgBB CDN
    const imgbbRes = await uploadToImgBB(file);
    if (imgbbRes.success && imgbbRes.url) {
      setSiteContent((prev) => ({
        ...prev,
        logos: {
          ...prev.logos,
          [field]: imgbbRes.url!,
        },
      }));
      return;
    }

    // Local Base64 fallback if offline or no key
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSiteContent((prev) => ({
          ...prev,
          logos: {
            ...prev.logos,
            [field]: result,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Section Order Manager Handlers
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...(siteContent.sectionOrder || INITIAL_SECTIONS)];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setSiteContent((prev) => ({
      ...prev,
      sectionOrder: list,
    }));
  };

  const handleToggleSectionVisibility = (id: string) => {
    const list = (siteContent.sectionOrder || INITIAL_SECTIONS).map((sec) =>
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    );
    setSiteContent((prev) => ({
      ...prev,
      sectionOrder: list,
    }));
  };

  const handleUpdateDividerLabel = (id: string, label: string) => {
    const list = (siteContent.sectionOrder || INITIAL_SECTIONS).map((sec) =>
      sec.id === id ? { ...sec, dividerLabel: label } : sec
    );
    setSiteContent((prev) => ({
      ...prev,
      sectionOrder: list,
    }));
  };

  // Theme Preset Select Handler
  const handleSelectPresetTheme = (presetKey: ColorTheme['preset']) => {
    const preset = COLOR_THEME_PRESETS[presetKey];
    if (preset) {
      const updated = {
        ...siteContent,
        colorTheme: preset,
      };
      setSiteContent(updated);
      applySiteTheme(updated);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-4 selection:bg-[#F20D63]">
        <div className="w-full max-w-md bg-[#121216] border border-white/15 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <SWLogo layout="vertical" variant="light" size="lg" className="mx-auto" />
            <div className="pt-4 flex items-center justify-center gap-2 text-xs font-mono text-[#F20D63] font-bold uppercase tracking-widest">
              <Lock className="w-4 h-4" />
              <span>MASTER ADMIN CMS PORTAL</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-neutral-300 uppercase mb-2">
                ADMIN AUTHORIZATION PASSCODE
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#F20D63] focus:outline-none text-white text-sm"
              />
            </div>

            {authError && (
              <p className="text-[#F20D63] text-xs font-bold text-center bg-[#F20D63]/10 p-2.5 rounded-xl border border-[#F20D63]/30">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-full bg-[#F20D63] text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer disabled:opacity-60"
            >
              <span>{authLoading ? 'VERIFYING CREDENTIALS...' : 'ACCESS STUDIO CMS'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Enquiries for Search & Status
  const filteredEnquiries = enquiries.filter((enq) => {
    const q = enquirySearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      enq.name.toLowerCase().includes(q) ||
      enq.phone.toLowerCase().includes(q) ||
      enq.course.toLowerCase().includes(q) ||
      enq.id.toLowerCase().includes(q) ||
      (enq.age && enq.age.toLowerCase().includes(q)) ||
      (enq.email && enq.email.toLowerCase().includes(q)) ||
      (enq.message && enq.message.toLowerCase().includes(q));
    const matchesStatus =
      enquiryStatusFilter === 'All' || enq.status === enquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingLeadsCount = enquiries.filter((e) => e.status === 'New').length;

  // ADMIN CMS MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col font-sans selection:bg-[#F20D63]">
      {/* Real-time New Enquiry Floating Push Toast Banner */}
      <AnimatePresence>
        {newEnquiryToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-20 right-4 z-[9999] max-w-md w-[calc(100%-2rem)] bg-[#16161D] border-2 border-[#F20D63] text-white p-4 rounded-2xl shadow-2xl shadow-pink-600/40 backdrop-blur-xl space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F20D63] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F20D63]"></span>
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#F20D63] font-black">
                  🔥 NEW REALTIME ENQUIRY!
                </span>
              </div>
              <button
                onClick={() => setNewEnquiryToast(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-base text-white">{newEnquiryToast.name}</h4>
                <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  #{newEnquiryToast.id}
                </span>
              </div>
              <p className="text-xs text-[#FFB800] font-mono mt-0.5">{newEnquiryToast.course}</p>
              <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-300 mt-0.5">
                <span>{newEnquiryToast.phone}</span>
                {newEnquiryToast.age && <span>• Age: {newEnquiryToast.age} yrs</span>}
              </div>
              {newEnquiryToast.message && (
                <p className="text-xs text-neutral-200 italic mt-1.5 line-clamp-2 bg-black/60 p-2 rounded-lg border border-white/10">
                  &quot;{newEnquiryToast.message}&quot;
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
              <button
                onClick={() => {
                  setActiveTab('enquiries');
                  setNewEnquiryToast(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#F20D63] text-white text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Open in Enquiries
              </button>
              <a
                href={`tel:${newEnquiryToast.phone}`}
                className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={getStudentWhatsAppUrl(newEnquiryToast)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Bar */}
      <header className="bg-[#121216] border-b border-white/10 px-4 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between sticky top-0 z-40 h-14 sm:h-16">
        {/* Left Brand Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <SWLogo
            layout="horizontal"
            variant="light"
            size="sm"
            customLogoUrl={siteContent.logos?.adminLogo || siteContent.logos?.headerLogo}
          />
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#F20D63] text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider sm:tracking-widest shrink-0">
            STUDIO
          </span>

          {/* Desktop Only Leads Pill */}
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`hidden sm:flex px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase items-center gap-1.5 transition-all cursor-pointer ${
              pendingLeadsCount > 0
                ? 'bg-[#F20D63] text-white animate-pulse'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
            title="Real-time Enquiries Counter"
          >
            <Bell className="w-3 h-3" />
            <span>{enquiries.length} LEADS</span>
            {pendingLeadsCount > 0 && (
              <span className="bg-white text-black font-black px-1.5 py-0.2 rounded-full text-[9px]">
                {pendingLeadsCount} NEW
              </span>
            )}
          </button>
        </div>

        {/* Right Side: Desktop Controls */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {/* Live Preview Split Toggle */}
          <button
            onClick={() => setLivePreview(!livePreview)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              livePreview
                ? 'bg-[#1749C6] text-white shadow-lg'
                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{livePreview ? 'HIDE PREVIEW' : 'LIVE PREVIEW'}</span>
          </button>

          {/* Global Save Button */}
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-full bg-[#F20D63] text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-colors flex items-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer whitespace-nowrap"
          >
            <Save className="w-4 h-4" />
            <span>SAVE ALL</span>
          </button>

          {/* Master Cloud Sync Button (ImgBB + Firebase) */}
          <button
            onClick={handleFullCloudSync}
            disabled={isFullSyncing}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#1749C6] to-[#F20D63] text-white text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            title="Upload all media to ImgBB CDN and sync data to Firebase Firestore"
          >
            <CloudUpload className={`w-4 h-4 ${isFullSyncing ? 'animate-bounce' : ''}`} />
            <span>{isFullSyncing ? 'SYNCING...' : 'SYNC ALL TO CLOUD'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Minimal Clean Mobile Actions (Only 3 clean, uncluttered buttons) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Enquiries Notification Bell */}
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`relative p-2 rounded-full transition-all cursor-pointer ${
              pendingLeadsCount > 0
                ? 'bg-[#F20D63] text-white animate-pulse'
                : 'bg-white/10 text-neutral-300 hover:text-white'
            }`}
            title="View Realtime Enquiries"
          >
            <Bell className="w-4 h-4" />
            {pendingLeadsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-white text-black font-black text-[9px] flex items-center justify-center font-mono shadow-sm">
                {pendingLeadsCount}
              </span>
            )}
          </button>

          {/* Mobile Fast Save Button */}
          <button
            onClick={handleSaveAll}
            className="px-3.5 py-1.5 rounded-full bg-[#F20D63] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-600/30 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE</span>
          </button>

          {/* Mobile Quick Menu (3-dots) */}
          <button
            onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
            className="p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Actions Dropdown / Sheet */}
      <AnimatePresence>
        {mobileActionsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#16161D] border-b border-white/15 px-4 py-3 space-y-2 z-30 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
              <span>QUICK ACTIONS</span>
              <button
                onClick={() => setMobileActionsOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Sync All to Cloud */}
              <button
                onClick={() => {
                  setMobileActionsOpen(false);
                  handleFullCloudSync();
                }}
                disabled={isFullSyncing}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF]/20 via-[#1749C6]/20 to-[#F20D63]/20 border border-cyan-500/30 text-white text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <CloudUpload className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="truncate">{isFullSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>

              {/* Toggle Live Preview */}
              <button
                onClick={() => {
                  setLivePreview(!livePreview);
                  setMobileActionsOpen(false);
                }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Eye className="w-4 h-4 text-[#1749C6] shrink-0" />
                <span className="truncate">{livePreview ? 'Hide Preview' : 'Live Preview'}</span>
              </button>

              {/* View Public Website */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileActionsOpen(false)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span className="truncate">Public Site ↗</span>
              </a>

              {/* Logout */}
              <button
                onClick={() => {
                  setMobileActionsOpen(false);
                  handleLogout();
                }}
                className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="truncate">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Success Alert Banner */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#25D366] text-black font-black text-xs uppercase tracking-widest text-center py-2 px-4 flex items-center justify-center gap-2 z-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SAVED SUCCESSFULLY!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Horizontal Navigation Bar */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-[#121216] border-b border-white/10 shrink-0 scrollbar-none z-20">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'enquiries', label: 'Leads', icon: MessageSquare, badge: pendingLeadsCount },
          { id: 'appearance', label: 'Theme', icon: Palette },
          { id: 'logos', label: 'Logos', icon: Upload },
          { id: 'section-reorder', label: 'Reorder', icon: Layers },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as StudioTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F20D63] text-white shadow-md shadow-pink-600/30'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-black text-[9px] font-mono font-black shrink-0">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Main Content Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-[#121216] border-r border-white/10 p-4 space-y-1 shrink-0 hidden md:block overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
            STUDIO ENGINE
          </div>

          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
            { id: 'appearance', label: 'Cursor & Colors', icon: Palette },
            { id: 'logos', label: 'Logo Manager', icon: Upload },
            { id: 'section-reorder', label: 'Section Rearrange', icon: Layers },
            { id: 'section-content', label: 'Section Copy Editor', icon: FileText },
            { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: ImageIcon },
            { id: 'settings', label: 'Cloud & Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as StudioTab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F20D63] text-white shadow-lg shadow-pink-600/30'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-8 px-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#1749C6] text-xs font-mono font-bold text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <span>OPEN PUBLIC SITE ↗</span>
            </a>
          </div>
        </aside>

        {/* Main Work Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Form & Controls Panel */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
            {/* OVERVIEW DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-black uppercase">STUDIO OVERVIEW</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage enquiries, section ordering, logo branding, cursor interactions, and core themes.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <span className="text-xs font-mono text-neutral-400 uppercase">TOTAL ENQUIRIES</span>
                    <span className="block text-4xl font-black text-[#F20D63] mt-2">
                      {enquiries.length}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                      {enquiries.filter((e) => e.status === 'New').length} New Leads Pending
                    </span>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <span className="text-xs font-mono text-neutral-400 uppercase">ACTIVE DIPLOMAS</span>
                    <span className="block text-4xl font-black text-[#1749C6] mt-2">
                      {courses.length}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                      Fashion & Interior Programs
                    </span>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <span className="text-xs font-mono text-neutral-400 uppercase">CURSOR MODE</span>
                    <span className="block text-2xl font-black text-[#FFB800] mt-3 uppercase">
                      {siteContent.cursorStyle === 'radial' ? '36px Radial Blur' : 'Normal OS Pointer'}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                      Interactive Desktop Pointer
                    </span>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <span className="text-xs font-mono text-neutral-400 uppercase">THEME MODE</span>
                    <span className="block text-2xl font-black text-emerald-400 mt-3 uppercase">
                      {siteContent.themeMode || 'Light'} Mode
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                      {siteContent.colorTheme?.preset || 'Signature'} Palette
                    </span>
                  </div>
                </div>

                {/* Recent Enquiries Quick Table */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase">RECENT ADMISSION ENQUIRIES</h3>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs font-mono text-[#F20D63] hover:underline cursor-pointer"
                    >
                      VIEW ALL ({enquiries.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase">
                          <th className="pb-3">NAME</th>
                          <th className="pb-3">PHONE</th>
                          <th className="pb-3">COURSE</th>
                          <th className="pb-3">STATUS</th>
                          <th className="pb-3">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium">
                        {enquiries.slice(0, 5).map((enq) => (
                          <tr key={enq.id}>
                            <td className="py-3.5 font-bold text-white">{enq.name}</td>
                            <td className="py-3.5 font-mono text-neutral-300">{enq.phone}</td>
                            <td className="py-3.5 text-[#FFB800]">{enq.course}</td>
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase ${
                                  enq.status === 'New'
                                    ? 'bg-[#F20D63]/20 text-[#F20D63]'
                                    : enq.status === 'Contacted'
                                    ? 'bg-[#1749C6]/20 text-[#1749C6]'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <a
                                href={`https://wa.me/${enq.phone.replace(/[^\d]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)}!%20This%20is%20SW%20Institute%20regarding%20your%20admission%20enquiry.`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-black font-bold transition-colors"
                              >
                                WHATSAPP ↗
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* REAL-TIME ADMISSION ENQUIRIES WORKSPACE */}
            {activeTab === 'enquiries' && (
              <div className="space-y-8 max-w-6xl">
                {/* Header & Live Stream Beacon */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        FIRESTORE REAL-TIME STREAM ACTIVE
                      </span>
                    </div>
                    <h1 className="text-3xl font-black uppercase mt-1">ADMISSION ENQUIRIES & LEADS</h1>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                      Real-time cloud database listener is active. New enquiries submitted by students on mobile or PC appear here immediately with audio chimes and push alerts.
                    </p>
                  </div>

                  {/* Device Push & Sound Alert Quick Controls */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Browser Push Permission Button */}
                    <button
                      onClick={requestNotificationPermission}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                        notificationPermission === 'granted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#F20D63] text-white shadow-lg shadow-pink-600/30 hover:bg-white hover:text-black'
                      }`}
                      title={
                        notificationPermission === 'granted'
                          ? 'Device notifications active'
                          : 'Click to enable mobile/PC device notifications'
                      }
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>
                        {notificationPermission === 'granted'
                          ? '✓ Device Alerts Enabled'
                          : 'Enable Device Push Alerts'}
                      </span>
                    </button>

                    {/* Sound Alert Toggle */}
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        soundEnabled
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                      title="Toggle sound chime on new enquiry"
                    >
                      {soundEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#FFB800]" />
                          <span>Sound: ON</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Sound: OFF</span>
                        </>
                      )}
                    </button>

                    {/* Test Audio & Notification Button */}
                    <button
                      onClick={handleTestNotification}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-neutral-300 hover:text-white hover:border-[#1749C6] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Test Audio Chime & Device Push Notification"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Test Chime & Alert</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">TOTAL LEADS</span>
                    <span className="block text-2xl font-black text-white mt-1">
                      {enquiries.length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F20D63]/10 border border-[#F20D63]/30">
                    <span className="text-[10px] font-mono text-[#F20D63] uppercase font-bold">
                      NEW / UNCONTACTED
                    </span>
                    <span className="block text-2xl font-black text-[#F20D63] mt-1">
                      {enquiries.filter((e) => e.status === 'New').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1749C6]/10 border border-[#1749C6]/30">
                    <span className="text-[10px] font-mono text-[#1749C6] uppercase font-bold">
                      IN CONTACT
                    </span>
                    <span className="block text-2xl font-black text-[#1749C6] mt-1">
                      {enquiries.filter((e) => e.status === 'Contacted').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      ENROLLED
                    </span>
                    <span className="block text-2xl font-black text-emerald-400 mt-1">
                      {enquiries.filter((e) => e.status === 'Enrolled').length}
                    </span>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="p-4 rounded-2xl bg-[#16161D] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by student name, phone, course, question..."
                      value={enquirySearch}
                      onChange={(e) => setEnquirySearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#F20D63] focus:outline-none text-white text-xs placeholder:text-neutral-500"
                    />
                    {enquirySearch && (
                      <button
                        onClick={() => setEnquirySearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Filter Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase mr-1 hidden sm:inline">
                      STATUS:
                    </span>
                    {(['All', 'New', 'Contacted', 'Enrolled', 'Closed'] as const).map((st) => {
                      const isSel = enquiryStatusFilter === st;
                      const count =
                        st === 'All'
                          ? enquiries.length
                          : enquiries.filter((e) => e.status === st).length;
                      return (
                        <button
                          key={st}
                          onClick={() => setEnquiryStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            isSel
                              ? 'bg-white text-black shadow-md'
                              : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {st} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Enquiries Leads Cards Container */}
                {filteredEnquiries.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                    <MessageSquare className="w-10 h-10 text-neutral-500 mx-auto" />
                    <h3 className="text-lg font-black uppercase text-white">NO ENQUIRIES MATCH FILTERS</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      {enquirySearch || enquiryStatusFilter !== 'All'
                        ? 'Try clearing the search query or changing your status filter.'
                        : 'No admission enquiries yet. Test by submitting an enquiry on the website.'}
                    </p>
                    {(enquirySearch || enquiryStatusFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setEnquirySearch('');
                          setEnquiryStatusFilter('All');
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold uppercase hover:bg-white/20 transition-colors cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEnquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className={`p-6 rounded-3xl border transition-all ${
                          enq.status === 'New'
                            ? 'bg-[#181822] border-[#F20D63]/40 shadow-lg shadow-pink-600/10'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Lead Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                          <div className="flex flex-wrap items-center gap-2.5">
                            {/* Prominent Unique Enquiry Reference Badge */}
                            <div className="px-3 py-1 rounded-xl bg-white/10 text-white font-mono text-xs font-black tracking-wider border border-white/20 flex items-center gap-1.5 shadow-sm">
                              <span className="text-[#FFB800]">#</span>
                              <span>{enq.id}</span>
                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-black tracking-wider ${
                                enq.status === 'New'
                                  ? 'bg-[#F20D63] text-white animate-pulse'
                                  : enq.status === 'Contacted'
                                  ? 'bg-[#1749C6]/30 text-[#1749C6] border border-[#1749C6]/50'
                                  : enq.status === 'Enrolled'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-neutral-500/20 text-neutral-400'
                              }`}
                            >
                              ● {enq.status.toUpperCase()}
                            </span>

                            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-neutral-500" />
                              <span>{enq.timestamp}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Copy Lead Button */}
                            <button
                              onClick={() => handleCopyLead(enq)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
                              title="Copy full lead details"
                            >
                              {copiedId === enq.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">COPIED</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>COPY LEAD</span>
                                </>
                              )}
                            </button>

                            {/* Delete Lead Button */}
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer border border-white/5"
                              title="Delete Enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Lead Body Content */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                          <div className="md:col-span-5 space-y-2">
                            <div>
                              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                                STUDENT NAME & AGE
                              </span>
                              <h3 className="text-xl font-black text-white flex items-center gap-2">
                                <span>{enq.name}</span>
                                {enq.age && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 text-xs font-mono font-bold">
                                    {enq.age} yrs
                                  </span>
                                )}
                              </h3>
                            </div>

                            <div className="space-y-1 pt-1">
                              <a
                                href={`tel:${enq.phone.replace(/\s+/g, '')}`}
                                className="inline-flex items-center gap-1.5 font-mono text-sm text-[#00F0FF] hover:underline font-bold"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{enq.phone}</span>
                              </a>
                              {enq.email ? (
                                <p className="text-xs text-neutral-300 flex items-center gap-1.5 truncate">
                                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  <span>{enq.email}</span>
                                </p>
                              ) : (
                                <p className="text-[11px] text-neutral-500 italic">No email provided</p>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-7 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                                  PROGRAM ENQUIRY
                                </span>
                                <span className="inline-block px-3 py-1 rounded-xl bg-[#1749C6]/20 text-[#00F0FF] border border-[#1749C6]/40 font-bold text-xs mt-1">
                                  🎓 {enq.course}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                                  UNIQUE ENQUIRY NO
                                </span>
                                <span className="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 inline-block mt-1">
                                  {enq.id}
                                </span>
                              </div>
                            </div>

                            {/* Message Details Section */}
                            {enq.message ? (
                              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs text-neutral-200 leading-relaxed shadow-inner">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F20D63] uppercase font-bold mb-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>STUDENT MESSAGE / QUERY DETAILS:</span>
                                </div>
                                <p className="italic text-white font-medium whitespace-pre-wrap">&quot;{enq.message}&quot;</p>
                              </div>
                            ) : (
                              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-neutral-500 italic">
                                No additional notes or custom message provided.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Lead Action Controls */}
                        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                          {/* Quick Communication Actions */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Call Student */}
                            <a
                              href={`tel:${enq.phone.replace(/\s+/g, '')}`}
                              className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white hover:text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <span>CALL STUDENT</span>
                            </a>

                            {/* Chat With Student WhatsApp */}
                            <a
                              href={getStudentWhatsAppUrl(enq)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 flex items-center gap-2 transition-opacity cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-black" />
                              <span>STUDENT WHATSAPP</span>
                            </a>

                            {/* Forward Lead to Admin WhatsApp Desk */}
                            <a
                              href={getForwardToAdminWhatsAppUrl(enq)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-xl bg-[#1749C6]/20 border border-[#1749C6]/40 text-[#1749C6] hover:bg-[#1749C6] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                              title="Forward lead formatted to institute admin WhatsApp desk"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>FORWARD TO ADMIN WA</span>
                            </a>
                          </div>

                          {/* Status Updater Buttons */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-neutral-400 uppercase mr-1">
                              STATUS:
                            </span>
                            {(['New', 'Contacted', 'Enrolled', 'Closed'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateEnquiryStatus(enq.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                  enq.status === st
                                    ? 'bg-[#F20D63] text-white shadow-md'
                                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CURSOR & COLOR THEME ENGINE */}
            {activeTab === 'appearance' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h1 className="text-3xl font-black uppercase">CURSOR & COLOR THEME ENGINE</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Toggle custom radial cursor vs normal pointer, select site theme mode, or customize brand accent colors.
                  </p>
                </div>

                {/* 1. Cursor Style Control */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <MousePointer className="w-5 h-5 text-[#F20D63]" />
                    <div>
                      <h3 className="text-lg font-black uppercase">INTERACTIVE CURSOR MODE</h3>
                      <p className="text-xs text-neutral-400">
                        Choose between the custom 36px radial blur ring cursor or standard browser pointer.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div
                      onClick={() => {
                        const updated = { ...siteContent, cursorStyle: 'radial' as const };
                        setSiteContent(updated);
                        applySiteTheme(updated);
                      }}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        siteContent.cursorStyle === 'radial'
                          ? 'bg-[#F20D63]/15 border-[#F20D63] text-white shadow-lg'
                          : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-[#F20D63] bg-[#F20D63]/20 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F20D63]" />
                        </div>
                        <div>
                          <span className="block text-sm font-black uppercase text-white">36px Radial Blur Ring</span>
                          <span className="text-[11px] font-mono text-neutral-400">Custom Studio Blur Cursor</span>
                        </div>
                      </div>
                      {siteContent.cursorStyle === 'radial' && <Check className="w-5 h-5 text-[#F20D63]" />}
                    </div>

                    <div
                      onClick={() => {
                        const updated = { ...siteContent, cursorStyle: 'normal' as const };
                        setSiteContent(updated);
                        applySiteTheme(updated);
                      }}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        siteContent.cursorStyle === 'normal'
                          ? 'bg-[#1749C6]/15 border-[#1749C6] text-white shadow-lg'
                          : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MousePointer className="w-8 h-8 text-[#1749C6]" />
                        <div>
                          <span className="block text-sm font-black uppercase text-white">Normal OS Pointer</span>
                          <span className="text-[11px] font-mono text-neutral-400">Standard Mouse Pointer</span>
                        </div>
                      </div>
                      {siteContent.cursorStyle === 'normal' && <Check className="w-5 h-5 text-[#1749C6]" />}
                    </div>
                  </div>
                </div>

                {/* 2. Theme Mode Switcher */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Sun className="w-5 h-5 text-[#FFB800]" />
                    <div>
                      <h3 className="text-lg font-black uppercase">WEBSITE THEME MODE</h3>
                      <p className="text-xs text-neutral-400">
                        Set default light, dark, or system preference theme.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    {[
                      { mode: 'light', label: 'Light Mode', icon: Sun, color: '#FFB800' },
                      { mode: 'dark', label: 'Dark Mode', icon: Moon, color: '#F20D63' },
                      { mode: 'auto', label: 'Auto System', icon: Monitor, color: '#1749C6' },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isSelected = siteContent.themeMode === t.mode;
                      return (
                        <div
                          key={t.mode}
                          onClick={() => {
                            const updated = { ...siteContent, themeMode: t.mode as 'light' | 'dark' | 'auto' };
                            setSiteContent(updated);
                            applySiteTheme(updated);
                          }}
                          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-2 ${
                            isSelected
                              ? 'bg-white/10 border-white text-white shadow-xl'
                              : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/30'
                          }`}
                        >
                          <Icon className="w-6 h-6" style={{ color: t.color }} />
                          <span className="text-xs font-black uppercase">{t.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Core Color Theme Presets */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black uppercase">CURATED BRAND COLOR PALETTES</h3>
                      <p className="text-xs text-neutral-400">
                        Select a pre-designed harmonious brand palette for the overall website.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {[
                      { key: 'signature', name: 'SW Studio Signature', desc: 'Vogue Light White + Pink + Blue' },
                      { key: 'haute-couture', name: 'Haute Couture Dark', desc: 'Obsidian Black + Crimson + Gold' },
                      { key: 'electric-creative', name: 'Electric Creative', desc: 'Cyber Dark + Neon Pink + Cyan' },
                      { key: 'minimal-luxury', name: 'Minimalist Luxury', desc: 'Ivory + Terracotta + Slate' },
                      { key: 'warm-editorial', name: 'Warm Editorial', desc: 'Paper Cream + Rose + Emerald' },
                    ].map((p) => {
                      const presetData = COLOR_THEME_PRESETS[p.key as keyof typeof COLOR_THEME_PRESETS];
                      const isSelected = siteContent.colorTheme?.preset === p.key;
                      return (
                        <div
                          key={p.key}
                          onClick={() => handleSelectPresetTheme(p.key as ColorTheme['preset'])}
                          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all space-y-3 ${
                            isSelected
                              ? 'bg-white/10 border-[#F20D63] text-white shadow-xl'
                              : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-white">{p.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#F20D63]" />}
                          </div>
                          <p className="text-[10px] text-neutral-400">{p.desc}</p>
                          <div className="flex items-center gap-1.5 pt-1">
                            <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: presetData.primaryAccent }} />
                            <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: presetData.secondaryAccent }} />
                            <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: presetData.tertiaryAccent }} />
                            <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: presetData.background }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Custom Color Pickers */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="text-lg font-black uppercase">CUSTOM CORE COLOR PICKERS</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs font-bold">
                    <div>
                      <label className="block text-neutral-300 uppercase mb-1">Primary Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteContent.colorTheme?.primaryAccent || '#F20D63'}
                          onChange={(e) => {
                            const updated = {
                              ...siteContent,
                              colorTheme: {
                                ...siteContent.colorTheme,
                                preset: 'custom' as const,
                                primaryAccent: e.target.value,
                              },
                            };
                            setSiteContent(updated);
                            applySiteTheme(updated);
                          }}
                          className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={siteContent.colorTheme?.primaryAccent || '#F20D63'}
                          onChange={(e) => {
                            const updated = {
                              ...siteContent,
                              colorTheme: {
                                ...siteContent.colorTheme,
                                preset: 'custom' as const,
                                primaryAccent: e.target.value,
                              },
                            };
                            setSiteContent(updated);
                            applySiteTheme(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase mb-1">Secondary Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteContent.colorTheme?.secondaryAccent || '#1749C6'}
                          onChange={(e) => {
                            const updated = {
                              ...siteContent,
                              colorTheme: {
                                ...siteContent.colorTheme,
                                preset: 'custom' as const,
                                secondaryAccent: e.target.value,
                              },
                            };
                            setSiteContent(updated);
                            applySiteTheme(updated);
                          }}
                          className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={siteContent.colorTheme?.secondaryAccent || '#1749C6'}
                          onChange={(e) => {
                            const updated = {
                              ...siteContent,
                              colorTheme: {
                                ...siteContent.colorTheme,
                                preset: 'custom' as const,
                                secondaryAccent: e.target.value,
                              },
                            };
                            setSiteContent(updated);
                            applySiteTheme(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase mb-1">Tertiary Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteContent.colorTheme?.tertiaryAccent || '#FFB800'}
                          onChange={(e) => {
                            const updated = {
                              ...siteContent,
                              colorTheme: {
                                ...siteContent.colorTheme,
                                preset: 'custom' as const,
                                tertiaryAccent: e.target.value,
                              },
                            };
                            setSiteContent(updated);
                            applySiteTheme(updated);
                          }}
                          className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={siteContent.colorTheme?.tertiaryAccent || '#FFB800'}
                          onChange={(e) => {
                            const updated = {
                              ...siteContent,
                              colorTheme: {
                                ...siteContent.colorTheme,
                                preset: 'custom' as const,
                                tertiaryAccent: e.target.value,
                              },
                            };
                            setSiteContent(updated);
                            applySiteTheme(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LOGO MANAGER FOR EVERY LOGO LOCATION */}
            {activeTab === 'logos' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h1 className="text-3xl font-black uppercase">LOGO MANAGER FOR ALL PLACEMENTS</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Upload custom logo graphics or SVG/PNG/JPG URLs for every location where the logo is used across the site.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'headerLogo', label: '1. Header Main Logo', desc: 'Used in top pill desktop header navigation' },
                    { key: 'mobileHeaderLogo', label: '2. Mobile Header Logo', desc: 'Used in mobile screen top header bar' },
                    { key: 'footerLogo', label: '3. Footer Brand Logo', desc: 'Used in site bottom footer' },
                    { key: 'adminLogo', label: '4. Admin CMS Logo', desc: 'Used in /sw-studio master dashboard header' },
                  ].map((logoItem) => {
                    const currentVal = siteContent.logos?.[logoItem.key as keyof SiteLogos] || '';
                    return (
                      <div
                        key={logoItem.key}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4"
                      >
                        <h3 className="text-base font-black uppercase text-white">{logoItem.label}</h3>
                        <p className="text-xs text-neutral-400 font-medium">{logoItem.desc}</p>

                        {/* Current Logo Preview */}
                        <div className="p-4 rounded-2xl bg-black border border-white/15 min-h-[100px] flex items-center justify-center relative">
                          {currentVal ? (
                            <div className="relative group">
                              <img
                                src={currentVal}
                                alt={logoItem.label}
                                className="max-h-20 object-contain mx-auto"
                              />
                              <button
                                onClick={() =>
                                  setSiteContent({
                                    ...siteContent,
                                    logos: { ...siteContent.logos, [logoItem.key]: '' },
                                  })
                                }
                                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Clear Custom Logo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center space-y-1">
                              <SWLogo layout="horizontal" variant="light" size="sm" />
                              <span className="block text-[10px] font-mono text-neutral-400">
                                Official Brand Logo Active
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="space-y-3 text-xs font-semibold">
                          <div>
                            <label className="block text-neutral-300 uppercase mb-1">
                              UPLOAD IMAGE FILE
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLogoFileUpload(logoItem.key as keyof SiteLogos, e)}
                              className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F20D63] file:text-white hover:file:bg-white hover:file:text-black cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-neutral-300 uppercase mb-1">
                              OR PASTE IMAGE URL
                            </label>
                            <input
                              type="text"
                              placeholder="https://example.com/logo.png"
                              value={currentVal}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  logos: { ...siteContent.logos, [logoItem.key]: e.target.value },
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION REARRANGING & VISIBILITY MANAGER */}
            {activeTab === 'section-reorder' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h1 className="text-3xl font-black uppercase">SECTION REORDERING & VISIBILITY</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Drag/move sections up or down, toggle section visibility, and edit architectural divider text.
                  </p>
                </div>

                <div className="space-y-3">
                  {(siteContent.sectionOrder || INITIAL_SECTIONS).map((sec, index) => (
                    <div
                      key={sec.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        sec.visible
                          ? 'bg-white/5 border-white/15'
                          : 'bg-black/60 border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded bg-white/10 hover:bg-[#F20D63] text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-colors cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveSection(index, 'down')}
                            disabled={index === (siteContent.sectionOrder || INITIAL_SECTIONS).length - 1}
                            className="p-1 rounded bg-white/10 hover:bg-[#F20D63] text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-colors cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <span className="text-xs font-mono font-bold text-[#FFB800] uppercase">
                            POSITION 0{index + 1}
                          </span>
                          <h3 className="text-base font-black uppercase text-white">{sec.label}</h3>
                        </div>
                      </div>

                      {/* Divider Label & Visibility Controls */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <input
                          type="text"
                          placeholder="Divider label (e.g. WHO WE ARE)"
                          value={sec.dividerLabel || ''}
                          onChange={(e) => handleUpdateDividerLabel(sec.id, e.target.value)}
                          className="px-3 py-2 rounded-xl bg-black border border-white/20 text-xs text-white font-mono"
                        />

                        <button
                          onClick={() => handleToggleSectionVisibility(sec.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            sec.visible
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{sec.visible ? 'VISIBLE' : 'HIDDEN'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION-WISE IN-DEPTH MASTER EDITOR */}
            {activeTab === 'section-content' && (
              <div className="space-y-8 max-w-5xl">
                {/* Header & Quick Save */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h1 className="text-3xl font-black uppercase text-white flex items-center gap-3">
                      <span>SECTION-WISE CONTENT EDITOR</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F20D63] text-white text-[10px] font-mono font-bold tracking-widest">
                        IN-DEPTH
                      </span>
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1">
                      Edit all texts, headlines, buttons, images, badges, and elements for every individual section on the website.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveAll}
                    className="px-6 py-2.5 rounded-full bg-[#F20D63] hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 transition-all cursor-pointer shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE & PUBLISH CHANGES</span>
                  </button>
                </div>

                {/* Section Navigation Tabs (Pills) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {[
                    { id: 'hero', label: '1. Hero Banner', icon: Sparkles },
                    { id: 'about', label: '2. About & Pillars', icon: Layers },
                    { id: 'programs', label: '3. Diploma Programs', icon: BookOpen },
                    { id: 'digital-marketing', label: '4. Digital Marketing', icon: Share2 },
                    { id: 'why-sw', label: '5. Why SW Advantage', icon: Award },
                    { id: 'gallery', label: '6. Student Showcase', icon: ImageIcon },
                    { id: 'experience', label: '7. Experience (6 Stages)', icon: Clock },
                    { id: 'eligibility', label: '8. Eligibility', icon: UserCheck },
                    { id: 'admissions', label: '9. Admissions Callout', icon: Flame },
                    { id: 'contact', label: '10. Campus & Contact', icon: Building2 },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = sectionEditorTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSectionEditorTab(tab.id as SectionEditorTab)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                          isActive
                            ? 'bg-gradient-to-r from-[#F20D63] to-[#1749C6] text-white shadow-lg shadow-pink-500/20 scale-105'
                            : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 1. HERO SECTION EDITOR */}
                {sectionEditorTab === 'hero' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#F20D63]">HERO SECTION COPY & TAGS</h3>
                          <p className="text-xs text-neutral-400">Headlines, taglines, CTA button labels, and floating badge pills.</p>
                        </div>
                        <Sparkles className="w-5 h-5 text-[#F20D63]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Main Hero Headline</label>
                          <input
                            type="text"
                            value={siteContent.heroHeading}
                            onChange={(e) => setSiteContent({ ...siteContent, heroHeading: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold text-sm"
                            placeholder="DESIGN YOUR FUTURE. BUILD YOUR BRAND."
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Gradient Highlight Phrase</label>
                          <input
                            type="text"
                            value={siteContent.heroHighlightWord || ''}
                            onChange={(e) => setSiteContent({ ...siteContent, heroHighlightWord: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-[#F20D63] font-bold"
                            placeholder="YOUR FUTURE."
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Subheading / Brand Title</label>
                          <input
                            type="text"
                            value={siteContent.heroSubheading}
                            onChange={(e) => setSiteContent({ ...siteContent, heroSubheading: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                            placeholder="South West Institute of Design and Innovation"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Tagline Eyebrow</label>
                          <input
                            type="text"
                            value={siteContent.tagline}
                            onChange={(e) => setSiteContent({ ...siteContent, tagline: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                            placeholder="LEARN. CREATE. GROW. LEAD YOUR WORLD."
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Top Announcement Badge</label>
                          <input
                            type="text"
                            value={siteContent.announcement}
                            onChange={(e) => setSiteContent({ ...siteContent, announcement: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                            placeholder="Admissions Open 2026–2027 • Limited Seats Available"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">CTA Button 1 (Explore)</label>
                          <input
                            type="text"
                            value={siteContent.heroCtaExplore || 'EXPLORE PROGRAMS'}
                            onChange={(e) => setSiteContent({ ...siteContent, heroCtaExplore: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">CTA Button 2 (Enquire)</label>
                          <input
                            type="text"
                            value={siteContent.heroCtaEnquire || 'ENQUIRE NOW'}
                            onChange={(e) => setSiteContent({ ...siteContent, heroCtaEnquire: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>
                      </div>

                      {/* Floating Badge Tags */}
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <label className="block text-xs font-mono uppercase text-neutral-300 font-bold">
                          Floating Feature Badges (3 Badges)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <span className="block text-[11px] text-neutral-400 font-mono mb-1">Badge 1</span>
                            <input
                              type="text"
                              value={siteContent.heroTag1}
                              onChange={(e) => setSiteContent({ ...siteContent, heroTag1: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <span className="block text-[11px] text-neutral-400 font-mono mb-1">Badge 2</span>
                            <input
                              type="text"
                              value={siteContent.heroTag2}
                              onChange={(e) => setSiteContent({ ...siteContent, heroTag2: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <span className="block text-[11px] text-neutral-400 font-mono mb-1">Badge 3</span>
                            <input
                              type="text"
                              value={siteContent.heroTag3}
                              onChange={(e) => setSiteContent({ ...siteContent, heroTag3: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hero Images Showcase */}
                      <div className="pt-4 border-t border-white/10 space-y-4">
                        <h4 className="text-sm font-black uppercase text-white">HERO VISUAL SHOWCASE IMAGERY</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {renderImageUploadField(
                            'Hero Showcase Image 1 (Interior / Main)',
                            siteContent.heroImage1,
                            'heroImage1',
                            (url) => setSiteContent({ ...siteContent, heroImage1: url })
                          )}
                          {renderImageUploadField(
                            'Hero Showcase Image 2 (Fashion / Secondary)',
                            siteContent.heroImage2,
                            'heroImage2',
                            (url) => setSiteContent({ ...siteContent, heroImage2: url })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ABOUT & PILLARS SECTION EDITOR */}
                {sectionEditorTab === 'about' && (
                  <div className="space-y-6">
                    {/* Main About Story */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#1749C6]">ABOUT SECTION STORY & METRICS</h3>
                          <p className="text-xs text-neutral-400">Philosophy, editorial narrative, and key highlight stats.</p>
                        </div>
                        <Layers className="w-5 h-5 text-[#1749C6]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Section Badge / Tag</label>
                          <input
                            type="text"
                            value={siteContent.aboutTitle}
                            onChange={(e) => setSiteContent({ ...siteContent, aboutTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                            placeholder="WHO WE ARE"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Highlight Word / Phrase</label>
                          <input
                            type="text"
                            value={siteContent.aboutHighlightWord || 'WE SHAPE CREATORS.'}
                            onChange={(e) => setSiteContent({ ...siteContent, aboutHighlightWord: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-[#F20D63] font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Main Headline</label>
                          <input
                            type="text"
                            value={siteContent.aboutHeadline}
                            onChange={(e) => setSiteContent({ ...siteContent, aboutHeadline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold text-sm"
                            placeholder="WE DON'T JUST TEACH DESIGN."
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Editorial Story Narrative</label>
                          <textarea
                            rows={4}
                            value={siteContent.aboutStory}
                            onChange={(e) => setSiteContent({ ...siteContent, aboutStory: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white leading-relaxed text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Stat 1 (Value & Label)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={siteContent.stat1Val}
                              onChange={(e) => setSiteContent({ ...siteContent, stat1Val: e.target.value })}
                              placeholder="100%"
                              className="w-24 px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono font-bold"
                            />
                            <input
                              type="text"
                              value={siteContent.stat1Label}
                              onChange={(e) => setSiteContent({ ...siteContent, stat1Label: e.target.value })}
                              placeholder="Practical Exposure"
                              className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/20 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Stat 2 (Value & Label)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={siteContent.stat2Val}
                              onChange={(e) => setSiteContent({ ...siteContent, stat2Val: e.target.value })}
                              placeholder="Included"
                              className="w-24 px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono font-bold"
                            />
                            <input
                              type="text"
                              value={siteContent.stat2Label}
                              onChange={(e) => setSiteContent({ ...siteContent, stat2Label: e.target.value })}
                              placeholder="Digital Marketing"
                              className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/20 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Pillars Editor */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-lg font-black uppercase text-white">INTERACTIVE DESIGN PILLARS ({(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || []).length} CARDS)</h3>
                          <p className="text-xs text-neutral-400">Cards rendered in the interactive About switcher with dynamic imagery.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                            list.push({
                              id: `0${list.length + 1}`,
                              title: 'NEW PILLAR',
                              subtitle: 'Pillar Subtitle',
                              badge: 'CATEGORY BADGE',
                              color: '#F20D63',
                              description: 'Pillar description goes here...',
                              image: '/images/hero_fashion_model.jpg',
                            });
                            setSiteContent({ ...siteContent, aboutPillars: list });
                          }}
                          className="px-4 py-2 rounded-full bg-[#1749C6] text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD PILLAR</span>
                        </button>
                      </div>

                      <div className="space-y-6">
                        {(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || []).map((pillar, idx) => (
                          <div key={pillar.id + idx} className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-white" style={{ backgroundColor: pillar.color || '#F20D63' }}>
                                PILLAR {pillar.id || `0${idx + 1}`}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || []).filter((_, i) => i !== idx);
                                  setSiteContent({ ...siteContent, aboutPillars: list });
                                }}
                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                              <div>
                                <label className="block text-neutral-400 uppercase mb-1">Title</label>
                                <input
                                  type="text"
                                  value={pillar.title}
                                  onChange={(e) => {
                                    const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                                    list[idx] = { ...list[idx], title: e.target.value };
                                    setSiteContent({ ...siteContent, aboutPillars: list });
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-bold"
                                />
                              </div>

                              <div>
                                <label className="block text-neutral-400 uppercase mb-1">Subtitle</label>
                                <input
                                  type="text"
                                  value={pillar.subtitle}
                                  onChange={(e) => {
                                    const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                                    list[idx] = { ...list[idx], subtitle: e.target.value };
                                    setSiteContent({ ...siteContent, aboutPillars: list });
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-neutral-400 uppercase mb-1">Badge</label>
                                <input
                                  type="text"
                                  value={pillar.badge}
                                  onChange={(e) => {
                                    const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                                    list[idx] = { ...list[idx], badge: e.target.value };
                                    setSiteContent({ ...siteContent, aboutPillars: list });
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-neutral-400 uppercase mb-1">Accent Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={pillar.color || '#F20D63'}
                                    onChange={(e) => {
                                      const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                                      list[idx] = { ...list[idx], color: e.target.value };
                                      setSiteContent({ ...siteContent, aboutPillars: list });
                                    }}
                                    className="w-10 h-9 rounded-lg bg-black border border-white/20 cursor-pointer p-0.5"
                                  />
                                  <input
                                    type="text"
                                    value={pillar.color || '#F20D63'}
                                    onChange={(e) => {
                                      const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                                      list[idx] = { ...list[idx], color: e.target.value };
                                      setSiteContent({ ...siteContent, aboutPillars: list });
                                    }}
                                    className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-neutral-400 uppercase mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  value={pillar.description}
                                  onChange={(e) => {
                                    const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                                    list[idx] = { ...list[idx], description: e.target.value };
                                    setSiteContent({ ...siteContent, aboutPillars: list });
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                {renderImageUploadField(
                                  `Pillar ${pillar.id} Visual Image`,
                                  pillar.image,
                                  `pillar_${idx}`,
                                  (url) => {
                                    const list = [...(siteContent.aboutPillars || INITIAL_SITE_CONTENT.aboutPillars || [])];
                                    list[idx] = { ...list[idx], image: url };
                                    setSiteContent({ ...siteContent, aboutPillars: list });
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. DIPLOMA PROGRAMS SECTION EDITOR */}
                {sectionEditorTab === 'programs' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#FFB800]">DIPLOMA PROGRAMS HEADER</h3>
                          <p className="text-xs text-neutral-400">Headlines and introductory text for the courses showcase.</p>
                        </div>
                        <BookOpen className="w-5 h-5 text-[#FFB800]" />
                      </div>

                      <div className="space-y-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Section Title</label>
                          <input
                            type="text"
                            value={siteContent.programsTitle}
                            onChange={(e) => setSiteContent({ ...siteContent, programsTitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold"
                            placeholder="EXPLORE OUR DIPLOMA PROGRAMS"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Subheading Description</label>
                          <textarea
                            rows={3}
                            value={siteContent.programsSubheading}
                            onChange={(e) => setSiteContent({ ...siteContent, programsSubheading: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white"
                            placeholder="Industry-aligned hands-on programs designed to take you from foundational sketching to full brand launch."
                          />
                        </div>
                      </div>

                      {/* Course Management Shortcut Card */}
                      <div className="p-6 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-black uppercase text-[#FFB800]">
                            MANAGE DIPLOMA COURSE CARDS ({courses.length} ACTIVE)
                          </h4>
                          <p className="text-xs text-neutral-300 mt-0.5">
                            Add, edit syllabus highlights, durations, eligibility, and cover images in the Courses Manager.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('courses')}
                          className="px-5 py-2.5 rounded-full bg-[#FFB800] text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>OPEN COURSES TAB</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. DIGITAL MARKETING SECTION EDITOR */}
                {sectionEditorTab === 'digital-marketing' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#FFB800]">DIGITAL MARKETING EXCLUSIVE DIFFERENTIATOR</h3>
                          <p className="text-xs text-neutral-400">Section copy, feature image, floating orbiting skill tags, and feature cards.</p>
                        </div>
                        <Share2 className="w-5 h-5 text-[#FFB800]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Top Eyebrow Tag</label>
                          <input
                            type="text"
                            value={siteContent.dmTitle || 'EXCLUSIVE DIFFERENTIATOR • INCLUDED IN ALL DIPLOMAS'}
                            onChange={(e) => setSiteContent({ ...siteContent, dmTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Highlight Word / Phrase</label>
                          <input
                            type="text"
                            value={siteContent.dmHighlightWord || 'LEARN TO MARKET IT.'}
                            onChange={(e) => setSiteContent({ ...siteContent, dmHighlightWord: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-[#F20D63] font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Main Headline</label>
                          <input
                            type="text"
                            value={siteContent.dmHeadline || "DON'T JUST DESIGN."}
                            onChange={(e) => setSiteContent({ ...siteContent, dmHeadline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Description Paragraph</label>
                          <textarea
                            rows={3}
                            value={siteContent.dmDescription || ''}
                            onChange={(e) => setSiteContent({ ...siteContent, dmDescription: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white leading-relaxed text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Card Overlay Eyebrow</label>
                          <input
                            type="text"
                            value={siteContent.dmBadgeTitle || 'DIGITAL PROMOTION & BRANDING STUDIO'}
                            onChange={(e) => setSiteContent({ ...siteContent, dmBadgeTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Card Overlay Headline</label>
                          <input
                            type="text"
                            value={siteContent.dmBadgeHeading || 'Market Your Vision. Build Your Empire.'}
                            onChange={(e) => setSiteContent({ ...siteContent, dmBadgeHeading: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          {renderImageUploadField(
                            'Digital Marketing Workspace Feature Image',
                            siteContent.dmImage || '/images/digital_marketing_laptop.jpg',
                            'dmImage',
                            (url) => setSiteContent({ ...siteContent, dmImage: url })
                          )}
                        </div>
                      </div>

                      {/* Orbiting Skill Tags Editor */}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-white">ORBITING SKILL TAGS ({(siteContent.dmTags || INITIAL_SITE_CONTENT.dmTags || []).length} TAGS)</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(siteContent.dmTags || INITIAL_SITE_CONTENT.dmTags || [])];
                              list.push({ label: 'New Strategy', color: '#1749C6', textColor: '#FFFFFF' });
                              setSiteContent({ ...siteContent, dmTags: list });
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD TAG</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(siteContent.dmTags || INITIAL_SITE_CONTENT.dmTags || []).map((tag, tIdx) => (
                            <div key={tIdx} className="p-3 rounded-xl bg-black/60 border border-white/15 flex items-center gap-2">
                              <input
                                type="color"
                                value={tag.color || '#F20D63'}
                                onChange={(e) => {
                                  const list = [...(siteContent.dmTags || INITIAL_SITE_CONTENT.dmTags || [])];
                                  list[tIdx] = { ...list[tIdx], color: e.target.value };
                                  setSiteContent({ ...siteContent, dmTags: list });
                                }}
                                className="w-8 h-8 rounded-lg bg-black border border-white/20 cursor-pointer p-0.5 shrink-0"
                              />
                              <input
                                type="text"
                                value={tag.label}
                                onChange={(e) => {
                                  const list = [...(siteContent.dmTags || INITIAL_SITE_CONTENT.dmTags || [])];
                                  list[tIdx] = { ...list[tIdx], label: e.target.value };
                                  setSiteContent({ ...siteContent, dmTags: list });
                                }}
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (siteContent.dmTags || INITIAL_SITE_CONTENT.dmTags || []).filter((_, i) => i !== tIdx);
                                  setSiteContent({ ...siteContent, dmTags: list });
                                }}
                                className="p-1 rounded-lg text-neutral-400 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3 Bottom Feature Cards */}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-white">BOTTOM 3-PILLAR FEATURES</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(siteContent.dmFeatures || INITIAL_SITE_CONTENT.dmFeatures || [])];
                              list.push({
                                num: `0${list.length + 1}`,
                                title: 'New Skill Focus',
                                desc: 'Practical syllabus description here...',
                              });
                              setSiteContent({ ...siteContent, dmFeatures: list });
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD FEATURE</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(siteContent.dmFeatures || INITIAL_SITE_CONTENT.dmFeatures || []).map((feat, fIdx) => (
                            <div key={fIdx} className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-3">
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  value={feat.num}
                                  onChange={(e) => {
                                    const list = [...(siteContent.dmFeatures || INITIAL_SITE_CONTENT.dmFeatures || [])];
                                    list[fIdx] = { ...list[fIdx], num: e.target.value };
                                    setSiteContent({ ...siteContent, dmFeatures: list });
                                  }}
                                  className="w-14 px-2 py-1 rounded-lg bg-black border border-white/20 text-[#FFB800] font-mono font-bold text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = (siteContent.dmFeatures || INITIAL_SITE_CONTENT.dmFeatures || []).filter((_, i) => i !== fIdx);
                                    setSiteContent({ ...siteContent, dmFeatures: list });
                                  }}
                                  className="p-1 rounded-lg text-neutral-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={feat.title}
                                onChange={(e) => {
                                  const list = [...(siteContent.dmFeatures || INITIAL_SITE_CONTENT.dmFeatures || [])];
                                  list[fIdx] = { ...list[fIdx], title: e.target.value };
                                  setSiteContent({ ...siteContent, dmFeatures: list });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-white font-bold text-xs"
                                placeholder="Feature Title"
                              />
                              <textarea
                                rows={2}
                                value={feat.desc}
                                onChange={(e) => {
                                  const list = [...(siteContent.dmFeatures || INITIAL_SITE_CONTENT.dmFeatures || [])];
                                  list[fIdx] = { ...list[fIdx], desc: e.target.value };
                                  setSiteContent({ ...siteContent, dmFeatures: list });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-neutral-300 text-[11px]"
                                placeholder="Description"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. WHY SW ADVANTAGE SECTION EDITOR */}
                {sectionEditorTab === 'why-sw' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#1749C6]">WHY CHOOSE SW INSTITUTE ADVANTAGE</h3>
                          <p className="text-xs text-neutral-400">Headline copy, subtitle, and repeatable advantage reason cards.</p>
                        </div>
                        <Award className="w-5 h-5 text-[#1749C6]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Section Eyebrow Tag</label>
                          <input
                            type="text"
                            value={siteContent.whySWTitle}
                            onChange={(e) => setSiteContent({ ...siteContent, whySWTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                            placeholder="THE SW ADVANTAGE"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Highlight Word / Phrase</label>
                          <input
                            type="text"
                            value={siteContent.whySWHighlightWord || 'SW INSTITUTE?'}
                            onChange={(e) => setSiteContent({ ...siteContent, whySWHighlightWord: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-[#1749C6] font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Main Headline</label>
                          <input
                            type="text"
                            value={siteContent.whySWHeadline}
                            onChange={(e) => setSiteContent({ ...siteContent, whySWHeadline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold text-sm"
                            placeholder="WHY CHOOSE"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Section Subtitle Narrative</label>
                          <textarea
                            rows={3}
                            value={siteContent.whySWSubtitle || ''}
                            onChange={(e) => setSiteContent({ ...siteContent, whySWSubtitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white leading-relaxed text-xs"
                          />
                        </div>
                      </div>

                      {/* Repeatable Reason Cards */}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-white">
                            ADVANTAGE REASONS ({(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || []).length} CARDS)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || [])];
                              list.push({
                                num: `0${list.length + 1}`,
                                title: 'NEW ADVANTAGE',
                                tagline: 'Tagline summary...',
                                description: 'Detailed reason narrative...',
                                color: '#F20D63',
                              });
                              setSiteContent({ ...siteContent, whySWReasons: list });
                            }}
                            className="px-4 py-2 rounded-full bg-[#1749C6] text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD REASON</span>
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || []).map((reason, rIdx) => (
                            <div key={rIdx} className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-white" style={{ backgroundColor: reason.color || '#1749C6' }}>
                                  REASON {reason.num || `0${rIdx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = (siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || []).filter((_, i) => i !== rIdx);
                                    setSiteContent({ ...siteContent, whySWReasons: list });
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Title</label>
                                  <input
                                    type="text"
                                    value={reason.title}
                                    onChange={(e) => {
                                      const list = [...(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || [])];
                                      list[rIdx] = { ...list[rIdx], title: e.target.value };
                                      setSiteContent({ ...siteContent, whySWReasons: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-bold"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Tagline</label>
                                  <input
                                    type="text"
                                    value={reason.tagline}
                                    onChange={(e) => {
                                      const list = [...(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || [])];
                                      list[rIdx] = { ...list[rIdx], tagline: e.target.value };
                                      setSiteContent({ ...siteContent, whySWReasons: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Card Accent Color</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={reason.color || '#1749C6'}
                                      onChange={(e) => {
                                        const list = [...(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || [])];
                                        list[rIdx] = { ...list[rIdx], color: e.target.value };
                                        setSiteContent({ ...siteContent, whySWReasons: list });
                                      }}
                                      className="w-10 h-9 rounded-lg bg-black border border-white/20 cursor-pointer p-0.5"
                                    />
                                    <input
                                      type="text"
                                      value={reason.color || '#1749C6'}
                                      onChange={(e) => {
                                        const list = [...(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || [])];
                                        list[rIdx] = { ...list[rIdx], color: e.target.value };
                                        setSiteContent({ ...siteContent, whySWReasons: list });
                                      }}
                                      className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Reason Number ID</label>
                                  <input
                                    type="text"
                                    value={reason.num}
                                    onChange={(e) => {
                                      const list = [...(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || [])];
                                      list[rIdx] = { ...list[rIdx], num: e.target.value };
                                      setSiteContent({ ...siteContent, whySWReasons: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-neutral-400 uppercase mb-1">Description</label>
                                  <textarea
                                    rows={2}
                                    value={reason.description}
                                    onChange={(e) => {
                                      const list = [...(siteContent.whySWReasons || INITIAL_SITE_CONTENT.whySWReasons || [])];
                                      list[rIdx] = { ...list[rIdx], description: e.target.value };
                                      setSiteContent({ ...siteContent, whySWReasons: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. STUDENT SHOWCASE GALLERY SECTION */}
                {sectionEditorTab === 'gallery' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#F20D63]">MADE AT SW • STUDENT SHOWCASE</h3>
                          <p className="text-xs text-neutral-400">Curate live student projects, sketches, 3D spatial renders, and photoshoots.</p>
                        </div>
                        <ImageIcon className="w-5 h-5 text-[#F20D63]" />
                      </div>

                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-black uppercase text-white">
                            GALLERY PORTFOLIO ITEMS ({gallery.length} ITEMS CURRENTLY ACTIVE)
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1">
                            Filter by Fashion, Interior, Sketches, Workshops, or Events. Upload high-res images directly to ImgBB CDN.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('gallery')}
                          className="px-5 py-2.5 rounded-full bg-[#F20D63] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>OPEN GALLERY MANAGER</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. EXPERIENCE TIMELINE SECTION EDITOR */}
                {sectionEditorTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#F20D63]">THE 6-STAGE SW EXPERIENCE JOURNEY</h3>
                          <p className="text-xs text-neutral-400">Step-by-step student learning transformation timeline.</p>
                        </div>
                        <Clock className="w-5 h-5 text-[#F20D63]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Section Eyebrow Tag</label>
                          <input
                            type="text"
                            value={siteContent.experienceTitle || 'THE STUDENT JOURNEY'}
                            onChange={(e) => setSiteContent({ ...siteContent, experienceTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Highlight Word / Phrase</label>
                          <input
                            type="text"
                            value={siteContent.experienceHighlightWord || 'SW EXPERIENCE'}
                            onChange={(e) => setSiteContent({ ...siteContent, experienceHighlightWord: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-[#F20D63] font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Main Headline</label>
                          <input
                            type="text"
                            value={siteContent.experienceHeadline || 'THE'}
                            onChange={(e) => setSiteContent({ ...siteContent, experienceHeadline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Subtitle Description</label>
                          <textarea
                            rows={2}
                            value={siteContent.experienceSubtitle || ''}
                            onChange={(e) => setSiteContent({ ...siteContent, experienceSubtitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white leading-relaxed text-xs"
                          />
                        </div>
                      </div>

                      {/* 6 Stages Repeatable List */}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-white">
                            EXPERIENCE STAGES ({(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || []).length} STAGES)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                              list.push({
                                stage: `0${list.length + 1}. NEW STAGE`,
                                title: 'STAGE TITLE',
                                subtitle: 'Stage Subtitle',
                                description: 'Description of hands-on activities...',
                                image: '/images/hero_interior_render.jpg',
                                color: '#F20D63',
                              });
                              setSiteContent({ ...siteContent, experienceStages: list });
                            }}
                            className="px-4 py-2 rounded-full bg-[#F20D63] text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD STAGE</span>
                          </button>
                        </div>

                        <div className="space-y-6">
                          {(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || []).map((stg, sIdx) => (
                            <div key={sIdx} className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-white" style={{ backgroundColor: stg.color || '#F20D63' }}>
                                  {stg.stage || `STAGE 0${sIdx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = (siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || []).filter((_, i) => i !== sIdx);
                                    setSiteContent({ ...siteContent, experienceStages: list });
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Stage Code & Identifier</label>
                                  <input
                                    type="text"
                                    value={stg.stage}
                                    onChange={(e) => {
                                      const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                                      list[sIdx] = { ...list[sIdx], stage: e.target.value };
                                      setSiteContent({ ...siteContent, experienceStages: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Title</label>
                                  <input
                                    type="text"
                                    value={stg.title}
                                    onChange={(e) => {
                                      const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                                      list[sIdx] = { ...list[sIdx], title: e.target.value };
                                      setSiteContent({ ...siteContent, experienceStages: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-bold"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Subtitle</label>
                                  <input
                                    type="text"
                                    value={stg.subtitle}
                                    onChange={(e) => {
                                      const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                                      list[sIdx] = { ...list[sIdx], subtitle: e.target.value };
                                      setSiteContent({ ...siteContent, experienceStages: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 uppercase mb-1">Color Theme</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={stg.color || '#F20D63'}
                                      onChange={(e) => {
                                        const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                                        list[sIdx] = { ...list[sIdx], color: e.target.value };
                                        setSiteContent({ ...siteContent, experienceStages: list });
                                      }}
                                      className="w-10 h-9 rounded-lg bg-black border border-white/20 cursor-pointer p-0.5"
                                    />
                                    <input
                                      type="text"
                                      value={stg.color || '#F20D63'}
                                      onChange={(e) => {
                                        const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                                        list[sIdx] = { ...list[sIdx], color: e.target.value };
                                        setSiteContent({ ...siteContent, experienceStages: list });
                                      }}
                                      className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-mono"
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-neutral-400 uppercase mb-1">Description</label>
                                  <textarea
                                    rows={2}
                                    value={stg.description}
                                    onChange={(e) => {
                                      const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                                      list[sIdx] = { ...list[sIdx], description: e.target.value };
                                      setSiteContent({ ...siteContent, experienceStages: list });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  {renderImageUploadField(
                                    `Stage Image (${stg.title})`,
                                    stg.image,
                                    `stage_${sIdx}`,
                                    (url) => {
                                      const list = [...(siteContent.experienceStages || INITIAL_SITE_CONTENT.experienceStages || [])];
                                      list[sIdx] = { ...list[sIdx], image: url };
                                      setSiteContent({ ...siteContent, experienceStages: list });
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. ELIGIBILITY & WHO JOINS SECTION EDITOR */}
                {sectionEditorTab === 'eligibility' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#F20D63]">ELIGIBILITY & WHO CAN ENQUIRE</h3>
                          <p className="text-xs text-neutral-400">Target demographics, no-age-limit badge, and key checklist perks.</p>
                        </div>
                        <UserCheck className="w-5 h-5 text-[#F20D63]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Section Eyebrow Tag</label>
                          <input
                            type="text"
                            value={siteContent.eligibilityTitle || 'STUDIO ELIGIBILITY & ENROLMENT'}
                            onChange={(e) => setSiteContent({ ...siteContent, eligibilityTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Highlight Word / Phrase</label>
                          <input
                            type="text"
                            value={siteContent.eligibilityHighlightWord || 'ENQUIRE & JOIN?'}
                            onChange={(e) => setSiteContent({ ...siteContent, eligibilityHighlightWord: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-[#F20D63] font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Main Headline</label>
                          <input
                            type="text"
                            value={siteContent.eligibilityHeadline || 'WHO CAN'}
                            onChange={(e) => setSiteContent({ ...siteContent, eligibilityHeadline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Prominent Age & Passout Badge</label>
                          <input
                            type="text"
                            value={siteContent.eligibilityBadge || 'ANYONE WHO HAS PASSED 10TH OR 12TH — NO MATTER YOUR AGE!'}
                            onChange={(e) => setSiteContent({ ...siteContent, eligibilityBadge: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-[#FFB800] font-bold"
                          />
                        </div>
                      </div>

                      {/* 4 Demographics Cards */}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-white">
                            TARGET DEMOGRAPHICS ({(siteContent.eligibilityCategories || INITIAL_SITE_CONTENT.eligibilityCategories || []).length} CARDS)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(siteContent.eligibilityCategories || INITIAL_SITE_CONTENT.eligibilityCategories || [])];
                              list.push({ title: 'New Category', desc: 'Description of eligibility...' });
                              setSiteContent({ ...siteContent, eligibilityCategories: list });
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD CATEGORY</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(siteContent.eligibilityCategories || INITIAL_SITE_CONTENT.eligibilityCategories || []).map((cat, cIdx) => (
                            <div key={cIdx} className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-3">
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  value={cat.title}
                                  onChange={(e) => {
                                    const list = [...(siteContent.eligibilityCategories || INITIAL_SITE_CONTENT.eligibilityCategories || [])];
                                    list[cIdx] = { ...list[cIdx], title: e.target.value };
                                    setSiteContent({ ...siteContent, eligibilityCategories: list });
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-xl bg-black border border-white/20 text-white font-bold text-xs"
                                  placeholder="Category Title"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = (siteContent.eligibilityCategories || INITIAL_SITE_CONTENT.eligibilityCategories || []).filter((_, i) => i !== cIdx);
                                    setSiteContent({ ...siteContent, eligibilityCategories: list });
                                  }}
                                  className="p-1.5 ml-2 rounded-lg text-neutral-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={cat.desc}
                                onChange={(e) => {
                                  const list = [...(siteContent.eligibilityCategories || INITIAL_SITE_CONTENT.eligibilityCategories || [])];
                                  list[cIdx] = { ...list[cIdx], desc: e.target.value };
                                  setSiteContent({ ...siteContent, eligibilityCategories: list });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-neutral-300 text-xs"
                                placeholder="Category Description"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Key Highlights Checklist */}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-white">
                            BOTTOM CHECKLIST PERKS ({(siteContent.eligibilityHighlights || INITIAL_SITE_CONTENT.eligibilityHighlights || []).length} ITEMS)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(siteContent.eligibilityHighlights || INITIAL_SITE_CONTENT.eligibilityHighlights || [])];
                              list.push('New Enrolment Perk');
                              setSiteContent({ ...siteContent, eligibilityHighlights: list });
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD PERK</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(siteContent.eligibilityHighlights || INITIAL_SITE_CONTENT.eligibilityHighlights || []).map((hl, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={hl}
                                onChange={(e) => {
                                  const list = [...(siteContent.eligibilityHighlights || INITIAL_SITE_CONTENT.eligibilityHighlights || [])];
                                  list[hIdx] = e.target.value;
                                  setSiteContent({ ...siteContent, eligibilityHighlights: list });
                                }}
                                className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (siteContent.eligibilityHighlights || INITIAL_SITE_CONTENT.eligibilityHighlights || []).filter((_, i) => i !== hIdx);
                                  setSiteContent({ ...siteContent, eligibilityHighlights: list });
                                }}
                                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. ADMISSIONS CALLOUT SECTION EDITOR */}
                {sectionEditorTab === 'admissions' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#F20D63]">ADMISSIONS CALLOUT BANNER</h3>
                          <p className="text-xs text-neutral-400">Pre-footer conversion banner, CTA button, and program inclusions.</p>
                        </div>
                        <Flame className="w-5 h-5 text-[#F20D63]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Badge Eyebrow</label>
                          <input
                            type="text"
                            value={siteContent.admissionsBadge || 'ADMISSIONS OPEN 2026 – 2027'}
                            onChange={(e) => setSiteContent({ ...siteContent, admissionsBadge: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Highlight Word / Phrase</label>
                          <input
                            type="text"
                            value={siteContent.admissionsHighlightWord || 'YOUR BRAND.'}
                            onChange={(e) => setSiteContent({ ...siteContent, admissionsHighlightWord: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-[#FFB800] font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Main Headline</label>
                          <input
                            type="text"
                            value={siteContent.admissionsHeadline || 'YOUR PASSION. YOUR FUTURE.'}
                            onChange={(e) => setSiteContent({ ...siteContent, admissionsHeadline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-bold text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Description Paragraph</label>
                          <textarea
                            rows={3}
                            value={siteContent.admissionsDescription || ''}
                            onChange={(e) => setSiteContent({ ...siteContent, admissionsDescription: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white leading-relaxed text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">CTA Button Text</label>
                          <input
                            type="text"
                            value={siteContent.admissionsButtonText || 'ENQUIRE ABOUT 2026 BATCHES'}
                            onChange={(e) => setSiteContent({ ...siteContent, admissionsButtonText: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          {renderImageUploadField(
                            'Admissions Overlay Background Image',
                            siteContent.admissionsImage || '/images/hero_fashion_model.jpg',
                            'admissionsImage',
                            (url) => setSiteContent({ ...siteContent, admissionsImage: url })
                          )}
                        </div>
                      </div>

                      {/* Program Inclusions (Right Box) */}
                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-white">
                            PROGRAM INCLUSIONS ({(siteContent.admissionsInclusions || INITIAL_SITE_CONTENT.admissionsInclusions || []).length} ITEMS)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(siteContent.admissionsInclusions || INITIAL_SITE_CONTENT.admissionsInclusions || [])];
                              list.push({
                                title: 'New Program Highlight',
                                subtitle: 'Key syllabus summary...',
                                color: '#F20D63',
                              });
                              setSiteContent({ ...siteContent, admissionsInclusions: list });
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD INCLUSION</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(siteContent.admissionsInclusions || INITIAL_SITE_CONTENT.admissionsInclusions || []).map((inc, iIdx) => (
                            <div key={iIdx} className="p-4 rounded-2xl bg-black/60 border border-white/15 flex flex-col sm:flex-row sm:items-center gap-3">
                              <input
                                type="color"
                                value={inc.color || '#F20D63'}
                                onChange={(e) => {
                                  const list = [...(siteContent.admissionsInclusions || INITIAL_SITE_CONTENT.admissionsInclusions || [])];
                                  list[iIdx] = { ...list[iIdx], color: e.target.value };
                                  setSiteContent({ ...siteContent, admissionsInclusions: list });
                                }}
                                className="w-9 h-9 rounded-lg bg-black border border-white/20 cursor-pointer p-0.5 shrink-0"
                              />
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <input
                                  type="text"
                                  value={inc.title}
                                  onChange={(e) => {
                                    const list = [...(siteContent.admissionsInclusions || INITIAL_SITE_CONTENT.admissionsInclusions || [])];
                                    list[iIdx] = { ...list[iIdx], title: e.target.value };
                                    setSiteContent({ ...siteContent, admissionsInclusions: list });
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-white font-bold"
                                  placeholder="Title"
                                />
                                <input
                                  type="text"
                                  value={inc.subtitle}
                                  onChange={(e) => {
                                    const list = [...(siteContent.admissionsInclusions || INITIAL_SITE_CONTENT.admissionsInclusions || [])];
                                    list[iIdx] = { ...list[iIdx], subtitle: e.target.value };
                                    setSiteContent({ ...siteContent, admissionsInclusions: list });
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-neutral-300"
                                  placeholder="Subtitle"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (siteContent.admissionsInclusions || INITIAL_SITE_CONTENT.admissionsInclusions || []).filter((_, i) => i !== iIdx);
                                  setSiteContent({ ...siteContent, admissionsInclusions: list });
                                }}
                                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. CAMPUS & CONTACT SECTION EDITOR */}
                {sectionEditorTab === 'contact' && (
                  <div className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black uppercase text-[#1749C6]">CAMPUS LOCATION & CONTACT DETAILS</h3>
                          <p className="text-xs text-neutral-400">Address, phone numbers, email, WhatsApp, and academic year settings.</p>
                        </div>
                        <Building2 className="w-5 h-5 text-[#1749C6]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Section Eyebrow Tag</label>
                          <input
                            type="text"
                            value={siteContent.contactTitle || 'VISIT OUR CAMPUS & GET IN TOUCH'}
                            onChange={(e) => setSiteContent({ ...siteContent, contactTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Headline</label>
                          <input
                            type="text"
                            value={siteContent.contactHeadline || 'CONNECT WITH SW INSTITUTE'}
                            onChange={(e) => setSiteContent({ ...siteContent, contactHeadline: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 uppercase mb-1">Campus Physical Address</label>
                          <textarea
                            rows={2}
                            value={siteContent.contactAddress}
                            onChange={(e) => setSiteContent({ ...siteContent, contactAddress: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white leading-relaxed"
                            placeholder="Vaishali Nagar, Bhilai, Chhattisgarh 490023"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Direct Phone Number</label>
                          <input
                            type="text"
                            value={siteContent.contactPhone}
                            onChange={(e) => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">WhatsApp Support Number</label>
                          <input
                            type="text"
                            value={siteContent.contactWhatsapp}
                            onChange={(e) => setSiteContent({ ...siteContent, contactWhatsapp: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Official Email Address</label>
                          <input
                            type="email"
                            value={siteContent.contactEmail}
                            onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 uppercase mb-1">Academic Year</label>
                          <input
                            type="text"
                            value={siteContent.academicYear}
                            onChange={(e) => setSiteContent({ ...siteContent, academicYear: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-white/10">
                            <div>
                              <span className="block font-bold text-white text-sm">Admissions Open Status</span>
                              <span className="text-neutral-400 text-xs">Controls the active status badge shown on forms and banners.</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSiteContent({ ...siteContent, admissionsOpen: !siteContent.admissionsOpen })}
                              className={`px-5 py-2 rounded-full font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
                                siteContent.admissionsOpen
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {siteContent.admissionsOpen ? '✓ OPEN' : '✕ CLOSED'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Global Save Bar for Section Editor */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black uppercase text-white">READY TO PUBLISH YOUR CHANGES?</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Saves immediately to local storage and syncs directly to Cloud Firestore.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveAll}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#F20D63] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE ALL SECTION EDITS</span>
                  </button>
                </div>
              </div>
            )}

            {/* COURSES MANAGER */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black uppercase">COURSES & DIPLOMAS</h1>
                    <p className="text-xs text-neutral-400 mt-1">
                      Add, update, or remove diploma programs.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddCourse(!showAddCourse)}
                    className="px-5 py-2.5 rounded-full bg-[#F20D63] text-white font-black text-xs uppercase flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD NEW COURSE</span>
                  </button>
                </div>

                {/* Add Course Form */}
                {showAddCourse && (
                  <form
                    onSubmit={handleCreateCourse}
                    className="p-6 rounded-3xl bg-white/10 border border-white/20 space-y-4 text-xs font-semibold"
                  >
                    <h3 className="text-lg font-black uppercase text-[#FFB800]">
                      CREATE NEW PROGRAM
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">Title</label>
                        <input
                          type="text"
                          required
                          placeholder="DIPLOMA IN CREATIVE FASHION"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">Category</label>
                        <select
                          value={newCourse.category}
                          onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value as 'Fashion' | 'Interior' })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                        >
                          <option value="Fashion">Fashion</option>
                          <option value="Interior">Interior</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-neutral-300 uppercase mb-1">Subtitle</label>
                      <input
                        type="text"
                        placeholder="Garment Styling & Brand Launch"
                        value={newCourse.subtitle}
                        onChange={(e) => setNewCourse({ ...newCourse, subtitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 uppercase mb-1">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Full course description..."
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-full bg-[#F20D63] text-white font-bold uppercase cursor-pointer"
                      >
                        SAVE COURSE
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCourse(false)}
                        className="px-6 py-3 rounded-full bg-white/10 text-white font-bold uppercase cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}

                {/* Course List */}
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div>
                          <span className="text-[10px] font-mono text-[#F20D63] uppercase font-bold">
                            {course.category} DIPLOMA
                          </span>
                          <h3 className="text-xl font-black uppercase text-white">{course.title}</h3>
                          <p className="text-xs text-neutral-400 mt-0.5">{course.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY MANAGER */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black uppercase">STUDENT WORK & GALLERY</h1>
                    <p className="text-xs text-neutral-400 mt-1">
                      Manage &quot;Made at SW&quot; editorial portfolio items.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddGallery(!showAddGallery)}
                    className="px-5 py-2.5 rounded-full bg-[#FFB800] text-black font-black text-xs uppercase flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD SHOWCASE</span>
                  </button>
                </div>

                {/* Add Gallery Form */}
                {showAddGallery && (
                  <form
                    onSubmit={handleCreateGalleryItem}
                    className="p-6 rounded-3xl bg-white/10 border border-white/20 space-y-4 text-xs font-semibold"
                  >
                    <h3 className="text-lg font-black uppercase text-[#F20D63]">
                      NEW STUDENT SHOWCASE ITEM
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">Project Title</label>
                        <input
                          type="text"
                          required
                          placeholder="Haute Couture Collection"
                          value={newGalleryItem.title}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">Category</label>
                        <select
                          value={newGalleryItem.category}
                          onChange={(e) =>
                            setNewGalleryItem({
                              ...newGalleryItem,
                              category: e.target.value as GalleryItem['category'],
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                        >
                          <option value="Fashion">Fashion</option>
                          <option value="Interior">Interior</option>
                          <option value="Sketches">Sketches</option>
                          <option value="Workshops">Workshops</option>
                          <option value="Events">Events</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">Student Creator Name</label>
                        <input
                          type="text"
                          placeholder="Aanya Sharma"
                          value={newGalleryItem.studentName}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, studentName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">Academic Year</label>
                        <input
                          type="text"
                          placeholder="2026"
                          value={newGalleryItem.year}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, year: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button type="submit" className="px-6 py-3 rounded-full bg-[#FFB800] text-black font-bold uppercase cursor-pointer">
                        ADD ITEM
                      </button>
                      <button type="button" onClick={() => setShowAddGallery(false)} className="px-6 py-3 rounded-full bg-white/10 text-white font-bold uppercase cursor-pointer">
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
                    >
                      <img
                        src={g.image}
                        alt={g.title}
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />
                      <div>
                        <span className="text-[10px] font-mono text-[#FFB800] uppercase font-bold">
                          {g.category}
                        </span>
                        <h4 className="font-black text-sm uppercase text-white">{g.title}</h4>
                        <p className="text-xs text-neutral-400 mt-1">Student: {g.studentName || 'N/A'}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                        <button
                          onClick={() => handleDeleteGalleryItem(g.id)}
                          className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CLOUD DATABASE & CONTACT SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h1 className="text-3xl font-black uppercase">CLOUD DATABASE & SYSTEM SETTINGS</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage real-time Firebase Firestore synchronization, ImgBB image CDN uploads, and campus contact details.
                  </p>
                </div>

                {/* ONE-CLICK FULL CLOUD SYNC CARD */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121216] via-[#161622] to-[#121216] border border-[#00F0FF]/30 shadow-xl shadow-cyan-500/5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#F20D63]/20 text-[#00F0FF] border border-white/10 shrink-0">
                        <CloudUpload className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-black uppercase tracking-wide text-white flex items-center gap-2">
                          One-Click Master Cloud Sync
                          <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-[9px] font-mono font-bold tracking-widest border border-[#00F0FF]/30">
                            FIRESTORE + IMGBB
                          </span>
                        </h2>
                        <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                          Automatically scans all existing website data (real or demo), uploads all logos, hero 3D renders, course cards, and gallery artworks to <strong>ImgBB CDN</strong>, and synchronizes the complete database (content, courses, gallery, and enquiries) to <strong>Firebase Firestore</strong>.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleFullCloudSync}
                      disabled={isFullSyncing}
                      className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#1749C6] to-[#F20D63] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <CloudUpload className="w-4 h-4" />
                      <span>{isFullSyncing ? 'SYNCING ALL DATA...' : 'MIGRATE & SYNC ALL DATA NOW'}</span>
                    </button>
                  </div>

                  {siteContent.lastCloudSync && (
                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2 pt-2 border-t border-white/5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Last Successful Full Cloud Sync: {new Date(siteContent.lastCloudSync).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  )}
                </div>

                {/* 1. FIREBASE FIRESTORE CLOUD DATABASE */}
                <div className="p-6 rounded-2xl bg-[#18181D] border border-white/10 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#F20D63]/20 text-[#F20D63]">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                          Firebase Firestore Database
                        </h2>
                        <p className="text-xs text-neutral-400">
                          Enables instant real-time live content sync across all visitor devices & stores student admission enquiries.
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      CONNECTED: {siteContent.firebaseConfig?.projectId || 'swinstitute0'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-neutral-400 uppercase mb-1">Firebase Project ID</label>
                      <input
                        type="text"
                        value={siteContent.firebaseConfig?.projectId || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            firebaseConfig: { ...(siteContent.firebaseConfig || {}), projectId: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-mono"
                        placeholder="swinstitute0"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 uppercase mb-1">Firebase API Key</label>
                      <input
                        type="password"
                        value={siteContent.firebaseConfig?.apiKey || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            firebaseConfig: { ...(siteContent.firebaseConfig || {}), apiKey: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-mono"
                        placeholder="AIzaSy..."
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 uppercase mb-1">Auth Domain</label>
                      <input
                        type="text"
                        value={siteContent.firebaseConfig?.authDomain || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            firebaseConfig: { ...(siteContent.firebaseConfig || {}), authDomain: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-mono"
                        placeholder="swinstitute0.firebaseapp.com"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 uppercase mb-1">Storage Bucket</label>
                      <input
                        type="text"
                        value={siteContent.firebaseConfig?.storageBucket || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            firebaseConfig: { ...(siteContent.firebaseConfig || {}), storageBucket: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-mono"
                        placeholder="swinstitute0.firebasestorage.app"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 uppercase mb-1">Messaging Sender ID</label>
                      <input
                        type="text"
                        value={siteContent.firebaseConfig?.messagingSenderId || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            firebaseConfig: { ...(siteContent.firebaseConfig || {}), messagingSenderId: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-mono"
                        placeholder="310303663506"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 uppercase mb-1">App ID</label>
                      <input
                        type="text"
                        value={siteContent.firebaseConfig?.appId || ''}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            firebaseConfig: { ...(siteContent.firebaseConfig || {}), appId: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-mono"
                        placeholder="1:310303663506:web:..."
                      />
                    </div>
                  </div>

                  {firebaseTestMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        firebaseTestStatus === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : firebaseTestStatus === 'error'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-white/5 text-neutral-300'
                      }`}
                    >
                      {firebaseTestMessage}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestFirebase}
                      disabled={firebaseTestStatus === 'testing'}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{firebaseTestStatus === 'testing' ? 'Testing Connection...' : 'Test Cloud Firestore Connection'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. IMGBB CDN IMAGE STORAGE */}
                <div className="p-6 rounded-2xl bg-[#18181D] border border-white/10 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#00F0FF]/20 text-[#00F0FF]">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                          ImgBB Cloud Image Storage (CDN)
                        </h2>
                        <p className="text-xs text-neutral-400">
                          Uploaded institute logos, course artworks, and student portfolio photos upload directly to ImgBB CDN.
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      SECURE SERVER PROXY
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Environment Variable:</span>
                      <span className="font-mono text-emerald-400 text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/10">IMGBB_API_KEY (Server Secret)</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Image uploads are securely handled by the server endpoint <code className="text-[#00F0FF]">/api/upload</code> with session authentication, format validation, and 10MB limits. The secret key is never leaked to the browser.
                    </p>
                  </div>

                  {imgbbTestMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        imgbbTestStatus === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : imgbbTestStatus === 'error'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-white/5 text-neutral-300'
                      }`}
                    >
                      {imgbbTestMessage}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestImgBB}
                      disabled={imgbbTestStatus === 'testing'}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imgbbTestStatus === 'testing' ? 'Verifying...' : 'Test ImgBB CDN Upload'}</span>
                    </button>
                  </div>
                </div>

                {/* 3. CONTACT & LOCATION SETTINGS */}
                <div className="p-6 rounded-2xl bg-[#18181D] border border-white/10 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-white">Campus Location & Contacts</h2>
                      <p className="text-xs text-neutral-400">Public phone numbers, official WhatsApp helpline, and campus address.</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={siteContent.contactPhone}
                          onChange={(e) => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 uppercase mb-1">WhatsApp Number</label>
                        <input
                          type="text"
                          value={siteContent.contactWhatsapp}
                          onChange={(e) => setSiteContent({ ...siteContent, contactWhatsapp: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase mb-1">Official Email</label>
                      <input
                        type="email"
                        value={siteContent.contactEmail}
                        onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase mb-1">Bhilai Campus Address</label>
                      <textarea
                        rows={2}
                        value={siteContent.contactAddress}
                        onChange={(e) => setSiteContent({ ...siteContent, contactAddress: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* SAVE ALL SETTINGS */}
                <div className="pt-2">
                  <button
                    onClick={handleSaveAll}
                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#F20D63] hover:bg-[#d90b56] text-white font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-[#F20D63]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE ALL SETTINGS & SYNC TO CLOUD</span>
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Embedded Live Preview Panel */}
          {livePreview && (
            <div className="w-1/2 bg-neutral-900 border-l border-white/15 flex flex-col hidden lg:flex">
              <div className="p-3 bg-black border-b border-white/10 text-xs font-mono flex items-center justify-between text-neutral-400">
                <span>LIVE PREVIEW SIMULATOR (swinstitute.in)</span>
                <span className="text-[#25D366] font-bold">● REACTIVE INTERACTION ACTIVE</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src="/"
                  title="SW Institute Live Website Preview"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Cloud Sync Interactive Progress & Result Modal */}
      <AnimatePresence>
        {showSyncModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-[#141419] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#00F0FF]/20 to-[#F20D63]/20 text-[#00F0FF] border border-white/10">
                    <CloudUpload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wide">Master Cloud Synchronization</h3>
                    <p className="text-[11px] font-mono text-neutral-400">Firebase Firestore & ImgBB CDN</p>
                  </div>
                </div>
                {!isFullSyncing && (
                  <button
                    onClick={() => setShowSyncModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Progress Visualizer */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-neutral-400">Sync Progress</span>
                  <span className="text-[#00F0FF]">{fullSyncProgress}%</span>
                </div>
                <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F0FF] via-[#1749C6] to-[#F20D63] rounded-full transition-all duration-300"
                    style={{ width: `${fullSyncProgress}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-300 font-mono flex items-center gap-2 pt-1">
                  {isFullSyncing && <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF] shrink-0" />}
                  <span>{fullSyncStatusText}</span>
                </p>
              </div>

              {/* Result Summary */}
              {fullSyncResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                    fullSyncResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {fullSyncResult.success ? (
                    <>
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>CLOUD SYNC COMPLETE & VERIFIED!</span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-neutral-300 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span><strong>{fullSyncResult.imagesUploaded}</strong> media files uploaded & converted to ImgBB CDN URLs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>Site copy, courses & gallery saved to Firestore <strong>sw_site/content</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span><strong>{fullSyncResult.enquiriesSynced}</strong> real/dummy enquiries synced to collection <strong>enquiries</strong></span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <div className="font-bold text-rose-400">Sync Incomplete</div>
                        <div className="text-[11px] text-neutral-300 mt-0.5">{fullSyncResult.error}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {fullSyncResult ? (
                  <button
                    onClick={() => setShowSyncModal(false)}
                    className="w-full py-3.5 rounded-full bg-white text-black font-black uppercase text-xs tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg"
                  >
                    DONE / CLOSE
                  </button>
                ) : (
                  <p className="text-[11px] text-neutral-500 text-center font-mono">
                    Please keep this browser window open while uploading media to CDN...
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
