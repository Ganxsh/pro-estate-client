"use client";

import { useEffect, useState } from "react";
import { propertyApi } from "@/lib/propertyApi";
import type { Property } from "@/types/property";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useRef } from "react";
/* ── height classes per column slot ── */
const colHeights = [
  ["h-[260px] lg:h-[300px]", "h-[280px] lg:h-[320px]"],                                          // col1: 2
  ["h-[220px] lg:h-[260px]", "h-[260px] lg:h-[300px]", "h-[220px] lg:h-[260px]"],               // col2: 3
  ["h-[200px] lg:h-[340px]", "h-[240px] lg:h-[380px]"],                                          // col3: 2
  ["h-[240px] lg:h-[280px]", "h-[220px] lg:h-[260px]", "h-[240px] lg:h-[280px]"],               // col4: 3
  ["h-[280px] lg:h-[320px]", "h-[260px] lg:h-[300px]"],                                          // col5: 2
];

const colOffsets = ["lg:pt-16", "", "lg:pt-8", "", "lg:pt-16"];

function GalleryCard({ property, heightClass }: { property: Property; heightClass: string }) {
  const img = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null;
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-15%", "15%"]
  );
  return (
    <div ref={imageRef} className={`group relative w-full ${heightClass} rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-xl transition-shadow duration-500`}>
      <Link href={`/properties/${property.id}`} className="absolute inset-0 z-30" aria-label={property.title} />
      {/* Image */}
      {img ? (
        <motion.div className="absolute inset-0 scale-110" style={{ y: imageY }}>
          <Image
            src={img}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Arrow */}
      <div className="absolute top-3.5 right-3.5 z-20">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-[#111] border border-white/60 shadow-xs transition-all duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:scale-105">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-3.5 left-3.5 z-20 pr-4">
        <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-white/95 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full mb-1 border border-white/20">
          {property.property_type}
        </span>
        <h3 className="text-sm sm:text-base font-medium text-white tracking-tight leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-1">
          {property.title}
        </h3>
        <p className="text-xs text-white/80 mt-0.5 font-semibold">
          ₹{Number(property.price).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    propertyApi.getAll({ limits: 14 }).then((res) => {
      setProperties(res.properties ?? []);
    });
  }, []);

  /* distribute 14 properties across 5 columns: 2,3,4,3,2 */
  const splits = [2, 3, 2, 3, 2];
  const cols: Property[][] = [];
  let cursor = 0;
  for (const count of splits) {
    cols.push(properties.slice(cursor, cursor + count));
    cursor += count;
  }

  return (
    <section className="mx-auto container px-5 sm:px-8 lg:px-10 py-14">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-medium -tracking-normal text-slate-900 sm:text-3xl">
            Featured Properties
          </h2>
          <p className="mt-1 text-sm text-slate-500">Top picks from our latest listings</p>
        </div>
        <Link
          href="/properties"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#1c398e] hover:underline"
        >
          View all <ArrowRight size={15} />
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-16">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 items-start">
          {cols.map((colProps, colIdx) => (
            <div
              key={colIdx}
              className={`flex flex-col gap-4 lg:gap-5 w-full ${colOffsets[colIdx]}`}
            >
              {colProps.map((p, i) => (
                <GalleryCard
                  key={p.id}
                  property={p}
                  heightClass={colHeights[colIdx][i] ?? "h-[240px]"}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
