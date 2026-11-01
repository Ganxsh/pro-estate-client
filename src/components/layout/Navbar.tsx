
"use client";

type SearchSuggestion = {
  type: "title" | "city" | "address" | "type" | "price" | "sqft";
  label: string;
  href: string;
};

const typeIcon: Record<SearchSuggestion["type"], string> = {
  title: "🏠",
  city: "📍",
  address: "🗺️",
  type: "🏗️",
  price: "💰",
  sqft: "📐",
};

const typeLabel: Record<SearchSuggestion["type"], string> = {
  title: "Property",
  city: "City",
  address: "Address",
  type: "Type",
  price: "Price",
  sqft: "Area",
};

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Search,
} from "lucide-react";
import Image from "next/image";
import AuthModal from "../forms/AuthModal";
import CreatePropertyModal from "../forms/CreatePropertyModal";
import AccountDrawer from "./AccountDrawer";
import type { AuthUser } from "@/types/auth";
import LogoutConfirmModal from "../modal/LogoutConfirmModal";
import { authApi } from "@/lib/authApi";
import { propertyApi } from "@/lib/propertyApi";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Buy", href: "/properties?purpose=buy" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
];



export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [createPropertyOpen, setCreatePropertyOpen] = useState(false);
  const [createPropertyRedirect, setCreatePropertyRedirect] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchSuggestion[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const syncAuthUser = () => {
      const savedUser = localStorage.getItem("authUser");
      if (!savedUser || savedUser === "undefined") {
        setAuthUser(null);
        return;
      }
      try {
        setAuthUser(JSON.parse(savedUser) as AuthUser);
      } catch {
        setAuthUser(null);
        localStorage.removeItem("authUser");
      }
    };

    syncAuthUser();
    window.addEventListener("auth-change", syncAuthUser);
    return () => window.removeEventListener("auth-change", syncAuthUser);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await propertyApi.getAll({ search: searchQuery.trim(), limits: 30 });
        const q = searchQuery.trim().toLowerCase();
        const suggestions: SearchSuggestion[] = [];
        const seen = new Set<string>();

        const add = (type: SearchSuggestion["type"], label: string, href: string) => {
          const key = `${type}:${label}`;
          if (!seen.has(key)) { seen.add(key); suggestions.push({ type, label, href }); }
        };

        for (const p of res.properties) {
          if (p.title?.toLowerCase().includes(q)) add("title", p.title, `/properties/${p.id}`);
          if (p.city?.toLowerCase().includes(q)) add("city", p.city, `/properties?city=${encodeURIComponent(p.city)}`);
          if (p.address?.toLowerCase().includes(q)) add("address", p.address, `/properties/${p.id}`);
          if (p.property_type?.toLowerCase().includes(q)) add("type", p.property_type, `/properties?property_type=${encodeURIComponent(p.property_type)}`);
          if (String(p.price).includes(q)) add("price", `₹${Number(p.price).toLocaleString("en-IN")}`, `/properties/${p.id}`);
          if (p.total_square_feet && String(p.total_square_feet).includes(q)) add("sqft", `${p.total_square_feet} sq.ft`, `/properties/${p.id}`);
        }

        setSearchResults(suggestions.slice(0, 8));
        setSearchOpen(suggestions.length > 0);
      } catch {
        setSearchResults([]);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function handleMyProperties() {
    setAccountMenuOpen(false);
    setMobileOpen(false);
    try {
      const res = await propertyApi.getMine();
      if (res.properties.length > 0) {
        router.push("/user/manageProperty");
      } else {
        setCreatePropertyRedirect(true);
        setCreatePropertyOpen(true);
      }
    } catch {
      setCreatePropertyRedirect(true);
      setCreatePropertyOpen(true);
    }
  }

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore — clear client state regardless
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    setAuthUser(null);
    window.dispatchEvent(new Event("auth-change"));
  }


  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="ProEstate home"
      className="flex shrink-0  items-center gap-2"
    >
     <Image src="/logo/ProEstate-Logo.png" className={`${mobileOpen ? "brightness-100" : "brightness-0"}`} alt="ProEstate Logo" width={140} height={140} style={{ height: "auto" }} />
    </Link>
  );
}

  return (
    <>
    <header className={`fixed w-full top-0 z-50 border-b transition-all duration-300 backdrop-blur-xl${mobileOpen ? " border-transparent bg-transparent" : ` border-slate-200/80 bg-white/95${scrolled ? " shadow-md" : ""}`}`}>
      <nav
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        <BrandLogo />

        {/* Search bar */}
        <div ref={searchRef} className="relative hidden w-64 md:block">
          <div className="flex items-center gap-2 rounded-sm border border-slate-300 shadow-md bg-white px-3 py-2 focus-within:border-blue-400 focus-within:bg-white transition">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
              className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(""); setSearchOpen(false); }}>
                <X size={13} className="text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
          {searchOpen && searchResults.length > 0 && (
            <ul className="absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {searchResults.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                      router.push(s.href);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="text-base">{typeIcon[s.type]}</span>
                    <span className="flex-1 truncate text-left">{s.label}</span>
                    <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {typeLabel[s.type]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-[#1c398e]"
            >
              {link.label}
          
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
     {authUser ? (
           <div className="relative">
  {/* Username button */}
  <button
    type="button"
    onClick={() => setAccountMenuOpen((prev) => !prev)}
    aria-expanded={accountMenuOpen}
    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
  >
    <span>
      Hi, {authUser.name.split(" ")[0]}
    </span>

    <svg
      className={`h-4 w-4 transition-transform ${
        accountMenuOpen ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m5 7.5 5 5 5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>

  {/* Dropdown menu */}
  {accountMenuOpen && (
    <>
      {/* Click outside to close */}
      <button
        type="button"
        aria-label="Close account menu"
        className="fixed inset-0 z-40 cursor-default"
        onClick={() => setAccountMenuOpen(false)}
      />

      <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
        {/* User details */}
        <div className="border-b border-slate-100 px-3 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {authUser.name}
          </p>
          <p className="truncate text-xs text-slate-500">
            {authUser.email}
          </p>
        </div>

        {/* Account */}
        <button
          type="button"
          onClick={() => {
            setAccountMenuOpen(false);
            setMobileOpen(false);
            setAccountOpen(true);
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <svg
            className="h-5 w-5 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle cx="12" cy="8" r="4" />
            <path
              d="M5 21v-2a7 7 0 0 1 14 0v2"
              strokeLinecap="round"
            />
          </svg>
          Account
        </button>

        {/* My Properties */}
        <button
          type="button"
          onClick={handleMyProperties}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <svg
            className="h-5 w-5 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              d="M3 10.5 12 3l9 7.5V21H3V10.5Z"
              strokeLinejoin="round"
            />
            <path d="M9 21v-7h6v7" />
          </svg>
          My Properties
        </button>

        <div className="my-2 border-t border-slate-100" />

        {/* Logout */}
      <button
  type="button"
  onClick={() => {
    setAccountMenuOpen(false);
    setShowLogoutConfirm(true);
  }}
  className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
>
  Log out
</button>
      </div>
    </>
  )}
</div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Log in
            </button>
          )}


<button
  type="button"
  onClick={() => setCreatePropertyOpen(true)}
  className="group inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:border-[#1c398e] hover:bg-blue-50 hover:shadow-md"
>
  <span>Post property</span>

  {/* Animated FREE badge */}
  <span className="relative inline-flex h-[19px] w-[34px]  overflow-hidden rounded-[4px] bg-green-600">
    <motion.span
      className="absolute inset-0 flex  items-center justify-center text-[9px] font-extrabold tracking-tight text-white"
      animate={{ x: [0, 0, 32, 32, 0] }}
      transition={{
        duration: 2.2,
        ease: "easeInOut",
        times: [0, 0.45, 0.65, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 0.4,
      }}
    >
      FREE
    </motion.span>

    <motion.span
      className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold tracking-tight text-white"
      initial={{ x: -32 }}
      animate={{ x: [-32, -32, 0, 0, 32] }}
      transition={{
        duration: 2.2,
        ease: "easeInOut",
        times: [0, 0.45, 0.65, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 0.4,
      }}
    >
      FREE
    </motion.span>
  </span>

  <ArrowUpRight
    size={15}
    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
  />
</button>

        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg transition md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 90, opacity: 0, scale: 0.5 } : { rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`absolute ${mobileOpen ? "text-white" : "text-slate-700"}`}
          >
            <Menu size={22} />
          </motion.span>
          <motion.span
            animate={mobileOpen ? { rotate: 0, opacity: 1, scale: 1 } : { rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`absolute ${mobileOpen ? "text-white" : "text-slate-700"}`}
          >
            <X size={22} />
          </motion.span>
        </button>
      </nav>
    </header>

      {/* Mobile fullscreen overlay */}
      <motion.div
        key="mobile-menu"
        initial={false}
        animate={mobileOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed inset-0 z-40 md:hidden${mobileOpen ? " pointer-events-auto" : " pointer-events-none"}`}
        style={{ background: "linear-gradient(135deg, #1a2e6e 0%, #1c398e 60%, #2a4fa8 100%)" }}
      >
       

        {/* Search bar */}
        <div className="px-6 pb-6 pt-20">
          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <Search size={16} className="shrink-0 text-white/60" />
            <input
              type="text"
              placeholder="Search properties, cities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(""); setSearchOpen(false); }}>
                <X size={13} className="text-white/60" />
              </button>
            )}
          </div>
          {/* Mobile search results */}
          {searchOpen && searchResults.length > 0 && (
            <ul className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm">
              {searchResults.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setSearchOpen(false); setMobileOpen(false); router.push(s.href); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
                  >
                    <span>{typeIcon[s.type]}</span>
                    <span className="flex-1 truncate text-left">{s.label}</span>
                    <span className="shrink-0 rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white/80">{typeLabel[s.type]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Nav links */}
        <nav className="px-6">
          {[
            ...navLinks,
            ...(authUser
              ? [{ label: "My Properties", href: "/user/manageProperty" }]
              : []),
          ].map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: -24 }}
              animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.32, delay: mobileOpen ? 0.08 + i * 0.07 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center justify-between border-b border-white/10 py-5"
              >
                <span className="text-3xl font-medium text-white tracking-tight">{link.label}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition group-hover:bg-white/10">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.35, delay: mobileOpen ? 0.38 : 0, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6"
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">Account</p>
          <p className="mb-5 text-xs text-white/50">
            {authUser ? `Signed in as ${authUser.name}` : "Sign in to manage your listings"}
          </p>
          <div className="flex gap-3">
            {authUser ? (
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setShowLogoutConfirm(true); }}
                className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log in
              </button>
            )}
            <button
              type="button"
              onClick={() => { setMobileOpen(false); setCreatePropertyOpen(true); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-[#1c398e] transition hover:bg-white/90"
            >
              Post Property
              <ArrowUpRight size={15} />
            </button>
          </div>
        </motion.div>
      </motion.div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <AccountDrawer isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
      <CreatePropertyModal
        isOpen={createPropertyOpen}
        onClose={() => {
          setCreatePropertyOpen(false);
          if (createPropertyRedirect) {
            setCreatePropertyRedirect(false);
            router.push("/user/manageProperty");
          }
        }}
      />
<LogoutConfirmModal
  isOpen={showLogoutConfirm}
  isLoading={isLoggingOut}
  onCancel={() => setShowLogoutConfirm(false)}
  onConfirm={async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await handleLogout();
      setShowLogoutConfirm(false);
      setMobileOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  }}
/>
    </>
  );
}
