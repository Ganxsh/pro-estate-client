"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { useState } from "react";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const price = Number(property.price);
  const area = Number(property.total_square_feet);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <article className="group relative overflow-hidden shadow-md rounded-3xl border border-slate-200 bg-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/[0.12]">
      {/* Tall Property background image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-200">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-slate-400 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-7 w-7"
                >
                  <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
                  <path d="M9 21v-7h6v7" />
                </svg>
              </div>
              <p className="text-xs font-medium text-slate-500">
                Property image
              </p>
            </div>
          </div>
        )}

        {/* Top Floating Badges (Property Type & Favorite Button) */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4 z-10">
          <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md">
            {property.property_type}
          </span>

          <button
            type="button"
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            aria-pressed={isFavorite}
            onClick={() => setIsFavorite((previous) => !previous)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm backdrop-blur-md transition hover:scale-105 hover:text-red-500"
          >
            <Heart
              className={`h-[18px] w-[18px] ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Overlapping Floating White Details Card */}
      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-4 sm:p-5 shadow-lg backdrop-blur-md border border-white/20 transition-transform duration-300">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            {Number.isFinite(price)
              ? formattedPrice
              : "Price on request"}
          </p>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="mt-1 block"
        >
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
            {property.title}
          </h3>
        </Link>

        {/* Address */}
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">
            {property.address}, {property.city}
          </span>
        </p>

        {/* Features (Beds, Baths, & Sq.Ft.) */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5 text-slate-400" />
            <span>{property.bedrooms ?? 0} {property.bedrooms === 1 ? "bed" : "beds"}</span>
          </div>

    

          {area > 0 && (
            <div className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5 text-slate-400" />
              <span>{new Intl.NumberFormat("en-IN").format(area)} sq.ft.</span>
            </div>
          )}
        </div>

        {/* More Details Button */}
        <Link
          href={`/properties/${property.id}`}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          More Details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}