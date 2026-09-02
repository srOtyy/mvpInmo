import { Component, OnInit, signal } from '@angular/core';
import { IInmueble } from '../inmueble.interface';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';
import { ModalService } from '../../../core/modal/modal.service';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { EditarInmuebleComponent } from '../modals/editar-inmueble/editar-inmueble.component';
import { EliminarInmuebleComponent } from '../modals/eliminar-inmueble/eliminar-inmueble.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionInmuebleComponent } from '../accordion-inmueble/accordion-inmueble.component';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';
import { obtenerNombre } from '../../caracteristicas/entity-helpers';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import {
  IPropietario,
  IPropietarioVista,
} from '../../propietario/propietario.interface';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-inmueble-c',
  imports: [
    CardListComponent,
    AccordionInmuebleComponent,
    MatExpansionModule,
    MatDividerModule,
    MatFormField,
    FormsModule,
    MatInputModule,
    MatLabel,
    MatIconModule,
  ],
  templateUrl: './inmueble-c.component.html',
  styleUrl: './inmueble-c.component.scss',
})
export class InmuebleCComponent implements OnInit {
  // inmueble!: IInmueble;
  readonly panelOpenState = signal(false);
  obtenerNombre = obtenerNombre;
  $busquedaTexto = signal('');
  constructor(
    private _inmueblesService: InmueblesRxjsService,
    private _modalService: ModalService,
    private _propietariosService: PropietarioRxjsService,
  ) {}

  get $listaInmuebles(): IInmueble[] {
    //y este return ??
    return this._inmueblesService.$lista().filter((inmueble) => {
      const texto = this.$busquedaTexto().trim().toLowerCase();
      if (!texto) return true;

      const direccion = inmueble.direccion.toLowerCase();
      const propietario = this._propietariosService
        .obtenerNombrePropietarioPorId(inmueble.idPropietario)
        .toLowerCase();

      return direccion.includes(texto) || propietario.includes(texto);
    });
  }
  get $listaPropietarios(): IPropietarioVista[] {
    const texto = this.$busquedaTexto().trim().toLowerCase();
    const lista = this._propietariosService.convertirArrayAVista(
      this._propietariosService.$lista(),
    );

    if (!texto) return lista;

    return lista.filter((inmueble) =>
      this.obtenerNombre(inmueble).toLowerCase().includes(texto),
    );
  }
  ngOnInit(): void {
    this._inmueblesService.cargarLista();
  }
  //funciones por modal

  editarInmueble(inmueble: IInmueble) {
    this._modalService.abrirModal<IInmueble>(
      'Editar Inmueble',
      EditarInmuebleComponent,
      inmueble,
    );
  }
  eliminarInmueble(inmueble: IInmueble) {
    this._modalService.abrirModal<IInmueble>(
      'Eliminar Inmueble',
      EliminarInmuebleComponent,
      inmueble,
    );
  }
  obtenerInmueblePorId(idInmueble: number): IInmueble | undefined {
    const inmueble = this._inmueblesService.obtenerInmueblePorId(idInmueble);
    if (inmueble) {
      return inmueble;
    } else {
      console.warn('no encontro el inmueble');
      return undefined;
    }
  }
  convertirAVista(propietarios: IPropietario[]): IPropietarioVista[] {
    const lista: IPropietarioVista[] = [];
    for (const propietario of propietarios) {
      lista.push(this._propietariosService.convertirAVista(propietario));
    }
    return lista;
  }
}
