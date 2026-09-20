const Reserva = require('../models/Reserva');

const obtenerReservas = async (req, res) => {
    try {
        const filtro = {};

        if (req.query.unidad_id) {
            filtro.unidad_id = req.query.unidad_id;
        }

        if (req.query.area_comun) {
            filtro.area_comun = req.query.area_comun;
        }

        const reservas = await Reserva.find(filtro);

        res.json(reservas);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las reservas'
        });
    }
};

const crearReserva = async (req, res) => {
    try {
        const reserva = new Reserva(req.body);

        await reserva.save();

        res.status(201).json(reserva);
    } catch (error) {
        res.status(400).json({
            error: 'Error al crear la reserva'
        });
    }
};

module.exports = {
    obtenerReservas,
    crearReserva
};