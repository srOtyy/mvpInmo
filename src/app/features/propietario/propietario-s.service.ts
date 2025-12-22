import { Injectable } from '@angular/core';
import { IPropietario } from './propietario.interface';

@Injectable({
  providedIn: 'root'
})
export class PropietarioSService {
  propietarioAuxiliar!: IPropietario;
  listaPRopietarios: IPropietario[] = [
    {
      id: 1,
      nombre: 'Juan Perez',
      dni: 12345678,
      telefono: 1234567890,
      email: 'q@q',
      cbu: '1234567890123456789012'}
  ];
  constructor() { }

  //getter
  obtenerPropietario(): IPropietario {
    return this.propietarioAuxiliar;
  }
  obtenerListaPropietarios(): IPropietario[] {
    return this.listaPRopietarios;
  }
  //setter
  guardarPropietario(propietario: IPropietario) {
    this.propietarioAuxiliar = propietario;
  }
  agregarNuevoPropietario(propietario: IPropietario){ 
    this.listaPRopietarios.push(propietario);
  }
}
