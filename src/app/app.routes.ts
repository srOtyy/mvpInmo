import { Routes } from '@angular/router';
import { InquilinoCComponent } from './features/inquilino/inquilino-c/inquilino-c.component';
import { PropietarioCComponent } from './features/propietario/propietario-c/propietario-c.component';
import { FormularioCreacionComponent } from './features/inmueble/formulario-creacion/formulario-creacion.component';

export const routes: Routes = [
  {
    path: 'propietarios',
    children: [
      { path: 'lista', component: PropietarioCComponent }
    ]
  },
  {
    path: 'inquilinos',
    children: [
      { path: 'lista', component: InquilinoCComponent }
    ]
  },
  {
    path: 'inmuebles',
    children: [
      { path: 'crear', component: FormularioCreacionComponent}
    ]
  }
];
