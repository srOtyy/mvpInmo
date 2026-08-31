import { inject, Injectable } from '@angular/core';
import { ContratoBbddService } from './contrato-bbdd.service';
import { IContrato } from './contrato.interface';

@Injectable({
  providedIn: 'root',
})
export class FinalizacionContratoService {
  private _contratosService = inject(ContratoBbddService);
  contrato!: IContrato;
  hoy: Date = new Date();

  setContrato(contrato: IContrato) {
    this.contrato = contrato;
  }
  aumentoExcedeFin(proximoAumento?: Date): boolean {
    const fin = this.contrato.fechaFin;
    const proximo = proximoAumento
      ? proximoAumento
      : this.contrato.proximoAumento;
    return proximo.getTime() > fin.getTime();
  }
  calcularDiasDeFinalizacion() {
    const diasRestantes =
      this.contrato.fechaFin.getTime() - this.contrato.proximoAumento.getTime();
    console.log('esto deberia dar positivo:p : ', diasRestantes);
  }
  actualizarContratoConFechaFinalizacion() {
    this._contratosService
      .actualizar(this.contrato.id, this.contrato)
      .subscribe({
        next: (res) => {
          console.log('Actualizacion con exito', res);
        },
        error: (err) => {
          console.warn('Error en la actualizacion', err);
        },
      });
  }
}
