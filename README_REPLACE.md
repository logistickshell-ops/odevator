# Supabase analytics package

Перезапишите содержимое `src/`, папку `supabase/`, `package.json`, `package-lock.json` и `.env.example` поверх репозитория. Установите зависимости и настройте Supabase по `SUPABASE_SETUP.md`.

Обязательные Render variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAIL`.

Обязательные Supabase Function secrets: `APP_ORIGIN`, `ADMIN_EMAIL`, `SUPABASE_SERVICE_ROLE_KEY`.

После настройки выполните `npm ci`, `npm run check`, `npm run build` и `npm run verify:algorithm`. Без Supabase variables приложение продолжает работать, но аналитика и admin dashboard остаются выключенными.
