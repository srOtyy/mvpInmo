import { Injectable } from '@angular/core';
import { IContrato } from './contrato.interface';

@Injectable({
  providedIn: 'root',
})
export class FinalizacionContratoService {
  private MS_POR_DIA: number = 1000 * 60 * 60 * 24;
  public ahora: Date = new Date(); // Fecha actual para pruebas

  /**
   * Verifica si el próximo aumento excede la fecha de finalización del contrato
   * Esto indica que el contrato se vencerá antes de que se aplique el próximo aumento
   */
  aumentoExcedeFin(contrato: IContrato, proximoAumento?: Date): boolean {
    const fin = new Date(contrato.fechaFin);
    const proximo = proximoAumento
      ? proximoAumento
      : new Date(contrato.proximoAumento);

    if (Number.isNaN(fin.getTime()) || Number.isNaN(proximo.getTime())) {
      return false;
    }

    return proximo.getTime() > fin.getTime();
  }

  /**
   * Calcula los días restantes hasta la finalización del contrato
   */
  calcularDiasDeFinalizacion(contrato: IContrato): number {
    const fin = new Date(contrato.fechaFin);

    if (Number.isNaN(fin.getTime())) {
      return -1;
    }

    const diferencia = fin.getTime() - this.ahora.getTime();
    return Math.round(diferencia / this.MS_POR_DIA);
  }

  /**
   * Evalúa el estado del contrato en relación a su finalización
   * Retorna el contrato actualizado con los datos de finalización
   *
   * Responsabilidad: Lógica de negocio de finalización
   * La persistencia es responsabilidad de ContratoBbddService
   */
  evaluarFinalizacion(contrato: IContrato): IContrato {
    const diasFinalizacion = this.calcularDiasDeFinalizacion(contrato);
    const proximoAumento = new Date(contrato.proximoAumento);

    // Verificar si el próximo aumento excede la fecha de fin
    const aumentoExcedeFinalizacion = this.aumentoExcedeFin(
      contrato,
      proximoAumento,
    );

    // Determinar el estado del contrato
    let estado = contrato.estado;

    if (diasFinalizacion <= 0) {
      estado = 'finalizado';
      console.log('estado cambiado');
    } else if (aumentoExcedeFinalizacion) {
      contrato.porFinalizar = true;
      console.warn(
        `⚠️ Contrato ${contrato.id}: El próximo aumento (${proximoAumento.toISOString()}) ` +
          `excede la fecha de finalización (${new Date(contrato.fechaFin).toISOString()}), ${contrato.diasFinalizacion} dias restantes`,
      );
    }

    return {
      ...contrato,
      estado,
      diasFinalizacion: diasFinalizacion,
    };
  }
}
