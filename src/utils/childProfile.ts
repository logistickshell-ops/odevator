import { tr } from '../i18n';
import { ActivityLevel, AgeGroup, ChildGender, ColdSensitivity } from '../types';

export const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string; icon: string; description: string }[] = [
  { value: '0-3m', label: tr("Новорождённый"), icon: '🐣', description: tr("0–3 месяца") },
  { value: '3-12m', label: tr("Младенец"), icon: '🧸', description: tr("3–12 месяцев") },
  { value: '1-3y', label: tr("Ясельный возраст"), icon: '🍼', description: tr("1–3 года") },
  { value: '3-7y', label: tr("Дошкольник"), icon: '🎒', description: tr("3–7 лет") },
  { value: '7-12y', label: tr("Школьник"), icon: '🏫', description: tr("7–12 лет") },
  { value: '12-16y', label: tr("Подросток"), icon: '🎧', description: tr("12–16 лет") },
];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '0-3m': tr("Новорождённый"),
  '3-12m': tr("Младенец"),
  '1-3y': tr("Ребёнок 1–3 лет"),
  '3-7y': tr("Дошкольник"),
  '7-12y': tr("Школьник"),
  '12-16y': tr("Подросток 12–16 лет"),
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  quiet: tr("Спокойная прогулка"),
  normal: tr("Обычная активность"),
  active: tr("Активная прогулка"),
};

export const SENSITIVITY_LABELS: Record<ColdSensitivity, string> = {
  sensitive: tr("Быстро мёрзнет"),
  normal: tr("Обычное теплоощущение"),
  resistant: tr("Легко перегревается"),
};

export function getChildDisplayName(name: string) {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  return cleaned && !/^реб[её]нок(?:\s+\d+)?$/i.test(cleaned) ? cleaned : '';
}

function declineFirstNameToGenitive(firstName: string, gender: ChildGender) {
  const lower = firstName.toLowerCase();

  if (gender === 'girl') {
    if (lower.endsWith(tr("ия")) || lower.endsWith(tr("я"))) return `${firstName.slice(0, -1)}и`;
    if (lower.endsWith(tr("а"))) {
      const stem = firstName.slice(0, -1);
      return /[гкхжчшщ]$/i.test(stem) ? `${stem}и` : `${stem}ы`;
    }
    return firstName;
  }

  if (lower.endsWith(tr("й")) || lower.endsWith(tr("ь"))) return `${firstName.slice(0, -1)}я`;
  if (lower.endsWith(tr("я"))) return `${firstName.slice(0, -1)}и`;
  if (lower.endsWith(tr("а"))) {
    const stem = firstName.slice(0, -1);
    return /[гкхжчшщ]$/i.test(stem) ? `${stem}и` : `${stem}ы`;
  }
  if (/[бвгджзклмнпрстфхцчшщ]$/i.test(lower)) return `${firstName}а`;
  return firstName;
}

export function formatClothingHeading(name: string, gender: ChildGender) {
  const displayName = getChildDisplayName(name);
  if (!displayName) return tr("Одежда для ребёнка");

  const words = displayName.split(' ');
  words[0] = declineFirstNameToGenitive(words[0], gender);
  return `Одежда для ${words.join(' ')}`;
}
