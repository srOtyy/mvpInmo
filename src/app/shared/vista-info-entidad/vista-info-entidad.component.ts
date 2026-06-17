import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from "@angular/material/list";
import { ContratoBbddService } from '../../features/contrato/contrato-bbdd.service';
import { VistaInfoInquilinoComponent } from '../../features/inquilino/vista-info-inquilino/vista-info-inquilino.component';
import { VistaInfoPropietarioComponent } from '../../features/propietario/vista-info-propietario/vista-info-propietario.component';
@Component({
  selector: 'app-vista-info-entidad',
  standalone: true,
  imports: [MatDividerModule, MatListModule, VistaInfoPropietarioComponent, VistaInfoInquilinoComponent],
  templateUrl: './vista-info-entidad.component.html',
  styleUrl: './vista-info-entidad.component.scss'
})
export class VistaInfoEntidadComponent {

  constructor( public _contratos: ContratoBbddService){}

}
