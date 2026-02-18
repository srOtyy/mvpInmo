import { Injectable } from '@angular/core';
import { Dominio } from '../core/navegacion/navegacionRutas';
import { DefinicionCaracteristica } from './definicion-caracteristica.interface';

@Injectable({
  providedIn: 'root'
})
export class DefinicionesCaracteristicasService {
  private definicionesPorDominio: Record<Dominio, DefinicionCaracteristica[]> = {
    propietarios: [],
    inquilinos: [],
    inmuebles: []
  };

  getDefiniciones(dominio: Dominio): DefinicionCaracteristica[] {
    return this.definicionesPorDominio[dominio].slice();
  
  }

  setDefiniciones(dominio: Dominio, definiciones: DefinicionCaracteristica[]){
    this.definicionesPorDominio[dominio] = definiciones.slice();
  }
}
