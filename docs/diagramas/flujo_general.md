# Diagrama de Flujo General (arquitectura actual)

```mermaid
flowchart TB

    %% Entrada comun
    U[Usuario]
    RDS{{RutasDinamicasService}}

    %% Rutas por dominio
    RP[/Ruta: propietarios/lista/]
    RI[/Ruta: inquilinos/lista/]
    RC[/Ruta: crear por dominio/]

    RDC1[/Ruta: propietarios/def_caracteristicas/]
    RDC2[/Ruta: inquilinos/def_caracteristicas/]
    RDC3[/Ruta: inmuebles/def_caracteristicas/]

    %% Componentes de dominio
    PC[propietario-c]
    IC[inquilino-c]
    FC[crear-entidad]

    %% Shared UI
    CL[shared: card-list]
    IE[shared: item-entidad]
    FD[shared: form-dinamico]
    FCS[shared: formulario-caracteristicas]
    MOD[shared: modal]

    %% Servicios de dominio y bases compartidas
    SP{{propietario-rxjs.service}}
    SI{{inquilino-rxjs.service}}
    SM{{inmuebles-rxjs.service}}
    BCRUD{{base-crud.service}}
    MS{{modal.service}}

    %% Servicio shared de definiciones
    SDEF{{definiciones-caracteristicas.service}}

    %% Estado observable
    OP[(listaPropietarios$)]
    OI[(listaInquilinos$)]
    OM[(listaInmuebles$)]

    %% Navegacion
    U --> RDS
    RDS --> RP
    RDS --> RI
    RDS --> RC
    RDS --> RDC1
    RDS --> RDC2
    RDS --> RDC3

    %% Flujos dominio propietarios
    RP --> PC
    PC --> CL
    CL --> IE
    IE -->|ver/editar/eliminar en propietarios| MS
    MS --> MOD
    PC --> SP
    MOD --> SP
    SP --> OP
    OP --> PC

    %% Flujos dominio inquilinos
    RI --> IC
    IC --> CL
    CL --> IE
    IE -.->|apertura directa en inquilinos| MOD
    IC --> SI
    MOD --> SI
    SI --> OI
    OI --> IC

    %% Flujos de creacion compartidos
    RC --> FC
    FC --> FD
    FD -->|entidadCreada| FC
    FC --> SM
    SM --> OM
    OM --> FC

    %% Herencia de servicios CRUD por dominio
    SP -->|extiende| BCRUD
    SI -->|extiende| BCRUD
    SM -->|extiende| BCRUD
    BCRUD -->|GET/POST/PUT/DELETE + lista$| API[(json-server)]

    %% Flujo compartido de definiciones por dominio
    RDC1 --> FCS
    RDC2 --> FCS
    RDC3 --> FCS
    FCS -->|get/set definiciones por dominio| SDEF
    FCS -->|lee dominio activo| RDS

    %% Estilos
    classDef route stroke:#1E88E5,color:#f1f1f1;
    classDef component stroke:#2E7D32;
    classDef shared stroke:#5E35B1;
    classDef service stroke:#F9A825;
    classDef state stroke:#455A64;

    class RP,RI,RC,RDC1,RDC2,RDC3 route;
    class PC,IC,FC component;
    class CL,IE,FD,FCS,MOD shared;
    class RDS,SP,SI,SM,BCRUD,MS,SDEF service;
    class OP,OI,OM state;
```

## Nota

Los servicios RxJS de cada entidad ya no repiten la lógica CRUD principal: `propietario-rxjs.service`, `inquilino-rxjs.service` e `inmuebles-rxjs.service` extienden [base-crud.service](/c:/Users/Octavio/Desktop/Desarrollo/mvpInmo/mvpInmo/src/app/core/http/base-crud.service), que centraliza `cargar`, `crear`, `actualizar`, `eliminar` y el `BehaviorSubject` `lista$`.

En la capa de modales ya existe [modal.service](/c:/Users/Octavio/Desktop/Desarrollo/mvpInmo/mvpInmo/src/app/core/modal/modal.service), que encapsula la apertura del modal compartido. Hoy su uso ya aparece en propietarios; inquilinos todavia conserva apertura directa con `MatDialog`, por eso el diagrama lo muestra como una transicion hacia un flujo mas homogeneo.
