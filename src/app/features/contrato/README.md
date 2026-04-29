# Contratos

## Responsibility

Esta feature administra el ciclo de vida contractual entre inmueble, propietario e inquilino.
Define altas, edición, consulta y baja lógica del contrato, y centraliza validaciones de vigencia y consistencia temporal.
Su objetivo funcional es mantener una única fuente de verdad sobre ocupación y renta mensual por inmueble.

## Data Model

Estructura esperada a nivel de dominio (interface-level):

- **id**: identificador único del contrato.
- **inmuebleId**: referencia obligatoria al inmueble asociado.
- **propietarioId**: referencia obligatoria al propietario legal del inmueble.
- **inquilinoId**: referencia al inquilino titular; puede ser opcional en estado preliminar.
- **fechaInicio**: fecha efectiva de inicio contractual.
- **fechaFin**: fecha de finalización pactada.
- **montoMensual**: importe mensual acordado de alquiler.
- **estado**: estado de negocio (`preliminar`, `activo`, `finalizado`, `cancelado`, `renovar`).

## Business Rules

- Un **inmueble** no puede tener más de un contrato en estado **activo** al mismo tiempo.
- Todo contrato debe tener `fechaInicio` y `fechaFin`, con `fechaInicio < fechaFin`.
- El `estado` debe ser consistente con la ventana temporal del contrato.
- `montoMensual` debe ser mayor a cero.
- `propietarioId` debe corresponder al titular vigente del inmueble al crear el contrato.
- Pasar a `finalizado` o `cancelado` cierra la vigencia operativa del contrato.
- Si existe un contrato activo, un nuevo contrato para el mismo inmueble debe nacer como preliminar o rechazarse.
- El contrato puede emitir eventos para vencimiento, renovación o cobro (sin implementación en esta feature).

## Relationships

- **Inmuebles**: el contrato determina ocupación y disponibilidad operativa.
- **Propietarios**: valida titularidad y define la contraparte locadora.
- **(Future) Notifications**: consume fechas y estado para recordatorios y alertas.

## Scope Boundaries

- No calcula índices de actualización ni ajustes automáticos de renta.
- No administra firmas legales o cierre legal documental.

## Notes

- Las notificaciones se derivan del contrato y se resuelven en otra feature/servicio.
- Esta feature encapsula reglas de dominio; no define decisiones de UI.
- El contrato es la entidad de coordinación entre ocupación, vigencia y renta en el MVP.
