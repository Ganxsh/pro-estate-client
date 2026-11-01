"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  IndianRupee,
  MapPin,
  Ruler,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { propertyApi } from "@/lib/propertyApi";
import type { CreatePropertyPayload } from "@/types/property";

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialForm = {
  title: "",
  description: "",
  property_type: "Residential Apartment" as CreatePropertyPayload["property_type"],
  price: "",
  bedrooms: "2",
  total_square_feet: "",
  length_feet: "",
  breadth_feet: "",
  city: "",
  address: "",
  images: [] as string[],
};

const propertyTypes: CreatePropertyPayload["property_type"][] = [
  "Residential Apartment",
  "Residential Plot",
  "Independent House / Villa",
  "Farm House",
];

const steps = [
  { title: "Property details", icon: Building2 },
  { title: "Price & area", icon: IndianRupee },
  { title: "Location & photos", icon: MapPin },
];

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";
const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

export default function CreatePropertyModal({ isOpen, onClose }: CreatePropertyModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setStep(0);
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  const updateField = <K extends keyof typeof initialForm>(field: K, value: (typeof initialForm)[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!form.title.trim() || !form.description.trim()) {
        setError("Please enter a property title and description.");
        return false;
      }
      return true;
    }
    if (step === 1) {
      const price = Number(form.price);
      if (!form.price.trim() || !Number.isFinite(price) || price <= 0) {
        setError("Please enter a valid price greater than zero.");
        return false;
      }
      const bedrooms = Number(form.bedrooms);
      if (!Number.isInteger(bedrooms) || bedrooms < 0 || bedrooms > 6) {
        setError("Please select a valid number of bedrooms.");
        return false;
      }
      for (const [label, value] of [
        ["Total area", form.total_square_feet],
        ["Length", form.length_feet],
        ["Breadth", form.breadth_feet],
      ] as const) {
        if (value.trim() !== "" && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
          setError(`${label} must be greater than zero.`);
          return false;
        }
      }
      return true;
    }
    if (!form.city.trim() || !form.address.trim()) {
      setError("Please enter the property city and address.");
      return false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) { setStep((s) => s + 1); setError(""); } };
  const previousStep = () => { setStep((s) => s - 1); setError(""); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setForm((prev) => ({
          ...prev,
          images: prev.images.includes(result) ? prev.images : [...prev.images, result],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
    setError("");
  };

  const removeImage = (index: number) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep()) return;
    const optionalNumber = (v: string) => (v.trim() === "" ? null : Number(v));
    const payload: CreatePropertyPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      property_type: form.property_type,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      total_square_feet: optionalNumber(form.total_square_feet),
      length_feet: optionalNumber(form.length_feet),
      breadth_feet: optionalNumber(form.breadth_feet),
      city: form.city.trim(),
      address: form.address.trim(),
      ...(form.images.length > 0 ? { images: form.images } : {}),
    };
    try {
      setLoading(true);
      setError("");
      await propertyApi.create(payload);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push("/user/manageProperty");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the property. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-property-title"
            className="relative my-auto grid w-full max-w-5xl scale-75 overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[1fr_1.1fr]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-sm transition hover:bg-stone-100 hover:text-black"
            >
              <X size={19} />
            </button>

            {/* Left: image panel */}
            <aside className="relative hidden min-h-[580px] overflow-hidden md:block">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

              <div className="absolute inset-x-8 bottom-10">
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                  List your property
                </span>
                <h3 className="mt-4 font-serif text-4xl leading-tight text-white">
                  Turn your space
                  <br />
                  <span className="font-light italic text-orange-300">into opportunity.</span>
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
                  Share your property details and connect with the right buyers and renters.
                </p>

                {/* Step indicators on image */}
                <div className="mt-8 space-y-3">
                  {steps.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.title}
                        className={`flex items-center gap-3 text-sm transition-all ${
                          i === step ? "text-white" : i < step ? "text-orange-300" : "text-white/40"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                            i < step
                              ? "border-orange-400 bg-orange-500 text-white"
                              : i === step
                                ? "border-white bg-white/20 text-white"
                                : "border-white/20 bg-white/5 text-white/40"
                          }`}
                        >
                          {i < step ? <Check size={13} /> : <Icon size={13} />}
                        </span>
                        <span className={i === step ? "font-semibold" : ""}>{s.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Right: form */}
            <section className="flex flex-col overflow-y-auto px-6 py-8 sm:px-8 sm:py-10 max-h-[90vh] md:max-h-none">
              {/* Header */}
              <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                  Create a listing
                </p>
                <h2
                  id="create-property-title"
                  className="font-serif text-2xl leading-tight tracking-tight text-stone-950 sm:text-3xl"
                >
                  {steps[step].title}
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Step {step + 1} of {steps.length}
                </p>

                {/* Progress bar */}
                <div className="mt-4 flex gap-1.5">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= step ? "bg-orange-500" : "bg-stone-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <form
                className="flex flex-1 flex-col"
                onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}
              >
                <div className="flex-1 space-y-4">

                  {/* STEP 1 */}
                  {step === 0 && (
                    <>
                      <div>
                        <label htmlFor="cp-type" className={labelClass}>Property type</label>
                        <div className="relative">
                          <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                          <select
                            id="cp-type"
                            value={form.property_type}
                            onChange={(e) => updateField("property_type", e.target.value as CreatePropertyPayload["property_type"])}
                            className={`${inputClass} appearance-none pl-11 pr-10`}
                          >
                            {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cp-title" className={labelClass}>Property title</label>
                        <input
                          id="cp-title"
                          required
                          maxLength={150}
                          value={form.title}
                          onChange={(e) => updateField("title", e.target.value)}
                          placeholder="e.g. Modern home in Chennai"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="cp-desc" className={labelClass}>Description</label>
                        <textarea
                          id="cp-desc"
                          required
                          rows={3}
                          maxLength={5000}
                          value={form.description}
                          onChange={(e) => updateField("description", e.target.value)}
                          placeholder="Describe the property and its key features..."
                          className={`${inputClass} resize-none`}
                        />
                        <p className="mt-1 text-right text-xs text-stone-400">{form.description.length}/5000</p>
                      </div>

                      <div>
                        <label htmlFor="cp-bedrooms" className={labelClass}>Bedrooms</label>
                        <div className="relative">
                          <select
                            id="cp-bedrooms"
                            value={form.bedrooms}
                            onChange={(e) => updateField("bedrooms", e.target.value)}
                            className={`${inputClass} appearance-none pr-10`}
                          >
                            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                              <option key={n} value={n}>
                                {n === 0 ? "Not applicable" : `${n} bedroom${n > 1 ? "s" : ""}`}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* STEP 2 */}
                  {step === 1 && (
                    <>
                      <div>
                        <label htmlFor="cp-price" className={labelClass}>Expected price (₹)</label>
                        <div className="relative">
                          <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            id="cp-price"
                            required
                            type="number"
                            min="1"
                            step="any"
                            value={form.price}
                            onChange={(e) => updateField("price", e.target.value)}
                            placeholder="75,00,000"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>

                      {form.price && Number(form.price) > 0 && (
                        <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3">
                          <p className="text-xs text-stone-500">Your asking price</p>
                          <p className="mt-0.5 text-xl font-semibold text-stone-900">
                            ₹{Number(form.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      )}

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Ruler size={15} className="text-orange-600" />
                          <span className="text-sm font-semibold text-stone-800">Dimensions (optional)</span>
                        </div>
                        <label htmlFor="cp-sqft" className={labelClass}>Total area (sq. ft.)</label>
                        <input
                          id="cp-sqft"
                          type="number"
                          min="0.01"
                          step="any"
                          value={form.total_square_feet}
                          onChange={(e) => updateField("total_square_feet", e.target.value)}
                          placeholder="e.g. 1200"
                          className={inputClass}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="cp-length" className={labelClass}>Length (ft)</label>
                          <input
                            id="cp-length"
                            type="number"
                            min="0.01"
                            step="any"
                            value={form.length_feet}
                            onChange={(e) => updateField("length_feet", e.target.value)}
                            placeholder="40"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label htmlFor="cp-breadth" className={labelClass}>Breadth (ft)</label>
                          <input
                            id="cp-breadth"
                            type="number"
                            min="0.01"
                            step="any"
                            value={form.breadth_feet}
                            onChange={(e) => updateField("breadth_feet", e.target.value)}
                            placeholder="30"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* STEP 3 */}
                  {step === 2 && (
                    <>
                      <div>
                        <label htmlFor="cp-city" className={labelClass}>City</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            id="cp-city"
                            required
                            value={form.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            placeholder="e.g. Chennai"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cp-address" className={labelClass}>Address</label>
                        <textarea
                          id="cp-address"
                          required
                          rows={2}
                          value={form.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          placeholder="Street, locality, landmark..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label className={labelClass}>Photos</label>
                          <span className="text-xs text-stone-400">Optional</span>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-5 text-sm text-stone-500 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <ImagePlus size={20} />
                          <span>Click to upload from your device</span>
                          <span className="text-xs text-stone-400">PNG, JPG, WEBP</span>
                        </button>

                        {form.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {form.images.map((img, i) => (
                              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-stone-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(i)}
                                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="rounded-xl border border-stone-100 bg-stone-50 p-3 text-sm">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Summary</p>
                        <div className="space-y-1.5">
                          {[
                            ["Property", form.title || "—"],
                            ["Type", form.property_type],
                            ["City", form.city || "—"],
                            ["Images", `${form.images.length} added`],
                          ].map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-3">
                              <span className="text-stone-500">{label}</span>
                              <span className="max-w-[60%] truncate text-right font-medium text-stone-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Error / success */}
                {error && (
                  <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <X size={16} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                {success && (
                  <div role="status" className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    <CheckCircle2 size={16} />
                    Property created successfully!
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={previousStep}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                    >
                      <ArrowLeft size={15} />
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading || success}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#f56635] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e95425] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Creating..."
                      : step === steps.length - 1
                        ? "Create property"
                        : "Continue"}
                    {!loading && (step === steps.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />)}
                  </button>
                </div>
              </form>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
