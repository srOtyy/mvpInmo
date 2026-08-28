import { Component, OnInit, signal } from '@angular/core';
import { IPropietario } from '../propietario.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { PropietarioRxjsService } from '../propietario-rxjs.service';
import { EditarPropietarioComponent } from '../modals/editar-propietario/editar-propietario.component';
import { EliminarPropietarioComponent } from '../modals/eliminar-propietario/eliminar-propietario.component';
import { ModalService } from '../../../core/modal/modal.service';
import { AccordionPropietarioComponent } from '../accordion-propietario/accordion-propietario.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  obtenerNombre,
  obtenerCaracteristica,
} from '../../caracteristicas/entity-helpers';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-propietario-c',
  imports: [
    CardListComponent,
    AccordionPropietarioComponent,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './propietario-c.component.html',
  styleUrl: './propietario-c.component.scss',
})
export class PropietarioCComponent implements OnInit {
  readonly panelOpenState = signal(false);
  obtenerNombre = obtenerNombre;
  obtenerCaracteristica = obtenerCaracteristica;
  $busquedaTexto = signal('');

  constructor(
    private _propietariosRxJsService: PropietarioRxjsService,
    private _modalService: ModalService,
  ) {}

  get $listaPropietarios(): IPropietario[] {
    const texto = this.$busquedaTexto().trim().toLowerCase();
    const lista = this._propietariosRxJsService.$lista();
    if (!texto) return lista;
    return lista.filter((prop) =>
      this.obtenerNombre(prop).toLowerCase().includes(texto),
    );
  }

  ngOnInit(): void {
    this._propietariosRxJsService.cargarLista();
  }
  // estos metodos abren los modales correspondientes

  editarPropietario(propietario: IPropietario) {
    this._modalService.abrirModal<IPropietario>(
      'Editar Propietario',
      EditarPropietarioComponent,
      propietario,
    );
  }
  eliminarPropietario(propietario: IPropietario) {
    this._modalService.abrirModal<IPropietario>(
      'Eliminar Propietario',
      EliminarPropietarioComponent,
      propietario,
    );
  }
  ordenarAlfabeticamente() {
    this._propietariosRxJsService.ordenarAlfabeticamente();
  }
}
