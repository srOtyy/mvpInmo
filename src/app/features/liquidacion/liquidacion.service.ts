import { Injectable, signal } from '@angular/core';
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
import { numeroALetras } from '../../shared/utilitys';
@Injectable({
  providedIn: 'root',
})
export class LiquidacionGeneratorService extends BaseCrudService<Liquidacion> {
  //dia mostrado en el header
  ahora = new Date();

  $gastos: LiquidacionItem[] = [];
  $liquidacionSeleccionada = signal<Liquidacion>({} as Liquidacion);
  liquidacionInquilino = 'liquidacion-inquilino2.docx';
  liquidacionPropietario = 'liquidacion-propietario2.docx';
  minutaPropietario = 'propietario-minuta-template.docx';
  recibiInquilino = 'inquilino-recibi-template.docx';
  nombresMeses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  constructor(
    _http: HttpClient,
    private _inmueblesService: InmueblesRxjsService,
  ) {
    super(_http, 'http://localhost:3000/liquidaciones');
  }

  cargarLista(): void {
    if (this.$lista().length > 0) return;
    this.cargar().subscribe({
      next: () => console.log('Liquidacion cargada'),
      error: () => console.error('Error al cargar las liquidaciones'),
    });
  }

  //crear la liquidacion
  crearLiquidacion(
    contrato: IContrato,
    nombrePropietario: string,
    nombreInquilino: string,
  ): Liquidacion {
    const liquidacion: Liquidacion = {
      id: randomId(),
      contratoId: contrato.id,
      propietarioNombre: nombrePropietario,
      inquilinoNombre: nombreInquilino,
      inmuebleId: contrato.inmuebleId,
      periodo: new Date().toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
      }),
      fechaGeneracion: new Date(),
      itemsInquilino: [],
      itemsPropietario: [],
      montoAlquiler: contrato.rentaMensual,
      total: contrato.rentaMensual,
      honorarios: contrato.porcentajeHonorarios,
      inicioDelPeriodo: contrato.inicioDelPeriodo
        ? contrato.inicioDelPeriodo
        : 1,
    };
    return liquidacion;
  }

  async generarLiquidacionInquilinoDocx(
    liquidacion: Liquidacion,
  ): Promise<void> {
    const direccion = this._inmueblesService.obtenerDireccion(
      liquidacion.inmuebleId,
    );
    const piso = this._inmueblesService.devolverCaracteristica(
      liquidacion.inmuebleId,
      'piso',
    );
    const itemsInquilino = liquidacion.itemsInquilino.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));
    try {
      const response = await lastValueFrom(
        this.http.get(`/templates/${this.liquidacionInquilino}`, {
          responseType: 'arraybuffer',
        }),
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.render({
        contrato: liquidacion.contratoId,
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        inquilino: liquidacion.inquilinoNombre,
        itemsInquilino,
        montoAlquiler: this.formatearMonto(liquidacion.montoAlquiler),
        total: this.formatearMonto(
          liquidacion.montoAlquiler +
            liquidacion.itemsInquilino.reduce(
              (sum, item) => sum + item.monto,
              0,
            ),
        ),
        direccion: direccion,
        piso: piso,
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      saveAs(blob, `Liquidacion - ${liquidacion.inquilinoNombre}.docx`);
    } catch (error) {
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
  async generarLiquidacionPropietario(liquidacion: Liquidacion): Promise<void> {
    const direccion = this._inmueblesService.obtenerDireccion(
      liquidacion.inmuebleId,
    );
    const piso = this._inmueblesService.devolverCaracteristica(
      liquidacion.inmuebleId,
      'piso',
    );
    const letra = this._inmueblesService.devolverCaracteristica(
      liquidacion.inmuebleId,
      'letra',
    );
    const itemsInquilino = liquidacion.itemsInquilino.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));
    const itemsPropietario = liquidacion.itemsPropietario.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));
    const totalHonorarios =
      (liquidacion.honorarios * liquidacion.montoAlquiler) / 100;
    const totalItemsPropietario = liquidacion.itemsPropietario.reduce(
      (sum, item) => sum + item.monto,
      0,
    );
    const subtotalDcto = totalItemsPropietario + totalHonorarios;
    const subTotal =
      +liquidacion.montoAlquiler +
      liquidacion.itemsPropietario.reduce((sum, item) => sum + item.monto, 0) +
      liquidacion.itemsInquilino.reduce((sum, item) => sum + item.monto, 0);

    const total = subTotal - totalHonorarios;
    try {
      const response = await lastValueFrom(
        this.http.get(`/templates/liquidacion - Propietario - Base`, {
          responseType: 'arraybuffer',
        }),
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.render({
        contrato: liquidacion.contratoId,
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        inquilino: liquidacion.inquilinoNombre,
        itemsPropietario,
        itemsInquilino,
        montoAlquiler: this.formatearMonto(liquidacion.montoAlquiler),
        porcentajeHonorarios: liquidacion.honorarios,
        subTotal: this.formatearMonto(subTotal),
        subTotalDescuentos: this.formatearMonto(subtotalDcto),
        totalHonorarios: this.formatearMonto(totalHonorarios),
        total: this.formatearMonto(total),
        totalEscrito: numeroALetras(total),
        direccion: direccion,
        piso: piso,
        letra: letra,
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      saveAs(blob, `Liquidacion - ${liquidacion.propietarioNombre}.docx`);
    } catch (error) {
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
  async generarLiquidacionPropietarioDocx(
    liquidacion: Liquidacion,
  ): Promise<void> {
    const direccion = this._inmueblesService.obtenerDireccion(
      liquidacion.inmuebleId,
    );
    const piso = this._inmueblesService.devolverCaracteristica(
      liquidacion.inmuebleId,
      'piso',
    );
    const itemsInquilino = liquidacion.itemsInquilino.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));
    const itemsPropietario = liquidacion.itemsPropietario.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));
    const totalHonorarios =
      (liquidacion.honorarios * liquidacion.montoAlquiler) / 100;
    const totalItemsPropietario = liquidacion.itemsPropietario.reduce(
      (sum, item) => sum + item.monto,
      0,
    );
    const subtotalDescuento = totalItemsPropietario + totalHonorarios;
    const subTotal =
      +liquidacion.montoAlquiler +
      liquidacion.itemsPropietario.reduce((sum, item) => sum + item.monto, 0) +
      liquidacion.itemsInquilino.reduce((sum, item) => sum + item.monto, 0);

    const total = subTotal - totalHonorarios;
    try {
      const response = await lastValueFrom(
        this.http.get(`/templates/${this.liquidacionPropietario}`, {
          responseType: 'arraybuffer',
        }),
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.render({
        contrato: liquidacion.contratoId,
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        inquilino: liquidacion.inquilinoNombre,
        itemsPropietario,
        itemsInquilino,
        montoAlquiler: this.formatearMonto(liquidacion.montoAlquiler),
        porcentajeHonorarios: liquidacion.honorarios,
        subTotal: this.formatearMonto(subTotal),
        subTotalDescuentos: this.formatearMonto(subtotalDescuento),
        totalHonorarios: this.formatearMonto(totalHonorarios),
        total: this.formatearMonto(total),
        direccion: direccion,
        piso: piso,
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      saveAs(blob, `Liquidacion - ${liquidacion.propietarioNombre}.docx`);
    } catch (error) {
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
  async generarMinutaPropietario(liquidacion: Liquidacion): Promise<void> {
    const totalHonorarios =
      (liquidacion.honorarios * liquidacion.montoAlquiler) / 100;
    const totalItemsInquilino = liquidacion.itemsInquilino.reduce(
      (sum, item) => sum + item.monto,
      0,
    );
    const totalItemsPropietario = liquidacion.itemsPropietario.reduce(
      (sum, item) => sum + item.monto,
      0,
    );
    const subtotal = liquidacion.montoAlquiler + totalItemsInquilino;
    const subtotalDescuento = totalItemsPropietario + totalHonorarios;
    const total = subtotal - subtotalDescuento;
    const itemsInquilino = liquidacion.itemsInquilino.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));
    const itemsPropietario = liquidacion.itemsPropietario.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));
    try {
      const response = await lastValueFrom(
        this.http.get(`/templates/${this.minutaPropietario}`, {
          responseType: 'arraybuffer',
        }),
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.render({
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        itemsInquilino: itemsInquilino,
        itemsPropietario: itemsPropietario,
        montoAlquiler: this.formatearMonto(liquidacion.montoAlquiler),
        porcentajeHonorarios: liquidacion.honorarios,
        montoHonorarios: this.formatearMonto(totalHonorarios),
        subtotal: this.formatearMonto(subtotal),
        subtotalDescuento: this.formatearMonto(subtotalDescuento),
        total: this.formatearMonto(total),
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      saveAs(blob, `minuta - ${liquidacion.propietarioNombre}.docx`);
    } catch (error) {
      console.error('Error 1 al generar la liquidación;', error);
    }
  }
  async generarReciboInquilino(liquidacion: Liquidacion): Promise<void> {
    const montoAlquilerTexto = numeroALetras(liquidacion.montoAlquiler);
    const direccion = this._inmueblesService.obtenerDireccion(
      liquidacion.inmuebleId,
    );
    const piso = this._inmueblesService.devolverCaracteristica(
      liquidacion.inmuebleId,
      'piso',
    );
    const anioActual = this.ahora.getFullYear();
    const mesActual = this.nombresMeses[this.ahora.getMonth()];
    const indiceProximoMes = (this.ahora.getMonth() + 1) % 12; // Si es 12, vuelve a 0 (enero)
    const proximoMes = this.nombresMeses[indiceProximoMes];
    const anioProximoMes =
      this.ahora.getMonth() === 11 ? anioActual + 1 : anioActual;

    const mesYAnioActual = `${mesActual} del ${anioActual}`;
    const proximoMesYAnioActual = `${proximoMes} del ${anioProximoMes}`;
    const itemsInquilino = liquidacion.itemsInquilino.map((item) => ({
      ...item,
      monto: this.formatearMonto(item.monto),
    }));

    try {
      const response = await lastValueFrom(
        this.http.get(`/templates/${this.recibiInquilino}`, {
          responseType: 'arraybuffer',
        }),
      );
      const content = new Uint8Array(response as ArrayBuffer);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.render({
        direccion: direccion,
        piso: piso,
        mesYAnioActual: mesYAnioActual,
        proximoMesYAnioActual: proximoMesYAnioActual,
        contrato: liquidacion.contratoId,
        periodo: liquidacion.periodo,
        propietario: liquidacion.propietarioNombre,
        inquilino: liquidacion.inquilinoNombre,
        itemsInquilino,
        montoAlquiler: this.formatearMonto(liquidacion.montoAlquiler),
        montoAlquilerTexto: montoAlquilerTexto,
        total: this.formatearMonto(
          liquidacion.montoAlquiler +
            liquidacion.itemsInquilino.reduce(
              (sum, item) => sum + item.monto,
              0,
            ),
        ),
        inicioDelPeriodo: liquidacion.inicioDelPeriodo,
      });

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      saveAs(blob, `Recibo - ${liquidacion.inquilinoNombre}.docx`);
    } catch (error) {
      console.error('Error 1 al generar la liquidación;', error);
    }
  }

  buscarLiquidacionPorId(id: number): Liquidacion | undefined {
    return this.$lista().find((l) => l.id === id);
  }

  //buscar liquidacion x id de contrato
  buscarLiquidacionPorContrato(id: number): Liquidacion | undefined {
    return this.$lista().find((l) => l.contratoId === id);
  }
  buscarIdLiquidacionPorContratoId(contratoId: number): number {
    const contrato = this.$lista().find((c) => c.contratoId == contratoId);
    console.log(contrato);
    if (contrato) {
      return contrato.id;
    } else {
      return 0;
    }
  }
  eliminarLiquidacionPorIdDeContrato(idDelContrato: number) {
    const idLiquidacion = this.buscarIdLiquidacionPorContratoId(idDelContrato);
    if (idLiquidacion !== 0) {
      this.eliminar(idLiquidacion).subscribe({
        next: () => {
          console.log('liquidacion eliminada');
        },
      });
    } else {
      console.warn(
        "No se pudo eliminar la liquidacion con 'eliminarLiquidacionPorIdDeContrato()'",
      );
      console.log('El id de liquidacion dió 0');
    }
  }
  //liquidacionSeleccionada signal
  setSignalSeleccionado(liquidacion: Liquidacion) {
    this.$liquidacionSeleccionada.set(liquidacion);
  }
  actualizarLiquidacionSeleccionada() {
    this.actualizar(
      this.$liquidacionSeleccionada().id,
      this.$liquidacionSeleccionada(),
    );
  }
  actualizarMontoAlquiler(id: number, monto: number) {
    const liquidacion = this.buscarLiquidacionPorId(id);
    if (liquidacion) {
      liquidacion.montoAlquiler = monto;
      this.actualizar(id, liquidacion);
    }
  }
  actualizarHonorarios(idContrato: number, honorarios: number) {
    const liquidacionAux = this.buscarLiquidacionPorContrato(idContrato);
    if (liquidacionAux) {
      liquidacionAux.honorarios = honorarios;
      this.actualizar(liquidacionAux.id, liquidacionAux).subscribe({
        next: () => console.log('liquidacion actualizada'),
      });
    } else {
      console.warn('liquidacion no encontrada :(');
    }
  }
  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(monto);
  }
}
