# MvpInmobiliaria

* Angular CLI: 18.2.20.
* Angular material: 18.2.14
* Node: 22.18
* npm: 10.9.3
* La paleta de colores se encuentra en `style.scss`

## Anotaciones
24/12:
   
   La entidad propietarios ya tiene un CRUD y RxJs
   Agregar de angular Material los snackbar para mandar pequeños mensajes cada vez que sucede algo ( como es el CRUD o errores asi evito abrir la consola )
   Me gustaria personalizar las rutas para que todo lo de propietarios corresponda a una ruta familiar y no algo que varie ( como es el caso del formulario y la lista )

     
   
* Componentes: 
    En la ruta del proyecto `src/app/layout` estan los componentes "header, main, sidebar" los cuales conforman la estructura del MVP.

    En la ruta del proyecto `src/app/features` estan las _entidades_ (inmueble, inquilino, propietario y contrato)

    PROPIETARIOS: la entidad trabajada hasta el momento
    Cuenta con: 
    ### formulario de creacion (`propietario/formulario-propietario`)
        seria el Create del CRUD
    ### propietario-c ( `propietario/propietario-c`)
        renderiza el card-list de la carpeta shared
    ### item-propietario ( `propietario/item-propietario`)
        Es el item de la lista del card-list de la carpeta shared
    ### Modals ( `propietarios/modals`)
        1. ver-info-propietario: solo muestra los datos
        2. editar-propietario: te permite editar los datos
        3. eliminar-propietario: elimina al propietario
        los 3 componentes estan conectados con el servicio de RxJs de los propietarios
    ### Propietario-rxjs.service (`propietario/propietario-rxjs.service`)
        Tiene como estado interno un BehaviurSubject de un array de propietarios
        Permite como lectura un observable del behaviurSubject
        Tiene un CRUD del array y un getter y setter del array ( los getter y setter no se estan utilizando)


    En `src/app/shared` hay 
        "card-list" (``src/app/shared/card-list`) donde se van a mostrar en una lista de items  (La idea es que este shared muestre a las entidades por nombre)
    
     "modal" ( `src/app/shared/modal`)que  estiliza como va a ser el modal, a parte de eso recibe por _MAT_DIALOG_DATA_  un componente a renderizar ( el contenido del modal), y de manera opcional un objeto

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



