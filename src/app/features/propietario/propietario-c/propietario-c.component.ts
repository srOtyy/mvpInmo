import { Component, OnInit } from '@angular/core';
import { IPropietario } from '../propietario.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { PropietarioRxjsService } from '../propietario-rxjs.service';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { VerInfoPropietarioComponent } from '../modals/ver-info-propietario/ver-info-propietario.component';
import { EditarPropietarioComponent } from '../modals/editar-propietario/editar-propietario.component';
import { EliminarPropietarioComponent } from '../modals/eliminar-propietario/eliminar-propietario.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { Observable } from 'rxjs';
import { obtenerCaracteristica } from '../../../shared/entity-helpers';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-propietario-c',
  standalone: true,
  imports: [CardListComponent, ItemEntidadComponent, AsyncPipe],
  templateUrl: './propietario-c.component.html',
  styleUrl: './propietario-c.component.scss'
})

export class PropietarioCComponent implements OnInit {
  propietario!: IPropietario;
  listaPropietarios$!: Observable<IPropietario[]>;
  obtenerCaracteristica = obtenerCaracteristica;
  constructor(
    private _propietariosRxJsService: PropietarioRxjsService,
    private dialog: MatDialog
  ) {};
  
  ngOnInit(): void {
    this.listaPropietarios$ = this._propietariosRxJsService.listaPropietarios$;
    this._propietariosRxJsService.cargarPropietarios().subscribe();
  }
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
  // estos metodos abren los modales correspondientes 
  verPropietario(propietario: IPropietario){
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Información del Propietario',
        componente: VerInfoPropietarioComponent,
        componenteData: {entidad: propietario}
      }
    });
  }
  editarPropietario(propietario: IPropietario){
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Editar Propietario',
        componente: EditarPropietarioComponent,
        componenteData: {entidad: propietario}
      }
    });
  }
  eliminarPropietario(propietario: IPropietario){
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Eliminar Propietario',
        componente: EliminarPropietarioComponent,
        componenteData: {entidad: propietario}
      }
    });
  }
}
