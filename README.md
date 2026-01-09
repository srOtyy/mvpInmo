## v0.3 – Service controlador de rutas

### Objetivo
Implementar un service que permita al Header renderizar acciones dinámicas (botones) en función del dominio activo en el que se encuentra el usuario.

Este enfoque introduce una capa de contexto de navegación, separando la lógica de UI del conocimiento directo de rutas.

### Alcance incluido
- El service obtiene el dominio actual a través de Router

- Se creó el archivo `navegacionRutas.ts`, que contiene:
    * La interfaz IBotonRuta
    * El union type que define los dominios válidos del sistema

### Observaciones técnicas

- El HeaderComponent consume el service como suscriptor principal

- El service se convierte en un punto de alta influencia arquitectónica, al centralizar:
    * Qué acciones existen
    * En qué dominio están habilitadas

- Se introducen dos herramientas clave del tipado en TypeScript:
    * Union type
    * Record<K,V>
>Nota: 
>  - Union Type:  type Dominio = 'valor1' | 'valor2' | ...
>    La variable solo puede tomar uno de los valores declarados.
>  - Record<K,V>: las claves son de tipo K y los valores son de tipo V unicamente   
### Decisiones

- Los dominios se declaran exclusivamente en `navegacionRutas.ts` mediante union type
- Las acciones por dominio se definen dentro del service (accionesPorDominio)
- Se utiliza Record<Dominio, IBotonRuta[]>
- Ubicación actual de archivos:
    ./core/navegacionRutas.ts
    ./core/rutas-dinamicas.service.ts
>Nota:
>En la próxima jornada se evaluará crear ./core/navegacion/ para agrupar estos archivos y reducir ruido dentro de core.
## Próxima versión (prevista)
### v0.4...


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
        Esta versopm establecio la segunda entidad importante del sistema.
        ### Observaciones técnicas

    Observaciones endeudadas:
        - `item-propietario` y `item-inquilino` comparten estructura
        - Los modales base se repiten entre entidades
        - Se detecta posible abstracción futura (no abordada en esta versión)


