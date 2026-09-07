# ms-incidencias

Microservicio de **incidencias/reclamos y reservas de areas comunes** del
Sistema de Administracion de Condominios.

> CS2032 Cloud Computing - UTEC | Proyecto: Sistema de Administracion de Condominios

## Responsable

[@fabianbot1331](https://github.com/fabianbot1331) — API con base de datos. **Lenguaje por definir**: el andamiaje Node.js/Express es provisional. Ver [INTEGRANTE.md](INTEGRANTE.md).

Integrante a cargo de **API con BD #3**. Este repositorio es **autonomo**: se
desarrolla, prueba y despliega sin depender del avance de los demas
microservicios.

## Lenguaje pendiente

El andamiaje actual es **Node.js + Express**, a modo provisional: el responsable
aun no eligio el lenguaje. No puede ser **Python ni Java** (ya los usan
ms-residentes y ms-pagos, y el curso exige 3 lenguajes distintos) y la base debe
seguir siendo **MongoDB**, la unica NoSQL del proyecto. Detalle en
[INTEGRANTE.md](INTEGRANTE.md).

## Dominio

Registra los reclamos que levantan los residentes (plomeria, electricidad,
ascensor, seguridad...) junto con su historial de comentarios, y administra las
reservas de las areas comunes del condominio (parrilla, salon de eventos,
gimnasio, piscina, coworking).

> **Las reservas alimentan el analisis de datos.** El requerimiento de predecir
> que area comun sera la mas visitada el proximo mes se calcula en `ms-analitico`
> a partir de esta coleccion, via `ingesta03` -> S3 -> Glue -> Athena. Por eso
> `area_comun` y `fecha_inicio` no pueden faltar en el documento.

La informacion es naturalmente **semiestructurada**: cada incidencia embebe su
propio hilo de comentarios en el mismo documento, por eso la base es NoSQL.

`unidad_id` y `residente_id` se guardan como **identificadores logicos** (el id
que tiene ese registro en ms-residentes). Este microservicio **no llama** a
ningun otro: el cruce entre servicios lo resuelve **ms-ficha-residente**.

```
web-condominio ──> balanceador ──> ms-incidencias :9003 ──> MongoDB :27017
                                          ^                 (VM de base de datos)
                                          ├── ms-ficha-residente (consume esta API)
                                          └── ingesta03 (lee la BD y la vuelca a S3)
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

**9003** publicado · **3003** dentro del contenedor.

El curso asigno el rango **9000-12000** para los microservicios; ese es el puerto
que se habilita en el Security Group.

| Microservicio | Publicado | Interno |
|---------------|-----------|---------|
| ms-residentes | 9001      | 8000    |
| ms-pagos      | 9002      | 8080    |
| ms-incidencias| **9003**  | 3003    |
| ms-ficha-residente | 9004 | 8004    |
| ms-analitico  | 9005      | 8005    |
| web-condominio (dev) | 5173 | —     |

Las bases de datos **no** entran en ese rango: PostgreSQL 5432, MySQL 3306,
MongoDB 27017, alcanzables solo desde los Security Groups de la VM de produccion
y la VM de ingesta.

> Si se cambia el lenguaje del microservicio, el puerto interno puede cambiar:
> el que **no** cambia es el publicado, el **9003**.

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

Documentacion interactiva: `http://<ip-vm-produccion>:9003/docs` (Swagger-UI).

## Variables de entorno

Copiar [.env.example](.env.example) a `.env` y completar. **Nunca** commitear `.env`.

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `APP_NAME` | Nombre del servicio | `ms-incidencias` |
| `PORT` | Puerto dentro del contenedor | `3003` |
| `PUBLISHED_PORT` | Puerto publicado en la VM | `9003` |
| `NODE_ENV` | Entorno de ejecucion | `development` / `production` |
| `LOG_LEVEL` | Nivel de logging | `info` |
| `MONGO_HOST` | IP privada de la VM de base de datos | *(sin valor en el repo)* |
| `MONGO_PORT` | Puerto de MongoDB | `27017` |
| `MONGO_DB` | Nombre de la base | `condominio_incidencias` |
| `MONGO_USER` | Usuario de la base | *(sin valor en el repo)* |
| `MONGO_PASSWORD` | Password del usuario | *(sin valor en el repo)* |
| `MONGO_URI` | Cadena de conexion completa | `mongodb://<ip-vm-bd>:27017/condominio_incidencias` |

## Como levantar con Docker

### Solo el microservicio

```bash
cp .env.example .env      # completar credenciales
docker build -t ms-incidencias .
docker run --rm -p 9003:3003 --env-file .env ms-incidencias
```

Luego abrir `http://localhost:9003/docs`.

### Con MongoDB incluido (desarrollo local)

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
    ports: ["9003:3003"]
    env_file: .env
    depends_on: [mongo]

volumes:
  mongo_data:
```

```bash
docker compose up --build
```

### En AWS

MongoDB corre como contenedor en la **VM de base de datos** (uno de los 3
contenedores de esa maquina) y el microservicio en la **VM de produccion**, asi
que `MONGO_HOST` apunta a la **IP privada** de la VM de base de datos.

La imagen se publica en **Docker Hub** para que las 2 VM de produccion gemelas
hagan `pull` de la misma version.

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
