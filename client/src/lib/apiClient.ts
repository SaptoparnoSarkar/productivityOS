//API Client Wrapper

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

//The generic let's the caller what shape to expect.
export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  //Calls fetch with http://localhost:4000 + path
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}
