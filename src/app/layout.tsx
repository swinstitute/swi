import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "South West Institute of Design and Innovation | Bhilai",
  description:
    "Premier design institute in Bhilai, Chhattisgarh offering Diploma in Fashion Designing, Interior Designing, and integrated Digital Marketing. Admissions Open 2026–2027.",
  keywords: [
    "South West Institute",
    "SW Institute",
    "Fashion Design Bhilai",
    "Interior Design Bhilai",
    "Design Institute Chhattisgarh",
    "Digital Marketing for Designers",
  ],
  metadataBase: new URL("https://southwestinstitute.in"),
  openGraph: {
    title: "South West Institute of Design and Innovation | Bhilai",
    description:
      "Master Fashion Designing, Interior Designing & Digital Marketing at SW Institute, Bhilai. Admissions Open 2026–2027.",
    url: "https://southwestinstitute.in",
    siteName: "SW Institute of Design and Innovation",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/sw-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/sw-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
