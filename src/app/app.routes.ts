import { Routes } from '@angular/router';
import { InquilinoCComponent } from './features/inquilino/inquilino-c/inquilino-c.component';
import { CrearPropietarioComponent } from './features/propietario/crear-propietario/crear-propietario.component';
import { PropietarioCComponent } from './features/propietario/propietario-c/propietario-c.component';
import { FormularioCaracteristicasComponent } from './shared/formulario-caracteristicas/formulario-caracteristicas.component';
import { CrearInquilinoComponent } from './features/inquilino/crear-inquilino/crear-inquilino.component';
import { CrearInmuebleComponent } from './features/inmueble/crear-inmueble/crear-inmueble.component';
import { InmuebleCComponent } from './features/inmueble/inmueble-c/inmueble-c.component';
import { CrearContratoComponent } from './features/contrato/crear-contrato/crear-contrato.component';
import { ContratoCComponent } from './features/contrato/contrato-c/contrato-c.component';
import { CrearNotificacionComponent } from './features/notificaciones/crear-notificacion/crear-notificacion.component';
import { ListaContratosComponent } from './features/contrato/lista-contratos/lista-contratos.component';
// es necesario pasar rutas "rutas-dinamicas.service"(core/navegacion) a este archivo para que el router pueda reconocerlas
export const routes: Routes = [
  {
    path: 'propietarios',
    children: [
      { path: 'lista', component: PropietarioCComponent },
      { path: 'crear', component: CrearPropietarioComponent },
      { path: 'def_caracteristicas', component: FormularioCaracteristicasComponent }
    ]
  },
  {
    path: 'inquilinos',
    children: [
      { path: 'lista', component: InquilinoCComponent },
      { path: 'crear', component: CrearInquilinoComponent },
      { path: 'def_caracteristicas', component: FormularioCaracteristicasComponent }
    ]
  },
  {
    path: 'inmuebles',
    children: [
      { path: 'lista', component: InmuebleCComponent },
      {path: 'crear', component: CrearInmuebleComponent},
      { path: 'def_caracteristicas', component: FormularioCaracteristicasComponent }
    ]
  },
  {
    path: 'contratos',
    children: [
      { path: 'vista', component: ContratoCComponent },
      { path: 'crear', component: CrearContratoComponent },
      { path: 'lista', component: ListaContratosComponent}
    

    ]
  },
  {
    path: 'notificaciones',
    children: [
      {path: 'crear', component: CrearNotificacionComponent}
    ]
  },
  { path: '**', redirectTo: 'contratos/lista', pathMatch: 'full' }
];
