-- Patitas · Puerta de activación del panel veterinario (2026-11-01)
-- Diseño cerrado con Facundo: registro libre -> panel nace CERRADO ->
-- Facundo activa a mano cuando la veterinaria paga la suscripción ->
-- si deja de pagar, activa=false (panel en pausa) pero las fichas
-- públicas de sus pacientes siguen vivas (no se toca la tabla pets).
--
-- La pantalla de activación NO muestra el precio: se habla por WhatsApp.

-- 1. Columna de activación: las veterinarias NUEVAS nacen desactivadas.
alter table public.veterinarias
  add column if not exists activa boolean not null default false;

-- 2. Las veterinarias que YA existen son anteriores a la puerta:
--    quedan activas. El corte por fecha hace que re-correr este script
--    en el futuro NO active a las que se registren después.
update public.veterinarias
  set activa = true
  where activa = false
    and created_at < timestamptz '2026-11-02 00:00:00-03';

-- 3. Verificación: tiene que listar las veterinarias existentes con activa = true.
select nombre, whatsapp, activa, created_at
from public.veterinarias
order by created_at;
