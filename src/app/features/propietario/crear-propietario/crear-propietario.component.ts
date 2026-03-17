import { Component } from '@angular/core';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { IPropietario } from '../propietario.interface';
import { PropietarioRxjsService } from '../propietario-rxjs.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { DefinicionCaracteristica } from '../../../shared/definicion-caracteristica.interface';
import { CaracteristicaEntidad } from '../../../shared/entity-base.interface';

@Component({
  selector: 'app-crear-propietario',
  standalone: true,
  imports: [FormDinamicoComponent],
  templateUrl: './crear-propietario.component.html',
  styleUrl: './crear-propietario.component.scss'
})
export class CrearPropietarioComponent {

  constructor(private propietariosService: PropietarioRxjsService,
    private snack: SnackbarService
  ) {}

  onEntidadCreada(entidad: { caracteristicas: CaracteristicaEntidad[] }): void {
    const nuevoPropietario: IPropietario = {
      id: this.randomId(),
      caracteristicas: entidad.caracteristicas
    };

    this.propietariosService.crearPropietario(nuevoPropietario).subscribe({
      next: () => {
        this.snack.mensajeSnackBar('Propietario creado exitosamente', 'Cerrar');
      },
      error: (error) => {
        this.snack.mensajeSnackBar('Error al crear propietario', 'Cerrar');
      }
    })
  }

  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }
}
