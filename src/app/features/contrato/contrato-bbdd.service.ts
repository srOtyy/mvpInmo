import { Injectable } from '@angular/core';
import { IContrato } from './contrato.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
import { InquilinoRxjsService } from '../inquilino/inquilino-rxjs.service';
import { InmueblesRxjsService } from '../inmueble/inmuebles-rxjs.service';
import { PropietarioRxjsService } from '../propietario/propietario-rxjs.service';
import { IPropietario } from '../propietario/propietario.interface';
import { IInquilino } from '../inquilino/inquilino.interface';
import { IInmueble } from '../inmueble/inmueble.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoBbddService extends BaseCrudService<IContrato> {

  constructor( http: HttpClient, private _rxjsInmuebles: InmueblesRxjsService, private _rxjsInquilinos: InquilinoRxjsService, private _rxjsPropietarios: PropietarioRxjsService ) {
    super(http, 'http://localhost:3000/contratos')
  }
  $listaPropietarios: IPropietario[] = [];
  $listaInquilinos: IInquilino[] = [];
  $listaInmuebles: IInmueble[] = [];

  cargarLista(): void {
    if (this.$lista().length > 0) return;
    this.cargar().subscribe({
      next: ()=> console.log('Contratos cargados'),
      error: () => console.error('Error al cargar contratos')
    });
  }
  async obtenerListas(): Promise<void> {
  try {
    await Promise.all([
      firstValueFrom(this._rxjsPropietarios.cargar()),
      firstValueFrom(this._rxjsInquilinos.cargar()),
      firstValueFrom(this._rxjsInmuebles.cargar())
    ]);
    this.$listaPropietarios = this._rxjsPropietarios.$lista();
    this.$listaInquilinos = this._rxjsInquilinos.$lista();
    this.$listaInmuebles = this._rxjsInmuebles.$lista();
    console.log('Listas de entidades cargadas en el servicio de contratos...');
  } catch (error) {
    console.error('Error al cargar las listas:', error);
  }
}
  mostrarListas(): void {
    console.log('Propietarios:', this.$listaPropietarios);
    console.log('Inquilinos:', this.$listaInquilinos);
    console.log('Inmuebles:', this.$listaInmuebles);  
  }
  //en desuso, evaluar funcionalidad a futuro
  setFetecha(dia: number, mes: number, anio: number): Date {
    const fecha = new Date();
    fecha.setDate(dia);
    fecha.setMonth(mes - 1);
    fecha.setFullYear(anio);
    return fecha;
  }
 
}
