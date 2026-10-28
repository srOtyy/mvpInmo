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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef } from '@angular/material/dialog';
import { IContrato, InformacionAdicional } from '../../contrato.interface';
import { ContratoBbddService } from '../../contrato-bbdd.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { SnackbarService } from '../../../../core/snackbar.service';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-informacion-adicional',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './informacion-adicional.component.html',
  styleUrl: './informacion-adicional.component.scss',
})
export class InformacionAdicionalComponent implements OnInit {
  @Input() entidad!: IContrato;
  arrayDeInformacion: InformacionAdicional[] = [];
  indiceEnEdicion: number | null = null;
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

  ngOnInit(): void {
    this.arrayDeInformacion = (this.entidad?.informacionAdicional ?? []).map(
      (informacion) => ({ ...informacion }),
    );
  }

  guardarInformacion(): void {
    if (this.informacionAdicional.invalid) {
      this.informacionAdicional.markAllAsTouched();
      return;
    }

    const nuevaInformacion: InformacionAdicional = {
      titulo: this.informacionAdicional.controls.titulo.value.trim(),
      valor: this.informacionAdicional.controls.valor.value.trim(),
    };

    const informacionAdicional = [...this.arrayDeInformacion];
    if (this.indiceEnEdicion === null) {
      informacionAdicional.push(nuevaInformacion);
    } else {
      informacionAdicional[this.indiceEnEdicion] = nuevaInformacion;
    }

    this.persistirInformacion(
      informacionAdicional,
      'Información adicional guardada',
    );
  }

  editarInformacion(indice: number): void {
    const informacion = this.arrayDeInformacion[indice];
    if (!informacion) return;

    this.indiceEnEdicion = indice;
    this.informacionAdicional.setValue({ ...informacion });
  }

  eliminarInformacion(indice: number): void {
    const informacion = this.arrayDeInformacion[indice];
    if (!informacion || !window.confirm(`¿Eliminar "${informacion.titulo}"?`)) {
      return;
    }

    const informacionAdicional = this.arrayDeInformacion.filter(
      (_, indiceActual) => indiceActual !== indice,
    );
    this.persistirInformacion(
      informacionAdicional,
      'Información adicional eliminada',
    );
  }

  cancelarEdicion(): void {
    this.indiceEnEdicion = null;
    this.informacionAdicional.reset();
  }

  private persistirInformacion(
    informacionAdicional: InformacionAdicional[],
    mensajeExito: string,
  ): void {
    this._contratosService
      .actualizar(this.entidad.id, { ...this.entidad, informacionAdicional })
      .subscribe({
        next: () => {
          this.arrayDeInformacion = informacionAdicional;
          this.cancelarEdicion();
          this._snackbar.mensajeSnackBar(mensajeExito, 'Cerrar');
        },
        error: () =>
          this._snackbar.mensajeSnackBar(
            'Error al actualizar la información',
            'Cerrar',
          ),
      });
  }
}
