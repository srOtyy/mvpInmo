import { Component } from '@angular/core';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';

@Component({
  selector: 'app-crear-inquilino',
  standalone: true,
  imports: [FormDinamicoComponent],
  templateUrl: './crear-inquilino.component.html',
  styleUrl: './crear-inquilino.component.scss'
})
export class CrearInquilinoComponent {
  constructor(private inquilinosService: InquilinoRxjsService) {}

  onEntidadCreada(entidad: { caracteristicas: { clave: string; valor: any }[] }): void {
    const nuevoInquilino = {
      id: this.randomId(),
      caracteristicas: entidad.caracteristicas
    };

    this.inquilinosService.agregarInquilino(nuevoInquilino);
  }

  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }
}
