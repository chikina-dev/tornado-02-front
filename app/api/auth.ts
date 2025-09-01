const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? {Authorization: `Bearer ${token}`} : {};
}

export async function apiRefreshToken(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("Refresh token missing");

  const res = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ refresh_token: refreshToken}),
  });

  if(!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP error ${res.status}`;
    try {
      const data = await res.json();
      message = data.error || message;
    } catch(_) {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  let res = await fetch(input, {...init, headers:{ ...(init?.headers || {}), ...getAuthHeaders()}, credentials: "include"});

  if (res.status === 401) {
    try {
      await apiRefreshToken();

      res = await fetch(input, { ...init, headers: { ...(init?.headers || {}), ...getAuthHeaders()}, credentials: "include"});
    } catch {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }
  
  return res;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithAuth(`${BASE_URL}${path}`, { method: "GET" });
  return handleResponse<T>(res);
}

export async function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
  options?: RequestInit,
  includeCredentials: boolean = true
): Promise<T> {
  const res = await fetchWithAuth(`${BASE_URL}${path}`, {
    ...options,
    method: "POST",
    credentials: includeCredentials ? "include" : "omit",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiUpload<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const res = await fetchWithAuth(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<T>(res);
}
