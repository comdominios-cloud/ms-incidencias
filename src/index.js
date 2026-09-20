/**
 * Punto de entrada de ms-incidencias.
 *
 * ANDAMIAJE: solo levanta el servidor Express y expone Swagger-UI.
 * Rutas, modelos y logica de negocio se implementan mas adelante.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const incidenciaRoutes = require('./routes/incidenciaRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use('/incidencias', incidenciaRoutes);
app.use('/reservas', reservaRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-incidencias' });
});
// TODO: montar Swagger-UI en /docs con swagger-jsdoc + swagger-ui-express
connectDB();
app.listen(PORT, () => {
  console.log(`ms-incidencias escuchando en el puerto ${PORT}`);
});

module.exports = app;
