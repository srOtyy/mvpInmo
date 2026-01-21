# Dominio: Propietarios

## Rol del dominio

    * Representa al propietario y todos sus atributos dentro del programa, manteniendo toda la informacion  del mismo y conserbandola para cuando se la solicite
    * El propietario puede agregar inmuebles  

## Atributos

- id
- nombre
- dni
- telefono
- email
- cbu
- inmuebles

## Servicios asociados

### propietario-rxjs.service

    **Responsabilidad**

    - Contiene el array de propietarios como un Observable

    **Expone**

    - listaPropietarios$
    - agregarPropietario()
    - editarPropietario()
    - eliminarPropietario()

    ** Consumidores **

    - propietario-c
    - eliminar-propietario ( modal )
    - editar-propietario ( modal )
    - formulario-propietario

## Flujo típico

1. UI dispara acción ( CRUD )
2. Service inserta en el Observable
3. Se persiste dentro del service como memoria local ( FALTA API)
4. Se actualizan streams reactivos en la UI ( la lista de propietarios x ejemplo)

## Límites del dominio
