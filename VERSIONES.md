# v0.10

## Objetivo

eliminar todos los 'any' dentro de lo posible

## Alcance incluido

### Observaciones

- entity-helpers: obtenerCaracteristica() y construirCaracteristicasDesdeForm()
                obtenerCaracteristica() emite un any
                construirCaracteristicasDesdeForm() tiene como parametro:
                    form: { get: (clave: string) => { value: any } | null },claves: string[]
- modal.component.ts: En el esquema del @Inject
                    El inject vendira a ser como el input del modal. tanto compoenente, como componenteData erciben any
                        @Inject(MAT_DIALOG_DATA) public data: {
                        titulo: string;
                        componente: Type<any>;
                        componenteData?: any;
                        }
- form dinamico.component.ts: en el @Output
                            el otuput tiene el siguiente esquema:
                                Output() entidadCreada = new EventEmitter<{ caracteristicas: { clave: string; valor: any }[] }>();
- crear-propietario/inquilino/mueble.ts:onEntidadCreada() tiene en el argumento(
    entidad: { caracteristicas: { clave: string; valor: any }[] }
)

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
