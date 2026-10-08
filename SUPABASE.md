# Conectar Supabase

Supabase le da a Patitas login real de usuarios, base de datos y almacenamiento de fotos. Es opcional: sin configurarlo la app anda en modo demo. Seguí estos pasos para conectarla.

## 1. Creá tu cuenta y proyecto

Entrá a [supabase.com](https://supabase.com), creá una cuenta gratis y creá un proyecto nuevo. Cuando te pida la región, elegí la más cercana (por ejemplo **São Paulo**) para que ande más rápido desde Argentina.

## 2. Creá las tablas

1. En el panel de Supabase, abrí **SQL Editor**.
2. Abrí una pestaña nueva.
3. Pegá todo el contenido de `supabase/schema.sql` y ejecutalo (botón **Run**).

Esto crea las tablas `profiles`, `pets`, `reports` y `ads`, habilita Row Level Security con políticas permisivas de demo, y crea el bucket de fotos.

## 3. Cargá datos de ejemplo (opcional)

1. En el SQL Editor, abrí otra pestaña nueva.
2. Pegá el contenido de `supabase/seed.sql` y ejecutalo.

Te deja 6 reportes de ejemplo repartidos por el mundo para ver cómo se ve el tablón y el mapa. Los podés borrar cuando quieras desde la propia app.

## 4. Verificá el Storage

Andá a **Storage** en el panel lateral y confirmá que existe el bucket público **"pet-photos"**. El schema ya lo crea solo, así que normalmente no tenés que hacer nada más acá.

## 5. (Opcional) Login con Google

Para habilitar el botón "Continuar con Google":

1. Andá a **Authentication → Providers** y activá **Google**.
2. Conseguí un **Client ID** y **Client Secret** desde [Google Cloud Console](https://console.cloud.google.com) (creás credenciales OAuth 2.0 para app web).
3. Pegá esos valores en la configuración del provider y guardá.

## 6. Copiá las claves a tu `.env`

1. En Supabase andá a **Project Settings → API**.
2. Copiá el **Project URL** y la **anon public key**.
3. En la carpeta del proyecto, copiá `.env.example` a `.env` y completalo:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_ADMIN_EMAILS=tu-email@ejemplo.com
```

En `VITE_ADMIN_EMAILS` poné tu email (o varios separados por coma): esos usuarios van a tener rol de administrador en la app.

## 7. Reiniciá el servidor de desarrollo

```bash
npm run dev
```

Entrá a la app, registrate o iniciá sesión, y probá publicar un reporte. Si aparece en el tablón, ¡está todo conectado! 🎉

## 8. En Vercel

Cuando la publiques (ver [DEPLOY.md](./DEPLOY.md)), agregá las mismas 3 variables en **Settings → Environment Variables** de tu proyecto en Vercel, con los mismos valores de tu `.env`.

## Nota sobre seguridad

Las políticas RLS incluidas en `schema.sql` son **permisivas a propósito** para que la demo funcione sin fricción (lectura pública, escritura para usuarios autenticados). Si la app crece o va a manejar datos reales de muchas personas, conviene endurecerlas: limitar qué se puede leer públicamente, restringir borrados a un rol admin, o validar los datos antes de guardarlos.
