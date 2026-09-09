create table if not exists careloop.products (
  id text primary key,
  name text not null,
  brand text,
  category text not null,
  status text not null,
  care_score integer,
  scores jsonb,
  created_at timestamptz not null default now()
);

alter table careloop.products drop constraint if exists products_status_check;
alter table careloop.products add constraint products_status_check check (status in ('active', 'draft', 'routed'));

insert into careloop.products (id, name, brand, category, status, care_score, scores) values
  ('p1', 'EcoBrew Coffee Maker', 'EcoBrew', 'Appliances', 'active', 78,
    '{"health":{"value":82,"tag":"Low-tox"},"planet":{"value":64,"tag":"Recycled inputs"},"ethics":{"value":48,"tag":"Partial audit"},"longevity":{"value":91,"tag":"Repairable"}}'),
  ('p2', 'Trailhead Backpack', 'Trailhead', 'Outdoor', 'active', 64,
    '{"health":{"value":70,"tag":"Low-tox"},"planet":{"value":58,"tag":"Recycled inputs"},"ethics":{"value":66,"tag":"Verified audit"},"longevity":{"value":75,"tag":"Repairable"}}'),
  ('p3', 'Nordic Wool Sweater', null, 'Clothing', 'draft', null, null),
  ('cat1', 'Aalto Table Lamp', 'Iittala', 'Home', 'active', null, null)
on conflict (id) do nothing;

create table if not exists careloop.care_logs (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references careloop.products(id),
  type text not null,
  note text,
  share boolean not null default false,
  created_at timestamptz not null default now()
);

alter table careloop.care_logs drop constraint if exists care_logs_type_check;
alter table careloop.care_logs add constraint care_logs_type_check check (type in ('clean', 'store', 'rotate', 'service'));

create table if not exists careloop.repair_requests (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references careloop.products(id),
  partner_id text not null,
  issue text not null,
  created_at timestamptz not null default now()
);

create table if not exists careloop.next_life_routes (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references careloop.products(id),
  route text not null,
  partner_id text,
  retained_value numeric,
  created_at timestamptz not null default now()
);

-- table may already exist from an earlier run with a stale constraint; force it to match.
alter table careloop.next_life_routes drop constraint if exists next_life_routes_route_check;
alter table careloop.next_life_routes add constraint next_life_routes_route_check check (route in ('reuse', 'resell', 'donate', 'refurbish', 'recycle'));

-- p1/p2/cat1 are owned+active, so they've accrued real history; p3 is still draft with no activity yet.
insert into careloop.care_logs (product_id, type, note, share, created_at)
select * from (values
  ('p1', 'clean', 'Descaled and wiped down after weekly use', false, now() - interval '2 days'),
  ('p1', 'service', 'Replaced grinder burrs', true, now() - interval '40 days'),
  ('p2', 'clean', 'Hosed off trail mud, air dried before storing', false, now() - interval '5 days'),
  ('p2', 'store', 'Packed away for off season with silica packs', false, now() - interval '60 days'),
  ('cat1', 'clean', 'Dusted shade and polished base', false, now() - interval '10 days')
) as v(product_id, type, note, share, created_at)
where not exists (select 1 from careloop.care_logs);

insert into careloop.repair_requests (product_id, partner_id, issue, created_at)
select * from (values
  ('p1', 'partner1', 'Grinder jammed mid-brew, needs inspection', now() - interval '38 days'),
  ('cat1', 'partner3', 'Cord feels loose near the base', now() - interval '9 days')
) as v(product_id, partner_id, issue, created_at)
where not exists (select 1 from careloop.repair_requests);

insert into careloop.next_life_routes (product_id, route, partner_id, retained_value, created_at)
select * from (values
  ('p2', 'donate', null::text, null::numeric, now() - interval '3 days')
) as v(product_id, route, partner_id, retained_value, created_at)
where not exists (select 1 from careloop.next_life_routes);
