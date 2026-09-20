const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema(
    {
        autor: {
            type: String,
            required: true
        },
        texto: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            required: true
        }
    },
    {
        _id: false
    }
);

const incidenciaSchema = new mongoose.Schema(
    {
        unidad_id: {
            type: Number,
            required: true
        },

        residente_id: {
            type: Number
        },

        titulo: {
            type: String,
            required: true,
            maxlength: 160
        },

        descripcion: {
            type: String
        },

        categoria: {
            type: String,
            required: true,
            enum: [
                "PLOMERIA",
                "ELECTRICIDAD",
                "LIMPIEZA",
                "SEGURIDAD",
                "ASCENSOR",
                "OTRO"
            ]
        },

        prioridad: {
            type: String,
            enum: [
                "BAJA",
                "MEDIA",
                "ALTA"
            ]
        },

        estado: {
            type: String,
            required: true,
            enum: [
                "ABIERTA",
                "EN_PROCESO",
                "RESUELTA",
                "CERRADA"
            ]
        },

        comentarios: {
            type: [comentarioSchema],
            default: []
        },

        creado_en: {
            type: Date,
            required: true
        },

        actualizado_en: {
            type: Date
        }
    }
);

incidenciaSchema.index({ unidad_id: 1 });
incidenciaSchema.index({ estado: 1, creado_en: -1 });

module.exports = mongoose.model("Incidencia", incidenciaSchema);