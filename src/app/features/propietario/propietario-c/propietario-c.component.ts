import { Component, OnInit } from '@angular/core';
import { IPropietario } from '../propietario.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { PropietarioRxjsService } from '../propietario-rxjs.service';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { VerInfoPropietarioComponent } from '../modals/ver-info-propietario/ver-info-propietario.component';
import { EditarPropietarioComponent } from '../modals/editar-propietario/editar-propietario.component';
import { EliminarPropietarioComponent } from '../modals/eliminar-propietario/eliminar-propietario.component';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { ModalService } from '../../../core/modal/modal.service';
import { SnackbarService } from '../../../core/snackbar.service';
@Component({
  selector: 'app-propietario-c',
  standalone: true,
  imports: [CardListComponent, ItemEntidadComponent],
  templateUrl: './propietario-c.component.html',
  styleUrl: './propietario-c.component.scss'
})

export class PropietarioCComponent implements OnInit {
  
  propietario!: IPropietario;
  obtenerCaracteristica = obtenerCaracteristica;
  
  constructor(
    private _propietariosRxJsService: PropietarioRxjsService,
    private _modalService: ModalService,
    private _snack: SnackbarService
  ) {};

  get $listaPropietarios(): IPropietario[] {
    return this._propietariosRxJsService.$lista();
  }
  
  ngOnInit(): void {
    this._propietariosRxJsService.cargarLista();
  }
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
  // estos metodos abren los modales correspondientes 
  verPropietario(propietario: IPropietario) {
    this._modalService.abrirModal<IPropietario>(
      'Información del Propietario',
      VerInfoPropietarioComponent,
      propietario);
  }
  editarPropietario(propietario: IPropietario){
   this._modalService.abrirModal<IPropietario>('Editar Propietario',
    EditarPropietarioComponent, 
    propietario);
  }
  eliminarPropietario(propietario: IPropietario){
    this._modalService.abrirModal('Eliminar Propietario',
    EliminarPropietarioComponent,
    propietario);
  }
}
