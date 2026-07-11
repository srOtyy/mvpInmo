export interface Liquidacion {
  id: number;
  contratoId: number;
  propietarioNombre: string;
  inquilinoNombre: string;
  inmuebleId: number,
  periodo: string;
  fechaGeneracion: Date;
  itemsInquilino: LiquidacionItem[];
  itemsPropietario: LiquidacionItem[];
  montoAlquiler: number,
  total: number;
  estado?: 'borrador' | 'emitida' | 'enviada';
  honorarios: number
}
export interface LiquidacionItem {
  descripcion: string;
  monto: number;
  montoTexto: string;
}

