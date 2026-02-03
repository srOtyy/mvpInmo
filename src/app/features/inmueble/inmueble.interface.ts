import { CaracteristicaEntidad, IEntityBase } from '../../shared/entity-base.interface';

export interface IInmueble extends IEntityBase {}

export interface caracteristicasInmueble extends CaracteristicaEntidad {}

export interface definicionCaracteristicaInmueble {
  clave: string;
  tipo: 'string' | 'number' | 'boolean';
  requerido: boolean;
}
