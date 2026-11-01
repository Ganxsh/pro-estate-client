"use client";

import { useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ravi Kumar",
    role: "Home Buyer",
    city: "Chennai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "Found my dream apartment in Chennai within a week. The search filters made it so easy to narrow down exactly what I needed. ProEstate is genuinely the best platform I've used.",
  },
  {
    name: "Priya Nair",
    role: "Property Owner",
    city: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "Listed my villa on ProEstate and got serious inquiries within 3 days. The free listing feature is a game changer. I sold my property without paying any brokerage.",
  },
  {
    name: "Arjun Mehta",
    role: "Real Estate Dealer",
    city: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "As a dealer, I manage multiple listings and ProEstate makes it incredibly simple. The manage property dashboard is clean and the inquiry emails are instant.",
  },
  {
    name: "Sneha Reddy",
    role: "First-time Buyer",
    city: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "I was nervous about buying my first home but ProEstate made the process transparent. I could see all details upfront — price, area, type — no hidden surprises.",
  },
  {
    name: "Karthik Selvam",
    role: "Builder",
    city: "Coimbatore",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "We listed our entire residential project on ProEstate. The platform gave us great visibility and the inquiry system connected us directly with genuine buyers.",
  },
  {
    name: "Meera Iyer",
    role: "Tenant",
    city: "Pune",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "Found a great 2BHK rental in Pune in no time. The BHK filter and city search saved me hours of browsing. Highly recommend ProEstate to anyone looking for a rental.",
  },
  {
    name: "Dinesh Babu",
    role: "Plot Investor",
    city: "Madurai",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "I was looking for residential plots in Madurai and ProEstate had the most accurate listings. The sq.ft details and price breakdown helped me compare options easily.",
  },
  {
    name: "Lakshmi Venkat",
    role: "NRI Buyer",
    city: "Chennai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    content: "Being an NRI, I needed a trustworthy platform to invest back home. ProEstate's detailed listings and direct owner contact gave me the confidence to invest remotely.",
  },
];

// Duplicate for seamless infinite scroll
const track = [...testimonials, ...testimonials];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#f8f9fc] py-16 sm:py-20 overflow-hidden">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-[#1c398e]" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-neutral-500">
            Testimonials
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#111]">
            What our users say
          </h2>
          <p className="text-sm text-neutral-500 max-w-sm">
            Thousands of buyers, sellers, and renters trust ProEstate to find their perfect property.
          </p>
        </div>
      </div>

      {/* Scrolling track */}
      <div ref={containerRef} className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#f8f9fc] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#f8f9fc] to-transparent" />

        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {track.map((t, i) => (
            <div
              key={i}
              className="w-[300px] sm:w-[340px] shrink-0 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111]">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
