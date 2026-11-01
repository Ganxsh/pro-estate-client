import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Buy Property", href: "/properties?purpose=buy" },
  { label: "All Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
];

const propertyTypes = [
  { label: "Apartments", href: "/properties?property_type=Apartment" },
  { label: "Villas", href: "/properties?property_type=Villa" },
  { label: "Plots", href: "/properties?property_type=Plot" },
  { label: "Commercial", href: "/properties?property_type=Commercial" },
];

export default function Footer() {
  return (
    <footer className=" bg-gradient-to-r  from-[#17374A] via-[#244D6C] to-[#3d688d]  text-slate-300">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main grid */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo/ProEstate-Logo.png"
              alt="ProEstate Logo"
              width={130}
              height={40}
              className="brightness-0 invert"
            />
            <p className="text-sm leading-relaxed text-slate-400">
              India&apos;s trusted platform to buy, sell, and rent properties.
              Find your dream home with ease.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-blue-400" />
                Chennai, Tamil Nadu, India
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-blue-400" />
                +91 98765 43210
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-blue-400" />
                support@proestate.in
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
              Property Types
            </h3>
            <ul className="flex flex-col gap-2.5">
              {propertyTypes.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Post Property CTA */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
              List Your Property
            </h3>
            <p className="text-sm text-slate-400">
              Post your property for free and reach thousands of buyers and
              tenants across India.
            </p>
            <Link
              href="/properties"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-200"
            >
              Post for Free
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row">
          <span>© 2025 ProEstate. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-white">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
