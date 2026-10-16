export type EstadoServicioLiquidacion =
  | 'no-requerido'
  | 'pendiente'
  | 'cargado';

export interface SeguimientoEGLAI {
  expensas: EstadoServicioLiquidacion;
  gas: EstadoServicioLiquidacion;
  luz: EstadoServicioLiquidacion;
  agua: EstadoServicioLiquidacion;
  internet: EstadoServicioLiquidacion;
}
