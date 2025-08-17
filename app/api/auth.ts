const BASE_URL = "http://localhost:8000";

export async function apiGet(path: string) {
  return fetch(`${BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function apiPost(path: string, body: Record<string, unknown>) {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
