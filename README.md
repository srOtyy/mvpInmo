# MvpInmobiliaria

* Angular CLI: 18.2.20.
* Angular material: 18.2.14
* Node: 22.18
* npm: 10.9.3
* [paleta de colores](https://coolors.co/u/octavio_diaz_crespo)

## Anotaciones
29/11: Declarando entidades y propiedades

### Entidades 
Inquilino ( persona que alquila) / Propietario ( dueño de inmuebles) / Inmueble ( donde va a vivir el inquilino) / contrato ( nexo entre las 3 entidades )
* * Inquilino: id ( key ) / nombre / DNI / telefono / email / garante / ingresos / domicilio actual
* * Propietario: id ( key) / nombre / DNI / email / telefono / domicilio / CBU
* * Inmueble: id ( key) / direccion / tipo / metros cuadrados / ambientes/ estado / idPropietario ( forean key)
* * Contrato: id ( key)/ idInquilino ( forean key ) / idPropietario ( forean key ) / idInmueble ( forean key ) / fechaInicio / fechaFin / precio / deposito / observaciones / ... ( lo necesario )
* * tarea: id ( key) / descripcion / fecha / estado / ... ( forean keys necesarias )
-----------------------------------------------------------------------------
Para seguir con el documento:
Lo siguiente seria hacer el diagrama de relacion de entidades y luego un diagrama de flujo en la creacion de entidades  ( en si podemos crear propietarios pero deben crearse inmuebles junto al propietario, por otro lado, no hay inquilinos si no existe el contrato. La creacion del contrato requiere que existan antes el inmueble, el propietario y el inquilino)


