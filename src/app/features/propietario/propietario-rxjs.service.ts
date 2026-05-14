import { Injectable } from '@angular/core';
import { IPropietario } from './propietario.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
import { firstValueFrom } from 'rxjs';
import { obtenerCaracteristica } from '../caracteristicas/entity-helpers';

@Injectable({
  providedIn: 'root'
})
export class PropietarioRxjsService extends BaseCrudService<IPropietario> {
  constructor(http: HttpClient) { 
    super(http, 'http://localhost:3000/propietarios')
  }

  cargarLista(): void {
    if (this.$lista().length > 0){
      return;
    }else{
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
  //probablemente elimine esta funcion ya que estoy haciendo una version más amplia y mas general 

  async obtenerPropietarioPorId(idPropietario: number): Promise<IPropietario | undefined> {
    if (this.$lista().length === 0) {
      await firstValueFrom(this.cargar());
    }
    return this.$lista().find(p => p.id === idPropietario);
  }

  obtenerNombrePropietarioPorId(idPropietario: number): string {
    const propietario = this.$lista().find(p => p.id === idPropietario);
    if (!propietario) {
      console.warn(`Propietario con ID ${idPropietario} no encontrado. Asegúrate de que la lista de propietarios esté cargada. ( agregar async/await a la función que llama a esta función)`);
      return 'Propietario no encontrado';
    }
    return obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible').toString();
  }  
}
