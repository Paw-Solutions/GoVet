/**
 * Helper HTTP para adjuntar Authorization: Bearer <ID_TOKEN>
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
  idToken?: string | null
) {
  const headers = new Headers(init.headers || {});
  if (idToken) {
    headers.set("Authorization", `Bearer ${idToken}`);
  }
  return fetch(input, { ...init, headers });
}