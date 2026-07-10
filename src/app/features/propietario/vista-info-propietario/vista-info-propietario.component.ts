import { Component, input } from '@angular/core';
import { IPropietario } from '../propietario.interface';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-vista-info-propietario',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './vista-info-propietario.component.html',
  styleUrl: './vista-info-propietario.component.scss'
})
export class VistaInfoPropietarioComponent {
  propietario = input<IPropietario | undefined>(undefined)
  
}
