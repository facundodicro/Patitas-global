-- ============================================================
-- PATITAS — Datos de ejemplo (seed)
-- ============================================================
-- Pegalo en una pestaña nueva del SQL Editor de Supabase y
-- ejecutalo DESPUÉS de supabase/schema.sql.
-- Crea 6 reportes de ejemplo repartidos por el mundo, sin foto
-- (foto_url null). Podés borrarlos cuando quieras desde la app.
-- ============================================================

insert into reports
  (tipo, nombre, especie, raza, senas, recompensa, zona, fecha, telefono, foto_url, estado, lat, lng)
values
  (
    'perdida', 'Milo', 'Perro', 'Labrador',
    'Pelo dorado, collar azul. Muy sociable.',
    'Se ofrece recompensa', 'Palermo, Buenos Aires',
    current_date - interval '2 days', '5491100000001', null, 'perdida',
    -34.6037, -58.3816
  ),
  (
    'perdida', 'Luna', 'Gato', 'Siamés',
    'Ojos celestes, mancha blanca en el pecho. Asustadiza.',
    null, 'Condesa, CDMX',
    current_date - interval '5 days', '5215500000002', null, 'perdida',
    19.4326, -99.1332
  ),
  (
    'perdida', 'Rocky', 'Perro', 'Bulldog',
    'Contextura robusta, mancha marrón sobre el ojo derecho.',
    null, 'Retiro, Madrid',
    current_date - interval '1 day', '346000000003', null, 'perdida',
    40.4168, -3.7038
  ),
  (
    'encontrada', 'Toby', 'Perro', 'Beagle',
    'Encontrado cerca del parque, sin collar. Bien cuidado.',
    null, 'Chapinero, Bogotá',
    current_date - interval '3 days', '573000000004', null, 'encontrada',
    4.7110, -74.0721
  ),
  (
    'encontrada', 'Simba', 'Gato', 'Naranja común',
    'Gato naranja de pelo corto, apareció en un patio del centro.',
    null, 'Providencia, Santiago',
    current_date - interval '4 days', '569000000005', null, 'encontrada',
    -33.4489, -70.6693
  ),
  (
    'perdida', 'Bella', 'Perro', 'Caniche',
    'Caniche blanca chiquita. Ya fue reunida con su familia.',
    null, 'Miraflores, Lima',
    current_date - interval '9 days', '519000000006', null, 'en_casa',
    -12.0464, -77.0428
  );

-- 6 reportes de ejemplo creados. ¡A buscar mascotas!
