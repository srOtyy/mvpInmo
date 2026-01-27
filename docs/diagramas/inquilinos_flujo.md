
# Diagrama de Flujo — Dominio Inquilinos (estado actual)

```mermaid
flowchart TB

    %% Rutas
    R1[/Ruta: inquilino/lista/]
    R2[/Ruta: inquilino/crear/]

    %% Componentes
    PC[inquilino-c]
    FP[formulario-inquilino]
    IP[item-inquilino]

    %% Shared
    CL[shared: card-list]

    %% Modales
    ME[modal editar]
    MD[modal eliminar]
    MI[modal ver-info]

    %% Servicio
    S{{inquilinos-rxjs.service}}

    %% Estado
    O[(listaInquilinos$)]

    %% Flujos
    R1 --> PC
    R2 --> FP

    PC -->|Renderiza lista| CL
    CL --> IP

    IP --> ME
    IP --> MD
    IP --> MI

    PC -->|subscribe| S
    ME -->|subscribe| S
    MD -->|subscribe| S

    FP -->|envía nuevo inquilino| S

    S -->|emite cambios| O
    O --> PC

    %% Estilos
    classDef route stroke:#1E88E5, color:#f1f1f1;
    classDef component stroke:#2E7D32;
    classDef service stroke:#F9A825;
    classDef modal stroke:#C2185B;
    classDef shared stroke:#5E35B1;
    classDef state stroke:#455A64;

    class R1,R2 route;
    class PC,FP,IP component;
    class CL shared;
    class ME,MD,MI modal;
    class S service;
    class O state;

```
