# Diagrama de Flujo - Dominio Inquilinos (actualizado)

```mermaid
flowchart TB
    %% Rutas
    RLISTA[/Ruta: /inquilinos/lista/]
    RCREAR[/Ruta: /inquilinos/crear/]
    RDEF[/Ruta: /inquilinos/def_caracteristicas/]

    %% Componentes
    LC[inquilino-c]
    CC[crear-inquilino]
    FD[form-dinamico]
    FC[formulario-caracteristicas]
    CL[shared: card-list]
    IE[shared: item-entidad]
    MOD[shared: modal]
    MV[modal: ver-inquilino]
    ME[modal: editar-inquilino]
    MD[modal: eliminar-inquilino]

    %% Servicios y estado
    SI{{inquilino-rxjs.service}}
    SD{{definiciones-caracteristicas.service}}
    EI[(listaInquilinos$)]
    ED[(definiciones inquilinos)]

    %% Lista
    RLISTA --> LC
    LC -->|ngOnInit: cargarInquilinos()| SI
    SI -->|GET/POST/PUT/DELETE| API[(json-server)]
    SI --> EI
    EI --> LC
    LC --> CL --> IE
    IE -->|ver/editar/eliminar| MOD
    MOD --> MV
    MOD --> ME
    MOD --> MD
    ME -->|actualizarInquilino()| SI
    MD -->|eliminarInquilino()| SI

    %% Crear
    RCREAR --> CC --> FD
    FD -->|entidadCreada| CC
    CC -->|crearInquilino()| SI

    %% Definiciones de caracteristicas
    RDEF --> FC
    FC -->|getDefiniciones$()| SD
    FC -->|setDefiniciones()| SD
    SD -->|GET/POST/PATCH| API
    SD --> ED
    ED --> FD

    %% Estilos
    classDef route stroke:#1E88E5,color:#f1f1f1;
    classDef component stroke:#2E7D32;
    classDef service stroke:#F9A825;
    classDef modal stroke:#C2185B;
    classDef shared stroke:#5E35B1;
    classDef state stroke:#455A64;

    class RLISTA,RCREAR,RDEF route;
    class LC,CC,FD,FC component;
    class CL,IE,MOD shared;
    class MV,ME,MD modal;
    class SI,SD service;
    class EI,ED state;
```
