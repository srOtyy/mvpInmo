# MVP Inmobiliaria

## Visión general

Este proyecto es un gestor inmobiliario pensado como una capa operativa para administrar el ciclo completo de un alquiler desde su origen hasta la resolución de la relación contractual.

La idea central del sistema es que el contrato funcione como el núcleo del dominio. No es un simple formulario o listado, sino la entidad que conecta los actores y los hechos relevantes del negocio:
- Propietario
- Inmueble
- Inquilino
- Contrato
- Liquidación
- Garantías
- Notificaciones

En otras palabras, el sistema no está pensado como “un CRUD de inmuebles”, sino como un motor de gestión de relaciones inmobiliarias donde el contrato organiza la realidad del negocio.

## Nexo conceptual del sistema

El centro del dominio es el objeto `Contrato`.

A partir de él, se derivan y se coordinan las decisiones operativas del negocio:

Propietario + Inmueble + Inquilino
          |
          v
       Contrato
          |
    +-----+----------------------+
    |                          |
    v                          v
Liquidaciones            Notificaciones
    |
    v
Vencimientos, pagos, seguimiento y continuidad operativa

El contrato se convierte en la fuente de verdad para:
- definir quién ocupa qué inmueble
- establecer la vigencia temporal
- asociar al inquilino con el inmueble
- vincular al propietario con la relación locativa
- activar liquidaciones, vencimientos y eventos derivados

## Qué problema resuelve este MVP

El producto busca ordenar la gestión diaria de una inmobiliaria sin depender de procesos manuales, dispersos o fragmentados.

Se encarga de centralizar información clave de:

- propietarios
- inmuebles
- inquilinos
- contratos
- garantías
- liquidaciones
- notificaciones

Y especialmente ayuda con tareas repetitivas como:
- organizar contratos por estado, titular, inmueble y vigencia
- filtrar y consultar activos, vencidos, próximos a vencer o finalizados
- mantener la relación de ocupación inmuebles/inquilinos coherente
- preparar la base para eventos de negocio como vencimientos o liquidaciones
- reducir la carga operativa de administrar un alto volumen de datos sin perder contexto

## Modelo de dominio principal

El MVP está modelado alrededor de estas entidades:

### 1. Propietario
Representa a la persona o entidad legal dueña del inmueble. Es el actor que aporta la propiedad y define la relación locativa.

### 2. Inmueble
Es la unidad física o patrimonial que se pone en alquiler o se gestiona dentro del sistema. El inmueble es el objeto sobre el cual recae la relación contractual.

### 3. Inquilino
Es quien ocupa o va a ocupar el inmueble bajo un contrato. Su información se vincula directamente con la vigencia del alquiler y con el ciclo de la relación contractual.

### 4. Contrato
Es el corazón del sistema.
Define:
- inmueble asociado
- propietario asociado
- inquilino asociado
- fechas de vigencia
- monto y condiciones
- estado de la relación
- contexto legal y operativo del alquiler

El contrato no es solo un documento; es el eje que ordena la operación inmobiliaria.

### 5. Liquidación
Una vez que el contrato existe, el sistema puede derivar el cálculo y seguimiento de los movimientos asociados a ese ciclo: impuestos, comisiones, pagos, rendimientos u otros conceptos derivados del negocio.

### 6. Garantías
Representan la seguridad o respaldo asociado a la relación contractual. Se usan para reforzar la consistencia del negocio y evitar estados inconsistente de riesgo.

### 7. Notificaciones
Se trata de la capa de alertas y seguimiento. El objetivo es avisar sobre vencimientos, cambios de estado, eventos relevantes o tareas pendientes.

## Estado del MVP

Este proyecto aún está en una fase de gestión funcional y de base de negocio. La arquitectura está pensada para crecer, pero el foco no es “la UI por sí misma”, sino la lógica de negocio y la coherencia de los datos.

El sistema está orientado a:
- manejar datos inmobiliarios con un modelo claro
- centralizar la lógica de contratos y relaciones
- permitir la evolución gradual de nuevas funcionalidades
- mantener el dominio separable de la capa de presentación

## Stack principal

El proyecto está basado en Angular y en un conjunto de herramientas orientadas a productividad y gestión de datos:

- Angular
- TypeScript
- Angular Material
- RxJS
- HTML / SCSS
- JSON Server para mock y persistencia local
- npm / scripts de automatización
- dependencias auxiliares para exportación, documentos y numeración

Además, la estructura del código está pensada para reutilizar lógica con servicios, abstracciones y componentes reutilizables, con foco en gestión de datos y flujo de negocio más que en visualización ornamental.

## Flujo conceptual

```text
Propietario ─┐
             ├──> Contrato ──> Liquidación
Inmueble ────┤
             ├──> Contrato ──> Notificaciones
Inquilino ───┘
                 │
                 └──> Garantías / seguimiento / vigencia
```

O sea, el negocio se mueve alrededor de la relación contractual, y todo lo demás deriva de ahí.

## Qué hace el MVP en práctica

El sistema está pensado para que una inmobiliaria pueda:

- registrar y consultar propietarios
- gestionar inmuebles y su disponibilidad
- registrar inquilinos
- crear y mantener contratos
- consultar contratos por estado o vigencia
- organizar la información a partir de filtros y listados
- derivar liquidaciones y alertas desde la lógica del contrato
- preparar la base para crecimiento funcional sin romper el dominio

El foco está en la organización y consistencia de la información, no en una interfaz de marketing.

## Estructura general del repositorio

```text
mvpInmo/
├── src/
│   └── app/
│       ├── features/
│       │   ├── contrato
│       │   ├── inmueble
│       │   ├── inquilino
│       │   ├── propietario
│       │   ├── liquidacion
│       │   ├── garantes
│       │   └── notificaciones
│       ├── core
│       ├── shared
│       ├── layout
│       └── pipes
├── data/
│   ├── db.json
│   ├── db.template.json
│   └── db - prueba.json
├── docs/
│   ├── dominio
│   └── diagramas
├── public/
├── angular.json
├── package.json
├── README.md
├── VERSIONES.md
├── ABRIR.bat
├── BUSCAR_ACTUALIZACIONES.bat
├── IMPORTAR.bat
├── EXPORTAR.bat
└── ...
```

## Cómo correr el proyecto

Requisitos:
- Node.js
- npm
- Git

Instalación:

```bash
npm install
```

Inicio del proyecto:

```bash
npm start
```

Esto levanta tanto el frontend como la API local. En este repo, el backend está servido con `json-server` sobre `data/db.json`.

## Scripts útiles del proyecto

### ABRIR.bat
Abre el proyecto y ejecuta:

```bat
npm start
```

Sirve para iniciar el sistema rápidamente en Windows.

### BUSCAR_ACTUALIZACIONES.bat
Ejecuta:

```bat
git pull
npm install
```

Sirve para actualizar el repo y traer dependencias nuevas.

### IMPORTAR.bat
Busca un archivo `D:\db.json` y lo copia dentro del proyecto en:

```text
data\db.json
```

Sirve para importar una base de datos desde un pendrive o una copia externa.

### EXPORTAR.bat
Copia la base local actual hacia una ubicación externa:

```text
data\db.json -> D:\db.json
```

Sirve para hacer respaldo o exportar la base de datos.

## Observaciones de diseño

Este proyecto está pensado como una base operativa y extensible:
- el dominio inmobiliario está centralizado
- el contrato es la fuente principal de verdad
- la lógica se puede expandir sin romper el modelo
- la UI es una capa sobre datos y reglas de negocio
- está preparado para crecer hacia nuevas funcionalidades del negocio

## Estado de evolución

Este MVP está en una etapa donde el objetivo principal es:
- definir bien el modelo de negocio
- estabilizar la gestión de contratos y relaciones
- preparar la lógica del dominio para futuras extensiones
- mantener la base operativa clara y suficiente para seguir construyendo

## Resumen corto

El sistema es un gestor inmobiliario orientado a contratos. El contrato es el centro del dominio y conecta el conjunto de actores y procesos de negocio. A partir de esa entidad se deriva la gestión de inmuebles, inquilinos, propietarios, liquidaciones, garantías y notificaciones.

En síntesis: es una base para gestionar la operación inmobiliaria con coherencia, trazabilidad y posibilidad de crecimiento.
