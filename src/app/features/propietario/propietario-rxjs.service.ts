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
    if (this.$lista().length > 0){
      console.log('Lista de propietarios ya cargada', this.endpoint);
      return;
    }else{
      console.log('Cargando lista de propietarios desde el servidor...');
      this.cargar().subscribe({
      next: ()=> console.log('Propietarios cargados'),
      error: () => console.error('Error al cargar propietarios')
    });
  }
    }
    



  /**
   * Las funciones de abajo sirven para la asignacion de propietarios a inmuebles. Son asíncronas porque dependen de que la lista de propietarios esté cargada desde el servidor.
   * Obtiene un propietario por su ID.
   * Usa async/await porque cargar() es una operación asíncrona (HTTP).
   * Si la lista no está cargada, espera a que termine la petición antes de retornar.
   */
  async obtenerPropietario(idPropietario: number): Promise<IPropietario | undefined> {
    if (this.$lista().length === 0) {
      await firstValueFrom(this.cargar());
    }
    return this.$lista().find(p => p.id === idPropietario);
  }

  async obtenerNombrePropietarioPorId(idPropietario: number): Promise<string | undefined> {
    const propietario = await this.obtenerPropietario(idPropietario);
    if (!propietario) {
      console.log("Propietario no encontrado con ID:", idPropietario);
      return undefined;
    } else{
      const caracteristicaNombre = propietario.caracteristicas.find(c => c.clave === 'nombre');
      return caracteristicaNombre?.valor?.toString();
    }
    
  }
  obtenerNombrePropietario(propietario: IPropietario): string {
    const caracteristicaNombre = propietario.caracteristicas.find(c => c.clave === 'nombre');
    return caracteristicaNombre?.valor?.toString() ? caracteristicaNombre.valor.toString() : 'Propietario sin nombre';
  }
  
}
