import { Component, Input, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { IContrato } from '../../contrato.interface';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { obtenerCaracteristica } from '../../../caracteristicas/entity-helpers';
import { IInquilino } from '../../../inquilino/inquilino.interface';
import { InquilinoRxjsService } from '../../../inquilino/inquilino-rxjs.service';
import { PropietarioRxjsService } from '../../../propietario/propietario-rxjs.service';
import { IPropietario } from '../../../propietario/propietario.interface';
@Component({
  selector: 'app-ver-contrato',
  standalone: true,
  imports: [MatDividerModule,DatePipe,CurrencyPipe],
  templateUrl: './ver-contrato.component.html',
  styleUrl: './ver-contrato.component.scss'
})
export class VerContratoComponent implements OnInit {
  @Input() entidad!: IContrato;
  inquilinoNombre: string = '';
  propietarioNombre: string = '';
  obtenerCaracteristica = obtenerCaracteristica;
  constructor( private _inquilinoService: InquilinoRxjsService, private _propietariosService: PropietarioRxjsService){}

  ngOnInit(): void {
    this.setNombreInquilino();
    this.setNombrePropietario();
    console.log("relacion:"+  this.entidad.titulo)
  }



  //estos metodos me van a servir para mostrar los nombres del propietario e inquilino en el nombre del item

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
}
