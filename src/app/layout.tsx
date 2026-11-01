import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const siteUrl = "https://proestate.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Pro Estate | Find Your Perfect Property",
    template: "%s | Pro Estate",
  },

  description:
    "Discover apartments, residential plots, independent houses, villas, and farmhouses with Pro Estate. Explore property listings, compare prices, and connect with property owners, dealers, and builders across India.",

  applicationName: "Pro Estate",

  keywords: [
    "Pro Estate",
    "real estate India",
    "properties for sale",
    "buy property in India",
    "apartments for sale",
    "residential plots",
    "independent houses",
    "villas for sale",
    "farm houses",
    "property listings",
    "buy homes",
    "property owners",
    "real estate dealers",
    "builders in India",
    "property search Chennai",
    "residential properties",
  ],

  authors: [{ name: "Pro Estate" }],
  creator: "Pro Estate",
  publisher: "Pro Estate",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Pro Estate",
    title: "Pro Estate | Find Your Perfect Property",
    description:
      "Explore properties for sale across India. Find apartments, plots, houses, and villas, and connect with owners, dealers, and builders.",
    images: [
      {
        url: "/pro-estate-og.jpg",
        width: 1200,
        height: 630,
        alt: "Pro Estate - Find Your Perfect Property",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Pro Estate | Find Your Perfect Property",
    description:
      "Discover properties for sale across India with Pro Estate. Find your next home or investment.",
    images: ["/pro-estate-og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "real estate",
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
       <AuthProvider>
         <ConditionalNavbar />
         <div className="flex-1">{children}</div>
         <Footer />
       </AuthProvider>
      </body>
    </html>
  );
}
