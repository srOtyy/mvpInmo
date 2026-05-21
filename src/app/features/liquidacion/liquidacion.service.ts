
import { Injectable } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { Liquidacion } from './liquidacion-interface';
import { IContrato } from '../contrato/contrato.interface';
import { randomId } from '../../shared/utilitys';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LiquidacionGeneratorService {
  constructor( private _http: HttpClient ) { }

  crearLiquidacion(contrato: IContrato, nombrePropietario: string, nombreInquilino: string): Liquidacion {
    const liquidacion: Liquidacion = {
      id: randomId().toString() ,
      contratoId: contrato.id.toString(),
      propietarioNombre: nombrePropietario,
      inquilinoNombre: nombreInquilino,
      periodo: `Inicio: ${contrato.fechaInicio} - Fin: ${contrato.fechaFin}`,
      fechaGeneracion: new Date(),
      items: [],
      total: contrato.rentaMensual

    }
    return liquidacion
  }
  async generar(liquidacion: Liquidacion): Promise<void> {
    try{
      const response = await lastValueFrom(
        this._http.get('/templates/liquidacion-base.docx', { responseType: 'arraybuffer' })
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
      console.log("liquidacion generada:", liquidacion);
      saveAs(blob, 'liquidacion.docx');

    }
    catch(error){
      console.error('Error al generar la liquidación;', error);
    }
  }
}
