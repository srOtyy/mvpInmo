import { Component, OnInit } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { EditarInquilinoComponent } from '../modals/editar-inquilino/editar-inquilino.component';
import { VerInquilinoComponent } from '../modals/ver-inquilino/ver-inquilino.component';
import { EliminarInquilinoComponent } from '../modals/eliminar-inquilino/eliminar-inquilino.component';
import { ItemEntidadComponent } from '../../../shared/item-entidad/item-entidad.component';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { Observable, } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SnackbarService } from '../../../core/snackbar.service';
import { ModalService } from '../../../core/modal/modal.service';
@Component({
  selector: 'app-inquilino-c',
  standalone: true,
  imports: [CardListComponent, ItemEntidadComponent, AsyncPipe],
  templateUrl: './inquilino-c.component.html',
  styleUrl: './inquilino-c.component.scss'
})

export class InquilinoCComponent implements OnInit{
  inquilino!: IInquilino;
  listaInquilinos$!: Observable<IInquilino[]>
  obtenerCaracteristica = obtenerCaracteristica;

  constructor(
    private _inquilinosService: InquilinoRxjsService,
    private _snack: SnackbarService,
    private _modalService: ModalService
  ) {};

  ngOnInit(): void {
    this.listaInquilinos$ = this._inquilinosService.obtenerLista();
    this._inquilinosService.cargar().subscribe(
      {next: lista => console.log('Lista de inquilinos cargada:', lista),
      error: err => this._snack.mensajeSnackBar('Error al cargar inquilinos', 'Cerrar')
      }
    )
  }
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }

  // estos metodos abren los modales correspondientes
  verInquilino(inquilino: IInquilino){
    this._modalService.abrirModal('Información del Inquilino', VerInquilinoComponent, inquilino);
  }
  editarInquilino(inquilino: IInquilino){
    this._modalService.abrirModal('Editar Inquilino', EditarInquilinoComponent, inquilino);
  }
  eliminarInquilino(inquilino: IInquilino){
    this._modalService.abrirModal('Eliminar Inquilino', EliminarInquilinoComponent, inquilino);    
  }
}
