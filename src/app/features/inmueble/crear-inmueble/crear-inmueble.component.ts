import { Component } from '@angular/core';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';

@Component({
  selector: 'app-crear-inmueble',
  standalone: true,
  imports: [FormDinamicoComponent],
  templateUrl: './crear-inmueble.component.html',
  styleUrl: './crear-inmueble.component.scss'
})
export class CrearInmuebleComponent {
  constructor(private inmueblesService: InmueblesRxjsService) {}

  onEntidadCreada(entidad: { caracteristicas: { clave: string; valor: any }[] }): void {
    const nuevoInmueble = {
      id: this.randomId(),
      caracteristicas: entidad.caracteristicas
    };
  this.inmueblesService.agregarInmueble(nuevoInmueble);
  }
  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }
}
