require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// después de const app = express();



// Rutas absolutas
const storeRoutes = require(path.join(__dirname, 'src', 'routes', 'store.routes'));
const tokenRoutes = require(path.join(__dirname, 'src', 'routes', 'token.routes'));
const authRoutes = require(path.join(__dirname, 'src', 'routes', 'auth.routes'));
const authMiddleware = require(path.join(__dirname, 'src', 'middleware', 'auth.middleware'));

const app = express();
// app.use(cors());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://frontend-phi-blush.vercel.app"   // tu frontend en Vercel
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/stores', authMiddleware, storeRoutes);
app.use('/api/tokens', tokenRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Hub Login Node funcionando!');
});

// Levantar servidor
// Levantar servidor solo si no es un entorno serverless (opcional, o para local)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
