# Diagrama de Flujo - Dominio Propietarios (patron reutilizable)

```mermaid
flowchart TB
    %% Rutas
    RLISTA[/Ruta: /propietarios/lista/]
    RCREAR[/Ruta: /propietarios/crear/]
    RDEF[/Ruta: /propietarios/def_caracteristicas/]

    %% Componentes
    LC[propietario-c]
    CC[crear-propietario]
    FD[form-dinamico]
    FC[formulario-caracteristicas]
    CL[shared: card-list]
    IE[shared: item-entidad]
    MOD[shared: modal]
    MV[modal: ver-info-propietario]
    ME[modal: editar-propietario]
    MD[modal: eliminar-propietario]

    %% Servicios y estado
    SP{{propietario-rxjs.service}}
    BC{{base-crud.service}}
    MS{{modal.service}}
    SD{{definiciones-caracteristicas.service}}
    EP[(listaPropietarios$)]
    ED[(definiciones propietarios)]

    %% Lista
    RLISTA --> LC
    LC -->|ngOnInit: cargarPropietarios| SP
    SP -->|extiende| BC
    BC -->|GET/POST/PUT/DELETE| API[(json-server)]
    SP --> EP
    EP --> LC
    LC --> CL --> IE
    IE -->|ver/editar/eliminar| MS
    MS --> MOD
    MOD --> MV
    MOD --> ME
    MOD --> MD
    ME -->|actualizarPropietario| SP
    MD -->|eliminarPropietario| SP

    %% Crear
    RCREAR --> CC --> FD
    FD -->|entidadCreada| CC
    CC -->|crearPropietario| SP

    %% Definiciones de caracteristicas
    RDEF --> FC
    FC -->|getDefiniciones$| SD
    FC -->|setDefiniciones| SD
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
    class SP,BC,MS,SD service;
    class EP,ED state;
```

## Nota

Este flujo ya representa mejor el patron que se repite en las demas entidades:

- el componente de lista consume el observable expuesto por el servicio RxJS de su dominio
- el servicio de dominio delega el CRUD comun en [base-crud.service](/c:/Users/Octavio/Desktop/Desarrollo/mvpInmo/mvpInmo/src/app/core/http/base-crud.service)
- la apertura de modales se centraliza en [modal.service](/c:/Users/Octavio/Desktop/Desarrollo/mvpInmo/mvpInmo/src/app/core/modal/modal.service)
- la ruta de creacion reutiliza `form-dinamico` y las definiciones compartidas del dominio
