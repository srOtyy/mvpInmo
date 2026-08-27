import { Injectable } from '@angular/core';
import { IContrato, EstadoRenovacion } from './contrato.interface';

@Injectable({
  providedIn: 'root',
})
export class CicloDeVidaContratosService {
  public ahora: Date = new Date(); // Fecha actual para pruebas
  private MS_POR_DIA: number = 1000 * 60 * 60 * 24;

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

  evaluarContrato(contrato: IContrato): IContrato {
    const diasRestantes = this.calcularDiasRestantes(contrato.proximoAumento);
    const necesitaActualizacion =
      !contrato.proximoAumento || diasRestantes <= 0;

    if (necesitaActualizacion) {
      const contratoActualizado = {
        ...contrato,
        proximoAumento: this.calcularProximoAumento(contrato),
        estadoRenovacion: this.calcularEstadoDeRenovacion(
          this.calcularDiasRestantes(this.calcularProximoAumento(contrato)),
        ),
      };
      return contratoActualizado;
    } else {
      console.log('no necesita actualizacion');
      return {
        ...contrato,
        estadoRenovacion: this.calcularEstadoDeRenovacion(diasRestantes),
      };
    }
  }
}
