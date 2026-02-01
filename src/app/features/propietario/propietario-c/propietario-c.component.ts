import { Component } from '@angular/core';
import { IPropietario } from '../propietario.interface';
import { MatButton } from "@angular/material/button";
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { ItemPropietarioComponent } from '../item-propietario/item-propietario.component';
import { PropietarioRxjsService } from '../propietario-rxjs.service';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { VerInfoPropietarioComponent } from '../modals/ver-info-propietario/ver-info-propietario.component';
import { EditarPropietarioComponent } from '../modals/editar-propietario/editar-propietario.component';
import { EliminarPropietarioComponent } from '../modals/eliminar-propietario/eliminar-propietario.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../../shared/modal/modal.component';


@Component({
  selector: 'app-propietario-c',
  standalone: true,
  imports: [ MatButton,CardListComponent, ItemEntidadComponent],
  templateUrl: './propietario-c.component.html',
  styleUrl: './propietario-c.component.scss'
})

export class PropietarioCComponent {
  propietario!: IPropietario;
  listaPropietarios: IPropietario[] = [];

  constructor( private _propietariosRxJsService: PropietarioRxjsService, private dialog: MatDialog) {
    this._propietariosRxJsService.listaPropietarios$.subscribe( propietarios => {
      this.listaPropietarios = propietarios;
    });
  }

  // este crea el propietario de prueba
  crearPropietario(){
    this.propietario = {
      id: this.randomId(),
      nombre: 'Otto',
      dni: 12345678,
      telefono: 1234567890,
      email: 'oty@oty',
      cbu: '1234567890123456789012',
      inmuebles: ['123','456','789']
    }
    this._propietariosRxJsService.agregarPropietario(this.propietario);
   
  }
  
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
  verPropietario(propietario: IPropietario){
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Información del Propietario',
        componente: VerInfoPropietarioComponent,
        componenteData: {entidad: propietario}
      }
    });
  }
  editarPropietario(propietario: IPropietario){
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Editar Propietario',
        componente: EditarPropietarioComponent,
        componenteData: {entidad: propietario}
      }
    });
  }
  eliminarPropietario(propietario: IPropietario){
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Eliminar Propietario',
        componente: EliminarPropietarioComponent,
        componenteData: {entidad: propietario}
      }
    });
  }
}
