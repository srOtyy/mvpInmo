import { Component } from '@angular/core';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { SnackbarService } from '../../../core/snackbar.service';

@Component({
  selector: 'app-crear-inquilino',
  standalone: true,
  imports: [FormDinamicoComponent],
  templateUrl: './crear-inquilino.component.html',
  styleUrl: './crear-inquilino.component.scss'
})
export class CrearInquilinoComponent {
  constructor(private inquilinosService: InquilinoRxjsService, private snack: SnackbarService) {}

  onEntidadCreada(entidad: { caracteristicas: { clave: string; valor: any }[] }): void {
    const nuevoInquilino = {
      id: this.randomId(),
      caracteristicas: entidad.caracteristicas
    };

    this.inquilinosService.crearInquilino(nuevoInquilino).subscribe({
      next: () => {
        this.snack.mensajeSnackBar('Inquilino creado exitosamente', 'Cerrar');
      },
      error: (error) => {
        this.snack.mensajeSnackBar('Error al crear inquilino', 'Cerrar');
      }
    });
  }

  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }
}
