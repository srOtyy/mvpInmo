import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IInmueble,definicionCaracteristicaInmueble } from './inmueble.interface';
@Injectable({
  providedIn: 'root'
})
export class InmueblesRxjsService {
  private listaInmueblesSubject = new BehaviorSubject<IInmueble[]>([]);
  private listaCaracteristicasSubject = new BehaviorSubject<definicionCaracteristicaInmueble[]>([]);
  listaInmuebles$ : Observable<IInmueble[]> = this.listaInmueblesSubject.asObservable();
  listaCaracteristicas$ : Observable<definicionCaracteristicaInmueble[]> = this.listaCaracteristicasSubject.asObservable();
  constructor() { }

  //crud inmuebles
  agregarInmueble( inmueble: IInmueble ){
    const listaActual = this.listaInmueblesSubject.getValue();
    this.listaInmueblesSubject.next([...listaActual, inmueble]);
  }
  eliminarInmueble( id: number ){
    const listaActual = this.listaInmueblesSubject.getValue();
    const listaFiltrada = listaActual.filter( inmueble => inmueble.id !== id );
    this.listaInmueblesSubject.next( listaFiltrada );
  }
  //crud caracteristicas
  agregarCaracteristica( caracteristica: definicionCaracteristicaInmueble ){
    const listaActual = this.listaCaracteristicasSubject.getValue();
    this.listaCaracteristicasSubject.next([...listaActual, caracteristica]);
  }
  
}
