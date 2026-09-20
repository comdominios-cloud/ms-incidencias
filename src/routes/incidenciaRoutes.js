const express = require('express');

const {
    obtenerIncidencias,
    obtenerIncidencia,
    crearIncidencia,
    actualizarEstado,
    agregarComentario
} = require('../controllers/incidenciaController');

const router = express.Router();

/**
 * @swagger
 * /incidencias:
 *   get:
 *     summary: Obtener incidencias
 *     parameters:
 *       - in: query
 *         name: unidad_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ABIERTA, EN_PROCESO, RESUELTA, CERRADA]
 *     responses:
 *       200:
 *         description: Lista de incidencias
 */
router.get('/', obtenerIncidencias);

/**
 * @swagger
 * /incidencias/{id}:
 *   get:
 *     summary: Obtener una incidencia por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Incidencia encontrada
 *       404:
 *         description: Incidencia no encontrada
 */
router.get('/:id', obtenerIncidencia);

/**
 * @swagger
 * /incidencias:
 *   post:
 *     summary: Crear una incidencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidad_id
 *               - titulo
 *               - categoria
 *               - estado
 *               - creado_en
 *             properties:
 *               unidad_id:
 *                 type: integer
 *               residente_id:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *                 enum: [PLOMERIA, ELECTRICIDAD, LIMPIEZA, SEGURIDAD, ASCENSOR, OTRO]
 *               prioridad:
 *                 type: string
 *                 enum: [BAJA, MEDIA, ALTA]
 *               estado:
 *                 type: string
 *                 enum: [ABIERTA, EN_PROCESO, RESUELTA, CERRADA]
 *               creado_en:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Incidencia creada
 *       400:
 *         description: Datos invalidos
 */
router.post('/', crearIncidencia);

/**
 * @swagger
 * /incidencias/{id}/estado:
 *   patch:
 *     summary: Actualizar estado de una incidencia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [ABIERTA, EN_PROCESO, RESUELTA, CERRADA]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Incidencia no encontrada
 */
router.patch('/:id/estado', actualizarEstado);

/**
 * @swagger
 * /incidencias/{id}/comentarios:
 *   post:
 *     summary: Agregar comentario a una incidencia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - autor
 *               - texto
 *             properties:
 *               autor:
 *                 type: string
 *               texto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario agregado
 *       404:
 *         description: Incidencia no encontrada
 */
router.post('/:id/comentarios', agregarComentario);

module.exports = router;