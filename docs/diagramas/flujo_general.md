# Flujo general de la aplicacion

Este diagrama resume como se conectan las rutas, las pantallas, los servicios y la API. Es un mapa de arquitectura: los recorridos de cada entidad y el ciclo del contrato se detallan en sus diagramas especificos.

```mermaid
flowchart TB
    U[Usuario] --> ROUTER[Angular Router<br/>app.routes.ts]

    subgraph RUTAS["Rutas de la aplicacion"]
        RP["/propietarios<br/>lista · crear · def_caracteristicas"]
        RI["/inquilinos<br/>lista · crear · def_caracteristicas"]
        RIM["/inmuebles<br/>lista · crear · def_caracteristicas"]
        RC["/contratos<br/>crear · lista · liquidaciones · vista (outlet detalle)"]
        RN["/notificaciones/crear"]
    end
    ROUTER --> RP
    ROUTER --> RI
    ROUTER --> RIM
    ROUTER --> RC
    ROUTER --> RN

    RDS{{RutasDinamicasService}} --> SIDEBAR["Acciones del sidebar<br/>propietarios, inquilinos, inmuebles y contratos"]
    SIDEBAR -.-> RP
    SIDEBAR -.-> RI
    SIDEBAR -.-> RIM
    SIDEBAR -.-> RC

    subgraph ENTIDADES["Propietarios, inquilinos e inmuebles"]
        LISTA["Componentes de lista<br/>filtro y orden"]
        CARD["card-list + acordeon de entidad"]
        MODAL["Acciones de entidad<br/>ModalService → ModalComponent<br/>editar y eliminar"]
        CREAR["Componentes de creacion"]
        FD["form-dinamico"]
        DEFINICIONES["FormularioCaracteristicasComponent"]
        SDEF{{DefinicionesCaracteristicasService}}
        SERVICES["Servicios de dominio<br/>PropietarioRxjsService · InquilinoRxjsService<br/>InmueblesRxjsService"]
        CRUD{{BaseCrudService}}
        ESTADO[("signal $lista por entidad")]

        RP --> LISTA
        RI --> LISTA
        RIM --> LISTA
        LISTA --> CARD
        CARD -->|"editar o eliminar"| MODAL
        LISTA --> SERVICES
        MODAL --> SERVICES
        RP --> CREAR
        RI --> CREAR
        RIM --> CREAR
        CREAR --> FD
        FD -->|"entidadCreada"| CREAR
        CREAR --> SERVICES
        RP --> DEFINICIONES
        RI --> DEFINICIONES
        RIM --> DEFINICIONES
        DEFINICIONES <--> SDEF
        SDEF -->|"definiciones por dominio"| FD
        SERVICES --> CRUD
        CRUD --> ESTADO
        ESTADO --> LISTA
    end

    subgraph CONTRATOS["Contratos y liquidaciones"]
        CFORM["CrearContratoComponent<br/>carga propietarios, inquilinos e inmuebles"]
        CS{{ContratoBbddService}}
        LCOMP[ListaContratosComponent]
        CL["ListaDeContratosService<br/>filtros y lista"]
        DETAIL["ContratoCComponent<br/>outlet detalle"]
        LIFE["CicloDeVidaContratosService<br/>FinalizacionContratoService"]
        LIQ{{LiquidacionGeneratorService}}
        DOC["Gastos, EGLAI y documentos<br/>de liquidacion"]
        ACT["CrearContratoComponent<br/>activa inmueble e inquilinos"]

        RC --> CFORM
        CFORM --> CS
        CFORM -->|"consulta entidades relacionadas"| SERVICES
        RC --> LCOMP
        LCOMP --> CL
        CL --> CS
        CL --> LIQ
        LCOMP -->|"seleccion"| DETAIL
        CL -->|"sincronizacion"| LIFE
        LIFE --> CS
        DETAIL --> LIQ
        RC --> DOC
        DETAIL --> DOC
        DOC --> LIQ
        CS -->|"contrato guardado"| LIQ
        LIQ -->|"liquidacion inicial guardada"| ACT
        CS --> CRUD
        LIQ --> CRUD
    end

    RN --> NCOMP["CrearNotificacionComponent"]
    NCOMP --> NS{{NotificacionesService}}
    NS --> CRUD
    CRUD <--> API[("json-server<br/>http://localhost:3000")]
    SDEF <--> API

    classDef route stroke:#1E88E5,color:#f1f1f1;
    classDef component stroke:#2E7D32;
    classDef shared stroke:#5E35B1;
    classDef service stroke:#F9A825;
    classDef state stroke:#455A64;

    class RP,RI,RIM,RC,RN route;
    class LISTA,CARD,CREAR,FD,DEFINICIONES,CFORM,LCOMP,CL,DETAIL,DOC,ACT,NCOMP,SIDEBAR component;
    class MODAL shared;
    class RDS,SDEF,SERVICES,CRUD,CS,LIFE,LIQ,NS service;
    class ESTADO,API state;
```

## Alcance y notas

- El flujo general da una vista de conjunto; no reemplaza los diagramas de [propietarios](./propietarios_flujo.md), [inquilinos](./inquilinos_flujo.md) e [inmuebles](./inmuebles_flujo.md), que muestran sus diferencias de captura y relacion entre datos.
- `RutasDinamicasService` prepara las acciones del sidebar; la definicion de pantallas y URLs esta en `app.routes.ts`.
- Las entidades principales comparten `BaseCrudService`, que centraliza las peticiones CRUD y mantiene el signal `$lista`. Las definiciones de caracteristicas se guardan por dominio en `/definiciones`.
- La ruta `/notificaciones/crear` existe, pero el formulario actual es una funcionalidad de prueba y aun no esta integrada como flujo completo del sidebar.
- La creacion de contratos usa propietarios, inquilinos e inmuebles; al guardarse, crea una liquidacion inicial e intenta activar el inmueble y los inquilinos asociados.
