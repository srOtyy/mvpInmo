import { Component, OnInit } from '@angular/core';
import { IContrato } from '../contrato.interface';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { ModalService } from '../../../core/modal/modal.service';
import { EditarContratoComponent } from '../modals/editar-contrato/editar-contrato.component';
import { EliminarContratoComponent } from '../modals/eliminar-contrato/eliminar-contrato.component';
import { AgregarGastosContratoComponent } from '../modals/agregar-gastos-contrato/agregar-gastos-contrato.component';
import { SolicitarIndiceContratoComponent } from '../modals/solicitar-indice-contrato/solicitar-indice-contrato.component';
import { Liquidacion } from '../../liquidacion/liquidacion-interface';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import { A11yModule } from "@angular/cdk/a11y";
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-contrato-c',
  standalone: true,
  imports: [A11yModule, AsyncPipe, DatePipe, CurrencyPipe, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './contrato-c.component.html',
  styleUrl: './contrato-c.component.scss'
})
export class ContratoCComponent implements OnInit {
  constructor(
    public _contratosService: ContratoBbddService,
    private _modalService: ModalService,
    private _liquidacion: LiquidacionGeneratorService
  ){};
  ngOnInit(){
    this._contratosService.cargarLista();
    this._liquidacion.cargarLista()
    
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
  generarRecibo(contrato: IContrato){
    const liquidacionAux = this._liquidacion.buscarLiquidacionPorContrato(contrato.id)
    if(liquidacionAux){
      this._liquidacion.generarLiquidacionDocx(liquidacionAux);
    } else{
      console.warn("La liquidacionAux dio undefinded:", liquidacionAux)
    } 

  }
  solicitarIndice(contrato: IContrato){
    this._modalService.abrirModal<IContrato>(
      'Solicitar indice',
      SolicitarIndiceContratoComponent,
      contrato
    );
  }

  //cambiar valor $sideBarInfo ( desde el servicio de contratos)
  cambiarValorSidebarInfo(id: number){
    this._contratosService.$sideBarInfo.set(true)
    this._contratosService.$contratoIdSideBarInfo.set(id)
    
  }

}
