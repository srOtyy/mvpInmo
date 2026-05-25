import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IInmueble } from '../inmueble.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-accordion-inmueble',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule],
  templateUrl: './accordion-inmueble.component.html',
  styleUrl: './accordion-inmueble.component.scss'
})
export class AccordionInmuebleComponent {
    @Input() entidad!: IInmueble;
    @Output() eliminar = new EventEmitter<IInmueble>();
    @Output() editar = new EventEmitter<IInmueble>()
  
}
