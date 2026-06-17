import { Component, input } from '@angular/core';
import { IPropietario } from '../propietario.interface';

@Component({
  selector: 'app-vista-info-propietario',
  standalone: true,
  imports: [],
  templateUrl: './vista-info-propietario.component.html',
  styleUrl: './vista-info-propietario.component.scss'
})
export class VistaInfoPropietarioComponent {
  propietario = input<IPropietario | undefined>(undefined)
  
}
