import { useEffect, useState } from 'react';
import { RU_EN_CATALOG } from './i18n_catalog.generated';

export type Language = 'ru' | 'en';
export const LANGUAGE_STORAGE_KEY = 'meteo_language_v1';

let activeLanguage: Language = 'ru';
let listeners = new Set<(language: Language) => void>();

const normalizeLanguage = (value?: string | null): Language | null => {
  if (!value) return null;
  return value.toLowerCase().startsWith('en') ? 'en' : value.toLowerCase().startsWith('ru') ? 'ru' : null;
};

export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'ru';
  try {
    const saved = normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (saved) return saved;
  } catch {
    // Storage may be unavailable in a restricted WebView.
  }
  const telegramLanguage = normalizeLanguage((window as Window & { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { language_code?: string } } } } }).Telegram?.WebApp?.initDataUnsafe?.user?.language_code);
  return telegramLanguage ?? normalizeLanguage(navigator.language) ?? 'ru';
}

export function initLanguage() {
  activeLanguage = detectLanguage();
  if (typeof document !== 'undefined') document.documentElement.lang = activeLanguage;
}

export function getLanguage() { return activeLanguage; }

export function setLanguage(language: Language) {
  const changed = activeLanguage !== language;
  activeLanguage = language;
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* best effort */ }
  if (typeof document !== 'undefined') document.documentElement.lang = language;
  listeners.forEach((listener) => listener(language));
  // weatherEngine contains data objects created at module load; reload keeps those labels in sync.
  if (changed && typeof window !== 'undefined') window.location.reload();
}

export function subscribeLanguage(listener: (language: Language) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useLanguage() {
  const [language, setCurrentLanguage] = useState<Language>(activeLanguage);
  useEffect(() => subscribeLanguage(setCurrentLanguage), []);
  return language;
}

export function tr(value: string): string {
  if (activeLanguage === 'ru') return value;
  return RU_EN_CATALOG[value as keyof typeof RU_EN_CATALOG] ?? value;
}

export function formatDate(value: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(activeLanguage === 'en' ? 'en-US' : 'ru-RU', options).format(new Date(value));
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(activeLanguage === 'en' ? 'en-US' : 'ru-RU', options).format(value);
}

initLanguage();
