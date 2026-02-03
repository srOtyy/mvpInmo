import { Component, Input } from '@angular/core';
import { IPropietario } from '../../propietario.interface';
import { MatDividerModule } from '@angular/material/divider';
import { obtenerCaracteristica } from '../../../../shared/entity-helpers';

@Component({
  selector: 'app-ver-info-propietario',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './ver-info-propietario.component.html',
  styleUrl: './ver-info-propietario.component.scss'
})
export class VerInfoPropietarioComponent {
  @Input() entidad!: IPropietario;
  obtenerCaracteristica = (clave: string) =>
    obtenerCaracteristica(this.entidad, clave);
}
