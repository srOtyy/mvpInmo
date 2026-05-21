export interface Liquidacion {
  id: string;
  contratoId: string;
  propietarioNombre: string;
  inquilinoNombre: string;
  periodo: string;
  fechaGeneracion: Date;
  items: LiquidacionItem[];
  total: number;
  estado?: 'borrador' | 'emitida' | 'enviada';
}
export interface LiquidacionItem {
  descripcion: string;

  monto: number;

  tipo:
    | 'alquiler'
    | 'expensas'
    | 'servicio'
    | 'ajuste'
    | 'multa';
}

