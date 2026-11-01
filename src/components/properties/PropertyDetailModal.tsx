"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BedDouble, MapPin, Pencil, Ruler, Trash2, X, IndianRupee, Calendar } from "lucide-react";
import type { Property } from "@/types/property";

interface Props {
  property: Property;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PropertyDetailModal({ property, onClose, onEdit, onDelete }: Props) {
  const price = Number(property.price);
  const area = Number(property.total_square_feet);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  const createdAt = new Date(property.created_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-end justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          >
            <X size={17} />
          </button>

          {/* Image */}
          <div className="relative aspect-[16/7] w-full overflow-hidden bg-stone-100">
            {property.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                <MapPin size={40} className="text-stone-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {property.property_type}
              </span>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{property.title}</h2>
            </div>
          </div>

          {/* Image strip */}
          {property.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-stone-50 px-5 py-3">
              {property.images.slice(1).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`Image ${i + 2}`}
                  className="h-14 w-20 shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          {/* Details */}
          <div className="p-5 sm:p-6">
            {/* Price + stats row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-2xl font-bold text-stone-900">
                <IndianRupee size={20} className="text-orange-500" />
                {formattedPrice.replace("₹", "")}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-stone-500">
                {area > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Ruler size={14} className="text-stone-400" />
                    {new Intl.NumberFormat("en-IN").format(area)} sq.ft
                  </span>
                )}
                {property.bedrooms > 0 && (
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={14} className="text-stone-400" />
                    {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-stone-400" />
                  {createdAt}
                </span>
              </div>
            </div>

            <p className="mt-2 flex items-start gap-1.5 text-sm text-stone-500">
              <MapPin size={14} className="mt-0.5 shrink-0 text-stone-400" />
              {property.address}, {property.city}
            </p>

            {/* Dimensions */}
            {(property.length_feet || property.breadth_feet) && (
              <div className="mt-4 flex gap-3">
                {property.length_feet && (
                  <div className="rounded-xl bg-stone-50 px-4 py-2.5 text-center">
                    <p className="text-xs text-stone-400">Length</p>
                    <p className="text-sm font-semibold text-stone-800">{property.length_feet} ft</p>
                  </div>
                )}
                {property.breadth_feet && (
                  <div className="rounded-xl bg-stone-50 px-4 py-2.5 text-center">
                    <p className="text-xs text-stone-400">Breadth</p>
                    <p className="text-sm font-semibold text-stone-800">{property.breadth_feet} ft</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Description</p>
              <p className="text-sm leading-6 text-stone-600">{property.description}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 border-t border-stone-100 pt-5">
              <button
                type="button"
                onClick={onEdit}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-orange-200 bg-orange-50 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                <Pencil size={15} />
                Edit Property
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
