const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
    {
        unidad_id: {
            type: Number,
            required: true
        },

        residente_id: {
            type: Number
        },

        area_comun: {
            type: String,
            required: true,
            enum: [
                "PARRILLA",
                "SALON_EVENTOS",
                "GIMNASIO",
                "PISCINA",
                "COWORKING"
            ]
        },

        fecha_inicio: {
            type: Date,
            required: true
        },

        fecha_fin: {
            type: Date,
            required: true
        },

        num_personas: {
            type: Number,
            min: 1
        },

        estado: {
            type: String,
            required: true,
            enum: [
                "SOLICITADA",
                "CONFIRMADA",
                "CANCELADA",
                "COMPLETADA"
            ]
        },

        creado_en: {
            type: Date,
            required: true
        }
    }
);
reservaSchema.index({ unidad_id: 1 });
reservaSchema.index({ area_comun: 1, fecha_inicio: 1 });
module.exports = mongoose.model("Reserva", reservaSchema);