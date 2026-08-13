const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  // Fails loudly at dev-time rather than silently hitting a wrong URL.
  console.error("VITE_API_BASE_URL is not set. Check your .env file.");
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Thin typed wrapper around fetch. Not swapped for axios/ky — the
 * product spec asks to avoid unnecessary libraries, and this covers
 * everything the backend routes need (JSON + multipart for CSV).
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const token = typeof localStorage !== "undefined" ? localStorage.getItem("mailflow_token") : null;
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: isFormData
      ? { ...authHeader, ...headers }
      : { "Content-Type": "application/json", ...authHeader, ...headers },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
};
