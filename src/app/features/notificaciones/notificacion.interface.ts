export interface INotificacion {
    id: number;
    contratoId: number;

    fecha: Date;
    tipo:  'vencimiento' | 'recordatorio';
    mensaje: string;

    estado: 'pendiente' | 'completada' ;
}