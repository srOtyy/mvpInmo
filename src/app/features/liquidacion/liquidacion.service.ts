
import { Injectable, OnInit, signal } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { Liquidacion, LiquidacionItem } from './liquidacion-interface';
import { IContrato } from '../contrato/contrato.interface';
import { randomId } from '../../shared/utilitys';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { BaseCrudService } from '../../core/http/base-crud.service';
import { InmueblesRxjsService } from '../inmueble/inmuebles-rxjs.service';
@Injectable({
  providedIn: 'root'
})
export class LiquidacionGeneratorService extends BaseCrudService<Liquidacion>{
  $gastos: LiquidacionItem[] = [];
  $liquidacionSeleccionada = signal<Liquidacion>({} as Liquidacion)
  liquidacionInquilino = 'liquidacion-inquilino2.docx'
  liquidacionPropietario = 'liquidacion-propietario2.docx'
  ahora = new Date()
  nombresMeses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
  constructor( _http: HttpClient, private _inmueblesService: InmueblesRxjsService ) { 
    super(_http, 'http://localhost:3000/liquidaciones')
  }
  cargarLista(): void {
     if (this.$lista().length > 0) return;
     this.cargar().subscribe({
       next: () => console.log('Liquidacion cargada'),
       error: () => console.error('Error al cargar las liquidaciones')
     });
   }
 //crear la liquidacion
  crearLiquidacion(contrato: IContrato, nombrePropietario: string, nombreInquilino: string): Liquidacion {
    const liquidacion: Liquidacion = {
      id: randomId() ,
      contratoId: contrato.id,
      propietarioNombre: nombrePropietario,
      inquilinoNombre: nombreInquilino,
      inmuebleId: contrato.inmuebleId,
      periodo: new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
      fechaGeneracion: new Date(),
      itemsInquilino: [],
      itemsPropietario: [],
      montoAlquiler: contrato.rentaMensual,
      total: contrato.rentaMensual,
      honorarios: contrato.porcentajeHonorarios
    }
    return liquidacion
  }

  async generarLiquidacionInquilinoDocx(liquidacion: Liquidacion): Promise<void> {
    const direccion = this._inmueblesService.obtenerDireccion(liquidacion.inmuebleId)
    const piso = this._inmueblesService.devolverCaracteristica(liquidacion.inmuebleId,"piso")
    try{
      const response = await lastValueFrom(
        this.http.get(`/templates/${this.liquidacionInquilino}`, { responseType: 'arraybuffer' })
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {paragraphLoop: true,linebreaks: true});
      doc.render({
        contrato: liquidacion.contratoId,
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        inquilino: liquidacion.inquilinoNombre,
        itemsInquilino: liquidacion.itemsInquilino,
        montoAlquiler: liquidacion.montoAlquiler,
        total: liquidacion.montoAlquiler + liquidacion.itemsInquilino.reduce((sum, item) => sum + item.monto, 0),
        direccion: direccion,
        piso: piso
      });

      const blob = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      saveAs(blob, `Liquidacion - ${liquidacion.inquilinoNombre}.docx`);
    }
    catch(error){
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
  
  async generarLiquidacionPropietarioDocx(liquidacion: Liquidacion): Promise<void> {
    const direccion = this._inmueblesService.obtenerDireccion(liquidacion.inmuebleId)
    const piso = this._inmueblesService.devolverCaracteristica(liquidacion.inmuebleId,"piso")
    const totalHonorarios = liquidacion.honorarios * liquidacion.montoAlquiler / 100
    const totalItemsPropietario = liquidacion.itemsPropietario.reduce((sum, item) => sum + item.monto, 0)
    const subtotalDescuento = totalItemsPropietario + totalHonorarios 
    const subTotal = liquidacion.montoAlquiler + liquidacion.itemsPropietario.reduce((sum, item) => sum + item.monto, 0)
    const total = subTotal - totalHonorarios
    try{
      const response = await lastValueFrom(
        this.http.get(`/templates/${this.liquidacionPropietario}`, { responseType: 'arraybuffer' })
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      doc.render({
        contrato: liquidacion.contratoId,
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        inquilino: liquidacion.inquilinoNombre,
        itemsPropietario: liquidacion.itemsPropietario,
        itemsInquilino: liquidacion.itemsInquilino,
        montoAlquiler: liquidacion.montoAlquiler,
        porcentajeHonorarios: liquidacion.honorarios,
        subTotalDescuentos: subtotalDescuento,
        totalHonorarios: totalHonorarios,
        total: total,
        direccion: direccion,
        piso: piso
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      saveAs(blob, `Liquidacion - ${liquidacion.propietarioNombre}.docx`);
    }
    catch(error){
      console.error('Error 1 al generar la liquidación;', error);
    }
  }


  async generarMinutaPropietario(liquidacion: Liquidacion): Promise<void> {
    const totalHonorarios = liquidacion.honorarios * liquidacion.montoAlquiler / 100
    const totalItemsInquilino = liquidacion.itemsInquilino.reduce((sum, item) => sum + item.monto, 0)
    const totalItemsPropietario = liquidacion.itemsPropietario.reduce((sum, item) => sum + item.monto, 0)
    const subtotal = liquidacion.montoAlquiler + totalItemsInquilino
    const subtotalDescuento = totalItemsPropietario + totalHonorarios 
    const total = subtotal - subtotalDescuento

    try{
      const response = await lastValueFrom(
        this.http.get(`/templates/propietario-minuta-template.docx`, { responseType: 'arraybuffer' })
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      doc.render({
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        itemsInquilino: liquidacion.itemsInquilino,
        itemsPropietario: liquidacion.itemsPropietario,
        montoAlquiler: liquidacion.montoAlquiler,
        porcentajeHonorarios: liquidacion.honorarios,
        montoHonorarios: totalHonorarios,
        subtotal: subtotal,
        subtotalDescuento: subtotalDescuento,
        total: total
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      saveAs(blob, `Liquidacion - ${liquidacion.propietarioNombre}.docx`);
    }
    catch(error){
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
   async generarReciboInquilino(liquidacion: Liquidacion): Promise<void> {
    const direccion = this._inmueblesService.obtenerDireccion(liquidacion.inmuebleId)
    const piso = this._inmueblesService.devolverCaracteristica(liquidacion.inmuebleId,"piso")
    const anioActual = this.ahora.getFullYear();
    const mesActual = this.nombresMeses[this.ahora.getMonth()];
    const indiceProximoMes = (this.ahora.getMonth() + 1) % 12; // Si es 12, vuelve a 0 (enero)
    const proximoMes = this.nombresMeses[indiceProximoMes];
    const anioProximoMes = this.ahora.getMonth() === 11 ? anioActual + 1 : anioActual;

    const mesYAnioActual = `${mesActual} del ${anioActual}`;
    const proximoMesYAnioActual = `${proximoMes} del ${anioProximoMes}`;
    try{
      const response = await lastValueFrom(
        this.http.get(`/templates/inquilino-recibi-template.docx`, { responseType: 'arraybuffer' })
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {paragraphLoop: true,linebreaks: true});
      doc.render({
        direccion: direccion,
        piso: piso,
        mesYAnioActual: mesYAnioActual,
        proximoMesYAnioActual: proximoMesYAnioActual,
        contrato: liquidacion.contratoId,
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        inquilino: liquidacion.inquilinoNombre,
        itemsInquilino: liquidacion.itemsInquilino,
        montoAlquiler: liquidacion.montoAlquiler,
        total: liquidacion.montoAlquiler + liquidacion.itemsInquilino.reduce((sum, item) => sum + item.monto, 0)
      });

      const blob = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      saveAs(blob, `Liquidacion - ${liquidacion.inquilinoNombre}.docx`);
    }
    catch(error){
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
 
  buscarLiquidacionPorId(id: number): Liquidacion | undefined {
    return this.$lista().find(l => l.id === id);
  }

  //buscar liquidacion x id de contrato
  buscarLiquidacionPorContrato(id: number): Liquidacion | undefined  {
    return this.$lista().find(l => l.contratoId === id )
  }
  buscarIdLiquidacionPorContratoId(contratoId:number): number{
    const contrato = this.$lista().find(c => c.contratoId == contratoId)
    console.log(contrato)
    if(contrato){
      return contrato.id
    }else{
      return 0
    }
  }
  eliminarLiquidacionPorIdDeContrato(idDelContrato: number){
    const idLiquidacion = this.buscarIdLiquidacionPorContratoId(idDelContrato) 
    if(idLiquidacion !== 0){
      this.eliminar(idLiquidacion).subscribe({
        next: ()=>{
          console.log("liquidacion eliminada?")
        }
      })
    }else{
      console.warn("No se pudo eliminar la liquidacion con 'eliminarLiquidacionPorIdDeContrato()'")
      console.log("El id de liquidacion dió 0")
    }
  }
  //liquidacionSeleccionada signal
  setSignalSeleccionado(liquidacion: Liquidacion){
    this.$liquidacionSeleccionada.set(liquidacion)
  }
  
}
