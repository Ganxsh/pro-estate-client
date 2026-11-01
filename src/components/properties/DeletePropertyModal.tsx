"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { propertyApi } from "@/lib/propertyApi";
import type { Property } from "@/types/property";

interface Props {
  property: Property;
  onCancel: () => void;
  onDeleted: () => void;
}

export default function DeletePropertyModal({ property, onCancel, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      setLoading(true);
      setError("");
      await propertyApi.delete(property.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200"
          >
            <X size={16} />
          </button>

          <div className="p-6 pt-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Delete Property?</h2>
            <p className="mt-2 text-sm text-stone-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-stone-800">"{property.title}"</span>?
              This action cannot be undone.
            </p>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 rounded-full border border-stone-200 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-full bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
