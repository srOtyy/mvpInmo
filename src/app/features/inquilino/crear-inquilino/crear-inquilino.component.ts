import { Component } from '@angular/core';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { SnackbarService } from '../../../core/snackbar.service';
import { CaracteristicaEntidad } from '../../caracteristicas/entity-base.interface';
import { randomId } from '../../../shared/utilitys';
@Component({
  selector: 'app-crear-inquilino',
  standalone: true,
  imports: [FormDinamicoComponent],
  templateUrl: './crear-inquilino.component.html',
  styleUrl: './crear-inquilino.component.scss'
})
export class CrearInquilinoComponent {
  constructor(private inquilinosService: InquilinoRxjsService, private snack: SnackbarService) {}

  onEntidadCreada(entidad: { caracteristicas: CaracteristicaEntidad[] }): void {
    const nuevoInquilino = {
      id: randomId(),
      caracteristicas: entidad.caracteristicas
    };

    this.inquilinosService.crear(nuevoInquilino).subscribe({
      next: () => {
        this.snack.mensajeSnackBar('Inquilino creado exitosamente', 'Cerrar');
      },
      error: (error) => {
        this.snack.mensajeSnackBar('Error al crear inquilino', 'Cerrar');
      }
    });
  }
}
