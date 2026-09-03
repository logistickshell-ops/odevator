import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import { getLanguage, setLanguage, subscribeLanguage, Language } from '../i18n';

export function LanguageSwitcher() {
  const [language, setCurrentLanguage] = useState<Language>(getLanguage());

  useEffect(() => subscribeLanguage(setCurrentLanguage), []);

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white/80 p-1 shadow-sm" aria-label="Language">
      <Languages size={14} className="ml-1 text-slate-400" />
      {(['ru', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase transition ${language === option ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
