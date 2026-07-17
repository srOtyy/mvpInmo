import { Injectable } from '@angular/core';
import { IInquilino, IInquilinoVista } from './inquilino.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
import {obtenerNombre} from '../caracteristicas/entity-helpers';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InquilinoRxjsService extends BaseCrudService<IInquilino> {
  ordenAlfabetico: boolean = false;
  obtenerNombre = obtenerNombre;
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


 async obtenerInquilinoPorId(idInquilino  : number): Promise<IInquilino | undefined> {
    if (this.$lista().length === 0) {
      await firstValueFrom(this.cargar());
    }
    return this.$lista().find(p => p.id === idInquilino);
  }
  ordenarAlfabeticamente(){
    if (!this.ordenAlfabetico) {
      this.$lista.set([...this.$lista()].sort((a, b) => {
        const nombreA = this.obtenerNombre(a);
        const nombreB = this.obtenerNombre(b);
        return nombreA.localeCompare(nombreB);
      }));
      this.ordenAlfabetico = true;
    }
    else{
      this.$lista.set([...this.$lista()].sort((a, b) => {
        const nombreA = this.obtenerNombre(a);
        const nombreB = this.obtenerNombre(b);
        return nombreB.localeCompare(nombreA);
      }));
      this.ordenAlfabetico = false;
    }
  }

  convertirAVista(i: IInquilino):IInquilinoVista{
    const nombre = this.obtenerNombre(i)
    return{
      ...i,
      nombre
    }
  }
}
