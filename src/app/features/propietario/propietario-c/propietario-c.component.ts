import { Component } from '@angular/core';
import { IPropietario } from '../propietario.interface';


import { MatButton } from "@angular/material/button";
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { ItemPropietarioComponent } from '../item-propietario/item-propietario.component';
import { PropietarioRxjsService } from '../propietario-rxjs.service';
@Component({
  selector: 'app-propietario-c',
  standalone: true,
  imports: [ MatButton,CardListComponent, ItemPropietarioComponent],
  templateUrl: './propietario-c.component.html',
  styleUrl: './propietario-c.component.scss'
})
export class PropietarioCComponent {
  propietario!: IPropietario;
  listaPropietarios: IPropietario[] = [];

  constructor( private _propietariosRxJsService: PropietarioRxjsService) {
    this._propietariosRxJsService.lsitaPropietarios$.subscribe( propietarios => {
      this.listaPropietarios = propietarios;
    });
  }

  crearPropietario(){
    this.propietario = {
      id: this.randomId(),
      nombre: 'Otto',
      dni: 12345678,
      telefono: 1234567890,
      email: 'oty@oty',
      cbu: '1234567890123456789012'
    }
    this._propietariosRxJsService.agregarPropietario(this.propietario);
   
  }
  
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
}
