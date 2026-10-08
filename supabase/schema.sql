-- ============================================================
-- PATITAS — Schema SQL para Supabase
-- ============================================================
-- Cómo usarlo: pegalo en el SQL Editor de tu proyecto de Supabase
-- (una pestaña nueva) y ejecutalo. Crea las 4 tablas, habilita RLS,
-- crea el bucket "pet-photos" y deja las políticas listas.
--
-- ⚠️  POLÍTICAS PERMISIVAS DE DEMO: las políticas de abajo están
-- pensadas para que la app funcione rápido sin fricción (cualquier
-- usuario autenticado puede insertar/actualizar, la lectura es
-- pública). Si la app crece o maneja datos sensibles, endurecelas:
-- por ejemplo, limitar reportes públicos a los activos, restringir
-- el delete a un rol admin, o exigir que el teléfono se verifique.
-- ============================================================

-- ------------------------------------------------------------
-- Tablas
-- ------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  telefono text,
  email text,
  zona text
);

create table if not exists pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  nombre text not null,
  especie text,
  edad text,
  senas text,
  foto_url text,
  qr_destino text default 'ficha',
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete set null,
  tipo text check (tipo in ('perdida','encontrada')) not null,
  nombre text not null,
  especie text,
  raza text,
  senas text,
  recompensa text,
  zona text,
  fecha date,
  telefono text,
  foto_url text,
  estado text default 'perdida' check (estado in ('perdida','encontrada','en_casa')),
  lat double precision,
  lng double precision,
  created_at timestamptz default now()
);

create table if not exists ads (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  whatsapp text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table profiles enable row level security;
alter table pets enable row level security;
alter table reports enable row level security;
alter table ads enable row level security;

-- ---- Lectura pública (demo): cualquiera puede ver el tablón ----
drop policy if exists "select_publico_profiles" on profiles;
create policy "select_publico_profiles"
  on profiles for select
  using (true);

drop policy if exists "select_publico_pets" on pets;
create policy "select_publico_pets"
  on pets for select
  using (true);

drop policy if exists "select_publico_reports" on reports;
create policy "select_publico_reports"
  on reports for select
  using (true);

drop policy if exists "select_publico_ads" on ads;
create policy "select_publico_ads"
  on ads for select
  using (true);

-- ---- Insert: solo usuarios autenticados ----
drop policy if exists "insert_auth_profiles" on profiles;
create policy "insert_auth_profiles"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "insert_auth_pets" on pets;
create policy "insert_auth_pets"
  on pets for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "insert_auth_reports" on reports;
create policy "insert_auth_reports"
  on reports for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "insert_auth_ads" on ads;
create policy "insert_auth_ads"
  on ads for insert
  with check (auth.role() = 'authenticated');

-- ---- Update/Delete: dueño del registro (o autenticado en demo) ----
-- pets: solo el dueño puede modificar/borrar sus mascotas
drop policy if exists "update_delete_dueno_pets" on pets;
create policy "update_delete_dueno_pets"
  on pets for update
  using (owner_id = auth.uid());
drop policy if exists "delete_dueno_pets" on pets;
create policy "delete_dueno_pets"
  on pets for delete
  using (owner_id = auth.uid());

-- reports: el reportante puede modificar/borrar su reporte;
-- se permite reporter_id null (reportes anónimos/demo)
drop policy if exists "update_reportante_reports" on reports;
create policy "update_reportante_reports"
  on reports for update
  using (reporter_id = auth.uid() or reporter_id is null);
drop policy if exists "delete_reportante_reports" on reports;
create policy "delete_reportante_reports"
  on reports for delete
  using (reporter_id = auth.uid() or reporter_id is null);

-- ads: cualquier usuario autenticado (demo)
drop policy if exists "update_delete_auth_ads" on ads;
create policy "update_delete_auth_ads"
  on ads for update
  using (auth.role() = 'authenticated');
drop policy if exists "delete_auth_ads" on ads;
create policy "delete_auth_ads"
  on ads for delete
  using (auth.role() = 'authenticated');

-- profiles: cada uno edita su propio perfil
drop policy if exists "update_delete_propio_profiles" on profiles;
create policy "update_delete_propio_profiles"
  on profiles for update
  using (id = auth.uid());
drop policy if exists "delete_propio_profiles" on profiles;
create policy "delete_propio_profiles"
  on profiles for delete
  using (id = auth.uid());

-- ------------------------------------------------------------
-- Storage: bucket público "pet-photos"
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do nothing;

-- Lectura pública de las fotos
drop policy if exists "lectura_publica_pet_photos" on storage.objects;
create policy "lectura_publica_pet_photos"
  on storage.objects for select
  using (bucket_id = 'pet-photos');

-- Subida autenticada
drop policy if exists "subida_auth_pet_photos" on storage.objects;
create policy "subida_auth_pet_photos"
  on storage.objects for insert
  with check (bucket_id = 'pet-photos' and auth.role() = 'authenticated');

-- Actualización autenticada
drop policy if exists "actualizacion_auth_pet_photos" on storage.objects;
create policy "actualizacion_auth_pet_photos"
  on storage.objects for update
  using (bucket_id = 'pet-photos' and auth.role() = 'authenticated');

-- Borrado autenticado
drop policy if exists "borrado_auth_pet_photos" on storage.objects;
create policy "borrado_auth_pet_photos"
  on storage.objects for delete
  using (bucket_id = 'pet-photos' and auth.role() = 'authenticated');

-- Listo. Seguí con supabase/seed.sql si querés datos de ejemplo.
