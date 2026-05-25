import { Component, EventEmitter, Input, Output } from '@angular/core';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { IInquilino } from '../inquilino.interface';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-accordion-inquilino',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, MatStepperModule, MatIconModule],
  templateUrl: './accordion-inquilino.component.html',
  styleUrl: './accordion-inquilino.component.scss'
})
export class AccordionInquilinoComponent {
     @Input() entidad!: IInquilino;
     @Output() eliminar = new EventEmitter<IInquilino>();
     @Output() editar = new EventEmitter<IInquilino>();
     
      obtenerCaracteristica = (clave: string) =>
        obtenerCaracteristica(this.entidad, clave);
}
