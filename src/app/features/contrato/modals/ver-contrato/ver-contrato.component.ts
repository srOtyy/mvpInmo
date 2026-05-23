import { Component, Input, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { IContrato } from '../../contrato.interface';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { obtenerCaracteristica } from '../../../caracteristicas/entity-helpers';
import { InquilinoRxjsService } from '../../../inquilino/inquilino-rxjs.service';
import { PropietarioRxjsService } from '../../../propietario/propietario-rxjs.service';
import { LiquidacionGeneratorService } from '../../../liquidacion/liquidacion.service';

@Component({
  selector: 'app-ver-contrato',
  standalone: true,
  imports: [MatDividerModule,DatePipe,CurrencyPipe,MatButtonModule],
  templateUrl: './ver-contrato.component.html',
  styleUrl: './ver-contrato.component.scss'
})
export class VerContratoComponent implements OnInit {
  @Input() entidad!: IContrato;
  inquilinoNombre: string = '';
  propietarioNombre: string = '';
  obtenerCaracteristica = obtenerCaracteristica;
  constructor( 
    private _inquilinoService: InquilinoRxjsService,
    private _propietariosService: PropietarioRxjsService,
    private _liquidacionService: LiquidacionGeneratorService
  ){}
  //estos metodos me van a servir para mostrar los nombres del propietario e inquilino en el nombre del item 
  ngOnInit(): void {
    this.setNombreInquilino();
    this.setNombrePropietario();
  }
  async setNombrePropietario(){
    const propietario = await this._propietariosService.obtenerPropietarioPorId(this.entidad.propietarioId);
    if (propietario !== undefined){ 
      this.propietarioNombre = obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible').toString();
    }
  }

  async setNombreInquilino(){
    const inquilino = await this._inquilinoService.obtenerInquilinoPorId(this.entidad.inquilinoId);
    if (inquilino !== undefined){
      this.inquilinoNombre = obtenerCaracteristica(inquilino, 'nombre', 'Nombre no disponible').toString();
    }
  }
  descargarLiquidacion(){
    const liquidacion = this._liquidacionService.buscarLiquidacionPorContrato(this.entidad.id)
    if( liquidacion){
      this._liquidacionService.generarLiquidacionDocx(liquidacion).then(
        () => this._liquidacionService.eliminarGastosEnDB(liquidacion)
      ).catch((error) => console.error('Error al generar o descargar la liquidación:', error));
      // 
    }else{
      console.warn("la liquidacion dio undefined:", liquidacion)
    }
  }
}
