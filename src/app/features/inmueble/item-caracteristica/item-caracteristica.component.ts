import { Component, Input } from '@angular/core';
import { definicionCaracteristicaInmueble } from '../inmueble.interface';

@Component({
  selector: 'app-item-caracteristica',
  standalone: true,
  imports: [],
  templateUrl: './item-caracteristica.component.html',
  styleUrl: './item-caracteristica.component.scss'
})
export class ItemCaracteristicaComponent {

  @Input() caracteristica!: definicionCaracteristicaInmueble;
    
}
