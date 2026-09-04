/**
 * Punto de entrada de ms-incidencias.
 *
 * ANDAMIAJE: solo levanta el servidor Express y expone Swagger-UI.
 * Rutas, modelos y logica de negocio se implementan mas adelante.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-incidencias' });
});

// TODO: conectar a MongoDB desde src/config/
// TODO: montar los routers de src/routes/
// TODO: montar Swagger-UI en /docs con swagger-jsdoc + swagger-ui-express

app.listen(PORT, () => {
  console.log(`ms-incidencias escuchando en el puerto ${PORT}`);
});

module.exports = app;
