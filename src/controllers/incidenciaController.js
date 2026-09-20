const Incidencia = require('../models/Incidencia');

const obtenerIncidencias = async (req, res) => {
    try {
        const filtro = {};

        if (req.query.unidad_id) {
            filtro.unidad_id = req.query.unidad_id;
        }

        if (req.query.estado) {
            filtro.estado = req.query.estado;
        }

        const incidencias = await Incidencia.find(filtro);

        res.json(incidencias);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las incidencias'
        });
    }
};

const obtenerIncidencia = async (req, res) => {
    try {
        const incidencia = await Incidencia.findById(req.params.id);

        if (!incidencia) {
            return res.status(404).json({
                error: 'Incidencia no encontrada'
            });
        }

        res.json(incidencia);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener la incidencia'
        });
    }
};

const crearIncidencia = async (req, res) => {
    try {
        const incidencia = new Incidencia(req.body);

        await incidencia.save();

        res.status(201).json(incidencia);
    } catch (error) {
        res.status(400).json({
            error: 'Error al crear la incidencia'
        });
    }
};

const actualizarEstado = async (req, res) => {
    try {
        const incidencia = await Incidencia.findByIdAndUpdate(
            req.params.id,
            {
                estado: req.body.estado,
                actualizado_en: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!incidencia) {
            return res.status(404).json({
                error: 'Incidencia no encontrada'
            });
        }

        res.json(incidencia);
    } catch (error) {
        res.status(400).json({
            error: 'Error al actualizar el estado'
        });
    }
};

const agregarComentario = async (req, res) => {
    try {
        const incidencia = await Incidencia.findById(req.params.id);

        if (!incidencia) {
            return res.status(404).json({
                error: 'Incidencia no encontrada'
            });
        }

        incidencia.comentarios.push({
            autor: req.body.autor,
            texto: req.body.texto,
            fecha: new Date()
        });

        incidencia.actualizado_en = new Date();

        await incidencia.save();

        res.status(201).json(incidencia);
    } catch (error) {
        res.status(400).json({
            error: 'Error al agregar el comentario'
        });
    }
};

module.exports = {
    obtenerIncidencias,
    obtenerIncidencia,
    crearIncidencia,
    actualizarEstado,
    agregarComentario
};