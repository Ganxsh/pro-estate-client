
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  // Deduplicate concurrent refresh calls
  if (isRefreshing) return refreshPromise;

  isRefreshing = true;
  refreshPromise = fetch(
    `${API_BASE_URL!.replace(/\/+$/, "")}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then(async (r) => {
      if (r.ok) {
        const data = await r.json();
        const token: string | null = data?.accessToken ?? null;
        if (token) {
          localStorage.setItem("accessToken", token);
          if (data?.user) {
            localStorage.setItem("authUser", JSON.stringify(data.user));
          }
        }
        return token;
      }

      // 401 = refresh cookie genuinely missing → safe to clear session
      if (r.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
        window.dispatchEvent(new Event("auth-change"));
      }
      // 403 = token rotation race → do NOT logout, just return null
      // 5xx = server error → do NOT logout
      return null;
    })
    .catch(() => null) // Network error → keep session, return null
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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  let response = await doFetch(token);

  // Access token expired → silently refresh and retry once
  if (response.status === 401 && endpoint !== "/auth/refresh") {
    const newToken = await tryRefreshToken();
    if (newToken) {
      response = await doFetch(newToken);
    }
    // If newToken is null (refresh failed), fall through to the error handler below
    // which will throw a 401 error — do NOT force logout here, AuthProvider handles that
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as { error?: unknown; message?: unknown } | null;
    let message = "Something went wrong. Please try again.";
    if (typeof errorData?.message === "string") message = errorData.message;
    else if (typeof errorData?.error === "string") message = errorData.error;
    else if (response.status === 400) message = "Invalid input. Please check your details.";
    else if (response.status === 401) message = "Your session has expired. Please sign in again.";
    else if (response.status === 403) message = "You don't have permission to do that.";
    else if (response.status === 404) message = "The requested resource was not found.";
    else if (response.status === 500) message = "Server error. Please try again later.";
    const err = new Error(message);
    (err as Error & { status: number }).status = response.status;
    throw err;
  }

  return data as T;
}
