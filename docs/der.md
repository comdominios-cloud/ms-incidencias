# Modelo de datos — ms-incidencias

Base: **MongoDB 7** · `condominio_incidencias`

Al ser una base **NoSQL orientada a documentos** no hay un ER clasico: no
existen claves foraneas ni joins. Lo que se documenta es la forma de cada
coleccion y que campos la relacionan con las demas.

```mermaid
erDiagram
    INCIDENCIAS ||--o{ COMENTARIOS : "embebe"
    INCIDENCIAS }o--o| RESERVAS : "misma unidad_id"

    INCIDENCIAS {
        ObjectId _id PK
        int unidad_id "requerido, indexado"
        int residente_id "opcional"
        string titulo "requerido, max 160"
        string descripcion
        string categoria "PLOMERIA | ELECTRICIDAD | LIMPIEZA | SEGURIDAD | ASCENSOR | OTRO"
        string prioridad "BAJA | MEDIA | ALTA"
        string estado "ABIERTA | EN_PROCESO | RESUELTA | CERRADA"
        array comentarios "subdocumentos embebidos"
        date creado_en "requerido"
        date actualizado_en
    }

    COMENTARIOS {
        string autor "requerido"
        string texto "requerido"
        date fecha "requerido"
    }

    RESERVAS {
        ObjectId _id PK
        int unidad_id "requerido, indexado"
        int residente_id "opcional"
        string area_comun "PARRILLA | SALON_EVENTOS | GIMNASIO | PISCINA | COWORKING"
        date fecha_inicio "requerido"
        date fecha_fin "requerido"
        int num_personas "minimo 1"
        string estado "SOLICITADA | CONFIRMADA | CANCELADA | COMPLETADA"
        date creado_en "requerido"
    }
```

## Las dos colecciones

| Coleccion | Que guarda |
|-----------|------------|
| `incidencias` | Reclamos y averias reportadas por los residentes, con su historial de comentarios embebido. |
| `reservas` | Reservas de areas comunes: parrilla, salon de eventos, gimnasio, piscina y coworking. |

Ambas se relacionan por `unidad_id`: son los reclamos y las reservas de una
misma unidad. Esa relacion, mas la de `incidencias` con sus `comentarios`
embebidos, es la que cumple el requisito del curso de tener al menos dos
colecciones relacionadas.

## Por que los comentarios van embebidos

Un comentario **no tiene sentido fuera de su incidencia**: nunca se consulta
suelto, siempre se lee junto al reclamo que lo origino. Guardarlo en una
coleccion aparte obligaria a hacer un `$lookup` en cada lectura. Embebido, la
incidencia completa se trae en una sola operacion.

Los subdocumentos se declaran con `_id: false`, porque no necesitan
identificador propio.

## Indices

| Coleccion | Indice | Para que |
|-----------|--------|----------|
| `incidencias` | `{ unidad_id: 1 }` | Listar los reclamos de una unidad. |
| `incidencias` | `{ estado: 1, creado_en: -1 }` | El tablero de reclamos abiertos, mas recientes primero. |
| `reservas` | `{ unidad_id: 1 }` | Listar las reservas de una unidad. |
| `reservas` | `{ area_comun: 1, fecha_inicio: 1 }` | Ver la agenda de un area comun. |

## Frontera con los otros microservicios

`unidad_id` y `residente_id` son **identificadores logicos** hacia
`ms-residentes`: no hay llamada HTTP a ese microservicio. Cada base es
autonoma, y MongoDB no puede verificar una referencia que esta fuera de su
alcance.

El cruce entre bases lo resuelven **ms-ficha-residente** (en linea) y
**Athena** (en diferido, sobre los datos ya volcados a S3).

El esquema de validacion de MongoDB esta en [schema.json](schema.json), y los
modelos de Mongoose que lo implementan en `src/models/`.
