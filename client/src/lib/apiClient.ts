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

//The generic let's the caller what shape to expect.
export async function apiClient<T>(
  path: string,
  options?: RequestInit,
  isRetry = false,
): Promise<T> {
  //Calls fetch with http://localhost:4000 + path

  let response = await rawFetch(path, options);


  //Access Token Expire? Try to refresh ONCE
  if (response.status === 401 && !isRetry && path !== "/auth/refresh-token") {
    const refreshRes = await rawFetch("/auth/refresh-token", {
      method: "POST"
    })

    if (refreshRes.ok) {
      //New access token is now set
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
