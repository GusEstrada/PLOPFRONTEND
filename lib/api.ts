type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("plop_token");
}

export function setToken(token: string) {
  localStorage.setItem("plop_token", token);
}

export function clearToken() {
  localStorage.removeItem("plop_token");
}

export function removeUser() {
  localStorage.removeItem("plop_user");
}

export function getUser(): { id: string; name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("plop_user");
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user: { id: string; name: string; email: string }) {
  localStorage.setItem("plop_user", JSON.stringify(user));
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      removeUser();
    }
    const err = await res.json().catch(() => ({ error: "Error de conexión" }));
    throw new Error(err.error || `Error ${res.status}`);
  }

  return res.json();
}
