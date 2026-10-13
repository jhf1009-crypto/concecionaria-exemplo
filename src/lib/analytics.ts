declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(
  event: string,
  parameters: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  try {
    if (JSON.parse(localStorage.getItem("ninho-consent") || "{}").analytics)
      window.gtag?.("event", event, parameters);
  } catch {
    /* Storage may be disabled. */
  }
}
export function attribution() {
  if (typeof window === "undefined") return {};
  const query = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].flatMap((key) =>
      query.has(key) ? [[key, query.get(key)!.slice(0, 300)]] : [],
    ),
  );
}
