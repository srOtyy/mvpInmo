import { Component, Input } from '@angular/core';
import { obtenerCaracteristica } from '../../../caracteristicas/entity-helpers';
import { IInmueble } from '../../inmueble.interface';
import { MatDivider } from '@angular/material/divider';
import { InmueblesRxjsService } from '../../inmuebles-rxjs.service';
@Component({
  selector: 'app-ver-inmueble',
  standalone: true,
  imports: [MatDivider],
  templateUrl: './ver-inmueble.component.html',
  styleUrl: './ver-inmueble.component.scss'
})
export class VerInmuebleComponent {
  @Input() entidad!: IInmueble;
      nombre: string = '';
      obtenerCaracteristica = (clave: string) =>
        obtenerCaracteristica(this.entidad, clave);
  constructor(private _rxjsInmuebles: InmueblesRxjsService) {}

  /**
   * Busca el nombre del propietario del inmueble.
   * IMPORTANTE: Usa async/await porque obtenerPropietarioPorId es asíncrono
   * (requiere cargar los propietarios desde el servidor).
   */
  async buscarNombrePropietario() {
    this.nombre = await this._rxjsInmuebles.obtenerPropietarioPorId(this.entidad.idPropietario) || 'Desconocido';
    console.log('Nombre del propietario:', this.nombre);
  }

}
