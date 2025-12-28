# MVP Inmobiliaria

Aplicación web desarrollada en **Angular** orientada a la gestión de entidades del dominio inmobiliario. El proyecto se concibe como un **MVP técnico**, con foco en arquitectura, claridad de responsabilidades y modelado consciente del estado.

---

## 🧰 Stack técnico

* **Angular CLI**: 18.2.20
* **Angular Material**: 18.2.14 (MDC)
* **Node**: 22.18
* **npm**: 10.9.3
* **Estilos globales**: `styles.scss` (paleta de colores y overrides de Material)

---

## 🎯 Objetivo del proyecto

Este proyecto no busca únicamente implementar funcionalidades, sino:

* Retomar Angular desde una mirada más madura
* Practicar **arquitectura por features**
* Utilizar **RxJS como modelador de estado**
* Reducir lógica en componentes
* Dejar registro explícito de decisiones técnicas

Es un paso intermedio antes de una posible adopción de NgRx.

---

## 🧩 Arquitectura general

```
src/app
├── core/                 # Servicios transversales
├── layout/               # Estructura base (header, sidebar, main)
├── features/             # Entidades del dominio
│   ├── propietario/      # Feature más avanzado
│   ├── inquilino/
│   ├── inmueble/
│   └── contrato/
└── shared/               # Componentes reutilizables
```

---

## 🧠 Gestión de estado (RxJS)

La entidad **Propietario** ya cuenta con un CRUD completo y gestión de estado reactiva:

* Estado interno mediante `BehaviorSubject<Propietario[]>`
* Exposición pública solo a través de `Observable`
* Métodos que actúan como *acciones* (create / update / delete)
* Componentes desacoplados de la lógica

Servicio principal:

* `propietario-rxjs.service`

> Nota: existen getters/setters del array que actualmente no se utilizan (pendiente de depuración).

---

## 🧱 Feature: Propietarios

### Componentes

* **Formulario de creación**
  `propietario/formulario-propietario`
  → Create del CRUD

* **Listado**
  `propietario/propietario-c`
  → Renderiza `card-list` (shared)

* **Item de propietario**
  `propietario/item-propietario`
  → Representación individual dentro de la lista

### Modales (Angular Material Dialog)

Ruta: `propietario/modals`

* `ver-info-propietario` → vista de solo lectura
* `editar-propietario` → edición
* `eliminar-propietario` → eliminación

Todos los modales interactúan con el servicio RxJS del feature.

---

## 🎨 UI y Feedback

* **Angular Material** como base de UI
* `MatDialog` para modales
* `MatSnackBar` para feedback de acciones y errores
* Snackbars personalizados mediante `panelClass` y estilos MDC

Objetivo: evitar dependencia de la consola para feedback de usuario.

---

## 🔁 Shared

En `src/app/shared`:

* **card-list**
  Renderiza listas genéricas de entidades (idea: desacoplar visualización del dominio)

* **modal**
  Componente base que:

  * Define el layout del modal
  * Recibe el contenido dinámico vía `MAT_DIALOG_DATA`
  * Acepta opcionalmente un objeto de configuración

---

## 🛣️ Rutas actuales

* `/propietario`
* `/inquilino`
* `/formulario/propietario`

> Pendiente: unificar rutas del feature Propietarios bajo una estructura más coherente.

---

## 📌 Estado actual

* [x] Estructura base del proyecto
* [x] CRUD de Propietarios
* [x] RxJS por feature
* [x] Feedback con Snackbar
* [ ] Unificación y mejora de rutas
* [ ] Mejorar estilos del `card-list`
* [ ] Tests

---

## 🧾 Anotaciones de proceso

### 29/11

Declaración de entidades y relaciones:

* **Inquilino**: id, nombre, DNI, teléfono, email, garante, ingresos, domicilio actual
* **Propietario**: id, nombre, DNI, email, teléfono, domicilio, CBU
* **Inmueble**: id, dirección, tipo, metros cuadrados, ambientes, estado, idPropietario
* **Contrato**: id, idInquilino, idPropietario, idInmueble, fechas, precio, depósito, observaciones

### 24/12

* CRUD de Propietarios funcional
* Integración de RxJS
* Incorporación de Snackbars
* Necesidad detectada de reorganizar rutas

---

## 📄 Notas finales

Este README se mantiene como **documento vivo** y registro del proceso técnico y conceptual del proyecto.
