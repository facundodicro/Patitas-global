-- Patitas — fecha de nacimiento de la mascota (2026-11-06)
-- Pedido de la Dra. Celia Pintos en su alta: en el formulario de la
-- veterinaria, en vez de «Edad» escrita a mano (queda vieja), se carga la
-- FECHA DE NACIMIENTO y la edad se calcula al día en la app.
-- El formulario del dueño (sistema gratuito) no se toca.
-- La vista pets_public no se recrea: el código completa fecha_nacimiento
-- desde la tabla base, mismo patrón que raza (2026-10-28).

alter table public.pets add column if not exists fecha_nacimiento date;

-- Verificación:
-- select column_name, data_type from information_schema.columns
-- where table_schema = 'public' and table_name = 'pets'
--   and column_name = 'fecha_nacimiento';
-- Debe devolver: fecha_nacimiento | date
