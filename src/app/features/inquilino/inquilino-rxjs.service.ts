import { Injectable } from '@angular/core';
import { IInquilino } from './inquilino.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
@Injectable({
  providedIn: 'root'
})
export class InquilinoRxjsService extends BaseCrudService<IInquilino> {
  constructor( http: HttpClient ) {
    super(http, 'http://localhost:3000/inquilinos')
  }
/**
   * Carga la lista de inquilinos solo si no está ya cargada.
   * Evita múltiples peticiones HTTP innecesarias.
   */
  cargarLista(): void {
    if (this.$lista().length > 0) return;
    this.cargar().subscribe({
      next: ()=> console.log('Inquilinos cargados'),
      error: () => console.error('Error al cargar inquilinos')
    });
  }
}
