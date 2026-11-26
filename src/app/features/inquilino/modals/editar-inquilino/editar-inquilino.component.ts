import { Component, Input, OnInit } from '@angular/core';
import { IInquilino } from '../../inquilino.interface';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { InquilinoRxjsService } from '../../inquilino-rxjs.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../core/snackbar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { construirCaracteristicasDesdeForm } from '../../../caracteristicas/entity-helpers';
import { GarantesService } from '../../../garantes/garantes.service';
import { Garante } from '../../../garantes/garante-interface';

type GaranteFormGroup = FormGroup<{
  id: FormControl<number>;
  idInquilino: FormControl<number>;
  nombre: FormControl<string>;
  email: FormControl<string>;
  telefono: FormControl<string>;
}>;

@Component({
  selector: 'app-editar-inquilino',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
  ],
  templateUrl: './editar-inquilino.component.html',
  styleUrl: './editar-inquilino.component.scss',
})
export class EditarInquilinoComponent implements OnInit {
  @Input() entidad!: IInquilino;
  formularioEditarInquilino: FormGroup;
  garantesFormArray: FormArray<GaranteFormGroup>;

  constructor(
    private formBuilder: FormBuilder,
    private _inquilinoRxJsService: InquilinoRxjsService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackbarService: SnackbarService,
    private _garantesService: GarantesService,
  ) {
    this.garantesFormArray = this.formBuilder.array<GaranteFormGroup>([]);
    this.formularioEditarInquilino = this.formBuilder.group({
      id: new FormControl(''),
      activo: new FormControl(false),
    });
  }

  ngOnInit() {
    this.pasarDatosInquilino(this.entidad);
  }

  pasarDatosInquilino(inquilinoData: IInquilino) {
    this.garantesFormArray.clear();
    this.formularioEditarInquilino.patchValue({
      id: inquilinoData.id,
      activo: inquilinoData.activo,
    });

    inquilinoData.caracteristicas.forEach((c) => {
      this.formularioEditarInquilino.addControl(
        c.clave,
        new FormControl(c.valor),
      );
    });

    inquilinoData.garantes?.forEach((garante) => this.cargarGarante(garante));
  }

  agregarGarante(): void {
    this.cargarGarante(
      this._garantesService.crearGarante(this.entidad.id, '', '', ''),
    );
  }

  quitarGarante(indice: number): void {
    this.garantesFormArray.removeAt(indice);
  }

  private cargarGarante(garante: Garante): void {
    this.garantesFormArray.push(
      this.formBuilder.nonNullable.group({
        id: garante.id,
        idInquilino: garante.idInquilino,
        nombre: garante.nombre,
        email: garante.email,
        telefono: garante.telefono,
      }),
    );
  }

  guardarCambios() {
    this._inquilinoRxJsService
      .actualizar(this.entidad.id, this.setInquilinoNuevo())
      .subscribe({
        next: () => {
          this._snackbarService.mensajeSnackBar(
            'Inquilino editado con éxito',
            'Cerrar',
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this._snackbarService.mensajeSnackBar(
            'Error al editar inquilino',
            'Cerrar',
          );
        },
      });
  }

  setInquilinoNuevo(): IInquilino {
    const inquilinoEditado: IInquilino = {
      id: this.formularioEditarInquilino.value.id,
      caracteristicas: construirCaracteristicasDesdeForm(
        this.formularioEditarInquilino,
      ),
      garantes: this.garantesFormArray.getRawValue(),
      activo: this.formularioEditarInquilino.value.activo,
    };
    return inquilinoEditado;
  }
}
