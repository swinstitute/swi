import { Course, GalleryItem, Enquiry, SiteContent, SectionConfig, ColorTheme } from './types';
import { saveContentToFirebase, saveEnquiryToFirebase } from './firebase';

export const COLOR_THEME_PRESETS: Record<ColorTheme['preset'], ColorTheme> = {
  signature: {
    preset: 'signature',
    primaryAccent: '#F20D63',
    secondaryAccent: '#1749C6',
    tertiaryAccent: '#FFB800',
    background: '#F8F7F3',
    foreground: '#0B0B0D',
  },
  'haute-couture': {
    preset: 'haute-couture',
    primaryAccent: '#E60039',
    secondaryAccent: '#2B59FF',
    tertiaryAccent: '#FFD700',
    background: '#0B0B0D',
    foreground: '#F8F7F3',
  },
  'electric-creative': {
    preset: 'electric-creative',
    primaryAccent: '#FF007A',
    secondaryAccent: '#00F0FF',
    tertiaryAccent: '#FCEE21',
    background: '#0F0C20',
    foreground: '#FFFFFF',
  },
  'minimal-luxury': {
    preset: 'minimal-luxury',
    primaryAccent: '#C85A32',
    secondaryAccent: '#4A5568',
    tertiaryAccent: '#E2D8CE',
    background: '#FAFAFA',
    foreground: '#1A1A1A',
  },
  'warm-editorial': {
    preset: 'warm-editorial',
    primaryAccent: '#D46A6A',
    secondaryAccent: '#2D6A4F',
    tertiaryAccent: '#D97706',
    background: '#F5F2EB',
    foreground: '#1C1815',
  },
  custom: {
    preset: 'custom',
    primaryAccent: '#F20D63',
    secondaryAccent: '#1749C6',
    tertiaryAccent: '#FFB800',
    background: '#F8F7F3',
    foreground: '#0B0B0D',
  },
};

export const INITIAL_SECTIONS: SectionConfig[] = [
  { id: 'hero', label: '1. Hero Magazine Banner', visible: true, dividerLabel: 'WHO WE ARE • OUR PHILOSOPHY' },
  { id: 'about', label: '2. About & Philosophy', visible: true, dividerLabel: 'THE CREATIVE PATH • PROGRAMS' },
  { id: 'programs', label: '3. Diploma Programs', visible: true, dividerLabel: 'EXCLUSIVE • DIGITAL MARKETING INCLUDED' },
  { id: 'digital-marketing', label: '4. Digital Marketing Included', visible: true, dividerLabel: 'THE SW ADVANTAGE • WHY CHOOSE US' },
  { id: 'why-sw', label: '5. Why SW Institute', visible: true, dividerLabel: 'MADE AT SW • STUDENT SHOWCASE' },
  { id: 'gallery', label: '6. Student Work Showcase', visible: true, dividerLabel: 'THE SW EXPERIENCE • 6-STAGE JOURNEY' },
  { id: 'experience', label: '7. Experience Timeline', visible: true, dividerLabel: 'ELIGIBILITY • WHO CAN JOIN' },
  { id: 'eligibility', label: '8. Eligibility & Demographics', visible: true, dividerLabel: 'STUDIO ENQUIRY • START YOUR JOURNEY' },
  { id: 'admissions', label: '9. Studio Enquiry Callout', visible: true, dividerLabel: 'VISIT OUR CAMPUS • BHILAI' },
  { id: 'contact', label: '10. Campus Location & Contact', visible: true, dividerLabel: '' },
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  // Integrations & Cloud Config
  imgbbApiKey: '',
  firebaseConfig: {
    apiKey: 'AIzaSyC4MoSpQe_QsgaCoupH2dKmgHSfLrNqhXA',
    authDomain: 'swinstitute0.firebaseapp.com',
    projectId: 'swinstitute0',
    storageBucket: 'swinstitute0.firebasestorage.app',
    messagingSenderId: '310303663506',
    appId: '1:310303663506:web:19032cd9fed954eeaf8d4b',
  },

  // Global Engine Controls
  cursorStyle: 'radial',
  themeMode: 'light',
  colorTheme: COLOR_THEME_PRESETS.signature,
  logos: {
    headerLogo: '',
    mobileHeaderLogo: '',
    footerLogo: '',
    adminLogo: '',
    brandSymbol: '',
  },
  sectionOrder: INITIAL_SECTIONS,

  // Hero Section
  heroHeading: 'DESIGN YOUR FUTURE. BUILD YOUR BRAND.',
  heroSubheading: 'South West Institute of Design and Innovation',
  tagline: 'LEARN. CREATE. GROW. LEAD YOUR WORLD.',
  announcement: 'Admissions Open 2026–2027 • Limited Seats Available',
  heroTag1: '★ DIGITAL MARKETING INCLUDED',
  heroTag2: 'FASHION & STYLING LAB',
  heroTag3: '3D SPATIAL VISUALIZATION',
  heroImage1: '/images/hero_interior_render.jpg',
  heroImage2: '/images/hero_fashion_model.jpg',

  // About Section
  aboutTitle: 'WHO WE ARE',
  aboutHeadline: "We don't just teach design. We shape creators and future-ready leaders.",
  aboutStory:
    'South West Institute of Design and Innovation is a premier institute dedicated to nurturing creative minds. We believe in holistic education that combines creative design skills with real-world digital marketing knowledge to empower you to launch your career or build your own brand with confidence.',
  stat1Label: 'Practical Exposure',
  stat1Val: '100%',
  stat2Label: 'Digital Marketing',
  stat2Val: 'Included',

  // Programs Section
  programsTitle: 'EXPLORE OUR DIPLOMA PROGRAMS',
  programsSubheading: 'Industry-aligned hands-on programs designed to take you from foundational sketching to full brand launch.',

  // Digital Marketing Section
  dmTitle: 'DIGITAL MARKETING INCLUDED',
  dmHeadline: 'BECAUSE GREAT DESIGN DESERVES AN AUDIENCE.',
  dmDescription: 'Every program at SW Institute comes with embedded Digital Marketing training. Learn how to launch your personal brand, run ad campaigns, build an Instagram portfolio, and get high-paying clients.',

  // Why SW Section
  whySWTitle: 'WHY CHOOSE SW INSTITUTE',
  whySWHeadline: 'BUILT FOR CREATORS WHO WANT TO WIN.',

  // Contact Info
  contactPhone: '+91 99939 97767',
  contactWhatsapp: '+91 77729 92592',
  contactEmail: 'garvproduction.help@gmail.com',
  contactAddress: 'Beside Panch Mandir, Near Friends Cafe, Gurunanak Market, Vaishali Nagar, Bhilai, Chhattisgarh',
  admissionsOpen: true,
  academicYear: '2026 - 2027',
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'fashion-design',
    title: 'DIPLOMA IN FASHION DESIGNING',
    category: 'Fashion',
    subtitle: 'Sketching, Garment Construction, Trend Forecasting & Styling',
    description:
      'Master the complete fashion design workflow from creative conceptualization to runway production. Learn pattern drafting, textile study, fashion illustration, garment construction, and collection styling.',
    duration: '1 Year Diploma / Advanced Certification',
    eligibility: '10th / 12th Passout or Equivalent (No age limit)',
    highlights: [
      'Fashion Sketching & Digital Illustration',
      'Pattern Making & Draping Techniques',
      'Garment Construction & Tailoring',
      'Textile Science & Fabric Selection',
      'Portfolio Development & Runway Showcase',
      'Digital Marketing Included for Fashion Branding',
    ],
    image: '/images/hero_fashion_model.jpg',
    accentColor: '#F20D63',
    featured: true,
  },
  {
    id: 'interior-design',
    title: 'DIPLOMA IN INTERIOR DESIGNING',
    category: 'Interior',
    subtitle: 'Space Planning, 3D Visualization, Lighting & Furniture Design',
    description:
      'Transform spaces into functional, beautiful environments. Learn architectural planning, CAD 2D/3D modeling, material science, lighting composition, spatial aesthetics, and client project management.',
    duration: '1 Year Diploma / Advanced Certification',
    eligibility: '10th / 12th Passout or Equivalent (No age limit)',
    highlights: [
      'Residential & Commercial Space Planning',
      '3D Architectural Visualization & Rendering',
      'Lighting, Color Theory & Material Selection',
      'Furniture & Custom Joinery Design',
      'Site Execution & Client Project Management',
      'Digital Marketing Included for Interior Studios',
    ],
    image: '/images/hero_interior_render.jpg',
    accentColor: '#1749C6',
    featured: true,
  },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Editorial Haute Couture Collection',
    category: 'Fashion',
    image: '/images/hero_fashion_model.jpg',
    studentName: 'Aanya Sharma',
    year: '2025',
    aspectRatio: 'tall',
  },
  {
    id: 'g2',
    title: 'Minimalist Architectural Studio',
    category: 'Interior',
    image: '/images/hero_interior_render.jpg',
    studentName: 'Rohan Verma',
    year: '2025',
    aspectRatio: 'wide',
  },
  {
    id: 'g3',
    title: 'Social & Brand Marketing Workshop',
    category: 'Workshops',
    image: '/images/digital_marketing_laptop.jpg',
    studentName: 'SW Studio Class',
    year: '2026',
    aspectRatio: 'square',
  },
  {
    id: 'g4',
    title: 'Avant-Garde Silhouette Sketching',
    category: 'Sketches',
    image: '/images/hero_fashion_model.jpg',
    studentName: 'Priya Patel',
    year: '2025',
    aspectRatio: 'tall',
  },
  {
    id: 'g5',
    title: 'Spatial Material Moodboard Design',
    category: 'Interior',
    image: '/images/hero_interior_render.jpg',
    studentName: 'Vikram Mehta',
    year: '2026',
    aspectRatio: 'square',
  },
  {
    id: 'g6',
    title: 'Live Fashion Showcase & Photoshoot',
    category: 'Events',
    image: '/images/hero_fashion_model.jpg',
    studentName: 'SW Annual Fest',
    year: '2025',
    aspectRatio: 'wide',
  },
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Ananya Deshmukh',
    phone: '+91 98230 11223',
    email: 'ananya.d@gmail.com',
    age: '19',
    course: 'Fashion Design',
    message: 'Interested in the 2026 batch for Fashion Designing with Digital Marketing.',
    timestamp: '2026-10-05 14:30',
    status: 'New',
  },
  {
    id: 'enq-2',
    name: 'Rajesh Kumar',
    phone: '+91 97555 44321',
    email: 'rajesh.k@yahoo.com',
    age: '24',
    course: 'Interior Design',
    message: 'Want to inquire about weekend batch timings and fee structure.',
    timestamp: '2026-10-05 11:15',
    status: 'Contacted',
  },
  {
    id: 'enq-3',
    name: 'Megha Singh',
    phone: '+91 88190 99887',
    email: 'megha.singh@gmail.com',
    age: '21',
    course: 'Both / Not Sure',
    message: 'I want counseling to choose between Fashion and Interior design.',
    timestamp: '2026-10-04 18:45',
    status: 'Enrolled',
  },
];

// LocalStorage Helper for CMS persistence with safe fallback merging
export const getStoredContent = (): SiteContent => {
  if (typeof window === 'undefined') return INITIAL_SITE_CONTENT;
  try {
    const data = localStorage.getItem('sw_site_content');
    if (!data) return INITIAL_SITE_CONTENT;
    const parsed = JSON.parse(data);
    return {
      ...INITIAL_SITE_CONTENT,
      ...parsed,
      imgbbApiKey: parsed.imgbbApiKey || INITIAL_SITE_CONTENT.imgbbApiKey,
      firebaseConfig: { ...INITIAL_SITE_CONTENT.firebaseConfig, ...(parsed.firebaseConfig || {}) },
      logos: { ...INITIAL_SITE_CONTENT.logos, ...(parsed.logos || {}) },
      colorTheme: { ...INITIAL_SITE_CONTENT.colorTheme, ...(parsed.colorTheme || {}) },
      sectionOrder: Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0
        ? parsed.sectionOrder
        : INITIAL_SECTIONS,
    };
  } catch {
    return INITIAL_SITE_CONTENT;
  }
};

export const applySiteTheme = (content: SiteContent) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const theme = content.colorTheme || COLOR_THEME_PRESETS.signature;

  root.style.setProperty('--color-primary', theme.primaryAccent || '#F20D63');
  root.style.setProperty('--color-secondary', theme.secondaryAccent || '#1749C6');
  root.style.setProperty('--color-tertiary', theme.tertiaryAccent || '#FFB800');

  let effectiveMode = content.themeMode || 'light';
  if (effectiveMode === 'auto' && typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    effectiveMode = prefersDark ? 'dark' : 'light';
  }

  root.setAttribute('data-theme', effectiveMode);
  root.setAttribute('data-cursor-style', content.cursorStyle || 'radial');

  if (effectiveMode === 'dark') {
    const isDarkCustom = theme.background && theme.background !== '#F8F7F3' && theme.background !== '#FAFAFA' && theme.background !== '#F5F2EB';
    const bg = isDarkCustom ? theme.background : '#0B0B0D';
    const fg = isDarkCustom ? theme.foreground : '#F8F7F3';

    root.style.setProperty('--background', bg);
    root.style.setProperty('--foreground', fg);
    root.style.setProperty('--card-bg', '#141416');
    root.style.setProperty('--card-border', 'rgba(255, 255, 255, 0.12)');
    root.style.setProperty('--section-alt-bg', '#1A1A1E');
  } else {
    root.style.setProperty('--background', theme.background || '#F8F7F3');
    root.style.setProperty('--foreground', theme.foreground || '#0B0B0D');
    root.style.setProperty('--card-bg', '#FFFFFF');
    root.style.setProperty('--card-border', 'rgba(11, 11, 13, 0.08)');
    root.style.setProperty('--section-alt-bg', '#F2F1EC');
  }
};

export const saveStoredContent = (content: SiteContent) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sw_site_content', JSON.stringify(content));
    applySiteTheme(content);
    window.dispatchEvent(new Event('sw_cms_updated'));
    // Fire-and-forget Firebase sync
    saveContentToFirebase(content, content.firebaseConfig);
  }
};

export const getStoredCourses = (): Course[] => {
  if (typeof window === 'undefined') return INITIAL_COURSES;
  try {
    const data = localStorage.getItem('sw_courses');
    return data ? JSON.parse(data) : INITIAL_COURSES;
  } catch {
    return INITIAL_COURSES;
  }
};

export const saveStoredCourses = (courses: Course[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sw_courses', JSON.stringify(courses));
    window.dispatchEvent(new Event('sw_cms_updated'));
  }
};

export const getStoredGallery = (): GalleryItem[] => {
  if (typeof window === 'undefined') return INITIAL_GALLERY;
  try {
    const data = localStorage.getItem('sw_gallery');
    return data ? JSON.parse(data) : INITIAL_GALLERY;
  } catch {
    return INITIAL_GALLERY;
  }
};

export const saveStoredGallery = (gallery: GalleryItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sw_gallery', JSON.stringify(gallery));
    window.dispatchEvent(new Event('sw_cms_updated'));
  }
};

export const getStoredEnquiries = (): Enquiry[] => {
  if (typeof window === 'undefined') return INITIAL_ENQUIRIES;
  try {
    const data = localStorage.getItem('sw_enquiries');
    return data ? JSON.parse(data) : INITIAL_ENQUIRIES;
  } catch {
    return INITIAL_ENQUIRIES;
  }
};

export const saveStoredEnquiries = (enquiries: Enquiry[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sw_enquiries', JSON.stringify(enquiries));
    window.dispatchEvent(new Event('sw_cms_updated'));
  }
};

export const addEnquiry = (newEnquiry: Omit<Enquiry, 'id' | 'timestamp' | 'status'>): Enquiry => {
  const enquiries = getStoredEnquiries();
  const content = getStoredContent();
  const created: Enquiry = {
    ...newEnquiry,
    id: `enq-${Date.now()}`,
    timestamp: new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    status: 'New',
  };
  const updated = [created, ...enquiries];
  saveStoredEnquiries(updated);
  // Fire-and-forget Firebase enquiry sync
  saveEnquiryToFirebase(created, content.firebaseConfig);
  return created;
};

