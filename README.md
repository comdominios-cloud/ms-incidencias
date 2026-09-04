# ms-incidencias

Microservicio de **incidencias/reclamos y reservas de areas comunes** del
Sistema de Administracion de Condominios.

> CS2032 Cloud Computing - UTEC | Proyecto: Sistema de Administracion de Condominios

## Responsable

Integrante a cargo de **API con BD #3**. Este repositorio es **autonomo**: se
desarrolla, prueba y despliega sin depender del avance de los demas
microservicios.

## Dominio

Registra los reclamos que levantan los residentes (plomeria, electricidad,
ascensor, seguridad...) junto con su historial de comentarios, y administra las
reservas de las areas comunes del condominio (parrilla, salon de eventos,
gimnasio, piscina, coworking).

La informacion es naturalmente **semiestructurada**: cada incidencia embebe su
propio hilo de comentarios en el mismo documento, por eso la base es NoSQL.

`unidad_id` y `residente_id` se guardan como **identificadores logicos** (el id
que tiene ese registro en ms-residentes). Este microservicio **no llama** a
ningun otro: el cruce entre servicios lo resuelve **ms-ficha-residente**.

```
web-condominio ──> API Gateway ──> ms-incidencias ──> MongoDB
                                         ^
                                         └── ms-ficha-residente (consume esta API)
```

## Stack

| Elemento    | Tecnologia                     |
|-------------|--------------------------------|
| Lenguaje    | Node.js 20 (JavaScript)        |
| Framework   | Express 4                      |
| Base de datos | MongoDB 7 (NoSQL documental) |
| ODM         | Mongoose                       |
| Documentacion | Swagger-UI en `/docs` (swagger-jsdoc + swagger-ui-express) |
| Contenedor  | Docker                         |

**Colecciones:** `incidencias` (con comentarios embebidos) y `reservas`.
Ver [docs/schema.json](docs/schema.json) y [docs/der.md](docs/der.md).

## Puerto asignado

**8003**

| Microservicio       | Puerto |
|---------------------|--------|
| ms-residentes       | 8001   |
| ms-pagos            | 8002   |
| ms-incidencias      | **8003** |
| ms-ficha-residente  | 8004   |
| ms-analitico        | 8005   |
| web-condominio (dev)| 5173   |

## Endpoints REST planificados

> Andamiaje: aun no implementados.

| # | Metodo | Ruta | Descripcion | Consumido por |
|---|--------|------|-------------|---------------|
| 1 | `GET`  | `/incidencias?unidad_id=&estado=` | Lista incidencias filtrables | **frontend** |
| 2 | `GET`  | `/incidencias/{id}` | Detalle de una incidencia con sus comentarios | frontend |
| 3 | `POST` | `/incidencias` | Registra una nueva incidencia | frontend |
| 4 | `PATCH`| `/incidencias/{id}/estado` | Cambia el estado de la incidencia | frontend |
| 5 | `POST` | `/incidencias/{id}/comentarios` | Agrega un comentario al hilo | frontend |
| 6 | `GET`  | `/reservas?unidad_id=&area_comun=` | Lista reservas de areas comunes | **frontend** |
| 7 | `POST` | `/reservas` | Crea una reserva de area comun | frontend |
| 8 | `GET`  | `/health` | Health check del servicio | infra |

Los dos endpoints que consume directamente el **frontend** son
`GET /incidencias` y `GET /reservas`.

Documentacion interactiva: `http://localhost:8003/docs` (Swagger-UI).

## Variables de entorno

Copiar [.env.example](.env.example) a `.env` y completar. **Nunca** commitear `.env`.

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `APP_NAME` | Nombre del servicio | `ms-incidencias` |
| `PORT` | Puerto de escucha | `8003` |
| `NODE_ENV` | Entorno de ejecucion | `development` / `production` |
| `LOG_LEVEL` | Nivel de logging | `info` |
| `MONGO_HOST` | Host de MongoDB | `mongo` (nombre del servicio en Compose) |
| `MONGO_PORT` | Puerto de MongoDB | `27017` |
| `MONGO_DB` | Nombre de la base | `condominio_incidencias` |
| `MONGO_USER` | Usuario de la base | *(sin valor en el repo)* |
| `MONGO_PASSWORD` | Password del usuario | *(sin valor en el repo)* |
| `MONGO_URI` | Cadena de conexion completa | `mongodb://mongo:27017/condominio_incidencias` |

## Como levantar con Docker

### Solo el microservicio

```bash
cp .env.example .env      # completar credenciales
docker build -t ms-incidencias .
docker run --rm -p 8003:8003 --env-file .env ms-incidencias
```

Luego abrir `http://localhost:8003/docs`.

### Con MongoDB incluido (docker compose)

```yaml
services:
  mongo:
    image: mongo:7
    environment:
      MONGO_INITDB_DATABASE: ${MONGO_DB}
    ports: ["27017:27017"]
    volumes:
      - mongo_data:/data/db

  ms-incidencias:
    build: .
    ports: ["8003:8003"]
    env_file: .env
    depends_on: [mongo]

volumes:
  mongo_data:
```

```bash
docker compose up --build
```

## Estructura

```
src/
├── index.js       # servidor Express (stub)
├── routes/        # definicion de rutas
├── controllers/   # handlers
├── models/        # esquemas Mongoose
├── config/        # conexion a MongoDB, Swagger
└── middlewares/   # errores, validacion
docs/
├── der.md              # modelo de datos (placeholder)
├── schema.json         # esquema inicial de las colecciones
└── seed_fake_data.js   # carga masiva de 20,000 documentos (placeholder)
tests/
```

## Estado

Andamiaje inicial. Sin rutas ni logica de negocio implementadas.
