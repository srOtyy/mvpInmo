import { Component, Input } from '@angular/core';
import { IInquilino } from '../../inquilino.interface';
import { MatDividerModule } from '@angular/material/divider';
import { obtenerCaracteristica } from '../../../caracteristicas/entity-helpers';

@Component({
  selector: 'app-ver-inquilino',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './ver-inquilino.component.html',
  styleUrl: './ver-inquilino.component.scss'
})
export class VerInquilinoComponent {
   @Input() entidad!: any; // Cambia 'any' por el tipo específico de tu entidad, por ejemplo, IInquilino
    obtenerCaracteristica = (clave: string) =>
      obtenerCaracteristica(this.entidad, clave);
}
