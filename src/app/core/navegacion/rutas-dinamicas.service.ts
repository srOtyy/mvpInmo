
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Dominio,IBotonRuta } from './navegacionRutas';

@Injectable({
  providedIn: 'root'
})

export class RutasDinamicasService {
  // por el momento es importante declarar los dominios y sus rutas en el Record<K,V> 'accionesPorDominio'
  private accionesPorDominio: Record<Dominio, IBotonRuta[]> = {
    propietarios: [
      { nombre: 'lista', ruta: ['/propietarios', 'lista'] },
      { nombre: 'crear', ruta: ['/propietarios', 'crear'] },
      { nombre: 'caracteristicas', ruta: ['/propietarios', 'def_caracteristicas'] }
    ],
    inquilinos: [
      { nombre: 'lista', ruta: ['/inquilinos', 'lista'] },
      {nombre: 'crear', ruta: ['/inquilinos', 'crear']},
      { nombre: 'caracteristicas', ruta: ['/inquilinos', 'def_caracteristicas'] },
    ],
    inmuebles: [
      {nombre: 'crear', ruta: ['/inmuebles', 'crear']},
      { nombre: 'caracteristicas', ruta: ['/inmuebles', 'def_caracteristicas'] }
    ]
  };
  // para emitir el array de botones al componente que lo necesite ( actualmente el header)
  private arrayBotones: BehaviorSubject<IBotonRuta[]> = new BehaviorSubject<IBotonRuta[]>([]);
  arrayBotones$ : Observable<IBotonRuta[]> = this.arrayBotones.asObservable();
  // Para mantener el dominio activo y emitirlo al componente que lo necesite ( actualmente el sidebar)
  private dominioActivoSubject: BehaviorSubject<Dominio | null> = new BehaviorSubject<Dominio | null>(null);
  dominioActivo$: Observable<Dominio | null> = this.dominioActivoSubject.asObservable();

  constructor(private router: Router) {}

  emitirEntidades(): string[]{
    return Object.keys(this.accionesPorDominio);
  }
  enviarDominioActivo(dominio: Dominio): void {
    if (dominio in this.accionesPorDominio) {
      this.arrayBotones.next(this.accionesPorDominio[dominio as Dominio]);
      this.dominioActivoSubject.next(dominio as Dominio);
    } else {
      this.arrayBotones.next([]);
      this.dominioActivoSubject.next(null);
    }
  
  }
}
