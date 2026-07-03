import { Component, OnInit } from '@angular/core';
import { INotificacion } from '../../features/notificaciones/notificacion.interface';
import { NotificacionesService } from '../../features/notificaciones/notificaciones.service';
import { Observable } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CicloDeVidaContratosService } from '../../features/contrato/ciclo-de-vida-contratos.service';
@Component({
  selector: 'app-head',
  standalone: true,
  imports: [AsyncPipe, DatePipe,TitleCasePipe],
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss'
})
export class HeadComponent implements OnInit{
  fechaYHora: Date = new Date()
  listaNotificaciones$!: Observable<INotificacion[]>;

  constructor(private _notificacionesService: NotificacionesService, private _cicloDeVida:CicloDeVidaContratosService) {
    this.listaNotificaciones$ = this._notificacionesService.cargarLista();
  }

  ngOnInit(): void {
    this.fechaYHora = this._cicloDeVida.ahora
  }
}
