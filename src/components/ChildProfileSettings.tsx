import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Save, Trash2, UserRound } from 'lucide-react';
import { ActivityLevel, ChildGender, ChildProfile, ColdSensitivity } from '../types';
import { AGE_GROUP_OPTIONS } from '../utils/childProfile';

interface ChildProfileSettingsProps {
  profiles: ChildProfile[];
  activeChildId: string;
  onSelectChild: (childId: string) => void;
  onSaveChild: (profile: ChildProfile) => void;
  onAddChild: () => void;
  onDeleteChild: (childId: string) => void;
}

const PROFILE_SETTINGS_EXPANDED_KEY = 'meteo_profile_settings_expanded_v1';

const loadExpandedState = () => {
  try {
    return typeof window === 'undefined' || window.localStorage.getItem(PROFILE_SETTINGS_EXPANDED_KEY) !== 'false';
  } catch {
    return true;
  }
};

const saveExpandedState = (expanded: boolean) => {
  try {
    window.localStorage.setItem(PROFILE_SETTINGS_EXPANDED_KEY, String(expanded));
  } catch {
    // Настройки профиля продолжают работать и без доступа к localStorage.
  }
};

const activityOptions: { value: ActivityLevel; label: string; icon: string; desc: string }[] = [
  { value: 'quiet', label: 'Спокойный', icon: '👶', desc: 'Коляска, спокойная игра' },
  { value: 'normal', label: 'Обычный', icon: '🚶', desc: 'Прогулка и движение' },
  { value: 'active', label: 'Активный', icon: '🏃', desc: 'Бег, площадка, спорт' },
];

const sensitivityOptions: { value: ColdSensitivity; label: string; icon: string; desc: string }[] = [
  { value: 'sensitive', label: 'Часто мёрзнет', icon: '❄️', desc: 'Быстрее охлаждается' },
  { value: 'normal', label: 'Обычное', icon: '😊', desc: 'Стандартная реакция' },
  { value: 'resistant', label: 'Легко перегревается', icon: '🔥', desc: 'Редко мёрзнет' },
];

export function ChildProfileSettings({
  profiles,
  activeChildId,
  onSelectChild,
  onSaveChild,
  onAddChild,
  onDeleteChild,
}: ChildProfileSettingsProps) {
  const activeProfile = profiles.find((profile) => profile.id === activeChildId) ?? profiles[0];
  const [isExpanded, setIsExpanded] = useState(loadExpandedState);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [draft, setDraft] = useState<ChildProfile>(activeProfile);

  useEffect(() => {
    setDraft(activeProfile);
    setIsDeleteConfirmOpen(false);
  }, [activeProfile]);

  const setProfileExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
    saveExpandedState(expanded);
  };

  const updateDraft = <Key extends keyof ChildProfile>(key: Key, value: ChildProfile[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleAddChild = () => {
    onAddChild();
    setProfileExpanded(true);
  };

  if (!activeProfile) return null;

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-white to-rose-50/45 p-4 sm:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <UserRound size={19} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-slate-800">Ребёнок</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs leading-relaxed text-slate-500">
              Сохраните параметры один раз — рекомендации будут подбираться для выбранного профиля.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setProfileExpanded(!isExpanded)}
          className="flex shrink-0 items-center gap-1 rounded-xl border border-sky-100 bg-white/85 px-2.5 py-2 text-[10px] sm:text-xs font-extrabold text-sky-700 transition hover:bg-sky-50"
          aria-expanded={isExpanded}
        >
          {isExpanded ? <>Свернуть <ChevronUp size={14} /></> : <>Настроить <ChevronDown size={14} /></>}
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Выбор ребёнка">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfile.id;
          const label = profile.name.trim() || 'Ребёнок';
          return (
            <button
              type="button"
              key={profile.id}
              onClick={() => {
                onSelectChild(profile.id);
                setProfileExpanded(true);
              }}
              className={`shrink-0 rounded-xl border px-3 py-2 text-left text-[10px] sm:text-xs font-extrabold transition ${
                isActive
                  ? 'border-sky-200 bg-sky-100 text-sky-800 shadow-sm'
                  : 'border-slate-100 bg-white/85 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-1.5">{profile.gender === 'girl' ? '👧' : '👦'}</span>
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={handleAddChild}
          className="shrink-0 rounded-xl border border-dashed border-sky-200 bg-white/75 px-3 py-2 text-[10px] sm:text-xs font-extrabold text-sky-700 transition hover:bg-sky-50"
        >
          <span className="inline-flex items-center gap-1"><Plus size={14} /> Ребёнок</span>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-5 border-t border-sky-100/80 pt-4 animate-fadeIn">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">Имя</span>
            <input
              type="text"
              maxLength={28}
              value={draft.name}
              onChange={(event) => updateDraft('name', event.target.value)}
              placeholder="Например, Маша"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <div>
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">Пол</span>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'girl' as ChildGender, label: 'Девочка', icon: '👧' },
                { value: 'boy' as ChildGender, label: 'Мальчик', icon: '👦' },
              ]).map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => updateDraft('gender', option.value)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${
                    draft.gender === option.value
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-1.5">{option.icon}</span>{option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">Возрастная группа</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {AGE_GROUP_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => updateDraft('ageGroup', option.value)}
                  className={`rounded-xl border p-2.5 text-center transition ${
                    draft.ageGroup === option.value
                      ? 'border-sky-200 bg-sky-100 text-sky-800'
                      : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xl leading-none">{option.icon}</span>
                  <span className="mt-1 block text-[10px] font-extrabold leading-tight">{option.label}</span>
                  <span className="mt-0.5 block text-[9px] leading-tight text-slate-400">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">Активность на прогулке</span>
              <div className="space-y-2">
                {activityOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => updateDraft('activityLevel', option.value)}
                    className={`flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition ${
                      draft.activityLevel === option.value
                        ? 'border-sky-200 bg-sky-50 text-slate-800'
                        : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span><span className="block text-[11px] font-extrabold">{option.label}</span><span className="block text-[9px] text-slate-400">{option.desc}</span></span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">Реакция на прохладу</span>
              <div className="space-y-2">
                {sensitivityOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => updateDraft('coldSensitivity', option.value)}
                    className={`flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition ${
                      draft.coldSensitivity === option.value
                        ? 'border-rose-200 bg-rose-50 text-slate-800'
                        : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span><span className="block text-[11px] font-extrabold">{option.label}</span><span className="block text-[9px] text-slate-400">{option.desc}</span></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-sky-100/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => {
                onSaveChild({ ...draft, name: draft.name.trim() || 'Ребёнок' });
                setProfileExpanded(false);
                setIsDeleteConfirmOpen(false);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-100 px-4 py-3 text-xs font-black text-sky-800 transition hover:bg-sky-200 active:scale-[0.99] sm:w-auto"
            >
              <Save size={15} /> Сохранить параметры
            </button>
            {profiles.length > 1 ? (
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-white px-3 py-2.5 text-[10px] sm:text-xs font-extrabold text-rose-700 transition hover:bg-rose-50 active:scale-[0.99] sm:w-auto"
              >
                <Trash2 size={14} /> Удалить профиль
              </button>
            ) : (
              <p className="text-center text-[9px] sm:text-[10px] leading-relaxed text-slate-400 sm:text-right">Последний профиль защищён от удаления.</p>
            )}
          </div>

          {isDeleteConfirmOpen && profiles.length > 1 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 sm:p-4 animate-fadeIn" role="alert">
              <p className="text-[11px] sm:text-xs font-black text-rose-800">Удалить профиль «{activeProfile.name.trim() || 'Ребёнок'}»?</p>
              <p className="mt-1 text-[10px] sm:text-xs leading-relaxed text-rose-700">Параметры этого ребёнка на устройстве будут удалены. Это действие нельзя отменить.</p>
              <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] sm:text-xs font-extrabold text-slate-600 transition hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteChild(activeProfile.id);
                    setIsDeleteConfirmOpen(false);
                    setProfileExpanded(false);
                  }}
                  className="rounded-xl border border-rose-200 bg-rose-100 px-3 py-2 text-[10px] sm:text-xs font-extrabold text-rose-800 transition hover:bg-rose-200"
                >
                  Да, удалить
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
