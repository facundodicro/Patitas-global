-- 005_ads_destacado.sql
-- Un solo patrocinador destacado, distinto de las publicidades del banner:
-- la columna "destacado" marca el aviso que va en la tarjeta de patrocinador.

alter table ads add column if not exists destacado boolean default false;
