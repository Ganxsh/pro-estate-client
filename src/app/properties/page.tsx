"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Building2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { propertyApi } from "@/lib/propertyApi";
import type { Property, PropertyType, PropertySearchFilters, PostedByFilter } from "@/types/property";
import HorizontalPropertyCard from "@/components/properties/horizontalPropertyCard";


const PROPERTY_TYPES: PropertyType[] = [
  "Residential Apartment",
  "Residential Plot",
  "Independent House / Villa",
  "Farm House",
];

const CITIES = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Trichy",
  "Salem",
  "Tiruppur",
  "Erode",
  "Vellore",
  "Hosur",
  "Thanjavur",
];
const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
const PRICE_RANGES = [
  { label: "Under ₹50L", min: 0, max: 5_000_000 },
  { label: "₹50L – ₹1Cr", min: 5_000_000, max: 10_000_000 },
  { label: "₹1Cr – ₹2Cr", min: 10_000_000, max: 20_000_000 },
  { label: "₹2Cr – ₹5Cr", min: 20_000_000, max: 50_000_000 },
  { label: "Above ₹5Cr", min: 50_000_000, max: undefined },
];

const POSTED_BY_OPTIONS: PostedByFilter[] = ["Owner", "Dealer", "Builder"];

const PAGE_SIZE = 12;

function PropertiesContent() {
  const searchParams = useSearchParams();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number | null>(null);

  const [filters, setFilters] = useState<PropertySearchFilters>({});

  useEffect(() => {
    setSelectedPriceIndex(null);
    setFilters({
      city: searchParams.get("city") ?? undefined,
      property_type: (searchParams.get("property_type") as PropertyType) ?? undefined,
      bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
      posted_by: (searchParams.get("posted_by") as PostedByFilter) ?? undefined,
      min_price: undefined,
      max_price: undefined,
    });
  }, [searchParams]);

  const builderQuery = searchParams.get("builder") ?? "";

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all pages and accumulate
      let page = 1;
      const accumulated: Property[] = [];
      while (true) {
        const res = await propertyApi.getAll({ ...filters, page, limits: 12 });
        const batch = Array.isArray(res) ? res : (res.properties ?? []);
        accumulated.push(...batch);
        if (batch.length < 12) break;
        page++;
      }
      setAllProperties(accumulated);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setAllProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setCurrentPage(1);
    fetchProperties();
  }, [fetchProperties]);

  const updateFilter = (key: keyof PropertySearchFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceRange = (index: number) => {
    if (selectedPriceIndex === index) {
      setSelectedPriceIndex(null);
      setFilters((prev) => ({ ...prev, min_price: undefined, max_price: undefined }));
    } else {
      const range = PRICE_RANGES[index];
      setSelectedPriceIndex(index);
      setFilters((prev) => ({ ...prev, min_price: range.min, max_price: range.max }));
    }
  };

  const clearFilters = () => {
    setSelectedPriceIndex(null);
    setFilters({});
  };

  const hasActiveFilters =
    !!filters.city || !!filters.property_type || !!filters.bedrooms || !!filters.posted_by || selectedPriceIndex !== null;

  // Pagination calculations
  const total = allProperties.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageProperties = allProperties.slice(start, start + PAGE_SIZE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build page number array with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const FilterPanel = () => (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Filters      {!loading && (
              <p className="mt-0.5 text-xs font-light text-slate-500">
                {total} {total === 1 ? "property" : "properties"} found
                {filters.city ? ` in ${filters.city}` : ""}
                {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
              </p>
            )}</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
          >
            <X size={13} /> Clear all
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">City</p>
        <div className="relative">
          <select
            value={filters.city ?? ""}
            onChange={(e) => updateFilter("city", e.target.value || undefined)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-slate-400" />
        </div>
      </div>

      {/* Property Type */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Property Type</p>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="property_type"
                checked={filters.property_type === type}
                onChange={() => updateFilter("property_type", filters.property_type === type ? undefined : type)}
                className="h-4 w-4 accent-rose-600"
              />
              <span className="text-sm text-slate-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateFilter("bedrooms", filters.bedrooms === n ? undefined : n)}
              className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
                filters.bedrooms === n
                  ? "border-rose-600 bg-rose-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Posted By */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Posted By</p>
        <div className="space-y-2">
          {POSTED_BY_OPTIONS.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="posted_by"
                checked={filters.posted_by === opt}
                onChange={() => updateFilter("posted_by", filters.posted_by === opt ? undefined : opt)}
                className="h-4 w-4 accent-rose-600"
              />
              <span className="text-sm text-slate-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Price Range</p>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, i) => (
            <label key={range.label} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="price_range"
                checked={selectedPriceIndex === i}
                onChange={() => handlePriceRange(i)}
                className="h-4 w-4 accent-rose-600"
              />
              <span className="text-sm text-slate-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f1]">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex mt-10 max-w-7xl items-center justify-between gap-4">
          {builderQuery && (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
              <span className="text-slate-400">Builder:</span>
              <span className="font-semibold">{builderQuery}</span>
            </div>
          )}
          {/* <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Browse Properties</h1>
            {!loading && (
              <p className="mt-0.5 text-sm text-slate-500">
                {total} {total === 1 ? "property" : "properties"} found
                {filters.city ? ` in ${filters.city}` : ""}
                {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
              </p>
            )}
          </div> */}

          <button
            type="button"
            onClick={() => setMobileFiltersOpen((p) => !p)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">!</span>
            )}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <FilterPanel />
            </div>
          </div>

          {/* Mobile filters drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="relative ml-auto h-full w-80 overflow-y-auto bg-white p-6 shadow-xl">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Properties grid + pagination */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
                ))}
              </div>
            ) : total === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
                <Building2 size={40} className="mb-4 text-slate-300" />
                <p className="text-base font-semibold text-slate-700">No properties found</p>
                <p className="mt-1 text-sm text-slate-400">Try adjusting your filters.</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-1 xl:grid-cols-1">
                  {pageProperties.map((p) => (
                    <HorizontalPropertyCard key={p.id} property={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-1.5">
                    {/* Prev */}
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page numbers */}
                    {getPageNumbers().map((page, i) =>
                      page === "..." ? (
                        <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-slate-400">
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page as number)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                            currentPage === page
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next */}
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Page info */}
                {totalPages > 1 && (
                  <p className="mt-3 text-center text-xs text-slate-400">
                    Showing {start + 1}–{Math.min(start + PAGE_SIZE, total)} of {total} properties
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f5f1] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-rose-600" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
