
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  BedDouble,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const images = Array.isArray(property.images)
    ? property.images.filter(
        (image): image is string =>
          typeof image === "string" && image.length > 0
      )
    : [];

  const currentImage = images[imageIndex];

  const formatPrice = (price: number | string) => {
    const value = Number(price);

    if (!Number.isFinite(value) || value <= 0) return "Price on request";

    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2).replace(/\.?0+$/, "")} L`;
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  const location = [property.address, property.city]
    .filter(Boolean)
    .join(", ");

  const description =
    property.description || "Explore this property and discover more details.";

  const propertyUrl = `/properties/${property.id}`;

  return (
    <article className="group grid w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg lg:grid-cols-[360px_minmax(0,1fr)]">
      {/* Property image */}
      <div className="relative min-h-[240px] overflow-hidden bg-slate-100 sm:min-h-[300px] lg:min-h-[320px]">
        {currentImage ? (
          <img
            src={currentImage}
            alt={property.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Building2 size={48} strokeWidth={1.2} />
            <span className="text-sm">Property image unavailable</span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-[#1c398e] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            Pro Estate
          </span>

          <span className="rounded-md bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            {property.posted_by || "Property"}
          </span>
        </div>

        {/* Favorite */}
        {/* <button
          type="button"
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((value) => !value)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:scale-105"
        >
          <Heart
            size={19}
            className={isFavorite ? "fill-rose-500 text-rose-500" : ""}
          />
        </button> */}

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() =>
                setImageIndex(
                  (index) => (index - 1 + images.length) % images.length
                )
              }
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={() =>
                setImageIndex((index) => (index + 1) % images.length)
              }
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
            >
              <ChevronRight size={19} />
            </button>

            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show image ${index + 1}`}
                  onClick={() => setImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    imageIndex === index
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image count and status */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-slate-950/75 px-3 py-2 text-xs text-white">
          <span className="truncate">
            {property.property_type}
          </span>
          <span className="shrink-0 font-medium">
            {images.length ? `${imageIndex + 1}/${images.length}` : "No photos"}
          </span>
        </div>
      </div>

      {/* Property details */}
      <div className="flex min-w-0 flex-col">
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-[22px]">
                {property.title}
              </h2>

              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#1c398e]" />
                <span>{location || "Location not specified"}</span>
              </p>
            </div>

            <span className="shrink-0 rounded-r-sm bg-[#e5f0ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1c398e]">
              For Sale
            </span>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-700">
            {property.property_type}
          </p>

          <p className="mt-1.5 text-xl font-bold text-slate-900 sm:text-2xl">
            {formatPrice(property.price)}
          </p>

          {/* Property specifications */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-b border-slate-100 pb-4 text-sm text-slate-600">
            {Number(property.bedrooms) > 0 && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={16} className="text-slate-500" />
                {property.bedrooms} BHK
              </span>
            )}

            {Number(property.total_square_feet) > 0 && (
              <span className="flex items-center gap-1.5">
                <Ruler size={16} className="text-slate-500" />
                {Number(property.total_square_feet).toLocaleString("en-IN")} sq. ft.
              </span>
            )}
          </div>

          {/* Description */}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="mt-3 flex w-full items-start justify-between gap-3 text-left"
          >
            <span
              className={`text-sm leading-6 text-slate-600 ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </span>

            <ChevronRight
              size={17}
              className={`mt-1 shrink-0 text-slate-400 transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>

        {/* Seller and actions */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Listed by</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
              {property.posted_by || "Property owner"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link
              href={propertyUrl}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-[#1c398e] bg-white px-4 py-2.5 text-sm font-semibold text-[#1c398e] transition hover:bg-[#e5f0ed] sm:flex-none"
            >
              View Details
            </Link>

            <Link
              href={`${propertyUrl}#inquiry`}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#1c398e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3c33] sm:flex-none"
            >
              Contact Owner
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
