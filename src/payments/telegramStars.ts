import { tr } from '../i18n';
import {
  EntitlementResponse,
  InvoiceResponse,
  PaymentApiError,
  PaymentStatus,
  TelegramPaymentWindow,
  WEEKLY_FORECAST_PRODUCT,
} from './types';

const PAYMENT_API_BASE = (import.meta.env.VITE_PAYMENT_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

function getTelegramWebApp() {
  if (typeof window === 'undefined') return undefined;
  return (window as TelegramPaymentWindow).Telegram?.WebApp;
}

function getInitData() {
  const initData = getTelegramWebApp()?.initData?.trim();
  return initData || null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!PAYMENT_API_BASE) {
    throw new Error(tr("Платежи ещё не подключены на сервере."));
  }

  const response = await fetch(`${PAYMENT_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as T | PaymentApiError | null;
  if (!response.ok) {
    const apiError = payload as PaymentApiError | null;
    throw new Error(apiError?.message || tr("Не удалось связаться с платежным сервером."));
  }
  return payload as T;
}

export function isStarsPaymentsConfigured() {
  return Boolean(PAYMENT_API_BASE && getInitData());
}

export async function getWeeklyForecastEntitlement(): Promise<EntitlementResponse> {
  const initData = getInitData();
  if (!initData) return { productId: WEEKLY_FORECAST_PRODUCT.id, status: 'not_found' };

  return request<EntitlementResponse>('/api/payments/entitlements/weekly-wardrobe-forecast', {
    headers: { 'X-Telegram-Init-Data': initData },
  });
}

export async function createWeeklyForecastInvoice(): Promise<InvoiceResponse> {
  const initData = getInitData();
  if (!initData) throw new Error(tr("Откройте приложение внутри Telegram, чтобы оплатить прогноз."));

  return request<InvoiceResponse>('/api/payments/invoices/weekly-wardrobe-forecast', {
    method: 'POST',
    headers: { 'X-Telegram-Init-Data': initData },
    body: JSON.stringify({ productId: WEEKLY_FORECAST_PRODUCT.id }),
  });
}

export async function openWeeklyForecastInvoice(): Promise<PaymentStatus> {
  const telegram = getTelegramWebApp();
  if (!telegram?.openInvoice) throw new Error(tr("Оплата Stars доступна только внутри Telegram."));

  const invoice = await createWeeklyForecastInvoice();
  return new Promise((resolve) => {
    telegram.openInvoice?.(invoice.invoiceUrl, (status) => {
      resolve(status === 'paid' ? 'paid' : status === 'pending' ? 'pending' : status === 'cancelled' ? 'idle' : 'error');
    });
  });
}
