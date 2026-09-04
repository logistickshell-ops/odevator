# Supabase analytics and private admin dashboard

## What is included

The project contains a browser-safe Supabase client, a non-blocking analytics client, an analytics table protected by RLS, a public `record-event` Edge Function with an allowlist, a JWT-protected `admin-dashboard` Edge Function, and a hidden footer entry point for the owner dashboard.

The current Render Static Site can remain static. Only the public Supabase URL, anon key, and the admin email are exposed to the browser. The service role key is used only as a Supabase Edge Function secret.

## 1. Create the Supabase project

Create a Supabase project and copy its Project URL and anon/publishable key. In Authentication, create one administrator user with email/password. Disable public sign-ups after creating the account. The email must match `ADMIN_EMAIL` used by the dashboard function.

## 2. Apply the database migration

Run `supabase/migrations/001_analytics.sql` in the Supabase SQL Editor or apply it with the Supabase CLI. The migration enables RLS, revokes browser read/write grants except insert, validates event names and bounds, and creates indexes for time and event queries. Run `supabase/tests/analytics_rls.test.sql` with the Supabase test database workflow where available.

## 3. Deploy Edge Functions

Install and authenticate the Supabase CLI, link the project, then run:

```bash
supabase functions deploy record-event --no-verify-jwt
supabase functions deploy admin-dashboard
```

The `record-event` function is public by design because anonymous visitors must be able to send analytics; it validates every payload, applies a per-session rate limit, and writes with the server-only service role. Browser roles have no direct table access. The dashboard function remains JWT-protected and additionally checks the authenticated user's email against `ADMIN_EMAIL`.

Set function secrets:

```bash
supabase secrets set \
  APP_ORIGIN=https://childs-dresser.onrender.com \
  ADMIN_EMAIL=your-admin-email@example.com \
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Supabase provides `SUPABASE_URL` and the function key environment automatically. Do not commit the service-role key or put it in a `VITE_` variable.

## 4. Configure Render

Add these public build variables to the Render Static Site:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

Redeploy the site. The public values are safe for a browser client, but RLS remains mandatory. The admin password is entered only in the login form and is sent to Supabase Auth over HTTPS; it is not stored in the repository or frontend code.

## 5. Use the dashboard

A small low-contrast dot appears in the footer. It is only a discovery mechanism, not a security boundary. Open it, enter the administrator password, and use the dashboard period selector. The dashboard shows total events, unique sessions, daily activity, event rankings, cities and languages. Browser users cannot select, update or delete analytics rows.

## 6. Events

The browser client sends only an allowlisted event name, anonymous session ID, optional city key, language, child count and small metadata. It cannot insert into the table directly; the Edge Function is the only write path. It never sends child names, notes, full profiles, weather payloads or Telegram bot secrets. Analytics failures are swallowed so they cannot break weather or Telegram flows.

## 7. Production checks

After deploying, verify that the normal site works with Supabase variables absent as well as present. Verify that an incorrect admin password is rejected, a non-admin Supabase account receives `403`, and the dashboard loads only for the configured admin email. Verify that `select * from analytics_events` from the browser fails and that events appear in the dashboard after opening the app or generating a weekly forecast.

## Architecture notes

The current and weekly forecast share the same Open-Meteo response from `App.tsx`. `WeeklyForecast` receives the already loaded response and falls back to its own request only when the component is used standalone or the shared response is unavailable. In the normal app flow this removes the duplicate weather request.

The admin entry point is a low-contrast footer button and is not part of the main navigation. The heavy Auth/dashboard module is dynamically imported when the button is opened; it is not required for ordinary weather usage. This hides the feature from the normal UX but does not replace server-side authorization.
