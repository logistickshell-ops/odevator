import { lazy, Suspense, useState } from 'react';
import { useLanguage } from '../i18n';

const AdminModal = lazy(() => import('./AdminPanel').then((module) => ({ default: module.AdminModal })));

const labels = {
  ru: 'Открыть служебную панель',
  en: 'Open service panel',
} as const;

export function AdminEntryButton() {
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setOpen(true)} className="mt-3 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-200 transition hover:bg-slate-100 hover:text-slate-400" aria-label={labels[language]}><span className="h-1.5 w-1.5 rounded-full bg-current" /></button>
    {open && <Suspense fallback={null}><AdminModal onClose={() => setOpen(false)} /></Suspense>}
  </>;
}
