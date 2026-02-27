import { Injectable } from '@angular/core';
import { Dominio } from '../core/navegacion/navegacionRutas';
import { DefinicionCaracteristica } from './definicion-caracteristica.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefinicionesCaracteristicasService {
  private definicionesPorDominio = new Map<Dominio, BehaviorSubject<DefinicionCaracteristica[]>>();

  constructor() {
    this.ensureDominio('propietarios');
    this.ensureDominio('inquilinos');
    this.ensureDominio('inmuebles');
  }

  getDefiniciones$(dominio: Dominio): Observable<DefinicionCaracteristica[]> {
    return this.ensureDominio(dominio).asObservable();
  }

  getDefiniciones(dominio: Dominio): DefinicionCaracteristica[] {
    return this.ensureDominio(dominio).getValue().slice();
  }

  setDefiniciones(dominio: Dominio, definiciones: DefinicionCaracteristica[]): void {
    this.ensureDominio(dominio).next(definiciones.slice());
  }

  private ensureDominio(dominio: Dominio): BehaviorSubject<DefinicionCaracteristica[]> {
    let subject = this.definicionesPorDominio.get(dominio);

    if (!subject) {
      subject = new BehaviorSubject<DefinicionCaracteristica[]>([]);
      this.definicionesPorDominio.set(dominio, subject);
    }

    return subject;
  }
}
