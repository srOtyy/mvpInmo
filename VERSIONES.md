# v0.11

## Objetivo

Refactor de service httpclient, etc...

## Alcance incluido

### Observaciones

- el sidebar desactiva el contenido main porque tienen un routerlink.
Mi idea es que el sidebar solo afecte al navbar, y este ultimo si defina el contenido del main (LISTO)
- hay un conflicto en el formulario de las caracteristicas. Si elijo el dominio desde el sidebar. El contenido dentro de la lista de caracteristicas cambia segun el domino. Seguramente este suscripto al dominio activo(PENDIENTE)
- El servicio de httpclient debe actualizarce para que no sea tan repetitivo (LISTO)
- En el head, el indicador de dominio activo, al ser un boton, tiene el estilode hover. Abria que quitarlo

### Decisiones

- Se creo un servicio que usa genéricos para las consultas http. Los servicios de entidad-rxjs ahora heredan este servicio (base-crud-rxjs.ts)

## Próxima versión

- Unificar los botones y la eleccion de dominio en el sidebar:
    Podria ser que al elegir un dominio, se cambien los botones ( estaría bueno agregar un efecto de transicion ) para que vengan los botones x dominio. Esto evitaria que se elija diferente dominio mientras se observan las caracteristicas declaradas ( posible solucion ? agregado a que se recrea la UI a algo más practico? )

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

### v0.6 Debug

    Se saldó la deuda de debug entre v0.1 a v0.5
    Se crearon nuevos shared, eliminaron componentes repetidos y se actualizo las interfaces de las entidades

    Pendientes para el proximo debug:
        -Los modales de propietarios e inquilinos aun muestran las caracteristicas de manera hardcodeada y no dinamicamente

### v0.8 Formulario dinamico

    falta agregar lo que se hizo en esta version y la v0.7

### v0.9 - Base de datos local

    - el .json se nesecita ejecutar en una terminal propia 'json-server --watch "nombre del archivo.json"'
    - los modales hardcodean las caracteristicas que deben mostrar. Hay que volverlos dinamicos
    - la consola muestra un error con el layout

### v0.10 - refactor + eliminacion de any's

    - Se creó un servicio que usa genericos para los modales y modal.component (moda-service.ts)
