
# Diagrama de Flujo — Dominio Inquilinos (estado actual)

```mermaid
flowchart TB

    %% Rutas
    R1[/Ruta: inquilino/lista/]

    %% Componentes
    IC[inquilino-c]

    %% Shared
    CL[shared: card-list]
    IE[shared: item-entidad]


    %% Modales
    ME[modal editar]
    MD[modal eliminar]
    MI[modal ver-info]

    %% Servicio
    S{{inquilinos-rxjs.service}}

    %% Estado
    O[(listaInquilinos$)]

    %% Flujos
    R1 --> IC

    IC -->|Renderiza lista| CL
    CL --> IE

    IE --> ME
    IE --> MD
    IE --> MI

    IC -->|subscribe|S
    ME -->|subscribe| S
    MD -->|subscribe| S

    IC -->|envía nuevo inquilino| S

    S -->|emite cambios| O
    O --> IC

    %% Estilos
    classDef route stroke:#1E88E5, color:#f1f1f1;
    classDef component stroke:#2E7D32;
    classDef service stroke:#F9A825;
    classDef modal stroke:#C2185B;
    classDef shared stroke:#5E35B1;
    classDef state stroke:#455A64;

    class R1, route;
    class IC,FP, component;
    class CL,IE shared;
    class ME,MD,MI modal;
    class S service;
    class O state;

```
