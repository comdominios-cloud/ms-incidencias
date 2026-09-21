/**
 * Carga masiva de datos ficticios para ms-incidencias (MongoDB).
 *
 * El curso pide minimo 20,000 registros en al menos una coleccion de cada
 * base. Aca la coleccion masiva es `incidencias`, y se generan tambien las
 * `reservas`, que son las que alimentan la prediccion de areas comunes de
 * ms-analitico.
 *
 * Uso:
 *     npm run seed
 *     node docs/seed_fake_data.js --total 50000
 *     node docs/seed_fake_data.js --limpiar
 *
 * Lee MONGO_URI y MONGO_DB del entorno o del .env.
 *
 * Dependencias:
 *     npm install --save-dev @faker-js/faker
 */

require('dotenv').config();

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Incidencia = require('../src/models/Incidencia');
const Reserva = require('../src/models/Reserva');

const TOTAL_POR_DEFECTO = 20000;
const LOTE = 5000;
const UNIDADES = 8000;
const RESIDENTES = 20000;

// Una reserva por cada dos incidencias: suficiente para que la prediccion
// tenga serie, sin duplicar el volumen.
const PROPORCION_RESERVAS = 0.5;

const CATEGORIAS = ['PLOMERIA', 'ELECTRICIDAD', 'LIMPIEZA', 'SEGURIDAD', 'ASCENSOR', 'OTRO'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA'];
const ESTADOS_INCIDENCIA = ['ABIERTA', 'EN_PROCESO', 'RESUELTA', 'CERRADA'];
const AREAS = ['PARRILLA', 'SALON_EVENTOS', 'GIMNASIO', 'PISCINA', 'COWORKING'];
const ESTADOS_RESERVA = ['SOLICITADA', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];

const TITULOS = {
    PLOMERIA: ['Fuga en el bano', 'Cano roto en la cocina', 'Presion de agua baja', 'Desague tapado'],
    ELECTRICIDAD: ['Corte de luz en el pasillo', 'Tomacorriente sin corriente', 'Luminaria quemada'],
    LIMPIEZA: ['Basura acumulada', 'Pasillo sin limpiar', 'Contenedores desbordados'],
    SEGURIDAD: ['Porton que no cierra', 'Camara fuera de servicio', 'Intercomunicador sin senal'],
    ASCENSOR: ['Ascensor detenido', 'Puerta que no abre', 'Ruido extrano en la cabina'],
    OTRO: ['Consulta general', 'Solicitud de mantenimiento', 'Reclamo por ruidos'],
};

faker.seed(2026);

function elegir(lista, pesos) {
    if (!pesos) return faker.helpers.arrayElement(lista);
    return faker.helpers.weightedArrayElement(
        lista.map((value, i) => ({ value, weight: pesos[i] }))
    );
}

function fechaEnLosUltimos(dias) {
    return faker.date.recent({ days: dias });
}

function generarIncidencia() {
    const categoria = elegir(CATEGORIAS, [25, 20, 15, 12, 10, 18]);
    const estado = elegir(ESTADOS_INCIDENCIA, [25, 20, 40, 15]);
    const creado = fechaEnLosUltimos(730);

    // Las incidencias resueltas suelen tener mas comentarios que las abiertas.
    const cantidadComentarios =
        estado === 'RESUELTA' || estado === 'CERRADA'
            ? faker.number.int({ min: 1, max: 4 })
            : faker.number.int({ min: 0, max: 2 });

    const comentarios = Array.from({ length: cantidadComentarios }, () => ({
        autor: faker.person.fullName(),
        texto: faker.lorem.sentence(),
        fecha: faker.date.between({ from: creado, to: new Date() }),
    }));

    return {
        unidad_id: faker.number.int({ min: 1, max: UNIDADES }),
        residente_id: Math.random() > 0.1
            ? faker.number.int({ min: 1, max: RESIDENTES })
            : undefined,
        titulo: faker.helpers.arrayElement(TITULOS[categoria]),
        descripcion: faker.lorem.paragraph(),
        categoria,
        prioridad: elegir(PRIORIDADES, [40, 40, 20]),
        estado,
        comentarios,
        creado_en: creado,
        actualizado_en: comentarios.length
            ? comentarios[comentarios.length - 1].fecha
            : creado,
    };
}

function generarReserva() {
    // Las areas no se usan por igual: la parrilla y el gimnasio concentran
    // mas reservas. Sin esa diferencia, la prediccion no distingue nada.
    const area = elegir(AREAS, [30, 15, 25, 20, 10]);
    const inicio = faker.date.between({
        from: new Date(Date.now() - 730 * 24 * 3600 * 1000),
        to: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    });
    const horas = faker.number.int({ min: 1, max: 6 });

    return {
        unidad_id: faker.number.int({ min: 1, max: UNIDADES }),
        residente_id: Math.random() > 0.1
            ? faker.number.int({ min: 1, max: RESIDENTES })
            : undefined,
        area_comun: area,
        fecha_inicio: inicio,
        fecha_fin: new Date(inicio.getTime() + horas * 3600 * 1000),
        num_personas: faker.number.int({ min: 1, max: 25 }),
        estado: elegir(ESTADOS_RESERVA, [15, 35, 15, 35]),
        creado_en: faker.date.recent({ days: 60, refDate: inicio }),
    };
}

async function insertarPorLotes(modelo, generar, total, etiqueta) {
    let insertados = 0;

    while (insertados < total) {
        const cantidad = Math.min(LOTE, total - insertados);
        const lote = Array.from({ length: cantidad }, generar);

        // ordered:false permite que Mongo siga con el resto si un documento
        // falla, en vez de cortar el lote entero.
        await modelo.insertMany(lote, { ordered: false });

        insertados += cantidad;
        process.stdout.write(`  ${etiqueta}: ${insertados.toLocaleString()} / ${total.toLocaleString()}\r`);
    }

    console.log(`  ${etiqueta}: ${insertados.toLocaleString()} insertadas          `);
}

async function main() {
    const args = process.argv.slice(2);
    const limpiar = args.includes('--limpiar');
    const indiceTotal = args.indexOf('--total');
    const total = indiceTotal >= 0 ? parseInt(args[indiceTotal + 1], 10) : TOTAL_POR_DEFECTO;

    if (!Number.isInteger(total) || total <= 0) {
        console.error('El valor de --total debe ser un entero positivo');
        process.exit(1);
    }

    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('Falta configurar MONGO_URI');
        process.exit(1);
    }

    const totalReservas = Math.round(total * PROPORCION_RESERVAS);
    console.log(`Generando ${total.toLocaleString()} incidencias y ${totalReservas.toLocaleString()} reservas`);

    await mongoose.connect(uri, { dbName: process.env.MONGO_DB });

    try {
        if (limpiar) {
            await Incidencia.deleteMany({});
            await Reserva.deleteMany({});
            console.log('  Colecciones vaciadas');
        } else {
            const existentes = await Incidencia.countDocuments();
            if (existentes) {
                console.log(`  Aviso: ya hay ${existentes.toLocaleString()} incidencias. Se agregan encima.`);
            }
        }

        await insertarPorLotes(Incidencia, generarIncidencia, total, 'incidencias');
        await insertarPorLotes(Reserva, generarReserva, totalReservas, 'reservas   ');

        const [i, r] = await Promise.all([
            Incidencia.countDocuments(),
            Reserva.countDocuments(),
        ]);
        console.log(`\nTotales: incidencias ${i.toLocaleString()} | reservas ${r.toLocaleString()}`);
    } finally {
        await mongoose.disconnect();
    }
}

main().catch((error) => {
    console.error('\nFallo la carga:', error.message);
    process.exit(1);
});
