# MvpInmobiliaria

* Angular CLI: 18.2.20.
* Angular material: 18.2.14
* Node: 22.18
* npm: 10.9.3
* [paleta de colores](https://coolors.co/u/octavio_diaz_crespo)

## Anotaciones
3/12: Componentes, rutas e ideas:
* Componentes:En la ruta del proyecto `src/app/layout` estan los componentes <header>, <main>, <sidebar> los cuales conforman la estructura del MVP
En la ruta del proyecto `src/app/features` estan las _entidades_ (inmueble, *inquilino*, *propietario* y contrato). Las marcadas tienen sus componentes  ( <propietario-c> y <inquilino-c>) donde se muestra de manera hardcodeada los datos de las interfaces ( _las entidades_)

* Rutas: 
    Por ahora las unicas rutas que hay son: `/propietario` e `/inquilino`, cada una muestra el componente que le corresponde <propietario-c>, <inquilino-c>
* Ideas:
    Quiero hacer formularios para crear de manera dinámica las entidades _propietario_ e _inquilino_
### Entidades 
29/11: Declarando entidades y propiedades
Inquilino ( persona que alquila) / Propietario ( dueño de inmuebles) / Inmueble ( donde va a vivir el inquilino) / contrato ( nexo entre las 3 entidades )
* * Inquilino: id ( key ) / nombre / DNI / telefono / email / garante / ingresos / domicilio actual
* * Propietario: id ( key) / nombre / DNI / email / telefono / domicilio / CBU
* * Inmueble: id ( key) / direccion / tipo / metros cuadrados / ambientes/ estado / idPropietario ( forean key)
* * Contrato: id ( key)/ idInquilino ( forean key ) / idPropietario ( forean key ) / idInmueble ( forean key ) / fechaInicio / fechaFin / precio / deposito / observaciones / ... ( lo necesario )
* * tarea: id ( key) / descripcion / fecha / estado / ... ( forean keys necesarias )
-----------------------------------------------------------------------------
Para seguir con el documento:
Lo siguiente seria hacer el diagrama de relacion de entidades y luego un diagrama de flujo en la creacion de entidades  ( en si podemos crear propietarios pero deben crearse inmuebles junto al propietario, por otro lado, no hay inquilinos si no existe el contrato. La creacion del contrato requiere que existan antes el inmueble, el propietario y el inquilino)


