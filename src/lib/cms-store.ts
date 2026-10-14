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
    headerLogo: '/images/sw-logo-mark-dark.png',
    mobileHeaderLogo: '/images/sw-logo-mark-dark.png',
    footerLogo: '/images/sw-logo-mark-dark.png',
    adminLogo: '/images/sw-logo-mark-light.png',
    brandSymbol: '/images/sw-logo-mark-dark.png',
  },
  sectionOrder: INITIAL_SECTIONS,

  // 1. Hero Section
  heroHeading: 'DESIGN YOUR FUTURE. BUILD YOUR BRAND.',
  heroHighlightWord: 'YOUR FUTURE.',
  heroSubheading: 'South West Institute of Design and Innovation',
  tagline: 'LEARN. CREATE. GROW. LEAD YOUR WORLD.',
  announcement: 'Admissions Open 2026–2027 • Limited Seats Available',
  heroTag1: '★ DIGITAL MARKETING INCLUDED',
  heroTag2: 'FASHION & STYLING LAB',
  heroTag3: '3D SPATIAL VISUALIZATION',
  heroImage1: '/images/hero_interior_render.jpg',
  heroImage2: '/images/hero_fashion_model.jpg',
  heroCtaExplore: 'EXPLORE PROGRAMS',
  heroCtaEnquire: 'ENQUIRE NOW',

  // 2. About Section
  aboutTitle: 'WHO WE ARE',
  aboutHeadline: "We don't just teach design. We shape creators and future-ready leaders.",
  aboutHighlightWord: 'WE SHAPE CREATORS.',
  aboutStory:
    'South West Institute of Design and Innovation is a premier institute dedicated to nurturing creative minds. We believe in holistic education that combines creative design skills with real-world digital marketing knowledge to empower you to launch your career or build your own brand with confidence.',
  stat1Label: 'Practical Exposure',
  stat1Val: '100%',
  stat2Label: 'Digital Marketing',
  stat2Val: 'Included',
  aboutPillars: [
    {
      id: '01',
      title: 'DESIGN THINKING',
      subtitle: 'Nurturing Originality & Creative Problem Solving',
      description:
        'We teach you how to conceptualize from raw inspiration to finished masterpiece. Develop your distinct creative voice through sketch ideation, material experimentation, and spatial aesthetics.',
      image: '/images/hero_fashion_model.jpg',
      badge: 'FASHION & CONCEPT',
      color: '#F20D63',
    },
    {
      id: '02',
      title: 'PRACTICAL LEARNING',
      subtitle: 'Real Projects, Live Studios & Industry Exposure',
      description:
        'Say goodbye to purely theoretical education. Work on real residential space planning, haute couture draping, site visits, materials workshops, and live photoshoots from day one.',
      image: '/images/hero_interior_render.jpg',
      badge: 'SPATIAL & LIVE SITES',
      color: '#1749C6',
    },
    {
      id: '03',
      title: 'DIGITAL EXCELLENCE',
      subtitle: 'Integrated Marketing & Personal Brand Building',
      description:
        'Great design deserves to be seen. Every student learns social media promotion, portfolio presentation, Instagram brand strategy, and client acquisition alongside core design skills.',
      image: '/images/digital_marketing_laptop.jpg',
      badge: 'BRANDING & MARKETING',
      color: '#FFB800',
    },
  ],

  // 3. Programs Section
  programsTitle: 'EXPLORE OUR DIPLOMA PROGRAMS',
  programsSubheading: 'Industry-aligned hands-on programs designed to take you from foundational sketching to full brand launch.',

  // 4. Digital Marketing Section
  dmTitle: 'DIGITAL MARKETING INCLUDED',
  dmHeadline: 'BECAUSE GREAT DESIGN DESERVES AN AUDIENCE.',
  dmHighlightWord: 'LEARN TO MARKET IT.',
  dmDescription:
    'Most design institutes stop at teaching creation. At SW Institute, we equip every student with full-stack digital marketing—so you can launch your label, attract premium clients, and build an online empire.',
  dmImage: '/images/digital_marketing_laptop.jpg',
  dmBadgeTitle: 'DIGITAL PROMOTION & BRANDING STUDIO',
  dmBadgeHeading: 'Market Your Vision. Build Your Empire.',
  dmFeatures: [
    { num: '01', title: 'Social Media Launchpad', desc: 'Create viral reels, aesthetic grid layouts, and targeted campaign funnels for your studio.' },
    { num: '02', title: 'Personal Branding', desc: 'Position yourself as an authority fashion designer or interior consultant in your region.' },
    { num: '03', title: 'Client Acquisition', desc: 'Learn how to quote design fees, win commercial projects, and close high-value clients.' },
  ],
  dmTags: [
    { label: 'Instagram Growth', color: '#F20D63', textColor: '#FFFFFF' },
    { label: 'Facebook Ads', color: '#1749C6', textColor: '#FFFFFF' },
    { label: 'Personal Branding', color: '#FFB800', textColor: '#0B0B0D' },
    { label: 'Social Media Strategy', color: '#0B0B0D', textColor: '#FFFFFF' },
    { label: 'Content Creation', color: '#F20D63', textColor: '#FFFFFF' },
    { label: 'Client Acquisition', color: '#1749C6', textColor: '#FFFFFF' },
  ],

  // 5. Why SW Section
  whySWTitle: 'WHY CHOOSE SW INSTITUTE',
  whySWHeadline: 'BUILT FOR CREATORS WHO WANT TO WIN.',
  whySWHighlightWord: 'SW INSTITUTE?',
  whySWSubtitle: 'Designed for ambitious creators who demand more than a traditional degree. We combine artistry, technology, and business acumen.',
  whySWReasons: [
    {
      num: '01',
      title: 'PRACTICAL LEARNING',
      tagline: 'Real projects. Live studio skills.',
      description:
        'Ditch abstract theory. You work on live architectural blueprints, fabric draping, client briefs, and real construction materials from week one.',
      color: '#F20D63',
    },
    {
      num: '02',
      title: 'INDUSTRY EXPOSURE',
      tagline: 'Learn beyond the classroom.',
      description:
        'Site visits to luxury interior spaces, fashion runway shows, textile mill walkthroughs, and commercial photography studios.',
      color: '#1749C6',
    },
    {
      num: '03',
      title: 'EXPERT MENTORSHIP',
      tagline: 'Guidance from active professionals.',
      description:
        'Our faculty members are practicing interior architects, celebrity fashion stylists, and digital marketing agency strategists.',
      color: '#FFB800',
    },
    {
      num: '04',
      title: 'ENTREPRENEURSHIP MINDSET',
      tagline: 'Launch your own studio or brand.',
      description:
        'We don’t just train employees; we train founders. Learn pricing, client contract drafting, personal branding, and studio setup.',
      color: '#F20D63',
    },
    {
      num: '05',
      title: 'CAREER & PLACEMENT SUPPORT',
      tagline: 'Internships and professional portfolio.',
      description:
        'Graduate with an Awwwards-worthy physical and digital portfolio. Direct internship placements with top design firms in CG and nationwide.',
      color: '#1749C6',
    },
  ],

  // 6. Experience Timeline (6 Stages)
  experienceTitle: 'THE STUDENT JOURNEY',
  experienceHeadline: 'THE SW EXPERIENCE',
  experienceHighlightWord: 'SW EXPERIENCE',
  experienceSubtitle: 'From your very first sketch to launching your brand online—experience a structured, 6-stage transformation.',
  experienceStages: [
    {
      stage: '01. DISCOVER',
      title: 'CREATIVE ORIENTATION',
      subtitle: 'Unlocking Design Thinking & Vision',
      description:
        'Begin your journey with immersive creative workshops. Explore color theory, moodboards, architectural fundamentals, and fashion silhouettes.',
      image: '/images/hero_fashion_model.jpg',
      color: '#F20D63',
    },
    {
      stage: '02. LEARN',
      title: 'FOUNDATIONAL MASTERY',
      subtitle: 'Technical Sketching & CAD Visualization',
      description:
        'Master the tools of the trade. Learn garment pattern drafting, 2D/3D interior CAD rendering, fabric science, and spatial lighting composition.',
      image: '/images/hero_interior_render.jpg',
      color: '#1749C6',
    },
    {
      stage: '03. CREATE',
      title: 'HANDS-ON STUDIO PRODUCTION',
      subtitle: 'Material Draping & 3D Spatial Models',
      description:
        'Step into our live design lab. Bring your concepts to life through garment stitching, upholstery selection, and prototype construction.',
      image: '/images/digital_marketing_laptop.jpg',
      color: '#FFB800',
    },
    {
      stage: '04. PRACTICE',
      title: 'LIVE SITE & INDUSTRY EXPOSURE',
      subtitle: 'Real Client Briefs & Photoshoots',
      description:
        'Work on active residential interior sites and direct fashion runway shoots. Get real feedback from industry leaders and client mentors.',
      image: '/images/hero_interior_render.jpg',
      color: '#F20D63',
    },
    {
      stage: '05. BUILD',
      title: 'DIGITAL MARKETING INTEGRATION',
      subtitle: 'Social Strategy & Personal Branding',
      description:
        'Learn social media content creation, Instagram marketing, targeted ad campaigns, and brand identity so your work reaches paying clients.',
      image: '/images/digital_marketing_laptop.jpg',
      color: '#1749C6',
    },
    {
      stage: '06. LAUNCH',
      title: 'GRADUATION & STUDIO LAUNCH',
      subtitle: 'Portfolio Showcase & Placement',
      description:
        'Showcase your final collection at the annual SW Institute Design Exhibition. Graduate ready to open your studio or join top design firms.',
      image: '/images/hero_fashion_model.jpg',
      color: '#FFB800',
    },
  ],

  // 7. Who Can Apply & Eligibility
  eligibilityTitle: 'STUDIO ELIGIBILITY & ENROLMENT',
  eligibilityHeadline: 'WHO CAN ENQUIRE & JOIN?',
  eligibilityHighlightWord: 'ENQUIRE & JOIN?',
  eligibilityBadge: 'ANYONE WHO HAS PASSED 10TH OR 12TH — NO MATTER YOUR AGE!',
  eligibilityCategories: [
    { title: 'School Passouts', desc: '10th or 12th completed students ready for a creative career.' },
    { title: 'Career Switchers', desc: 'Professionals moving into fashion or interior design.' },
    { title: 'Working Professionals', desc: 'Upskilling in digital marketing and space visualization.' },
    { title: 'Creative Enthusiasts', desc: 'Homemakers and entrepreneurs launching their studio.' },
  ],
  eligibilityHighlights: [
    'No Prior Portfolio Required',
    'Flexible Morning & Afternoon Batches',
    'Free Personal Brand Counseling',
  ],

  // 8. Admissions Callout Section
  admissionsBadge: 'ADMISSIONS OPEN 2026 – 2027',
  admissionsHeadline: 'YOUR PASSION. YOUR FUTURE. YOUR BRAND.',
  admissionsHighlightWord: 'YOUR FUTURE.',
  admissionsDescription:
    'Take the decisive step toward your creative career. Enroll in our industry-ready Diploma programs with digital marketing included.',
  admissionsButtonText: 'ENQUIRE ABOUT 2026 BATCHES',
  admissionsImage: '/images/hero_fashion_model.jpg',
  admissionsInclusions: [
    { title: 'Diploma in Fashion Designing', subtitle: 'Sketching, pattern drafting, draping & styling', color: '#F20D63' },
    { title: 'Diploma in Interior Designing', subtitle: 'Space planning, 3D visualization & furniture design', color: '#1749C6' },
    { title: 'Digital Marketing Included', subtitle: 'Social media growth, branding & client acquisition', color: '#FFB800' },
  ],

  // 9. Contact Info & Admissions
  contactTitle: 'VISIT OUR BHILAI CAMPUS',
  contactHeadline: 'CAMPUS LOCATION & STUDIO DESK',
  contactPhone: '+91 99939 97767',
  contactWhatsapp: '+91 77729 92592',
  contactEmail: 'garvproduction.help@gmail.com',
  contactAddress: 'Beside Panch Mandir, Near Friends Cafe, Gurunanak Market, Vaishali Nagar, Bhilai, Chhattisgarh',
  contactMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.123456789!2d81.332308!3d21.216391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28cddddddddddd%3A0x0!2sGurunanak+Market%2C+Vaishali+Nagar%2C+Bhilai%2C+Chhattisgarh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  contactMapLink: 'https://maps.google.com/?q=Gurunanak+Market+Vaishali+Nagar+Bhilai',
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
    id: 'SW-2026-4891',
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
    id: 'SW-2026-3829',
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
    id: 'SW-2026-7124',
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
      aboutPillars: Array.isArray(parsed.aboutPillars) && parsed.aboutPillars.length > 0
        ? parsed.aboutPillars
        : INITIAL_SITE_CONTENT.aboutPillars,
      dmFeatures: Array.isArray(parsed.dmFeatures) && parsed.dmFeatures.length > 0
        ? parsed.dmFeatures
        : INITIAL_SITE_CONTENT.dmFeatures,
      dmTags: Array.isArray(parsed.dmTags) && parsed.dmTags.length > 0
        ? parsed.dmTags
        : INITIAL_SITE_CONTENT.dmTags,
      whySWReasons: Array.isArray(parsed.whySWReasons) && parsed.whySWReasons.length > 0
        ? parsed.whySWReasons
        : INITIAL_SITE_CONTENT.whySWReasons,
      experienceStages: Array.isArray(parsed.experienceStages) && parsed.experienceStages.length > 0
        ? parsed.experienceStages
        : INITIAL_SITE_CONTENT.experienceStages,
      eligibilityCategories: Array.isArray(parsed.eligibilityCategories) && parsed.eligibilityCategories.length > 0
        ? parsed.eligibilityCategories
        : INITIAL_SITE_CONTENT.eligibilityCategories,
      eligibilityHighlights: Array.isArray(parsed.eligibilityHighlights) && parsed.eligibilityHighlights.length > 0
        ? parsed.eligibilityHighlights
        : INITIAL_SITE_CONTENT.eligibilityHighlights,
      admissionsInclusions: Array.isArray(parsed.admissionsInclusions) && parsed.admissionsInclusions.length > 0
        ? parsed.admissionsInclusions
        : INITIAL_SITE_CONTENT.admissionsInclusions,
      imgbbApiKey: parsed.imgbbApiKey || INITIAL_SITE_CONTENT.imgbbApiKey,
      firebaseConfig: { ...INITIAL_SITE_CONTENT.firebaseConfig, ...(parsed.firebaseConfig || {}) },
      logos: {
        headerLogo: parsed.logos?.headerLogo || INITIAL_SITE_CONTENT.logos?.headerLogo,
        mobileHeaderLogo: parsed.logos?.mobileHeaderLogo || INITIAL_SITE_CONTENT.logos?.mobileHeaderLogo,
        footerLogo: parsed.logos?.footerLogo || INITIAL_SITE_CONTENT.logos?.footerLogo,
        adminLogo: parsed.logos?.adminLogo || INITIAL_SITE_CONTENT.logos?.adminLogo,
        brandSymbol: parsed.logos?.brandSymbol || INITIAL_SITE_CONTENT.logos?.brandSymbol,
      },
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
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const created: Enquiry = {
    ...newEnquiry,
    id: `SW-2026-${randomNum}`,
    name: (newEnquiry.name || '').trim(),
    phone: (newEnquiry.phone || '').trim(),
    email: (newEnquiry.email || '').trim(),
    age: (newEnquiry.age || '').trim(),
    course: newEnquiry.course || 'Both / Not Sure',
    message: (newEnquiry.message || '').trim(),
    timestamp: new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    status: 'New',
  };
  const updated = [created, ...enquiries];
  saveStoredEnquiries(updated);

  if (typeof window !== 'undefined') {
    // 0ms instant notification for current window / components
    window.dispatchEvent(new CustomEvent('sw_new_enquiry', { detail: created }));

    // 0ms instant notification for other open tabs (e.g. SW Studio open in another tab)
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('sw_enquiries_channel');
        channel.postMessage({ type: 'NEW_ENQUIRY', enquiry: created });
        channel.close();
      }
    } catch {}
  }

  // Fire-and-forget Firebase enquiry sync
  saveEnquiryToFirebase(created, content.firebaseConfig);
  return created;
};

