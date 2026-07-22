import { Component } from '@angular/core';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { IPropietario } from '../propietario.interface';
import { PropietarioRxjsService } from '../propietario-rxjs.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { CaracteristicaEntidad } from '../../caracteristicas/entity-base.interface';
import { randomId } from '../../../shared/utilitys';
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
      id: randomId(),
      caracteristicas: entidad.caracteristicas,
      listaInmuebles: []
    };

    this.propietariosService.crear(nuevoPropietario).subscribe({
      next: () => {
        this.snack.mensajeSnackBar('Propietario creado exitosamente', 'Cerrar');
      },
      error: () => {
        this.snack.mensajeSnackBar('Error al crear propietario', 'Cerrar');
      }
    })
  }

 
}
