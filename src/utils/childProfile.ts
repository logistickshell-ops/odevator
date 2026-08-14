import { ActivityLevel, AgeGroup, ChildGender, ColdSensitivity } from '../types';

export const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string; icon: string; description: string }[] = [
  { value: '0-3m', label: 'Новорождённый', icon: '🐣', description: '0–3 месяца' },
  { value: '3-12m', label: 'Младенец', icon: '🧸', description: '3–12 месяцев' },
  { value: '1-3y', label: 'Ясельный возраст', icon: '🍼', description: '1–3 года' },
  { value: '3-7y', label: 'Дошкольник', icon: '🎒', description: '3–7 лет' },
  { value: '7-12y', label: 'Школьник', icon: '🏫', description: '7–12 лет' },
  { value: '12-16y', label: 'Подросток', icon: '🎧', description: '12–16 лет' },
];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '0-3m': 'Новорождённый',
  '3-12m': 'Младенец',
  '1-3y': 'Ребёнок 1–3 лет',
  '3-7y': 'Дошкольник',
  '7-12y': 'Школьник',
  '12-16y': 'Подросток 12–16 лет',
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  quiet: 'Спокойная прогулка',
  normal: 'Обычная активность',
  active: 'Активная прогулка',
};

export const SENSITIVITY_LABELS: Record<ColdSensitivity, string> = {
  sensitive: 'Быстро мёрзнет',
  normal: 'Обычное теплоощущение',
  resistant: 'Легко перегревается',
};

export function getChildDisplayName(name: string) {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  return cleaned && !/^реб[её]нок(?:\s+\d+)?$/i.test(cleaned) ? cleaned : '';
}

function declineFirstNameToGenitive(firstName: string, gender: ChildGender) {
  const lower = firstName.toLowerCase();

  if (gender === 'girl') {
    if (lower.endsWith('ия') || lower.endsWith('я')) return `${firstName.slice(0, -1)}и`;
    if (lower.endsWith('а')) {
      const stem = firstName.slice(0, -1);
      return /[гкхжчшщ]$/i.test(stem) ? `${stem}и` : `${stem}ы`;
    }
    return firstName;
  }

  if (lower.endsWith('й') || lower.endsWith('ь')) return `${firstName.slice(0, -1)}я`;
  if (lower.endsWith('я')) return `${firstName.slice(0, -1)}и`;
  if (lower.endsWith('а')) {
    const stem = firstName.slice(0, -1);
    return /[гкхжчшщ]$/i.test(stem) ? `${stem}и` : `${stem}ы`;
  }
  if (/[бвгджзклмнпрстфхцчшщ]$/i.test(lower)) return `${firstName}а`;
  return firstName;
}

export function formatClothingHeading(name: string, gender: ChildGender) {
  const displayName = getChildDisplayName(name);
  if (!displayName) return 'Одежда для ребёнка';

  const words = displayName.split(' ');
  words[0] = declineFirstNameToGenitive(words[0], gender);
  return `Одежда для ${words.join(' ')}`;
}
