import { Routes } from '@angular/router';
import { InquilinoCComponent } from './features/inquilino/inquilino-c/inquilino-c.component';
import { PropietarioCComponent } from './features/propietario/propietario-c/propietario-c.component';

export const routes: Routes = [
    // {path: '', redirectTo: '', pathMatch: 'full', component: },
    {path: 'inquilino', component:InquilinoCComponent},
    {path: 'propietario', component: PropietarioCComponent}
];
