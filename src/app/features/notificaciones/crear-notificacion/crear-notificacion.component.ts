import { Component } from '@angular/core';
import { INotificacion } from '../notificacion.interface';
import { MatButtonModule } from '@angular/material/button';
import { NotificacionesService } from '../notificaciones.service';
@Component({
  selector: 'app-crear-notificacion',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './crear-notificacion.component.html',
  styleUrl: './crear-notificacion.component.scss'
})
export class CrearNotificacionComponent {

  //.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'});
  // la funcion de arriba es para formatear la fecha en formato dd/mm/aa, pero no es necesario para crear la notificacion, ya que el backend se encarga de eso.

  constructor(private _notificacionesService: NotificacionesService){}
  crearNotificacion(tipo: 'vencimiento' | 'recordatorio') {
    const nuevaNotificacion: INotificacion = {
      id: this.randomId(),
      estado: 'pendiente',
      contratoId: 123, // Este valor debería ser dinámico en una aplicación real
      fecha: new Date(),
      tipo: tipo ,
      mensaje: 'Este es un recordatorio de prueba'
    }
    this._notificacionesService.crear(nuevaNotificacion).subscribe({
      next: () => console.log('Notificación creada:', nuevaNotificacion),
      error: () => console.error('Error al crear notificación')
    });
  }
  randomId(): number {
    return Math.floor(Math.random() * 1000000);
  }

}
