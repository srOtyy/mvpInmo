
//2 Traducir ese segmento a un array de botones ( Hacerlo un observable)

//3 Emitir ese array al header

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Dominio,IBotonRuta } from './navegacionRutas';



@Injectable({
  providedIn: 'root'
})

export class RutasDinamicasService {

  private accionesPorDominio: Record<Dominio, IBotonRuta[]> = {
    propietarios: [
      { nombre: 'lista', ruta: ['/propietarios', 'lista'] },
      { nombre: 'crear', ruta: ['/propietarios', 'crear'] }
    ],
    inquilinos: [
      { nombre: 'lista', ruta: ['/inquilinos', 'lista'] },
      { nombre: 'crear', ruta: ['/inquilinos', 'crear'] },
      {nombre : 'crear contrato', ruta: ['/inquilinos', 'crear-contrato']}
    ]
  };

  private arrayBotones: BehaviorSubject<IBotonRuta[]> = new BehaviorSubject<IBotonRuta[]>([]);
  arrayBotones$ : Observable<IBotonRuta[]> = this.arrayBotones.asObservable();

  constructor(private router: Router) {
    //1 Escuchar los eventos del router, Filtrar solo NavigationEnd, Leer la URL,Extraer el primer segmento como dominio 
    this.router.events.pipe(
      filter(evento => evento instanceof NavigationEnd)
    ).subscribe((evento: NavigationEnd) => {
      const url = evento.urlAfterRedirects;
      const dominio = url.split('/')[1];

     if (dominio in this.accionesPorDominio){
      this.arrayBotones.next(this.accionesPorDominio[dominio as Dominio]);
     }else{
      this.arrayBotones.next([]);
     }
    });
  }

}
