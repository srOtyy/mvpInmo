import { Injectable } from '@angular/core';
import { IContrato } from './contrato.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoBbddService extends BaseCrudService<IContrato> {

  constructor( http: HttpClient) {
    super(http, 'http://localhost:3000/contratos')
  }


  cargarLista(): void {
    if (this.$lista().length > 0) return;
    this.cargar().subscribe({
      next: ()=> console.log('Contratos cargados'),
      error: () => console.error('Error al cargar contratos')
    });
  }

  setFetecha(dia: number, mes: number, anio: number): Date {
    const fecha = new Date();
    fecha.setDate(dia);
    fecha.setMonth(mes - 1);
    fecha.setFullYear(anio);
    return fecha;
  }
 
}
