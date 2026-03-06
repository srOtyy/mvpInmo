import { Component, OnInit } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditarInquilinoComponent } from '../modals/editar-inquilino/editar-inquilino.component';
import { VerInquilinoComponent } from '../modals/ver-inquilino/ver-inquilino.component';
import { EliminarInquilinoComponent } from '../modals/eliminar-inquilino/eliminar-inquilino.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { obtenerCaracteristica } from '../../../shared/entity-helpers';
import { Observable, } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-inquilino-c',
  standalone: true,
  imports: [CardListComponent, MatButton, ItemEntidadComponent, AsyncPipe],
  templateUrl: './inquilino-c.component.html',
  styleUrl: './inquilino-c.component.scss'
})

export class InquilinoCComponent implements OnInit{
  inquilino!: IInquilino;
  listaInquilinos$!: Observable<IInquilino[]>
  obtenerCaracteristica = obtenerCaracteristica;

  constructor(
    private _inquilinosService: InquilinoRxjsService,
    private dialog: MatDialog
  ) {};

  ngOnInit(): void {
    this.listaInquilinos$ = this._inquilinosService.listaInquilinos$;
    this._inquilinosService.cargarInquilinos().subscribe();
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
