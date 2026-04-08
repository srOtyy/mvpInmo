import { Component, Input } from '@angular/core';
import { obtenerCaracteristica } from '../../../caracteristicas/entity-helpers';
import { IInmueble } from '../../inmueble.interface';
import { MatDivider } from '@angular/material/divider';
@Component({
  selector: 'app-ver-inmueble',
  standalone: true,
  imports: [MatDivider],
  templateUrl: './ver-inmueble.component.html',
  styleUrl: './ver-inmueble.component.scss'
})
export class VerInmuebleComponent {
  @Input() entidad!: IInmueble;
      nombre: string = '';
      obtenerCaracteristica = (clave: string) =>
        obtenerCaracteristica(this.entidad, clave);
}
