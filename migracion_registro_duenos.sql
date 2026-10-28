-- ============================================================
-- Patitas · Registro de dueños (2026-10-28)
-- ============================================================
-- Hasta ahora solo una VETERINARIA podía crear fichas y QRs.
-- Esta migración habilita que un DUEÑO (usuario común con cuenta)
-- registre su propia mascota, genere su QR y lo descargue.
--
-- Diseño:
--  * pets.origen distingue el origen de la ficha: 'veterinaria'
--    (default, comportamiento actual intacto) o 'dueno'.
--  * pets.dueno_user_id vincula la mascota con el usuario dueño
--    (auth.users). NO se usa pets.owner_id porque referencia a
--    profiles, tabla del modelo viejo que la app actual no puebla.
--  * pets.consentimiento_contacto: el dueño acepta explícitamente
--    que su WhatsApp se muestre en la ficha pública. Solo con ese
--    OK la vista de contacto expone sus datos.
--  * pets.raza: dato del formulario de registro (pets no lo tenía;
--    reports sí).
--  * La vista public.pets_public (blindaje de privacidad del
--    2026-10-16) NO se toca: las fichas de veterinaria siguen sin
--    exponer datos del dueño. El contacto del dueño viaja por una
--    vista separada y solo para fichas de origen 'dueno' con
--    consentimiento.
--
-- Idempotente: se puede correr más de una vez sin romper nada.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Columnas nuevas en pets
-- ------------------------------------------------------------

alter table public.pets
  add column if not exists origen text not null default 'veterinaria';

alter table public.pets
  add column if not exists dueno_user_id uuid
  references auth.users(id) on delete cascade;

alter table public.pets
  add column if not exists consentimiento_contacto boolean not null default false;

alter table public.pets
  add column if not exists raza text;

-- ------------------------------------------------------------
-- 2. Normalizar los valores de origen
--    (todas las fichas existentes son de veterinaria; el paso es
--    defensivo por si la columna ya existiera con otro contenido)
-- ------------------------------------------------------------

update public.pets
set origen = 'veterinaria'
where origen is null or origen not in ('veterinaria', 'dueno');

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'pets_origen_check'
  ) then
    alter table public.pets
      add constraint pets_origen_check check (origen in ('veterinaria', 'dueno'));
  end if;
end $$;

create index if not exists pets_dueno_user_idx
  on public.pets (dueno_user_id)
  where dueno_user_id is not null;

-- ------------------------------------------------------------
-- 3. Vista pública de contacto del dueño
--    Solo expone nombre + WhatsApp cuando la mascota fue
--    registrada por su dueño Y el dueño dio su consentimiento.
--    Las mascotas de veterinaria NUNCA aparecen acá.
-- ------------------------------------------------------------

create or replace view public.pets_contacto_dueno as
select
  p.id as pet_id,
  p.dueno_nombre as nombre,
  p.dueno_whatsapp as whatsapp
from public.pets p
where p.origen = 'dueno'
  and p.consentimiento_contacto = true
  and p.dueno_whatsapp is not null;

-- ------------------------------------------------------------
-- 4. RLS: gestión del dueño sobre SUS mascotas
--    (las policies de veterinaria quedan como están; estas se
--    suman — en Postgres las policies permisivas se combinan
--    con OR)
-- ------------------------------------------------------------

drop policy if exists "pets insert dueno" on public.pets;
create policy "pets insert dueno"
  on public.pets for insert
  with check (
    origen = 'dueno'
    and dueno_user_id = auth.uid()
    and veterinaria_id is null
  );

drop policy if exists "pets update dueno" on public.pets;
create policy "pets update dueno"
  on public.pets for update
  using (origen = 'dueno' and dueno_user_id = auth.uid())
  with check (origen = 'dueno' and dueno_user_id = auth.uid());

drop policy if exists "pets delete dueno" on public.pets;
create policy "pets delete dueno"
  on public.pets for delete
  using (origen = 'dueno' and dueno_user_id = auth.uid());

-- ------------------------------------------------------------
-- 5. GRANTs explícitos
--    Desde el 2026-10-30 las tablas/vistas nuevas ya no reciben
--    acceso automático a la Data API: hay que otorgarlo.
--    (pets ya existía; se reafirman sus permisos por las dudas.)
-- ------------------------------------------------------------

grant select on public.pets to anon, authenticated;
grant insert, update, delete on public.pets to authenticated;

grant select on public.pets_contacto_dueno to anon, authenticated;

-- ------------------------------------------------------------
-- 6. Verificación
-- ------------------------------------------------------------

select 'pets total' as chequeo, count(*) from public.pets
union all
select 'pets de duenos', count(*) from public.pets where origen = 'dueno'
union all
select 'contactos publicos de duenos', count(*) from public.pets_contacto_dueno;

-- Chequeo manual sugerido tras correr la migración: una mascota
-- registrada por un dueño debe aparecer en pets_contacto_dueno y
-- la ficha de una veterinaria (ej. la de Blanca) NO debe aparecer
-- ahí ni exponer datos del dueño en pets_public.
