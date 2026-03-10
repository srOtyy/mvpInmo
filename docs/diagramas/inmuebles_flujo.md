# Diagrama de Flujo - Dominio Inmuebles (actualizado)

```mermaid
flowchart TB
    %% Rutas
    RCREAR[/Ruta: /inmuebles/crear/]
    RDEF[/Ruta: /inmuebles/def_caracteristicas/]

    %% Componentes
    CC[crear-inmueble]
    FD[form-dinamico]
    FC[formulario-caracteristicas]

    %% Servicios y estado
    SI{{inmuebles-rxjs.service}}
    SD{{definiciones-caracteristicas.service}}
    EI[(listaInmuebles$)]
    ED[(definiciones inmuebles)]

    %% Crear (estado en memoria)
    RCREAR --> CC --> FD
    FD -->|entidadCreada| CC
    CC -->|agregarInmueble()| SI
    SI --> EI

    %% Definiciones de caracteristicas
    RDEF --> FC
    FC -->|getDefiniciones$()| SD
    FC -->|setDefiniciones()| SD
    SD -->|GET/POST/PATCH| API[(json-server)]
    SD --> ED
    ED --> FD

    %% Estilos
    classDef route stroke:#1E88E5,color:#f1f1f1;
    classDef component stroke:#2E7D32;
    classDef service stroke:#F9A825;
    classDef state stroke:#455A64;

    class RCREAR,RDEF route;
    class CC,FD,FC component;
    class SI,SD service;
    class EI,ED state;
```
