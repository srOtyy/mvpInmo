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

    const diasRestantes = this.calcularDiasRestantes(contrato.proximoAumento);
    const aumentoPendiente = diasRestantes <= 0;

    const cambios: Partial<IContrato> = {
      requiereAccion: aumentoPendiente,
      estadoRenovacion: this.calcularEstadoDeRenovacion({
        ...contrato,
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
