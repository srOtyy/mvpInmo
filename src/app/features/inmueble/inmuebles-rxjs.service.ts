import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IInmueble } from './inmueble.interface';
@Injectable({
  providedIn: 'root'
})
export class InmueblesRxjsService {
  private listaInmueblesSubject = new BehaviorSubject<IInmueble[]>([]);
  listaInmuebles$ : Observable<IInmueble[]> = this.listaInmueblesSubject.asObservable();
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
}
