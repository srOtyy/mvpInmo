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
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { obtenerCaracteristica } from '../caracteristicas/entity-helpers';

@Injectable({
  providedIn: 'root'
})
export class ContratoBbddService extends BaseCrudService<IContrato> {
  $listaPropietarios: IPropietario[] = [];
  $listaInquilinos: IInquilino[] = [];
  $listaInmuebles: IInmueble[] = [];
  private contratoSeleccionado: BehaviorSubject<IContrato | null> = new BehaviorSubject<IContrato | null>( null );
  public contratoSeleccionado$: Observable<IContrato | null> = this.contratoSeleccionado.asObservable();

  constructor( http: HttpClient, 
    private _rxjsInmuebles: InmueblesRxjsService, 
    private _rxjsInquilinos: InquilinoRxjsService, 
    private _rxjsPropietarios: PropietarioRxjsService
    ){
    super(http, 'http://localhost:3000/contratos')
    }
 

   cargarLista(): void {
     if (this.$lista().length > 0) return;
     this.cargar().subscribe({
       next: () => console.log('Contratos cargados'),
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
   } catch (error) {
     console.error('Error al cargar las listas:', error);
   }
  }

  generarTituloContrato(idPropietario: string, idInquilino: string): string {
    const propietario = this.$listaPropietarios.find(p => p.id.toString() === idPropietario);
    const inquilino = this.$listaInquilinos.find(i => i.id.toString() === idInquilino);
    if( propietario && inquilino) {
      const nombrePropietario = obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible');
      const nombreInquilino = obtenerCaracteristica(inquilino, 'nombre', 'Nombre no disponible');
      return `${nombrePropietario} - ${nombreInquilino}`;
    }
    return 'Título no disponible';
  }
  mostrarListas(): void {
    console.log('Propietarios:', this.$listaPropietarios);
    console.log('Inquilinos:', this.$listaInquilinos);
    console.log('Inmuebles:', this.$listaInmuebles);  
  }
  obtenerContratoPorId(id : number): IContrato | undefined {
    return this.$lista().find(contrato => contrato.id === id);
  }

  // para setear el nombre del item-entidad del contrato " propietario - inquilino "
  async setNombrePropietario(id: number): Promise<string>{
      const propietario = await this._rxjsPropietarios.obtenerPropietarioPorId(id);
      if (propietario !== undefined){ 
       return obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible').toString();
      }
      return 'Nombre no disponible';
    }

  async setNombreInquilino(id: number): Promise<string>{
    const inquilino = await this._rxjsInquilinos.obtenerInquilinoPorId(id);
    if (inquilino !== undefined){
      return obtenerCaracteristica(inquilino, 'nombre', 'Nombre no disponible').toString();
    }
    return 'Nombre no disponible';
  }
  // para el contrato BehaviurSubject
  seleccionarContrato(contrato: IContrato): void {
    this.contratoSeleccionado.next(contrato);
  }

  //filtrar por fecha
  filtrarContratosPorFechaFin(): IContrato[] {
    return this.$lista().sort((a, b) => new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime());
  }
  filtrarContratosPorFechaInicio(): IContrato[] {
    return this.$lista().sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
  }
  filtrarContratosPorFecha(fecha: Date): IContrato[] {
    const fechaObj = new Date(fecha);
    return this.$lista().filter(contrato => new Date(contrato.fechaFin) >= fechaObj);
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
