type ContractStatus =
  | 'preliminar'     // aún no válido
  | 'activo'    // en curso
  | 'finalizado'  // terminó normalmente
  | 'cancelado' // terminó antes
  | 'renovar' // de me ocurrió como concepto de actualización para la notificación de cobro? 

export interface IContrato {
    id: number;
 
    inquilinoId: number;
    inmuebleId: number;
    propietarioId: number;

    fechaInicio: Date;
    fechaFin: Date;

    estado: ContractStatus;
    rentaMensual: number;
}