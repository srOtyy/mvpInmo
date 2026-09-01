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
    const proximoAumento = this.parseFecha(contrato.proximoAumento);
    const fechaInicio = this.parseFecha(contrato.fechaInicio);
    let fechaBase =
      proximoAumento && !Number.isNaN(proximoAumento.getTime())
        ? proximoAumento
        : fechaInicio;
    if (!fechaBase || Number.isNaN(fechaBase.getTime())) {
      throw new Error(`El contrato ${contrato.id} no tiene una fecha válida`);
    }
    if (contrato.periodoAumento <= 0) {
      throw new Error(`El contrato ${contrato.id} tiene un período inválido`);
    }

    const proximoAumentoCalculado = new Date(fechaBase);
    while (proximoAumentoCalculado <= this.ahora) {
      proximoAumentoCalculado.setMonth(
        proximoAumentoCalculado.getMonth() + contrato.periodoAumento,
      );
    }
    proximoAumentoCalculado.setDate(1);
    return proximoAumentoCalculado;
  }

  calcularDiasRestantes(proximoAumento: Date | string | undefined): number {
    //esto podria devolver numeros negativos como respuesta a que no necesita renovacion
    if (!proximoAumento) return -1;
    const proximoAumentoDate = this.parseFecha(proximoAumento)!;
    if (Number.isNaN(proximoAumentoDate.getTime())) return -1;
    const diferenciaMs = proximoAumentoDate.getTime() - this.ahora.getTime();
    return Math.round(diferenciaMs / this.MS_POR_DIA);
  }

  calcularEstadoDeRenovacion(diasRestantes: number): EstadoRenovacion {
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
    const diasRestantes = this.calcularDiasRestantes(contrato.proximoAumento);
    const necesitaActualizacion =
      !contrato.proximoAumento || diasRestantes <= 0;

    // Paso 1: Actualizar próximo aumento si es necesario
    let contratoActualizado: IContrato;

    if (necesitaActualizacion) {
      const nuevoProximoAumento = this.calcularProximoAumento(contrato);
      contratoActualizado = {
        ...contrato,
        proximoAumento: nuevoProximoAumento,
        estadoRenovacion: this.calcularEstadoDeRenovacion(
          this.calcularDiasRestantes(nuevoProximoAumento),
        ),
      };
    } else {
      contratoActualizado = {
        ...contrato,
        estadoRenovacion: this.calcularEstadoDeRenovacion(diasRestantes),
      };
    }

    // Paso 2: Evaluar el estado de finalización
    contratoActualizado =
      this._finalizacionContrato.evaluarFinalizacion(contratoActualizado);

    // Paso 3: Verificar si hay conflicto entre próximo aumento y fecha de fin
    if (this._finalizacionContrato.aumentoExcedeFin(contratoActualizado)) {
      contratoActualizado.estadoRenovacion = 'porFinalizar';
      console.warn(
        `⚠️ ALERTA: Contrato ${contrato.id} - El próximo aumento excede la fecha de finalización. Contrato marcado como 'por vencer'`,
      );
    }

    return contratoActualizado;
  }
}
