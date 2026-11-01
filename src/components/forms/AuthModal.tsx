"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Eye,
  EyeOff,
  Building2,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { authApi } from "@/lib/authApi";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      if (mode === "register") {
        await authApi.register({
          name: name.trim(),
          email: email.trim(),
          password: password,
        });

        setMessage("Account created successfully. Please sign in.");
        setMode("login");
        setPassword("");
        return;
      }

      const result = await authApi.login({
        email: email.trim(),
        password: password,
      });

      if (!result.accessToken) {
        throw new Error("Login succeeded but no access token was returned.");
      }
      if (!result.user) {
        throw new Error("Login succeeded but no user data was returned.");
      }
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      window.dispatchEvent(new Event("auth-change"));
      onClose();
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
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
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close authentication popup"
              className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition hover:bg-gray-100 hover:text-black"
            >
              <X size={19} />
            </button>

            {/* Left: form */}
            <section className="flex items-center justify-center px-6 py-9 sm:px-10 sm:py-12">
              <div className="w-full max-w-sm">
                <h2
                  id="auth-title"
                  className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl"
                >
                  {mode === "login" ? "Welcome back" : "Create an account"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {mode === "login"
                    ? "Sign in to explore your next property."
                    : "Create your account and find your next home."}
                </p>

                {/* Mode switch */}
                <div className="mt-6 grid grid-cols-2 rounded-full bg-gray-100 shadow-inner shadow-black/20 p-1">
                  {(["login", "register"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setMode(item);
                        setMessage("");
                      }}
                      className={`rounded-full  px-4 py-2.5 text-sm font-medium capitalize transition ${
                        mode === item
                          ? "bg-white text-gray-900 shadow-md border border-gray-200"
                          : "text-gray-500 cursor-pointer hover:text-gray-800"
                      }`}
                    >
                      {item === "login" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {mode === "register" && (
                    <div>
                      <label
                        htmlFor="auth-name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Full name
                      </label>
                      <div className="relative">
                        <UserRound
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          id="auth-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          autoComplete="name"
                          required
                          minLength={2}
                          className="h-11 w-full text-black placeholder:text-gray-600 rounded-xl border border-gray-200 pl-11 pr-3 text-sm outline-none focus:border-[#174e43] focus:ring-4 focus:ring-[#174e43]/10"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="auth-email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="h-11 w-full text-black placeholder:text-gray-600 rounded-xl border border-gray-200 pl-11 pr-3 text-sm outline-none focus:border-[#174e43] focus:ring-4 focus:ring-[#174e43]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="auth-password"
                      className="mb-2 block text-sm  font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        minLength={8}
                        required
                        className="h-11 w-full text-black placeholder:text-gray-600 rounded-xl border border-gray-200 pl-11 pr-12 text-sm outline-none focus:border-[#174e43] focus:ring-4 focus:ring-[#174e43]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {message && (
                    <p role="status" className="text-sm text-amber-700">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#171717] text-sm font-semibold text-white transition hover:bg-[#021b5f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading
                      ? "Please wait..."
                      : mode === "login"
                        ? "Sign in"
                        : "Create account"}

                    {!isLoading && (
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-500">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "login" ? "register" : "login");
                      setMessage("");
                    }}
                    className="font-semibold text-[#174e43] hover:underline"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </section>

            {/* Right: property image */}
            <aside className="relative m-3 hidden min-h-[540px] overflow-hidden rounded-xl bg-[#173d34] md:block">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />

              <div className="absolute inset-x-7 bottom-8 text-white lg:inset-x-9 lg:bottom-10">
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs backdrop-blur-md">
                  Find your place
                </span>
                <h3 className="mt-4 text-3xl font-semibold leading-tight lg:text-4xl">
                  Your next chapter
                  <br />
                  <span className="font-light italic">starts at home.</span>
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                  Discover beautiful homes and property investment opportunities
                  with ProEstate.
                </p>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
