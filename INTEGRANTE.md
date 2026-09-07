# Integrante responsable

| | |
|---|---|
| **Repositorio** | `ms-incidencias` |
| **Integrante** | [@fabianbot1331](https://github.com/fabianbot1331) |
| **Rol** | API con base de datos (lenguaje por definir / MongoDB) |
| **Puerto** | 9003 publicado, 3003 interno |

## Alcance

`ms-incidencias`: incidencias/reclamos y reservas de areas comunes, sobre MongoDB.

> ### Lenguaje pendiente de decision
>
> El andamiaje actual es **Node.js + Express**, provisional. Al elegir:
>
> - **No puede ser Python ni Java**: ya los usan `ms-residentes` y `ms-pagos`, y
>   el curso exige 3 lenguajes distintos entre las APIs con base de datos.
> - La base se mantiene en **MongoDB**: es la unica NoSQL del proyecto.
> - El puerto publicado sigue siendo el **9003** (el interno puede cambiar) y la
>   documentacion en **Swagger-UI**.
>
> Opciones validas: Node.js/Express, Go, C#/.NET, Ruby, PHP, Kotlin, Rust.
>
> ### Tu data alimenta el analisis
>
> La coleccion `reservas` es la fuente del requerimiento del ACL de predecir
> **que area comun sera la mas visitada el proximo mes**. Los campos
> `area_comun` y `fecha_inicio` no pueden faltar.

## Avance del 50% — entrega del 6 al 12 de septiembre

- [ ] **Elegir el lenguaje** y rehacer el andamiaje si no es Node.js
- [ ] Contenedor de **MongoDB 27017** levantado en la VM de base de datos, con volumen — coordinar con @Brisseth-raton, es uno de los 3 contenedores de esa maquina
- [ ] Colecciones `incidencias` y `reservas` ([docs/schema.json](docs/schema.json))
- [ ] Algo de data cargada
- [ ] Microservicio publicado en el puerto **9003**

> No entra en el minimo del avance del 50% (piden 2 microservicios y ya estan
> cubiertos), pero el contenedor de Mongo si forma parte de la VM de base de datos.

---

## Como trabajamos

Cada repositorio pertenece a un integrante y se desarrolla de forma
**independiente**: las APIs con base de datos no se llaman entre si. La unica
integracion entre microservicios vive en `ms-ficha-residente`, y la del lado del
usuario en `web-condominio`.

Los cambios a este repositorio los define su responsable. Si otro integrante
necesita algo de esta API, se pide via issue en vez de tocar el codigo.

## Equipo

| Repositorio | Integrante | Rol | Puerto |
|---|---|---|---|
| [ms-residentes](https://github.com/comdominios-cloud/ms-residentes) | @Osomar1705 | API con BD - Python / PostgreSQL | 9001 |
| [ms-pagos](https://github.com/comdominios-cloud/ms-pagos) | @sebastianperez72 | API con BD - Java / MySQL | 9002 |
| [ms-incidencias](https://github.com/comdominios-cloud/ms-incidencias) | @fabianbot1331 | API con BD - lenguaje por definir / MongoDB | 9003 |
| [ms-ficha-residente](https://github.com/comdominios-cloud/ms-ficha-residente) | @Brisseth-raton | Backend / Infraestructura | 9004 |
| [web-condominio](https://github.com/comdominios-cloud/web-condominio) | @alxgr-08 | Frontend / Amplify | 5173 (dev) |
| [ms-analitico](https://github.com/comdominios-cloud/ms-analitico) | @carloscondor1610 | Data Science | 9005 |
| [ingesta-datos](https://github.com/comdominios-cloud/ingesta-datos) | @carloscondor1610 | Data Science | — |

> CS2032 Cloud Computing - UTEC | Sistema de Administracion de Condominios
