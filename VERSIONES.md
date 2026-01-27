# v0.5 - Inmuebles

## Objetivo

## Alcance incluido

    Se creó un formulario de creacion de caracteristicas para el inmueble
    Se creo un componente 'item' para renderizarlo dentro de card-list ( igual no funciona)

### Observaciones técnicas

    -Pareciera que el card-list no esta cumpliendo con la idea de mostrar la lista de caracteristicas 
    -El formulario solo crea caracteristicas del inmueble, no inmuebles. La creacion del inmueble tiene q derivarse desde el propietario o puede hacerse desde una ruta aparte
    -El card-list destruye el layout ya que no entra en el main ( tal vez hay que arreglar esto primero)
    - La creacion de un inmueble no requiere mucho ya que el id es generado automaticamente, el idPropietario se asigna internamente y las caracteristicas se crean desde el formulario de caracteristicas. Tal vez la "creacion del inmueble" sea darles valor a las caracteristicas definidas previamente en el formulario de caracteristicas

### Decisiones

    - el sidebar del layout esta siendo hardoceado por cada entidad en lugar de crear los botones dinamicamente. Hay que implementar una version dinamica del hardcodeo
    - Entender el comportamiento de card-list para con item-caracteristica. La idea de mostrar las caracteristicas creadas es clave. ( no esta funcionando)
    - Por el momento el formulari solo crea caracteristicas; no inmuebles

## Próxima versión (prevista)

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

#### vo.4 - Dominio 'Contratos'
