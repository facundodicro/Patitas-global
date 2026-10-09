-- 006_ads_zona.sql
-- Geotargeting de publicidades: cada aviso lleva la zona del negocio
-- para mostrar primero los de la zona del usuario.

alter table ads add column if not exists zona text;
