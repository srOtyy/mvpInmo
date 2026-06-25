import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from "@angular/material/list";
import { ContratoBbddService } from '../../features/contrato/contrato-bbdd.service';
import { VistaInfoInquilinoComponent } from '../../features/inquilino/vista-info-inquilino/vista-info-inquilino.component';
import { VistaInfoPropietarioComponent } from '../../features/propietario/vista-info-propietario/vista-info-propietario.component';

import {MatStepperModule} from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VerInfoGaranteComponent } from '../../features/inquilino/ver-info-garante/ver-info-garante.component';
@Component({
  selector: 'app-vista-info-entidad',
  standalone: true,
  imports: [MatDividerModule, MatListModule,MatIconModule ,VistaInfoPropietarioComponent, VistaInfoInquilinoComponent,MatStepperModule, MatButtonModule, CommonModule, VerInfoGaranteComponent],
  templateUrl: './vista-info-entidad.component.html',
  styleUrl: './vista-info-entidad.component.scss'
})
export class VistaInfoEntidadComponent {
  
  constructor( public _contratos: ContratoBbddService){}

  cerrarInfoSideBar(){
    this._contratos.$sideBarInfo.set(false)
  }
}
