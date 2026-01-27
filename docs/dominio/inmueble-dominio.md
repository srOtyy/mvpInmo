# Dominio: Inmueble

## Rol del dominio

    * Representa el objeto de inmueble dentro del programa
    * Dentro de la entidad Inmueble se aloja una interfaz ´ caracteristicasInmueble ´ que aloja el array de caracteristicas del inmueble

## Atributos

- id
- idPropietario
- caracterisitcas ( del tipo:  caracteristicasInmueble[])

## Servicios asociados

### caracteristicasInmueble ( podria ser lógica del componente del formulario)

    Va a controlar que las caracteristicas agregadas al array dentro del inmueble pasen por una validacion de formulario:
    La validacion cumple con la sigiente solicitud de interfaz en la caracteristica agregada:
    DefinicionCaracteristica { clave: string tipo: 'string' | 'number' | 'boolean' requerida: boolean }

### inmueble-RxKsService

    Va a alojar en memoria local las caracteristicas agregadas de manera temporal  dentro de un Observable ( por la memoria local) 

## Flujo típico

1. Formulario crea la caracterisitca
2. Service (RxJs) inserta en el Observable
3. Se persiste dentro del service como memoria local ( FALTA API)

## Límites del dominio

    * Las caracteristicas no se guardan luego de cerrar la sesion ( ctrl + c)
