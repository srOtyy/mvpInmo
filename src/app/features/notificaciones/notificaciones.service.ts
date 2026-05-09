import { Injectable } from '@angular/core';
import { INotificacion } from './notificacion.interface';
import { BaseCrudService } from '../../core/http/base-crud.service';
import { HttpClient } from '@angular/common/http';
import {toObservable} from '@angular/core/rxjs-interop'
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService extends BaseCrudService<INotificacion> {
  ahora = new Date();
  title = this.ahora.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'});
  constructor( http: HttpClient) {
    super(http, 'http://localhost:3000/notificaciones')
    console.log('NotificacionesService inicializado: ', this.title);
  }

  cargarLista() {
    if (this.$lista().length === 0) {
      this.cargar().subscribe();
    }
    return toObservable(this.$lista);
  }
  $listaNotificaciones: INotificacion[] = [];

  obtenerNotificaciones(estado?: string): INotificacion[] {
    if (estado) {
      return this.$lista().filter(notificacion => notificacion.estado === estado);
    }
    return this.$lista();
  }
  filtrarPorVencimiento(listadoNotificaciones: INotificacion[]): INotificacion[] {
    const hoy = new Date();
    return listadoNotificaciones.filter(notificacion => {
      const fecha = new Date(notificacion.fecha);
      return fecha < hoy;
    });
  }
}
