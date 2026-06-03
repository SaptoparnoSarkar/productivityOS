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

// A single promise to coordinate concurrent token refresh attempts.
let refreshPromise: Promise<boolean> | null = null;

//The generic let's the caller what shape to expect.
export async function apiClient<T>(
  path: string,
  options?: RequestInit,
  isRetry = false,
): Promise<T> {
  //Calls fetch with http://localhost:4000 + path

  let response = await rawFetch(path, options);


  //Access Token Expire? Try to refresh ONCE
  //We only refresh for protected endpoints (not public auth endpoints starting with /auth/)
  if (response.status === 401 && !isRetry && !path.startsWith("/auth/")) {
    if (!refreshPromise) {
      refreshPromise = rawFetch("/auth/refresh-token", {
        method: "POST",
      })
        .then((res) => {
          refreshPromise = null; // Clear it when finished
          return res.ok;
        })
        .catch(() => {
          refreshPromise = null;
          return false;
        });
    }

    const isRefreshed = await refreshPromise;

    if (isRefreshed) {
      //New access token is now set, retry the original request
      return apiClient<T>(path, options, true);
    }

    //Fail because refresh also failed
    throw new Error("Session expired.");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
