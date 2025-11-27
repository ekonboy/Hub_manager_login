# Hub Login Node (Prueba local)

Este proyecto es un prototipo de **HUB de login remoto** usando Node + Express y archivos JSON como “base de datos” temporal.  
Permite generar tokens para login remoto en WordPress (plugin WP pendiente de instalar).

## Estructura

```
hub-login/
├─ backend/          <-- antes era la raíz
│   ├─ node_modules/
│   ├─ package.json
│   ├─ server.js
│   ├─ src/
│   │   ├─ config/
│   │   ├─ modules/
│   │   │   ├─ stores/
│   │   │   └─ tokens/
│   │   ├─ routes/
│   │   └─ utils/
│   └─ data/
│       ├─ stores.json
│       └─ tokens.json
└─ frontend/

```

---

## 1️⃣ Ejecutar servidor

```bash
npm install
npm run dev
```


```
POST:
http://localhost:3000/api/tokens/create
{
  "userId": 1,
  "storeId": 123
}

RESPUESTA:
{
  "message": "Token creado",
  "token": {
    "token": "89feebe41bd4e0a1719a41a1cc695de3329d34c48b7f096fdb9fe39c7c7996e1",
    "userId": 1,
    "storeId": 123,
    "expiresAt": "2025-11-26T17:19:26.647Z"
  }
}
```




```
{
  "token": "1e7ba53b9d1a3aafd3ca942411099f72a8fe2c5cf0cea5f29fc53812b57b6c29"
}

RESPUESTA:
{
  "message": "Token válido",
  "token": {
    "valid": true,
    "token": "1e7ba53b9d1a3aafd3ca942411099f72a8fe2c5cf0cea5f29fc53812b57b6c29",
    "userId": 6,
    "storeId": 123,
    "expiresAt": "2025-11-27T10:23:17.621Z"
  }
}
```


http://localhost:3000/api/tokens/89feebe41bd4e0a1719a41a1cc695de3329d34c48b7f096fdb9fe39c7c7996e1
```

RESPUESTA:
{
  "message": "Token eliminado correctamente"
}
```


```

http://localhost:3000/api/tokens?expired=false

RESPUESTA:
{
  "tokens": [
    {
      "token": "1e7ba53b9d1a3aafd3ca942411099f72a8fe2c5cf0cea5f29fc53812b57b6c29",
      "userId": 6,
      "storeId": 123,
      "expiresAt": "2025-11-27T10:23:17.621Z"
    },
    {
      "token": "06ecba8ae74d57f54f693c5bbe69c34ca4eb2378a75ee3e9904b79579648ae64",
      "userId": 9,
      "storeId": 1231,
      "expiresAt": "2025-11-27T10:56:25.721Z"
    }
  ]
}


```




POST /api/tokens/create → crea token

POST /api/tokens/validate → valida token

GET /api/tokens → lista todos los tokens (útil para debug)

DELETE /api/tokens/:token → elimina token




### react

hub-login/
├─ backend/          <-- Tu Node/Express actual
│   ├─ server.js
│   ├─ src/
│   └─ data/
├─ frontend/         <-- Nuevo React + Vite
│   ├─ index.html
│   ├─ package.json
│   ├─ vite.config.js
│   └─ src/
│       ├─ App.jsx
│       ├─ index.jsx
│       ├─ components/
│       └─ services/
└─ package.json      <-- opcional, solo si quieres scripts raíz
