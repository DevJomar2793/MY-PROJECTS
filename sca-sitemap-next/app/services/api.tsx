/**
 * services/api.tsx
 * ─────────────────────────────────────────────────────────────
 * Single source-of-truth for all HTTP calls to the FastAPI backend.
 * Every page/component that needs data should import from here —
 * never call fetch() directly elsewhere.
 * ─────────────────────────────────────────────────────────────
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Mirrors the FastAPI ScreenResponse schema */
export interface Screen {
  id: number;
  alpha: string;
  Screen_type: string;
  screen_number: number;
  screen_description: string;
  file_label: string;
  screen_label: string;
  notes: string;
  status: string;
  sitemap: string;
}

/** Payload for creating a new screen */
export interface ScreenCreate {
  alpha: string;
  Screen_type: string;
  screen_number: number;
  screen_description: string;
  file_label: string;
  screen_label: string;
  notes?: string;
  status: string;
  sitemap?: string;
}

/** Payload for updating an existing screen (all fields optional) */
export type ScreenUpdate = Partial<ScreenCreate>;

// ── Helper ────────────────────────────────────────────────────────────────────

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(
      detail?.detail ?? `Request failed with status ${res.status}`
    );
  }

  // 204 No Content → no body
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Exchange username + password for a JWT access token.
 * Token is returned — the caller (AuthContext) is responsible for storing it.
 */
export async function login(
  username: string,
  password: string
): Promise<{ access_token: string; token_type: string }> {
  // FastAPI's OAuth2PasswordRequestForm expects application/x-www-form-urlencoded
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }).toString(),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(detail?.detail ?? "Login failed");
  }

  return res.json();
}

// ── Screens ───────────────────────────────────────────────────────────────────

/** Fetch every screen in the database */
export async function fetchAllScreens(): Promise<Screen[]> {
  return request<Screen[]>("/screens");
}

/** Fetch screens where alpha = "A" (Admin) */
export async function fetchAdminScreens(): Promise<Screen[]> {
  return request<Screen[]>("/api/v1/screen/admin");
}

/** Fetch screens where alpha = "S" (Seller) */
export async function fetchSellerScreens(): Promise<Screen[]> {
  return request<Screen[]>("/api/v1/screen/seller");
}

/** Fetch a single screen by id */
export async function fetchScreenById(id: number): Promise<Screen> {
  return request<Screen>(`/screens/${id}`);
}

/** Create a new screen record */
export async function createScreen(payload: ScreenCreate): Promise<Screen> {
  return request<Screen>("/screens", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Partially update an existing screen */
export async function updateScreen(
  id: number,
  payload: ScreenUpdate
): Promise<Screen> {
  return request<Screen>(`/screens/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Permanently delete a screen */
export async function deleteScreen(id: number): Promise<void> {
  return request<void>(`/screens/${id}`, { method: "DELETE" });
}
