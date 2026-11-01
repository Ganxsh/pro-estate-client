
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Suspense,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  Maximize2,
  MessageCircle,
  Ruler,
  Share2,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { propertyApi, inquiryApi } from "@/lib/propertyApi";
import type { Property, PropertyListResponse } from "@/types/property";
import type { AuthUser } from "@/types/auth";

const BRAND = "#1c398e";
const PAGE_LIMIT = 12;

type PropertyApiResponse = PropertyListResponse | Property[];

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function formatPrice(price: number | string): string {
  const value = Number(price);

  if (!Number.isFinite(value) || value <= 0) {
    return "Price on request";
  }

  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000)
      .toFixed(2)
      .replace(/\.?0+$/, "")} Cr`;
  }

  if (value >= 100_000) {
    return `₹${(value / 100_000)
      .toFixed(2)
      .replace(/\.?0+$/, "")} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatArea(
  value: number | string | null | undefined,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return `${number.toLocaleString("en-IN")} sq. ft.`;
}

function formatFeet(
  value: number | string | null | undefined,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return `${number.toLocaleString("en-IN")} ft`;
}

function getImages(property: Property): string[] {
  if (!Array.isArray(property.images)) {
    return [];
  }

  return property.images.filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0,
  );
}

function getLocation(property: Property): string {
  return [property.address, property.city]
    .filter((value) => Boolean(value?.trim()))
    .join(", ");
}

function getPropertyTypeLabel(type: Property["property_type"]) {
  switch (type) {
    case "Residential Apartment":
      return "Residential Apartment";
    case "Residential Plot":
      return "Residential Plot";
    case "Independent House / Villa":
      return "Independent House / Villa";
    case "Farm House":
      return "Farm House";
    default:
      return type;
  }
}

function PropertyImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}
      >
        <Building2 size={48} strokeWidth={1.2} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
    />
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p
          className="mb-2 text-xs font-bold uppercase tracking-[0.18em]"
          style={{ color: BRAND }}
        >
          {eyebrow}
        </p>
      )}

      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const images = getImages(property);

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <PropertyImage
          src={images[0]}
          alt={property.title}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">
          {getPropertyTypeLabel(property.property_type)}
        </span>

        <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/80 px-3 py-1.5 text-sm font-bold text-white">
          {formatPrice(property.price)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 font-bold text-slate-900 transition group-hover:text-[#1c398e]">
          {property.title}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="shrink-0" />
          <span className="line-clamp-1">
            {getLocation(property) || "Location not provided"}
          </span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {Number(property.bedrooms) > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} />
              {property.bedrooms} BHK
            </span>
          )}

          {formatArea(property.total_square_feet) && (
            <span className="flex items-center gap-1.5">
              <Maximize2 size={14} />
              {formatArea(property.total_square_feet)}
            </span>
          )}
        </div>

        <div
          className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold"
          style={{ color: BRAND }}
        >
          View property
          <ArrowRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="h-10 w-2/3 rounded bg-slate-200" />
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="h-[380px] rounded-2xl bg-slate-200" />
          <div className="h-[380px] rounded-2xl bg-slate-200" />
        </div>
        <div className="h-52 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}

function PropertyDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const propertyId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (raw) {
      try { setAuthUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const accumulated: Property[] = [];
      const seen = new Set<string>();

      let page = 1;
      let totalPages: number | null = null;

      while (totalPages === null || page <= totalPages) {
        const response: PropertyApiResponse =
          await propertyApi.getAll({
            page,
            limits: PAGE_LIMIT,
          });

        const batch: Property[] = Array.isArray(response)
          ? response
          : response.properties;

        for (const item of batch) {
          const id = String(item.id);

          if (!seen.has(id)) {
            seen.add(id);
            accumulated.push(item);
          }
        }

        if (Array.isArray(response)) {
          if (batch.length < PAGE_LIMIT) break;
        } else {
          const total = response.total;

          if (typeof total === "number") {
            totalPages = Math.ceil(total / PAGE_LIMIT);
          } else {
            if (batch.length < PAGE_LIMIT) break;
          }

          if (batch.length === 0) break;
        }

        page += 1;
      }

      setProperties(accumulated);
    } catch (err) {
      console.error("Failed to load property details:", err);
      setError(
        "Unable to load property details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const property = useMemo(
    () =>
      properties.find(
        (item) => String(item.id) === String(propertyId),
      ) ?? null,
    [properties, propertyId],
  );

  const images = useMemo(
    () => (property ? getImages(property) : []),
    [property],
  );

  // Match the same city and the same property type first.
  const similarProperties = useMemo(() => {
    if (!property) return [];

    const otherProperties = properties.filter(
      (item) => String(item.id) !== String(property.id),
    );

    const sameCitySameType = otherProperties.filter(
      (item) =>
        normalize(item.city) === normalize(property.city) &&
        normalize(item.property_type) ===
          normalize(property.property_type),
    );

    const sameTypeOtherCity = otherProperties.filter(
      (item) =>
        normalize(item.property_type) ===
          normalize(property.property_type) &&
        normalize(item.city) !== normalize(property.city),
    );

    return [...sameCitySameType, ...sameTypeOtherCity].slice(0, 4);
  }, [properties, property]);

  // Same city, different property type.
  const sameLocationProperties = useMemo(() => {
    if (!property) return [];

    return properties
      .filter(
        (item) =>
          String(item.id) !== String(property.id) &&
          normalize(item.city) === normalize(property.city) &&
          normalize(item.property_type) !==
            normalize(property.property_type),
      )
      .slice(0, 4);
  }, [properties, property]);

  function changeImage(direction: number) {
    if (images.length < 2) return;

    setActiveImage(
      (current) =>
        (current + direction + images.length) % images.length,
    );
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title ?? "Pro Estate Property",
          text:
            property?.description ??
            "View this property on Pro Estate",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      setInquiryError("Unable to share this property.");
    }
  }

  async function handleInquirySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInquiryError("");
    setInquirySuccess("");

    if (!authUser) {
      setInquiryError("Please sign in to send an inquiry.");
      return;
    }
    if (inquiryMessage.trim().length < 5) {
      setInquiryError("Message must be at least 5 characters.");
      return;
    }

    setInquirySubmitting(true);
    try {
      await inquiryApi.create({
        property_id: Number(propertyId),
        message: inquiryMessage.trim(),
        ...(inquiryPhone.trim() && { phone: inquiryPhone.trim() }),
      });
      setInquirySuccess("Inquiry sent! The owner will get back to you.");
      setInquiryMessage("");
      setInquiryPhone("");
    } catch (err) {
      setInquiryError(err instanceof Error ? err.message : "Failed to send inquiry.");
    } finally {
      setInquirySubmitting(false);
    }
  }

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#f7f8f6] px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Building2
            size={42}
            className="mx-auto mb-4 text-slate-300"
          />

          <h1 className="text-xl font-bold text-slate-900">
            Unable to load property
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadProperties()}
            className="mt-5 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: BRAND }}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#f7f8f6] px-4">
        <div className="max-w-md text-center">
          <Building2
            size={48}
            className="mx-auto mb-4 text-slate-300"
          />

          <h1 className="text-2xl font-bold text-slate-900">
            Property not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This property may have been removed, or the link may
            be incorrect.
          </p>

          <Link
            href="/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: BRAND }}
          >
            <ArrowLeft size={17} />
            Browse properties
          </Link>
        </div>
      </main>
    );
  }

  const location = getLocation(property);

  const facts = [
    {
      label: "Property type",
      value: getPropertyTypeLabel(property.property_type),
      icon: Home,
    },
    {
      label: "Bedrooms",
      value:
        Number(property.bedrooms) > 0
          ? `${property.bedrooms} BHK`
          : null,
      icon: BedDouble,
    },
    {
      label: "Total area",
      value: formatArea(property.total_square_feet),
      icon: Maximize2,
    },
    {
      label: "Length",
      value: formatFeet(property.length_feet),
      icon: Ruler,
    },
    {
      label: "Breadth",
      value: formatFeet(property.breadth_feet),
      icon: Ruler,
    },
    {
      label: "Posted by",
      value: property.posted_by,
      icon: UserRound,
    },
  ];

  const thumbnailImages = images.slice(1, 5);

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        {/* Top actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#1c398e]"
          >
            <ArrowLeft size={17} />
            Back to properties
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={favorite}
              onClick={() => setFavorite((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-rose-200"
            >
              <Heart
                size={17}
                className={
                  favorite
                    ? "fill-rose-500 text-rose-500"
                    : "text-slate-600"
                }
              />
              <span className="hidden sm:inline">
                {favorite ? "Saved" : "Save property"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void handleShare()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-slate-300"
            >
              <Share2 size={17} />
              <span className="hidden sm:inline">
                {copied ? "Copied!" : "Share"}
              </span>
            </button>
          </div>
        </div>

        {/* Heading and price */}
        <section className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1.5 text-xs font-bold"
                style={{
                  backgroundColor: "#e4efeb",
                  color: BRAND,
                }}
              >
                {property.property_type}
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                Listed by {property.posted_by}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {property.title}
            </h1>

            <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-500 sm:text-base">
              <MapPin
                size={19}
                className="mt-0.5 shrink-0"
                style={{ color: BRAND }}
              />
              {location || "Location not provided"}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 md:min-w-56 md:text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Asking price
            </p>

            <p
              className="mt-1 text-2xl font-bold sm:text-3xl"
              style={{ color: BRAND }}
            >
              {formatPrice(property.price)}
            </p>
          </div>
        </section>

        {/* Property image gallery */}
        <section className="mb-10">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            <div className="relative h-[300px] overflow-hidden rounded-2xl bg-slate-100 sm:h-[420px] lg:h-[470px]">
              <PropertyImage
                src={images[activeImage]}
                alt={property.title}
                className="h-full w-full"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => changeImage(-1)}
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow transition hover:bg-white"
                  >
                    <ChevronLeft size={21} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => changeImage(1)}
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow transition hover:bg-white"
                  >
                    <ChevronRight size={21} />
                  </button>
                </>
              )}

              <span className="absolute bottom-4 left-4 rounded-full bg-slate-950/75 px-3 py-2 text-xs font-medium text-white">
                {images.length
                  ? `Photo ${activeImage + 1} of ${images.length}`
                  : "No photos available"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {thumbnailImages.map((image, index) => {
                const imageIndex = index + 1;
                const hasMore = index === 3 && images.length > 5;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(imageIndex)}
                    aria-label={`View photo ${imageIndex + 1}`}
                    className="group relative min-h-[140px] overflow-hidden rounded-xl bg-slate-100 sm:min-h-[180px] lg:min-h-0"
                  >
                    <PropertyImage
                      src={image}
                      alt={`${property.title} photo ${imageIndex + 1}`}
                      className="h-full w-full transition duration-300 group-hover:scale-105"
                    />

                    {hasMore && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white">
                        +{images.length - 5} more
                      </span>
                    )}
                  </button>
                );
              })}

              {thumbnailImages.length === 0 && (
                <div className="col-span-1 flex items-center justify-center rounded-xl bg-white p-4 text-sm text-slate-400">
                  No additional photos
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0 space-y-7">
            {/* Overview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="Property overview"
                title="Key property details"
                description="Review the main specifications of this listing."
              />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {facts.map((fact) => {
                  const Icon = fact.icon;

                  return (
                    <div
                      key={fact.label}
                      className="rounded-xl border border-slate-200 shadow-md bg-slate-50/70 p-4"
                    >
                      <Icon
                        size={20}
                        className="mb-3"
                        style={{ color: BRAND }}
                      />

                      <p className="text-xs text-slate-500">
                        {fact.label}
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900">
                        {fact.value || "Not provided"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="About this listing"
                title="Property description"
              />

              <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {property.description?.trim() ||
                  "No description has been provided for this property."}
              </p>
            </section>

            {/* Address */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="Property location"
                title="Address and neighbourhood"
              />

              <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "#e4efeb",
                    color: BRAND,
                  }}
                >
                  <MapPin size={21} />
                </span>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {property.city || "City not provided"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {property.address || "Address not provided"}
                  </p>
                </div>
              </div>

              {property.city && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    location,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: BRAND }}
                >
                  View location on Google Maps
                  <ArrowRight size={16} />
                </a>
              )}
            </section>

            {/* Measurements */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="Measurements"
                title="Area and dimensions"
              />

              <div className="divide-y divide-slate-100">
                {[
                  ["Property type", property.property_type],
                  [
                    "Total area",
                    formatArea(property.total_square_feet),
                  ],
                  ["Length", formatFeet(property.length_feet)],
                  ["Breadth", formatFeet(property.breadth_feet)],
                  [
                    "Bedrooms",
                    Number(property.bedrooms) > 0
                      ? String(property.bedrooms)
                      : null,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-500">
                      {label}
                    </span>

                    <span className="text-right text-sm font-semibold text-slate-900">
                      {value || "Not provided"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Same city, different property type */}
            {sameLocationProperties.length > 0 && (
              <section>
                <SectionHeading
                  eyebrow={`More in ${property.city}`}
                  title="Other properties in this location"
                  description="Explore different property types in the same city."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {sameLocationProperties.map((item) => (
                    <PropertyCard key={item.id} property={item} />
                  ))}
                </div>
              </section>
            )}

            {/* Similar properties */}
            <section>
              <SectionHeading
                eyebrow="You may also like"
                title="Similar properties"
                description={`Explore ${property.property_type} listings in ${
                  property.city || "other locations"
                } and beyond.`}
              />

              {similarProperties.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {similarProperties.map((item) => (
                    <PropertyCard key={item.id} property={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                  <Building2
                    size={36}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <h3 className="font-semibold text-slate-800">
                    No similar properties yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Browse all listings to discover more properties.
                  </p>

                  <Link
                    href="/properties"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: BRAND }}
                  >
                    Browse all properties
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Contact sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Interested in this property?
              </p>

              <p
                className="mt-3 text-2xl font-bold"
                style={{ color: BRAND }}
              >
                {formatPrice(property.price)}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Contact the listing representative to learn more.
              </p>

              <div className="my-5 flex items-start gap-3 border border-slate-200 shadow-md rounded-xl bg-slate-50 p-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "#e4efeb",
                    color: BRAND,
                  }}
                >
                  <UserRound size={20} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Posted by</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {property.posted_by}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Owner contact information is not included in the
                    current Property interface.
                  </p>
                </div>
              </div>

              <div className="mb-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: BRAND }}
                />
                Verify ownership and property documents before making
                any payment.
              </div>

              <a
                href="#inquiry"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: BRAND }}
              >
                <MessageCircle size={18} />
                Send property inquiry
              </a>

              <Link
                href="/properties"
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Browse more properties
              </Link>
            </section>

            {/* Inquiry form */}
            <section
              id="inquiry"
              className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "#e4efeb",
                    color: BRAND,
                  }}
                >
                  <MessageCircle size={20} />
                </span>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Property inquiry
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Ask about this listing
                  </p>
                </div>
              </div>

              {!authUser ? (
                <div className="rounded-xl bg-amber-50 p-4 text-center">
                  <p className="text-sm font-medium text-amber-800">Please sign in to send an inquiry.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {/* Read-only user info prefilled from auth */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full name</label>
                    <input
                      readOnly
                      value={authUser.name}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email address</label>
                    <input
                      readOnly
                      value={authUser.email}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry-phone" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Phone number <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      id="inquiry-phone"
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="e.g. +91 00000 00000"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-[#1c398e] focus:ring-2 focus:ring-[#1c398e]/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry-message" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Message
                    </label>
                    <textarea
                      id="inquiry-message"
                      required
                      rows={4}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder={`I'm interested in ${property.title}. Please share more details.`}
                      className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-[#1c398e] focus:ring-2 focus:ring-[#1c398e]/10"
                    />
                  </div>

                  {inquiryError && (
                    <p role="alert" className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                      {inquiryError}
                    </p>
                  )}

                  {inquirySuccess && (
                    <p role="status" className="rounded-lg bg-green-50 p-3 text-xs text-green-800">
                      {inquirySuccess}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: BRAND }}
                  >
                    {inquirySubmitting ? "Sending..." : (<>Send inquiry <ArrowRight size={17} /></>)}
                  </button>
                </form>
              )}
            </section>
          </aside>
        </div>

        {/* Footer navigation */}
        <div className="mt-12 border-t border-slate-200 pt-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#1c398e]"
          >
            <ArrowLeft size={17} />
            Back to all properties
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PropertyDetailsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PropertyDetailsContent />
    </Suspense>
  );
}
