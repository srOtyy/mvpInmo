# Dominio: Contratos

## 1. Propósito

    Relacionar al inquilino con el inmueble a lo largo de un  tiempo establecido.
    Generar alertas.
    Automatizar tareas.

## 2. Qué es un contrato en este sistema

    El contrato representa la reacion entre entidades dentro del sistema

## 3. Entidades involucradas

- inquilino
- inmueble
- propietario (de forma indirecta)

## 4. Ciclo de vida del contrato

### Creacion

    Se establece relacion entre entidades.
    Se establece fecha de cierre.

### Vigencia

    Se van a ir generando alertas

### Fin

    Cuando llegue la fecha pactada en el inicio del contrato

## 5. Estados del contrato

- Vigente
- Finalizado (Fin temporal)
- Cerrado (Fin legal)

## 6. Eventos y alertas

- Fechas de pago
- Aumentos segun indices nacionales
- Vencimientos proximos
- Cualquier evento que requiera una alerta

## 7. Cierre del contrato

    Existen 2 cierres en el contrato
    El primero es un fin temporal ( alcanza la fecha de finalidad de contrato), el segundo es un fin legal. Requieren las firmas de las partes dentro del contrato.

## 8. Decisiones tomadas

    El contrato va a ser, por el momento, el eje central del sistema

## 9. Alcances futuros (no implementados)

    * Cierre legal
    * Firmas digitales
    * Notificaciones
    * Aumentos por indice
