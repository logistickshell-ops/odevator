import { useMemo, useState } from 'react';
import { Check, Copy, Send, Share2 } from 'lucide-react';

const INVITE_ID_STORAGE_KEY = 'meteo_invite_id';
const BOT_USERNAME = 'meteo_odevaika_bot';

function getOrCreateInviteId() {
  try {
    const existing = window.localStorage.getItem(INVITE_ID_STORAGE_KEY);
    if (existing) return existing;

    const id = window.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(INVITE_ID_STORAGE_KEY, id);
    return id;
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function createBotInviteUrl(inviteId: string) {
  return `https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(`ref_${inviteId}`)}`;
}

export function ShareInvite() {
  const [isCopied, setIsCopied] = useState(false);
  const inviteUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return createBotInviteUrl(getOrCreateInviteId());
  }, []);

  const inviteText = [
    '🌤️ «МетеоОдевайка» — помощник для прогулок с ребёнком.',
    'Подбирает комплект по погоде, времени прогулки, возрасту и активности ребёнка.',
    '',
    'Попробовать в Telegram:',
  ].join('\n');

  const copyInvite = async () => {
    if (!inviteUrl) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${inviteText}\n${inviteUrl}`);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = `${inviteText}\n${inviteUrl}`;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2200);
    } catch {
      setIsCopied(false);
    }
  };

  const shareInvite = async () => {
    if (!inviteUrl) return;

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(inviteText)}`;
    const telegram = (window as typeof window & { Telegram?: { WebApp?: { openTelegramLink?: (url: string) => void } } }).Telegram?.WebApp;

    if (telegram?.openTelegramLink) {
      telegram.openTelegramLink(telegramUrl);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'МетеоОдевайка', text: inviteText, url: inviteUrl });
        return;
      } catch {
        // Пользователь мог закрыть системное меню; в этом случае открываем Telegram как запасной вариант.
      }
    }

    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

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
