import { Injectable } from '@angular/core';
import { IPropietario } from './propietario.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PropietarioRxjsService extends BaseCrudService<IPropietario> {
  constructor(http: HttpClient) { 
    super(http, 'http://localhost:3000/propietarios')
  }

  /**
   * Carga la lista de propietarios solo si no está ya cargada.
   * Evita múltiples peticiones HTTP innecesarias.
   */
  cargarLista(): void {
    if (this.$lista().length > 0) return;
    this.cargar().subscribe({
      next: ()=> console.log('Propietarios cargados'),
      error: () => console.error('Error al cargar propietarios')
    });
  }

  /**
   * Obtiene un propietario por su ID.
   * IMPORTANTE: Usa async/await porque cargar() es una operación asíncrona (HTTP).
   * Si la lista no está cargada, espera a que termine la petición antes de retornar.
   * @param idPropietario - ID del propietario a buscar
   * @returns Promise con el propietario o undefined
   */
  async obtenerPropietario(idPropietario: number): Promise<IPropietario | undefined> {
    if (this.$lista().length === 0) {
      await firstValueFrom(this.cargar());
    }
    return this.$lista().find(p => p.id === idPropietario);
  }

  /**
   * Obtiene el nombre de un propietario por su ID.
   * Busca en el array de características la que tenga clave "nombre".
   * @param idPropietario - ID del propietario
   * Promise con el nombre o undefined
   */
  async obtenerNombrePropietario(idPropietario: number): Promise<string | undefined> {
    const propietario = await this.obtenerPropietario(idPropietario);
    if (!propietario) {
      console.log("Propietario no encontrado con ID:", idPropietario);
      return undefined;
    } else{
      console.log('Propietario encontrado:', propietario);
      const caracteristicaNombre = propietario.caracteristicas.find(c => c.clave === 'nombre');
      return caracteristicaNombre?.valor?.toString();
    }
    
  }
}
