const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tuitionmedia_token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? `Request failed: ${res.status}`);
  }
  return data as T;
}

export const apiGet = <T>(path: string) => api<T>(path, { method: "GET" });
export const apiPost = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "POST", body: JSON.stringify(body) });
export const apiPut = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "PUT", body: JSON.stringify(body) });
export const apiDelete = <T>(path: string) =>
  api<T>(path, { method: "DELETE" });
