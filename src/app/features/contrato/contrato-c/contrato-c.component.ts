import { Component, OnInit } from '@angular/core';
import { IContrato } from '../contrato.interface';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { ModalService } from '../../../core/modal/modal.service';
import { VerContratoComponent } from '../modals/ver-contrato/ver-contrato.component';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { EditarContratoComponent } from '../modals/editar-contrato/editar-contrato.component';
import { EliminarContratoComponent } from '../modals/eliminar-contrato/eliminar-contrato.component';
import { AgregarGastosContratoComponent } from '../modals/agregar-gastos-contrato/agregar-gastos-contrato.component';
import { Liquidacion } from '../../liquidacion/liquidacion-interface';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-contrato-c',
  standalone: true,
  imports: [CardListComponent, ItemEntidadComponent, A11yModule],
  templateUrl: './contrato-c.component.html',
  styleUrl: './contrato-c.component.scss'
})
export class ContratoCComponent implements OnInit {
  constructor(
    private _contratosService: ContratoBbddService,
    private _modalService: ModalService,
    private _liquidacion: LiquidacionGeneratorService
  ){};
  ngOnInit(){
    this._contratosService.cargarLista();
    this._liquidacion.cargarLista()
    
  }
   get listaContratos(): IContrato[] {
     return this._contratosService.$lista();
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
  agregarGastosContrato(contrato: IContrato){
    //la funcion recibe como argumento un contrato, utilizamos el id del contrato para buscar la liquidacion que le corresponda y la mandamos por el modal
    const liquidacionAux = this._liquidacion.buscarLiquidacionPorContrato(contrato.id)
    if(liquidacionAux){
      this._modalService.abrirModal<Liquidacion>('Agregar Gastos a la liquidacion', AgregarGastosContratoComponent, liquidacionAux);  
    }  else{
      console.warn("La liquidacionAux dio undefinded:", liquidacionAux)
    }
  }
}