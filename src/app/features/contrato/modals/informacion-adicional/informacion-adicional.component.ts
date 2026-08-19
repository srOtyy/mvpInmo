import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { IContrato } from '../../contrato.interface';
import { ContratoBbddService } from '../../contrato-bbdd.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { SnackbarService } from '../../../../core/snackbar.service';

@Component({
  selector: 'app-informacion-adicional',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './informacion-adicional.component.html',
  styleUrl: './informacion-adicional.component.scss',
})
export class InformacionAdicionalComponent implements OnInit {
  @Input() entidad!: IContrato;
  informacionAdicional = new FormGroup({
    titulo: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    valor: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  constructor(
    private _contratosService: ContratoBbddService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    private _snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {}

  guardarInformacion(): void {
    if (this.informacionAdicional.invalid) {
      this.informacionAdicional.markAllAsTouched();
      return;
    }

    const nuevaInformacion = {
      titulo: this.informacionAdicional.controls.titulo.value.trim(),
      valor: this.informacionAdicional.controls.valor.value.trim(),
    };
    const informacionAdicional = [
      ...(this.entidad.informacionAdicional ?? []),
      nuevaInformacion,
    ];

    this._contratosService
      .actualizar(this.entidad.id, { ...this.entidad, informacionAdicional })
      .subscribe({
        next: () => {
          this._snackbar.mensajeSnackBar(
            'Información adicional guardada',
            'Cerrar',
          );
          this._dialogRef.close(true);
        },
        error: () =>
          this._snackbar.mensajeSnackBar(
            'Error al guardar la información',
            'Cerrar',
          ),
      });
  }
}
