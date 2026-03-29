# Snapshot técnico — v0.11

> Este archivo es el snapshot **vigente y versionado en la rama actual** (no una referencia externa).

Fecha de snapshot: 2026-03-29

## 1) Estado general del proyecto

El proyecto está en versión **v0.11** con foco en refactor de servicios HTTP hacia una base reutilizable (`BaseCrudService<T>`), según `VERSIONES.md`.

Arquitectura general:
- **Frontend**: Angular standalone components + Angular Material.
- **Estado local reactivo**: `BehaviorSubject` y `Observable` (RxJS).
- **Persistencia local**: `json-server` apuntando a `src/db.json`.
- **Dominios activos en esta versión**: `propietarios`, `inquilinos`, `inmuebles`.

## 2) Estructura de alto nivel

```text
src/
  app/
    core/
      http/
        base-crud.service.ts          # CRUD genérico + cache en BehaviorSubject
      navegacion/
        navegacionRutas.ts            # Tipo Dominio + interfaz de botones
        rutas-dinamicas.service.ts    # Dominio activo + botones de header
      modal/
      snackbar.service.ts

    features/
      propietario/
        propietario-rxjs.service.ts
        propietario-c/                # Listado + carga inicial
        crear-propietario/
        modals/                       # Ver, editar, eliminar
      inquilino/
        inquilino-rxjs.service.ts
        inquilino-c/
        crear-inquilino/
        modals/
      inmueble/
        inmuebles-rxjs.service.ts
        crear-inmueble/

    shared/
      form-dinamico/                  # Construcción de formularios por definición
      formulario-caracteristicas/     # ABM de definiciones por dominio
      definiciones-caracteristicas.service.ts
      entity-helpers.ts

  db.json                              # Datos de json-server
```

## 3) Mapa de navegación y dominio activo

El flujo de navegación está desacoplado en `RutasDinamicasService`:

1. **Sidebar** emite dominio (`propietarios` / `inquilinos` / `inmuebles`).
2. Servicio actualiza:
   - `dominioActivo$`
   - `arrayBotones$` (acciones visibles en header según dominio)
3. **Header** consume ambos observables y renderiza botones/rutas.
4. Router muestra componentes hijos (`lista`, `crear`, `def_caracteristicas`, etc).

### Rutas por dominio (v0.11)
- `propietarios`: `lista`, `crear`, `def_caracteristicas`
- `inquilinos`: `lista`, `crear`, `def_caracteristicas`
- `inmuebles`: `crear`, `def_caracteristicas`

## 4) Capa HTTP + estado RxJS

## 4.1 Base reusable

`BaseCrudService<T>` concentra patrón común:

- `lista$ = new BehaviorSubject<T[]>([])`
- `cargar()` => `GET endpoint` + `tap(next(lista$))`
- `obtenerLista()` => `lista$.asObservable()`
- `crear()` => `POST` + `switchMap(cargar)`
- `actualizar()` => `PUT /:id` + `switchMap(cargar)`
- `eliminar()` => `DELETE /:id` + `switchMap(cargar)`

Con esto, cada entidad hereda comportamiento y define solo endpoint.

## 4.2 Servicios por entidad

- `PropietarioRxjsService extends BaseCrudService<IPropietario>`
  - endpoint: `http://localhost:3000/propietarios`
- `InquilinoRxjsService extends BaseCrudService<IInquilino>`
  - endpoint: `http://localhost:3000/inquilinos`
- `InmueblesRxjsService extends BaseCrudService<IInmueble>`
  - endpoint: `http://localhost:3000/inmuebles`

## 4.3 Flujo de datos estándar (lista + creación/edición)

```mermaid
flowchart LR
  UI[Componente UI]
  SVC[Servicio RxJS de entidad]
  API[(json-server)]
  BS[(BehaviorSubject lista$)]

  UI -->|cargar()| SVC -->|GET| API
  API --> SVC -->|next(lista)| BS -->|obtenerLista()| UI

  UI -->|crear/actualizar/eliminar| SVC -->|POST/PUT/DELETE| API
  API --> SVC -->|switchMap(cargar)| API
```

## 5) Definiciones dinámicas de características

La personalización de atributos por dominio se maneja con `DefinicionesCaracteristicasService`.

### Responsabilidades del servicio

- Endpoint: `http://localhost:3000/definiciones`
- Mantiene `Map<Dominio, BehaviorSubject<DefinicionCaracteristica[]>>`
- Mantiene `idPorDominio` para decidir:
  - `POST` si no existe definición
  - `PATCH` si ya existe definición
- Carga inicial en constructor (`GET /definiciones`) y fan-out por dominio.

### Consumo en UI

1. `FormularioCaracteristicasComponent`
   - Escucha `dominioActivo$`.
   - Cambia lista de definiciones según dominio activo.
   - Guarda con `setDefiniciones(...)`.

2. `FormDinamicoComponent`
   - Recibe `@Input dominio`.
   - Se suscribe a `getDefiniciones$(dominio)`.
   - Construye `FormGroup` dinámico con validaciones según tipo/requerido.
   - Emite entidad `{ caracteristicas: [...] }` al componente padre.

## 6) Modelo actual en json-server (`src/db.json`)

Colecciones activas:
- `propietarios[]`
- `inquilinos[]`
- `inmuebles[]`
- `definiciones[]`

Relación implícita actual (MVP):
- Las entidades guardan `{ id, caracteristicas[] }`.
- No hay FK explícitas todavía entre propietario ⇄ inmueble ⇄ inquilino.
- La “relación” está preparada a nivel conceptual (docs de dominio), pero no normalizada en `db.json` aún.

## 7) Conexiones por entidad (v0.11)

## Propietarios
- Listado: `PropietarioCComponent` -> `obtenerLista()` + `cargar()`.
- Alta: `CrearPropietarioComponent` -> `crear(nuevoPropietario)`.
- Edición/Baja: modales -> `actualizar(...)` / `eliminar(...)`.

## Inquilinos
- Listado: `InquilinoCComponent` -> `obtenerLista()` + `cargar()`.
- Alta: `CrearInquilinoComponent` usa `FormDinamico`.
- Modales de ver/editar/eliminar equivalentes a propietarios.

## Inmuebles
- Alta: `CrearInmuebleComponent` usa `FormDinamico`.
- Servicio y endpoint definidos, sin pantalla de listado en rutas actuales.

## 8) Riesgos / observaciones técnicas detectadas

1. **Inconsistencia de API en alta de inquilinos**
   - `CrearInquilinoComponent` llama `crearInquilino(...)`, pero el servicio heredado expone `crear(...)`.
   - Esto puede romper compilación o runtime según estado local de archivos.

2. **Alta de inmuebles sin suscripción explícita**
   - En `CrearInmuebleComponent`, `this.inmueblesService.crear(nuevoInmueble);` no hace `subscribe()`.
   - En observables fríos de `HttpClient`, sin subscribe no ejecuta request.

3. **Dominio/entidades aún en etapa MVP flexible**
   - Fuerte desacople para formularios dinámicos y definiciones.
   - Falta aún consolidar relaciones de negocio (contratos, vínculos explícitos entre entidades).

## 9) Potencia actual para escalar en GitHub/repo

Con este estado, el repositorio ya tiene buenas bases para escalar:

- Patrón de CRUD genérico reutilizable (reduce duplicación por feature).
- Estado reactivo central por entidad (fácil de conectar con vistas nuevas).
- Definiciones de campos desacopladas (permite evolución sin tocar componentes de cada dominio).
- Navegación por dominio centralizada (agregar dominios nuevos es predecible).

Próximo salto recomendado (v0.12+):
- Consolidar tipado/firma de métodos por entidad (evitar divergencias `crear` vs `crearInquilino`).
- Añadir capa de repositorio/adaptador para mapear DTO <-> modelo de dominio.
- Introducir tests de integración de servicios RxJS + HttpTestingController.
- Definir relaciones explícitas entre entidades en `db.json` o migrar a backend real.
