# Registro de Cambios

## [Sin versionar] - 2026-05-08

### Características nuevas
- Implementación de lista reactiva de notificaciones en el header con `@for` y `async` pipe
- Animación de entrada (`fadeInScale`) para badges de notificaciones
- Tooltips con mensaje y fecha en cada notificación
- Indicadores visuales por estado (pendiente/vencida) con colores diferenciados

### Cambios técnicos

#### `src/app/features/notificaciones/notificaciones.service.ts`
**Modificado:**
- `cargarLista()`: Cambiado de `void` a retornar `Observable<INotificacion[]>` usando `toObservable(this.$lista)` para reactividad completa
- Eliminada variable `$listaNotificaciones` (redundante)
- Lógica simplificada: carga inicial si `$lista` está vacío, luego retorna el observable del signal

**Eliminado:**
- Uso de `firstValueFrom` (ya no se convierte a Promise)
- Estructura `async/await` anterior

#### `src/app/layout/head/head.component.ts`
**Modificado:**
- Eliminada implementación de `OnInit` y método `ngOnInit` (ya no necesario reactivamente)
- Cambiado `listaNotificaciones: INotificacion[]` por `listaNotificaciones$!: Observable<INotificacion[]>`
- Asignación directa en constructor: `this.listaNotificaciones$ = this._notificacionesService.cargarLista()`
- Limpiada importación de `NotificacionesComponent` (ya no se usa en `imports`)

#### `src/app/layout/head/head.component.html`
**Modificado:**
- Eliminadas dos instancias hardcodeadas de `<app-notificaciones></app-notificaciones>`
- Implementado `@for (notificacion of listaNotificaciones$ | async; track notificacion.id)` para renderizado reactivo
- Cada notificación muestra badge circular con icono condicional: `⏰` (vencimiento) o `📌` (recordatorio)
- Añadido `title` con mensaje y fecha formateada para tooltip nativo

#### `src/app/layout/head/head.component.scss`
**Modificado:**
- Estilos completos para `.notificacion-badge`: 40px circular, transiciones hover, colores por estado
- Estados `.pendiente` (borde `$warning`) y `.vencida` (borde `$error`)
- Animación `@keyframes fadeInScale` de entrada: opacidad 0→1, translateY(-8px)→0, scale(0.85)→1
- Refactor del layout del header: padding, sombra, alineación mejorada
- Tipografía ajustada y espaciado consistente en fecha

### Notas técnicas
- El enfoque usa **Observables + `async` pipe** que es el patrón recomendado en Angular para suscripciones automáticas y desuscripción al destruir componente
- Al crear una notificación, `BaseCrudService.crear()` ejecuta `cargar()` que actualiza el `signal $lista`, `toObservable` emite y el `@for` renderiza inmediatamente
- Se mantiene compatibilidad con la interface `INotificacion` existente
