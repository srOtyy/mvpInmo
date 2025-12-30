import { Routes } from '@angular/router';
import { InquilinoCComponent } from './features/inquilino/inquilino-c/inquilino-c.component';
import { PropietarioCComponent } from './features/propietario/propietario-c/propietario-c.component';
import { FormularioPropietarioComponent } from './features/propietario/formulario-propietario/formulario-propietario.component';

export const routes: Routes = [
    // {path: '', redirectTo: '', pathMatch: 'full', component: },
    {path: 'inquilinos', component:InquilinoCComponent},
    {path: 'propietarios/lista', component: PropietarioCComponent},
    {path: 'propietarios/crear', component: FormularioPropietarioComponent}
];
