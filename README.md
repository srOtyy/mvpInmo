# MVP Inmobiliaria

Aplicación web en **Angular** orientada a la gestión de entidades del dominio inmobiliario.
Este proyecto funciona como un **MVP técnico y bitácora de proceso**, con foco en decisiones de arquitectura, organización del código y modelado consciente del estado.

---

## 🎯 Enfoque

* Trabajo **por entidad (feature-based)**
* Repetición consciente de patrones (listas, formularios, modales)
* RxJS como herramienta principal de manejo de estado
* Componentes livianos, lógica concentrada en servicios
* UI funcional, depurada progresivamente

---

## 🧩 Arquitectura (actual)

```
src/app
├── core/        # Servicios transversales (ej: snackbar)
├── features/    # Entidades del dominio
│   └── propietario/  # Feature más avanzado
├── shared/      # Componentes reutilizables
└── layout/      # Estructura base de la app
```

La aplicación se organiza por **features**, donde cada entidad concentra:

* componentes
* servicios RxJS
* modales

`core` se reserva para lógica transversal y `shared` se construye a medida que aparecen patrones reutilizables.

---

## 🧠 Estado y lógica

* Cada entidad gestiona su estado mediante **servicios RxJS**
* Uso de `BehaviorSubject` + `Observable`
* Los métodos del servicio funcionan como acciones (create / update / delete)
* Pendiente de revisión: getters/setters no utilizados en el servicio de propietarios

---

## 🧱 Estado actual del proyecto

* Servicio de **Snackbar** incorporado en `core` para:

  * feedback al usuario
  * reemplazar el uso de consola como canal principal

* CRUD de **Propietarios** funcional (pendiente de validación final)

* Inconsistencias detectadas en rutas (listas vs formularios)

---

## 🔜 Próximos pasos

* Unificar rutas por entidad de forma coherente
* Implementar CRUD de **Inmuebles** reutilizando el patrón de Propietarios
* Depurar UI
* Detectar y extraer componentes repetidos a `shared`

---

## 📌 Decisiones tomadas

* Enfocarme en una entidad a la vez
* Consolidar un patrón completo antes de replicarlo
* Priorizar claridad y repetición consciente por sobre abstracción temprana

---

> Este README se mantiene intencionalmente corto y actúa como registro del estado real del proyecto y de las decisiones técnicas tomadas.
