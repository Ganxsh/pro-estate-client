"use client";

import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 13 * 60 * 1000; // 13 min — before the 15-min access token expires

// Module-level flag prevents the double-invoke in React Strict Mode
// from firing two simultaneous refresh calls (which would cause a
// token-rotation race and log the user out immediately).
let mountRefreshDone = false;

async function refreshSession(): Promise<boolean> {
  try {
    // Call the raw fetch directly so we can inspect the HTTP status
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!.replace(/\/+$/, "")}/auth/refresh`,
      { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        window.dispatchEvent(new Event("auth-change"));
      }
      return true;
    }

    // 401 = no refresh cookie → genuinely logged out
    if (res.status === 401) return false;

    // 403 = token mismatch race (Strict Mode) → keep user logged in
    return true;
  } catch {
    // Network error → keep user logged in, will retry on next interval
    return true;
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) return;

    // Guard against React Strict Mode double-mount
    if (!mountRefreshDone) {
      mountRefreshDone = true;
      refreshSession().then((ok) => {
        if (!ok) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("authUser");
          window.dispatchEvent(new Event("auth-change"));
        }
      });
    }

    // Proactively refresh every 13 min to keep the session alive
    const interval = setInterval(async () => {
      if (!localStorage.getItem("authUser")) {
        clearInterval(interval);
        return;
      }
      const ok = await refreshSession();
      if (!ok) {
        clearInterval(interval);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
        window.dispatchEvent(new Event("auth-change"));
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
