const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? {Authorization: `Bearer ${token}`} : {};
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

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
  options?: RequestInit,
  includeCredentials: boolean = true
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    method: "POST",
    credentials: includeCredentials ? "include" : "omit",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
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
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  return handleResponse(res);
}
