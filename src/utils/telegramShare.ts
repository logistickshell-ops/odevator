const INVITE_ID_STORAGE_KEY = 'meteo_invite_id';
const BOT_USERNAME = 'meteo_odevaika_bot';

type TelegramWebApp = {
  openTelegramLink?: (url: string) => void;
};

type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

function createInviteId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getBotInviteUrl() {
  if (typeof window === 'undefined') return '';

  try {
    const existing = window.localStorage.getItem(INVITE_ID_STORAGE_KEY);
    const inviteId = existing ?? createInviteId();

    if (!existing) {
      window.localStorage.setItem(INVITE_ID_STORAGE_KEY, inviteId);
    }

    return `https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(`ref_${inviteId}`)}`;
  } catch {
    return `https://t.me/${BOT_USERNAME}?startapp=${encodeURIComponent(`ref_${createInviteId()}`)}`;
  }
}

export async function copyText(text: string) {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();
    return copied;
  } catch {
    return false;
  }
}

export async function shareViaTelegram({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}) {
  if (typeof window === 'undefined' || !url) return;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  const telegram = (window as TelegramWindow).Telegram?.WebApp;

  if (telegram?.openTelegramLink) {
    telegram.openTelegramLink(telegramUrl);
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch {
      // Пользователь мог закрыть системное меню — в этом случае используем Telegram как запасной вариант.
    }
  }

  window.open(telegramUrl, '_blank', 'noopener,noreferrer');
}
