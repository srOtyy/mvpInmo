
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

  private arrayBotones: BehaviorSubject<IBotonRuta[]> = new BehaviorSubject<IBotonRuta[]>([]);
  arrayBotones$ : Observable<IBotonRuta[]> = this.arrayBotones.asObservable();

  private dominioActivoSubject: BehaviorSubject<Dominio | null> = new BehaviorSubject<Dominio | null>(null);
  dominioActivo$: Observable<Dominio | null> = this.dominioActivoSubject.asObservable();

  constructor(private router: Router) {
    this.setDominioDesdeUrl(this.router.url);
    //1 Escuchar los eventos del router, Filtrar solo NavigationEnd, Leer la URL,Extraer el primer segmento como dominio 
    this.router.events.pipe(
      filter(evento => evento instanceof NavigationEnd)
    ).subscribe((evento: NavigationEnd) => {
      const url = evento.urlAfterRedirects;
      this.setDominioDesdeUrl(url);
    });
  }


  emitirEntidades(): string[]{
    return Object.keys(this.accionesPorDominio);
  }

  private setDominioDesdeUrl(url: string): void {
    const dominio = url.split('/')[1];

    if (dominio in this.accionesPorDominio) {
      this.arrayBotones.next(this.accionesPorDominio[dominio as Dominio]);
      this.dominioActivoSubject.next(dominio as Dominio);
      return;
    }

    this.arrayBotones.next([]);
    this.dominioActivoSubject.next(null);
  }

}
