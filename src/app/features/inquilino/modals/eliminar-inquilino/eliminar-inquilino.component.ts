import { Component, Input } from '@angular/core';
import { IInquilino } from '../../inquilino.interface';
import { InquilinoRxjsService } from '../../inquilino-rxjs.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { SnackbarService } from '../../../../core/snackbar.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-eliminar-inquilino',
  standalone: true,
  imports: [MatButton],
  templateUrl: './eliminar-inquilino.component.html',
  styleUrl: './eliminar-inquilino.component.scss'
})
export class EliminarInquilinoComponent {
  @Input() inquilino!: IInquilino;
  constructor(private _serviceRxJsInquilinos: InquilinoRxjsService,
    private dialogRef: MatDialogRef <ModalComponent>,
    private _snackbarService: SnackbarService
  ){}

  confimarEliminarInquilino(){
    this._serviceRxJsInquilinos.eliminarInquilino(this.inquilino.id);
    this._snackbarService.mensajeSnackBar('Inquilino eliminado con éxito', 'Cerrar');
    this.cerrarModal()
  }
  cerrarModal(){
    this.dialogRef.close();
  }
}
