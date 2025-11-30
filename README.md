# Hub Manager - Gestor de Contraseñas y Accesos WP

Este proyecto es un **Hub Central** diseñado para gestionar el acceso seguro y centralizado a múltiples instalaciones de WordPress. Permite a los administradores iniciar sesión en diferentes tiendas sin necesidad de compartir contraseñas, utilizando un sistema de tokens seguros.

## 🚀 Arquitectura

El sistema se compone de tres partes principales:

1.  **Frontend (React + Vite)**: Interfaz de usuario moderna para visualizar las tiendas y gestionar accesos.
2.  **Backend (Node.js + Express)**: API que orquesta la seguridad, gestiona los datos de las tiendas y genera tokens de acceso.
3.  **Plugin WordPress**: Componente instalado en cada sitio WordPress que valida los tokens y permite el inicio de sesión remoto.

## ✨ Características Principales

-   **Dashboard de Tiendas**: Visualización de todas las tiendas conectadas con sus logos e imágenes de portada.
-   **Sincronización Dinámica**: El backend consulta a cada WordPress para mantener actualizados los metadatos (nombre, logo, imagen).
-   **Login Remoto Seguro**: Sistema de autenticación basado en tokens de un solo uso.
    -   El usuario hace clic en una tienda en el Hub.
    -   El Hub genera un token temporal.
    -   El usuario es redirigido al WordPress con el token.
    -   WordPress valida el token con el Hub y autentica al usuario.
-   **Prioridad de Imágenes**: Soporte para imágenes hardcodeadas en `stores.json` con fallback a imágenes dinámicas del plugin.

## 🛠️ Instalación y Configuración

### Requisitos Previos

-   Node.js (v18 o superior)
-   WordPress con el plugin "Hub Manager" instalado (ver `hub-manager-login.php`).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run dev
```

**Variables de Entorno (.env):**
-   `PORT`: Puerto del servidor (ej: 3000).
-   `JWT_SECRET`: Secreto para firmar tokens (si aplica).
-   `CORS_ORIGIN`: URL del frontend permitida.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configurar VITE_API_URL apuntando al backend
npm run dev
```

### 3. Integración WordPress

1.  Instala el plugin `hub-manager-login.php` en tu sitio WordPress.
2.  Crea un usuario administrador para el Hub (o usa uno existente).
3.  Genera una **Contraseña de Aplicación** para ese usuario en WordPress.
4.  Añade la tienda al archivo `backend/src/data/stores.json` con la URL y las credenciales.

## 📂 Estructura del Proyecto

```
hub-manager/
├── backend/            # API Node.js Express
│   ├── src/
│   │   ├── modules/    # Lógica de negocio (Stores, Tokens)
│   │   └── data/       # Persistencia JSON (stores.json)
│   └── server.js       # Punto de entrada
├── frontend/           # SPA React + Vite
│   ├── src/
│   │   ├── pages/      # Vistas (Stores, Login)
│   │   └── context/    # Estado global (Auth)
│   └── index.css       # Estilos globales
└── hub-manager-login.php # Plugin para WordPress
```

## 🔄 Flujo de Trabajo

1.  **Sincronización**: Al cargar, el backend consulta `/wp-json/filament/v1/stores` en cada tienda configurada.
2.  **Login**:
    -   Frontend solicita token a `POST /api/tokens/generate`.
    -   Backend genera token y devuelve URL de redirección: `https://tienda.com/wp-json/filament/v1/login?token=XYZ`.
    -   Frontend redirige al usuario.
    -   WordPress recibe token y consulta `GET /api/tokens/validate` al Backend.
    -   Si es válido, WordPress inicia sesión.

## 📝 Notas de Desarrollo

-   **Imágenes**: Si una tienda tiene una imagen definida en `stores.json`, esta tendrá prioridad sobre la imagen que devuelva el plugin.
-   **Seguridad**: Los tokens tienen un tiempo de expiración corto para evitar reutilización.
