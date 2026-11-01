"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi, type UserProfile } from "@/lib/authApi";
import {
  User, Phone, Building2, CheckCircle2,
  AlertCircle, X, Calendar, Mail,
} from "lucide-react";

const POSTED_BY_OPTIONS = ["Owner", "Dealer", "Builder"] as const;
const BRAND = "#1c398e";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDrawer({ isOpen, onClose }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [builderName, setBuilderName] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch profile whenever drawer opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setSuccess("");
    setError("");
    authApi
      .getMe()
      .then(({ user }) => {
        setProfile(user);
        setPhone(user.phone ?? "");
        setPostedBy(user.posted_by ?? "");
        setBuilderName(user.builder_name ?? "");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (postedBy === "Builder" && !builderName.trim()) {
      setError("Builder name is required for Builder accounts.");
      return;
    }

    setSaving(true);
    try {
      const { user } = await authApi.updateMe({
        phone: phone.trim() || null,
        posted_by: postedBy || null,
        builder_name: postedBy === "Builder" ? builderName.trim() || null : null,
      });
      setProfile(user);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#e8edf8" }}
                >
                  <User size={17} style={{ color: BRAND }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Account Settings</p>
                  {profile && <p className="text-xs text-slate-400">{profile.email}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1c398e]" />
                </div>
              ) : !profile ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-slate-500">Unable to load profile.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile summary */}
                  <div className="rounded-2xl border shadow-md border-slate-300 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                        style={{ backgroundColor: BRAND }}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{profile.name}</p>
                        {profile.posted_by && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                            <CheckCircle2 size={10} />
                            {profile.posted_by}
                            {profile.posted_by === "Builder" && profile.builder_name && ` · ${profile.builder_name}`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2.5 text-sm text-slate-500">
                        <Mail size={14} className="shrink-0" /> {profile.email}
                      </div>
                      {profile.phone && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-500">
                          <Phone size={14} className="shrink-0" /> {profile.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2.5 text-sm text-slate-500">
                        <Calendar size={14} className="shrink-0" />
                        Member since{" "}
                        {new Date(profile.created_at).toLocaleDateString("en-IN", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Edit form */}
                  <form onSubmit={handleSave} className="space-y-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Profile</p>

                    {/* Phone */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Phone number <span className="font-normal text-slate-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none text-black transition focus:border-[#1c398e] focus:ring-2 focus:ring-[#1c398e]/10"
                        />
                      </div>
                    </div>

                    {/* Posted By */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-700">I am a</label>
                      <div className="grid grid-cols-3 gap-2">
                        {POSTED_BY_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setPostedBy(opt); if (opt !== "Builder") setBuilderName(""); }}
                            className={`rounded-xl cursor-pointer shadow-md border py-2.5 text-sm font-semibold transition ${
                              postedBy === opt
                                ? "border-[#1c398e] bg-[#1c398e] text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Builder name */}
                    <AnimatePresence>
                      {postedBy === "Builder" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Builder / Company name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input
                              type="text"
                              value={builderName}
                              onChange={(e) => setBuilderName(e.target.value)}
                              placeholder="e.g. Prestige Group"
                              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#1c398e] focus:ring-2 focus:ring-[#1c398e]/10"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {error && (
                      <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <AlertCircle size={15} className="shrink-0" /> {error}
                      </div>
                    )}
                    {success && (
                      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle2 size={15} className="shrink-0" /> {success}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex w-full items-center cursor-pointer justify-center rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                      style={{ backgroundColor: BRAND }}
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
