
# MVP Inmobiliaria

    1. Visión del proyecto

    Este proyecto es un gestor inmobiliario desarrollado en Angular, pensado con un enfoque evolutivo.

    La idea central es que el sistema no sea cerrado ni rígido, sino que pueda expandirse en función de las necesidades reales del usuario (la persona que gestiona la inmobiliaria).
    Nuevas herramientas, automatizaciones o flujos pueden incorporarse a medida que surgen nuevas demandas, manteniendo al sistema vivo y adaptable.

    Stack actual:
        * Angular 18.2.21
        * npm 11.7.0
        * Angular Material 18
        
## ¿Qué problema intenta resolver?

    Las inmobiliarias suelen realizar una gran cantidad de tareas repetitivas y manuales, tales como:

        * registro de propietarios, inmuebles e inquilinos

        * gestión de datos de potenciales compradores

        * seguimiento de contratos vigentes

        * recordatorios de vencimientos y eventos importantes
    Este proyecto busca reducir la carga operativa y cognitiva, centralizando la información y automatizando alertas y procesos recurrentes.

## ¿Cómo está pensado el sistema hoy?

## ¿Cuáles son sus piezas principales?

   Actualmente, el dominio del sistema contempla cuatro entidades principales:
        *Propietarios
        * Inmuebles
        *Inquilinos
        * Contratos
    Relación general del dominio:
        *Un Propietario puede tener uno o más Inmuebles
        * Un Contrato se genera a partir de la relación entre:
        *un Inquilino
        * un Inmueble
    El Contrato actúa como nexo entre las entidades y da contexto temporal y legal a la relación

## Limites actuales del MVP
