import { Component, OnInit, signal } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { EditarInquilinoComponent } from '../modals/editar-inquilino/editar-inquilino.component';
import { EliminarInquilinoComponent } from '../modals/eliminar-inquilino/eliminar-inquilino.component';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { ModalService } from '../../../core/modal/modal.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { AccordionInquilinoComponent } from '../accordion-inquilino/accordion-inquilino.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { obtenerNombre } from '../../caracteristicas/entity-helpers';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inquilino-c',
  imports: [
    CardListComponent,
    AccordionInquilinoComponent,
    MatExpansionModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './inquilino-c.component.html',
  styleUrl: './inquilino-c.component.scss',
})
export class InquilinoCComponent implements OnInit {
  inquilino!: IInquilino;
  readonly panelOpenState = signal(false);
  $busquedaTexto = signal('');

  obtenerCaracteristica = obtenerCaracteristica;
  obtenerNombre = obtenerNombre;

  constructor(
    private _inquilinosService: InquilinoRxjsService,
    private _modalService: ModalService,
  ) {}

  get $listaInquilinos(): IInquilino[] {
    const texto = this.$busquedaTexto().trim().toLowerCase();
    const lista = this._inquilinosService.$lista();

    if (!texto) return lista;

    return lista.filter((inquilino) =>
      this.obtenerNombre(inquilino).toLowerCase().includes(texto),
    );
  }
  ngOnInit(): void {
    this._inquilinosService.cargarLista();
  }

  // estos metodos abren los modales correspondientes

  editarInquilino(inquilino: IInquilino) {
    this._modalService.abrirModal(
      'Editar Inquilino',
      EditarInquilinoComponent,
      inquilino,
    );
  }
  eliminarInquilino(inquilino: IInquilino) {
    this._modalService.abrirModal(
      'Eliminar Inquilino',
      EliminarInquilinoComponent,
      inquilino,
    );
  }
  ordenarAlfabeticamente() {
    this._inquilinosService.ordenarAlfabeticamente();
  }
}
