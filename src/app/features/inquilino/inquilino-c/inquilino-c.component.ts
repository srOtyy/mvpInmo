import { Component } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { ItemInquilinoComponent } from '../item-inquilino/item-inquilino.component';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditarInquilinoComponent } from '../modals/editar-inquilino/editar-inquilino.component';
import { VerInquilinoComponent } from '../modals/ver-inquilino/ver-inquilino.component';
import { EliminarInquilinoComponent } from '../modals/eliminar-inquilino/eliminar-inquilino.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { EditarPropietarioComponent } from '../../propietario/modals/editar-propietario/editar-propietario.component';
import { IPropietario } from '../../propietario/propietario.interface';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';

@Component({
  selector: 'app-inquilino-c',
  standalone: true,
  imports: [CardListComponent,ItemInquilinoComponent, MatButton, ItemEntidadComponent],
  templateUrl: './inquilino-c.component.html',
  styleUrl: './inquilino-c.component.scss'
})

export class InquilinoCComponent {
  inquilino!: IInquilino;
  listaInquilinos: IInquilino[] = [];

  constructor( private _inquilinosService: InquilinoRxjsService , private dialog: MatDialog) {
    this._inquilinosService.listaInquilinos$.subscribe(inquilinos => {
      this.listaInquilinos = inquilinos;
    })
  }

  crearInquilino(){
    this.inquilino = {
      id: this.randomId(),
      nombre: 'Ana',
      dni: 87654321,
      telefono: 9876543210,
      email: 'ana@ana',
      garante: 'Garantia XYZ',
      ingresos: 50000
    }
    this._inquilinosService.agregarInquilino(this.inquilino);
  }
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
  verInquilino(inquilino: IInquilino){
      this.dialog.open(ModalComponent, {
        data: {
          titulo: 'Información del Inquilino',
          componente: VerInquilinoComponent,
          componenteData: {entidad: inquilino}
        }
      });
    }
  editarInquilino(inquilino: IInquilino){
      this.dialog.open(ModalComponent, {
        data: {
          titulo: 'Editar Inquilino',
          componente: EditarInquilinoComponent,
          componenteData: {entidad: inquilino}
        }
      });
    }
  eliminarInquilino(inquilino: IInquilino){
      this.dialog.open(ModalComponent, {
        data: {
          titulo: 'Eliminar Inquilino',
          componente: EliminarInquilinoComponent,
          componenteData: {entidad: inquilino}
        }
      });
    }
  }
