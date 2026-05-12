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
  constructor( private _inquilinoService: InquilinoRxjsService, private _propietarioService: PropietarioRxjsService){}

  ngOnInit(): void {
    this.setInquilinoNombre();
    this.setPropietarioNombre();  
  }

  setInquilinoNombre(){
     this._inquilinoService.buscarEntidadPorId<IInquilino>(this.entidad.inquilinoId).subscribe({
      next: (inquilino) => {
       this.inquilinoNombre = obtenerCaracteristica(inquilino, 'nombre', 'Nombre no disponible').toString();
      }
    });
  }
  setPropietarioNombre(){
    this._propietarioService.buscarEntidadPorId<IPropietario>(this.entidad.propietarioId).subscribe({
      next: (propietario) => {
       this.propietarioNombre = obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible').toString();
      }
    });
  }

}
