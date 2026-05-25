import { Injectable } from '@angular/core';
import { Garante } from './garante-interface';
import {randomId} from '../../shared/utilitys';
import { IInquilino } from '../inquilino/inquilino.interface';

@Injectable({
  providedIn: 'root'
})
export class GarantesService {

  constructor() { }

  crearGarante(idInquilino: number, nombre: string, telefono: string, email: string): Garante {
    return {
      id: randomId(),
      idInquilino: idInquilino,
      nombre: nombre,
      telefono: telefono,
      email: email
    };
  }
  agregarGarantesalInquilino(inquilino: IInquilino, garantes: Garante[]): IInquilino {
    return {
      ...inquilino,
      garantes: [...inquilino.garantes, ...garantes]
    };
  }
}
