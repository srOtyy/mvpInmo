import { Injectable, signal } from '@angular/core';
import { IPropietario } from './propietario.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
@Injectable({
  providedIn: 'root'
})
export class PropietarioRxjsService extends BaseCrudService<IPropietario> {
  $listaPropietarios = signal<IPropietario[]>([]);
  constructor(http: HttpClient) { 
    super(http, 'http://localhost:3000/propietarios')
  }

  obtenerLista(): IPropietario[] {
    return this.$listaPropietarios();
  }
}
