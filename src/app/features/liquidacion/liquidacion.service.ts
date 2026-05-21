
import { Injectable } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { Liquidacion, LiquidacionItem } from './liquidacion-interface';
import { IContrato } from '../contrato/contrato.interface';
import { randomId } from '../../shared/utilitys';
@Injectable({
  providedIn: 'root'
})
export class LiquidacionGeneratorService {
  constructor() { }
  crearLiquidacion(contrato: IContrato, nombrePropietario: string, nombreInquilino: string): Liquidacion {
    const liquidacion: Liquidacion = {
      id: randomId().toString() ,
      contratoId: contrato.id.toString(),
      propietarioNombre: nombrePropietario,
      inquilinoNombre: nombreInquilino,
      periodo: `${contrato.fechaInicio} - ${contrato.fechaFin}`,
      fechaGeneracion: new Date(),
      items: [],
      total: contrato.rentaMensual

    }
    return liquidacion
  }
  async generar(liquidacion: Liquidacion): Promise<void> {

    const response = await fetch(
      '../../templates/liquidacion-base.docx'
    );
    const content = await response.arrayBuffer();
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    doc.render({
      contratoNumero: liquidacion.contratoId,
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
}
