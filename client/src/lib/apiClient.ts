//API Client Wrapper
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function rawFetch(path: string, options?: RequestInit) {
  return fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...(options?.headers ?? {}),
    },
  });
}

// A single promise to coordinate token refresh attempts.
let refreshPromise: Promise<boolean> | null = null;

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
  isRetry = false,
): Promise<T> {
  //Calls fetch with http://localhost:4000 + path

  const response = await rawFetch(path, options);

  //Access Token Expire? Try to refresh ONCE
  //We only refresh for protected endpoints (not public auth endpoints starting with /auth/)
  if (response.status === 401 && !isRetry && !path.startsWith("/auth/")) {
    if (!refreshPromise) {
      refreshPromise = rawFetch("/auth/refresh-token", {
        method: "POST",
      })
        .then((res) => {
          if (res.status === 401) return false;
          // Server failures should show an error instead of logging the user out.
          if (!res.ok) {
            throw new Error("Unable to refresh session. Please try again")
          }
          return true;
        })
        .finally(() => {
         // Always allow a future refresh attempt.
          refreshPromise = null;
        });
    }
    const isRefreshed = await refreshPromise;
    if (isRefreshed) {
      //New access token is now set, retry the original request
      return apiClient<T>(path, options, true);
    }
    //If refresh also fail, leave the protected page.
    if (typeof window !== "undefined"){
      window.location.replace('/signin')
    }
    throw new Error("Session expired");
  }

  // Refresh succeeded, but the retried protected request is still unauthorized.
  if (response.status === 401 && isRetry) {
    if (typeof window !== "undefined") {
      window.location.replace("/signin");
    }
    throw new Error("Session expired.");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}
