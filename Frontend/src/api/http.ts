/**
 * Helper HTTP para adjuntar Authorization: Bearer <SESSION_TOKEN>
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
  sessionToken?: string | null  // <-- ahora espera el token propio
) {
  const headers = new Headers(init.headers || {});
  if (sessionToken) {
    headers.set("Authorization", `Bearer ${sessionToken}`);
  }
  return fetch(input, { ...init, headers });
}