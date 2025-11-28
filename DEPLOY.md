# Guía de Despliegue en Vercel

Este proyecto está preparado para ser desplegado en Vercel. Dado que tienes un frontend (React/Vite) y un backend (Node/Express) en carpetas separadas, la mejor estrategia es desplegarlos como dos proyectos vinculados en Vercel.

## Opción 1: Desde GitHub (Recomendado)

Sube este repositorio a tu GitHub. Luego ve a tu dashboard de Vercel y añade un "New Project".

### 1. Desplegar el Backend
1. Importa el repositorio desde GitHub.
2. En "Root Directory", selecciona `backend`.
3. Vercel detectará la configuración automáticamente gracias al archivo `vercel.json`.
4. **IMPORTANTE**: Antes de hacer deploy, ve a **Environment Variables** y añade:
   - **Name**: `JWT_SECRET`
   - **Value**: Una clave secreta aleatoria (ej: `mi-clave-super-secreta-123456`)
5. Haz clic en **Deploy**.
5. Una vez desplegado, copia la URL del dominio (ej: `https://tu-backend.vercel.app`).

### 2. Desplegar el Frontend
1. Vuelve a importar el **mismo repositorio** desde GitHub para crear un segundo proyecto.
2. En "Root Directory", selecciona `frontend`.
3. En "Framework Preset", debería detectar **Vite**.
4. Despliega la sección **Environment Variables** y añade:
   - **Name**: `VITE_API_URL`
   - **Value**: La URL de tu backend (ej: `https://tu-backend.vercel.app/api`) **Importante**: Añade `/api` al final si tus rutas empiezan por ahí.
5. Haz clic en **Deploy**.

## Opción 2: Subida Manual (Vercel CLI)

Si tienes instalado Vercel CLI (`npm i -g vercel`), puedes desplegar desde la terminal:

### Backend
```bash
cd backend
vercel
```
Sigue las instrucciones.

### Frontend
```bash
cd frontend
vercel
```
Cuando te pregunte por variables de entorno, configúralas en el dashboard de Vercel o mediante el CLI.

## Notas
- **Base de Datos**: Asegúrate de que tu base de datos (MySQL según `package.json`) sea accesible desde internet (Vercel IP addresses) y configura las variables de entorno necesarias en el proyecto del Backend en Vercel (`DB_HOST`, `DB_USER`, etc.).
