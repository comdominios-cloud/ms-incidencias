const express = require('express');

const {
    obtenerReservas,
    crearReserva
} = require('../controllers/reservaController');

const router = express.Router();

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener reservas
 *     parameters:
 *       - in: query
 *         name: unidad_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: area_comun
 *         schema:
 *           type: string
 *           enum: [PARRILLA, SALON_EVENTOS, GIMNASIO, PISCINA, COWORKING]
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get('/', obtenerReservas);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidad_id
 *               - area_comun
 *               - fecha_inicio
 *               - fecha_fin
 *               - estado
 *             properties:
 *               unidad_id:
 *                 type: integer
 *               residente_id:
 *                 type: integer
 *               area_comun:
 *                 type: string
 *                 enum: [PARRILLA, SALON_EVENTOS, GIMNASIO, PISCINA, COWORKING]
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               num_personas:
 *                 type: integer
 *                 minimum: 1
 *               estado:
 *                 type: string
 *                 enum: [SOLICITADA, CONFIRMADA, CANCELADA, COMPLETADA]
 *               creado_en:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reserva creada
 *       400:
 *         description: Datos invalidos
 */
router.post('/', crearReserva);

module.exports = router;