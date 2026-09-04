begin;
select plan(6);

select ok(
  not has_table_privilege('anon', 'public.analytics_events', 'select'),
  'anon cannot read analytics'
);
select ok(
  not has_table_privilege('authenticated', 'public.analytics_events', 'select'),
  'authenticated cannot read analytics'
);
select ok(
  not has_table_privilege('anon', 'public.analytics_events', 'insert'),
  'anon cannot insert directly'
);
select ok(
  not has_table_privilege('anon', 'public.analytics_events', 'update'),
  'anon cannot update analytics'
);
select ok(
  not has_table_privilege('anon', 'public.analytics_events', 'delete'),
  'anon cannot delete analytics'
);
select throws_ok(
  $$select * from public.analytics_events$$,
  '42501',
  null,
  'anonymous select is denied'
);

select * from finish();
rollback;
