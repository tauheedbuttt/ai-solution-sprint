create table if not exists careloop.products (
  id text primary key,
  name text not null,
  brand text,
  category text not null,
  status text not null check (status in ('active', 'draft', 'routed')),
  care_score integer,
  scores jsonb,
  created_at timestamptz not null default now()
);

insert into careloop.products (id, name, brand, category, status, care_score, scores) values
  ('p1', 'EcoBrew Coffee Maker', 'EcoBrew', 'Appliances', 'active', 78,
    '{"health":{"value":82,"tag":"Low-tox"},"planet":{"value":64,"tag":"Recycled inputs"},"ethics":{"value":48,"tag":"Partial audit"},"longevity":{"value":91,"tag":"Repairable"}}'),
  ('p2', 'Trailhead Backpack', 'Trailhead', 'Outdoor', 'active', 64,
    '{"health":{"value":70,"tag":"Low-tox"},"planet":{"value":58,"tag":"Recycled inputs"},"ethics":{"value":66,"tag":"Verified audit"},"longevity":{"value":75,"tag":"Repairable"}}'),
  ('p3', 'Nordic Wool Sweater', null, 'Clothing', 'draft', null, null),
  ('cat1', 'Aalto Table Lamp', 'Iittala', 'Home', 'active', null, null)
on conflict (id) do nothing;
