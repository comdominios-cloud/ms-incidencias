require('dotenv').config();

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Incidencia = require('../src/models/Incidencia');
const Reserva = require('../src/models/Reserva');

const TOTAL_INCIDENCIAS = 20000;
const TOTAL_RESERVAS = 20000;

const categorias = [
    'PLOMERIA',
    'ELECTRICIDAD',
    'LIMPIEZA',
    'SEGURIDAD',
    'ASCENSOR',
    'OTRO'
];

const prioridades = [
    'BAJA',
    'MEDIA',
    'ALTA'
];

const estadosIncidencia = [
    'ABIERTA',
    'EN_PROCESO',
    'RESUELTA',
    'CERRADA'
];

const areasComunes = [
    'PARRILLA',
    'SALON_EVENTOS',
    'GIMNASIO',
    'PISCINA',
    'COWORKING'
];

const estadosReserva = [
    'SOLICITADA',
    'CONFIRMADA',
    'CANCELADA',
    'COMPLETADA'
];

const generarIncidencia = () => {
    const creadoEn = faker.date.between({
        from: '2026-01-01',
        to: '2026-09-18'
    });

    return {
        unidad_id: faker.number.int({
            min: 1,
            max: 500
        }),

        residente_id: faker.number.int({
            min: 1,
            max: 2000
        }),

        titulo: faker.lorem.words({
            min: 3,
            max: 8
        }),

        descripcion: faker.lorem.sentences({
            min: 1,
            max: 3
        }),

        categoria: faker.helpers.arrayElement(categorias),

        prioridad: faker.helpers.arrayElement(prioridades),

        estado: faker.helpers.arrayElement(estadosIncidencia),

        comentarios: [],

        creado_en: creadoEn,

        actualizado_en: faker.date.between({
            from: creadoEn,
            to: new Date()
        })
    };
};

const generarReserva = () => {
    const fechaInicio = faker.date.between({
        from: '2026-01-01',
        to: '2026-12-31'
    });

    const fechaFin = new Date(fechaInicio);

    fechaFin.setHours(
        fechaFin.getHours() +
        faker.number.int({
            min: 1,
            max: 6
        })
    );

    return {
        unidad_id: faker.number.int({
            min: 1,
            max: 500
        }),

        residente_id: faker.number.int({
            min: 1,
            max: 2000
        }),

        area_comun: faker.helpers.arrayElement(areasComunes),

        fecha_inicio: fechaInicio,

        fecha_fin: fechaFin,

        num_personas: faker.number.int({
            min: 1,
            max: 50
        }),

        estado: faker.helpers.arrayElement(estadosReserva),

        creado_en: faker.date.between({
            from: '2026-01-01',
            to: fechaInicio
        })
    };
};

const cargarDatos = async () => {
    try {
        const uri =
            `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

        console.log('Conectando a MongoDB...');

        await mongoose.connect(uri);

        console.log('Conectado a MongoDB');

        console.log('Eliminando datos anteriores...');

        await Incidencia.deleteMany({});
        await Reserva.deleteMany({});

        console.log('Generando 20,000 incidencias...');

        const incidencias = [];

        for (let i = 0; i < TOTAL_INCIDENCIAS; i++) {
            incidencias.push(generarIncidencia());
        }

        console.log('Insertando incidencias...');

        await Incidencia.insertMany(incidencias);

        console.log(`${TOTAL_INCIDENCIAS} incidencias insertadas`);

        console.log('Generando 20,000 reservas...');

        const reservas = [];

        for (let i = 0; i < TOTAL_RESERVAS; i++) {
            reservas.push(generarReserva());
        }

        console.log('Insertando reservas...');

        await Reserva.insertMany(reservas);

        console.log(`${TOTAL_RESERVAS} reservas insertadas`);

        const cantidadIncidencias =
            await Incidencia.countDocuments();

        const cantidadReservas =
            await Reserva.countDocuments();

        console.log('');
        console.log('Carga finalizada');
        console.log(`Incidencias: ${cantidadIncidencias}`);
        console.log(`Reservas: ${cantidadReservas}`);
        console.log(`Total: ${cantidadIncidencias + cantidadReservas}`);

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {
        console.error(
            'Error cargando datos:',
            error
        );

        await mongoose.disconnect();

        process.exit(1);
    }
};

cargarDatos();