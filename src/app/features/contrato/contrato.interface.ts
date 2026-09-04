export type ContractStatus =
  | 'preliminar' // aún no válido
  | 'activo' // en curso
  | 'finalizado' // terminó normalmente
  | 'cancelado' // terminó antes
  | 'renovar';

export type EstadoRenovacion =
  | 'un_mes'
  | 'dos_meses'
  | 'normal'
  | 'vencido'
  | 'hoy'
  | 'porFinalizar';

export type TipoPago = 'efectivo' | 'transferencia';

export type InformacionAdicional = {
  titulo: string;
  valor: string;
};
export type tipoIndice = 'IPC' | 'ICL';

export interface IContrato {
  id: number;
  inquilinoId: number;
  inmuebleId: number;
  propietarioId: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: ContractStatus;
  estadoRenovacion: EstadoRenovacion;
  rentaMensual: number;
  periodoAumento: number;
  registroActividad?: string[];
  informacionAdicional?: InformacionAdicional[];
  titulo?: string;
  proximoAumento: Date;
  porcentajeHonorarios: number;
  tipoPago: TipoPago;
  tipoIndice: tipoIndice;
  inicioDelPeriodo?: number;
  administracionTotal: boolean;
  diasFinalizacion: number;
  porFinalizar: boolean;
  requiereAccion: boolean;
}
export interface IContratoVista extends IContrato {
  propietarioNombre: string;
}
