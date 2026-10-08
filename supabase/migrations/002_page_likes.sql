-- ============================================================
-- PATITAS — Migración 002: Me gusta de la página
-- ============================================================
-- Si ya ejecutaste supabase/schema.sql, pegá este archivo en una
-- pestaña nueva del SQL Editor de Supabase y ejecutalo.
-- Crea la tabla page_likes para el botón "Me gusta" real del hero:
-- un like por usuario registrado (los anónimos también pueden
-- votar; su voto queda guardado en su navegador).
-- ============================================================

create table if not exists page_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- Un solo like por usuario registrado
create unique index if not exists page_likes_user_unique
  on page_likes (user_id) where user_id is not null;

alter table page_likes enable row level security;

-- Lectura pública del contador
drop policy if exists "select_publico_page_likes" on page_likes;
create policy "select_publico_page_likes"
  on page_likes for select
  using (true);

-- Cualquiera puede dar like (registrado o anónimo)
drop policy if exists "insert_publico_page_likes" on page_likes;
create policy "insert_publico_page_likes"
  on page_likes for insert
  with check (true);

-- Quitar el like: el propio usuario, o votos anónimos
drop policy if exists "delete_propio_page_likes" on page_likes;
create policy "delete_propio_page_likes"
  on page_likes for delete
  using (user_id = auth.uid() or user_id is null);
