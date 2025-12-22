# MvpInmobiliaria

* Angular CLI: 18.2.20.
* Angular material: 18.2.14
* Node: 22.18
* npm: 10.9.3
* La paleta de colores se encuentra en `style.scss`

## Anotaciones
20/12:
    Concentrandonos unicamente en la interfaz IPropietario
    Le creamos un formulario ( `features/propietarios/formulario-propietario`) que crea y manda un propietario al service de propietarios ( `features/propietarios/propietario-s.service.ts`) (eventualmente, además de ser un servicio, estaria funcionando como base de datos de los propietarios creados en la sesion)
    Incluir RxJs para mejorar el manejo de datos
    Los propietarios se muestran en el componente propietario-c ( `features/propietarios/propietario-c`) donde se renderiza una lista(`shared/card-list`). Allí, por cada propietario de la lista se va a mostrar en item-propietario ( `features/propietarios/item-propietario`) el nombre de cada propietario con 3 botones de accion (CRUD)
    
    Para hacer:
    Crear el modal
    ¿ Un modal shared para mantener el mismo estilo en los modal ? y luego el modal shared va a poder renderizar diferentes componentes segun el boton elegido:
    Hay 3 botones ahora: Ver propietario, editar propietario y eliminar propietario
    cada boton puede abrir el mismo shared-modal que se va a comportar como base de modal
    pero ese emodal va a tener que renderizar 3 lógicas diferentes. Esa es la sitacion
    La idea del modal shared es que se comparta en cada modal el mismo estilo.
    Pero claro, depende de que boton se abra es la lógica que va a ocurrir ( )
    Chat gpt ya contesto esta duda
    Podemos hacer un shared modal como base de los demas modales
    Pero el shared modal es un modal y las demás lógicas son componentes que se renderizan en el modal segun el boton que elijan ? o son otros modales tambien ? 
    Creo que con eso ya podemos seguir profundizando en el CRUD de IPropietarios. Para despues poder repetir en las demas entidades del sistema
   
* Componentes: 
    En la ruta del proyecto `src/app/layout` estan los componentes "header, main, sidebar" los cuales conforman la estructura del MVP.

    En la ruta del proyecto `src/app/features` estan las _entidades_ (inmueble, inquilino, propietario y contrato).Propietario e inquilino tienen los componentes ( propietario-c e inquilino-c) donde se muestra de manera hardcodeada los datos de las interfaces

    En `src/app/shared` esta un componente "card-list" donde se van a mostrar en una lista los nombres de los propietarios
    La idea es que este shared muestre tambien inquilinoos y propiedades

* Rutas: 
    Por ahora las unicas rutas que hay son: `/propietario`, `/inquilino`y `/formulario/propietario`.
* Siguiente:
    Debería estilizar un poco más la lista de "card-list", crear un CRUD en el card-list 
### Entidades 
29/11: Declarando entidades y propiedades
Inquilino ( persona que alquila) / Propietario ( dueño de inmuebles) / Inmueble ( donde va a vivir el inquilino) / contrato ( nexo entre las 3 entidades )
* Inquilino: id ( key ) / nombre / DNI / telefono / email / garante / ingresos / domicilio actual
* Propietario: id ( key) / nombre / DNI / email / telefono / domicilio / CBU
* Inmueble: id ( key) / direccion / tipo / metros cuadrados / ambientes/ estado / idPropietario ( forean key)
* Contrato: id ( key)/ idInquilino ( forean key ) / idPropietario ( forean key ) / idInmueble ( forean key ) / fechaInicio / fechaFin / precio / deposito / observaciones / ... ( lo necesario )
* tarea: id ( key) / descripcion / fecha / estado / ... ( forean keys necesarias )
-----------------------------------------------------------------------------



