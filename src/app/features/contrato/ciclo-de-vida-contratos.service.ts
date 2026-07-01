import { Injectable } from '@angular/core';
import { IContrato, EstadoRenovacion } from './contrato.interface';

@Injectable({
  providedIn: 'root'
})
export class CicloDeVidaContratosService {
  private ahora: Date = new Date();
  private MS_POR_DIA: number = 1000 * 60 * 60 * 24;

  private parseFecha(fecha: Date | string | undefined): Date | undefined {
    if (!fecha) return undefined;
    return fecha instanceof Date ? fecha : new Date(fecha);
  }

  calcularProximoAumento(contrato: IContrato): Date {
    const fechaInicio = this.parseFecha(contrato.fechaInicio)!;
    const fechaFin = this.parseFecha(contrato.fechaFin)!;
    const proximoAumentoActual = this.parseFecha(contrato.proximoAumento);

    const fechaBase = proximoAumentoActual && proximoAumentoActual > this.ahora
      ? new Date(proximoAumentoActual)
      : new Date(fechaInicio); //por que fecha inicio?

    let nuevaFecha = new Date(fechaBase);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + contrato.periodoAumento);

    while (nuevaFecha <= this.ahora && nuevaFecha < fechaFin) {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + contrato.periodoAumento);
    }

    return nuevaFecha > fechaFin ? new Date(fechaFin) : nuevaFecha;
  }

  calcularDiasRestantes(proximoAumento: Date | string | undefined): number {
    if (!proximoAumento) return -1;
    const proximoAumentoDate = this.parseFecha(proximoAumento)!;
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
    const necesitaActualizacion = !contrato.proximoAumento || diasRestantes < 0;

    if (necesitaActualizacion) {
      return {
        ...contrato,
        proximoAumento: this.calcularProximoAumento(contrato),
        estadoRenovacion: this.calcularEstadoDeRenovacion(this.calcularDiasRestantes(this.calcularProximoAumento(contrato)))
      };
    }

    return {
      ...contrato,
      estadoRenovacion: this.calcularEstadoDeRenovacion(diasRestantes)
    };
  }
}