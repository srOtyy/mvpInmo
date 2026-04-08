import { Component, Input } from '@angular/core';
import { IInquilino } from '../../../inquilino/inquilino.interface';
import { InmueblesRxjsService } from '../../inmuebles-rxjs.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../core/snackbar.service';
import { obtenerCaracteristica } from '../../../caracteristicas/entity-helpers';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-eliminar-inmueble',
  standalone: true,
  imports: [MatButton],
  templateUrl: './eliminar-inmueble.component.html',
  styleUrl: './eliminar-inmueble.component.scss'
})
export class EliminarInmuebleComponent {
  @Input() entidad!: IInquilino;
  constructor(private _serviceRxJsInmueble: InmueblesRxjsService,
    private dialogRef: MatDialogRef <ModalComponent>,
    private _snackbarService: SnackbarService){}

  obtenerCaracteristica = (clave: string) =>
    obtenerCaracteristica(this.entidad, clave);

  confimarEliminarInmueble(){
    this._serviceRxJsInmueble.eliminar(this.entidad.id).subscribe(
      {
        next: () => {
          this._snackbarService.mensajeSnackBar('Inmueble eliminado con éxito', 'Cerrar');
          this.cerrarModal();
        },
        error: () => {
          this._snackbarService.mensajeSnackBar('Error al eliminar inquilino', 'Cerrar');
        }
      }
    );
   
  }
  cerrarModal(){
    this.dialogRef.close();
  }
}
