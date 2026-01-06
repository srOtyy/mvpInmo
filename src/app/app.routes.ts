import { Routes } from '@angular/router';
import { InquilinoCComponent } from './features/inquilino/inquilino-c/inquilino-c.component';
import { PropietarioCComponent } from './features/propietario/propietario-c/propietario-c.component';
import { FormularioPropietarioComponent } from './features/propietario/formulario-propietario/formulario-propietario.component';
import { FormularioInquilinoComponent } from './features/inquilino/formulario-inquilino/formulario-inquilino.component';

export const routes: Routes = [
  {
    path: 'propietarios',
    children: [
      { path: 'lista', component: PropietarioCComponent },
      { path: 'crear', component: FormularioPropietarioComponent }
    ]
  },
  {
    path: 'inquilinos',
    children: [
      { path: 'lista', component: InquilinoCComponent },
      { path: 'crear', component: FormularioInquilinoComponent }
    ]
  }
];
