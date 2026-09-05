# МетеоОдевайка / Meteodevayka

> Умный подбор детской одежды по погоде — для родителей, прогулок и спокойных сборов.
>
> Smart weather-based outfit recommendations for children — helping parents prepare for every walk.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-childs--dresser.onrender.com-4f46e5?style=flat-square)](https://childs-dresser.onrender.com)
[![Telegram Bot](https://img.shields.io/badge/Telegram-%40meteo__odevaika-229ED9?style=flat-square&logo=telegram&logoColor=white)](https://t.me/meteo_odevaika_bot)
[![React](https://img.shields.io/badge/React-18-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-analytics%20%26%20auth-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

**Repository:** [github.com/logistickshell-ops/odevator](https://github.com/logistickshell-ops/odevator)  
**Live application:** [childs-dresser.onrender.com](https://childs-dresser.onrender.com)  
**Telegram Mini App:** [@meteo_odevaika_bot](https://t.me/meteo_odevaika_bot)

---

## Русская версия

### О проекте

**МетеоОдевайка** — веб-приложение и Telegram Mini App, которое помогает родителям быстро подобрать ребёнку одежду по текущей погоде и прогнозу. Сервис учитывает температуру, ощущаемую температуру, ветер, влажность, осадки, время суток и индивидуальные параметры ребёнка.

Вместо абстрактного совета «оденьте теплее» приложение формирует понятный комплект по слоям и показывает его на интерактивной SVG-визуализации ребёнка.

### Возможности

| Возможность | Описание |
|---|---|
| Рекомендации по погоде | Комплект одежды рассчитывается по погодным условиям и профилю ребёнка |
| Профиль ребёнка | Возрастная группа, пол, активность и чувствительность к холоду |
| Слои одежды | Нижний слой, верх, верхняя одежда, головной убор, обувь и аксессуары |
| SVG-визуализация | Синхронизированное отображение рекомендуемой одежды без смещения слоёв |
| Прогноз на неделю | Бесплатный недельный прогноз в общем погодном запросе |
| Локализация | Полные русская и английская версии интерфейса |
| Telegram Mini App | Запуск внутри Telegram с поддержкой sharing и Telegram Stars |
| Аналитика | Скрытый защищённый dashboard для владельца проекта |
| Технический мониторинг | Контроль ошибок погоды, latency и ключевых продуктовых событий |
| Product funnel | Воронка от открытия приложения до результата, sharing и оплаты |
| Retention | Когорты и показатели D1, D7 и D30 |
| Аналитика одежды | Популярность отдельных вещей и категорий |

### Как рассчитывается рекомендация

Погодный движок использует следующие факторы:

- температуру и ощущаемую температуру;
- скорость ветра;
- влажность и вероятность осадков;
- тип погодного кода Open-Meteo;
- период дня;
- возрастную группу ребёнка;
- уровень активности;
- индивидуальную чувствительность к холоду;
- дождь, снег и сильный ветер.

Для ответа API применяется типизированная модель данных. Если ощущаемая температура недоступна, используется безопасный fallback на фактическую температуру. Детерминированные проверки погодного алгоритма покрывают граничные температуры, осадки, ветер, профили и периоды дня.

### Архитектура

```text
React + TypeScript + Vite
        │
        ├── Open-Meteo Weather API
        │       └── текущая погода и прогноз на неделю
        │
        ├── Weather Engine
        │       └── персональная рекомендация одежды
        │
        ├── SVG Visualization
        │       └── визуальный комплект на ребёнке
        │
        ├── Telegram WebApp SDK
        │       ├── Mini App
        │       ├── sharing
        │       └── Telegram Stars flow
        │
        └── Supabase
                ├── Auth — администратор
                ├── Postgres — analytics_events
                ├── record-event — публичная запись событий
                └── admin-dashboard — защищённая статистика
```

### Стек

| Слой | Технологии |
|---|---|
| Frontend | React 18, TypeScript, Vite 6 |
| Стили | Tailwind CSS 4, CSS |
| Иконки | Lucide React |
| Погода | Open-Meteo API |
| Backend analytics | Supabase Edge Functions, Postgres, Auth |
| Telegram | Telegram WebApp SDK, Telegram Stars |
| Deploy | Render Static Site |
| Build | Vite Single File |

### Структура проекта

```text
.
├── src/
│   ├── App.tsx                         # Основной application flow
│   ├── main.tsx                        # React entrypoint
│   ├── types.ts                        # Общие TypeScript-типы
│   ├── i18n.ts                         # Локализация и язык интерфейса
│   ├── i18n_catalog.generated.ts       # Сгенерированный каталог RU/EN
│   ├── analytics/
│   │   └── analyticsClient.ts          # Безблокирующая аналитика
│   ├── admin/
│   │   ├── AdminEntryButton.tsx        # Скрытая точка входа
│   │   └── AdminPanel.tsx               # Русскоязычный dashboard
│   ├── components/                     # UI, прогноз, sharing и профили
│   ├── lib/
│   │   └── supabase.ts                 # Browser-safe Supabase client
│   ├── payments/
│   │   └── telegramStars.ts            # Telegram Stars integration
│   └── utils/
│       ├── weatherEngine.ts             # Движок рекомендаций
│       ├── childProfile.ts              # Профиль ребёнка
│       └── telegramShare.ts             # Sharing helpers
├── supabase/
│   ├── functions/
│   │   ├── record-event/                # Валидация и запись событий
│   │   └── admin-dashboard/             # Защищенные агрегаты
│   ├── migrations/                      # SQL-схема и индексы
│   └── tests/                           # RLS tests
├── scripts/
│   └── verify-weather-algorithm.ts      # Проверка погодного движка
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

### Локальный запуск

Требования: Node.js 20 или новее и npm.

```bash
git clone https://github.com/logistickshell-ops/odevator.git
cd odevator
npm ci
```

Создай `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполни только browser-safe переменные:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

Запусти development server:

```bash
npm run dev
```

После этого приложение будет доступно по адресу, который выведет Vite, обычно `http://localhost:5173`.

### Проверки проекта

```bash
npm run check
npm run build
npm run verify:algorithm
```

Команды проверяют TypeScript, production-сборку и основные границы погодного алгоритма.

### Supabase и аналитика

В проекте используются три последовательные миграции:

```text
supabase/migrations/001_analytics.sql
supabase/migrations/002_analytics_enhancements.sql
supabase/migrations/003_product_analytics.sql
```

Миграции создают защищённую таблицу `public.analytics_events`, индексы, ограничения событий и поля для технической, продуктовой и Telegram-аналитики.

#### Edge Functions

Публичная функция записи событий:

```bash
npx supabase functions deploy record-event --no-verify-jwt
```

Защищённая функция dashboard:

```bash
npx supabase functions deploy admin-dashboard
```

Secrets функций задаются только в Supabase:

```bash
npx supabase secrets set \
  APP_ORIGIN=https://childs-dresser.onrender.com \
  ADMIN_EMAIL=your-admin-email@example.com
```

`SUPABASE_SERVICE_ROLE_KEY` используется только внутри Edge Functions. Его нельзя добавлять в frontend, Render Static Site или GitHub.

#### Защищённый dashboard

Административная статистика скрыта в пользовательском интерфейсе и защищена Supabase Auth. Доступ проверяется по JWT и разрешённому `ADMIN_EMAIL`. Browser-клиент не получает прямого доступа к таблице аналитики: чтение выполняется внутри `admin-dashboard` с server-side secret.

Dashboard показывает:

- события, визиты и уникальных посетителей;
- новых и возвращающихся пользователей;
- города с названиями;
- языки и пол детей;
- среднее время сессии;
- дневные графики и кривые активности;
- воронку основного сценария;
- технические показатели и ошибки;
- оплату и конверсию Telegram Stars;
- Telegram Mini App-метрики;
- D1/D7/D30 retention и когорты;
- популярность отдельных вещей.

### Render deployment

Проект публикуется как Render Static Site.

Рекомендуемый порядок:

1. Добавить `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` и `VITE_ADMIN_EMAIL` в Render Environment.
2. Выполнить новый production deploy после изменения переменных.
3. Убедиться, что Render собирает проект через npm и публикует `dist` согласно настройкам сервиса.
4. После deploy проверить обычный weather flow, Telegram Mini App и скрытый dashboard.

`VITE_*` переменные встраиваются в frontend во время build. Service-role key и Auth password в Render Static Site не нужны и не должны добавляться.

### Безопасность и приватность

Проект придерживается следующих принципов:

- service-role key не попадает в browser bundle;
- прямой доступ browser-ролей к `analytics_events` закрыт RLS;
- события проходят серверную allowlist-валидацию;
- metadata ограничивается по количеству и длине;
- аналитика не должна блокировать основной UI;
- Telegram `initData`, Telegram ID, email и имя ребёнка не отправляются в обычную продуктовую аналитику;
- локальные `.env` и `node_modules` исключены из Git;
- Supabase CLI runtime artifacts не должны храниться в репозитории.

### Roadmap

Ближайшие направления развития:

1. server-side ledger для подтверждённых оплат и entitlement;
2. ежедневные агрегаты и политика хранения raw analytics;
3. обратная связь «Подошло / Не совсем подходит» после рекомендации;
4. ошибки frontend и API с нормализованными error codes;
5. CI для `npm ci`, TypeScript, build и weather verifier;
6. browser smoke tests для основного сценария;
7. избранные города и несколько профилей детей;
8. уведомления о погодном окне для прогулки;
9. Telegram deep links и кампании привлечения;
10. lazy-loading admin и premium-блоков.

### Лицензия

Лицензия в репозитории пока не указана. Перед публичным распространением или использованием проекта в сторонних продуктах добавьте подходящий LICENSE-файл.

---

## English version

### About the project

**Meteodevayka** is a web application and Telegram Mini App that helps parents choose suitable clothes for a child based on current weather and the weekly forecast. The service considers temperature, feels-like temperature, wind, humidity, precipitation, time of day and the child’s personal profile.

Instead of a generic “dress warmer” recommendation, the application creates a clear layered outfit and renders it on an interactive SVG child visualization.

### Features

| Feature | Description |
|---|---|
| Weather recommendations | Outfit selection based on weather conditions and child profile |
| Child profile | Age group, gender, activity level and cold sensitivity |
| Clothing layers | Base layer, top, outerwear, headwear, shoes and accessories |
| SVG visualization | Synchronized visual representation of the recommended outfit |
| Weekly forecast | Free weekly forecast powered by an optimized weather request |
| Localization | Complete Russian and English interface |
| Telegram Mini App | Telegram launch, sharing and Telegram Stars support |
| Analytics | Hidden, protected owner-only dashboard |
| Technical monitoring | Weather API errors, latency and product health events |
| Product funnel | From app open to result, sharing and payment intent |
| Retention | D1, D7 and D30 cohort metrics |
| Clothing analytics | Popular items and clothing categories |

### Recommendation engine

The weather engine combines:

- temperature and apparent temperature;
- wind speed;
- humidity and precipitation probability;
- Open-Meteo weather codes;
- time of day;
- the child’s age group;
- activity level;
- cold sensitivity;
- rain, snow and strong wind conditions.

The API response is represented by typed data models. If apparent temperature is unavailable, the engine falls back to actual temperature. Deterministic checks cover temperature boundaries, precipitation, wind, child profiles and daily periods.

### Architecture

```text
React + TypeScript + Vite
        │
        ├── Open-Meteo Weather API
        │       └── current weather and weekly forecast
        │
        ├── Weather Engine
        │       └── personalized clothing recommendation
        │
        ├── SVG Visualization
        │       └── outfit layers rendered on the child
        │
        ├── Telegram WebApp SDK
        │       ├── Mini App
        │       ├── sharing
        │       └── Telegram Stars flow
        │
        └── Supabase
                ├── Auth — administrator
                ├── Postgres — analytics_events
                ├── record-event — public event ingestion
                └── admin-dashboard — protected statistics
```

### Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4, CSS |
| Icons | Lucide React |
| Weather | Open-Meteo API |
| Analytics backend | Supabase Edge Functions, Postgres, Auth |
| Telegram | Telegram WebApp SDK, Telegram Stars |
| Deployment | Render Static Site |
| Build | Vite Single File |

### Project structure

```text
.
├── src/
│   ├── App.tsx                         # Main application flow
│   ├── main.tsx                        # React entrypoint
│   ├── types.ts                        # Shared TypeScript types
│   ├── i18n.ts                         # Localization and language state
│   ├── i18n_catalog.generated.ts       # Generated RU/EN catalog
│   ├── analytics/
│   │   └── analyticsClient.ts          # Non-blocking analytics client
│   ├── admin/
│   │   ├── AdminEntryButton.tsx        # Hidden entry point
│   │   └── AdminPanel.tsx               # Russian admin dashboard
│   ├── components/                     # UI, forecast, sharing and profiles
│   ├── lib/
│   │   └── supabase.ts                 # Browser-safe Supabase client
│   ├── payments/
│   │   └── telegramStars.ts            # Telegram Stars integration
│   └── utils/
│       ├── weatherEngine.ts             # Recommendation engine
│       ├── childProfile.ts              # Child profile helpers
│       └── telegramShare.ts             # Sharing helpers
├── supabase/
│   ├── functions/
│   │   ├── record-event/                # Event validation and ingestion
│   │   └── admin-dashboard/             # Protected aggregates
│   ├── migrations/                      # SQL schema and indexes
│   └── tests/                           # RLS tests
├── scripts/
│   └── verify-weather-algorithm.ts      # Weather engine verification
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

### Local development

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/logistickshell-ops/odevator.git
cd odevator
npm ci
```

Create `.env` from the example file:

```bash
cp .env.example .env
```

Set browser-safe values only:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

Start the development server:

```bash
npm run dev
```

The application will be available at the Vite URL, usually `http://localhost:5173`.

### Project checks

```bash
npm run check
npm run build
npm run verify:algorithm
```

These commands validate TypeScript, the production build and the main weather algorithm boundaries.

### Supabase and analytics

The project uses three ordered migrations:

```text
supabase/migrations/001_analytics.sql
supabase/migrations/002_analytics_enhancements.sql
supabase/migrations/003_product_analytics.sql
```

The migrations create the protected `public.analytics_events` table, indexes, event constraints and fields for technical, product and Telegram analytics.

#### Edge Functions

Public event ingestion:

```bash
npx supabase functions deploy record-event --no-verify-jwt
```

Protected dashboard API:

```bash
npx supabase functions deploy admin-dashboard
```

Set function secrets only in Supabase:

```bash
npx supabase secrets set \
  APP_ORIGIN=https://childs-dresser.onrender.com \
  ADMIN_EMAIL=your-admin-email@example.com
```

`SUPABASE_SERVICE_ROLE_KEY` is used only inside Edge Functions. It must never be added to the frontend, Render Static Site or GitHub.

#### Protected dashboard

The statistics dashboard is hidden from the regular interface and protected with Supabase Auth. Access is verified through the JWT and the allowed `ADMIN_EMAIL`. The browser client has no direct read access to the analytics table; reads are performed by the protected `admin-dashboard` function with a server-side secret.

The dashboard includes:

- events, visits and unique visitors;
- new and returning users;
- city names;
- languages and child gender distribution;
- average session duration;
- daily charts and activity curves;
- the main product funnel;
- technical health metrics and errors;
- Telegram Stars payment conversion;
- Telegram Mini App metrics;
- D1/D7/D30 retention and cohorts;
- popular clothing items.

### Render deployment

The project is deployed as a Render Static Site.

Recommended workflow:

1. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_ADMIN_EMAIL` to Render Environment.
2. Trigger a new production deploy after changing environment variables.
3. Ensure Render installs dependencies with npm and publishes the configured `dist` directory.
4. Verify the regular weather flow, Telegram Mini App and protected dashboard after deployment.

`VITE_*` values are embedded into the frontend during the build. The service-role key and Auth password are not needed on the Render Static Site and must not be added there.

### Security and privacy

The project follows these principles:

- the service-role key never enters the browser bundle;
- direct browser access to `analytics_events` is blocked by RLS;
- events pass server-side allowlist validation;
- metadata is limited by key count and value length;
- analytics failures never block the main UI;
- Telegram `initData`, Telegram IDs, email addresses and child names are not sent to regular product analytics;
- local `.env` files and `node_modules` are excluded from Git;
- Supabase CLI runtime artifacts should not be committed.

### Roadmap

Potential next steps include:

1. a server-side ledger for confirmed payments and entitlements;
2. daily aggregates and a raw analytics retention policy;
3. “Fits / Not quite” recommendation feedback;
4. normalized frontend and API error codes;
5. CI for `npm ci`, TypeScript, build and the weather verifier;
6. browser smoke tests for the main user flow;
7. favorite cities and multiple child profiles;
8. weather-window notifications for walks;
9. Telegram deep links and acquisition campaigns;
10. lazy-loading for the admin and premium sections.

### License

No license has been declared in the repository yet. Before distributing or embedding the project in third-party products, add an appropriate LICENSE file.

---

## Maintainer notes

Keep public browser variables limited to `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_ADMIN_EMAIL`. Never commit `.env`, service-role keys, Auth passwords, Telegram secrets or Supabase CLI runtime artifacts.

For production payment accounting, treat server-side Telegram verification and transaction records as the source of truth. Frontend payment events are useful for product analytics but should not be treated as confirmed revenue.

---

## Лицензия / License

Проект / Project license: **not specified yet**.

Перед публикацией / Before public distribution, add a `LICENSE` file with the terms you choose.
