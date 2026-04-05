
import { Injectable, signal } from '@angular/core';
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

  //singal para el dominio activo, se puede usar en el html del sidebar para mostrar los botones de accion correspondientes al dominio activo
  public $dominioActivo = signal<Dominio | null>(null);

  constructor(private router: Router) {}

  emitirEntidades(): string[]{
    return Object.keys(this.accionesPorDominio);
  }
    obtenerBotonesAccionPorDominio(dominio: Dominio): IBotonRuta[] {
    return this.accionesPorDominio[dominio] || [];
  }
}
