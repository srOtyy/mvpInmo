import { SeguimientoEGLAI } from '../contrato/eglai.interface';
export interface Liquidacion {
  id: number;
  contratoId: number;
  propietarioNombre: string;
  inquilinoNombre: string;
  inmuebleId: number;
  periodo: string;
  fechaGeneracion: Date; //se puede borrar. No se usa
  itemsInquilino: LiquidacionItem[];
  itemsPropietario: LiquidacionItem[];
  montoAlquiler: number;
  total: number;
  estado?: 'borrador' | 'emitida' | 'enviada'; //se puede borrar. No se usa
  honorarios: number;
  inicioDelPeriodo: number;
  EGLAI: SeguimientoEGLAI;
}
export interface LiquidacionItem {
  descripcion: string;
  monto: number;
  montoTexto: string;
}
