
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  // Deduplicate concurrent refresh calls — return the in-flight promise
  if (isRefreshing) return refreshPromise;

  isRefreshing = true;
  refreshPromise = fetch(
    `${API_BASE_URL!.replace(/\/+$/, "")}/auth/refresh`,
    { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } }
  )
    .then((r) => {
      if (r.ok) return r.json();
      // 401 = no cookie at all → safe to logout
      // 403 = token mismatch (can be a race in dev Strict Mode) → do NOT force logout here
      if (r.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
        window.dispatchEvent(new Event("auth-change"));
      }
      return null;
    })
    .then((data) => {
      if (!data) return null;
      const token = data?.accessToken ?? null;
      if (token) localStorage.setItem("accessToken", token);
      return token;
    })
    .catch(() => null)
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing from your .env.local file.");
  }

  const buildHeaders = (token: string | null) => {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  };

  const doFetch = (token: string | null) =>
    fetch(`${API_BASE_URL.replace(/\/+$/, "")}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: buildHeaders(token),
    });

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  let response = await doFetch(token);

  // Access token expired — silently refresh and retry once
  if (response.status === 401 && endpoint !== "/auth/refresh") {
    const newToken = await tryRefreshToken();
    if (newToken) {
      response = await doFetch(newToken);
    }
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as { error?: unknown; message?: unknown } | null;
    let message = "Something went wrong. Please try again.";
    if (typeof errorData?.message === "string") message = errorData.message;
    else if (typeof errorData?.error === "string") message = errorData.error;
    else if (response.status === 400) message = "Invalid input. Please check your details.";
    else if (response.status === 401) message = "Your session has expired. Please sign in again.";
    throw new Error(message);
  }

  return data as T;
}
