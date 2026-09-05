import { getLanguage, tr } from '../i18n';
import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, LockKeyhole, RefreshCw, Sparkles, Star } from 'lucide-react';
import {
  getWeeklyForecastEntitlement,
  isStarsPaymentsConfigured,
  openWeeklyForecastInvoice,
} from '../payments/telegramStars';
import { PaymentStatus, WEEKLY_FORECAST_PRODUCT } from '../payments/types';
import { getTelegramContext, trackEvent } from '../analytics/analyticsClient';

export function WeeklyForecastPurchase() {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [validUntil, setValidUntil] = useState<string>();
  const [message, setMessage] = useState<string>();

  const refreshAccess = async () => {
    if (!isStarsPaymentsConfigured()) {
      setStatus('unavailable');
      setMessage(tr("Раздел подготовлен. Для оплаты нужно подключить сервер Telegram Stars и задать VITE_PAYMENT_API_BASE."));
      return;
    }

    try {
      const entitlement = await getWeeklyForecastEntitlement();
      void trackEvent({ eventName: 'telegram_entitlement_checked', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, status: entitlement.status, source: getTelegramContext().isTelegram ? 'telegram' : 'web' } });
      setStatus(entitlement.status === 'active' ? 'paid' : 'idle');
      setValidUntil(entitlement.validUntil);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : tr("Не удалось проверить доступ."));
    }
  };

  useEffect(() => {
    void trackEvent({ eventName: 'pricing_viewed', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, price_stars: WEEKLY_FORECAST_PRODUCT.priceStars } });
    void refreshAccess();
  }, []);

  const buy = async () => {
    setMessage(undefined);
    setStatus('loading');

    try {
      void trackEvent({ eventName: 'payment_started', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, price_stars: WEEKLY_FORECAST_PRODUCT.priceStars } });
      void trackEvent({ eventName: 'telegram_payment_started', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, price_stars: WEEKLY_FORECAST_PRODUCT.priceStars } });
      const paymentStatus = await openWeeklyForecastInvoice();
      setStatus(paymentStatus);
      if (paymentStatus === 'paid') {
        void trackEvent({ eventName: 'payment_completed', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, price_stars: WEEKLY_FORECAST_PRODUCT.priceStars } });
        void trackEvent({ eventName: 'telegram_payment_completed', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, price_stars: WEEKLY_FORECAST_PRODUCT.priceStars } });
        await refreshAccess();
        setMessage(tr("Оплата подтверждена. Прогноз на 7 дней доступен."));
      } else if (paymentStatus === 'pending') {
        setMessage(tr("Платёж обрабатывается. Обновите доступ через несколько секунд."));
      } else if (paymentStatus === 'idle') {
        void trackEvent({ eventName: 'payment_cancelled', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id } });
        void trackEvent({ eventName: 'telegram_payment_cancelled', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id } });
        setMessage(tr("Оплата отменена. Деньги не списаны."));
      } else {
        void trackEvent({ eventName: 'payment_failed', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, status: paymentStatus } });
        void trackEvent({ eventName: 'telegram_payment_failed', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, status: paymentStatus } });
        setMessage(tr("Telegram не подтвердил оплату. Попробуйте ещё раз."));
      }
    } catch (error) {
      void trackEvent({ eventName: 'payment_failed', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, error_code: 'invoice_or_api_error' } });
      void trackEvent({ eventName: 'telegram_payment_failed', metadata: { product_id: WEEKLY_FORECAST_PRODUCT.id, error_code: 'invoice_or_api_error' } });
      setStatus(isStarsPaymentsConfigured() ? 'error' : 'unavailable');
      setMessage(error instanceof Error ? error.message : tr("Не удалось открыть оплату."));
    }
  };

  const active = status === 'paid';

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-sky-50 shadow-sm">
      <div className="border-b border-violet-100/80 bg-white/60 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
              <CalendarDays size={24} />
            </div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-slate-800 sm:text-2xl">
                  {tr("Прогноз гардероба на 7 дней")}
                </h2>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-700">
                  PREMIUM
                </span>
              </div>
              <p className="max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                {tr("Полный план одежды для активного ребёнка на неделю:")} {tr("утро, день, вечер, осадки, ветер, запасные слои и родительские подсказки.")}
              </p>
            </div>
          </div>
          <Sparkles className="hidden shrink-0 text-amber-400 sm:block" size={24} />
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:p-7">
        <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2 sm:text-sm">
          {[tr("7 дней прогноза"), tr("4 периода в день"), tr("Комплект для профиля ребёнка"), tr("Резервные варианты одежды")].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2">
              <CheckCircle2 className="shrink-0 text-emerald-500" size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="min-w-[190px] rounded-2xl border border-violet-200 bg-white/85 p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-3xl font-black text-slate-800">
            {WEEKLY_FORECAST_PRODUCT.priceStars}
            <Star className="fill-amber-400 text-amber-400" size={25} />
          </div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{tr("разовый доступ на 7 дней")}</p>
          <button
            type="button"
            onClick={active ? refreshAccess : buy}
            disabled={status === 'loading'}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60"
          >
            {status === 'loading' ? <RefreshCw className="animate-spin" size={15} /> : active ? <CheckCircle2 size={15} /> : <LockKeyhole size={15} />}
            {active ? tr("Доступ активен") : status === 'loading' ? tr("Проверяем…") : tr("Получить прогноз")}
          </button>
          {validUntil && active && (
            <p className="mt-2 text-[10px] font-bold text-emerald-600">
              {tr("Доступ до")} {new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-US' : 'ru-RU').format(new Date(validUntil))}
            </p>
          )}
        </div>
      </div>

      {message && (
        <div className={`mx-5 mb-5 rounded-xl border px-3 py-2 text-xs font-bold sm:mx-7 sm:mb-7 ${status === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
          {message}
        </div>
      )}

      <p className="border-t border-violet-100/80 px-5 py-3 text-[10px] leading-relaxed text-slate-400 sm:px-7">
        {tr("Оплата проходит через Telegram Stars. Доступ открывается только после подтверждения успешного платежа Telegram.")}
      </p>
    </section>
  );
}
