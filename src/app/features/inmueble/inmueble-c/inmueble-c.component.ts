import { Component, OnInit, signal } from '@angular/core';
import { IInmueble } from '../inmueble.interface';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';
import { ModalService } from '../../../core/modal/modal.service';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { EditarInmuebleComponent } from '../modals/editar-inmueble/editar-inmueble.component';
import { EliminarInmuebleComponent } from '../modals/eliminar-inmueble/eliminar-inmueble.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AccordionInmuebleComponent } from '../accordion-inmueble/accordion-inmueble.component';
@Component({
  selector: 'app-inmueble-c',
  standalone: true,
  imports: [CardListComponent, AccordionInmuebleComponent, MatExpansionModule],
  templateUrl: './inmueble-c.component.html',
  styleUrl: './inmueble-c.component.scss'
})
export class InmuebleCComponent implements OnInit{
  inmueble!: IInmueble;
  readonly panelOpenState = signal(false);
    
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
  //funciones por modal
  
  editarInmueble(inmueble: IInmueble){
    this._modalService.abrirModal<IInmueble>('Editar Inmueble', EditarInmuebleComponent, inmueble);
  }
  eliminarInmueble(inmueble: IInmueble){
    this._modalService.abrirModal<IInmueble>('Eliminar Inmueble', EliminarInmuebleComponent, inmueble);
  }

}
