"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCircle2,
  ChevronDown, ImagePlus, IndianRupee, MapPin, Ruler, X,
} from "lucide-react";
import { propertyApi } from "@/lib/propertyApi";
import type { Property, CreatePropertyPayload } from "@/types/property";

interface Props {
  property: Property;
  onClose: () => void;
  onUpdated: () => void;
}

const propertyTypes: CreatePropertyPayload["property_type"][] = [
  "Residential Apartment", "Residential Plot", "Independent House / Villa", "Farm House",
];

const steps = [
  { title: "Property details", icon: Building2 },
  { title: "Price & area", icon: IndianRupee },
  { title: "Location & photos", icon: MapPin },
];

const inputClass = "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";
const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

export default function EditPropertyModal({ property, onClose, onUpdated }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: property.title,
    description: property.description,
    property_type: property.property_type,
    price: String(property.price),
    bedrooms: String(property.bedrooms),
    total_square_feet: property.total_square_feet ? String(property.total_square_feet) : "",
    length_feet: property.length_feet ? String(property.length_feet) : "",
    breadth_feet: property.breadth_feet ? String(property.breadth_feet) : "",
    city: property.city,
    address: property.address,
    images: property.images ?? [],
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [field]: value }));

  const validate = () => {
    setError("");
    if (step === 0) {
      if (!form.title.trim() || !form.description.trim()) { setError("Please enter a title and description."); return false; }
      return true;
    }
    if (step === 1) {
      const price = Number(form.price);
      if (!form.price.trim() || !Number.isFinite(price) || price <= 0) { setError("Please enter a valid price."); return false; }
      for (const [label, val] of [["Total area", form.total_square_feet], ["Length", form.length_feet], ["Breadth", form.breadth_feet]] as const) {
        if (val.trim() !== "" && (!Number.isFinite(Number(val)) || Number(val) <= 0)) { setError(`${label} must be greater than zero.`); return false; }
      }
      return true;
    }
    if (!form.city.trim() || !form.address.trim()) { setError("Please enter city and address."); return false; }
    return true;
  };

  const nextStep = () => { if (validate()) { setStep((s) => s + 1); setError(""); } };
  const prevStep = () => { setStep((s) => s - 1); setError(""); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setForm((p) => ({ ...p, images: p.images.includes(result) ? p.images : [...p.images, result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (i: number) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const opt = (v: string) => (v.trim() === "" ? null : Number(v));
    try {
      setLoading(true);
      setError("");
      await propertyApi.update(property.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        property_type: form.property_type,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        total_square_feet: opt(form.total_square_feet),
        length_feet: opt(form.length_feet),
        breadth_feet: opt(form.breadth_feet),
        city: form.city.trim(),
        address: form.address.trim(),
        images: form.images,
      });
      setSuccess(true);
      setTimeout(() => onUpdated(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          role="dialog" aria-modal="true"
          className="relative my-auto grid w-full scale-75 max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[1fr_1.1fr]"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <button type="button" onClick={onClose} className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-sm transition hover:bg-stone-100">
            <X size={19} />
          </button>

          {/* Left image panel */}
          <aside className="relative hidden min-h-[560px] overflow-hidden md:block">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <div className="absolute inset-x-8 bottom-10">
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-md">Edit listing</span>
              <h3 className="mt-4 font-serif text-4xl leading-tight text-white">Update your<br /><span className="font-light italic text-orange-300">property details.</span></h3>
              <div className="mt-8 space-y-3">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.title} className={`flex items-center gap-3 text-sm ${i === step ? "text-white" : i < step ? "text-orange-300" : "text-white/40"}`}>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${i < step ? "border-orange-400 bg-orange-500 text-white" : i === step ? "border-white bg-white/20 text-white" : "border-white/20 bg-white/5 text-white/40"}`}>
                        {i < step ? <Check size={13} /> : <Icon size={13} />}
                      </span>
                      <span className={i === step ? "font-semibold" : ""}>{s.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right form */}
          <section className="flex max-h-[90vh] flex-col overflow-y-auto px-6 py-8 sm:px-8 sm:py-10 md:max-h-none">
            <div className="mb-6">
              {/* <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">Edit listing</p> */}
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-stone-950 sm:text-3xl">Edit {steps[step].title}</h2>
              <p className="mt-1 text-sm text-stone-500">Step {step + 1} of {steps.length}</p>
              <div className="mt-4 flex gap-1.5">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-orange-500" : "bg-stone-100"}`} />
                ))}
              </div>
            </div>

            <form className="flex flex-1 flex-col" onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              <div className="flex-1 space-y-4">

                {step === 0 && (
                  <>
                    <div>
                      <label htmlFor="ep-type" className={labelClass}>Property type</label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <select id="ep-type" value={form.property_type} onChange={(e) => update("property_type", e.target.value as CreatePropertyPayload["property_type"])} className={`${inputClass} appearance-none pl-11 pr-10`}>
                          {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="ep-title" className={labelClass}>Property title</label>
                      <input id="ep-title" required maxLength={150} value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="ep-desc" className={labelClass}>Description</label>
                      <textarea id="ep-desc" required rows={3} maxLength={5000} value={form.description} onChange={(e) => update("description", e.target.value)} className={`${inputClass} resize-none`} />
                      <p className="mt-1 text-right text-xs text-stone-400">{form.description.length}/5000</p>
                    </div>
                    <div>
                      <label htmlFor="ep-beds" className={labelClass}>Bedrooms</label>
                      <div className="relative">
                        <select id="ep-beds" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={`${inputClass} appearance-none pr-10`}>
                          {[0,1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n === 0 ? "Not applicable" : `${n} bedroom${n > 1 ? "s" : ""}`}</option>)}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <label htmlFor="ep-price" className={labelClass}>Expected price (₹)</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input id="ep-price" required type="number" min="1" step="any" value={form.price} onChange={(e) => update("price", e.target.value)} className={`${inputClass} pl-11`} />
                      </div>
                    </div>
                    {form.price && Number(form.price) > 0 && (
                      <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3">
                        <p className="text-xs text-stone-500">Asking price</p>
                        <p className="mt-0.5 text-xl font-semibold text-stone-900">₹{Number(form.price).toLocaleString("en-IN")}</p>
                      </div>
                    )}
                    <div>
                      <div className="mb-2 flex items-center gap-2"><Ruler size={15} className="text-orange-600" /><span className="text-sm font-semibold text-stone-800">Dimensions (optional)</span></div>
                      <label htmlFor="ep-sqft" className={labelClass}>Total area (sq. ft.)</label>
                      <input id="ep-sqft" type="number" min="0.01" step="any" value={form.total_square_feet} onChange={(e) => update("total_square_feet", e.target.value)} placeholder="e.g. 1200" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="ep-len" className={labelClass}>Length (ft)</label>
                        <input id="ep-len" type="number" min="0.01" step="any" value={form.length_feet} onChange={(e) => update("length_feet", e.target.value)} placeholder="40" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="ep-bre" className={labelClass}>Breadth (ft)</label>
                        <input id="ep-bre" type="number" min="0.01" step="any" value={form.breadth_feet} onChange={(e) => update("breadth_feet", e.target.value)} placeholder="30" className={inputClass} />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label htmlFor="ep-city" className={labelClass}>City</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input id="ep-city" required value={form.city} onChange={(e) => update("city", e.target.value)} className={`${inputClass} pl-11`} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="ep-addr" className={labelClass}>Address</label>
                      <textarea id="ep-addr" required rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} className={`${inputClass} resize-none`} />
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className={labelClass}>Photos</label>
                        <span className="text-xs text-stone-400">Optional</span>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-5 text-sm text-stone-500 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600">
                        <ImagePlus size={20} />
                        <span>Click to upload photos</span>
                        <span className="text-xs text-stone-400">PNG, JPG, WEBP</span>
                      </button>
                      {form.images.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {form.images.map((img, i) => (
                            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-stone-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt={`img ${i + 1}`} className="h-full w-full object-cover" />
                              <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600">
                                <X size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <X size={16} className="mt-0.5 shrink-0" /><p>{error}</p>
                </div>
              )}
              {success && (
                <div role="status" className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  <CheckCircle2 size={16} />Updated successfully!
                </div>
              )}

              <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
                {step > 0 ? (
                  <button type="button" onClick={prevStep} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50">
                    <ArrowLeft size={15} />Back
                  </button>
                ) : (
                  <button type="button" onClick={onClose} disabled={loading} className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={loading || success} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#f56635] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e95425] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Saving..." : step === 2 ? "Save changes" : "Continue"}
                  {!loading && (step === 2 ? <Check size={16} /> : <ArrowRight size={16} />)}
                </button>
              </div>
            </form>
          </section>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
