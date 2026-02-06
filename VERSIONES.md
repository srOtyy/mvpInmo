# v0.6 - Debug

## Objetivo

    Arreglar los pendientes de las versiones anteriores
        * v0.1: 
                - Chequear card-list: destruye el layout / el layout no se expande (LISTO)
        * v0.2:
                - `item-propietario` e `item-inquilino` comparten estructura
                - Los modales base se repiten entre entidades
                (LISTO)
        * v0.4:
                - Se reutilizaron patrones establecidos en v0.1 y v0.2 
                - El sidebar continúa siendo hardcodeado para cada entidad
                (LISTO)
        * v0.5: 
                - Las entidades propietario e inquilino deberían tener el mismo sistema de atributos que tiene inmuebles ( un array editable para flexibilidad futura )
                (LISTO)
        * documentacion:
                Faltó agregar el dominio de inquilinos
                Faltó agregar flujo de inmuebles
                Editar dominios y flujos actuales porque se editaron las interfaces y los shared que utilizan (LISTO)

## Alcance incluido

    -El problema de la destruccion del layout fue solucionado con scss
    -La repeticion de estructura de componentes fue solucionado crendo un shared: item-entidad: recibe por input la entidad tipo: <T> y devuelve por output cuando deben realizarse ciertos eventos
    -Se unificó el sistema de atributos de las entidades Inmueble, Propietario e Inquilino.
  
### Observaciones

    v0.1:
        app-component: al body se le agregó overflow-y scroll y se estilizo el scroll. ( No se como editar el ancho del scroll. Me gusta que el scroll del body sea mas grande que los demas componentes. Pero todos son iguales de ancho)
        al card-list se le agregó padding
    v0.2:
        se agrego un nuevo shared item-entidad que recibe por input la entidad ( utiliza el patron <T>)
    v0.4: 
        Ahora el sidebar utiliza rutas-dinamicas.service para acceder a los dominios activos para generar los botones de ruta ( los del sidebar)
    v0.5:
        CODEX:
            -Se creó un modelo base `IEntityBase` con `id` y `caracteristicas` y las tres entidades ahora lo extienden.

            Herramientas/patrones utilizados:
                - Interfaz base compartida (`IEntityBase`)
                - Helpers shared en `src/app/shared/entity-helpers.ts`:
                    `obtenerCaracteristica` y `construirCaracteristicasDesdeForm`

### Decisiones

    Los modales de propietarios e inquilinos aun muestran las caracteristicas de manera hardcodeada y no dinamicamente

## Próxima versión

## Versiones anteriores

### v0.1 – Propietarios

    En esta versión se implementó el CRUD básico de la entidad Propietario, incluyendo:
        Modelo y servicio
        Gestión de estado mediante RxJS
        UI mínima funcional para creación, edición y listado
        Esta versión estableció el patrón base para el resto de las entidades del sistema.

### v0.2 - Inquilinos

    En esta version se impemento el CURD basico de Inquilino, incluye :
        Modelo (interfaz) y serivicio
        Gestion de estadio mediante RxJs ( El array)
        UI Aceptable para el uso del CRUD
        Esta version establecio la segunda entidad importante del sistema.

    Observaciones endeudadas:
        - `item-propietario` y `item-inquilino` comparten estructura
        - Los modales base se repiten entre entidades

### v0.3 - Service rutas dinamicas

    En esta version se creó un service que crea botones en el header, los botones indican las rutas del dominio donde se encuentra el usuario ( los dominios que hay en el sidebar).
    Se permite agregar nuevas rutas dentro de los archivos indicados
        - Se creó el archivo `navegacionRutas.ts`, que contiene:
        - La interfaz IBotonRuta
        - El union type que define los dominios válidos del sistema
    
    Obsevaciones:
        Se utilizan herramientas nuevas cono record y union type

### v0.4 - Dominio 'Contratos'

    En esta versión se crearon archivos markdown con mermeid

    Observaciones técnicas:
        - Se reutilizaron patrones establecidos en v0.1 y v0.2
        - Se identificó duplicación de código en componentes `item-*`
        - El sidebar continúa siendo hardcodeado para esta entidad

### v0.5 Inmuebles

    Se creó el formulario de caracteristicas que se van a solicitar a la hora de crear inmuebles 

    Observacioens técnicas:
        - el layout se rompe 
        - NO se esta creando inmuebles ( solo el array de caracteristicas)
        - se hardcodeo el sidebar

        
