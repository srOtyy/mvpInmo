import { Component, Input } from '@angular/core';
import { IPropietario } from '../../propietario.interface';
import { PropietarioRxjsService } from '../../propietario-rxjs.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../../../../core/snackbar.service';
import { obtenerCaracteristica } from '../../../../shared/entity-helpers';
@Component({
  selector: 'app-eliminar-propietario',
  standalone: true,
  imports: [MatButton],
  templateUrl: './eliminar-propietario.component.html',
  styleUrl: './eliminar-propietario.component.scss'
})
export class EliminarPropietarioComponent {
  @Input() entidad!: IPropietario;
  constructor(private _serviceRxJsPropietarios: PropietarioRxjsService, private dialogRef: MatDialogRef <ModalComponent>, private _snackbarService: SnackbarService){}

  obtenerCaracteristica = (clave: string) =>
    obtenerCaracteristica(this.entidad, clave);

  confirmarEliminarPropietario(){
    this._serviceRxJsPropietarios.eliminarPropietario(this.entidad.id);
    this._snackbarService.mensajeSnackBar('Propietario eliminado con éxito', 'Cerrar');
    this.cerrarModal()
  }
  cerrarModal(){
    this.dialogRef.close();
  }
}
