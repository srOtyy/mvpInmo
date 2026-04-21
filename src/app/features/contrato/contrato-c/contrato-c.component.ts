import { Component, OnInit } from '@angular/core';
import { IContrato } from '../contrato.interface';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { ModalService } from '../../../core/modal/modal.service';
import { VerContratoComponent } from '../modals/ver-contrato/ver-contrato.component';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { EditarContratoComponent } from '../modals/editar-contrato/editar-contrato.component';
import { EliminarContratoComponent } from '../modals/eliminar-contrato/eliminar-contrato.component';

@Component({
  selector: 'app-contrato-c',
  standalone: true,
  imports: [CardListComponent, ItemEntidadComponent],
  templateUrl: './contrato-c.component.html',
  styleUrl: './contrato-c.component.scss'
})
export class ContratoCComponent implements OnInit {
  constructor(
    private _contratosService: ContratoBbddService,
    private _modalService: ModalService
  ){};
  ngOnInit(){
    this._contratosService.cargarLista();
  }
  get listaContratos(): IContrato[] {
    return this._contratosService.$lista();
  }
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
  verContrato(contrato: IContrato){
    this._modalService.abrirModal<IContrato>('Información del Contrato', VerContratoComponent, contrato);
  }
  editarContrato(contrato: IContrato){
    this._modalService.abrirModal<IContrato>('Editar Contrato', EditarContratoComponent, contrato);
  }
  eliminarContrato(contrato: IContrato){
    this._modalService.abrirModal<IContrato>('Eliminar Contrato', EliminarContratoComponent, contrato);    
  }
}
