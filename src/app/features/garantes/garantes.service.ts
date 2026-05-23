import { Injectable } from '@angular/core';
import { Garante } from './garante-interface';
import {randomId} from '../../shared/utilitys';

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
}
