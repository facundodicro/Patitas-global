# 🐾 Patitas

Red solidaria para mascotas perdidas en cualquier ciudad. Un tablón comunitario con mapa para publicar y buscar animales perdidos o encontrados, más placas QR para el collar que enlazan directo al WhatsApp del dueño.

## Stack

- **Vite** + **React 19**
- **Tailwind CSS 3**
- **react-router** (navegación)
- **react-leaflet** (mapa)
- **Supabase** (auth + base de datos + storage, opcional)
- **lucide** (íconos)

## Estructura

```
patitas/
├── src/
│   ├── components/   # UI compartida (botones, tarjetas, mapa, etc.)
│   ├── pages/        # Vistas: inicio, tablón, detalle, publicar, mis mascotas, login…
│   ├── lib/          # Cliente de Supabase y helpers
│   └── store/        # Estado global (funciona con o sin Supabase)
├── supabase/
│   ├── schema.sql    # Tablas, RLS y bucket — para pegar en el SQL Editor
│   └── seed.sql      # Datos de ejemplo repartidos por el mundo
├── .env.example      # Plantilla de variables de entorno
├── SUPABASE.md       # Cómo conectar Supabase paso a paso
└── DEPLOY.md         # Cómo publicar en GitHub y Vercel
```

## Cómo correrla

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run build
npm run preview   # previsualizá el build localmente
```

## Variables de entorno

Copiá la plantilla y completala con tus datos:

```bash
cp .env.example .env
```

| Variable                | Para qué sirve                                          |
|-------------------------|----------------------------------------------------------|
| `VITE_SUPABASE_URL`     | URL de tu proyecto en Supabase                           |
| `VITE_SUPABASE_ANON_KEY`| Clave pública (anon) de tu proyecto                      |
| `VITE_ADMIN_EMAILS`     | Tu email (separados por coma si son varios) para el rol admin |
| `VITE_DONATE_WHATSAPP`  | Tu número de WhatsApp para el botón "Donar"/"Agradecer" (formato wa.me, sin `+`; ej: `5492262123456`) |

### Botón "Donar" / "Agradecer"

La app incluye un botón cálido que abre un **modal de donación** con dos opciones:

1. **Donar con Mercado Pago**: muestra tu alias con botón "Copiar alias"
   (feedback "¡Copiado!") y la ayuda "Pegá este alias en la app de Mercado Pago
   para donar". Esta opción **se oculta automáticamente** si no configuraste un
   alias real, para no mostrar datos falsos.
2. **Agradecer por WhatsApp**: abre tu WhatsApp con el mensaje pre-cargado
   "Hola, quiero agradecer a Patitas".

Aparece en el footer, en la ficha pública de cada mascota (`/m/:id`) y cuando
un reporte se marca como "En casa" en el panel admin.

Todo se configura en **un solo lugar**: [`src/lib/config.js`](./src/lib/config.js)
- `DONATE_MP_ALIAS` (ejemplo: `"patitas.donaciones.mp"`) → reemplazalo por tu
  alias real de Mercado Pago.
- `DONATE_WHATSAPP` (ejemplo: `"5490000000000"`) → reemplazalo por tu número
  (formato wa.me, sin `+` ni espacios).

O definí las variables de entorno `VITE_DONATE_MP_ALIAS` y
`VITE_DONATE_WHATSAPP` (en el `.env` o en Vercel), que tienen prioridad sobre
los valores del archivo.

## Modo demo

¿No tenés Supabase configurado todavía? No pasa nada: **sin esas variables la app corre en modo demo local**, con datos de ejemplo guardados en tu navegador. Ideal para probarla, diseñar y mostrarla antes de conectar la base real. Cuando conectes Supabase, el login y los datos pasan a ser reales automáticamente.

## Documentación

- [SUPABASE.md](./SUPABASE.md) — Conectar Supabase: schema, seed, storage y login con Google.
- [DEPLOY.md](./DEPLOY.md) — Publicar el proyecto en GitHub y Vercel.
