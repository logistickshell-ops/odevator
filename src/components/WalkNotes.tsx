import React, { useEffect, useMemo, useState } from 'react';
import { BellRing, BookmarkPlus, Check, ClipboardList, Trash2 } from 'lucide-react';
import { CityData, WeatherData, WeatherPeriodType } from '../types';

interface WalkNote {
  id: string;
  text: string;
  createdAt: string;
  context: string;
}

interface WalkNotesProps {
  city: CityData;
  weather: WeatherData;
  period: WeatherPeriodType;
}

const STORAGE_KEY = 'meteo_walk_notes_v1';
const MAX_NOTES = 6;
const MAX_LENGTH = 180;

const PERIOD_LABELS: Record<WeatherPeriodType, string> = {
  morning: 'утро',
  day: 'день',
  evening: 'вечер',
  night: 'ночь',
};

const QUICK_NOTES = [
  'Положить сменные носки',
  'Взять воду',
  'Добавить светоотражатель',
  'Положить дополнительный слой',
];

const loadNotes = (): WalkNote[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is WalkNote => Boolean(item && typeof item.id === 'string' && typeof item.text === 'string')) : [];
  } catch {
    return [];
  }
};

export const WalkNotes: React.FC<WalkNotesProps> = ({ city, weather, period }) => {
  const [notes, setNotes] = useState<WalkNote[]>(loadNotes);
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Заметки остаются доступны в текущем состоянии, если локальное хранилище недоступно.
    }
  }, [notes]);

  const currentContext = useMemo(() => {
    const temperature = `${weather.feelsLike > 0 ? '+' : ''}${weather.feelsLike}°C`;
    return `${city.name} · ${PERIOD_LABELS[period]} · ощущается ${temperature}`;
  }, [city.name, period, weather.feelsLike]);

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    const note: WalkNote = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      createdAt: new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date()),
      context: currentContext,
    };
    setNotes((previous) => [note, ...previous].slice(0, MAX_NOTES));
    setDraft('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const addQuickNote = (text: string) => {
    setDraft((previous) => previous ? `${previous} · ${text}`.slice(0, MAX_LENGTH) : text);
  };

  const removeNote = (id: string) => setNotes((previous) => previous.filter((note) => note.id !== id));

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
      <div className="flex items-start gap-2.5">
        <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl shrink-0"><ClipboardList size={20} /></div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-xl font-black text-slate-800">Мои заметки к прогулке</h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Коротко зафиксируйте то, что важно не забыть. Заметки сохраняются только на этом устройстве.</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-2 text-[10px] sm:text-xs text-violet-800 font-semibold">Сейчас: {currentContext}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_NOTES.map((note) => (
          <button key={note} onClick={() => addQuickNote(note)} className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-violet-50 hover:text-violet-700 text-[10px] sm:text-xs font-bold text-slate-600 transition">+ {note}</button>
        ))}
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor="walk-note">Заметка к прогулке</label>
        <textarea
          id="walk-note"
          value={draft}
          maxLength={MAX_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Например: взять запасные варежки и термос"
          className="min-h-20 flex-1 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
        />
        <button onClick={addNote} disabled={!draft.trim()} className="sm:self-end inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200">
          {saved ? <Check size={16} /> : <BookmarkPlus size={16} />}{saved ? 'Сохранено' : 'Сохранить'}
        </button>
      </div>
      <p className="mt-1.5 text-right text-[9px] text-slate-400">{draft.length}/{MAX_LENGTH}</p>

      {notes.length > 0 ? (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-2"><h4 className="text-[11px] sm:text-xs font-black text-slate-700">Ближайшие напоминания</h4><span className="text-[10px] text-slate-400">до {MAX_NOTES} записей</span></div>
          {notes.map((note) => (
            <div key={note.id} className="group flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
              <BellRing size={15} className="mt-0.5 shrink-0 text-violet-500" />
              <div className="min-w-0 flex-1"><p className="text-[11px] sm:text-xs font-bold text-slate-700 leading-relaxed">{note.text}</p><p className="mt-0.5 text-[9px] sm:text-[10px] text-slate-400">{note.context} · {note.createdAt}</p></div>
              <button onClick={() => removeNote(note.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition" title="Удалить заметку" aria-label="Удалить заметку"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[11px] sm:text-xs text-slate-400">Пока нет личных заметок. Используйте быстрый шаблон или напишите свою.</p>
      )}
    </section>
  );
};
