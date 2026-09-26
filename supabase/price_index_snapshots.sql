create table if not exists price_index_snapshots (
  id bigint generated always as identity primary key,
  metal text not null check (metal in ('gold', 'silver', 'platinum')),
  price_per_gram numeric not null,
  price_per_troy_ounce numeric not null,
  source text not null check (source in ('live', 'fallback')),
  as_of timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists price_index_snapshots_metal_created_at_idx
  on price_index_snapshots (metal, created_at desc);

alter table price_index_snapshots enable row level security;

create policy "public read access"
  on price_index_snapshots for select
  to anon, authenticated
  using (true);

create policy "authenticated users can insert snapshots"
  on price_index_snapshots for insert
  to authenticated
  with check (true);
