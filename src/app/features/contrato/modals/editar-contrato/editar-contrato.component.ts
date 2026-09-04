import { Component, inject, Input, OnInit } from '@angular/core';
import { IContrato } from '../../contrato.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackbarService } from '../../../../core/snackbar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { ContratoBbddService } from '../../contrato-bbdd.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { obtenerCaracteristica } from '../../../caracteristicas/entity-helpers';
import { LiquidacionGeneratorService } from '../../../liquidacion/liquidacion.service';
@Component({
  selector: 'app-editar-contrato',
  imports: [
    MatFormField,
    MatInputModule,
    MatButton,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './editar-contrato.component.html',
  styleUrl: './editar-contrato.component.scss',
})
export class EditarContratoComponent implements OnInit {
  private _liquidacionService = inject(LiquidacionGeneratorService);
  @Input() entidad!: IContrato;
  formularioEditarContrato: FormGroup;
  obtenerCaracteristica = obtenerCaracteristica;
  deshabiliado = true;
  estadosLista: string[] = [
    'preliminar',
    'activo',
    'finalizado',
    'cancelado',
    'renovar',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private _contratosService: ContratoBbddService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackbarService: SnackbarService,
  ) {
    this.formularioEditarContrato = this.formBuilder.group({
      id: [''],
      inquilinoId: [''],
      inmuebleId: [''],
      fechaFin: [''],
      fechaInicio: [''],
      propietarioId: [''],
      estado: [''],
      estadoRenovacion: [''],
      rentaMensual: [''],
      titulo: [''],
      proximoAumento: [''],
      registroDeActividad: [''],
      porcentajeHonorarios: [''],
      tipoPago: [''],
      tipoIndice: [''],
      periodoAumento: [''],
      inicioDelPeriodo: [''],
      informacionAdicional: [[]],
      administracionTotal: [false],
      diasFinalizacion: [''],
      porFinalizar: [false],
      requiereAccion: [false],
    });
    this.formularioEditarContrato.get('inmuebleId')?.disable();
    this.formularioEditarContrato.get('propietarioId')?.disable();
    this.formularioEditarContrato.get('inquilinoId')?.disable();
  }
  async ngOnInit(): Promise<void> {
    this.pasarDatosContrato(this.entidad);

    await this._contratosService.obtenerListas().catch((error) => {
      console.error(
        'Error al cargar las listas para el formulario de contratos:',
        error,
      );
      this._snackbarService.mensajeSnackBar(
        'Error al cargar datos para el formulario',
        'Cerrar',
      );
    });
  }

  pasarDatosContrato(contratoData: IContrato) {
    this.formularioEditarContrato.patchValue({
      id: contratoData.id,
      inquilinoId: contratoData.inquilinoId,
      inmuebleId: contratoData.inmuebleId,
      propietarioId: contratoData.propietarioId,
      fechaFin: contratoData.fechaFin,
      fechaInicio: contratoData.fechaInicio,
      estado: contratoData.estado,
      estadoRenovacion: contratoData.estadoRenovacion,
      rentaMensual: contratoData.rentaMensual,
      periodoAumento: contratoData.periodoAumento,
      informacionAdicional: contratoData.informacionAdicional,
      titulo: contratoData.titulo,
      proximoAumento: contratoData.proximoAumento,
      registroDeActividad: contratoData.registroActividad,
      porcentajeHonorarios: contratoData.porcentajeHonorarios,
      tipoPago: contratoData.tipoPago,
      inicioDelPeriodo: contratoData.inicioDelPeriodo,
      tipoIndice: contratoData.tipoIndice,
      administracionTotal: contratoData.administracionTotal,
      diasFinalizacion: contratoData.diasFinalizacion,
      porFinalizar: contratoData.porFinalizar,
      requiereAccion: contratoData.requiereAccion,
    });
  }
  guardarCambios() {
    this._liquidacionService.actualizarHonorarios(
      this.entidad.id,
      this.entidad.porcentajeHonorarios,
    );
    this.formularioEditarContrato.get('inmuebleId')?.enable();
    this.formularioEditarContrato.get('propietarioId')?.enable();
    this.formularioEditarContrato.get('inquilinoId')?.enable();
    this._contratosService
      .actualizar(this.entidad.id, this.formularioEditarContrato.value)
      .subscribe({
        next: () => {
          this._snackbarService.mensajeSnackBar(
            'Contrato editado con éxito',
            'Cerrar',
          );
          this.dialogRef.close(true);
          this._contratosService.seleccionarContrato(
            this.formularioEditarContrato.value,
          ); //enviar el nuevo contrato al componente que lo esta mostrando
          //enviar el nuevo contrato al componente que lo esta mostrando
        },
        error: () => {
          this._snackbarService.mensajeSnackBar(
            'Error al editar contrato',
            'Cerrar',
          );
        },
      });
  }
  get propietariosLista() {
    return this._contratosService.$listaPropietarios;
  }
  get inquilinosLista() {
    return this._contratosService.$listaInquilinos;
  }
  get inmueblesLista() {
    return this._contratosService.$listaInmuebles;
  }
}
