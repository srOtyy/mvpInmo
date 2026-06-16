import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { SnackbarService } from '../../../../core/snackbar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { ArquilerApiCalculateResponse, ArquilerApiService } from '../../../../core/ARquilerAPI/arquiler-api.service';
import { IContrato } from '../../contrato.interface';
@Component({
  selector: 'app-solicitar-indice-contrato',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    CurrencyPipe
  ],
  templateUrl: './solicitar-indice-contrato.component.html',
  styleUrl: './solicitar-indice-contrato.component.scss'
})
export class SolicitarIndiceContratoComponent implements OnInit {
  @Input() entidad!: IContrato;

  cargando = false;
  respuesta?: ArquilerApiCalculateResponse;
  formulario: FormGroup;

  readonly tasas = ['ipc', 'icac', 'uva'];

  constructor(
    private formBuilder: FormBuilder,
    private arquilerApiService: ArquilerApiService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private snackbarService: SnackbarService
  ) {
    this.formulario = this.formBuilder.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      months: [1, [Validators.required, Validators.min(1)]],
      rate: ['ipc', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aprovechamos datos reales del contrato para que el usuario no tenga que escribir todo desde cero.
    const fechaBase = this.formatearFechaParaInput(this.entidad.fechaInicio);
    
    this.formulario.patchValue({
      amount: this.entidad.rentaMensual,
      date: fechaBase,
      months: 1,
      rate: 'ipc'
    });
  }

  solicitarIndice(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.snackbarService.mensajeSnackBar('Revisá los campos antes de consultar el índice', 'Cerrar');
      return;
    }

    this.cargando = true;
    const payload = this.formulario.getRawValue();

    this.arquilerApiService.calcularActualizacion({
      amount: Number(payload.amount),
      date: String(payload.date),
      months: Number(payload.months),
      rate: String(payload.rate)
    }).subscribe({
      next: (respuesta) => {
        this.respuesta = respuesta;
        this.cargando = false;
        this.snackbarService.mensajeSnackBar('Índice calculado con éxito', 'Cerrar');
      },
      error: (error: Error) => {
        this.cargando = false;
        this.snackbarService.mensajeSnackBar(error.message, 'Cerrar');
      }
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  formatearFechaDetalle(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      month: 'short',
      year: 'numeric'
    });
  }

  resumirDetalle(detalle: { date: string; month_before: number; accumulate: number }): string {
    return `${this.formatearFechaDetalle(detalle.date)} · ${detalle.month_before}% · acum ${detalle.accumulate}%`;
  }

  private formatearFechaParaInput(fecha: Date | string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toISOString().slice(0, 10);
  }
}
