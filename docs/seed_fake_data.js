/**
 * Carga masiva de datos fake para ms-incidencias.
 *
 * PLACEHOLDER. Objetivo del curso: insertar al menos 20,000 documentos
 * distribuidos entre las colecciones `incidencias` y `reservas`.
 *
 * Uso previsto:
 *     npm run seed
 *
 * Dependencias sugeridas: @faker-js/faker, mongoose (o el driver mongodb).
 */

const TOTAL_DOCUMENTOS = 20000;

async function main() {
  // TODO: 1. Leer MONGO_URI desde variables de entorno.
  // TODO: 2. Conectar a MongoDB y aplicar los $jsonSchema de docs/schema.json.
  // TODO: 3. Generar incidencias con su arreglo embebido de comentarios.
  // TODO: 4. Generar reservas de areas comunes sin solapamiento de horarios.
  // TODO: 5. Insertar por lotes (insertMany) hasta completar TOTAL_DOCUMENTOS.
  throw new Error('Pendiente de implementar en la fase de carga de datos.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
