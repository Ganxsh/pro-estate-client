"use client";

import { BedDouble, MapPin, Pencil, Trash2, Eye, Ruler } from "lucide-react";
import type { Property } from "@/types/property";

interface Props {
  property: Property;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MyPropertyCard({ property, onView, onEdit, onDelete }: Props) {
  const price = Number(property.price);
  const area = Number(property.total_square_feet);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        {property.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
            <MapPin size={32} className="text-stone-300" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
          {property.property_type}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-lg font-bold text-stone-900">{formattedPrice}</p>
            <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-stone-800">{property.title}</h3>
          </div>
          {area > 0 && (
            <div className="flex shrink-0 items-center gap-1 text-xs text-stone-500">
              <Ruler size={13} className="text-stone-400" />
              {new Intl.NumberFormat("en-IN").format(area)} sq.ft
            </div>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
          <MapPin size={13} className="shrink-0 text-stone-400" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </p>

        {property.bedrooms > 0 && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
            <BedDouble size={13} className="shrink-0 text-stone-400" />
            {property.bedrooms} bedroom{property.bedrooms > 1 ? "s" : ""}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2 border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={onView}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            <Eye size={14} />
            View
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 py-2.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
