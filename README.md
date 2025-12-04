# MvpInmobiliaria

* Angular CLI: 18.2.20.
* Angular material: 18.2.14
* Node: 22.18
* npm: 10.9.3
* La paleta de colores se encuentra en `style.scss`

## Anotaciones
4/12 commit
* Componentes: 
    En la ruta del proyecto `src/app/layout` estan los componentes "header, main, sidebar" los cuales conforman la estructura del MVP.

    En la ruta del proyecto `src/app/features` estan las _entidades_ (inmueble, inquilino, propietario y contrato).Propietario e inquilino tienen los componentes ( propietario-c e inquilino-c) donde se muestra de manera hardcodeada los datos de las interfaces
* Rutas: 
    Por ahora las unicas rutas que hay son: `/propietario`, `/inquilino`y `/formulario/propietario`. La unica que renderiza un ejemplo es el formulario. Hay que usar ese modelo base para mantener el estilo en la muestra de datos ( en propietario-c como en inquilino-c)
* Siguiente:
    Quiero hacer formularios reactivos para crear de manera dinámica la entidad de propietario (luego la logica se repite en las demas entidades)
    Además, hay que crear un shared template de card para poder mostrar de manera dinamica y no repetir estilizacion 
    La pregunta es ¿como?
### Entidades 
29/11: Declarando entidades y propiedades
Inquilino ( persona que alquila) / Propietario ( dueño de inmuebles) / Inmueble ( donde va a vivir el inquilino) / contrato ( nexo entre las 3 entidades )
* Inquilino: id ( key ) / nombre / DNI / telefono / email / garante / ingresos / domicilio actual
* Propietario: id ( key) / nombre / DNI / email / telefono / domicilio / CBU
* Inmueble: id ( key) / direccion / tipo / metros cuadrados / ambientes/ estado / idPropietario ( forean key)
* Contrato: id ( key)/ idInquilino ( forean key ) / idPropietario ( forean key ) / idInmueble ( forean key ) / fechaInicio / fechaFin / precio / deposito / observaciones / ... ( lo necesario )
* tarea: id ( key) / descripcion / fecha / estado / ... ( forean keys necesarias )
-----------------------------------------------------------------------------
Para seguir con el documento:
Lo siguiente seria hacer el diagrama de relacion de entidades y luego un diagrama de flujo en la creacion de entidades  ( en si podemos crear propietarios pero deben crearse inmuebles junto al propietario, por otro lado, no hay inquilinos si no existe el contrato. La creacion del contrato requiere que existan antes el inmueble, el propietario y el inquilino)


