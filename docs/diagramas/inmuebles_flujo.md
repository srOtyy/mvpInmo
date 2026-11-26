# Flujo del dominio Inmuebles

```mermaid
flowchart TB
    RLISTA["/inmuebles/lista"]
    RCREAR["/inmuebles/crear"]
    RDEF["/inmuebles/def_caracteristicas"]

    LISTA[InmuebleCComponent]
    CARD["card-list + AccordionInmuebleComponent"]
    MODAL["ModalService<br/>editar o eliminar"]
    CREAR[CrearInmuebleComponent]
    FD[form-dinamico]
    PROPIETARIO["Seleccionar propietario"]
    SI{{InmueblesRxjsService}}
    SP{{PropietarioRxjsService}}
    CRUD{{BaseCrudService}}
    ESTADO[("signals $lista<br/>inmuebles y propietarios")]
    DEFINICIONES[FormularioCaracteristicasComponent]
    SDEF{{DefinicionesCaracteristicasService}}
    API[("json-server")]
    CONTRATO["Crear contrato<br/>activa inmueble e inquilinos"]

    RLISTA --> LISTA --> SI
    SI --> CRUD --> API
    SI --> ESTADO --> LISTA
    LISTA --> CARD
    CARD -->|"editar o eliminar"| MODAL
    MODAL --> SI

    RCREAR --> CREAR
    CREAR --> PROPIETARIO
    CREAR --> FD
    FD -->|"entidadCreada"| CREAR
    CREAR -->|"crear inmueble"| SI
    SI -->|"tras persistir: actualiza listaInmuebles"| SP
    SP --> CRUD
    CONTRATO -->|"activarInmueble()"| SI

    RDEF --> DEFINICIONES
    DEFINICIONES <--> SDEF
    SDEF -->|"GET /definiciones<br/>POST o PATCH por dominio"| API
    SDEF -->|"definiciones de inmuebles"| FD

    classDef route stroke:#1E88E5,color:#f1f1f1;
    classDef component stroke:#2E7D32;
    classDef shared stroke:#5E35B1;
    classDef service stroke:#F9A825;
    classDef state stroke:#455A64;

    class RLISTA,RCREAR,RDEF route;
    class LISTA,CARD,CREAR,FD,PROPIETARIO,DEFINICIONES,CONTRATO component;
    class MODAL shared;
    class SI,SP,CRUD,SDEF service;
    class ESTADO,API state;
```

El alta requiere elegir un propietario. Se guarda el inmueble y luego se agrega su ID a `listaInmuebles` del propietario. La activacion del inmueble ocurre al crear un contrato.
