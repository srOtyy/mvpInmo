import { Component, Input } from '@angular/core';
import { SnackbarService } from '../../../../core/snackbar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { ContratoBbddService } from '../../contrato-bbdd.service';
import { MatDialogRef } from '@angular/material/dialog';
import { IContrato } from '../../contrato.interface';
import { MatButton } from '@angular/material/button';
import { LiquidacionGeneratorService } from '../../../liquidacion/liquidacion.service';
import { InmueblesRxjsService } from '../../../inmueble/inmuebles-rxjs.service';

@Component({
  selector: 'app-eliminar-contrato',
  imports: [MatButton],
  templateUrl: './eliminar-contrato.component.html',
  styleUrl: './eliminar-contrato.component.scss',
})
export class EliminarContratoComponent {
  @Input() entidad!: IContrato;
  constructor(
    private _serviceRxJsContratos: ContratoBbddService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _liquidacionService: LiquidacionGeneratorService,
    private _snackbarService: SnackbarService,
    private _inmueblesService: InmueblesRxjsService,
  ) {}
  confimarEliminarContrato() {
    this._liquidacionService.eliminarLiquidacionPorIdDeContrato(
      this.entidad.id,
    );
    this._serviceRxJsContratos.eliminar(this.entidad.id).subscribe({
      next: () => {
        this._inmueblesService
          .desactivarInmueble(this.entidad.inmuebleId)
          .subscribe({
            next: () => {
              this._serviceRxJsContratos.$listaInmuebles =
                this._inmueblesService.$lista();
              this._snackbarService.mensajeSnackBar(
                'Contrato eliminado con éxito',
                'Cerrar',
              );
              this.cerrarModal();
            },
            error: () => {
              this._snackbarService.mensajeSnackBar(
                'Contrato eliminado, pero no se pudo reactivar el inmueble',
                'Cerrar',
              );
              this.cerrarModal();
            },
          });
      },
      error: () => {
        this._snackbarService.mensajeSnackBar(
          'Error al eliminar contrato',
          'Cerrar',
        );
      },
    });
  }
  cerrarModal() {
    this.dialogRef.close();
  }
}
