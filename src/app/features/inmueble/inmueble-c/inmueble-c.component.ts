import { Component, OnInit } from '@angular/core';
import { IInmueble } from '../inmueble.interface';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';
import { ModalService } from '../../../core/modal/modal.service';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { VerInmuebleComponent } from '../modals/ver-inmueble/ver-inmueble.component'; 
import { EditarInmuebleComponent } from '../modals/editar-inmueble/editar-inmueble.component';
import { EliminarInmuebleComponent } from '../modals/eliminar-inmueble/eliminar-inmueble.component';
@Component({
  selector: 'app-inmueble-c',
  standalone: true,
  imports: [CardListComponent, ItemEntidadComponent ],
  templateUrl: './inmueble-c.component.html',
  styleUrl: './inmueble-c.component.scss'
})
export class InmuebleCComponent implements OnInit{
  inmueble!: IInmueble;
    
  constructor(
    private _inmueblesService: InmueblesRxjsService,
    private _modalService: ModalService
  ){};

  get $listaInmuebles(): IInmueble[] {
    return this._inmueblesService.$lista();
  }
  ngOnInit(): void{
    this._inmueblesService.cargarLista()
  }
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
  //funciones por modal
  verInmueble(inmueble: IInmueble){
    this._modalService.abrirModal<IInmueble>('Información del Inmueble', VerInmuebleComponent, inmueble);
  }
  editarInmueble(inmueble: IInmueble){
    this._modalService.abrirModal<IInmueble>('Editar Inmueble', EditarInmuebleComponent, inmueble);
  }
  eliminarInmueble(inmueble: IInmueble){
    this._modalService.abrirModal<IInmueble>('Eliminar Inmueble', EliminarInmuebleComponent, inmueble);
  }

}
