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

---

## 🧱 Estado actual del proyecto

* Se creó un servicio en el `core` para el **header**, la idea es que el header renderice ciertos botones segun la ruta o componente en el q estemos
Tengo la duda de si desde el .ts puedo acceder a la ruta para poder ahorrar en rutas
La idea es que el header acceda a la ruta en la que estamos y obtenga como variable la ruta. Asi los botones pueden hacer un routerLink asi: {{rutaActual}}/crear 
Esto evita tener q crear 2 array de botones, y solo crear uno generico que despliegue los demas componentes para con cada entidad 

* CRUD de **Propietarios** funcional (pendiente de validación final)


---

## 🔜 Próximos pasos

* Implementar utilidad al **header**
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
