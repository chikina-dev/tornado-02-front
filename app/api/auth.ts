const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });
  if(!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>
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
      ...(options?.headers || {}),
     },
    body: JSON.stringify(body),
  });

  if(!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as T;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if(!res.ok) throw new Error(`UPLOAD ${path} failed: ${res.status}`);
  return res.json() as Promise<T>
}
