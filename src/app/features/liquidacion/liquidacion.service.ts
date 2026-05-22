
import { Injectable } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { Liquidacion, LiquidacionItem } from './liquidacion-interface';
import { IContrato } from '../contrato/contrato.interface';
import { randomId } from '../../shared/utilitys';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LiquidacionGeneratorService {
  $gastos: LiquidacionItem[] = [];
  constructor( private _http: HttpClient ) { }

  crearLiquidacion(contrato: IContrato, nombrePropietario: string, nombreInquilino: string, items: LiquidacionItem[]) {
    const liquidacion: Liquidacion = {
      id: randomId().toString() ,
      contratoId: contrato.id.toString(),
      propietarioNombre: nombrePropietario,
      inquilinoNombre: nombreInquilino,
      periodo: `Inicio: ${contrato.fechaInicio} - Fin: ${contrato.fechaFin}`,
      fechaGeneracion: new Date(),
      items: items,
      total: items.reduce((sum, item) => sum + item.monto, 0) 
    }
    this.generar(liquidacion).then(() => {
      console.log('Liquidación generada con éxito');
    }).catch(error => {
      console.error('Error 2 al generar la liquidación:', error);
    });
  }
  async generar(liquidacion: Liquidacion): Promise<void> {
    try{
      const response = await lastValueFrom(
        this._http.get('/templates/liquidacion-base2.docx', { responseType: 'arraybuffer' })
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
        total: liquidacion.total
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      saveAs(blob, 'liquidacion.docx');
    }
    catch(error){
      console.error('Error 1 al generar la liquidación;', error);
    }
  }

 
  //creacion en db.json
  // que es lastValueFrom? Es una función de RxJS que convierte un Observable en una Promise, permitiendo usar async/await con Observables.
  crearLiquidacionEnDB(liquidacion: Liquidacion): Promise<Liquidacion> {
    return lastValueFrom(
      this._http.post<Liquidacion>('/liquidaciones', liquidacion)
    );
  }
  editarLiquidacionEnDB(liquidacion: Liquidacion): Promise<Liquidacion> {
    return lastValueFrom(
      this._http.put<Liquidacion>(`/liquidaciones/${liquidacion.id}`, liquidacion)
    );
  }
  agregarGastosEnDB(liquidacion: Liquidacion, gastos: LiquidacionItem[]): Promise<Liquidacion> {
    liquidacion.items = [...liquidacion.items, ...gastos];
    liquidacion.total = liquidacion.items.reduce((sum, item) => sum + item.monto, 0);
    return this.editarLiquidacionEnDB(liquidacion);
  }
  eliminarLiquidacionEnDB(liquidacionId: string): Promise<void> {
    return lastValueFrom(
      this._http.delete<void>(`/liquidaciones/${liquidacionId}`)
    );
  }
}
