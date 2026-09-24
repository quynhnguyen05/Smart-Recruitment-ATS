export async function apiFetch<T>(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<T> {
  const token = typeof window === "undefined" ? null : localStorage.getItem("token");
  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error?.message || "Không thể xử lý yêu cầu");
  }

  return data as T;
}