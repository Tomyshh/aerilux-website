import type { Analytics } from 'firebase/analytics';

const STORAGE_KEY = 'aerilux:analytics_consent';
type ConsentValue = 'granted' | 'denied';

export const ANALYTICS_CURRENCY = 'USD';

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
  item_variant?: string;
};

let analyticsInstance: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;
let analyticsModule: typeof import('firebase/analytics') | null = null;

function getStoredConsent(): ConsentValue | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'granted' || v === 'denied') return v;
    return null;
  } catch {
    return null;
  }
}

function setStoredConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return getStoredConsent() === 'granted';
}

export function shouldShowConsentPrompt(): boolean {
  if (typeof window === 'undefined') return false;
  return getStoredConsent() === null;
}

export function grantAnalyticsConsent(): void {
  if (typeof window === 'undefined') return;
  setStoredConsent('granted');
  // Initialisation async volontairement "fire and forget"
  void initAnalytics();
}

export function denyAnalyticsConsent(): void {
  if (typeof window === 'undefined') return;
  setStoredConsent('denied');
}

async function getAnalyticsModule() {
  if (analyticsModule) return analyticsModule;
  analyticsModule = await import('firebase/analytics');
  return analyticsModule;
}

async function initAnalytics(): Promise<Analytics | null> {
  if (process.env.NODE_ENV !== 'production') return null;
  if (!hasAnalyticsConsent()) return null;

  if (analyticsInstance) return analyticsInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const mod = await getAnalyticsModule();
    const supported = await mod.isSupported().catch(() => false);
    if (!supported) return null;

    const { app } = await import('../lib/firebase');
    const a = mod.getAnalytics(app);
    // Par principe on garde la collecte activée uniquement après consentement.
    mod.setAnalyticsCollectionEnabled(a, true);

    analyticsInstance = a;
    return a;
  })();

  return initPromise;
}

export async function trackPageView(params: {
  path: string;
  title?: string;
  location?: string;
}): Promise<void> {
  if (process.env.NODE_ENV !== 'production') return;
  if (!hasAnalyticsConsent()) return;

  const a = await initAnalytics();
  if (!a) return;

  const mod = await getAnalyticsModule();
  mod.logEvent(a, 'page_view', {
    page_path: params.path,
    page_title: params.title,
    page_location: params.location,
  });
}

export async function trackEvent(
  name: string,
  params?: Record<string, unknown>
): Promise<void> {
  if (process.env.NODE_ENV !== 'production') return;
  if (!hasAnalyticsConsent()) return;

  const a = await initAnalytics();
  if (!a) return;

  const mod = await getAnalyticsModule();
  mod.logEvent(a, name as never, params as never);
}

export async function trackSelectContent(params: {
  contentType: string;
  itemId?: string;
  itemName?: string;
  location?: string;
}): Promise<void> {
  return trackEvent('select_content', {
    content_type: params.contentType,
    item_id: params.itemId,
    item_name: params.itemName,
    location: params.location,
  });
}

export function openCookiePreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aerilux:cookie-preferences:open'));
}

