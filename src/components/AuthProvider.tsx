"use client";

import { useEffect, useRef } from "react";

const REFRESH_INTERVAL_MS = 12 * 60 * 1000;
const SESSION_FLAG_KEY = "auth_refresh_done";

async function refreshSession(retryOn401 = false): Promise<"ok" | "logged_out" | "network_error"> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!.replace(/\/+$/, "")}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.user) {
          localStorage.setItem("authUser", JSON.stringify(data.user));
        }
        window.dispatchEvent(new Event("auth-change"));
      }
      return "ok";
    }

    if (res.status === 401) {
      // On page-load in production, cookies can be delayed by the browser on
      // the very first request (cold start, SameSite timing). Retry once after
      // a short delay before treating this as a genuine logout.
      if (retryOn401) {
        await new Promise((r) => setTimeout(r, 1500));
        return refreshSession(false);
      }
      return "logged_out";
    }

    // 403 = token rotation race → keep session
    // 5xx = server error → keep session, retry on next interval
    return "ok";
  } catch {
    return "network_error";
  }
}

function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
  sessionStorage.removeItem(SESSION_FLAG_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");

    // No user stored → nothing to do
    if (!storedUser) return;

    // Use sessionStorage flag to prevent double-invoke in React Strict Mode
    // sessionStorage is per-tab and cleared on tab close, so it correctly
    // re-runs on a new tab/hard refresh without the module-level variable problem
    const alreadyRefreshed = sessionStorage.getItem(SESSION_FLAG_KEY);

    if (!alreadyRefreshed) {
      sessionStorage.setItem(SESSION_FLAG_KEY, "1");

      // Pass retryOn401=true so production cold-start cookie delays don't
      // cause a false logout on the first page load/refresh.
      refreshSession(true).then((result) => {
        if (result === "logged_out") {
          clearSession();
        }
      });
    }

    // Proactive refresh interval — keeps long sessions alive
    intervalRef.current = setInterval(async () => {
      // Stop if user logged out in another tab
      if (!localStorage.getItem("authUser")) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const result = await refreshSession();
      if (result === "logged_out") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        clearSession();
      }
    }, REFRESH_INTERVAL_MS);

    // Sync logout across tabs via storage event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authUser" && e.newValue === null) {
        // Another tab logged out — clear this tab too
        if (intervalRef.current) clearInterval(intervalRef.current);
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("auth-change"));
      }
      if (e.key === "authUser" && e.newValue !== null && e.oldValue === null) {
        // Another tab logged in — sync this tab
        window.dispatchEvent(new Event("auth-change"));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}
