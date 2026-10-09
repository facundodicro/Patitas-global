-- 004_ads_foto_url.sql
-- La red de negocios adheridos lleva foto: se agrega la columna foto_url
-- a la tabla de publicidades.

alter table ads add column if not exists foto_url text;
