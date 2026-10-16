import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IContrato } from '../../contrato.interface';
import { EglaiService } from '../../eglai.service';
import { LiquidacionGeneratorService } from '../../../liquidacion/liquidacion.service';
import { Liquidacion } from '../../../liquidacion/liquidacion-interface';
import { SeguimientoEGLAI } from '../../eglai.interface';

@Component({
  selector: 'app-eglai',
  imports: [MatSlideToggleModule],
  templateUrl: './eglai.component.html',
  styleUrl: './eglai.component.scss',
})
export class EGLAIComponent implements OnInit {
  @Input() entidad!: IContrato;
  private _liquidacionService = inject(LiquidacionGeneratorService);
  liquidacionAuxiliar: Liquidacion = {} as Liquidacion;
  guardando = false;
  readonly servicios: { key: keyof SeguimientoEGLAI; label: string }[] = [
    { key: 'expensas', label: 'Expensas' },
    { key: 'gas', label: 'Gas' },
    { key: 'luz', label: 'Luz' },
    { key: 'agua', label: 'Agua' },
    { key: 'internet', label: 'Internet' },
  ];

  ngOnInit(): void {
    this.liquidacionAuxiliar =
      this._liquidacionService.buscarLiquidacionPorContrato(
        this.entidad.id,
      ) as Liquidacion;
    if (this.liquidacionAuxiliar === undefined) {
      console.warn(
        'No se encontró una liquidación para el contrato con ID:',
        this.entidad.id,
      );
      return;
    }

    this.liquidacionAuxiliar.EGLAI ??= {
      expensas: 'no-requerido',
      gas: 'no-requerido',
      luz: 'no-requerido',
      agua: 'no-requerido',
      internet: 'no-requerido',
    };
  }

  cambiarEstado(servicio: keyof SeguimientoEGLAI, pendiente: boolean): void {
    if (this.guardando || !this.liquidacionAuxiliar.id) return;

    const estadoAnterior = this.liquidacionAuxiliar.EGLAI[servicio];
    this.liquidacionAuxiliar.EGLAI[servicio] = pendiente
      ? 'pendiente'
      : 'no-requerido';
    this.guardando = true;

    this._liquidacionService
      .actualizar(this.liquidacionAuxiliar.id, this.liquidacionAuxiliar)
      .subscribe({
        next: () => (this.guardando = false),
        error: (error) => {
          this.liquidacionAuxiliar.EGLAI[servicio] = estadoAnterior;
          this.guardando = false;
          console.error('No se pudo actualizar el seguimiento EGLAI', error);
        },
      });
  }

  etiquetaEstado(servicio: keyof SeguimientoEGLAI): string {
    const estado = this.liquidacionAuxiliar.EGLAI[servicio];
    if (estado === 'pendiente') return 'Pendiente';
    if (estado === 'cargado') return 'Cargado';
    return 'No requerido';
  }
}
