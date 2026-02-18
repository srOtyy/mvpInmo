import { Component, Input } from '@angular/core';
import { IInquilino } from '../../inquilino.interface';
import { InquilinoRxjsService } from '../../inquilino-rxjs.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { SnackbarService } from '../../../../core/snackbar.service';
import { MatButton } from '@angular/material/button';
import { obtenerCaracteristica } from '../../../../shared/entity-helpers';

@Component({
  selector: 'app-eliminar-inquilino',
  standalone: true,
  imports: [MatButton],
  templateUrl: './eliminar-inquilino.component.html',
  styleUrl: './eliminar-inquilino.component.scss'
})
export class EliminarInquilinoComponent {
  @Input() entidad!: IInquilino;
  constructor(private _serviceRxJsInquilinos: InquilinoRxjsService,
    private dialogRef: MatDialogRef <ModalComponent>,
    private _snackbarService: SnackbarService
  ){}

  obtenerCaracteristica = (clave: string) =>
    obtenerCaracteristica(this.entidad, clave);

  confimarEliminarInquilino(){
    this._serviceRxJsInquilinos.eliminarInquilino(this.entidad.id);
    this._snackbarService.mensajeSnackBar('Inquilino eliminado con éxito', 'Cerrar');
    this.cerrarModal()
  }
  cerrarModal(){
    this.dialogRef.close();
  }
}
