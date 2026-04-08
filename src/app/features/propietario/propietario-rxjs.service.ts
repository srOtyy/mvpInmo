import { Injectable, signal } from '@angular/core';
import { IPropietario } from './propietario.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
@Injectable({
  providedIn: 'root'
})
export class PropietarioRxjsService extends BaseCrudService<IPropietario> {
  constructor(http: HttpClient) { 
    super(http, 'http://localhost:3000/propietarios')
  }

  cargarLista(): void {
    this.cargar().subscribe({
      next: ()=> console.log('Propietarios cargados'),
      error: () => console.error('Error al cargar propietarios')
  });
  }
}
