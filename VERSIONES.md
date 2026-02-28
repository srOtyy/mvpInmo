# v0.8

## Objetivo

Crear un formulario dinámico que renderice un array de caracteristicas y lo muestre según el dominio asignado

## Alcance incluido

### Observaciones

- Hay un bug cuando se cambia de dominio, todavía no se como forzar el bug. Hay que eliminar los routerlink de los botones del sidebar. La idea es que el sidebar solo cambie los botones del header asi evitamos el bug ( arreglado el bug pero la idea sigue siendo buena)
- Hay un bug cuando se crean entidades ya no se muestran en la lista de cada entidad. Hay que arreglar como accede el shared-list a las entidades para mostrarlas
- En la creacion de propietarios, me gustaría que los inputs que son de checkbox esten del lado derecho del formulario, ya que genera un poco de "ruido" que se mesclen entre inputs de texto ( detalle de UI)
- los modales de los propietarios tienen hardcodeado las propiedades anteriores, por lo que no muestran las propiedades ingresadas ( arreglar modales)

### Decisiones

- Se creo un componente shared 'form-dinamico' que recibe por input el dominio activo ( string ) y emite por output una entidad creada ( solo emite los valores que se le asignaron a las caracteristicas definidas anteriormente )
- Se creo un componente por dominio 'crear-(dominio)', es padre de 'form-dinamico'. Este componente crea la entidad que le corresponde con un id random ( númerico ) junto con los valores emitidos en 'form-dinamico' y las emite al servicio correspondiente ( runtime )
- Por ahora podemos dejar el formulario que se cree segun el orden del array, pero si proximamente arreglar la ui de este formulario para que sea más amigable

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

### v0.6 Debug

    Se saldó la deuda de debug entre v0.1 a v0.5
    Se crearon nuevos shared, eliminaron componentes repetidos y se actualizo las interfaces de las entidades

    Pendientes para el proximo debug:
        -Los modales de propietarios e inquilinos aun muestran las caracteristicas de manera hardcodeada y no dinamicamente
