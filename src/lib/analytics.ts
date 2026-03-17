// GA4 event helper — safe to call even if GA isn't loaded

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Pre-defined conversion events
export function trackFormSubmission(formName: string, extra?: Record<string, string>) {
  trackEvent("generate_lead", {
    form_name: formName,
    ...extra,
  });
}
