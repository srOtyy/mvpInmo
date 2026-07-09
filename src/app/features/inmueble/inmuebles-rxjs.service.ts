import { Injectable } from '@angular/core';
import { IInmueble } from './inmueble.interface';
import { BaseCrudService } from '../../core/http/base-crud.service';
import { HttpClient } from '@angular/common/http';
import { PropietarioRxjsService } from '../propietario/propietario-rxjs.service';
@Injectable({
  providedIn: 'root'
})

export class InmueblesRxjsService extends BaseCrudService<IInmueble> {

  constructor( http: HttpClient, private _rxjsPropietarios: PropietarioRxjsService ) {
    super(http, 'http://localhost:3000/inmuebles')
  }

 /**
 * Carga la lista de inmuebles solo si no está ya cargada.
 * Evita múltiples peticiones HTTP innecesarias.
 */
cargarLista(): void {
  if (this.$lista().length > 0) return;
  this.cargar().subscribe({
    error: () => console.error('Error al cargar inmuebles')
  });
}
  /**
   * Obtiene el nombre del propietario de un inmueble.
   * IMPORTANTE: Usa async/await porque obtenerNombrePropietario del servicio de propietarios
   * es una operación asíncrona (requiere esperar a que cargue la lista desde el servidor)
   */
  async obtenerPropietarioPorId(idPropietario: number): Promise<string | undefined> {
    this._rxjsPropietarios.cargarLista(); // Asegura que la lista de propietarios esté cargada  
    return this._rxjsPropietarios.obtenerNombrePropietarioPorId(idPropietario)
  }
  devolverCaracteristica(idImueble: number, caracteristica: string):string | number | boolean {
    const inmueble = this.$lista().find(i => i.id === idImueble)
    if(inmueble){
      const valor =  inmueble.caracteristicas.find( c => c.clave == caracteristica )?.valor
      if (valor){
        return valor
      }else{
        console.warn("valor dió undefinded, id inmueble:",idImueble,"caracteristica:",caracteristica,"valor:",valor,"inmueble",inmueble)
      }
    }
    return ''
  }
  obtenerDireccion(idInmueble:number):string{
    const inmueble = this.$lista().find(i => i.id === idInmueble)
    if(inmueble){
      return inmueble.direccion
    }
    console.warn("no encontro el inmueble")
    return ''
  }
   
}
