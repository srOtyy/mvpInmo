import { Routes } from '@angular/router';
import { InquilinoCComponent } from './features/inquilino/inquilino-c/inquilino-c.component';
import { CrearPropietarioComponent } from './features/propietario/crear-propietario/crear-propietario.component';
import { PropietarioCComponent } from './features/propietario/propietario-c/propietario-c.component';
import { FormularioCaracteristicasComponent } from './shared/formulario-caracteristicas/formulario-caracteristicas.component';
import { CrearInquilinoComponent } from './features/inquilino/crear-inquilino/crear-inquilino.component';

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
      {path: 'crear', component: CrearInquilinoComponent},
      { path: 'def_caracteristicas', component: FormularioCaracteristicasComponent }
    ]
  }
];
