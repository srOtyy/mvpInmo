# Dominio: Inquilinos

## Rol del dominio

    * Representa al inquilino y todos sus atributos dentro del programa, manteniendo toda la informacion  del mismo y conserbandola para cuando se la solicite
    * El inquilino es parte de los contratos

## Atributos

- id
- caracteristicas

## Servicios asociados

### inquilino-rxjs.service

    **Responsabilidad**

    - Contiene el array de inquilinos como un Observable

    **Expone**

    - listaInquilinos$
    - agregarInquilino()
    - editarInquilino()
    - eliminarInquilino()

    ** Consumidores **

    - inquilino-c
    - eliminar-inquilino ( modal )
    - editar-inquilino ( modal )
    

## Flujo típico

1. UI dispara acción ( CRUD )
2. Service inserta en el Observable
3. Se persiste dentro del service como memoria local ( FALTA API)
4. Se actualizan streams reactivos en la UI ( la lista de propietarios x ejemplo)

## Límites del dominio
