export interface Course {
  id: string;
  title: string;
  category: 'Fashion' | 'Interior';
  subtitle: string;
  description: string;
  duration: string;
  eligibility: string;
  highlights: string[];
  image: string;
  accentColor: string;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Fashion' | 'Interior' | 'Sketches' | 'Workshops' | 'Events';
  image: string;
  studentName?: string;
  year?: string;
  aspectRatio: 'square' | 'tall' | 'wide';
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: string;
  course: 'Fashion Design' | 'Interior Design' | 'Both / Not Sure';
  message?: string;
  timestamp: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Archived' | 'Closed';
}

export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
  dividerLabel: string;
}

export interface ColorTheme {
  preset: 'signature' | 'haute-couture' | 'electric-creative' | 'minimal-luxury' | 'warm-editorial' | 'custom';
  primaryAccent: string;
  secondaryAccent: string;
  tertiaryAccent: string;
  background: string;
  foreground: string;
}

export interface SiteLogos {
  headerLogo?: string;
  mobileHeaderLogo?: string;
  footerLogo?: string;
  adminLogo?: string;
  brandSymbol?: string;
}

export interface FirebaseSettings {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface AboutPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  color: string;
}

export interface DMFeature {
  num: string;
  title: string;
  desc: string;
}

export interface DMTag {
  label: string;
  color: string;
  textColor: string;
}

export interface WhySWReason {
  num: string;
  title: string;
  tagline: string;
  description: string;
  color: string;
}

export interface ExperienceStage {
  stage: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
}

export interface EligibilityCategory {
  title: string;
  desc: string;
}

export interface AdmissionsInclusion {
  title: string;
  subtitle: string;
  color: string;
}

export interface SiteContent {
  // Integrations & Cloud Config
  imgbbApiKey?: string;
  firebaseConfig?: FirebaseSettings;

  // Global Appearance & Studio Engine
  cursorStyle: 'radial' | 'normal';
  themeMode: 'light' | 'dark' | 'auto';
  colorTheme: ColorTheme;
  logos: SiteLogos;
  sectionOrder: SectionConfig[];

  // 1. Hero Section
  heroHeading: string;
  heroHighlightWord?: string;
  heroSubheading: string;
  tagline: string;
  announcement: string;
  heroTag1: string;
  heroTag2: string;
  heroTag3: string;
  heroImage1: string;
  heroImage2: string;
  heroCtaExplore?: string;
  heroCtaEnquire?: string;

  // 2. About Section
  aboutTitle: string;
  aboutHeadline: string;
  aboutHighlightWord?: string;
  aboutStory: string;
  stat1Label: string;
  stat1Val: string;
  stat2Label: string;
  stat2Val: string;
  aboutPillars?: AboutPillar[];

  // 3. Programs Section
  programsTitle: string;
  programsSubheading: string;

  // 4. Digital Marketing Section
  dmTitle: string;
  dmHeadline: string;
  dmHighlightWord?: string;
  dmDescription: string;
  dmImage?: string;
  dmBadgeTitle?: string;
  dmBadgeHeading?: string;
  dmFeatures?: DMFeature[];
  dmTags?: DMTag[];

  // 5. Why SW Section
  whySWTitle: string;
  whySWHeadline: string;
  whySWHighlightWord?: string;
  whySWSubtitle?: string;
  whySWReasons?: WhySWReason[];

  // 6. Experience Timeline (6 Stages)
  experienceTitle?: string;
  experienceHeadline?: string;
  experienceHighlightWord?: string;
  experienceSubtitle?: string;
  experienceStages?: ExperienceStage[];

  // 7. Who Can Apply & Eligibility
  eligibilityTitle?: string;
  eligibilityHeadline?: string;
  eligibilityHighlightWord?: string;
  eligibilityBadge?: string;
  eligibilityCategories?: EligibilityCategory[];
  eligibilityHighlights?: string[];

  // 8. Admissions Callout Section
  admissionsBadge?: string;
  admissionsHeadline?: string;
  admissionsHighlightWord?: string;
  admissionsDescription?: string;
  admissionsButtonText?: string;
  admissionsImage?: string;
  admissionsInclusions?: AdmissionsInclusion[];

  // 9. Contact Info & Admissions
  contactTitle?: string;
  contactHeadline?: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactAddress: string;
  contactMapEmbedUrl?: string;
  contactMapLink?: string;
  admissionsOpen: boolean;
  academicYear: string;

  // Cloud Sync Embedded Data
  courses?: Course[];
  gallery?: GalleryItem[];
  lastCloudSync?: string;
}

