# Publicar en GitHub y Vercel

Cómo subir Patitas a GitHub y publicarla gratis en Vercel.

## 1. Inicializá el repositorio local

En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Patitas: rebuild inicial"
```

## 2. Creá el repo en GitHub

Entrá a [github.com](https://github.com), creá un repositorio nuevo (por ejemplo `patitas`) **sin** marcar las opciones de README, .gitignore ni licencia — el código ya está en tu máquina.

## 3. Conectá y subí el código

```bash
git branch -M main
git remote add origin https://github.com/tu-usuario/patitas.git
git push -u origin main
```

(Reemplazá `tu-usuario` por tu usuario de GitHub.)

## 4. Importalo en Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión (podés usar tu cuenta de GitHub).
2. **Add New → Project** e importá el repositorio `patitas`.

## 5. Configurá el framework

El **Framework Preset** debería detectarse solo como **Vite**. Si no, seleccionalo manualmente. No hace falta tocar nada más del build.

## 6. Agregá las variables de entorno

En la pantalla de configuración del proyecto, sección **Environment Variables**, agregá las 3:

| Variable                | Valor                                    |
|-------------------------|------------------------------------------|
| `VITE_SUPABASE_URL`     | La URL de tu proyecto en Supabase        |
| `VITE_SUPABASE_ANON_KEY`| La anon public key de tu proyecto        |
| `VITE_ADMIN_EMAILS`     | Tu email (para el rol admin)             |

Usá los mismos valores que tenés en tu `.env` local.

## 7. Deploy

Apretá **Deploy** y esperá a que termine. Vercel te va a dar una URL pública (algo como `patitas.vercel.app`) donde ya podés ver la app funcionando. 🎉

## 8. Actualizaciones

Cada vez que hagas `git push` a la rama `main`, Vercel redeploya automáticamente. No tenés que hacer nada más.

## Notas

- **No necesitás Google AI Studio para nada** en este flujo: el proyecto ya está reconstruido acá.
- El comando de build es `npm run build` y la salida queda en la carpeta `dist` (Vercel lo maneja solo con el preset de Vite).
- Nunca subas tu archivo `.env` a GitHub: las claves van solo en las Environment Variables de Vercel.
