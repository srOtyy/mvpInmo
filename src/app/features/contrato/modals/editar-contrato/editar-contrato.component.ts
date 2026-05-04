import { Component, Input, OnInit } from '@angular/core';
import { IContrato } from '../../contrato.interface';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { SnackbarService } from '../../../../core/snackbar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { ContratoBbddService } from '../../contrato-bbdd.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-editar-contrato',
  standalone: true,
  imports: [MatFormField,ReactiveFormsModule,MatInputModule,MatButtonModule],
  templateUrl: './editar-contrato.component.html',
  styleUrl: './editar-contrato.component.scss'
})
export class EditarContratoComponent implements OnInit {
  @Input() entidad!: IContrato
  formularioEditarContrato: FormGroup;

  constructor( private formBuilder: FormBuilder,
    private _contratosService: ContratoBbddService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackbarService: SnackbarService
  ){
    this.formularioEditarContrato = this.formBuilder.group({});
  }

  ngOnInit(){
    this.pasarDatosContrato(this.entidad);
  }

  pasarDatosContrato(contratoData: IContrato) {
     this.formularioEditarContrato.setValue({
      id: contratoData.id,
      inquilinoId: contratoData.inquilinoId,
      inmuebleId: contratoData.inmuebleId,
      propietarioId: contratoData.propietarioId,
      fechaInicio: contratoData.fechaInicio,
      fechaFin: contratoData.fechaFin,
      status: contratoData.estado,
      rentaMensual: contratoData.rentaMensual
    });
  }
  guardarCambios(){
    this._contratosService.actualizar(this.entidad.id, this.formularioEditarContrato.value).subscribe({
      next: () => {
        this._snackbarService.mensajeSnackBar('Contrato editado con éxito', 'Cerrar');
        this.dialogRef.close(true);
      },
      error: () => {
        this._snackbarService.mensajeSnackBar('Error al editar contrato', 'Cerrar');
      }
    });
  } 
  
  setContratoNuevo(): IContrato{
    const contratoEditado: IContrato = {
      id: this.formularioEditarContrato.value.id,
      inquilinoId: this.formularioEditarContrato.value.inquilinoId,
      inmuebleId: this.formularioEditarContrato.value.inmuebleId,
      propietarioId: this.formularioEditarContrato.value.propietarioId,
      fechaInicio: this.formularioEditarContrato.value.fechaInicio,
      fechaFin: this.formularioEditarContrato.value.fechaFin,
      estado: this.formularioEditarContrato.value.status,
      rentaMensual: this.formularioEditarContrato.value.rentaMensual
    };
    return contratoEditado;
  }
}
