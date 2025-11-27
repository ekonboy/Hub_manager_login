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

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));

// Endpoints
app.use('/api/stores', storeRoutes);
app.use('/api/tokens', tokenRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Hub Login Node funcionando!');
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
