"use client";

import { useEffect, useState } from "react";
import { Plus, Building2 } from "lucide-react";
import { propertyApi } from "@/lib/propertyApi";
import type { Property } from "@/types/property";
import type { AuthUser } from "@/types/auth";
import CreatePropertyModal from "@/components/forms/CreatePropertyModal";
import MyPropertyCard from "@/components/properties/MyPropertyCard";
import EditPropertyModal from "@/components/properties/EditPropertyModal";
import DeletePropertyModal from "@/components/properties/DeletePropertyModal";
import PropertyDetailModal from "@/components/properties/PropertyDetailModal";

export default function PropertiesPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [deleteProperty, setDeleteProperty] = useState<Property | null>(null);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try { setAuthUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    const onAuth = () => {
      const s = localStorage.getItem("authUser");
      setAuthUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("auth-change", onAuth);
    return () => window.removeEventListener("auth-change", onAuth);
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyApi.getMine();
      setProperties(res.properties);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) fetchProperties();
    else setLoading(false);
  }, [authUser]);

  const handleCreated = () => {
    setCreateOpen(false);
    fetchProperties();
  };

  const handleUpdated = () => {
    setEditProperty(null);
    fetchProperties();
  };

  const handleDeleted = () => {
    setDeleteProperty(null);
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-[#f6f5f1]">
      {/* Banner */}
      <section className="relative mt-20 overflow-hidden bg-stone-900 px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-900/30" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              {authUser ? `Welcome back, ${authUser.name.split(" ")[0]}` : "Your property hub"}
            </div>
            <h1 className="font-serif text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
              My Properties
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
              Manage your listings — create, update, or remove properties anytime.
            </p>
          </div>

          {authUser && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#021b5f] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#021b5f]"
            >
              <Plus size={18} />
              Create Property
            </button>
          )}
        </div>
      </section>

      {/* Properties grid */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        {!authUser ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20 text-center">
            <Building2 size={40} className="mb-4 text-stone-300" />
            <p className="text-base font-semibold text-stone-700">Sign in to view your properties</p>
            <p className="mt-1 text-sm text-stone-400">Log in to manage your listings.</p>
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-stone-200" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20 text-center">
            <Building2 size={40} className="mb-4 text-stone-300" />
            <p className="text-base font-semibold text-stone-700">No properties yet</p>
            <p className="mt-1 text-sm text-stone-400">Click "Create Property" to add your first listing.</p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#021b5f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#021b5f]"
            >
              <Plus size={16} />
              Create Property
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-stone-500">{properties.length} listing{properties.length !== 1 ? "s" : ""}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <MyPropertyCard
                  key={p.id}
                  property={p}
                  onView={() => setDetailProperty(p)}
                  onEdit={() => setEditProperty(p)}
                  onDelete={() => setDeleteProperty(p)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modals */}
      <CreatePropertyModal
        isOpen={createOpen}
        onClose={handleCreated}
      />
      {editProperty && (
        <EditPropertyModal
          property={editProperty}
          onClose={() => setEditProperty(null)}
          onUpdated={handleUpdated}
        />
      )}
      {deleteProperty && (
        <DeletePropertyModal
          property={deleteProperty}
          onCancel={() => setDeleteProperty(null)}
          onDeleted={handleDeleted}
        />
      )}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onEdit={() => { setDetailProperty(null); setEditProperty(detailProperty); }}
          onDelete={() => { setDetailProperty(null); setDeleteProperty(detailProperty); }}
        />
      )}
    </div>
  );
}
