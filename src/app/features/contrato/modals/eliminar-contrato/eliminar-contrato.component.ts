import { Component, Input } from '@angular/core';
import { SnackbarService } from '../../../../core/snackbar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { ContratoBbddService } from '../../contrato-bbdd.service';
import { MatDialogRef } from '@angular/material/dialog';
import { IContrato } from '../../contrato.interface';

@Component({
  selector: 'app-eliminar-contrato',
  standalone: true,
  imports: [],
  templateUrl: './eliminar-contrato.component.html',
  styleUrl: './eliminar-contrato.component.scss'
})
export class EliminarContratoComponent {
  @Input() entidad!: IContrato;
  constructor(private _serviceRxJsContratos: ContratoBbddService,
    private dialogRef: MatDialogRef <ModalComponent>,
    private _snackbarService: SnackbarService){}
  confimarEliminarContrato(){
    this._serviceRxJsContratos.eliminar(this.entidad.id).subscribe(
      {
        next: () => {
          this._snackbarService.mensajeSnackBar('Contrato eliminado con éxito', 'Cerrar');
          this.cerrarModal();
        },
        error: () => {
          this._snackbarService.mensajeSnackBar('Error al eliminar contrato', 'Cerrar');
        }
      }
    );
  }
  cerrarModal(){
    this.dialogRef.close();
  }
}
