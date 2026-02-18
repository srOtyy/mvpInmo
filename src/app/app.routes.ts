import { Routes } from '@angular/router';
import { InquilinoCComponent } from './features/inquilino/inquilino-c/inquilino-c.component';
import { PropietarioCComponent } from './features/propietario/propietario-c/propietario-c.component';
import { FormularioCreacionComponent } from './features/inmueble/formulario-creacion/formulario-creacion.component';
import { FormularioCaracteristicasComponent } from './shared/formulario-caracteristicas/formulario-caracteristicas.component';

export const routes: Routes = [
  {
    path: 'propietarios',
    children: [
      { path: 'lista', component: PropietarioCComponent },
      { path: 'def_caracteristicas', component: FormularioCaracteristicasComponent }
    ]
  },
  {
    path: 'inquilinos',
    children: [
      { path: 'lista', component: InquilinoCComponent },
      { path: 'def_caracteristicas', component: FormularioCaracteristicasComponent }
    ]
  },
  {
    path: 'inmuebles',
    children: [
      { path: 'crear', component: FormularioCreacionComponent},
      { path: 'def_caracteristicas', component: FormularioCaracteristicasComponent }
    ]
  }
];
