import { Component } from '@angular/core';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { IPropietario } from '../propietario.interface';
import { PropietarioRxjsService } from '../propietario-rxjs.service';

@Component({
  selector: 'app-crear-propietario',
  standalone: true,
  imports: [FormDinamicoComponent],
  templateUrl: './crear-propietario.component.html',
  styleUrl: './crear-propietario.component.scss'
})
export class CrearPropietarioComponent {
  constructor(private propietariosService: PropietarioRxjsService) {}

  onEntidadCreada(entidad: { caracteristicas: { clave: string; valor: any }[] }): void {
    const nuevoPropietario: IPropietario = {
      id: this.randomId(),
      caracteristicas: entidad.caracteristicas
    };

    this.propietariosService.agregarPropietario(nuevoPropietario);
  }

  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }
}
