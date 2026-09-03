import { tr } from '../i18n';
import { useMemo, useState } from 'react';
import { Check, Copy, Send, Share2 } from 'lucide-react';
import { RecommendedOutfit, WeatherData, WeatherPeriodType } from '../types';
import { copyText, getBotInviteUrl, shareViaTelegram } from '../utils/telegramShare';

interface SharePlanProps {
  childName: string;
  cityName: string;
  selectedDay: 'today' | 'tomorrow';
  selectedPeriod: WeatherPeriodType;
  weather: WeatherData;
  outfit: RecommendedOutfit;
}

function formatTemperature(value: number) {
  return `${value > 0 ? '+' : ''}${value}°C`;
}

const periodLabels: Record<WeatherPeriodType, string> = {
  morning: tr("утро"),
  day: tr("день"),
  evening: tr("вечер"),
  night: tr("ночь"),
};

export function SharePlan({ childName, cityName, selectedDay, selectedPeriod, weather, outfit }: SharePlanProps) {
  const [isCopied, setIsCopied] = useState(false);
  const inviteUrl = useMemo(getBotInviteUrl, []);

  const clothingNames = useMemo(() => {
    const items = [
      ...outfit.underwear,
      ...outfit.lower,
      ...outfit.upper,
      ...outfit.outer,
      ...outfit.headwear,
      ...outfit.shoes,
      ...outfit.accessories,
    ];
    return Array.from(new Set(items.map((item) => item.name))).slice(0, 9);
  }, [outfit]);

  const dayLabel = selectedDay === 'today' ? tr("Сегодня") : tr("Завтра");
  const childLabel = childName.trim() || tr("ребёнка");
  const shareText = useMemo(() => {
    const clothingList = clothingNames.length > 0 ? clothingNames.map((name) => `• ${name}`).join('\n') : tr("• Комплект формируется");
    const precipitation = weather.precipProb > 0 ? ` · осадки ${weather.precipProb}%` : '';

    return [
      `🌤️ План прогулки для ${childLabel}`,
      `📍 ${cityName} · ${dayLabel}, ${periodLabels[selectedPeriod]}`,
      `🌡️ ${formatTemperature(weather.temp)}, ощущается как ${formatTemperature(weather.feelsLike)} · ${weather.description}${precipitation}`,
      '',
      tr("👕 Что надеть:"),
      clothingList,
    ].join('\n');
  }, [childLabel, cityName, clothingNames, dayLabel, selectedPeriod, weather.description, weather.feelsLike, weather.precipProb, weather.temp]);

  const copyPlan = async () => {
    const fullPlan = `${shareText}\n\nОткрыть «МетеоОдевайку»: ${inviteUrl}`;
    const copied = await copyText(fullPlan);
    setIsCopied(copied);
    if (copied) window.setTimeout(() => setIsCopied(false), 2200);
  };

  const sharePlan = () => shareViaTelegram({
    title: `План прогулки для ${childLabel}`,
    text: shareText,
    url: inviteUrl,
  });

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/85 via-white to-rose-50/45 p-4 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Share2 size={19} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-black text-slate-800">{tr("Отправить план прогулки")}</h3>
          <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-500">
            {tr("Близкие увидят текущий комплект для")} {childLabel}{tr(", погоду и выбранное время прогулки.")}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white bg-white/85 p-3 sm:p-4">
        <div className="flex flex-wrap gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-500">
          <span className="rounded-lg bg-sky-50 px-2 py-1 text-sky-800">{cityName}</span>
          <span className="rounded-lg bg-rose-50 px-2 py-1 text-rose-700">{dayLabel} · {periodLabels[selectedPeriod]}</span>
          <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-800">{tr("ощущается")} {formatTemperature(weather.feelsLike)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-[10px] sm:text-xs font-semibold leading-relaxed text-slate-600">
          {clothingNames.join(' · ')}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          onClick={sharePlan}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-100 px-3 py-2.5 text-[10px] sm:text-xs font-extrabold text-sky-800 transition hover:bg-sky-200 active:scale-[0.98]"
        >
          <Send size={14} /> {tr("Отправить")}
        </button>
        <button
          type="button"
          onClick={copyPlan}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-white px-3 py-2.5 text-[10px] sm:text-xs font-extrabold text-rose-700 transition hover:bg-rose-50 active:scale-[0.98]"
        >
          {isCopied ? <><Check size={14} /> {tr("Скопировано")}</> : <><Copy size={14} /> {tr("Скопировать")}</>}
        </button>
      </div>
      <p className="mt-3 text-[9px] sm:text-[10px] leading-relaxed text-slate-400" aria-live="polite">
        {tr("Ссылка на приложение добавится в сообщение автоматически — отдельно показывать её не нужно.")}
      </p>
    </section>
  );
}
