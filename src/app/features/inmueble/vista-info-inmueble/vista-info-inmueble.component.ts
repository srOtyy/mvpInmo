import { Component, input } from '@angular/core';
import { IInmueble } from '../inmueble.interface';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-vista-info-inmueble',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './vista-info-inmueble.component.html',
  styleUrl: './vista-info-inmueble.component.scss',
})
export class VistaInfoInmuebleComponent {
  inmueble = input<IInmueble | undefined>(undefined);
}
