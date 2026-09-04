# Обновление аналитики МетеоОдевайки

В обновлении dashboard всегда работает на русском языке и показывает города названиями, новых и возвращающихся пользователей, дневные SVG-графики событий и визитов, распределение по полу ребёнка и среднее время сессии.

## 1. Перезаписать файлы в репозитории

Скопируйте из архива файлы с сохранением структуры:

```text
src/App.tsx
src/analytics/analyticsClient.ts
src/admin/AdminPanel.tsx
supabase/functions/record-event/index.ts
supabase/functions/admin-dashboard/index.ts
supabase/migrations/002_analytics_enhancements.sql
```

Файл `SUPABASE_SETUP.md` также обновлён.

## 2. Применить миграцию в Supabase

Откройте `Supabase → SQL Editor → New query`, вставьте содержимое:

```text
supabase/migrations/002_analytics_enhancements.sql
```

и нажмите `Run`.

Миграция добавляет событие `session_ended` в constraint таблицы и индексы для `visitor_id` и `gender`. Старые записи не удаляются.

## 3. Обновить Edge Functions

Из корня проекта выполните:

```bash
npx supabase functions deploy record-event --no-verify-jwt
npx supabase functions deploy admin-dashboard
```

Secrets повторно задавать не требуется, если они уже работают:

```text
APP_ORIGIN
ADMIN_EMAIL
SUPABASE_SERVICE_ROLE_KEY
```

## 4. Пересобрать сайт на Render

Сделайте commit и push обновлённых файлов в GitHub. Затем в Render выполните новый deploy с пересборкой:

```text
Manual Deploy → Deploy latest commit
```

Старый frontend продолжит работать, но новые метрики появятся только после новой сборки.

## 5. Как считаются метрики

| Метрика | Логика |
|---|---|
| Посетители | Уникальный анонимный `visitor_id` из localStorage |
| Визиты | События `app_opened` с отдельным ID вкладки/сессии |
| Новые пользователи | Посетители, чей первый `app_opened` попал в выбранный период |
| Повторные входы | Посетители периода минус новые пользователи |
| Города | `selectedCity.name` из приложения и события `city_changed` |
| Пол детей | Пол активного профиля в metadata события `app_opened` |
| Среднее время | Среднее `duration_seconds` из `session_ended` |
| Графики | Дневные события и уникальные визиты |

Идентификаторы посетителей случайные и не содержат email, Telegram ID или имя ребёнка.

## 6. Проверка

После deploy откройте сайт и выполните несколько действий: выберите город, сформируйте гардероб, переключите язык, затем закройте вкладку. В Supabase проверьте:

```sql
select event_name, city_key, metadata, created_at
from public.analytics_events
order by created_at desc
limit 20;
```

Для dashboard выйдите из старой сессии, обновите страницу и войдите заново. Выберите период `30 дней` и нажмите `Обновить`.

## Важное ограничение времени сессии

Событие завершения отправляется при скрытии или закрытии страницы. Если пользователь принудительно завершил приложение или устройство потеряло сеть, событие может не отправиться. Поэтому среднее время является приблизительной метрикой и начинает заполняться после новых сессий.
