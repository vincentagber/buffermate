/**
 * Safe fetch and response JSON parsers for Next.js and Safari/WebKit compatibility.
 * 
 * In Safari (WebKit), calling `res.json()` on an empty string, HTML error page (404/500/502),
 * or non-JSON stream immediately throws:
 * "DOMException: SyntaxError: The string did not match the expected pattern"
 * 
 * These utilities guarantee that responses are first read safely as text and parsed in a standard
 * JavaScript try/catch block, returning fallback objects without uncaught console errors.
 */

export async function parseResponseJson<T = any>(
  res: Response | null | undefined,
  fallback: T = {} as T
): Promise<T> {
  if (!res) return fallback;
  try {
    const text = await res.text();
    if (!text || !text.trim()) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fallback: T = {} as T
): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const res = await fetch(input, init);
    const data = await parseResponseJson<T>(res, fallback);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: fallback };
  }
}

