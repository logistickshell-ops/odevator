import { useMemo, useState } from 'react';
import { Check, Copy, Send, Share2 } from 'lucide-react';
import { copyText, getBotInviteUrl, shareViaTelegram } from '../utils/telegramShare';

export function ShareInvite() {
  const [isCopied, setIsCopied] = useState(false);
  const inviteUrl = useMemo(getBotInviteUrl, []);

  const inviteText = [
    '🌤️ «МетеоОдевайка» — помощник для прогулок с ребёнком.',
    'Подбирает комплект по погоде, времени прогулки, возрасту и активности ребёнка.',
    '',
    'Попробовать в Telegram:',
  ].join('\n');

  const copyInvite = async () => {
    const copied = inviteUrl && await copyText(`${inviteText}\n${inviteUrl}`);
    setIsCopied(Boolean(copied));
    if (copied) window.setTimeout(() => setIsCopied(false), 2200);
  };

  const shareInvite = () => shareViaTelegram({
    title: 'МетеоОдевайка',
    text: inviteText,
    url: inviteUrl,
  });

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/85 via-white to-rose-50/45 p-4 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Share2 size={19} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-black text-slate-800">Пригласить близких</h3>
          <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-500">
            Отправьте ссылку на @meteo_odevaika_bot — близкие смогут открыть «МетеоОдевайку» в Telegram и настроить свой профиль ребёнка.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white bg-white/85 p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs font-semibold leading-relaxed text-slate-600">
          Погода, одежда, подсказки и личные заметки — в одном спокойном помощнике для семейных прогулок.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          onClick={shareInvite}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-100 px-3 py-2.5 text-[10px] sm:text-xs font-extrabold text-sky-800 transition hover:bg-sky-200 active:scale-[0.98]"
        >
          <Send size={14} /> Пригласить
        </button>
        <button
          type="button"
          onClick={copyInvite}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-white px-3 py-2.5 text-[10px] sm:text-xs font-extrabold text-rose-700 transition hover:bg-rose-50 active:scale-[0.98]"
        >
          {isCopied ? <><Check size={14} /> Скопировано</> : <><Copy size={14} /> Скопировать</>}
        </button>
      </div>
      <p className="mt-3 text-[9px] sm:text-[10px] leading-relaxed text-slate-400" aria-live="polite">
        Ссылка добавится к сообщению автоматически — отдельно показывать её не нужно.
      </p>
    </section>
  );
}
