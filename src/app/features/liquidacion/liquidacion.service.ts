
import { Injectable, OnInit } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { Liquidacion, LiquidacionItem } from './liquidacion-interface';
import { IContrato } from '../contrato/contrato.interface';
import { randomId } from '../../shared/utilitys';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { BaseCrudService } from '../../core/http/base-crud.service';
@Injectable({
  providedIn: 'root'
})
export class LiquidacionGeneratorService extends BaseCrudService<Liquidacion>{
  $gastos: LiquidacionItem[] = [];
  constructor( _http: HttpClient ) { 
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
      periodo: new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
      fechaGeneracion: new Date(),
      items: [],
      montoAlquiler: contrato.rentaMensual,
      total: contrato.rentaMensual
    }
    return liquidacion
  }
  // emitir un .docx
  async generarLiquidacionDocx(liquidacion: Liquidacion): Promise<void> {
    try{
      const response = await lastValueFrom(
        this.http.get('/templates/liquidacion-base2.docx', { responseType: 'arraybuffer' })
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
        items: liquidacion.items,
        montoAlquiler: liquidacion.montoAlquiler,
        total: liquidacion.montoAlquiler + liquidacion.items.reduce((sum, item) => sum + item.monto, 0)
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      saveAs(blob, `Liquidacion - ${liquidacion.propietarioNombre}-${liquidacion.inquilinoNombre}.docx`);
    }
    catch(error){
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
 
  //solicitudes a db.json
  agregarGastosEnDB(liquidacion: Liquidacion, gastos: LiquidacionItem[]){
    liquidacion.items = [...liquidacion.items, ...gastos];
    this.actualizar(liquidacion.id, liquidacion);
  }
  buscarLiquidacionPorId(id: number): Liquidacion | undefined {
    return this.$lista().find(l => l.id === id);
  }
  eliminarGastosEnDB(liquidacion: Liquidacion){
    liquidacion.items = [];
    this.actualizar(liquidacion.id, liquidacion);
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
  
}
