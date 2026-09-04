# Modelo de datos - ms-incidencias (MongoDB)

> PLACEHOLDER. Reemplazar este archivo (o agregar `der.png` / `der.drawio`)
> con el diagrama definitivo antes de la primera entrega.

Al ser una base **NoSQL orientada a documentos**, no hay un ER clasico: se
documentan las colecciones y la forma de sus documentos.

## Colecciones previstas

- **incidencias**: reclamos y averias reportadas por los residentes.
  Cada documento embebe su historial de comentarios (`comentarios[]`), evitando
  un join.
- **reservas**: reservas de areas comunes (parrilla, salon, gimnasio, piscina).

## Relacion entre colecciones

```
incidencias ──(unidad_id / residente_id)── reservas
```

Ambas colecciones guardan `unidad_id` y `residente_id` como **identificadores
logicos**: son los ids que tiene ese registro en ms-residentes, pero no hay
llamada HTTP a ese microservicio. El cruce lo hace **ms-ficha-residente**.

## Forma de los documentos

Ver [schema.json](schema.json) (esquema de validacion de MongoDB).

## Imagen

<!-- ![Modelo de datos](der.png) -->
