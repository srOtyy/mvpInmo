import { Component } from '@angular/core';
import { NotificacionesService } from '../../features/notificaciones/notificaciones.service';
import { NotificacionesComponent } from '../../features/notificaciones/notificaciones.component';
@Component({
  selector: 'app-head',
  standalone: true,
  imports: [NotificacionesComponent],
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss'
})
export class HeadComponent {

  constructor( private _notificacionesService: NotificacionesService) {
    this._notificacionesService.cargarLista();
  }
}
