import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IPropietario } from '../../propietario.interface';
import { MatDividerModule } from '@angular/material/divider';
import { obtenerCaracteristica } from '../../../../shared/entity-helpers';
@Component({
  selector: 'app-ver-info-propietario',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './ver-info-propietario.component.html',
  styleUrl: './ver-info-propietario.component.scss'
})
export class VerInfoPropietarioComponent implements OnInit, OnDestroy {
  @Input() entidad!: IPropietario;

  ngOnInit(){
    console.log('entidad en ver info propietario', this.entidad);
  }

  ngOnDestroy(){
    console.log('entidad en destruir ver info propietario', this.entidad);
  }
  
}
