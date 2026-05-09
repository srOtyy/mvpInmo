import { Component } from '@angular/core';
import { INotificacion } from '../../features/notificaciones/notificacion.interface';
import { NotificacionesService } from '../../features/notificaciones/notificaciones.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-head',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss'
})
export class HeadComponent {
  listaNotificaciones$!: Observable<INotificacion[]>;

  constructor(private _notificacionesService: NotificacionesService) {
    this.listaNotificaciones$ = this._notificacionesService.cargarLista();
  }
}
