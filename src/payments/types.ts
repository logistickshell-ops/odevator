import { tr } from '../i18n';
export const WEEKLY_FORECAST_PRODUCT = {
  id: 'weekly_wardrobe_forecast',
  title: tr("Прогноз гардероба на 7 дней"),
  description: tr("7 дней рекомендаций одежды по погоде для активного профиля ребёнка."),
  priceStars: 49,
  validityDays: 7,
} as const;

export type PaymentStatus = 'idle' | 'loading' | 'paid' | 'pending' | 'unavailable' | 'error';

export interface EntitlementResponse {
  productId: string;
  status: 'active' | 'expired' | 'not_found';
  validUntil?: string;
}

export interface InvoiceResponse {
  invoiceUrl: string;
  productId: string;
  amount: number;
  currency: 'XTR';
}

export interface PaymentApiError {
  error: string;
  message?: string;
}

export interface TelegramWebAppPayments {
  initData?: string;
  openInvoice?: (url: string, callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void) => void;
}

export interface TelegramPaymentWindow extends Window {
  Telegram?: {
    WebApp?: TelegramWebAppPayments;
  };
}
