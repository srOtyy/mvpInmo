import { inject, Injectable } from '@angular/core';
import { IContrato, EstadoRenovacion } from './contrato.interface';
import { FinalizacionContratoService } from './finalizacion-contrato.service';

@Injectable({
  providedIn: 'root',
})
export class CicloDeVidaContratosService {
  public ahora: Date = new Date(); // Fecha actual para pruebas
  private MS_POR_DIA: number = 1000 * 60 * 60 * 24;
  private _finalizacionContrato = inject(FinalizacionContratoService);

  constructor() {}

  private parseFecha(fecha: Date | string | undefined): Date | undefined {
    if (!fecha) return undefined;
    return fecha instanceof Date ? fecha : new Date(fecha);
  }

  calcularProximoAumento(contrato: IContrato): Date {
    const fechaBase = contrato.proximoAumento
      ? this.parseFecha(contrato.proximoAumento)
      : this.parseFecha(contrato.fechaInicio);

    if (!fechaBase || Number.isNaN(fechaBase.getTime())) {
      throw new Error(`El contrato ${contrato.id} no tiene una fecha válida`);
    }
    if (contrato.periodoAumento <= 0) {
      throw new Error(`El contrato ${contrato.id} tiene un período inválido`);
    }

    const resultado = new Date(fechaBase);
    resultado.setDate(1);
    while (resultado <= this.ahora) {
      resultado.setMonth(resultado.getMonth() + contrato.periodoAumento);
    }
    return resultado;
  }

  calcularDiasRestantes(proximoAumento: Date | string | undefined): number {
    //esto podria devolver numeros negativos como respuesta a que no necesita renovacion
    if (!proximoAumento) return -1;
    const proximoAumentoDate = this.parseFecha(proximoAumento)!;
    if (Number.isNaN(proximoAumentoDate.getTime())) return -1;
    const diferenciaMs = proximoAumentoDate.getTime() - this.ahora.getTime();
    return Math.round(diferenciaMs / this.MS_POR_DIA);
  }

  calcularEstadoDeRenovacion(contrato: IContrato): EstadoRenovacion {
    const diasRestantes = this.calcularDiasRestantes(contrato.proximoAumento);
    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes === 0) return 'hoy';
    if (diasRestantes <= 30) return 'un_mes';
    if (diasRestantes <= 60) return 'dos_meses';
    return 'normal';
  }
  /**
   * Evalúa el ciclo de vida completo del contrato
   * Incluye: próximo aumento, estado de renovación y finalización
   */
  evaluarContrato(contrato: IContrato): IContrato {
    // Bloqueo: hay una acción pendiente, no se recalcula proximoAumento.
    if (contrato.requiereAccion) {
      return this.aplicarEvaluacionFinal(contrato, {
        estadoRenovacion: this.calcularEstadoDeRenovacion(contrato),
      });
    }

    const necesitaCalcularFecha = !contrato.proximoAumento;
    const proximoAumento = necesitaCalcularFecha
      ? this.calcularProximoAumento(contrato)
      : contrato.proximoAumento;

    const diasRestantes = this.calcularDiasRestantes(proximoAumento);
    const aumentoPendiente = Boolean(proximoAumento) && diasRestantes <= 0;

    const cambios: Partial<IContrato> = {
      proximoAumento,
      requiereAccion: aumentoPendiente,
      estadoRenovacion: this.calcularEstadoDeRenovacion({
        ...contrato,
        proximoAumento,
      }),
    };

    return this.aplicarEvaluacionFinal(contrato, cambios);
  }
  // Unifica Paso 2 + Paso 3, sin duplicar aumentoExcedeFin ni el warning.
  private aplicarEvaluacionFinal(
    contrato: IContrato,
    cambios: Partial<IContrato>,
  ): IContrato {
    const intermedio = { ...contrato, ...cambios };
    const evaluado = this._finalizacionContrato.evaluarFinalizacion(intermedio);

    if (this._finalizacionContrato.aumentoExcedeFin(evaluado)) {
      return {
        ...evaluado,
        estadoRenovacion: 'porFinalizar',
        porFinalizar: true,
      };
    }
    return evaluado;
  }
}
