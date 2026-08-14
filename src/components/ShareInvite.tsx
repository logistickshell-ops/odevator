import { useMemo, useState } from 'react';

const INVITE_ID_STORAGE_KEY = 'meteo_invite_id';

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

export function ShareInvite() {
  const [isCopied, setIsCopied] = useState(false);
  const inviteUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';

    const url = new URL(window.location.href);
    url.searchParams.set('ref', getOrCreateInviteId());
    return url.toString();
  }, []);

  const shareText = 'Подбираю одежду ребёнку по погоде в «МетеоОдевайке». Попробуй тоже:';

  const copyInvite = async () => {
    if (!inviteUrl) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = inviteUrl;
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

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(shareText)}`;
    const telegram = (window as typeof window & { Telegram?: { WebApp?: { openTelegramLink?: (url: string) => void } } }).Telegram?.WebApp;

    if (telegram?.openTelegramLink) {
      telegram.openTelegramLink(telegramUrl);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'МетеоОдевайка', text: shareText, url: inviteUrl });
        return;
      } catch {
        // Пользователь мог закрыть системное меню — используем Telegram как запасной вариант.
      }
    }

    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50/70 p-4 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-lg">🔗</div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-black text-slate-800">Поделиться с близкими</h3>
          <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-500">
            Отправьте ссылку родителям и тем, с кем гуляете. Она открывает этот сервис без передачи данных ребёнка.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/90 bg-white/80 p-2.5 sm:p-3">
        <p className="truncate text-[10px] sm:text-xs font-semibold text-slate-500" title={inviteUrl}>
          {inviteUrl || 'Готовим ссылку…'}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          onClick={shareInvite}
          className="rounded-xl bg-violet-600 px-3 py-2.5 text-[11px] sm:text-xs font-extrabold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98]"
        >
          ↗ Отправить
        </button>
        <button
          type="button"
          onClick={copyInvite}
          className="rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-[11px] sm:text-xs font-extrabold text-violet-700 transition hover:bg-violet-50 active:scale-[0.98]"
        >
          {isCopied ? '✓ Скопировано' : '⧉ Скопировать'}
        </button>
      </div>
      <p className="mt-3 text-[9px] sm:text-[10px] leading-relaxed text-slate-400" aria-live="polite">
        Ссылка содержит только технический идентификатор приглашения. Учёт приглашений требует серверной аналитики и в этой статической версии не ведётся.
      </p>
    </section>
  );
}
