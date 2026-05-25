import { Component, EventEmitter, Input, Output } from '@angular/core';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { IPropietario } from '../propietario.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-accordion-propietario',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule],
  templateUrl: './accordion-propietario.component.html',
  styleUrl: './accordion-propietario.component.scss'
})
export class AccordionPropietarioComponent {
    @Input() entidad!: IPropietario;
    @Output() eliminar = new EventEmitter<IPropietario>();
    @Output() editar = new EventEmitter<IPropietario>();
    obtenerCaracteristica = (clave: string) =>
      obtenerCaracteristica(this.entidad, clave);
  
}
