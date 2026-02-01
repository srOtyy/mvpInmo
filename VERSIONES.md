# v0.6 - Debug

## Objetivo

    Arreglar los pendientes de las versiones anteriores
        * v0.1: 
                - Chequear card-list: destruye el layout / el layout no se expande (LISTO)
        * v0.2:
                - `item-propietario` e `item-inquilino` comparten estructura
                - Los modales base se repiten entre entidades
        * v0.4:
                - Se reutilizaron patrones establecidos en v0.1 y v0.2
                - El sidebar continúa siendo hardcodeado para cada entidad
        * v0.5: 
                - Las entidades propietario e inquilino deberían tener el mismo sistema de atributos que tiene inmuebles ( un array editable para flexibilidad futura )
        * documentacion:
                Faltó agregar el dominio de inquilinos
                Faltó agregar flujo de inmuebles y contratos

## Alcance incluido

    Item-propietario e item inquilino son un item dentro de card-list (shared) que recibe por input la entidad que va a abrir 3 modales: ver, editar y eliminar. Cada modal puede ver la entidad, editarla o eliminarla, segun corresponda.
    Volver los modales shared sería lo más conveniente? Porque tambien repiten el mismo concepto en la lógica del proyecto (los shared solo consumen el servicio de rx-js donde se almacena el array que simula ser la base de datos. Pero cada entidad tiene su propio service de rx-js. Entonces serian como bases de datos separadas. Deberia hacer un service que almacene los arrays de cada service para simular la base de datos coomo un solo concepto y no como cada service x entidad ? v0.7 ? )

    Podriamos evaluar la idea de modales-shared para una siguiente version (v0.7?) 

### Observaciones

    v0.1:
        app-component: al body se le agregó overflow-y scroll y se estilizo el scroll. ( No se como editar el ancho del scroll. Me gusta que el scroll del body sea mas grande que los demas componentes. Pero todos son iguales de ancho)
        al card-list se le agregó padding

### Decisiones

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

    aca iria lo que se trabajo en v0.4
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