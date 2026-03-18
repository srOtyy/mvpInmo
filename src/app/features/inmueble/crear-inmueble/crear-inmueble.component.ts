import { Component } from '@angular/core';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';
import { CaracteristicaEntidad } from '../../../shared/entity-base.interface';

@Component({
  selector: 'app-crear-inmueble',
  standalone: true,
  imports: [FormDinamicoComponent],
  templateUrl: './crear-inmueble.component.html',
  styleUrl: './crear-inmueble.component.scss'
})
export class CrearInmuebleComponent {
  constructor(private inmueblesService: InmueblesRxjsService) {}

  onEntidadCreada(entidad: { caracteristicas: CaracteristicaEntidad[] }): void {
    const nuevoInmueble = {
      id: this.randomId(),
      caracteristicas: entidad.caracteristicas
    };
  this.inmueblesService.crear(nuevoInmueble);
  }
  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }
}
