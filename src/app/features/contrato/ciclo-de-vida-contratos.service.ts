import { Injectable, OnInit } from '@angular/core';
import { IContrato, EstadoRenovacion } from './contrato.interface';
import { ContratoBbddService } from './contrato-bbdd.service';

@Injectable({
  providedIn: 'root'
})
export class CicloDeVidaContratosService{
  public ahora: Date = new Date();
  private MS_POR_DIA: number = 1000 * 60 * 60 * 24;
  

  constructor(){}
  private parseFecha(fecha: Date | string | undefined): Date | undefined {
    if (!fecha) return undefined;
    return fecha instanceof Date ? fecha : new Date(fecha);
  }

  

  calcularProximoAumento(contrato: IContrato): Date {
    const proximoAumentoActual = new Date(contrato.proximoAumento);
    const proximoAumentoCalculado = new Date(proximoAumentoActual);
    proximoAumentoCalculado.setMonth(proximoAumentoActual.getMonth() + contrato.periodoAumento);
    return proximoAumentoCalculado 
  }

  calcularDiasRestantes(proximoAumento: Date | string | undefined): number {
    //esto podria devolver numeros negativos como respuesta a que no necesita renovacion
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
      console.log("Necesita actualizacion")
      return {
        ...contrato,
        proximoAumento: this.calcularProximoAumento(contrato),
        estadoRenovacion: this.calcularEstadoDeRenovacion(this.calcularDiasRestantes(this.calcularProximoAumento(contrato)))
      };
    }else{
      console.log("no necesita actualizacion")
      return {
      ...contrato,
      estadoRenovacion: this.calcularEstadoDeRenovacion(diasRestantes)
      };
    }

    
  }
  
}